import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { prisma } from '@/lib/database'
import { generateUUID } from '@/lib/uuid'
import { auth } from '@/auth'




/**
 * POST /api/settings/business/create
 * Create initial business profile for a new user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if business already exists
    const existingBusiness = await prisma.business.findFirst({
      where: {
        user: {
          email: session.user.email
        }
      }
    })

    if (existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'Business already exists' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      companyName,
      ntnNumber,
      address,
      province,
      businessType,
      sector,
      sellerCity,
      sellerContact,
      sellerEmail,
      posId,
      electronicSoftwareRegNo,
      fbrIntegratorLicenseNo,
      invoicePrefix,
      defaultPaymentTerms,
      footerText,
      defaultScenario
    } = body

    // Validation
    if (!companyName || !ntnNumber || !address || !province) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Create business record
    const newBusiness = await prisma.business.create({
      data: {
        id: generateUUID(),
        companyName,
        ntnNumber,
        address,
        province,
        businessType,
        sector,
        sellerCity: sellerCity || null,
        sellerContact: sellerContact || null,
        sellerEmail: sellerEmail || null,
        posId: posId || null,
        electronicSoftwareRegNo: electronicSoftwareRegNo || null,
        fbrIntegratorLicenseNo: fbrIntegratorLicenseNo || null,
        invoicePrefix: invoicePrefix || 'INV-',
        defaultPaymentTerms: defaultPaymentTerms || 'Payment due within 30 days',
        footerText: footerText || null,
        defaultScenario: defaultScenario || null,
        userId: user.id
      },
      select: {
        id: true,
        companyName: true,
        ntnNumber: true,
        address: true,
        province: true,
        businessType: true,
        sector: true,
        sellerCity: true,
        sellerContact: true,
        sellerEmail: true,
        posId: true,
        electronicSoftwareRegNo: true,
        fbrIntegratorLicenseNo: true,
        logoUrl: true,
        invoicePrefix: true,
        defaultPaymentTerms: true,
        footerText: true,
        defaultScenario: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      business: newBusiness,
      message: 'Business profile created successfully'
    })

  } catch (error) {
    console.error('❌ Business Creation Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create business profile',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}