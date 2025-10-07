/**
 * Retry Service for FBR Submission Error Recovery
 * 
 * Implements exponential backoff retry mechanism for failed FBR submissions
 * according to SRO 69(I)/2025 compliance requirements.
 */

import { prisma } from '@/lib/database'
import { PRALAPIClient } from '@/lib/fbr-pral-client'
import { generateFBRQRCode, validateQRCodeData } from '@/lib/qr-generator'

interface RetryConfig {
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 5000, // 5 seconds
  maxDelayMs: 300000, // 5 minutes
  backoffMultiplier: 2
}

/**
 * Calculate next retry time using exponential backoff
 */
export function calculateNextRetryTime(
  retryCount: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Date {
  const delayMs = Math.min(
    config.initialDelayMs * Math.pow(config.backoffMultiplier, retryCount),
    config.maxDelayMs
  )
  
  return new Date(Date.now() + delayMs)
}

/**
 * Check if invoice is eligible for retry
 */
export async function isEligibleForRetry(invoiceId: string): Promise<boolean> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: {
      status: true,
      retryCount: true,
      maxRetries: true,
      retryEnabled: true,
      fbrSubmitted: true,
      fbrValidated: true
    }
  })

  if (!invoice) return false

  return (
    invoice.status === 'FAILED' &&
    invoice.retryEnabled &&
    invoice.retryCount < invoice.maxRetries &&
    !invoice.fbrSubmitted &&
    !invoice.fbrValidated
  )
}

/**
 * Get all invoices ready for retry
 */
export async function getInvoicesReadyForRetry(): Promise<string[]> {
  const invoices = await prisma.invoice.findMany({
    where: {
      status: 'FAILED',
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      retryCount: {
        lt: prisma.invoice.fields.maxRetries
      },
      OR: [
        { nextRetryAt: null },
        { nextRetryAt: { lte: new Date() } }
      ]
    },
    select: { id: true },
    take: 10 // Process 10 at a time
  })

  return invoices.map(inv => inv.id)
}

/**
 * Retry a failed FBR submission
 */
export async function retryFBRSubmission(invoiceId: string): Promise<{
  success: boolean
  message: string
  fbrInvoiceNumber?: string
  error?: string
}> {
  try {
    // Check eligibility
    const eligible = await isEligibleForRetry(invoiceId)
    if (!eligible) {
      return {
        success: false,
        message: 'Invoice is not eligible for retry',
        error: 'NOT_ELIGIBLE'
      }
    }

    // Get invoice with all data
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        items: true,
        customer: true,
        business: true
      }
    })

    if (!invoice) {
      return {
        success: false,
        message: 'Invoice not found',
        error: 'NOT_FOUND'
      }
    }

    // Check for FBR credentials
    const environment = invoice.mode.toLowerCase() as 'sandbox' | 'production'
    const token = environment === 'sandbox' 
      ? (process.env.FBR_SANDBOX_TOKEN || invoice.business.sandboxToken)
      : invoice.business.productionToken

    if (!token) {
      // Update retry count and schedule next retry
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          retryCount: { increment: 1 },
          lastRetryAt: new Date(),
          nextRetryAt: calculateNextRetryTime(invoice.retryCount + 1),
          fbrErrorMessage: 'FBR token not configured'
        }
      })

      return {
        success: false,
        message: 'FBR token not configured',
        error: 'NO_TOKEN'
      }
    }

    // Initialize PRAL client
    const pralClient = new PRALAPIClient({
      environment,
      bearerToken: token
    })

    // Format invoice for PRAL API
    const pralInvoice = {
      InvoiceType: invoice.documentType as 'Sale Invoice' | 'Debit Note',
      InvoiceDate: invoice.invoiceDate.toISOString().split('T')[0],
      
      // Seller information
      SellerNTNCNIC: invoice.business.ntnNumber,
      SellerBusinessName: invoice.business.companyName,
      SellerProvince: invoice.business.province,
      SellerAddress: invoice.business.address,
      
      // Buyer information
      BuyerNTNCNIC: invoice.customer?.ntnNumber || undefined,
      BuyerBusinessName: invoice.customer?.name || 'Walk-in Customer',
      BuyerProvince: invoice.customer?.buyerProvince || invoice.business.province,
      BuyerAddress: invoice.customer?.address || 'N/A',
      BuyerRegistrationType: invoice.customer?.ntnNumber ? 'Registered' as const : 'Unregistered' as const,
      
      // Reference
      InvoiceRefNo: invoice.referenceInvoiceNo || undefined,
      ScenarioId: invoice.scenarioId || undefined,
      
      // Line items
      Items: invoice.items.map(item => ({
        HSCode: item.hsCode,
        ProductDescription: item.description,
        Rate: `${item.taxRate}%`,
        UOM: item.unitOfMeasurement,
        Quantity: item.quantity,
        TotalValues: item.totalValue,
        ValueSalesExcludingST: item.valueSalesExcludingST,
        FixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice,
        SalesTaxApplicable: item.salesTaxApplicable,
        SalesTaxWithheldAtSource: item.salesTaxWithheldAtSource,
        ExtraTax: item.extraTax || 0,
        FurtherTax: item.furtherTax || 0,
        FEDPayable: item.fedPayable || 0,
        Discount: item.discount || 0,
        SaleType: 'Standard',
        SROScheduleNo: item.sroScheduleNo || undefined,
        SROItemSerialNo: item.sroItemSerialNo || undefined
      }))
    }

    console.log(`🔄 Retry attempt ${invoice.retryCount + 1} for invoice ${invoice.invoiceNumber}`)

    // Submit to FBR
    let fbrResponse
    try {
      fbrResponse = await pralClient.postInvoice(pralInvoice)
      
      // Check validation status
      if (fbrResponse.ValidationResponse.StatusCode !== '00') {
        // Submission failed - increment retry count
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            retryCount: { increment: 1 },
            lastRetryAt: new Date(),
            nextRetryAt: calculateNextRetryTime(invoice.retryCount + 1),
            fbrErrorCode: fbrResponse.ValidationResponse.ErrorCode,
            fbrErrorMessage: fbrResponse.ValidationResponse.Error || 'Validation failed'
          }
        })

        return {
          success: false,
          message: 'FBR validation failed',
          error: fbrResponse.ValidationResponse.Error || 'Unknown error'
        }
      }

      console.log(`✅ Retry successful for invoice ${invoice.invoiceNumber}`)

    } catch (apiError: any) {
      console.error('FBR API Error during retry:', apiError)
      
      // Increment retry count and schedule next retry
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          retryCount: { increment: 1 },
          lastRetryAt: new Date(),
          nextRetryAt: calculateNextRetryTime(invoice.retryCount + 1),
          fbrErrorMessage: apiError.message || 'API communication failed'
        }
      })

      return {
        success: false,
        message: 'FBR API communication failed',
        error: apiError.message
      }
    }

    // Generate QR code
    let qrCodeBase64: string | null = null
    let qrCodeData: string | null = null
    
    if (fbrResponse.InvoiceNumber) {
      try {
        const qrData = {
          fbrInvoiceNumber: fbrResponse.InvoiceNumber,
          sellerNTN: invoice.business.ntnNumber,
          invoiceDate: invoice.invoiceDate.toISOString(),
          totalAmount: invoice.totalAmount,
          buyerNTN: invoice.customer?.ntnNumber,
          fbrTimestamp: fbrResponse.Dated
        }
        
        validateQRCodeData(qrData)
        qrCodeBase64 = await generateFBRQRCode(qrData)
        qrCodeData = JSON.stringify(qrData)
        
        console.log('✅ QR Code generated for retried invoice')
      } catch (qrError) {
        console.error('⚠️ Failed to generate QR code:', qrError)
      }
    }

    // Update invoice with success
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: environment === 'production' ? 'PUBLISHED' : 'VALIDATED',
        fbrSubmitted: true,
        fbrValidated: true,
        submissionTimestamp: new Date(),
        fbrInvoiceNumber: fbrResponse.InvoiceNumber || null,
        fbrTimestamp: fbrResponse.Dated ? new Date(fbrResponse.Dated) : null,
        fbrTransactionId: fbrResponse.TransmissionId || null,
        fbrResponseData: JSON.stringify(fbrResponse),
        qrCode: qrCodeBase64,
        qrCodeData: qrCodeData,
        syncedAt: new Date(),
        retryCount: { increment: 1 },
        lastRetryAt: new Date(),
        nextRetryAt: null, // Clear next retry
        fbrErrorCode: null, // Clear error
        fbrErrorMessage: null // Clear error
      }
    })

    return {
      success: true,
      message: 'Invoice successfully submitted to FBR',
      fbrInvoiceNumber: fbrResponse.InvoiceNumber || undefined
    }

  } catch (error: any) {
    console.error('Error in retryFBRSubmission:', error)
    
    // Update retry count
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        select: { retryCount: true }
      })
      
      if (invoice) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            retryCount: { increment: 1 },
            lastRetryAt: new Date(),
            nextRetryAt: calculateNextRetryTime(invoice.retryCount + 1),
            fbrErrorMessage: error.message || 'Unknown error'
          }
        })
      }
    } catch (updateError) {
      console.error('Error updating retry count:', updateError)
    }

    return {
      success: false,
      message: 'Error during retry',
      error: error.message
    }
  }
}

/**
 * Process all pending retries (background job)
 */
export async function processAllPendingRetries(): Promise<{
  processed: number
  succeeded: number
  failed: number
}> {
  const invoiceIds = await getInvoicesReadyForRetry()
  
  let succeeded = 0
  let failed = 0

  for (const invoiceId of invoiceIds) {
    const result = await retryFBRSubmission(invoiceId)
    if (result.success) {
      succeeded++
    } else {
      failed++
    }
  }

  return {
    processed: invoiceIds.length,
    succeeded,
    failed
  }
}

/**
 * Reset retry count for an invoice (manual intervention)
 */
export async function resetRetryCount(invoiceId: string): Promise<boolean> {
  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        retryCount: 0,
        nextRetryAt: new Date(), // Schedule immediate retry
        retryEnabled: true
      }
    })
    return true
  } catch (error) {
    console.error('Error resetting retry count:', error)
    return false
  }
}

/**
 * Disable retry for an invoice (manual intervention)
 */
export async function disableRetry(invoiceId: string): Promise<boolean> {
  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        retryEnabled: false,
        nextRetryAt: null
      }
    })
    return true
  } catch (error) {
    console.error('Error disabling retry:', error)
    return false
  }
}
