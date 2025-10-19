import { NextRequest, NextResponse } from 'next/server'
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

// POST /api/test-customers - Create a test customer (bypasses authentication)
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
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
    
    // Get a test business (first one in the database)
    let business
    try {
      business = await prisma.business.findFirst()
      if (!business) {
        return createErrorResponse(
          'No business found in database',
          'NO_BUSINESS',
          404
        )
      }
    } catch (dbError) {
      console.error('Failed to find business:', dbError)
      return createErrorResponse(
        'Failed to find business',
        'BUSINESS_QUERY_FAILED',
        500,
        dbError instanceof Error ? dbError.message : 'Unknown error'
      )
    }

    // Create customer in database
    let newCustomer
    try {
      newCustomer = await prisma.customer.create({
        data: {
          businessId: business.id,
          name: body.name?.trim() || 'Test Customer',
          address: body.address?.trim() || '123 Test Street',
          registrationType: body.registrationType || 'UNREGISTERED',
          ntnNumber: body.ntnNumber?.trim() || null,
          phone: body.phone?.trim() || null,
          email: body.email?.trim().toLowerCase() || null,
          // FBR Buyer Information
          buyerCNIC: body.buyerCNIC?.trim() || null,
          buyerPassport: body.buyerPassport?.trim() || null,
          buyerType: body.buyerType?.trim() || (body.ntnNumber ? '1' : '2'), // Default to NTN if available, otherwise CNIC
          buyerCity: body.buyerCity?.trim() || body.city?.trim() || null,
          buyerProvince: body.province?.trim() || null,
          buyerContact: body.phone?.trim() || body.buyerContact?.trim() || null,
          buyerEmail: body.email?.trim().toLowerCase() || body.buyerEmail?.trim().toLowerCase() || null,
          // Regular address fields
          city: body.city?.trim() || null,
          province: body.province?.trim() || null,
          postalCode: body.postalCode?.trim() || null
        }
      })
    } catch (createError) {
      console.error('Failed to create customer:', createError)
      return createErrorResponse(
        'Failed to create customer',
        'CUSTOMER_CREATION_FAILED',
        500,
        createError instanceof Error ? createError.message : 'Unknown error'
      )
    }

    console.log('Created test customer in database:', newCustomer)

    return NextResponse.json({
      success: true,
      customer: newCustomer,
      metadata: {
        processingTime: Date.now() - startTime,
        customerId: newCustomer.id,
        businessId: business.id
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/test-customers:', error)
    return createErrorResponse(
      'An unexpected error occurred while creating the test customer',
      'UNEXPECTED_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}