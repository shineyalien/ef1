import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

// Debug endpoint to check invoice data
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const params = await context.params

    // Fetch invoice with all related data
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        business: true,
        customer: true,
        items: true
      }
    })

    if (!invoice) {
      return new NextResponse('Invoice not found', { status: 404 })
    }

    // Return full invoice data for debugging
    return NextResponse.json({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      fbrData: {
        fbrInvoiceNumber: invoice.fbrInvoiceNumber,
        fbrSubmitted: invoice.fbrSubmitted,
        fbrValidated: invoice.fbrValidated,
        qrCode: invoice.qrCode ? 'QR Code exists' : null,
        qrCodeData: invoice.qrCodeData ? 'QR Data exists' : null,
      },
      business: {
        companyName: invoice.business.companyName,
        ntnNumber: invoice.business.ntnNumber,
        logoUrl: invoice.business.logoUrl,
        electronicSoftwareRegNo: invoice.business.electronicSoftwareRegNo,
        footerText: invoice.business.footerText,
      },
      customer: invoice.customer ? {
        name: invoice.customer.name,
        ntnNumber: invoice.customer.ntnNumber,
      } : null,
      itemsCount: invoice.items.length
    }, { status: 200 })

  } catch (error) {
    console.error('Debug API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice data' },
      { status: 500 }
    )
  }
}
