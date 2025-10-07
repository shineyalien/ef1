import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const businessType = searchParams.get('businessType')
    const sector = searchParams.get('sector')
    const includeGeneral = searchParams.get('includeGeneral') !== 'false' // Default true

    console.log('📋 Fetching scenarios:', { businessType, sector, includeGeneral })

    // Get scenarios from database
    const scenarios = await prisma.fBRScenario.findMany({
      where: {
        isActive: true,
        OR: [
          // Specific business type and sector
          ...(businessType && sector ? [{ businessType, sector }] : []),
          // Specific business type, any sector
          ...(businessType ? [{ businessType, sector: null }] : []),
          // General scenarios (no business type or sector specified)
          ...(includeGeneral ? [{ businessType: null, sector: null }] : [])
        ]
      },
      orderBy: [
        { businessType: 'asc' },
        { sector: 'asc' },
        { code: 'asc' }
      ]
    })

    console.log(`✅ Found ${scenarios.length} scenarios`)

    return NextResponse.json({
      success: true,
      data: scenarios,
      metadata: {
        businessType,
        sector,
        recordCount: scenarios.length
      }
    })

  } catch (error) {
    console.error('❌ Scenarios API Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
