/**
 * Retry Service for FBR Submission Error Recovery
 *
 * Implements exponential backoff retry mechanism for failed FBR submissions
 * according to SRO 69(I)/2025 compliance requirements.
 */

import { prisma } from '@/lib/database'
import { PRALAPIClient } from '@/lib/fbr-pral-client'
import { generateFBRQRCode, validateQRCodeData } from '@/lib/qr-generator'
import {
  retryMonitoring,
  logRetryAttempt,
  logRetrySuccess,
  logRetryFailure,
  logRetryDisabled,
  logLockTimeout
} from '@/lib/retry-monitoring'
import { fbrTokenManager, getValidFbrToken } from '@/lib/fbr-token-manager'

// Error categorization types
export enum ErrorType {
  TRANSIENT = 'TRANSIENT',      // Temporary errors that can be retried
  PERMANENT = 'PERMANENT',      // Permanent errors that shouldn't be retried
  TOKEN_EXPIRED = 'TOKEN_EXPIRED', // Token expiration errors
  VALIDATION = 'VALIDATION',    // Data validation errors
  NETWORK = 'NETWORK',          // Network connectivity issues
  RATE_LIMIT = 'RATE_LIMIT',    // API rate limiting
  UNKNOWN = 'UNKNOWN'           // Unclassified errors
}

// Retry processing timeout (5 minutes)
const RETRY_PROCESSING_TIMEOUT_MS = 5 * 60 * 1000

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
 * Categorize error type based on error message and code
 */
export function categorizeError(errorMessage: string, errorCode?: string): ErrorType {
  const lowerError = errorMessage.toLowerCase()
  
  // Token expiration errors
  if (lowerError.includes('token') &&
      (lowerError.includes('expired') || lowerError.includes('invalid') || lowerError.includes('unauthorized'))) {
    return ErrorType.TOKEN_EXPIRED
  }
  
  // Network errors
  if (lowerError.includes('network') ||
      lowerError.includes('timeout') ||
      lowerError.includes('connection') ||
      lowerError.includes('econnrefused') ||
      lowerError.includes('enotfound')) {
    return ErrorType.NETWORK
  }
  
  // Rate limiting errors
  if (lowerError.includes('rate limit') ||
      lowerError.includes('too many requests') ||
      lowerError.includes('quota exceeded')) {
    return ErrorType.RATE_LIMIT
  }
  
  // Validation errors
  if (lowerError.includes('validation') ||
      lowerError.includes('invalid') ||
      lowerError.includes('required') ||
      lowerError.includes('missing') ||
      errorCode?.startsWith('VAL')) {
    return ErrorType.VALIDATION
  }
  
  // Permanent errors (HTTP 4xx errors except rate limiting)
  if (errorCode &&
      (errorCode.startsWith('4') && !errorCode.startsWith('429'))) {
    return ErrorType.PERMANENT
  }
  
  // Default to transient for server errors and unknown issues
  return ErrorType.TRANSIENT
}

/**
 * Check if invoice is eligible for retry
 */
export async function isEligibleForRetry(invoiceId: string): Promise<boolean> {
  // Use raw SQL to check eligibility since we can't regenerate Prisma client
  const result = await prisma.$queryRaw<any[]>`
    SELECT
      status, retry_count, max_retries, retry_enabled,
      fbr_submitted, fbr_validated, fbr_error_message, fbr_error_code
    FROM invoices
    WHERE id = ${invoiceId}
  `
  
  if (!result || result.length === 0) return false
  
  const invoice = result[0]
  
  // Check if error is permanent (non-retriable)
  if (invoice.fbr_error_message && invoice.fbr_error_code) {
    const errorType = categorizeError(invoice.fbr_error_message, invoice.fbr_error_code)
    if (errorType === ErrorType.PERMANENT || errorType === ErrorType.VALIDATION) {
      return false
    }
  }

  return (
    invoice.status === 'FAILED' &&
    invoice.retry_enabled &&
    invoice.retry_count < invoice.max_retries &&
    !invoice.fbr_submitted &&
    !invoice.fbr_validated
  )
}

/**
 * Get all invoices ready for retry with database-level locking
 */
export async function getInvoicesReadyForRetry(): Promise<string[]> {
  // Use raw SQL with SELECT FOR UPDATE to implement database-level locking
  // This prevents race conditions by locking selected rows
  const result = await prisma.$queryRaw<any[]>`
    WITH eligible_invoices AS (
      SELECT id
      FROM invoices
      WHERE
        status = 'FAILED'
        AND retry_enabled = true
        AND fbr_submitted = false
        AND fbr_validated = false
        AND retry_count < max_retries
        AND (next_retry_at IS NULL OR next_retry_at <= NOW())
        AND id NOT IN (
          -- Exclude invoices that are being processed
          SELECT id FROM invoices
          WHERE retry_processing = true
          AND retry_processing_since > NOW() - INTERVAL '5 minutes'
        )
      ORDER BY last_retry_at ASC NULLS FIRST
      LIMIT 10
      FOR UPDATE SKIP LOCKED
    )
    UPDATE invoices
    SET
      retry_processing = true,
      retry_processing_since = NOW()
    WHERE id IN (SELECT id FROM eligible_invoices)
    RETURNING id
  `
  
  return result.map(row => row.id)
}

/**
 * Release processing lock for an invoice
 */
export async function releaseRetryProcessingLock(invoiceId: string): Promise<void> {
  await prisma.$executeRaw`
    UPDATE invoices
    SET
      retry_processing = false,
      retry_processing_since = NULL
    WHERE id = ${invoiceId}
  `
}

/**
 * Retry a failed FBR submission with proper error handling and categorization
 */
export async function retryFBRSubmission(invoiceId: string): Promise<{
  success: boolean
  message: string
  fbrInvoiceNumber?: string
  error?: string
  errorType?: ErrorType
}> {
  const startTime = Date.now()
  
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
    
    // Log retry attempt
    await logRetryAttempt(
      invoiceId,
      invoice.invoiceNumber,
      invoice.retryCount + 1,
      invoice.businessId
    )

    // Check for FBR credentials and get valid token
    const environment = invoice.mode.toLowerCase() as 'sandbox' | 'production'
    
    // Get a valid token using the token manager
    const tokenResult = await getValidFbrToken(invoiceId)
    
    if (!tokenResult.success || !tokenResult.token) {
      // Update retry count and schedule next retry
      await prisma.$executeRaw`
        UPDATE invoices
        SET
          retry_count = retry_count + 1,
          last_retry_at = NOW(),
          next_retry_at = ${calculateNextRetryTime(invoice.retryCount + 1)},
          fbr_error_message = ${tokenResult.error || 'FBR token not available'},
          retry_processing = false,
          retry_processing_since = NULL
        WHERE id = ${invoiceId}
      `

      return {
        success: false,
        message: tokenResult.error || 'FBR token not available',
        error: 'NO_TOKEN',
        errorType: ErrorType.TOKEN_EXPIRED
      }
    }
    
    const token = tokenResult.token

    // Initialize PRAL client
    const pralClient = new PRALAPIClient({
      environment,
      bearerToken: token
    })

    // Format invoice for PRAL API
    const pralInvoice = {
      InvoiceType: invoice.documentType as 'Sale Invoice' | 'Debit Note',
      InvoiceDate: invoice.invoiceDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      
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
      fbrResponse = await pralClient.postInvoice(pralInvoice as any)
      
      // Check validation status
      if (fbrResponse.ValidationResponse.StatusCode !== '00') {
        const errorMessage = fbrResponse.ValidationResponse.Error || 'Validation failed'
        const errorCode = fbrResponse.ValidationResponse.ErrorCode || 'UNKNOWN'
        const errorType = categorizeError(errorMessage, errorCode)
        
        // Determine if we should retry based on error type
        const shouldRetry = errorType === ErrorType.TRANSIENT ||
                           errorType === ErrorType.NETWORK ||
                           errorType === ErrorType.RATE_LIMIT ||
                           errorType === ErrorType.TOKEN_EXPIRED
        
        // Update invoice with error information
        await prisma.$executeRaw`
          UPDATE invoices
          SET
            retry_count = retry_count + 1,
            last_retry_at = NOW(),
            next_retry_at = ${shouldRetry ? calculateNextRetryTime(invoice.retryCount + 1) : null},
            fbr_error_code = ${errorCode},
            fbr_error_message = ${errorMessage},
            retry_enabled = ${shouldRetry},
            retry_processing = false,
            retry_processing_since = NULL
          WHERE id = ${invoiceId}
        `
        
        // Log retry failure
        await logRetryFailure(
          invoiceId,
          invoice.invoiceNumber,
          invoice.retryCount + 1,
          invoice.businessId,
          errorType,
          errorMessage
        )

        return {
          success: false,
          message: 'FBR validation failed',
          error: errorMessage,
          errorType
        }
      }

      console.log(`✅ Retry successful for invoice ${invoice.invoiceNumber}`)

    } catch (apiError: any) {
      console.error('FBR API Error during retry:', apiError)
      
      const errorMessage = apiError.message || 'API communication failed'
      const errorType = categorizeError(errorMessage)
      
      // Handle token expiration specifically
      if (errorType === ErrorType.TOKEN_EXPIRED) {
        // Try to refresh the token
        const tokenRefreshResult = await fbrTokenManager.handleTokenExpiration(invoiceId)
        
        if (tokenRefreshResult.success) {
          // Token refreshed successfully, but we still need to retry the submission
          // Update retry count but don't increment it too much for token issues
          await prisma.$executeRaw`
            UPDATE invoices
            SET
              last_retry_at = NOW(),
              next_retry_at = NOW(),
              fbr_error_message = 'Token refreshed, will retry',
              retry_processing = false,
              retry_processing_since = NULL
            WHERE id = ${invoiceId}
          `
          
          return {
            success: false,
            message: 'Token refreshed, will retry',
            error: 'TOKEN_REFRESHED',
            errorType
          }
        }
      }
      
      // Determine if we should retry based on error type
      const shouldRetry = errorType === ErrorType.TRANSIENT ||
                         errorType === ErrorType.NETWORK ||
                         errorType === ErrorType.RATE_LIMIT ||
                         errorType === ErrorType.TOKEN_EXPIRED
      
      // Increment retry count and schedule next retry
      await prisma.$executeRaw`
        UPDATE invoices
        SET
          retry_count = retry_count + 1,
          last_retry_at = NOW(),
          next_retry_at = ${shouldRetry ? calculateNextRetryTime(invoice.retryCount + 1) : null},
          fbr_error_message = ${errorMessage},
          retry_enabled = ${shouldRetry},
          retry_processing = false,
          retry_processing_since = NULL
        WHERE id = ${invoiceId}
      `
      
      // Log retry failure
      await logRetryFailure(
        invoiceId,
        invoice.invoiceNumber,
        invoice.retryCount + 1,
        invoice.businessId,
        errorType,
        errorMessage
      )

      return {
        success: false,
        message: 'FBR API communication failed',
        error: errorMessage,
        errorType
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
          invoiceDate: invoice.invoiceDate?.toISOString() || new Date().toISOString(),
          totalAmount: invoice.totalAmount,
          buyerNTN: invoice.customer?.ntnNumber || undefined,
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
    await prisma.$executeRaw`
      UPDATE invoices
      SET
        status = ${environment === 'production' ? 'PUBLISHED' : 'VALIDATED'},
        fbr_submitted = true,
        fbr_validated = true,
        submission_timestamp = NOW(),
        fbr_invoice_number = ${fbrResponse.InvoiceNumber || null},
        fbr_timestamp = ${fbrResponse.Dated ? new Date(fbrResponse.Dated) : null},
        fbr_transaction_id = ${fbrResponse.TransmissionId || null},
        fbr_response_data = ${JSON.stringify(fbrResponse)},
        qr_code = ${qrCodeBase64},
        qr_code_data = ${qrCodeData},
        synced_at = NOW(),
        retry_count = retry_count + 1,
        last_retry_at = NOW(),
        next_retry_at = NULL,
        fbr_error_code = NULL,
        fbr_error_message = NULL,
        retry_processing = false,
        retry_processing_since = NULL
      WHERE id = ${invoiceId}
    `

    // Log retry success
    await logRetrySuccess(
      invoiceId,
      invoice.invoiceNumber,
      invoice.retryCount + 1,
      invoice.businessId,
      Date.now() - startTime
    )
    
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
        await prisma.$executeRaw`
          UPDATE invoices
          SET
            retry_count = retry_count + 1,
            last_retry_at = NOW(),
            next_retry_at = ${calculateNextRetryTime(invoice.retryCount + 1)},
            fbr_error_message = ${error.message || 'Unknown error'},
            retry_processing = false,
            retry_processing_since = NULL
          WHERE id = ${invoiceId}
        `
      }
    } catch (updateError) {
      console.error('Error updating retry count:', updateError)
    }

    const errorMessage = error.message || 'Unknown error'
    const errorType = categorizeError(errorMessage)
    
    // Get invoice details for logging
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        select: { invoiceNumber: true, businessId: true, retryCount: true }
      })
      
      if (invoice) {
        await logRetryFailure(
          invoiceId,
          invoice.invoiceNumber,
          invoice.retryCount + 1,
          invoice.businessId,
          errorType,
          errorMessage
        )
      }
    } catch (logError) {
      console.error('Error logging retry failure:', logError)
    }
    
    return {
      success: false,
      message: 'Error during retry',
      error: errorMessage,
      errorType
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
  errors: Array<{ invoiceId: string; error: string; errorType?: ErrorType }>
}> {
  const invoiceIds = await getInvoicesReadyForRetry()
  
  let succeeded = 0
  let failed = 0
  const errors: Array<{ invoiceId: string; error: string; errorType?: ErrorType }> = []

  for (const invoiceId of invoiceIds) {
    try {
      const result = await retryFBRSubmission(invoiceId)
      if (result.success) {
        succeeded++
        console.log(`✅ Retry successful for invoice ${invoiceId}`)
      } else {
        failed++
        console.error(`❌ Retry failed for invoice ${invoiceId}:`, result.error)
        errors.push({
          invoiceId,
          error: result.error || 'Unknown error',
          errorType: result.errorType
        })
      }
    } catch (error: any) {
      failed++
      const errorMessage = error.message || 'Unknown error'
      console.error(`❌ Unexpected error processing invoice ${invoiceId}:`, errorMessage)
      errors.push({
        invoiceId,
        error: errorMessage,
        errorType: categorizeError(errorMessage)
      })
      
      // Release processing lock on unexpected errors
      await releaseRetryProcessingLock(invoiceId).catch(e =>
        console.error(`Failed to release processing lock for ${invoiceId}:`, e)
      )
    }
  }

  return {
    processed: invoiceIds.length,
    succeeded,
    failed,
    errors
  }
}

/**
 * Reset retry count for an invoice (manual intervention)
 */
export async function resetRetryCount(invoiceId: string): Promise<boolean> {
  try {
    await prisma.$executeRaw`
      UPDATE invoices
      SET
        retry_count = 0,
        next_retry_at = NOW(),
        retry_enabled = true,
        retry_processing = false,
        retry_processing_since = NULL
      WHERE id = ${invoiceId}
    `
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
    // Get invoice details for logging
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { invoiceNumber: true, businessId: true, retryCount: true }
    })
    
    await prisma.$executeRaw`
      UPDATE invoices
      SET
        retry_enabled = false,
        next_retry_at = NULL,
        retry_processing = false,
        retry_processing_since = NULL
      WHERE id = ${invoiceId}
    `
    
    // Log retry disabled
    if (invoice) {
      await logRetryDisabled(
        invoiceId,
        invoice.invoiceNumber,
        invoice.retryCount,
        invoice.businessId
      )
    }
    
    return true
  } catch (error) {
    console.error('Error disabling retry:', error)
    return false
  }
}

/**
 * Clean up stuck retry processing locks (for recovery)
 * This should be called periodically to clean up abandoned processing locks
 */
export async function cleanupStuckRetryLocks(): Promise<number> {
  try {
    // Get invoices with stuck locks for logging
    const stuckInvoices = await prisma.$queryRaw<any[]>`
      SELECT id, invoice_number, business_id, retry_count
      FROM invoices
      WHERE
        retry_processing = true
        AND retry_processing_since < NOW() - INTERVAL '5 minutes'
    `
    
    // Log lock timeouts
    for (const invoice of stuckInvoices) {
      await logLockTimeout(
        invoice.id,
        invoice.invoice_number,
        invoice.retry_count,
        invoice.business_id
      )
    }
    
    // Release the locks
    const result = await prisma.$executeRaw`
      UPDATE invoices
      SET
        retry_processing = false,
        retry_processing_since = NULL
      WHERE
        retry_processing = true
        AND retry_processing_since < NOW() - INTERVAL '5 minutes'
    `
    
    if (result > 0) {
      console.log(`🔓 Cleaned up ${result} stuck retry processing locks`)
    }
    
    return result
  } catch (error) {
    console.error('Error cleaning up stuck retry locks:', error)
    return 0
  }
}
