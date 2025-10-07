import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'

/**
 * API to search customers with autocomplete
 * GET /api/customers/search?q=searchTerm
 */

export async function GET(request: NextRequest) {
  try {
    const business = await getAuthenticatedBusiness()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (query.length < 2) {
      return NextResponse.json({ customers: [] })
    }

    // Search customers by name, NTN, or phone
    const customers = await prisma.customer.findMany({
      where: {
        businessId: business.id,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { ntnNumber: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 10,
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ customers })

  } catch (error: any) {
    console.error('Customer search error:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({
      error: 'Failed to search customers',
      details: error.message
    }, { status: 500 })
  }
}
