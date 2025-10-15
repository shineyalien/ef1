import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'
import { PRALAPIClient } from '@/lib/fbr-integration'
import { generateFBRQRCode, validateQRCodeData } from '@/lib/qr-generator'

// POST /api/invoices/[id]/submit - Submit invoice to FBR
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await params in Next.js 15
    const params = await context.params
    const body = await request.json()
    const { environment = 'sandbox' } = body

    // Get the invoice with all related data
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        customer: true,
        business: {
          include: {
            user: true
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Verify ownership
    if (invoice.business.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if invoice can be submitted
    if (invoice.status === 'PUBLISHED') {
      return NextResponse.json({ 
        error: 'Invoice already published to production' 
      }, { status: 400 })
    }

    // Check if we have FBR credentials
    const sandboxToken = process.env.FBR_SANDBOX_TOKEN || invoice.business.sandboxToken
    const productionToken = invoice.business.productionToken

    if (!sandboxToken && environment === 'sandbox') {
      return NextResponse.json({ 
        error: 'FBR Sandbox token not configured' 
      }, { status: 400 })
    }

    if (!productionToken && environment === 'production') {
      return NextResponse.json({ 
        error: 'FBR Production token not configured. Please validate in sandbox first.' 
      }, { status: 400 })
    }

    // For production, require sandbox validation first
    if (environment === 'production' && !invoice.fbrValidated) {
      return NextResponse.json({ 
        error: 'Invoice must be validated in sandbox before publishing to production' 
      }, { status: 400 })
    }

    // Initialize PRAL client
    const pralClient = new PRALAPIClient({
      environment: environment as 'sandbox' | 'production',
      bearerToken: environment === 'sandbox' ? sandboxToken! : productionToken!
    })

    // Format invoice for PRAL API (camelCase for production)
    const pralInvoice = {
      invoiceType: invoice.documentType as 'Sale Invoice' | 'Debit Note',
      invoiceDate: invoice.invoiceDate.toISOString().split('T')[0] as string,
      
      // Seller information
      sellerNTNCNIC: invoice.business.ntnNumber,
      sellerBusinessName: invoice.business.companyName,
      sellerProvince: invoice.business.province,
      sellerAddress: invoice.business.address,
      
      // Buyer information (FBR production compliant)
      buyerNTNCNIC: invoice.fbrBuyerNTN || invoice.customer?.ntnNumber || invoice.customer?.buyerNTN || invoice.customer?.buyerCNIC || invoice.customer?.buyerPassport || undefined,
      buyerBusinessName: invoice.customer?.name || 'Walk-in Customer',
      buyerProvince: invoice.fbrBuyerProvince || invoice.customer?.buyerProvince || invoice.business.province,
      buyerAddress: invoice.fbrBuyerAddress || invoice.customer?.address || 'N/A',
      buyerRegistrationType: invoice.fbrBuyerNTN || invoice.customer?.ntnNumber ? 'Registered' as const : 'Unregistered' as const,
      
      // Reference for debit notes
      invoiceRefNo: invoice.referenceInvoiceNo || undefined,
      scenarioId: invoice.scenarioId || undefined,
      
      // Line items (camelCase - FBR production compliant)
      items: invoice.items.map(item => ({
        hsCode: item.hsCode,
        productDescription: item.description,
        rate: `${item.taxRate}%`,
        uoM: item.unitOfMeasurement,
        quantity: item.quantity,
        totalValues: item.totalValue,
        valueSalesExcludingST: item.valueSalesExcludingST,
        fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice,
        salesTaxApplicable: item.salesTaxApplicable,
        salesTaxWithheldAtSource: item.salesTaxWithheldAtSource,
        extraTax: item.extraTax || 0,
        furtherTax: item.furtherTax || 0,
        fedPayable: item.fedPayable || 0,
        discount: item.discount || 0,
        saleType: item.fbrSaleType || mapToFBRSaleType(item.saleType, item.taxRate), // Map to FBR format
        sroScheduleNo: item.sroScheduleNo || undefined,
        sroItemSerialNo: item.sroItemSerialNo || undefined
      }))
    }

    console.log('Submitting invoice to FBR:', {
      environment,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber
    })

    // Submit to FBR - REAL API ENABLED
    let fbrResponse
    try {
      fbrResponse = await pralClient.submitInvoice(pralInvoice)
      
      // Check if submission was successful (camelCase response)
      if (fbrResponse.validationResponse?.statusCode !== '00') {
        return NextResponse.json({
          error: 'FBR validation failed',
          details: fbrResponse.validationResponse?.error || 'Unknown validation error',
          errorCode: fbrResponse.validationResponse?.errorCode
        }, { status: 400 })
      }
      
      console.log('FBR submission successful:', {
        invoiceNumber: fbrResponse.invoiceNumber,
        status: fbrResponse.validationResponse?.status
      })
    } catch (error: any) {
      console.error('FBR API Error:', error)
      return NextResponse.json({
        error: 'Failed to submit to FBR',
        details: error.message || 'FBR API communication failed',
        hint: 'Check your FBR token and network connection'
      }, { status: 500 })
    }

    // Generate QR code using FBR-provided IRN
    let qrCodeBase64: string | null = null
    let qrCodeData: string | null = null
    
    if (fbrResponse.invoiceNumber) {
      try {
        // Prepare QR code data
        const qrData = {
          fbrInvoiceNumber: fbrResponse.invoiceNumber,
          sellerNTN: invoice.business.ntnNumber,
          invoiceDate: invoice.invoiceDate.toISOString(),
          totalAmount: invoice.totalAmount,
          buyerNTN: invoice.customer?.ntnNumber || undefined,
          fbrTimestamp: fbrResponse.dated
        }
        
        // Validate QR data
        validateQRCodeData(qrData)
        
        // Generate QR code as base64 PNG (for storage and PDF)
        qrCodeBase64 = await generateFBRQRCode(qrData)
        
        // Store raw data for future reference
        qrCodeData = JSON.stringify(qrData)
        
        console.log('✅ QR Code generated successfully using FBR IRN:', fbrResponse.invoiceNumber)
      } catch (qrError) {
        console.error('⚠️ Failed to generate QR code:', qrError)
        // Continue without QR code - don't fail the entire submission
      }
    }

    // Update invoice with FBR response and QR code
    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        fbrSubmitted: true,
        fbrValidated: true,
        submissionTimestamp: new Date(),
        fbrInvoiceNumber: fbrResponse.invoiceNumber || null,
        fbrTimestamp: fbrResponse.dated ? new Date(fbrResponse.dated) : null,
        fbrTransactionId: fbrResponse.transmissionId || null,
        fbrResponseData: JSON.stringify(fbrResponse),
        qrCode: qrCodeBase64, // Base64 PNG QR code
        qrCodeData: qrCodeData, // Raw QR data as JSON
        status: environment === 'production' ? 'PUBLISHED' : 'VALIDATED',
        mode: environment.toUpperCase() as 'SANDBOX' | 'PRODUCTION',
        syncedAt: new Date()
      },
      include: {
        items: true,
        customer: true
      }
    })

    return NextResponse.json({
      message: `Invoice successfully submitted to FBR ${environment}`,
      fbrInvoiceNumber: fbrResponse.invoiceNumber,
      fbrTimestamp: fbrResponse.dated || (fbrResponse as any).dated,
      qrCode: qrCodeBase64,
      invoice: updatedInvoice
    })
  } catch (error: any) {
    console.error('Error submitting to FBR:', error)
    
    // Update invoice with error and setup retry
    try {
      const params = await context.params
      
      // Calculate next retry time (exponential backoff)
      const initialDelayMs = 5000 // 5 seconds
      const nextRetryAt = new Date(Date.now() + initialDelayMs)
      
      await prisma.invoice.update({
        where: { id: params.id },
        data: {
          status: 'FAILED',
          fbrErrorMessage: error.message || 'Unknown error',
          fbrErrorCode: error.code || 'ERR_UNKNOWN',
          retryCount: 0, // Reset retry count for new failure
          retryEnabled: true, // Enable automatic retry
          nextRetryAt: nextRetryAt // Schedule first retry
        }
      })
    } catch (updateError) {
      console.error('Error updating invoice with error:', updateError)
    }

    return NextResponse.json({ 
      error: 'Failed to submit to FBR',
      details: error.message,
      retryInfo: 'Automatic retry has been enabled for this invoice'
    }, { status: 500 })
  }
}

// Helper function to map internal sale types to FBR format
function mapToFBRSaleType(saleType: string, taxRate: number): string {
  // Map internal sale types to FBR-compliant sale type descriptions
  switch (saleType) {
    case 'Standard':
      return 'Goods at standard rate (default)'
    case 'Reduced':
      return 'Goods at Reduced Rate'
    case 'Exempt':
      return 'Exempt Goods'
    case 'Zero':
      return 'Goods at zero-rate'
    case 'Services':
      return 'Services rendered or provided'
    case 'FED':
      return 'Goods (FED in ST Mode)'
    case 'Steel':
      return 'Sale of Steel (Melted and Re-Rolled)'
    case 'Textile':
      return 'Cotton Spinners purchase from Cotton Ginners'
    case 'Telecom':
      return 'Telecommunication services rendered or provided'
    default:
      // Default based on tax rate
      if (taxRate === 0) return 'Goods at zero-rate'
      if (taxRate < 18) return 'Goods at Reduced Rate'
      return 'Goods at standard rate (default)'
  }
}
