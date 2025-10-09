// Test script to verify all FBR scenario combinations
const { PrismaClient } = require('./packages/database/src/generated/index.js');

const prisma = new PrismaClient();

async function testAllScenarios() {
  try {
    console.log('🔍 Testing all FBR scenario combinations...\n');

    // Get all business type and sector combinations
    const allMappings = await prisma.fBRBusinessScenarioMapping.findMany({
      where: { isActive: true }
    });

    console.log(`📊 Found ${allMappings.length} business type + sector combinations:\n`);

    // Test each combination
    for (const mapping of allMappings) {
      console.log(`🏢 ${mapping.businessType} + ${mapping.industrySector}`);
      console.log(`   - Scenarios: ${mapping.scenarioIds.length}`);
      console.log(`   - Scenario IDs: ${mapping.scenarioIds.join(', ')}`);
      
      // Get scenario details
      const scenarios = await prisma.fBRScenario.findMany({
        where: {
          code: { in: mapping.scenarioIds },
          isActive: true
        },
        orderBy: { priority: 'asc' }
      });
      
      // Show first 3 scenarios
      console.log(`   - First 3 scenarios:`);
      scenarios.slice(0, 3).forEach(scenario => {
        console.log(`     * ${scenario.code}: ${scenario.description}`);
      });
      
      if (scenarios.length > 3) {
        console.log(`     * ... and ${scenarios.length - 3} more`);
      }
      
      console.log('');
    }

    // Test specific combinations that might be problematic
    console.log('🔍 Testing specific combinations:\n');
    
    const testCases = [
      { businessType: 'Service Provider', sector: 'All Other Sectors' },
      { businessType: 'Retailer', sector: 'Wholesale / Retails' },
      { businessType: 'Manufacturer', sector: 'Steel' },
      { businessType: 'Manufacturer', sector: 'Textile' },
      { businessType: 'Importer', sector: 'Telecom' }
    ];
    
    for (const testCase of testCases) {
      console.log(`🧪 Testing: ${testCase.businessType} + ${testCase.sector}`);
      
      // Execute the same query as the API
      const mappingQuery = `
        SELECT "scenarioIds"
        FROM "fbr_business_scenario_mappings"
        WHERE "businessType" = $1
        AND "industrySector" = $2
        AND "isActive" = true
        LIMIT 1
      `;
      
      const mappingResult = await prisma.$queryRawUnsafe(mappingQuery, testCase.businessType, testCase.sector);
      
      if (mappingResult.length > 0 && mappingResult[0].scenarioIds.length > 0) {
        const scenarioIds = mappingResult[0].scenarioIds;
        console.log(`   ✅ Found ${scenarioIds.length} scenarios`);
        
        // Check if SN001 (standard rate) is included
        if (scenarioIds.includes('SN001')) {
          console.log(`   ✅ Includes SN001 (standard rate)`);
        } else {
          console.log(`   ⚠️ Does not include SN001 (standard rate)`);
        }
        
        // Check if SN005 (reduced rate) is included
        if (scenarioIds.includes('SN005')) {
          console.log(`   ✅ Includes SN005 (reduced rate)`);
        } else {
          console.log(`   ⚠️ Does not include SN005 (reduced rate)`);
        }
        
        // Check if SN006 (exempt) is included
        if (scenarioIds.includes('SN006')) {
          console.log(`   ✅ Includes SN006 (exempt)`);
        } else {
          console.log(`   ⚠️ Does not include SN006 (exempt)`);
        }
      } else {
        console.log(`   ❌ No mapping found`);
      }
      
      console.log('');
    }

    console.log('✅ All scenario combinations tested successfully!');
  } catch (error) {
    console.error('❌ Error testing scenarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testAllScenarios();