import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'

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
function validateCustomerData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Customer name is required')
  }
  
  if (!data.address || data.address.trim() === '') {
    errors.push('Customer address is required')
  }
  
  if (!data.province || data.province.trim() === '') {
    errors.push('Customer province is required')
  }
  
  // Validate email format if provided
  if (data.email && data.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format')
    }
  }
  
  // Validate phone number format if provided
  if (data.phone && data.phone.trim() !== '') {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(data.phone)) {
      errors.push('Invalid phone number format')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// GET /api/customers - Get all customers for the authenticated user
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Get or create business for authenticated user
    let business
    try {
      business = await getAuthenticatedBusiness()
    } catch (authError) {
      console.error('Authentication error:', authError)
      return createErrorResponse(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      )
    }

    // Get customers from database
    let customers
    try {
      customers = await prisma.customer.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: 'desc' }
      })
    } catch (dbError) {
      console.error('Database query failed:', dbError)
      return createErrorResponse(
        'Failed to fetch customers from database',
        'DATABASE_QUERY_FAILED',
        500,
        dbError instanceof Error ? dbError.message : 'Unknown error'
      )
    }

    console.log('Retrieved customers from database:', customers.length)

    return NextResponse.json({
      success: true,
      customers,
      metadata: {
        count: customers.length,
        processingTime: Date.now() - startTime,
        businessId: business.id
      }
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/customers:', error)
    return createErrorResponse(
      'An unexpected error occurred while fetching customers',
      'UNEXPECTED_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

// POST /api/customers - Create a new customer
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
    
    // Validate customer data
    const validation = validateCustomerData(body)
    if (!validation.isValid) {
      return createErrorResponse(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validation.errors
      )
    }

    // Get or create business for authenticated user
    let business
    try {
      business = await getAuthenticatedBusiness()
    } catch (authError) {
      console.error('Authentication error:', authError)
      return createErrorResponse(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      )
    }

    // Check for duplicate customer
    try {
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          businessId: business.id,
          name: body.name,
          address: body.address
        }
      })
      
      if (existingCustomer) {
        return createErrorResponse(
          'A customer with this name and address already exists',
          'DUPLICATE_CUSTOMER',
          409,
          `Customer ID: ${existingCustomer.id}`
        )
      }
    } catch (dbError) {
      console.error('Failed to check for duplicate customer:', dbError)
      // Continue with creation even if duplicate check fails
    }

    // Create customer in database
    let newCustomer
    try {
      newCustomer = await prisma.customer.create({
        data: {
          businessId: business.id,
          name: body.name.trim(),
          address: body.address.trim(),
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
        } as any
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

    console.log('Created customer in database:', newCustomer)

    return NextResponse.json({
      success: true,
      customer: newCustomer,
      metadata: {
        processingTime: Date.now() - startTime,
        customerId: newCustomer.id
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/customers:', error)
    return createErrorResponse(
      'An unexpected error occurred while creating the customer',
      'UNEXPECTED_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}