/**
 * Test Runner for FBR Retry Mechanism
 * 
 * This script runs all the test files for the retry mechanism and provides a summary of results.
 */

const fs = require('fs');
const path = require('path');

// Test files to run
const testFiles = [
  'test-retry-service.js',
  'test-cron-job.js',
  'test-fbr-integration-retry.js'
];

/**
 * Run a single test file
 */
async function runTestFile(testFile) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Running tests from ${testFile}`);
  console.log('='.repeat(80));
  
  try {
    // Clear require cache to ensure fresh imports
    delete require.cache[require.resolve(path.resolve(testFile))];
    
    // Import and run the test suite
    const testSuite = require(path.resolve(testFile));
    
    if (typeof testSuite.runAllTests === 'function') {
      const success = await testSuite.runAllTests();
      return { file: testFile, success, error: null };
    } else {
      return { file: testFile, success: false, error: 'No runAllTests function found' };
    }
  } catch (error) {
    console.error(`Error running ${testFile}:`, error.message);
    return { file: testFile, success: false, error: error.message };
  }
}

/**
 * Run all test files
 */
async function runAllTests() {
  console.log('🧪 FBR Retry Mechanism Test Suite');
  console.log(`Running ${testFiles.length} test files...\n`);
  
  const results = [];
  
  for (const testFile of testFiles) {
    const result = await runTestFile(testFile);
    results.push(result);
  }
  
  // Print summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('TEST SUITE SUMMARY');
  console.log('='.repeat(80));
  
  let passedCount = 0;
  let failedCount = 0;
  
  for (const result of results) {
    if (result.success) {
      console.log(`✅ ${result.file}: PASSED`);
      passedCount++;
    } else {
      console.log(`❌ ${result.file}: FAILED`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      failedCount++;
    }
  }
  
  console.log(`\nResults: ${passedCount} passed, ${failedCount} failed, ${results.length} total`);
  
  if (failedCount > 0) {
    console.log('\n❌ Some test suites failed. Please review the issues above.');
    console.log('\n📋 Next Steps:');
    console.log('1. Review the detailed error messages in each failed test suite');
    console.log('2. Check the RETRY_MECHANISM_ANALYSIS_REPORT.md for identified issues');
    console.log('3. Implement the recommended fixes based on priority');
    console.log('4. Re-run the tests to verify fixes');
  } else {
    console.log('\n✅ All test suites passed! The retry mechanism is working correctly.');
    console.log('\n📋 Recommendations:');
    console.log('1. Run these tests in a CI/CD pipeline to prevent regressions');
    console.log('2. Set up monitoring and alerting for production retry failures');
    console.log('3. Regularly review and update test cases based on new requirements');
  }
  
  return failedCount === 0;
}

/**
 * Check if test files exist
 */
function checkTestFiles() {
  const missingFiles = [];
  
  for (const testFile of testFiles) {
    if (!fs.existsSync(path.resolve(testFile))) {
      missingFiles.push(testFile);
    }
  }
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing test files:');
    for (const file of missingFiles) {
      console.error(`   - ${file}`);
    }
    return false;
  }
  
  return true;
}

/**
 * Main execution
 */
async function main() {
  console.log('FBR Retry Mechanism Test Runner');
  console.log('================================\n');
  
  // Check if all test files exist
  if (!checkTestFiles()) {
    console.log('\nPlease ensure all test files are present before running the test suite.');
    process.exit(1);
  }
  
  // Run all tests
  const success = await runAllTests();
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  runTestFile,
  checkTestFiles
};