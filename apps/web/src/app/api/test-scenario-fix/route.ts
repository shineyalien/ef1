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

    // Get business settings
    const business = await prisma.business.findFirst({
      where: {
        user: {
          email: session.user.email
        }
      },
      select: {
        companyName: true,
        businessType: true,
        sector: true,
        defaultScenario: true
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Get available scenarios
    const scenarios = await prisma.fBRScenario.findMany({
      where: {
        isActive: true,
        OR: [
          ...(business.businessType && business.sector ? [{ businessType: business.businessType, sector: business.sector }] : []),
          ...(business.businessType ? [{ businessType: business.businessType, sector: null }] : []),
          { businessType: null, sector: null }
        ]
      },
      orderBy: [
        { businessType: 'asc' },
        { sector: 'asc' },
        { code: 'asc' }
      ]
    })

    // Check if default scenario is valid
    const defaultScenarioValid = business.defaultScenario &&
      scenarios.some(s => s.code === business.defaultScenario)

    return NextResponse.json({
      success: true,
      business: {
        companyName: business.companyName,
        businessType: business.businessType,
        sector: business.sector,
        defaultScenario: business.defaultScenario
      },
      scenarios: scenarios.map(s => ({
        code: s.code,
        description: s.description,
        businessType: s.businessType,
        sector: s.sector
      })),
      validation: {
        defaultScenarioValid,
        defaultScenarioExists: !!business.defaultScenario,
        scenariosCount: scenarios.length
      }
    })

  } catch (error) {
    console.error('❌ Scenario Fix Test Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}