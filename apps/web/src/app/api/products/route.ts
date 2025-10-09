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
function validateProductData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Product name is required')
  }
  
  if (!data.hsCode || data.hsCode.trim() === '') {
    errors.push('HS Code is required')
  } else {
    // Validate HS Code format (basic validation) - updated to support FBR format
    const hsCodeRegex = /^\d{4}(\.\d{2,4})?$/
    if (!hsCodeRegex.test(data.hsCode.trim())) {
      errors.push('Invalid HS Code format. Expected format: 1234 or 1234.56 or 1234.5678')
    }
  }
  
  if (!data.unitOfMeasurement || data.unitOfMeasurement.trim() === '') {
    errors.push('Unit of measurement is required')
  }
  
  if (data.unitPrice === undefined || data.unitPrice === null) {
    errors.push('Unit price is required')
  } else {
    const price = parseFloat(data.unitPrice)
    if (isNaN(price) || price < 0) {
      errors.push('Unit price must be a valid positive number')
    }
  }
  
  // Validate tax rate if provided
  if (data.taxRate !== undefined && data.taxRate !== null) {
    const taxRate = parseFloat(data.taxRate)
    if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
      errors.push('Tax rate must be a number between 0 and 100')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// GET /api/products - Get all products for the authenticated user
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Authentication check
    const session = await auth()
    if (!session?.user?.email) {
      console.log('No session or email found')
      return createErrorResponse(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      )
    }

    console.log('Authenticated user email:', session.user.email)

    // Get user's business
    let business
    try {
      business = await prisma.business.findFirst({
        where: {
          user: { email: session.user.email }
        }
      })
    } catch (dbError) {
      console.error('Failed to find business:', dbError)
      return createErrorResponse(
        'Failed to retrieve business information',
        'BUSINESS_FETCH_FAILED',
        500,
        dbError instanceof Error ? dbError.message : 'Unknown error'
      )
    }

    if (!business) {
      console.log('No business found for user:', session.user.email)
      // Return empty array instead of error for better UX
      return NextResponse.json({
        success: true,
        products: [],
        metadata: {
          count: 0,
          processingTime: Date.now() - startTime,
          businessExists: false
        }
      })
    }

    console.log('Found business:', business.id, business.companyName)

    // Get products from database
    let products
    try {
      products = await prisma.product.findMany({
        where: {
          businessId: business.id,
          isActive: true
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (dbError) {
      console.error('Failed to fetch products:', dbError)
      return createErrorResponse(
        'Failed to fetch products from database',
        'PRODUCTS_FETCH_FAILED',
        500,
        dbError instanceof Error ? dbError.message : 'Unknown error'
      )
    }

    console.log('Retrieved products from database:', products.length)
    return NextResponse.json({
      success: true,
      products,
      metadata: {
        count: products.length,
        processingTime: Date.now() - startTime,
        businessId: business.id
      }
    })

  } catch (error) {
    console.error('Unexpected error in GET /api/products:', error)
    return createErrorResponse(
      'An unexpected error occurred while fetching products',
      'UNEXPECTED_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

// POST /api/products - Create a new product
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
    
    // Log the received body for debugging
    console.log('📦 Product creation request body:', JSON.stringify(body, null, 2))
    
    // Validate product data
    const validation = validateProductData(body)
    if (!validation.isValid) {
      console.log('❌ Product validation failed:', validation.errors)
      return createErrorResponse(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validation.errors
      )
    }

    // Get user's business
    let business
    try {
      business = await prisma.business.findFirst({
        where: {
          user: { email: session.user.email }
        }
      })
    } catch (dbError) {
      console.error('Failed to find business:', dbError)
      return createErrorResponse(
        'Failed to retrieve business information',
        'BUSINESS_FETCH_FAILED',
        500,
        dbError instanceof Error ? dbError.message : 'Unknown error'
      )
    }

    if (!business) {
      return createErrorResponse(
        'Business profile not found. Please set up your business first.',
        'BUSINESS_NOT_FOUND',
        404
      )
    }

    // Check for duplicate product
    try {
      const existingProduct = await prisma.product.findFirst({
        where: {
          businessId: business.id,
          name: body.name.trim(),
          hsCode: body.hsCode.trim()
        }
      })
      
      if (existingProduct) {
        return createErrorResponse(
          'A product with this name and HS Code already exists',
          'DUPLICATE_PRODUCT',
          409,
          `Product ID: ${existingProduct.id}`
        )
      }
    } catch (dbError) {
      console.error('Failed to check for duplicate product:', dbError)
      // Continue with creation even if duplicate check fails
    }

    // Create product in database
    let newProduct
    try {
      newProduct = await prisma.product.create({
        data: {
          businessId: business.id,
          name: body.name.trim(),
          description: body.description?.trim() || null,
          hsCode: body.hsCode.trim(),
          hsCodeDescription: body.hsCodeDescription?.trim() || null,
          unitOfMeasurement: body.unitOfMeasurement.trim(),
          unitPrice: parseFloat(body.unitPrice),
          taxRate: parseFloat(body.taxRate) || 18,
          category: body.category?.trim() || null,
          serialNumber: body.serialNumber?.trim() || null,
          transactionType: body.transactionType?.toString() || null,
          transactionTypeDesc: body.transactionTypeDesc?.trim() || null,
          rateId: body.rateId?.trim() || null,
          rateDescription: body.rateDescription?.trim() || null,
          sroNo: body.sroScheduleNo?.trim() || null,
          sroItemSerialNo: body.sroItemSerialNo?.trim() || null,
          isActive: body.isActive !== undefined ? body.isActive : true
        }
      })
    } catch (createError) {
      console.error('Failed to create product:', createError)
      return createErrorResponse(
        'Failed to create product',
        'PRODUCT_CREATION_FAILED',
        500,
        createError instanceof Error ? createError.message : 'Unknown error'
      )
    }

    console.log('Created product:', newProduct)
    return NextResponse.json({
      success: true,
      product: newProduct,
      metadata: {
        processingTime: Date.now() - startTime,
        productId: newProduct.id
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error in POST /api/products:', error)
    return createErrorResponse(
      'An unexpected error occurred while creating the product',
      'UNEXPECTED_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

