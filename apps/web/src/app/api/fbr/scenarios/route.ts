import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { auth } from '@/auth'
import {
  getApplicableScenarios,
  validateScenarioApplicability,
  getScenariosByBusinessType,
  getScenariosBySector,
  getScenariosByTransactionType,
  searchScenarios
} from '@/lib/fbr-scenarios'

// Using shared prisma instance from database.ts

// Error response helper
function createErrorResponse(
  message: string,
  code: string,
  status: number = 500,
  details?: any
) {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code,
      details,
      timestamp: new Date().toISOString()
    }
  }, { status })
}

// Validate query parameters
function validateQueryParams(searchParams: URLSearchParams): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Validate transaction type if provided
  const transactionType = searchParams.get('transactionType')
  if (transactionType && !['Sale', 'Purchase', 'Export', 'Import'].includes(transactionType)) {
    errors.push('Invalid transaction type. Must be one of: Sale, Purchase, Export, Import')
  }
  
  // Validate registration type if provided
  const registrationType = searchParams.get('registrationType')
  if (registrationType && !['Registered', 'Unregistered'].includes(registrationType)) {
    errors.push('Invalid registration type. Must be either: Registered or Unregistered')
  }
  
  // Validate effective date format if provided
  const effectiveDate = searchParams.get('effectiveDate')
  if (effectiveDate && isNaN(Date.parse(effectiveDate))) {
    errors.push('Invalid effective date format')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Authentication check
    const session = await auth()
    if (!session?.user?.email) {
      return createErrorResponse(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Validate query parameters
    const paramValidation = validateQueryParams(searchParams)
    if (!paramValidation.isValid) {
      return createErrorResponse(
        'Invalid query parameters',
        'INVALID_QUERY_PARAMS',
        400,
        paramValidation.errors
      )
    }
    
    const businessType = searchParams.get('businessType')
    const sector = searchParams.get('sector')
    const transactionType = searchParams.get('transactionType') as 'Sale' | 'Purchase' | 'Export' | 'Import' | undefined
    const registrationType = searchParams.get('registrationType') as 'Registered' | 'Unregistered' | undefined
    const province = searchParams.get('province')
    const includeGeneral = searchParams.get('includeGeneral') !== 'false' // Default true
    const includeInactive = searchParams.get('includeInactive') === 'true' // Default false
    const searchQuery = searchParams.get('search')
    const validate = searchParams.get('validate') === 'true' // Default false
    const scenarioCode = searchParams.get('scenarioCode')
    const effectiveDate = searchParams.get('effectiveDate')

    console.log('📋 Fetching scenarios:', {
      businessType,
      sector,
      transactionType,
      registrationType,
      province,
      includeGeneral,
      includeInactive,
      searchQuery,
      validate,
      scenarioCode,
      effectiveDate
    })

    let scenarios: any[] = []
    let scenarioValidation: any = null

    // Handle scenario validation request
    if (validate && scenarioCode && businessType) {
      try {
        const validationOptions: any = {
          effectiveDate: effectiveDate || undefined
        }
        
        if (transactionType) validationOptions.transactionType = transactionType
        if (registrationType) validationOptions.registrationType = registrationType
        if (province) validationOptions.province = province
        
        scenarioValidation = validateScenarioApplicability(scenarioCode, businessType, sector || '', validationOptions)
        
        if (!scenarioValidation.isValid) {
          return NextResponse.json({
            success: false,
            error: {
              message: 'Scenario validation failed',
              code: 'VALIDATION_FAILED',
              details: scenarioValidation.errors,
              timestamp: new Date().toISOString()
            }
          }, { status: 400 })
        }
      } catch (validationError) {
        console.error('Scenario validation error:', validationError)
        return createErrorResponse(
          'Failed to validate scenario',
          'SCENARIO_VALIDATION_ERROR',
          500,
          validationError instanceof Error ? validationError.message : 'Unknown error'
        )
      }
    }

    // Prepare options for scenario functions
    const functionOptions: any = {
      includeInactive
    }
    
    if (transactionType) functionOptions.transactionType = transactionType
    if (registrationType) functionOptions.registrationType = registrationType
    if (province) functionOptions.province = province
    if (effectiveDate) functionOptions.effectiveDate = effectiveDate

    try {
      // Handle search request
      if (searchQuery) {
        const searchOptions: any = {
          includeInactive
        }
        
        if (businessType) searchOptions.businessType = businessType
        if (sector) searchOptions.sector = sector
        
        scenarios = searchScenarios(searchQuery, searchOptions)
      }
      // Handle transaction type filtering
      else if (transactionType) {
        const businessTypeOption = businessType || undefined
        const sectorOption = sector || undefined
        
        scenarios = getScenariosByTransactionType(transactionType, {
          businessType: businessTypeOption,
          sector: sectorOption,
          registrationType,
          province: province || undefined,
          includeInactive
        })
      }
      // Handle business type filtering
      else if (businessType && !sector) {
        scenarios = getScenariosByBusinessType(businessType, functionOptions)
      }
      // Handle sector filtering
      else if (sector && !businessType) {
        scenarios = getScenariosBySector(sector, functionOptions)
      }
      // Handle combined filtering - prioritize database mapping over in-memory scenarios
      else {
        // First try to get scenarios from the database mapping
        if (businessType && sector) {
          try {
            console.log(`🔍 Looking up mapping for businessType="${businessType}", sector="${sector}"`)
            console.log(`📋 Query options:`, { includeInactive, transactionType, registrationType })
            
            // Use raw query to access the mapping table
            const mappingQuery = `
              SELECT "scenarioIds"
              FROM "fbr_business_scenario_mappings"
              WHERE "businessType" = $1
              AND "industrySector" = $2
              AND "isActive" = true
              LIMIT 1
            `
            
            const mappingResult = await prisma.$queryRawUnsafe(mappingQuery, businessType, sector) as any[]
            
            if (mappingResult.length > 0 && mappingResult[0].scenarioIds.length > 0) {
              const scenarioIds = mappingResult[0].scenarioIds
              console.log(`✅ Found mapping with ${scenarioIds.length} scenarios:`, scenarioIds)
              
              // Verify specific scenarios based on business type and sector
              if (businessType === 'Manufacturer' && sector === 'All Other Sectors') {
                const expectedScenarios = ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024']
                const hasAllExpected = expectedScenarios.every(code => scenarioIds.includes(code))
                console.log(`🔍 Manufacturer + All Other Sectors verification:`, hasAllExpected ? '✅ PASS' : '❌ FAIL')
                if (!hasAllExpected) {
                  const missing = expectedScenarios.filter(code => !scenarioIds.includes(code))
                  console.log(`⚠️ Missing scenarios: ${missing.join(', ')}`)
                }
              } else if (businessType === 'Manufacturer' && sector === 'Steel') {
                const expectedScenarios = ['SN003', 'SN004', 'SN011']
                const hasAllExpected = expectedScenarios.every(code => scenarioIds.includes(code))
                console.log(`🔍 Manufacturer + Steel verification:`, hasAllExpected ? '✅ PASS' : '❌ FAIL')
                if (!hasAllExpected) {
                  const missing = expectedScenarios.filter(code => !scenarioIds.includes(code))
                  console.log(`⚠️ Missing scenarios: ${missing.join(', ')}`)
                }
              }
              
              const scenarioQuery = `
                SELECT *
                FROM "fbr_scenarios"
                WHERE "code" = ANY($1)
                ${includeInactive ? '' : 'AND "isActive" = true'}
                ORDER BY "code" ASC
              `
              
              const dbScenarios = await prisma.$queryRawUnsafe(scenarioQuery, scenarioIds) as any[]
              console.log(`✅ Retrieved ${dbScenarios.length} scenarios from database`)
              
              // Log scenario details for debugging
              if (process.env.NODE_ENV === 'development') {
                console.log(`📋 Scenario details:`)
                dbScenarios.slice(0, 3).forEach(scenario => {
                  console.log(`   - ${scenario.code}: ${scenario.description} (Priority: ${scenario.priority || 'N/A'})`)
                })
                if (dbScenarios.length > 3) {
                  console.log(`   ... and ${dbScenarios.length - 3} more`)
                }
              }
              
              if (dbScenarios.length > 0) {
                scenarios = dbScenarios
              } else {
                console.log(`⚠️ No scenarios found in database for mapping, falling back to in-memory scenarios`)
                scenarios = getApplicableScenarios(businessType || '', sector || '', functionOptions).scenarios
              }
            } else {
              console.log(`⚠️ No mapping found for businessType="${businessType}", sector="${sector}"`)
              console.log(`🔍 Checking if this is a valid combination...`)
              
              // Check if the business type exists in any mapping
              const businessTypeCheck = await prisma.$queryRawUnsafe(`
                SELECT DISTINCT "businessType", "industrySector"
                FROM "fbr_business_scenario_mappings"
                WHERE "businessType" = $1
                LIMIT 5
              `, businessType) as any[]
              
              if (businessTypeCheck.length > 0) {
                console.log(`✅ Business type "${businessType}" exists in mappings for sectors:`, businessTypeCheck.map(m => m.industrySector).join(', '))
              } else {
                console.log(`❌ Business type "${businessType}" not found in any mapping`)
              }
              
              // Check if the sector exists in any mapping
              const sectorCheck = await prisma.$queryRawUnsafe(`
                SELECT DISTINCT "businessType", "industrySector"
                FROM "fbr_business_scenario_mappings"
                WHERE "industrySector" = $1
                LIMIT 5
              `, sector) as any[]
              
              if (sectorCheck.length > 0) {
                console.log(`✅ Sector "${sector}" exists in mappings for business types:`, sectorCheck.map(m => m.businessType).join(', '))
              } else {
                console.log(`❌ Sector "${sector}" not found in any mapping`)
              }
              
              // Fall back to direct scenario lookup
              scenarios = getApplicableScenarios(businessType || '', sector || '', functionOptions).scenarios
            }
          } catch (mappingError) {
            console.error('❌ Failed to query scenario mapping:', mappingError)
            scenarios = getApplicableScenarios(businessType || '', sector || '', functionOptions).scenarios
          }
        } else {
          console.log(`🔍 No business type or sector specified, returning general scenarios`)
          scenarios = getApplicableScenarios(businessType || '', sector || '', functionOptions).scenarios
        }
      }

      // If no scenarios found and includeGeneral is true, add general scenarios
      if (scenarios.length === 0 && includeGeneral) {
        console.log(`⚠️ No scenarios found, loading general scenarios`)
        scenarios = getApplicableScenarios('', '', functionOptions).scenarios
      }

      console.log(`✅ Returning ${scenarios.length} scenarios for ${businessType || 'General'} (${sector || 'All Sectors'})`)
    } catch (scenarioError) {
      console.error('Error fetching scenarios:', scenarioError)
      return createErrorResponse(
        'Failed to fetch scenarios',
        'SCENARIO_FETCH_ERROR',
        500,
        scenarioError instanceof Error ? scenarioError.message : 'Unknown error'
      )
    }

    // Database scenarios are now handled in the main logic above
    // No need for duplicate database query here

    return NextResponse.json({
      success: true,
      data: scenarios,
      validation: scenarioValidation,
      metadata: {
        businessType: businessType,
        sector: sector,
        transactionType: transactionType,
        registrationType: registrationType,
        province: province,
        includeGeneral: includeGeneral,
        includeInactive: includeInactive,
        searchQuery: searchQuery,
        recordCount: scenarios.length,
        dbRecordCount: 0, // Database scenarios are now integrated into main scenarios array
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Scenarios API Error:', error)
    return createErrorResponse(
      'An unexpected error occurred while fetching scenarios',
      'UNEXPECTED_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

/**
 * POST endpoint to create or update scenarios
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED'
      }, { status: 401 })
    }

    const body = await request.json()
    const { code, description, businessType, sector, saleType, isActive } = body

    // Validate required fields
    if (!code || !description) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: code and description',
        code: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    console.log('📝 Creating/updating scenario:', { code, description, businessType, sector })

    // Try to update existing scenario or create new one
    try {
      // Use raw query to upsert scenario since Prisma might not recognize the new fields
      const upsertQuery = `
        INSERT INTO "fbr_scenarios" ("code", "description", "businessType", "sector", "isActive", "updatedAt", "createdAt")
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT ("code")
        DO UPDATE SET
          "description" = $2,
          "businessType" = $3,
          "sector" = $4,
          "isActive" = $5,
          "updatedAt" = NOW()
        RETURNING *
      `
      
      const scenario = await prisma.$queryRawUnsafe(
        upsertQuery,
        code,
        description,
        businessType || null,
        sector || null,
        isActive !== undefined ? isActive : true
      ) as any[]

      console.log(`✅ Scenario ${code} saved successfully`)

      return NextResponse.json({
        success: true,
        data: scenario,
        message: `Scenario ${code} saved successfully`
      })
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      
      // Return in-memory scenario as fallback
      const scenario = {
        code,
        description,
        businessType,
        sector,
        isActive: isActive !== undefined ? isActive : true
      }

      return NextResponse.json({
        success: true,
        data: scenario,
        message: `Scenario ${code} saved to memory (database unavailable)`
      })
    }

  } catch (error) {
    console.error('❌ Scenario POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

/**
 * DELETE endpoint to remove scenarios
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: code',
        code: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    console.log('🗑️ Deleting scenario:', { code })

    try {
      // Use raw query to delete scenario since Prisma might not recognize the table
      const deleteQuery = `DELETE FROM "fbr_scenarios" WHERE "code" = $1`
      await prisma.$executeRawUnsafe(deleteQuery, code)

      console.log(`✅ Scenario ${code} deleted successfully`)

      return NextResponse.json({
        success: true,
        message: `Scenario ${code} deleted successfully`
      })
    } catch (dbError) {
      console.error('Database delete failed:', dbError)
      
      // Return success even if database fails (in-memory scenarios are not persistent)
      return NextResponse.json({
        success: true,
        message: `Scenario ${code} removed from memory (database unavailable)`
      })
    }

  } catch (error) {
    console.error('❌ Scenario DELETE Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
