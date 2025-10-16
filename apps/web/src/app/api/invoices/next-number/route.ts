import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

// GET /api/invoices/next-number - Get the next invoice number
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's business
    const business = await prisma.business.findFirst({
      where: {
        user: { email: session.user.email }
      }
    })

    if (!business) {
      return NextResponse.json({ 
        error: 'Business not found' 
      }, { status: 404 })
    }

    // Get the last invoice for this business
    const lastInvoice = await prisma.invoice.findFirst({
      where: { businessId: business.id },
      orderBy: { invoiceSequence: 'desc' }
    })

    // Calculate next sequence number
    const nextSequence = lastInvoice ? lastInvoice.invoiceSequence + 1 : 1
    const currentYear = new Date().getFullYear()
    const nextInvoiceNumber = `INV-${currentYear}-${String(nextSequence).padStart(4, '0')}`

    return NextResponse.json({
      success: true,
      nextInvoiceNumber,
      nextSequence,
      metadata: {
        businessId: business.id,
        currentYear,
        lastSequence: lastInvoice?.invoiceSequence || 0
      }
    })

  } catch (error: any) {
    console.error('Error fetching next invoice number:', error)
    return NextResponse.json({
      error: 'Failed to fetch next invoice number',
      details: error.message
    }, { status: 500 })
  }
}