import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

// GET /api/products - Get all products for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      console.log('No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Authenticated user email:', session.user.email)

    // Get user's business
    const business = await prisma.business.findFirst({
      where: { 
        user: { email: session.user.email }
      }
    })

    if (!business) {
      console.log('No business found for user:', session.user.email)
      // Return empty array instead of error for better UX
      return NextResponse.json({ products: [] })
    }

    console.log('Found business:', business.id, business.companyName)

    // Get products from database
    const products = await prisma.product.findMany({
      where: { 
        businessId: business.id,
        isActive: true 
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('Retrieved products from database:', products.length)
    return NextResponse.json({ products })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's business
    const business = await prisma.business.findFirst({
      where: { 
        user: { email: session.user.email }
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.hsCode || !body.unitOfMeasurement || !body.unitPrice) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, hsCode, unitOfMeasurement, unitPrice' 
      }, { status: 400 })
    }

    // Create product in database
    const newProduct = await prisma.product.create({
      data: {
        businessId: business.id,
        name: body.name,
        description: body.description || null,
        hsCode: body.hsCode,
        unitOfMeasurement: body.unitOfMeasurement,
        unitPrice: parseFloat(body.unitPrice),
        taxRate: parseFloat(body.taxRate) || 18,
        category: body.category || null,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    console.log('Created product:', newProduct)
    return NextResponse.json({ product: newProduct }, { status: 201 })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' }, 
      { status: 500 }
    )
  }
}

