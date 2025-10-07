import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get invoice with all related data
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        business: true,
        customer: true,
        items: true
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Verify ownership by checking user email through business
    const business = await prisma.business.findFirst({
      where: {
        id: invoice.businessId,
        user: { email: session.user.email }
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Transform data to match PDF interface
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
        phoneNumber: invoice.business.sellerContact || undefined,
        email: invoice.business.sellerEmail || undefined
      },
      customer: invoice.customer ? {
        name: invoice.customer.name,
        ntnNumber: invoice.customer.ntnNumber,
        address: invoice.customer.address || undefined,
        phoneNumber: invoice.customer.phone || undefined
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

    // Generate PDF blob using the simple PDF generator
    const { generateEnhancedPDF } = await import('@/lib/pdf-generator-enhanced')
    const pdfStream = await generateEnhancedPDF(invoiceData, 'default')
    
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
        'Content-Disposition': `inline; filename="Invoice-${invoiceData.invoiceNumber}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error: any) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get invoice with all related data
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        business: true,
        customer: true,
        items: true
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Verify ownership by checking user email through business
    const business = await prisma.business.findFirst({
      where: {
        id: invoice.businessId,
        user: { email: session.user.email }
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Transform data to match PDF interface
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
        phoneNumber: invoice.business.sellerContact || undefined,
        email: invoice.business.sellerEmail || undefined
      },
      customer: invoice.customer ? {
        name: invoice.customer.name,
        ntnNumber: invoice.customer.ntnNumber,
        address: invoice.customer.address || undefined,
        phoneNumber: invoice.customer.phone || undefined
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

    // Generate PDF blob using the simple PDF generator
    const { generateEnhancedPDF } = await import('@/lib/pdf-generator-enhanced')
    const pdfStream = await generateEnhancedPDF(invoiceData, 'default')
    
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

    // Return download response
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${invoiceData.invoiceNumber}-${new Date().getTime()}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error: any) {
    console.error('Error generating PDF for download:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    )
  }
}