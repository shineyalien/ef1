import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

// Error response helper
function createErrorResponse(
  message: string,
  code: string,
  status: number = 500,
  details?: any
) {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code,
      details,
      timestamp: new Date().toISOString()
    }
  }, { status })
}

// Validation helper
function validateInvoiceData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.customerId) {
    errors.push('Customer is required')
  }
  
  if (!data.items || data.items.length === 0) {
    errors.push('Invoice must have at least one item')
  } else {
    data.items.forEach((item: any, index: number) => {
      if (!item.productId && !item.hsCode) {
        errors.push(`Item ${index + 1}: Each item must have product or HS code`)
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
      }
      if (item.unitPrice < 0) {
        errors.push(`Item ${index + 1}: Unit price cannot be negative`)
      }
    })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// GET /api/invoices - Get all invoices for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    const session = await auth()
    if (!session?.user?.email) {
      return createErrorResponse(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      )
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
        try {
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
        } catch (createError) {
          console.error('Failed to create user:', createError)
          return createErrorResponse(
            'Failed to create user account',
            'USER_CREATION_FAILED',
            500,
            createError instanceof Error ? createError.message : 'Unknown error'
          )
        }
      }

      try {
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
      } catch (createError) {
        console.error('Failed to create business:', createError)
        return createErrorResponse(
          'Failed to create business profile',
          'BUSINESS_CREATION_FAILED',
          500,
          createError instanceof Error ? createError.message : 'Unknown error'
        )
      }
      
      return NextResponse.json({
        success: true,
        invoices: [],
        metadata: {
          count: 0,
          processingTime: Date.now() - startTime,
          businessCreated: true
        }
      })
    }

    // Get real invoices from database
    let invoices
    try {
      invoices = await prisma.invoice.findMany({
        where: { businessId: business.id },
        include: {
          items: true,
          customer: true
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (dbError) {
      console.error('Database query failed:', dbError)
      return createErrorResponse(
        'Failed to fetch invoices from database',
        'DATABASE_QUERY_FAILED',
        500,
        dbError instanceof Error ? dbError.message : 'Unknown error'
      )
    }

    return NextResponse.json({
      success: true,
      invoices,
      metadata: {
        count: invoices.length,
        processingTime: Date.now() - startTime,
        businessId: business.id
      }
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/invoices:', error)
    return createErrorResponse(
      'An unexpected error occurred while fetching invoices',
      'UNEXPECTED_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Authentication check
    const session = await auth()
    if (!session?.user?.email) {
      return createErrorResponse(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return createErrorResponse(
        'Invalid JSON in request body',
        'INVALID_JSON',
        400,
        parseError instanceof Error ? parseError.message : 'Unknown error'
      )
    }

    console.log('Received invoice data:', body)
    
    // Validate invoice data
    const validation = validateInvoiceData(body)
    if (!validation.isValid) {
      return createErrorResponse(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validation.errors
      )
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
        try {
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
        } catch (createError) {
          console.error('Failed to create user:', createError)
          return createErrorResponse(
            'Failed to create user account',
            'USER_CREATION_FAILED',
            500,
            createError instanceof Error ? createError.message : 'Unknown error'
          )
        }
      }

      try {
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
      } catch (createError) {
        console.error('Failed to create business:', createError)
        return createErrorResponse(
          'Failed to create business profile',
          'BUSINESS_CREATION_FAILED',
          500,
          createError instanceof Error ? createError.message : 'Unknown error'
        )
      }
    }

    // Verify customer exists
    let customer
    try {
      customer = await prisma.customer.findUnique({
        where: { id: body.customerId }
      })
    } catch (dbError) {
      console.error('Failed to verify customer:', dbError)
      return createErrorResponse(
        'Failed to verify customer',
        'CUSTOMER_VERIFICATION_FAILED',
        500,
        dbError instanceof Error ? dbError.message : 'Unknown error'
      )
    }
    
    if (!customer) {
      return createErrorResponse(
        'Customer not found',
        'CUSTOMER_NOT_FOUND',
        404,
        `Customer ID: ${body.customerId}`
      )
    }

    // Calculate next invoice sequence number
    let lastInvoice
    try {
      lastInvoice = await prisma.invoice.findFirst({
        where: { businessId: business.id },
        orderBy: { invoiceSequence: 'desc' }
      })
    } catch (dbError) {
      console.error('Failed to get last invoice:', dbError)
      return createErrorResponse(
        'Failed to generate invoice number',
        'INVOICE_NUMBER_GENERATION_FAILED',
        500,
        dbError instanceof Error ? dbError.message : 'Unknown error'
      )
    }
    
    // Use invoiceSequence field (more reliable than parsing invoice number)
    const nextSequence = lastInvoice ? lastInvoice.invoiceSequence + 1 : 1
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(nextSequence).padStart(4, '0')}`

    // Create real invoice in database with all FBR fields
    let newInvoice
    try {
      newInvoice = await prisma.invoice.create({
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
    } catch (createError) {
      console.error('Failed to create invoice:', createError)
      return createErrorResponse(
        'Failed to create invoice',
        'INVOICE_CREATION_FAILED',
        500,
        createError instanceof Error ? createError.message : 'Unknown error'
      )
    }

    console.log('Created invoice in database:', newInvoice)

    return NextResponse.json({
      success: true,
      invoice: newInvoice,
      metadata: {
        processingTime: Date.now() - startTime,
        invoiceNumber: newInvoice.invoiceNumber,
        itemCount: newInvoice.items.length
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/invoices:', error)
    return createErrorResponse(
      'An unexpected error occurred while creating the invoice',
      'UNEXPECTED_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}