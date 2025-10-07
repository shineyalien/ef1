const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedFBRData() {
  console.log('🌱 Seeding FBR lookup data...')

  try {
    // Clear existing data
    await prisma.fBRCacheMetadata.deleteMany()
    await prisma.fBRTaxRate.deleteMany()
    await prisma.fBRSROItem.deleteMany()
    await prisma.fBRSROSchedule.deleteMany()
    await prisma.fBRSaleType.deleteMany()
    await prisma.fBRPaymentMode.deleteMany()
    await prisma.fBRScenario.deleteMany()
    await prisma.fBRDocumentType.deleteMany()
    await prisma.fBRUnitOfMeasurement.deleteMany()
    await prisma.fBRHSCode.deleteMany()
    await prisma.fBRProvince.deleteMany()

    // Seed Provinces
    const provinces = [
      { code: 'PB', name: 'Punjab', description: 'Punjab Province' },
      { code: 'SD', name: 'Sindh', description: 'Sindh Province' },
      { code: 'KP', name: 'Khyber Pakhtunkhwa', description: 'Khyber Pakhtunkhwa Province' },
      { code: 'BL', name: 'Balochistan', description: 'Balochistan Province' },
      { code: 'GB', name: 'Gilgit-Baltistan', description: 'Gilgit-Baltistan' },
      { code: 'AK', name: 'Azad Kashmir', description: 'Azad Kashmir' },
      { code: 'ICT', name: 'Islamabad', description: 'Islamabad Capital Territory' }
    ]
    await prisma.fBRProvince.createMany({ data: provinces })

    // Seed HS Codes
    const hsCodes = [
      { code: '1006.3090', description: 'Rice (Other varieties)' },
      { code: '2501.0010', description: 'Salt (Table salt)' },
      { code: '1701.1410', description: 'Sugar (Cane sugar, raw)' },
      { code: '1005.9000', description: 'Maize (Corn)' },
      { code: '1001.9990', description: 'Wheat (Other)' },
      { code: '0713.3390', description: 'Beans (Other dried beans)' },
      { code: '1008.2990', description: 'Millet (Other)' },
      { code: '0902.3000', description: 'Tea (Black tea in packages > 3kg)' },
      { code: '1512.1190', description: 'Sunflower seed oil (Other)' },
      { code: '1511.1000', description: 'Palm oil (Crude)' }
    ]
    await prisma.fBRHSCode.createMany({ data: hsCodes })

    // Seed Units of Measurement
    const uomData = [
      // Generic UOMs
      { code: 'PCS', hsCode: null, description: 'Pieces' },
      { code: 'KG', hsCode: null, description: 'Kilogram' },
      { code: 'LTR', hsCode: null, description: 'Liter' },
      { code: 'MTR', hsCode: null, description: 'Meter' },
      { code: 'TON', hsCode: null, description: 'Metric Ton' },
      { code: 'BAG', hsCode: null, description: 'Bag' },
      
      // HS Code specific UOMs
      { code: 'KG', hsCode: '1006.3090', description: 'Kilogram' },
      { code: 'TON', hsCode: '1006.3090', description: 'Metric Ton' },
      { code: 'BAG', hsCode: '1006.3090', description: 'Bag (50kg)' },
      
      { code: 'KG', hsCode: '2501.0010', description: 'Kilogram' },
      { code: 'TON', hsCode: '2501.0010', description: 'Metric Ton' },
      
      { code: 'KG', hsCode: '1701.1410', description: 'Kilogram' },
      { code: 'TON', hsCode: '1701.1410', description: 'Metric Ton' },
      { code: 'BAG', hsCode: '1701.1410', description: 'Bag (50kg)' },
      
      { code: 'LTR', hsCode: '1512.1190', description: 'Liter' },
      { code: 'KG', hsCode: '1512.1190', description: 'Kilogram' },
      
      { code: 'LTR', hsCode: '1511.1000', description: 'Liter' },
      { code: 'KG', hsCode: '1511.1000', description: 'Kilogram' }
    ]
    await prisma.fBRUnitOfMeasurement.createMany({ data: uomData })

    // Seed Document Types
    const documentTypes = [
      { code: 'SI', description: 'Sale Invoice' },
      { code: 'CN', description: 'Credit Note' },
      { code: 'DN', description: 'Debit Note' }
    ]
    await prisma.fBRDocumentType.createMany({ data: documentTypes })

    // Seed Scenarios
    const scenarios = [
      { code: 'SN001', description: 'Registered to Registered' },
      { code: 'SN002', description: 'Registered to Unregistered' },
      { code: 'SN003', description: 'Export Sales' },
      { code: 'SN004', description: 'Zero Rated Sales' },
      { code: 'SN005', description: 'Exempt Sales' },
      { code: 'SN006', description: 'B2B Sales' },
      { code: 'SN007', description: 'B2C Sales' }
    ]
    await prisma.fBRScenario.createMany({ data: scenarios })

    // Seed Payment Modes
    const paymentModes = [
      { code: '1', description: 'Cash' },
      { code: '2', description: 'Credit Card' },
      { code: '3', description: 'Debit Card' },
      { code: '4', description: 'Cheque' },
      { code: '5', description: 'Bank Transfer' },
      { code: '6', description: 'Mobile Payment' },
      { code: '7', description: 'Online Banking' }
    ]
    await prisma.fBRPaymentMode.createMany({ data: paymentModes })

    // Seed Sale Types
    const saleTypesData = []
    
    // Generic sale types for all HS codes and scenarios
    const genericSaleTypes = [
      { code: 'GSR', description: 'Goods at standard rate' },
      { code: 'GZR', description: 'Goods at zero rate' },
      { code: 'GER', description: 'Goods exempt from tax' },
      { code: 'GRR', description: 'Goods at reduced rate' }
    ]

    for (const hsCode of hsCodes) {
      for (const scenario of scenarios) {
        for (const saleType of genericSaleTypes) {
          saleTypesData.push({
            code: saleType.code,
            hsCode: hsCode.code,
            scenarioId: scenario.code,
            description: saleType.description
          })
        }
      }
    }
    
    await prisma.fBRSaleType.createMany({ data: saleTypesData })

    // Seed Sample Tax Rates
    const taxRatesData = []
    
    for (const hsCode of hsCodes) {
      for (const scenario of scenarios) {
        for (const sellerProvince of provinces) {
          for (const buyerProvince of provinces) {
            for (const saleType of genericSaleTypes) {
              let rate = 0
              let description = ''
              
              if (scenario.code === 'SN003' || scenario.code === 'SN004') {
                // Export or Zero rated
                rate = 0
                description = 'Zero rated sales'
              } else if (saleType.code === 'GER') {
                // Exempt
                rate = 0
                description = 'Exempt from tax'
              } else if (saleType.code === 'GZR') {
                // Zero rate
                rate = 0
                description = 'Zero rated'
              } else if (saleType.code === 'GRR') {
                // Reduced rate
                rate = sellerProvince.code === 'PB' || sellerProvince.code === 'SD' ? 8 : 5
                description = `Reduced rate ${rate}%`
              } else {
                // Standard rate - varies by province
                switch (sellerProvince.code) {
                  case 'PB':
                  case 'SD':
                  case 'ICT':
                    rate = hsCode.code === '1006.3090' ? 17 : 18
                    break
                  case 'KP':
                    rate = 17
                    break
                  case 'BL':
                  case 'GB':
                  case 'AK':
                    rate = 16
                    break
                  default:
                    rate = 18
                }
                description = `Standard rate ${rate}% - ${sellerProvince.name}`
              }
              
              taxRatesData.push({
                hsCode: hsCode.code,
                saleType: saleType.code,
                sellerProvince: sellerProvince.code,
                buyerProvince: buyerProvince.code,
                scenarioId: scenario.code,
                rate,
                description
              })
            }
          }
        }
      }
    }
    
    await prisma.fBRTaxRate.createMany({ data: taxRatesData })

    // Update cache metadata
    const cacheMetadata = [
      { lookupType: 'provinces', recordCount: provinces.length, syncStatus: 'success' },
      { lookupType: 'hscodes', recordCount: hsCodes.length, syncStatus: 'success' },
      { lookupType: 'uom', recordCount: uomData.length, syncStatus: 'success' },
      { lookupType: 'documentTypes', recordCount: documentTypes.length, syncStatus: 'success' },
      { lookupType: 'scenarios', recordCount: scenarios.length, syncStatus: 'success' },
      { lookupType: 'paymentModes', recordCount: paymentModes.length, syncStatus: 'success' },
      { lookupType: 'saleTypes', recordCount: saleTypesData.length, syncStatus: 'success' },
      { lookupType: 'taxRates', recordCount: taxRatesData.length, syncStatus: 'success' }
    ]

    for (const metadata of cacheMetadata) {
      await prisma.fBRCacheMetadata.create({
        data: {
          ...metadata,
          lastSyncAt: new Date()
        }
      })
    }

    console.log('✅ FBR data seeding completed successfully!')
    console.log(`   • ${provinces.length} provinces`)
    console.log(`   • ${hsCodes.length} HS codes`)
    console.log(`   • ${uomData.length} units of measurement`)
    console.log(`   • ${documentTypes.length} document types`)
    console.log(`   • ${scenarios.length} scenarios`)
    console.log(`   • ${paymentModes.length} payment modes`)
    console.log(`   • ${saleTypesData.length} sale types`)
    console.log(`   • ${taxRatesData.length} tax rates`)

  } catch (error) {
    console.error('❌ Error seeding FBR data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedFBRData()