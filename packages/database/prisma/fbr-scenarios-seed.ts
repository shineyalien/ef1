import { PrismaClient } from '../src/generated/index.js'

const prisma = new PrismaClient()

async function seedFBRScenarios() {
  console.log('📋 Seeding FBR scenarios and mappings...')

  // First, clear existing data
  console.log('🗑️ Clearing existing FBR scenario data...')
  await prisma.fBRBusinessScenarioMapping.deleteMany()
  await prisma.fBRScenario.deleteMany()

  // Define all FBR scenarios (SN001-SN028) based on technical documentation
  const scenarios = [
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

  // Insert all scenarios
  console.log(`📝 Inserting ${scenarios.length} FBR scenarios...`)
  for (const scenario of scenarios) {
    await prisma.fBRScenario.create({
      data: scenario
    })
  }

  // Define business type to sector mappings based on FBR documentation
  const businessScenarioMappings = [
    // Manufacturer
    {
      businessType: 'Manufacturer',
      industrySector: 'Steel',
      scenarioIds: ['SN001', 'SN002', 'SN003', 'SN005', 'SN006', 'SN007', 'SN008', 'SN011', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Manufacturer',
      industrySector: 'Textile',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN009', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Manufacturer',
      industrySector: 'Telecom',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN010', 'SN016', 'SN017', 'SN018', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Manufacturer',
      industrySector: 'Petroleum',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN012', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Manufacturer',
      industrySector: 'Automobile',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN019', 'SN020', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Manufacturer',
      industrySector: 'Pharmaceuticals',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Manufacturer',
      industrySector: 'FMCG',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Manufacturer',
      industrySector: 'Other',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN016', 'SN017', 'SN019', 'SN021', 'SN022', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },

    // Importer
    {
      businessType: 'Importer',
      industrySector: 'Steel',
      scenarioIds: ['SN001', 'SN002', 'SN003', 'SN004', 'SN005', 'SN006', 'SN007', 'SN008', 'SN011', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Importer',
      industrySector: 'Textile',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN009', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Importer',
      industrySector: 'Telecom',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN010', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Importer',
      industrySector: 'Automobile',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN019', 'SN020', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Importer',
      industrySector: 'Other',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN016', 'SN017', 'SN019', 'SN021', 'SN022', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },

    // Distributor/Wholesaler
    {
      businessType: 'Distributor',
      industrySector: 'All Other Sectors',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Wholesaler',
      industrySector: 'All Other Sectors',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },

    // Retailer
    {
      businessType: 'Retailer',
      industrySector: 'Wholesale / Retails',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },

    // Service Provider
    {
      businessType: 'Service Provider',
      industrySector: 'All Other Sectors',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN016', 'SN017', 'SN018', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },

    // Exporter
    {
      businessType: 'Exporter',
      industrySector: 'All Other Sectors',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },

    // Special Sectors
    {
      businessType: 'Manufacturer',
      industrySector: 'Electricity Distribution',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN013', 'SN016', 'SN017', 'SN019', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Manufacturer',
      industrySector: 'Gas Distribution',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN014', 'SN016', 'SN017', 'SN019', 'SN023', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    },
    {
      businessType: 'Service Provider',
      industrySector: 'CNG Stations',
      scenarioIds: ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN014', 'SN016', 'SN017', 'SN019', 'SN023', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028']
    }
  ]

  // Insert all mappings
  console.log(`📝 Inserting ${businessScenarioMappings.length} business scenario mappings...`)
  for (const mapping of businessScenarioMappings) {
    await prisma.fBRBusinessScenarioMapping.create({
      data: mapping
    })
  }

  console.log('✅ FBR scenarios and mappings seeded successfully!')
}

// Run the seed function
seedFBRScenarios()
  .catch((e) => {
    console.error('❌ Error seeding FBR scenarios:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })