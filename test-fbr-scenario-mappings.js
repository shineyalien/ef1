// Test script to verify FBR scenario mappings with correct logic
const { PrismaClient } = require('./packages/database/src/generated/index.js');

const prisma = new PrismaClient();

// Expected mappings based on user feedback
const expectedMappings = {
  'Manufacturer': {
    'All Other Sectors': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Steel': ['SN003', 'SN004', 'SN011'],
    'FMCG': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Textile': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN009', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Telecom': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN010', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Petroleum': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN012', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Electricity Distribution': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN013', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Gas Distribution': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN014', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Services': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN021', 'SN022', 'SN024'],
    'Automobile': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN020', 'SN021', 'SN022', 'SN024'],
    'CNG Stations': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN023', 'SN024'],
    'Pharmaceuticals': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'],
    'Wholesale / Retails': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028']
  },
  'Importer': {
    'All Other Sectors': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Steel': ['SN001', 'SN002', 'SN003', 'SN004', 'SN005', 'SN006', 'SN007', 'SN011', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'FMCG': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Textile': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN009', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Telecom': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN010', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Petroleum': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN012', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Electricity Distribution': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN013', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Gas Distribution': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN014', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Services': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN021', 'SN022', 'SN024'],
    'Automobile': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN020', 'SN021', 'SN022', 'SN024'],
    'CNG Stations': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN023', 'SN024'],
    'Pharmaceuticals': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'],
    'Wholesale / Retails': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028']
  },
  'Distributor': {
    'All Other Sectors': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028'],
    'Steel': ['SN003', 'SN004', 'SN008', 'SN011', 'SN026', 'SN027', 'SN028'],
    'FMCG': ['SN008', 'SN026', 'SN027', 'SN028'],
    'Textile': ['SN008', 'SN009', 'SN026', 'SN027', 'SN028'],
    'Telecom': ['SN008', 'SN010', 'SN026', 'SN027', 'SN028'],
    'Petroleum': ['SN008', 'SN012', 'SN026', 'SN027', 'SN028'],
    'Electricity Distribution': ['SN008', 'SN013', 'SN026', 'SN027', 'SN028'],
    'Gas Distribution': ['SN008', 'SN014', 'SN026', 'SN027', 'SN028'],
    'Services': ['SN018', 'SN019', 'SN026', 'SN027', 'SN028'],
    'Automobile': ['SN008', 'SN020', 'SN026', 'SN027', 'SN028'],
    'CNG Stations': ['SN008', 'SN023', 'SN026', 'SN027', 'SN028'],
    'Pharmaceuticals': ['SN008', 'SN025', 'SN026', 'SN027', 'SN028'],
    'Wholesale / Retails': ['SN001', 'SN002', 'SN008', 'SN026', 'SN027', 'SN028']
  },
  'Wholesaler': {
    'All Other Sectors': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028'],
    'Steel': ['SN003', 'SN004', 'SN008', 'SN011', 'SN026', 'SN027', 'SN028'],
    'FMCG': ['SN008', 'SN026', 'SN027', 'SN028'],
    'Textile': ['SN008', 'SN009', 'SN026', 'SN027', 'SN028'],
    'Telecom': ['SN008', 'SN010', 'SN026', 'SN027', 'SN028'],
    'Petroleum': ['SN008', 'SN012', 'SN026', 'SN027', 'SN028'],
    'Electricity Distribution': ['SN008', 'SN013', 'SN026', 'SN027', 'SN028'],
    'Gas Distribution': ['SN008', 'SN014', 'SN026', 'SN027', 'SN028'],
    'Services': ['SN018', 'SN019', 'SN026', 'SN027', 'SN028'],
    'Automobile': ['SN008', 'SN020', 'SN026', 'SN027', 'SN028'],
    'CNG Stations': ['SN008', 'SN023', 'SN026', 'SN027', 'SN028'],
    'Pharmaceuticals': ['SN008', 'SN025', 'SN026', 'SN027', 'SN028'],
    'Wholesale / Retails': ['SN001', 'SN002', 'SN008', 'SN026', 'SN027', 'SN028']
  },
  'Exporter': {
    'All Other Sectors': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Steel': ['SN001', 'SN002', 'SN003', 'SN004', 'SN005', 'SN006', 'SN007', 'SN011', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'FMCG': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Textile': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN009', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Telecom': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN010', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Petroleum': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN012', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Electricity Distribution': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN013', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Gas Distribution': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN014', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Services': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN021', 'SN022', 'SN024'],
    'Automobile': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN020', 'SN021', 'SN022', 'SN024'],
    'CNG Stations': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN023', 'SN024'],
    'Pharmaceuticals': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'],
    'Wholesale / Retails': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028']
  },
  'Retailer': {
    'All Other Sectors': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028'],
    'Steel': ['SN003', 'SN004', 'SN011'],
    'FMCG': ['SN008', 'SN026', 'SN027', 'SN028'],
    'Textile': ['SN008', 'SN009', 'SN026', 'SN027', 'SN028'],
    'Telecom': ['SN008', 'SN010', 'SN026', 'SN027', 'SN028'],
    'Petroleum': ['SN008', 'SN012', 'SN026', 'SN027', 'SN028'],
    'Electricity Distribution': ['SN008', 'SN013', 'SN026', 'SN027', 'SN028'],
    'Gas Distribution': ['SN008', 'SN014', 'SN026', 'SN027', 'SN028'],
    'Services': ['SN018', 'SN019', 'SN026', 'SN027', 'SN028'],
    'Automobile': ['SN008', 'SN020', 'SN026', 'SN027', 'SN028'],
    'CNG Stations': ['SN008', 'SN023', 'SN026', 'SN027', 'SN028'],
    'Pharmaceuticals': ['SN008', 'SN025', 'SN026', 'SN027', 'SN028'],
    'Wholesale / Retails': ['SN026', 'SN027', 'SN028']
  },
  'Service Provider': {
    'All Other Sectors': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN021', 'SN022', 'SN024'],
    'Steel': ['SN003', 'SN004', 'SN011', 'SN018', 'SN019'],
    'FMCG': ['SN008', 'SN018', 'SN019'],
    'Textile': ['SN008', 'SN009', 'SN018', 'SN019'],
    'Telecom': ['SN008', 'SN010', 'SN018', 'SN019'],
    'Petroleum': ['SN008', 'SN012', 'SN018', 'SN019'],
    'Electricity Distribution': ['SN008', 'SN013', 'SN018', 'SN019'],
    'Gas Distribution': ['SN008', 'SN014', 'SN018', 'SN019'],
    'Services': ['SN018', 'SN019'],
    'Automobile': ['SN008', 'SN020', 'SN018', 'SN019'],
    'CNG Stations': ['SN008', 'SN023', 'SN018', 'SN019'],
    'Pharmaceuticals': ['SN008', 'SN025', 'SN018', 'SN019'],
    'Wholesale / Retails': ['SN008', 'SN018', 'SN019', 'SN026', 'SN027', 'SN028']
  },
  'Other': {
    'All Other Sectors': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Steel': ['SN001', 'SN002', 'SN003', 'SN004', 'SN005', 'SN006', 'SN007', 'SN011', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'FMCG': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Textile': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN009', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Telecom': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN010', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Petroleum': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN012', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Electricity Distribution': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN013', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Gas Distribution': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN014', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'],
    'Services': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN021', 'SN022', 'SN024'],
    'Automobile': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN020', 'SN021', 'SN022', 'SN024'],
    'CNG Stations': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN023', 'SN024'],
    'Pharmaceuticals': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'],
    'Wholesale / Retails': ['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028']
  }
};

async function testFBRScenarioMappings() {
  try {
    console.log('🔍 Testing FBR scenario mappings with correct logic...\n');
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    
    // Test each business type and sector combination
    for (const [businessType, sectors] of Object.entries(expectedMappings)) {
      console.log(`\n🏢 Testing Business Type: ${businessType}`);
      
      for (const [sector, expectedScenarios] of Object.entries(sectors)) {
        totalTests++;
        console.log(`\n📍 Testing Sector: ${sector}`);
        
        // Execute the same query as the API
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
          const actualScenarios = mappingResult[0].scenarioIds.sort();
          const expectedScenariosSorted = [...expectedScenarios].sort();
          
          // Check if the arrays match
          const scenariosMatch = JSON.stringify(actualScenarios) === JSON.stringify(expectedScenariosSorted);
          
          if (scenariosMatch) {
            console.log(`   ✅ PASS - Correct scenarios (${actualScenarios.length})`);
            passedTests++;
          } else {
            console.log(`   ❌ FAIL - Incorrect scenarios`);
            console.log(`      Expected (${expectedScenariosSorted.length}): ${expectedScenariosSorted.join(', ')}`);
            console.log(`      Actual (${actualScenarios.length}): ${actualScenarios.join(', ')}`);
            
            // Find missing and extra scenarios
            const missingScenarios = expectedScenariosSorted.filter(code => !actualScenarios.includes(code));
            const extraScenarios = actualScenarios.filter(code => !expectedScenariosSorted.includes(code));
            
            if (missingScenarios.length > 0) {
              console.log(`      Missing: ${missingScenarios.join(', ')}`);
            }
            
            if (extraScenarios.length > 0) {
              console.log(`      Extra: ${extraScenarios.join(', ')}`);
            }
            
            failedTests++;
          }
        } else {
          console.log(`   ❌ FAIL - No mapping found`);
          failedTests++;
        }
      }
    }
    
    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
    
    if (failedTests === 0) {
      console.log('\n🎉 All tests passed! The scenario mappings are correct.');
    } else {
      console.log('\n⚠️ Some tests failed. Please review the mappings.');
    }
    
    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      successRate: (passedTests / totalTests) * 100
    };
  } catch (error) {
    console.error('❌ Error testing scenario mappings:', error);
    return {
      total: 0,
      passed: 0,
      failed: 1,
      successRate: 0
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testFBRScenarioMappings().then(result => {
  process.exit(result.failed > 0 ? 1 : 0);
});