import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

// GET /api/invoices - Get all invoices for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's business
    let business = await prisma.business.findFirst({
      where: { 
        user: { email: session.user.email }
      }
    })

    if (!business) {
      // Create user and business if they don't exist
      let user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            password: '',
            firstName: session.user.name?.split(' ')[0] || 'User',
            lastName: session.user.name?.split(' ')[1] || '',
            isActive: true,
            subscriptionPlan: 'FREE',
            country: 'Pakistan'
          }
        })
      }

      business = await prisma.business.create({
        data: {
          userId: user.id,
          companyName: `${session.user.name || 'My'} Business`,
          ntnNumber: '1234567',
          address: '123 Business Street',
          province: 'Punjab',
          businessType: 'Services',
          sector: 'Technology'
        }
      })
      
      return NextResponse.json({ invoices: [] })
    }

    // Get real invoices from database
    const invoices = await prisma.invoice.findMany({
      where: { businessId: business.id },
      include: {
        items: true,
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Received invoice data:', body)
    
    // Validate required fields
    if (!body.customerId) {
      return NextResponse.json({ error: 'Customer is required' }, { status: 400 })
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Invoice must have at least one item' }, { status: 400 })
    }

    // Validate each item
    for (const item of body.items) {
      if (!item.productId && !item.hsCode) {
        return NextResponse.json({ 
          error: 'Each item must have product or HS code' 
        }, { status: 400 })
      }
      if (item.quantity <= 0 || item.unitPrice < 0) {
        return NextResponse.json({ 
          error: 'Each item must have valid quantity and unit price' 
        }, { status: 400 })
      }
    }

    // Get user's business
    let business = await prisma.business.findFirst({
      where: { 
        user: { email: session.user.email }
      }
    })

    if (!business) {
      // Create user and business if they don't exist
      let user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            password: '',
            firstName: session.user.name?.split(' ')[0] || 'User',
            lastName: session.user.name?.split(' ')[1] || '',
            isActive: true,
            subscriptionPlan: 'FREE',
            country: 'Pakistan'
          }
        })
      }

      business = await prisma.business.create({
        data: {
          userId: user.id,
          companyName: `${session.user.name || 'My'} Business`,
          ntnNumber: '1234567',
          address: '123 Business Street',
          province: 'Punjab',
          businessType: 'Services',
          sector: 'Technology'
        }
      })
    }

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: body.customerId }
    })
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Calculate next invoice sequence number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { businessId: business.id },
      orderBy: { invoiceSequence: 'desc' }
    })
    
    // Use invoiceSequence field (more reliable than parsing invoice number)
    const nextSequence = lastInvoice ? lastInvoice.invoiceSequence + 1 : 1
    
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(nextSequence).padStart(4, '0')}`

    // Create real invoice in database with all FBR fields
    const newInvoice = await prisma.invoice.create({
      data: {
        business: {
          connect: { id: business.id }
        },
        customer: {
          connect: { id: body.customerId }
        },
        invoiceNumber: invoiceNumber,
        invoiceSequence: nextSequence, // CRITICAL: Required field in schema
        invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : new Date(),
        dueDate: body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        documentType: body.documentType || 'Sale Invoice',
        paymentMode: body.paymentMode || 'Cash',
        scenarioId: body.scenarioId || null,
        taxPeriod: body.taxPeriod || new Date().toISOString().slice(0, 7),
        referenceInvoiceNo: body.invoiceRefNo || null,
        subtotal: body.subtotal || 0,
        taxAmount: body.taxAmount || 0,
        totalAmount: body.totalAmount || 0,
        totalWithholdingTax: body.totalWithholdingTax || 0,
        totalExtraTax: body.totalExtraTax || 0,
        totalFurtherTax: body.totalFurtherTax || 0,
        totalFED: body.totalFED || 0,
        status: body.status || 'DRAFT',
        mode: body.mode || 'LOCAL',
        items: {
          create: body.items.map((item: any) => {
            const subtotal = item.quantity * item.unitPrice
            const taxAmount = (subtotal * item.taxRate) / 100
            
            const itemData: any = {
              description: item.productName || item.description || 'Product',
              hsCode: item.hsCode,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              saleValue: item.unitPrice, // Required field - same as unitPrice for FBR compliance
              unitOfMeasurement: item.unitOfMeasurement || 'Each',
              taxRate: item.taxRate || 18,
              discount: item.discount || 0,
              valueSalesExcludingST: subtotal,
              salesTaxApplicable: taxAmount,
              salesTaxWithheldAtSource: item.salesTaxWithheldAtSource || 0,
              extraTax: item.extraTax || 0,
              furtherTax: item.furtherTax || 0,
              fedPayable: item.fedPayable || 0,
              totalValue: subtotal + taxAmount,
              saleType: item.saleType || 'Standard',
              fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice || 0,
              taxAmount: taxAmount
            }
            
            // Add optional string fields only if they have values
            if (item.sroScheduleNo) {
              itemData.sroScheduleNo = item.sroScheduleNo
            }
            if (item.sroItemSerialNo) {
              itemData.sroItemSerialNo = item.sroItemSerialNo
            }
            
            // Only connect product if productId exists
            if (item.productId) {
              itemData.product = {
                connect: { id: item.productId }
              }
            }
            
            return itemData
          })
        }
      },
      include: {
        items: true,
        customer: true
      }
    })

    console.log('Created invoice in database:', newInvoice)

    return NextResponse.json({ 
      success: true, 
      invoice: newInvoice 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}