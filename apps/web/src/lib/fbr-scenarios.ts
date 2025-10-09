/**
 * FBR Scenario Management System
 *
 * Provides scenario mapping and validation for FBR compliance
 */

export interface FBRScenario {
  code: string
  description: string
  businessType?: string
  sector?: string
  isActive: boolean
  registrationType?: 'Registered' | 'Unregistered' | 'Both'
  transactionType?: 'Sale' | 'Purchase' | 'Export' | 'Import' | 'Both'
  taxRateApplicable?: number
  specialConditions?: string[]
  provinceRestrictions?: string[]
  effectiveFrom?: string
  effectiveTo?: string
  priority?: number
  saleType?: string
}

export interface ScenarioMapping {
  scenarios: FBRScenario[]
  defaultScenario: string
  businessType?: string
  sector?: string
}

/**
 * Get applicable scenarios based on business type and sector
 */
export function getApplicableScenarios(
  businessType: string,
  sector: string,
  options?: {
    transactionType?: 'Sale' | 'Purchase' | 'Export' | 'Import'
    registrationType?: 'Registered' | 'Unregistered'
    province?: string
    includeInactive?: boolean
    effectiveDate?: string
  }
): ScenarioMapping {
  // Official FBR Scenarios from Technical Documentation (SN001-SN028)
  const allScenarios: FBRScenario[] = [
    {
      code: 'SN001',
      description: 'Goods at standard rate to registered buyers',
      saleType: 'Goods at Standard Rate (default)',
      isActive: true,
      registrationType: 'Registered',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 1
    },
    {
      code: 'SN002',
      description: 'Goods at standard rate to unregistered buyers',
      saleType: 'Goods at Standard Rate (default)',
      isActive: true,
      registrationType: 'Unregistered',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 2
    },
    {
      code: 'SN003',
      description: 'Sale of Steel (Melted and Re-Rolled)',
      saleType: 'Steel Melting and re-rolling',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 3
    },
    {
      code: 'SN004',
      description: 'Sale by Ship Breakers',
      saleType: 'Ship breaking',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 4
    },
    {
      code: 'SN005',
      description: 'Reduced rate sale',
      saleType: 'Goods at Reduced Rate',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 5,
      priority: 5
    },
    {
      code: 'SN006',
      description: 'Exempt goods sale',
      saleType: 'Exempt Goods',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 0,
      priority: 6
    },
    {
      code: 'SN007',
      description: 'Zero rated sale',
      saleType: 'Goods at zero-rate',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 0,
      priority: 7
    },
    {
      code: 'SN008',
      description: 'Sale of 3rd schedule goods',
      saleType: '3rd Schedule Goods',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 8
    },
    {
      code: 'SN009',
      description: 'Cotton Spinners purchase from Cotton Ginners (Textile Sector)',
      saleType: 'Cotton Ginners',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Purchase',
      taxRateApplicable: 0,
      priority: 9
    },
    {
      code: 'SN010',
      description: 'Telecom services rendered or provided',
      saleType: 'Telecommunication services',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 10
    },
    {
      code: 'SN011',
      description: 'Toll Manufacturing sale by Steel sector',
      saleType: 'Toll Manufacturing',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 11
    },
    {
      code: 'SN012',
      description: 'Sale of Petroleum products',
      saleType: 'Petroleum Products',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 12
    },
    {
      code: 'SN013',
      description: 'Electricity Supply to Retailers',
      saleType: 'Electricity Supply to Retailers',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 13
    },
    {
      code: 'SN014',
      description: 'Sale of Gas to CNG stations',
      saleType: 'Gas to CNG stations',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 14
    },
    {
      code: 'SN015',
      description: 'Sale of mobile phones',
      saleType: 'Mobile Phones',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 15
    },
    {
      code: 'SN016',
      description: 'Processing / Conversion of Goods',
      saleType: 'Processing/ Conversion of Goods',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 16
    },
    {
      code: 'SN017',
      description: 'Sale of Goods where FED is charged in ST mode',
      saleType: 'Goods (FED in ST Mode)',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 17
    },
    {
      code: 'SN018',
      description: 'Services rendered or provided where FED is charged in ST mode',
      saleType: 'Services (FED in ST Mode)',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 18
    },
    {
      code: 'SN019',
      description: 'Services rendered or provided',
      saleType: 'Services',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 19
    },
    {
      code: 'SN020',
      description: 'Sale of Electric Vehicles',
      saleType: 'Electric Vehicle',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 20
    },
    {
      code: 'SN021',
      description: 'Sale of Cement /Concrete Block',
      saleType: 'Cement /Concrete Block',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 21
    },
    {
      code: 'SN022',
      description: 'Sale of Potassium Chlorate',
      saleType: 'Potassium Chlorate',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 22
    },
    {
      code: 'SN023',
      description: 'Sale of CNG',
      saleType: 'CNG Sales',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 23
    },
    {
      code: 'SN024',
      description: 'Goods sold that are listed in SRO 297(1)/2023',
      saleType: 'Goods as per SRO.297(|)/2023',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 24
    },
    {
      code: 'SN025',
      description: 'Drugs sold at fixed ST rate under serial 81 of Eighth Schedule Table 1',
      saleType: 'Non-Adjustable Supplies',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 25
    },
    {
      code: 'SN026',
      description: 'Sale to End Consumer by retailers',
      saleType: 'Goods at Standard Rate (default)',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 26,
      specialConditions: ['Applicable only if registered as retailer in sales tax profile']
    },
    {
      code: 'SN027',
      description: 'Sale to End Consumer by retailers',
      saleType: '3rd Schedule Goods',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 27,
      specialConditions: ['Applicable only if registered as retailer in sales tax profile']
    },
    {
      code: 'SN028',
      description: 'Sale to End Consumer by retailers',
      saleType: 'Goods at Reduced Rate',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 5,
      priority: 28,
      specialConditions: ['Applicable only if registered as retailer in sales tax profile']
    }
  ]

  // Get effective date for filtering
  const effectiveDate = options?.effectiveDate || new Date().toISOString().split('T')[0]
  
  // Filter scenarios based on business type, sector, and other criteria
  const applicableScenarios = allScenarios.filter(scenario => {
    // Filter inactive scenarios unless explicitly requested
    if (!scenario.isActive && !options?.includeInactive) {
      return false
    }
    
    // Filter by effective date
    if (scenario.effectiveFrom && effectiveDate && scenario.effectiveFrom > effectiveDate) {
      return false
    }
    
    if (scenario.effectiveTo && effectiveDate && scenario.effectiveTo < effectiveDate) {
      return false
    }
    
    // Filter by transaction type
    if (options?.transactionType &&
        scenario.transactionType &&
        scenario.transactionType !== 'Both' &&
        scenario.transactionType !== options.transactionType) {
      return false
    }
    
    // Filter by registration type
    if (options?.registrationType &&
        scenario.registrationType &&
        scenario.registrationType !== 'Both' &&
        scenario.registrationType !== options.registrationType) {
      return false
    }
    
    // Filter by province
    if (options?.province &&
        scenario.provinceRestrictions &&
        !scenario.provinceRestrictions.includes(options.province)) {
      return false
    }
    
    // Include general scenarios (no business type or sector specified)
    if (!scenario.businessType && !scenario.sector) {
      return true
    }
    
    // Match business type and sector
    if (scenario.businessType === businessType && scenario.sector === sector) {
      return true
    }
    
    // Match business type only
    if (scenario.businessType === businessType && !scenario.sector) {
      return true
    }
    
    return false
  })
  
  // Sort by priority (lower number = higher priority)
  applicableScenarios.sort((a, b) => (a.priority || 99) - (b.priority || 99))

  // Determine default scenario
  let defaultScenario = 'SN001' // Fallback to standard rate scenario
  
  // Try to find a specific scenario for this business type
  const specificScenario = applicableScenarios.find(s => s.businessType === businessType)
  if (specificScenario) {
    defaultScenario = specificScenario.code
  }

  return {
    scenarios: applicableScenarios,
    defaultScenario
  }
}

/**
 * Get scenario description by code
 */
export function getScenarioDescription(scenarioCode: string): string {
  const scenarios = getApplicableScenarios('', '')
  const scenario = scenarios.scenarios.find(s => s.code === scenarioCode)
  return scenario?.description || 'Unknown Scenario'
}

/**
 * Validate if scenario is applicable for business type and sector
 */
export function validateScenarioApplicability(
  scenarioCode: string,
  businessType: string,
  sector: string,
  options?: {
    transactionType?: 'Sale' | 'Purchase' | 'Export' | 'Import'
    registrationType?: 'Registered' | 'Unregistered'
    province?: string
    effectiveDate?: string
  }
): {
  isValid: boolean
  errors: string[]
  warnings: string[]
  scenario?: FBRScenario
} {
  const result = {
    isValid: false,
    errors: [] as string[],
    warnings: [] as string[],
    scenario: undefined as FBRScenario | undefined
  }
  
  // Validate inputs
  if (!scenarioCode || typeof scenarioCode !== 'string') {
    result.errors.push('Scenario code is required and must be a string')
    return result
  }
  
  if (!businessType || typeof businessType !== 'string') {
    result.errors.push('Business type is required and must be a string')
    return result
  }
  
  // Get applicable scenarios
  const scenarios = getApplicableScenarios(businessType, sector, options)
  const scenario = scenarios.scenarios.find(s => s.code === scenarioCode)
  
  if (!scenario) {
    result.errors.push(`Scenario ${scenarioCode} is not applicable for business type ${businessType}${sector ? ` in sector ${sector}` : ''}`)
    return result
  }
  
  result.scenario = scenario
  
  // Check if scenario is active
  if (!scenario.isActive) {
    result.errors.push(`Scenario ${scenarioCode} is not active`)
    return result
  }
  
  // Check effective dates
  const effectiveDate = options?.effectiveDate || new Date().toISOString().split('T')[0]
  
  if (scenario.effectiveFrom && effectiveDate && scenario.effectiveFrom > effectiveDate) {
    result.errors.push(`Scenario ${scenarioCode} is not yet effective (effective from ${scenario.effectiveFrom})`)
    return result
  }
  
  if (scenario.effectiveTo && effectiveDate && scenario.effectiveTo < effectiveDate) {
    result.errors.push(`Scenario ${scenarioCode} has expired (effective until ${scenario.effectiveTo})`)
    return result
  }
  
  // Check transaction type
  if (options?.transactionType &&
      scenario.transactionType &&
      scenario.transactionType !== 'Both' &&
      scenario.transactionType !== options.transactionType) {
    result.errors.push(`Scenario ${scenarioCode} is not applicable for transaction type ${options.transactionType}`)
    return result
  }
  
  // Check registration type
  if (options?.registrationType &&
      scenario.registrationType &&
      scenario.registrationType !== 'Both' &&
      scenario.registrationType !== options.registrationType) {
    result.errors.push(`Scenario ${scenarioCode} is not applicable for registration type ${options.registrationType}`)
    return result
  }
  
  // Check province restrictions
  if (options?.province &&
      scenario.provinceRestrictions &&
      !scenario.provinceRestrictions.includes(options.province)) {
    result.errors.push(`Scenario ${scenarioCode} is not applicable for province ${options.province}`)
    return result
  }
  
  // Check for special conditions
  if (scenario.specialConditions && scenario.specialConditions.length > 0) {
    result.warnings.push(`Scenario ${scenarioCode} has special conditions: ${scenario.specialConditions.join(', ')}`)
  }
  
  result.isValid = true
  return result
}

/**
 * Get all available scenarios (for admin/testing purposes)
 */
export function getAllScenarios(includeInactive: boolean = false): FBRScenario[] {
  // Get all scenarios without filtering by business type or sector
  const scenarios = getApplicableScenarios('', '', { includeInactive })
  return scenarios.scenarios
}

/**
 * Get scenarios by business type
 */
export function getScenariosByBusinessType(
  businessType: string,
  options?: {
    transactionType?: 'Sale' | 'Purchase' | 'Export' | 'Import'
    registrationType?: 'Registered' | 'Unregistered'
    province?: string
    includeInactive?: boolean
  }
): FBRScenario[] {
  const scenarios = getApplicableScenarios(businessType, '', options)
  return scenarios.scenarios
}

/**
 * Get scenarios by sector
 */
export function getScenariosBySector(
  sector: string,
  options?: {
    transactionType?: 'Sale' | 'Purchase' | 'Export' | 'Import'
    registrationType?: 'Registered' | 'Unregistered'
    province?: string
    includeInactive?: boolean
  }
): FBRScenario[] {
  const scenarios = getApplicableScenarios('', sector, options)
  return scenarios.scenarios
}

/**
 * Get scenarios by transaction type
 */
export function getScenariosByTransactionType(
  transactionType: 'Sale' | 'Purchase' | 'Export' | 'Import',
  options?: {
    businessType?: string
    sector?: string
    registrationType?: 'Registered' | 'Unregistered'
    province?: string
    includeInactive?: boolean
  }
): FBRScenario[] {
  const scenarios = getApplicableScenarios(
    options?.businessType || '',
    options?.sector || '',
    { ...options, transactionType }
  )
  return scenarios.scenarios
}

/**
 * Get default scenario for business type and sector
 */
export function getDefaultScenario(
  businessType: string,
  sector: string,
  options?: {
    transactionType?: 'Sale' | 'Purchase' | 'Export' | 'Import'
    registrationType?: 'Registered' | 'Unregistered'
    province?: string
  }
): FBRScenario | null {
  const scenarios = getApplicableScenarios(businessType, sector, options)
  const scenarioCode = scenarios.defaultScenario
  return scenarios.scenarios.find(s => s.code === scenarioCode) || null
}

/**
 * Search scenarios by code or description
 */
export function searchScenarios(
  query: string,
  options?: {
    businessType?: string
    sector?: string
    includeInactive?: boolean
  }
): FBRScenario[] {
  const allScenarios = getAllScenarios(options?.includeInactive)
  const lowerQuery = query.toLowerCase()
  
  return allScenarios.filter(scenario => {
    // Filter by business type if specified
    if (options?.businessType && scenario.businessType &&
        scenario.businessType !== options.businessType) {
      return false
    }
    
    // Filter by sector if specified
    if (options?.sector && scenario.sector &&
        scenario.sector !== options.sector) {
      return false
    }
    
    // Search in code and description
    return scenario.code.toLowerCase().includes(lowerQuery) ||
           scenario.description.toLowerCase().includes(lowerQuery)
  })
}

/**
 * Get scenarios by business type and sector using the official FBR mapping
 * This function implements the scenario filtering logic based on the FBR technical documentation
 */
export async function getScenariosByBusinessTypeAndSector(
  businessType: string,
  sector: string,
  options?: {
    transactionType?: 'Sale' | 'Purchase' | 'Export' | 'Import'
    registrationType?: 'Registered' | 'Unregistered'
    province?: string
    includeInactive?: boolean
    effectiveDate?: string
  }
): Promise<ScenarioMapping> {
  // Import PrismaClient dynamically to avoid server-side import issues
  const { prisma } = await import('@/lib/database')
  
  
  try {
    // First try to get scenarios using the business type to scenario mapping
    const mapping = await (prisma as any).fBRBusinessScenarioMapping.findFirst({
      where: {
        businessType,
        industrySector: sector,
        isActive: true
      }
    })
    
    let scenarios: FBRScenario[] = []
    
    if (mapping && mapping.scenarioIds.length > 0) {
      // Get scenarios from the mapping
      scenarios = await prisma.fBRScenario.findMany({
        where: {
          code: { in: mapping.scenarioIds },
          isActive: options?.includeInactive ? undefined : true
        },
        orderBy: { code: 'asc' }
      }) as FBRScenario[]
    } else {
      // If no mapping found, fall back to the in-memory scenarios
      const inMemoryScenarios = getApplicableScenarios(businessType, sector, options)
      scenarios = inMemoryScenarios.scenarios
    }
    
    // Apply additional filtering based on options
    if (options?.transactionType) {
      scenarios = scenarios.filter(scenario =>
        !scenario.transactionType ||
        scenario.transactionType === 'Both' ||
        scenario.transactionType === options.transactionType
      )
    }
    
    if (options?.registrationType) {
      scenarios = scenarios.filter(scenario =>
        !scenario.registrationType ||
        scenario.registrationType === 'Both' ||
        scenario.registrationType === options.registrationType
      )
    }
    
    if (options?.province && scenarios.length > 0) {
      scenarios = scenarios.filter(scenario =>
        !scenario.provinceRestrictions ||
        scenario.provinceRestrictions.includes(options.province!)
      )
    }
    
    // Sort by priority (lower number = higher priority)
    scenarios.sort((a, b) => (a.priority || 99) - (b.priority || 99))
    
    // Determine default scenario
    let defaultScenario = 'SN001' // Fallback to standard rate scenario
    
    // Try to find a specific scenario for this business type
    const specificScenario = scenarios.find(s =>
      s.businessType === businessType ||
      s.code === 'SN001' // Always fall back to SN001 if possible
    )
    
    if (specificScenario) {
      defaultScenario = specificScenario.code
    }
    
    return {
      scenarios,
      defaultScenario,
      businessType,
      sector
    }
  } finally {
    // No need to disconnect as we're using the shared instance
  }
}

/**
 * Get all available business types
 */
export async function getAllBusinessTypes(): Promise<string[]> {
  const { prisma } = await import('@/lib/database')
  
  
  try {
    const mappings = await (prisma as any).fBRBusinessScenarioMapping.findMany({
      where: { isActive: true },
      select: { businessType: true },
      distinct: ['businessType']
    })
    
    return mappings.map((m: any) => m.businessType).sort()
  } finally {
    // No need to disconnect as we're using the shared instance
  }
}

/**
 * Get all available sectors for a business type
 */
export async function getSectorsByBusinessType(businessType: string): Promise<string[]> {
  const { prisma } = await import('@/lib/database')
  
  
  try {
    const mappings = await (prisma as any).fBRBusinessScenarioMapping.findMany({
      where: {
        businessType,
        isActive: true
      },
      select: { industrySector: true },
      distinct: ['industrySector']
    })
    
    return mappings.map((m: any) => m.industrySector).sort()
  } finally {
    // No need to disconnect as we're using the shared instance
  }
}