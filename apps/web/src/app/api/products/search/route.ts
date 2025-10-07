import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'

/**
 * API to search products with autocomplete
 * GET /api/products/search?q=searchTerm
 */

export async function GET(request: NextRequest) {
  try {
    const business = await getAuthenticatedBusiness()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (query.length < 2) {
      return NextResponse.json({ products: [] })
    }

    // Search products by name, description, or HS code
    const products = await prisma.product.findMany({
      where: {
        businessId: business.id,
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { hsCode: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 10,
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ products })

  } catch (error: any) {
    console.error('Product search error:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({
      error: 'Failed to search products',
      details: error.message
    }, { status: 500 })
  }
}
