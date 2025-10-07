import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db, prisma } from '@/lib/database'
import { z } from 'zod'

const bulkInvoiceSchema = z.object({
  businessId: z.string(),
  invoices: z.array(z.object({
    customerId: z.string(),
    customerName: z.string(),
    invoiceDate: z.string(),
    items: z.array(z.object({
      description: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      hsCode: z.string().optional(),
      taxRate: z.number()
    })),
    notes: z.string().optional()
  }))
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { businessId, invoices } = bulkInvoiceSchema.parse(body)

    // Verify business ownership
    const business = await db.getBusinessById(businessId)
    if (!business || business.userId !== session.user.id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Business not found or unauthorized' 
      }, { status: 403 })
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as any[],
      invoices: [] as any[]
    }

    // Process each invoice
    for (let i = 0; i < invoices.length; i++) {
      const invoiceData = invoices[i]
      
      try {
        // Calculate totals
        const subtotal = invoiceData.items.reduce((sum, item) => 
          sum + (item.quantity * item.unitPrice), 0
        )
        
        const taxAmount = invoiceData.items.reduce((sum, item) => 
          sum + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0
        )
        
        const totalAmount = subtotal + taxAmount

        // Generate local invoice number
        const invoiceCount = await prisma.invoice.count({ 
          where: { businessId } 
        })
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + i + 1).padStart(3, '0')}`

        // Create invoice
        const invoice = await db.createInvoice({
          businessId,
          customerId: invoiceData.customerId,
          invoiceNumber,
          invoiceDate: invoiceData.invoiceDate,
          customerName: invoiceData.customerName,
          customerAddress: '', // Will be populated from customer data
          items: invoiceData.items.map(item => ({
            ...item,
            totalPrice: item.quantity * item.unitPrice,
            taxAmount: item.quantity * item.unitPrice * (item.taxRate / 100),
            hsCode: item.hsCode || '85234010',
            unitOfMeasurement: 'UNIT'
          })),
          subtotal,
          taxAmount,
          totalAmount,
          notes: invoiceData.notes
        })

        results.successful++
        results.invoices.push({
          index: i,
          invoiceId: invoice.id,
          invoiceNumber,
          status: 'created'
        })

      } catch (error) {
        results.failed++
        results.errors.push({
          index: i,
          error: error instanceof Error ? error.message : 'Unknown error',
          customerName: invoiceData.customerName
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Bulk operation completed: ${results.successful} successful, ${results.failed} failed`,
      results
    })

  } catch (error) {
    console.error('Bulk invoice creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid input data',
        errors: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Business ID required' 
      }, { status: 400 })
    }

    // Get bulk operation history  
    const recentInvoices = await prisma.invoice.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        customer: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      recentInvoices
    })

  } catch (error) {
    console.error('Get bulk operations error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}