import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: productId } = await params

    console.log('🔍 Looking for product:', { productId, userEmail: session.user.email })

    // Get user's business first (same approach as main products API)
    const business = await prisma.business.findFirst({
      where: {
        user: { email: session.user.email }
      }
    })

    if (!business) {
      console.log('❌ No business found for user:', session.user.email)
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    console.log('🏢 Found business:', business.id, business.companyName)

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        businessId: business.id
      }
    })

    console.log('📦 Product found:', product ? 'YES' : 'NO')

    if (!product) {
      // Try to find any product with this ID to debug
      const anyProduct = await prisma.product.findFirst({
        where: { id: productId }
      })
      console.log('🔍 Any product with this ID:', anyProduct ? 'YES' : 'NO')
      
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product
    })

  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: productId } = await params
    const body = await request.json()

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
    }

    if (!body.hsCode?.trim()) {
      return NextResponse.json({ error: 'HS Code is required' }, { status: 400 })
    }

    if (!body.unitPrice || body.unitPrice <= 0) {
      return NextResponse.json({ error: 'Valid unit price is required' }, { status: 400 })
    }

    // Get user's business first (same approach as main products API)
    const business = await prisma.business.findFirst({
      where: {
        user: { email: session.user.email }
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        businessId: business.id
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        name: body.name?.trim(),
        description: body.description?.trim() || null,
        hsCode: body.hsCode?.trim(),
        hsCodeDescription: body.hsCodeDescription?.trim() || null,
        unitOfMeasurement: body.unitOfMeasurement || 'Each',
        unitPrice: parseFloat(body.unitPrice),
        taxRate: parseFloat(body.taxRate) || 18,
        category: body.category?.trim() || null,
        serialNumber: body.serialNumber?.trim() || null,
        transactionType: body.transactionType?.trim() || null,
        rateId: body.rateId?.trim() || null,
        rateDescription: body.rateDescription?.trim() || null,
        sroNo: body.sroScheduleNo?.trim() || null,
        sroItemSerialNo: body.sroItemSerialNo?.trim() || null,
        updatedAt: new Date()
      }
    })

    console.log('Product updated successfully:', updatedProduct)

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    })

  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: productId } = await params

    // Get user's business first (same approach as main products API)
    const business = await prisma.business.findFirst({
      where: {
        user: { email: session.user.email }
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        businessId: business.id
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete product
    await prisma.product.delete({
      where: {
        id: productId
      }
    })

    console.log('Product deleted successfully:', productId)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}