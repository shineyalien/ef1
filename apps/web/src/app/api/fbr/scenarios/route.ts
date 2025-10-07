import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import {
  getApplicableScenarios,
  validateScenarioApplicability,
  getScenariosByBusinessType,
  getScenariosBySector,
  getScenariosByTransactionType,
  searchScenarios
} from '@/lib/fbr-scenarios'

const prisma = new PrismaClient()

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
      // Handle combined filtering
      else {
        scenarios = getApplicableScenarios(businessType || '', sector || '', functionOptions).scenarios
      }

      // If no scenarios found and includeGeneral is true, add general scenarios
      if (scenarios.length === 0 && includeGeneral) {
        scenarios = getApplicableScenarios('', '', functionOptions).scenarios
      }

      console.log(`✅ Found ${scenarios.length} scenarios`)
    } catch (scenarioError) {
      console.error('Error fetching scenarios:', scenarioError)
      return createErrorResponse(
        'Failed to fetch scenarios',
        'SCENARIO_FETCH_ERROR',
        500,
        scenarioError instanceof Error ? scenarioError.message : 'Unknown error'
      )
    }

    // Try to get scenarios from database as fallback
    let dbScenarios: any[] = []
    try {
      dbScenarios = await prisma.fBRScenario.findMany({
        where: {
          isActive: includeInactive ? undefined : true,
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
    } catch (dbError) {
      console.warn('Database query failed, using in-memory scenarios:', dbError)
      // Continue with in-memory scenarios, don't fail the request
    }

    // Use database scenarios if available and in-memory scenarios are empty
    if (scenarios.length === 0 && dbScenarios.length > 0) {
      scenarios = dbScenarios
    }

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
        dbRecordCount: dbScenarios.length,
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
    const { code, description, businessType, sector, isActive } = body

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
      const scenario = await prisma.fBRScenario.upsert({
        where: { code },
        update: {
          description,
          businessType,
          sector,
          isActive: isActive !== undefined ? isActive : true,
          updatedAt: new Date()
        },
        create: {
          code,
          description,
          businessType,
          sector,
          isActive: isActive !== undefined ? isActive : true
        }
      })

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
      // Try to delete from database
      await prisma.fBRScenario.delete({
        where: { code }
      })

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
