import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

// Province mapping for FBR integration
const PROVINCE_MAP = {
  'Punjab': 1,
  'Sindh': 2,
  'Khyber Pakhtunkhwa': 3,
  'KP': 3,
  'Balochistan': 4,
  'Gilgit-Baltistan': 5,
  'GB': 5,
  'Azad Kashmir': 6,
  'AK': 6,
  'Islamabad': 7,
  'ICT': 7
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📋 Fetching current business profile for:', session.user.email)

    // Get user first
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's most recent business profile
    const business = await prisma.business.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    if (!business) {
      console.warn('⚠️ No business found for user')
      
      // Return default business profile for development
      return NextResponse.json({
        id: 'default-business',
        companyName: 'Default Business',
        ntnNumber: '0000000',
        province: 'Punjab',
        provinceId: 1,
        address: 'Default Address',
        businessType: 'General',
        sector: 'Other',
        fbrSetupComplete: false,
        fbrSetupSkipped: false,
        integrationMode: 'local'
      })
    }

    // Map province name to province ID
    const provinceId = PROVINCE_MAP[business.province as keyof typeof PROVINCE_MAP] || 1

    console.log('✅ Business profile found:', {
      id: business.id,
      name: business.companyName,
      province: business.province,
      provinceId
    })

    return NextResponse.json({
      id: business.id,
      companyName: business.companyName,
      ntnNumber: business.ntnNumber,
      province: business.province,
      provinceId,
      address: business.address,
      businessType: business.businessType,
      sector: business.sector,
      fbrSetupComplete: business.fbrSetupComplete,
      fbrSetupSkipped: business.fbrSetupSkipped,
      integrationMode: business.integrationMode,
      sandboxValidated: business.sandboxValidated,
      productionTokenAvailable: business.productionTokenAvailable
    })

  } catch (error) {
    console.error('❌ Business Profile API Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
