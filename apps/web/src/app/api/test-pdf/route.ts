import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { generateEnhancedPDF } from '@/lib/pdf-generator-enhanced'

// GET /api/test-pdf - Generate a test PDF with theme support
export async function GET(request: NextRequest) {
  try {
    // Get theme from query parameters
    const { searchParams } = new URL(request.url)
    const theme = (searchParams.get('theme') as 'default' | 'modern' | 'classic') || 'default'

    // Get the first invoice for testing
    const invoice = await prisma.invoice.findFirst({
      include: {
        items: true,
        customer: true,
        business: true
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'No invoices found' }, { status: 404 })
    }

    // Transform data for enhanced PDF generator with business settings
    const invoiceData = {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate.toISOString(),
      fbrInvoiceNumber: invoice.fbrInvoiceNumber,
      totalAmount: invoice.totalAmount,
      subtotal: invoice.subtotal,
      taxAmount: invoice.taxAmount,
      totalWithholdingTax: invoice.totalWithholdingTax || undefined,
      qrCode: invoice.qrCode,
      business: {
        companyName: invoice.business.companyName,
        ntnNumber: invoice.business.ntnNumber,
        address: invoice.business.address,
        province: invoice.business.province,
        sellerCity: invoice.business.sellerCity || undefined,
        sellerContact: invoice.business.sellerContact || undefined,
        sellerEmail: invoice.business.sellerEmail || undefined,
        logoUrl: (invoice.business as any).logoUrl,
        invoiceTemplate: (invoice.business as any).invoiceTemplate || 'default',
        invoicePrefix: (invoice.business as any).invoicePrefix,
        footerText: (invoice.business as any).footerText,
        taxIdLabel: (invoice.business as any).taxIdLabel,
        defaultCurrency: (invoice.business as any).defaultCurrency || 'PKR',
        primaryColor: (invoice.business as any).primaryColor,
        secondaryColor: (invoice.business as any).secondaryColor,
        defaultPaymentTerms: (invoice.business as any).defaultPaymentTerms
      },
      customer: invoice.customer ? {
        name: invoice.customer.name,
        ntnNumber: invoice.customer.ntnNumber,
        address: invoice.customer.address,
        phoneNumber: invoice.customer.phone
      } : null,
      items: invoice.items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        totalAmount: item.totalValue,
        hsCode: item.hsCode,
        uom: item.unitOfMeasurement
      }))
    }

    // Generate PDF with selected theme
    const pdfStream = await generateEnhancedPDF(invoiceData, theme)

    // Return PDF as response
    return new NextResponse(pdfStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Test-Invoice-${invoice.invoiceNumber}-${theme}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error: any) {
    console.error('Error generating test PDF:', error)
    return NextResponse.json({
      error: 'Failed to generate PDF',
      details: error.message
    }, { status: 500 })
  }
}