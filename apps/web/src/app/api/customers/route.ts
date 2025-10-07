import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'

// GET /api/customers - Get all customers for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get or create business for authenticated user
    const business = await getAuthenticatedBusiness()

    // Get customers from database
    const customers = await prisma.customer.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: 'desc' }
    })

    console.log('Retrieved customers from database:', customers.length)

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Error fetching customers:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.address || !body.province) {
      return NextResponse.json({ error: 'Missing required fields: name, address, province' }, { status: 400 })
    }

    // Get or create business for authenticated user
    const business = await getAuthenticatedBusiness()

    // Create customer in database
    const newCustomer = await prisma.customer.create({
      data: {
        businessId: business.id,
        name: body.name,
        address: body.address || null,
        registrationType: body.registrationType || 'UNREGISTERED',
        ntnNumber: body.ntnNumber || null,
        phone: body.phone || null,
        email: body.email || null,
        buyerProvince: body.province || null,
        buyerCity: body.city || null,
        buyerContact: body.phone || null,
        buyerEmail: body.email || null
      }
    })

    console.log('Created customer in database:', newCustomer)

    return NextResponse.json({ 
      success: true, 
      customer: newCustomer 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}