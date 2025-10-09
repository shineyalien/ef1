// Test script to verify FBR scenario filtering
const { PrismaClient } = require('./packages/database/src/generated/index.js');

const prisma = new PrismaClient();

async function testScenarioFiltering() {
  try {
    console.log('🔍 Testing FBR scenario filtering...\n');

    // Test 1: Check if tables exist and have data
    console.log('1️⃣ Checking if FBR scenario tables exist and have data...');
    const scenarioCount = await prisma.fBRScenario.count();
    const mappingCount = await prisma.fBRBusinessScenarioMapping.count();
    
    console.log(`   - FBR Scenarios: ${scenarioCount} records`);
    console.log(`   - Business Mappings: ${mappingCount} records`);
    
    if (scenarioCount === 0 || mappingCount === 0) {
      console.error('❌ FBR scenario tables are empty. Please run the seed script.');
      return;
    }

    // Test 2: Check specific business type and sector mapping
    console.log('\n2️⃣ Testing Manufacturer + Steel mapping...');
    const steelMapping = await prisma.fBRBusinessScenarioMapping.findFirst({
      where: {
        businessType: 'Manufacturer',
        industrySector: 'Steel'
      }
    });
    
    if (steelMapping) {
      console.log(`   - Found mapping with ${steelMapping.scenarioIds.length} scenarios`);
      console.log(`   - Scenarios: ${steelMapping.scenarioIds.join(', ')}`);
      
      // Get actual scenario details
      const scenarios = await prisma.fBRScenario.findMany({
        where: {
          code: { in: steelMapping.scenarioIds }
        },
        orderBy: { priority: 'asc' }
      });
      
      console.log('\n   - Scenario Details:');
      scenarios.forEach(scenario => {
        console.log(`     * ${scenario.code}: ${scenario.description}`);
      });
    } else {
      console.error('   - No mapping found for Manufacturer + Steel');
    }

    // Test 3: Check other business type and sector combinations
    console.log('\n3️⃣ Testing other business type + sector combinations...');
    const testCombos = [
      { businessType: 'Service Provider', industrySector: 'All Other Sectors' },
      { businessType: 'Retailer', industrySector: 'Wholesale / Retails' },
      { businessType: 'Importer', industrySector: 'Telecom' }
    ];
    
    for (const combo of testCombos) {
      const mapping = await prisma.fBRBusinessScenarioMapping.findFirst({
        where: combo
      });
      
      if (mapping) {
        console.log(`   - ${combo.businessType} + ${combo.sector}: ${mapping.scenarioIds.length} scenarios`);
      } else {
        console.log(`   - ${combo.businessType} + ${combo.sector}: No mapping found`);
      }
    }

    // Test 4: Test the API query logic
    console.log('\n4️⃣ Testing the API query logic...');
    
    // Simulate the API query for Manufacturer + Steel
    const businessType = 'Manufacturer';
    const sector = 'Steel';
    
    console.log(`   - Query for businessType="${businessType}", sector="${sector}"`);
    
    // Execute the same raw query as the API
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
      console.log(`   - Found mapping with ${scenarioIds.length} scenarios: ${scenarioIds.join(', ')}`);
      
      const scenarioQuery = `
        SELECT *
        FROM "fbr_scenarios"
        WHERE "code" = ANY($1)
        AND "isActive" = true
        ORDER BY "code" ASC
      `;
      
      const dbScenarios = await prisma.$queryRawUnsafe(scenarioQuery, scenarioIds);
      console.log(`   - Retrieved ${dbScenarios.length} scenarios from database`);
      
      if (dbScenarios.length > 0) {
        console.log('\n   - First 5 scenarios:');
        dbScenarios.slice(0, 5).forEach(scenario => {
          console.log(`     * ${scenario.code}: ${scenario.description}`);
        });
      }
    } else {
      console.log('   - No mapping found in database');
    }

    console.log('\n✅ Scenario filtering test completed successfully!');
  } catch (error) {
    console.error('❌ Error testing scenario filtering:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testScenarioFiltering();