import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/database'
import { auth } from '@/auth'



/**
 * GET /api/settings/business
 * Get business profile information
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const business = await prisma.business.findFirst({
      where: { 
        user: { 
          email: session.user.email 
        } 
      },
      select: {
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
        defaultScenario: true
      }
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      business
    })

  } catch (error) {
    console.error('❌ Business Settings API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch business settings'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings/business
 * Update business profile information
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

    const business = await prisma.business.findFirst({
      where: { 
        user: { 
          email: session.user.email 
        } 
      }
    })

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: business.id },
      data: {
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
        invoicePrefix: invoicePrefix || null,
        defaultPaymentTerms: defaultPaymentTerms || null,
        footerText: footerText || null,
        defaultScenario: defaultScenario || null
      },
      select: {
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
        defaultScenario: true
      }
    })

    return NextResponse.json({
      success: true,
      business: updatedBusiness
    })

  } catch (error) {
    console.error('❌ Business Settings Update Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update business settings'
      },
      { status: 500 }
    )
  }
}
