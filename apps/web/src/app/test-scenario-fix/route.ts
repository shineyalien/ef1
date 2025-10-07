import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🧪 Testing scenario fix...')

    // Test 1: Get business settings
    const businessRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/settings/business`, {
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      }
    })

    let business = null
    if (businessRes.ok) {
      const businessData = await businessRes.json()
      business = businessData.business
      console.log('✅ Business settings loaded:', { 
        businessType: business?.businessType, 
        sector: business?.sector, 
        defaultScenario: business?.defaultScenario 
      })
    }

    // Test 2: Load scenarios using FBR library (like invoice create page)
    const { getApplicableScenarios } = await import('@/lib/fbr-scenarios')
    const scenarioResult = getApplicableScenarios(business?.businessType || '', business?.sector || '')
    
    console.log('✅ Scenarios from library:', {
      count: scenarioResult.scenarios.length,
      defaultScenario: scenarioResult.defaultScenario,
      scenarios: scenarioResult.scenarios.map(s => ({ code: s.code, description: s.description }))
    })

    // Test 3: Compare with API (to see if hardcoded fallback appears)
    const scenariosApiRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/fbr/scenarios?businessType=${encodeURIComponent(business?.businessType || '')}&sector=${encodeURIComponent(business?.sector || '')}&includeGeneral=true`, {
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      }
    })

    let apiScenarios = []
    if (scenariosApiRes.ok) {
      const apiData = await scenariosApiRes.json()
      apiScenarios = apiData.data || []
      console.log('⚠️ Scenarios from API (may have hardcoded fallback):', {
        count: apiScenarios.length,
        firstScenario: apiScenarios[0] ? { code: apiScenarios[0].code, description: apiScenarios[0].description } : null
      })
    }

    return NextResponse.json({
      success: true,
      business: {
        businessType: business?.businessType,
        sector: business?.sector,
        defaultScenario: business?.defaultScenario
      },
      libraryScenarios: {
        count: scenarioResult.scenarios.length,
        defaultScenario: scenarioResult.defaultScenario,
        scenarios: scenarioResult.scenarios.map(s => ({ code: s.code, description: s.description }))
      },
      apiScenarios: {
        count: apiScenarios.length,
        scenarios: apiScenarios.map((s: any) => ({ code: s.code, description: s.description }))
      },
      fixWorking: business?.defaultScenario === scenarioResult.defaultScenario,
      recommendation: business?.defaultScenario ? 
        `Business default scenario "${business.defaultScenario}" should be used in invoice form` : 
        'No default scenario set in business settings'
    })

  } catch (error) {
    console.error('❌ Scenario fix test error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}