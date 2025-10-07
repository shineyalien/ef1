import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

// Mock scenarios data with business type and sector mapping
const MOCK_SCENARIOS = [
  // Manufacturing scenarios
  { code: 'MFG-001', description: 'Manufacturing - Registered to Registered', businessType: 'Manufacturer', sector: 'Steel' },
  { code: 'MFG-002', description: 'Manufacturing - Registered to Unregistered', businessType: 'Manufacturer', sector: 'Steel' },
  { code: 'MFG-003', description: 'Manufacturing - Export Sales', businessType: 'Manufacturer', sector: 'Steel' },
  { code: 'MFG-004', description: 'Manufacturing - Zero Rated Sales', businessType: 'Manufacturer', sector: 'Steel' },
  
  { code: 'MFG-TEX-001', description: 'Textile Manufacturing - Registered to Registered', businessType: 'Manufacturer', sector: 'Textile' },
  { code: 'MFG-TEX-002', description: 'Textile Manufacturing - Export Sales', businessType: 'Manufacturer', sector: 'Textile' },
  
  { code: 'MFG-ELEC-001', description: 'Electronics Manufacturing - Registered to Registered', businessType: 'Manufacturer', sector: 'Electronics' },
  { code: 'MFG-ELEC-002', description: 'Electronics Manufacturing - Registered to Unregistered', businessType: 'Manufacturer', sector: 'Electronics' },
  
  // Trading scenarios
  { code: 'TRD-001', description: 'Trading - Registered to Registered', businessType: 'Trader', sector: 'General Trading' },
  { code: 'TRD-002', description: 'Trading - Registered to Unregistered', businessType: 'Trader', sector: 'General Trading' },
  { code: 'TRD-003', description: 'Trading - Import and Local Sale', businessType: 'Trader', sector: 'General Trading' },
  
  // Service Provider scenarios
  { code: 'SRV-001', description: 'Services - Registered to Registered', businessType: 'Service Provider', sector: 'IT Services' },
  { code: 'SRV-002', description: 'Services - Registered to Unregistered', businessType: 'Service Provider', sector: 'IT Services' },
  { code: 'SRV-003', description: 'Services - Export of Services', businessType: 'Service Provider', sector: 'IT Services' },
  
  { code: 'SRV-CON-001', description: 'Consulting Services - Registered to Registered', businessType: 'Service Provider', sector: 'Consulting' },
  { code: 'SRV-CON-002', description: 'Consulting Services - Cross-border Services', businessType: 'Service Provider', sector: 'Consulting' },
  
  // Distributor scenarios
  { code: 'DST-001', description: 'Distribution - Registered to Registered', businessType: 'Distributor', sector: 'Food & Beverage' },
  { code: 'DST-002', description: 'Distribution - Registered to Unregistered', businessType: 'Distributor', sector: 'Food & Beverage' },
  { code: 'DST-003', description: 'Distribution - Bulk Sales', businessType: 'Distributor', sector: 'Food & Beverage' },
  
  // Retailer scenarios
  { code: 'RTL-001', description: 'Retail - POS Sales to General Public', businessType: 'Retailer', sector: 'Retail' },
  { code: 'RTL-002', description: 'Retail - Credit Sales to Registered', businessType: 'Retailer', sector: 'Retail' },
  
  // General scenarios (available to all)
  { code: 'GEN-001', description: 'General - Registered to Registered', businessType: null, sector: null },
  { code: 'GEN-002', description: 'General - Registered to Unregistered', businessType: null, sector: null },
  { code: 'GEN-003', description: 'General - Export Sales', businessType: null, sector: null },
  { code: 'GEN-004', description: 'General - Zero Rated Sales', businessType: null, sector: null },
]

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

    // Try to get from database first
    let scenarios = await prisma.fBRScenario.findMany({
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

    // If no scenarios in database, use mock data and seed database
    if (scenarios.length === 0) {
      console.log('💾 Seeding scenarios database with mock data...')
      
      // Seed database
      for (const scenario of MOCK_SCENARIOS) {
        try {
          await prisma.fBRScenario.upsert({
            where: { code: scenario.code },
            create: scenario,
            update: scenario
          })
        } catch (error) {
          console.warn(`⚠️ Failed to seed scenario ${scenario.code}:`, error)
        }
      }
      
      // Refetch scenarios
      scenarios = await prisma.fBRScenario.findMany({
        where: {
          isActive: true,
          OR: [
            ...(businessType && sector ? [{ businessType, sector }] : []),
            ...(businessType ? [{ businessType, sector: null }] : []),
            ...(includeGeneral ? [{ businessType: null, sector: null }] : [])
          ]
        },
        orderBy: [
          { businessType: 'asc' },
          { sector: 'asc' },
          { code: 'asc' }
        ]
      })
    }

    // If still no scenarios, filter mock data manually
    if (scenarios.length === 0) {
      const filtered = MOCK_SCENARIOS.filter(s => {
        // Include general scenarios
        if (includeGeneral && !s.businessType && !s.sector) return true
        
        // Match business type and sector
        if (businessType && sector) {
          return s.businessType === businessType && s.sector === sector
        }
        
        // Match business type only
        if (businessType) {
          return s.businessType === businessType
        }
        
        return false
      })

      scenarios = filtered.map(s => ({
        ...s,
        id: s.code,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })) as any
    }

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

// Create or update scenarios
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    // Seed database with mock scenarios
    if (action === 'seed') {
      console.log('💾 Seeding scenarios database...')
      
      const results = {
        created: 0,
        updated: 0,
        failed: 0
      }

      for (const scenario of MOCK_SCENARIOS) {
        try {
          const existing = await prisma.fBRScenario.findUnique({
            where: { code: scenario.code }
          })

          if (existing) {
            await prisma.fBRScenario.update({
              where: { code: scenario.code },
              data: scenario
            })
            results.updated++
          } else {
            await prisma.fBRScenario.create({
              data: scenario
            })
            results.created++
          }
        } catch (error) {
          console.warn(`⚠️ Failed to seed scenario ${scenario.code}:`, error)
          results.failed++
        }
      }

      console.log('✅ Scenarios seeding complete:', results)

      return NextResponse.json({
        success: true,
        message: 'Scenarios database seeded',
        results
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('❌ Scenarios Seed Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
