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
  // Mock scenarios data - in production this would come from FBR API
  const allScenarios: FBRScenario[] = [
    // Manufacturing scenarios
    {
      code: 'MFG-001',
      description: 'Manufacturing - Registered to Registered',
      businessType: 'Manufacturer',
      sector: 'Steel',
      isActive: true,
      registrationType: 'Registered',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 1
    },
    {
      code: 'MFG-002',
      description: 'Manufacturing - Registered to Unregistered',
      businessType: 'Manufacturer',
      sector: 'Steel',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 2
    },
    {
      code: 'MFG-003',
      description: 'Manufacturing - Export Sales',
      businessType: 'Manufacturer',
      sector: 'Steel',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Export',
      taxRateApplicable: 0,
      specialConditions: ['Export Certificate Required'],
      priority: 3
    },
    {
      code: 'MFG-004',
      description: 'Manufacturing - Tax Exempt Items',
      businessType: 'Manufacturer',
      sector: 'Steel',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 0,
      specialConditions: ['SRO Certificate Required'],
      priority: 4
    },
    
    // Service Provider scenarios
    {
      code: 'SRV-001',
      description: 'Services - Registered to Registered',
      businessType: 'Service Provider',
      sector: 'IT Services',
      isActive: true,
      registrationType: 'Registered',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 1
    },
    {
      code: 'SRV-002',
      description: 'Services - Registered to Unregistered',
      businessType: 'Service Provider',
      sector: 'IT Services',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 2
    },
    {
      code: 'SRV-003',
      description: 'Services - Export of Services',
      businessType: 'Service Provider',
      sector: 'IT Services',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Export',
      taxRateApplicable: 0,
      specialConditions: ['Export Certificate Required'],
      priority: 3
    },
    {
      code: 'SRV-004',
      description: 'Services - Reduced Rate IT Equipment',
      businessType: 'Service Provider',
      sector: 'IT Services',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 5,
      specialConditions: ['SRO 1125(I)/2011'],
      priority: 4
    },
    
    // Trading scenarios
    {
      code: 'TRD-001',
      description: 'Trading - Registered to Registered',
      businessType: 'Distributor',
      sector: 'Wholesale / Retails',
      isActive: true,
      registrationType: 'Registered',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 1
    },
    {
      code: 'TRD-002',
      description: 'Trading - Registered to Unregistered',
      businessType: 'Distributor',
      sector: 'Wholesale / Retails',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 2
    },
    {
      code: 'TRD-003',
      description: 'Trading - Import Goods',
      businessType: 'Distributor',
      sector: 'Wholesale / Retails',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Import',
      taxRateApplicable: 18,
      specialConditions: ['Import Documentation Required'],
      priority: 3
    },
    
    // General scenarios (available to all)
    {
      code: 'GEN-001',
      description: 'General - Registered to Registered',
      isActive: true,
      registrationType: 'Registered',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 1
    },
    {
      code: 'GEN-002',
      description: 'General - Registered to Unregistered',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      priority: 2
    },
    {
      code: 'GEN-003',
      description: 'General - Export Sales',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Export',
      taxRateApplicable: 0,
      specialConditions: ['Export Certificate Required'],
      priority: 3
    },
    
    // Provincial scenarios
    {
      code: 'PUN-001',
      description: 'Punjab - Local Sales',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      provinceRestrictions: ['Punjab'],
      priority: 1
    },
    {
      code: 'SND-001',
      description: 'Sindh - Local Sales',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      provinceRestrictions: ['Sindh'],
      priority: 1
    },
    {
      code: 'KPK-001',
      description: 'KPK - Local Sales',
      isActive: true,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 18,
      provinceRestrictions: ['KPK'],
      priority: 1
    },
    
    // Inactive scenarios (for reference)
    {
      code: 'OLD-001',
      description: 'Old Tax Rate Scenario',
      isActive: false,
      registrationType: 'Both',
      transactionType: 'Sale',
      taxRateApplicable: 16,
      effectiveTo: '2023-06-30',
      priority: 99
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
  let defaultScenario = 'GEN-001' // Fallback to general
  
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