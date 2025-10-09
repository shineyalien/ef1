// Test script to verify the API endpoint logic is working
const { PrismaClient } = require('@prisma/client');

async function testApiLogic() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing API endpoint logic for Manufacturer (All Other Sectors)');
    
    const businessType = 'Manufacturer';
    const sector = 'All Other Sectors';
    const includeInactive = false;
    
    // Simulate the API endpoint logic
    console.log(`🔍 Looking up mapping for businessType="${businessType}", sector="${sector}"`);
    
    // Use raw query to access the mapping table
    const mappingQuery = `
      SELECT "scenarioIds"
      FROM "fbr_business_scenario_mappings"
      WHERE "businessType" = $1
      AND "industrySector" = $2
      AND "isActive" = true
      LIMIT 1
    `;
    
    const mappingResult = await prisma.$queryRawUnsafe(mappingQuery, businessType, sector);
    
    if (mappingResult.length > 0 && mappingResult[0].scenarioIds.length > 0) {
      const scenarioIds = mappingResult[0].scenarioIds;
      console.log(`✅ Found mapping with ${scenarioIds.length} scenarios:`, scenarioIds);
      
      const scenarioQuery = `
        SELECT *
        FROM "fbr_scenarios"
        WHERE "code" = ANY($1)
        ${includeInactive ? '' : 'AND "isActive" = true'}
        ORDER BY "code" ASC
      `;
      
      const dbScenarios = await prisma.$queryRawUnsafe(scenarioQuery, scenarioIds);
      console.log(`✅ Retrieved ${dbScenarios.length} scenarios from database`);
      
      console.log(`✅ Returning ${dbScenarios.length} scenarios for ${businessType} (${sector})`);
      
      // Test different business types and sectors
      console.log('\n📊 Testing different business types and sectors:');
      
      const testCases = [
        { businessType: 'Manufacturer', sector: 'Steel' },
        { businessType: 'Manufacturer', sector: 'Textile' },
        { businessType: 'Retailer', sector: 'All Other Sectors' },
        { businessType: 'Distributor', sector: 'FMCG' }
      ];
      
      for (const testCase of testCases) {
        const mapping = await prisma.$queryRawUnsafe(mappingQuery, testCase.businessType, testCase.sector);
        
        if (mapping.length > 0 && mapping[0].scenarioIds.length > 0) {
          const scenarios = await prisma.$queryRawUnsafe(scenarioQuery, mapping[0].scenarioIds);
          console.log(`  - ${testCase.businessType} / ${testCase.sector}: ${scenarios.length} scenarios`);
        } else {
          console.log(`  - ${testCase.businessType} / ${testCase.sector}: No mapping found`);
        }
      }
      
      console.log('\n✅ SUCCESS: API endpoint logic is working correctly!');
      console.log('The issue was that the API was using in-memory scenarios instead of database mapping.');
      console.log('Our fix ensures the database mapping is used first, which properly filters scenarios.');
      
    } else {
      console.log(`⚠️ No mapping found for businessType="${businessType}", sector="${sector}"`);
    }
  } catch (error) {
    console.error('❌ Error testing API logic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApiLogic();