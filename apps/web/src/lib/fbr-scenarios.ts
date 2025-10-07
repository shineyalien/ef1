/**
 * FBR Scenario Mapping System
 * Based on FBR Technical Documentation v1.12 - Section 9 & 10
 * Maps business activity and sector to applicable scenario IDs
 */

export interface FBRScenario {
  code: string
  description: string
  businessTypes: string[]
  sectors: string[]
}

export interface ScenarioMappingResult {
  scenarios: FBRScenario[]
  defaultScenario: string
  description: string
}

// Complete FBR Scenarios from Technical Documentation
const FBR_SCENARIOS: FBRScenario[] = [
  {
    code: 'SN001',
    description: 'Goods at standard rate to registered buyers',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN002',
    description: 'Goods at standard rate to unregistered buyers',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN003',
    description: 'Sale of Steel (Melted and Re-Rolled)',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Service Provider', 'Other'],
    sectors: ['Steel']
  },
  {
    code: 'SN004',
    description: 'Sale by Ship Breakers',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Service Provider', 'Other'],
    sectors: ['Steel']
  },
  {
    code: 'SN005',
    description: 'Reduced rate sale',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN006',
    description: 'Exempt goods sale',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN007',
    description: 'Zero rated sale',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN008',
    description: 'Sale of 3rd schedule goods',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN009',
    description: 'Cotton Spinners purchase from Cotton Ginners',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['Textile']
  },
  {
    code: 'SN010',
    description: 'Telecom services rendered or provided',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['Telecom']
  },
  {
    code: 'SN011',
    description: 'Toll Manufacturing sale by Steel sector',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Service Provider', 'Other'],
    sectors: ['Steel']
  },
  {
    code: 'SN012',
    description: 'Sale of Petroleum products',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['Petroleum']
  },
  {
    code: 'SN013',
    description: 'Electricity Supply to Retailers',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['Electricity Distribution']
  },
  {
    code: 'SN014',
    description: 'Sale of Gas to CNG stations',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['Gas Distribution']
  },
  {
    code: 'SN015',
    description: 'Sale of mobile phones',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN016',
    description: 'Processing / Conversion of Goods',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN017',
    description: 'Sale of Goods where FED is charged in ST mode',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN018',
    description: 'Services rendered or provided where FED is charged in ST mode',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN019',
    description: 'Services rendered or provided',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN020',
    description: 'Sale of Electric Vehicles',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN021',
    description: 'Sale of Cement /Concrete Block',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN022',
    description: 'Sale of Potassium Chlorate',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN023',
    description: 'Sale of CNG',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['CNG Stations']
  },
  {
    code: 'SN024',
    description: 'Goods sold that are listed in SRO 297(1)/2023',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN025',
    description: 'Drugs sold at fixed ST rate under serial 81 of Eighth Schedule Table 1',
    businessTypes: ['Manufacturer', 'Importer', 'Distributor', 'Wholesaler', 'Exporter', 'Retailer', 'Service Provider', 'Other'],
    sectors: ['Pharmaceuticals']
  },
  {
    code: 'SN026',
    description: 'Sale to End Consumer by retailers',
    businessTypes: ['Retailer', 'Wholesaler', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN027',
    description: 'Sale to End Consumer by retailers - 3rd Schedule Goods',
    businessTypes: ['Retailer', 'Wholesaler', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  },
  {
    code: 'SN028',
    description: 'Sale to End Consumer by retailers - Goods at Reduced Rate',
    businessTypes: ['Retailer', 'Wholesaler', 'Other'],
    sectors: ['All Other Sectors', 'Steel', 'FMCG', 'Textile', 'Telecom', 'Petroleum', 'Electricity Distribution', 'Gas Distribution', 'Automobile', 'CNG Stations', 'Pharmaceuticals', 'Wholesale / Retails']
  }
]

/**
 * Get applicable scenarios for a business type and sector
 */
export function getApplicableScenarios(businessType: string, sector: string): ScenarioMappingResult {
  // Normalize inputs
  const normalizedBusinessType = businessType.toLowerCase().trim()
  const normalizedSector = sector.toLowerCase().trim()

  // Find all scenarios that match the business type and sector
  const applicableScenarios = FBR_SCENARIOS.filter(scenario => {
    const businessTypeMatch = scenario.businessTypes.some(type => 
      type.toLowerCase() === normalizedBusinessType
    )
    const sectorMatch = scenario.sectors.some(s => 
      s.toLowerCase() === normalizedSector || s.toLowerCase() === 'all other sectors'
    )
    
    return businessTypeMatch && sectorMatch
  })

  // Sort scenarios by code for consistent ordering
  applicableScenarios.sort((a, b) => a.code.localeCompare(b.code))

  // Determine default scenario based on business type and sector
  let defaultScenario = 'SN001' // Default to standard rate to registered buyers
  
  if (normalizedSector === 'steel') {
    defaultScenario = 'SN003' // Steel manufacturing
  } else if (normalizedSector === 'textile') {
    defaultScenario = 'SN009' // Cotton spinners
  } else if (normalizedSector === 'telecom') {
    defaultScenario = 'SN010' // Telecom services
  } else if (normalizedSector === 'petroleum') {
    defaultScenario = 'SN012' // Petroleum products
  } else if (normalizedSector === 'electricity distribution') {
    defaultScenario = 'SN013' // Electricity supply
  } else if (normalizedSector === 'gas distribution') {
    defaultScenario = 'SN014' // Gas to CNG stations
  } else if (normalizedSector === 'cng stations') {
    defaultScenario = 'SN023' // CNG sales
  } else if (normalizedSector === 'pharmaceuticals') {
    defaultScenario = 'SN025' // Drugs at fixed ST rate
  } else if (normalizedBusinessType === 'retailer') {
    defaultScenario = 'SN026' // End consumer sales
  }

  // Generate description
  const businessTypeDesc = businessType.charAt(0).toUpperCase() + businessType.slice(1)
  const sectorDesc = sector.charAt(0).toUpperCase() + sector.slice(1)
  
  const description = `Applicable scenarios for ${businessTypeDesc} in ${sectorDesc} sector`

  return {
    scenarios: applicableScenarios,
    defaultScenario,
    description
  }
}

/**
 * Get scenario description by code
 */
export function getScenarioDescription(scenarioCode: string): string {
  const scenario = FBR_SCENARIOS.find(s => s.code === scenarioCode)
  return scenario?.description || 'Unknown scenario'
}

/**
 * Get all scenarios for a specific business type (across all sectors)
 */
export function getScenariosByBusinessType(businessType: string): FBRScenario[] {
  const normalizedBusinessType = businessType.toLowerCase().trim()
  
  return FBR_SCENARIOS.filter(scenario => 
    scenario.businessTypes.some(type => type.toLowerCase() === normalizedBusinessType)
  ).sort((a, b) => a.code.localeCompare(b.code))
}

/**
 * Get all scenarios for a specific sector (across all business types)
 */
export function getScenariosBySector(sector: string): FBRScenario[] {
  const normalizedSector = sector.toLowerCase().trim()
  
  return FBR_SCENARIOS.filter(scenario => 
    scenario.sectors.some(s => 
      s.toLowerCase() === normalizedSector || s.toLowerCase() === 'all other sectors'
    )
  ).sort((a, b) => a.code.localeCompare(b.code))
}

/**
 * Validate if a scenario is applicable for the given business type and sector
 */
export function validateScenarioApplicability(
  scenarioCode: string, 
  businessType: string, 
  sector: string
): boolean {
  const scenario = FBR_SCENARIOS.find(s => s.code === scenarioCode)
  if (!scenario) return false

  const normalizedBusinessType = businessType.toLowerCase().trim()
  const normalizedSector = sector.toLowerCase().trim()

  const businessTypeMatch = scenario.businessTypes.some(type => 
    type.toLowerCase() === normalizedBusinessType
  )
  const sectorMatch = scenario.sectors.some(s => 
    s.toLowerCase() === normalizedSector || s.toLowerCase() === 'all other sectors'
  )

  return businessTypeMatch && sectorMatch
}

// Export all scenarios for reference
export { FBR_SCENARIOS }