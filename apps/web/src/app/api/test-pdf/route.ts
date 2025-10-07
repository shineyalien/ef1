import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

// Sample invoice data for testing PDF themes
const getSampleInvoiceData = (theme: string) => {
  return {
    id: 'test-invoice-id',
    invoiceNumber: 'TEST-001',
    invoiceDate: new Date().toISOString(),
    fbrInvoiceNumber: theme === 'fbr' ? '7000007DI1747119701593' : null,
    totalAmount: 11800,
    subtotal: 10000,
    taxAmount: 1800,
    totalWithholdingTax: 0,
    qrCode: theme === 'fbr' ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' : null,
    business: {
      companyName: 'Test Company Ltd.',
      ntnNumber: '1234567',
      address: '123 Test Street, Test Area',
      province: 'Punjab',
      sellerCity: 'Lahore',
      sellerContact: '+92 300 1234567',
      sellerEmail: 'test@example.com',
      logoUrl: null,
      invoiceTemplate: theme,
      invoicePrefix: 'TEST-',
      footerText: 'This is a test invoice for PDF theme demonstration',
      taxIdLabel: 'NTN',
      defaultCurrency: 'PKR',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      defaultPaymentTerms: 'Payment due within 30 days'
    },
    customer: {
      name: 'Test Customer',
      ntnNumber: '7654321',
      address: '456 Customer Avenue, Customer City',
      phoneNumber: '+92 300 9876543'
    },
    items: [
      {
        id: 'item-1',
        description: 'Test Product 1 - Standard Item',
        quantity: 2,
        unitPrice: 2500,
        taxRate: 18,
        totalAmount: 5900,
        hsCode: '84713000',
        uom: 'PCS'
      },
      {
        id: 'item-2',
        description: 'Test Product 2 - Service Item',
        quantity: 1,
        unitPrice: 4100,
        taxRate: 18,
        totalAmount: 4838,
        hsCode: '99850000',
        uom: 'NOS'
      },
      {
        id: 'item-3',
        description: 'Test Product 3 - Zero Rated Item',
        quantity: 5,
        unitPrice: 100,
        taxRate: 0,
        totalAmount: 500,
        hsCode: '30049099',
        uom: 'PCS'
      },
      {
        id: 'item-4',
        description: 'Test Product 4 - Exempt Item',
        quantity: 3,
        unitPrice: 200,
        taxRate: 0,
        totalAmount: 600,
        hsCode: '30049099',
        uom: 'PCS'
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const theme = (searchParams.get('theme') as 'default' | 'modern' | 'classic') || 'default'
    const fbr = searchParams.get('fbr') === 'true'

    // Get user's business for actual data if available
    const business = await prisma.business.findFirst({
      where: {
        user: { email: session.user.email }
      }
    })

    // Use sample data with real business settings if available
    const invoiceData = {
      ...getSampleInvoiceData(fbr ? 'fbr' : theme),
      business: business ? {
        companyName: business.companyName,
        ntnNumber: business.ntnNumber,
        address: business.address,
        province: business.province,
        sellerCity: business.sellerCity || undefined,
        sellerContact: business.sellerContact || undefined,
        sellerEmail: business.sellerEmail || undefined,
        logoUrl: business.logoUrl,
        invoiceTemplate: business.invoiceTemplate || theme,
        invoicePrefix: business.invoicePrefix || 'INV-',
        footerText: business.footerText || undefined,
        taxIdLabel: business.taxIdLabel || 'NTN',
        defaultCurrency: business.defaultCurrency || 'PKR',
        primaryColor: business.primaryColor || '#3B82F6',
        secondaryColor: business.secondaryColor || '#10B981',
        defaultPaymentTerms: business.defaultPaymentTerms || undefined
      } : getSampleInvoiceData(fbr ? 'fbr' : theme).business
    }

    // Generate PDF using the enhanced PDF generator
    const { generateEnhancedPDF } = await import('@/lib/pdf-generator-enhanced')
    const pdfStream = await generateEnhancedPDF(invoiceData, theme)
    
    // Convert stream to buffer
    const reader = pdfStream.getReader()
    const chunks = []
    let done = false
    
    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      if (value) chunks.push(value)
    }
    
    const pdfBlob = new Blob(chunks, { type: 'application/pdf' })

    // Return PDF as response
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="test-invoice-${theme}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error: any) {
    console.error('Error generating test PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate test PDF', details: error.message },
      { status: 500 }
    )
  }
}