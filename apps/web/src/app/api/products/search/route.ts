import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'

/**
 * Enhanced API to search products with pagination, filtering, and sorting
 * GET /api/products/search?q=searchTerm&page=1&limit=20&category=Electronics&minPrice=100&maxPrice=1000&sortBy=name&sortOrder=asc&inStock=true
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const business = await getAuthenticatedBusiness()
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category') || ''
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const inStock = searchParams.get('inStock') === 'true'
    const hsCode = searchParams.get('hsCode') || ''
    
    // Skip parameter for pagination
    const skip = (page - 1) * limit
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({
        error: 'Invalid pagination parameters',
        details: 'Page must be >= 1, limit must be between 1 and 100'
      }, { status: 400 })
    }

    // Build the where clause
    const whereClause: any = {
      businessId: business.id,
      isActive: true
    }

    // Add search conditions if query is provided
    if (query.length >= 2) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { hsCode: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { serialNumber: { contains: query, mode: 'insensitive' } }
      ]
    } else if (query.length === 1) {
      // For single character searches, be more restrictive
      whereClause.OR = [
        { name: { startsWith: query, mode: 'insensitive' } },
        { hsCode: { startsWith: query, mode: 'insensitive' } }
      ]
    }

    // Add category filter
    if (category) {
      whereClause.category = { contains: category, mode: 'insensitive' }
    }

    // Add HS Code filter
    if (hsCode) {
      whereClause.hsCode = { contains: hsCode, mode: 'insensitive' }
    }

    // Add price range filter
    whereClause.unitPrice = {
      gte: minPrice,
      lte: maxPrice
    }

    // Build the order clause
    const orderClause: any = {}
    const validSortFields = ['name', 'unitPrice', 'createdAt', 'updatedAt', 'hsCode', 'category']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'
    const sortDirection = sortOrder === 'desc' ? 'desc' : 'asc'
    orderClause[sortField] = sortDirection

    // Execute queries in parallel for better performance
    const [products, totalCount] = await Promise.all([
      // Get products with pagination
      prisma.product.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          description: true,
          hsCode: true,
          unitOfMeasurement: true,
          unitPrice: true,
          taxRate: true,
          category: true,
          serialNumber: true,
          createdAt: true,
          updatedAt: true,
          isActive: true
        },
        skip,
        take: limit,
        orderBy: orderClause
      }),
      // Get total count for pagination
      prisma.product.count({
        where: whereClause
      })
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    // Return enhanced response with metadata
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPreviousPage
      },
      filters: {
        query,
        category,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        hsCode
      },
      metadata: {
        processingTime: Date.now() - startTime,
        businessId: business.id
      }
    })

  } catch (error: any) {
    console.error('Product search error:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }
    return NextResponse.json({
      success: false,
      error: 'Failed to search products',
      details: error.message
    }, { status: 500 })
  }
}
