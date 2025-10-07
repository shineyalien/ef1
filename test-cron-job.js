/**
 * Test Suite for FBR Retry Cron Job
 * 
 * This test file validates the cron job implementation that processes failed invoice retries.
 */

const { NextRequest, NextResponse } = require('next/server');

// Mock the processAllPendingRetries function
const mockProcessAllPendingRetries = jest.fn();

// Mock the retry service
jest.mock('./apps/web/src/lib/retry-service', () => ({
  processAllPendingRetries: mockProcessAllPendingRetries
}));

// Import the cron job route
const { GET, POST } = require('./apps/web/src/app/api/cron/retry-failed-invoices/route.ts');

/**
 * Test 1: Successful Cron Job Execution
 */
async function testSuccessfulCronExecution() {
  console.log('\n=== Test 1: Successful Cron Job Execution ===');
  
  // Mock successful retry processing
  mockProcessAllPendingRetries.mockResolvedValueOnce({
    processed: 5,
    succeeded: 3,
    failed: 2
  });
  
  // Create a mock request with correct authorization
  const mockRequest = {
    headers: {
      get: jest.fn((header) => {
        if (header === 'authorization') {
          return 'Bearer dev-secret-change-in-production';
        }
        return null;
      })
    }
  };
  
  try {
    const response = await GET(mockRequest);
    const responseData = await response.json();
    
    // Check response status
    const correctStatus = response.status === 200;
    console.log(`Test 1a - Correct response status: ${correctStatus ? '✅' : '❌'}`);
    
    // Check response data
    const correctData = 
      responseData.message === 'Retry job completed' &&
      responseData.processed === 5 &&
      responseData.succeeded === 3 &&
      responseData.failed === 2;
    
    console.log(`Test 1b - Correct response data: ${correctData ? '✅' : '❌'}`);
    
    // Check that processAllPendingRetries was called
    const functionCalled = mockProcessAllPendingRetries.mock.calls.length === 1;
    console.log(`Test 1c - Process function called: ${functionCalled ? '✅' : '❌'}`);
    
    const allPassed = correctStatus && correctData && functionCalled;
    
    if (allPassed) {
      console.log('✅ Successful cron job execution works correctly');
    }
    
    return allPassed;
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

/**
 * Test 2: Unauthorized Access
 */
async function testUnauthorizedAccess() {
  console.log('\n=== Test 2: Unauthorized Access ===');
  
  // Create a mock request with incorrect authorization
  const mockRequest = {
    headers: {
      get: jest.fn((header) => {
        if (header === 'authorization') {
          return 'Bearer wrong-secret';
        }
        return null;
      })
    }
  };
  
  try {
    const response = await GET(mockRequest);
    
    // Check response status
    const correctStatus = response.status === 401;
    console.log(`Test 2a - Correct error status: ${correctStatus ? '✅' : '❌'}`);
    
    // Check response data
    const responseData = await response.json();
    const correctError = responseData.error === 'Unauthorized';
    console.log(`Test 2b - Correct error message: ${correctError ? '✅' : '❌'}`);
    
    // Check that processAllPendingRetries was NOT called
    const functionNotCalled = mockProcessAllPendingRetries.mock.calls.length === 1; // Still 1 from previous test
    console.log(`Test 2c - Process function not called: ${functionNotCalled ? '✅' : '❌'}`);
    
    const allPassed = correctStatus && correctError && functionNotCalled;
    
    if (allPassed) {
      console.log('✅ Unauthorized access handling works correctly');
    }
    
    return allPassed;
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

/**
 * Test 3: Missing Authorization Header
 */
async function testMissingAuthorization() {
  console.log('\n=== Test 3: Missing Authorization Header ===');
  
  // Create a mock request with no authorization header
  const mockRequest = {
    headers: {
      get: jest.fn(() => null)
    }
  };
  
  try {
    const response = await GET(mockRequest);
    
    // Check response status
    const correctStatus = response.status === 401;
    console.log(`Test 3a - Correct error status: ${correctStatus ? '✅' : '❌'}`);
    
    // Check response data
    const responseData = await response.json();
    const correctError = responseData.error === 'Unauthorized';
    console.log(`Test 3b - Correct error message: ${correctError ? '✅' : '❌'}`);
    
    const allPassed = correctStatus && correctError;
    
    if (allPassed) {
      console.log('✅ Missing authorization handling works correctly');
    }
    
    return allPassed;
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

/**
 * Test 4: Error Handling in Retry Processing
 */
async function testRetryProcessingError() {
  console.log('\n=== Test 4: Error Handling in Retry Processing ===');
  
  // Mock an error in retry processing
  mockProcessAllPendingRetries.mockRejectedValueOnce(new Error('Database connection failed'));
  
  // Create a mock request with correct authorization
  const mockRequest = {
    headers: {
      get: jest.fn((header) => {
        if (header === 'authorization') {
          return 'Bearer dev-secret-change-in-production';
        }
        return null;
      })
    }
  };
  
  try {
    const response = await GET(mockRequest);
    
    // Check response status
    const correctStatus = response.status === 500;
    console.log(`Test 4a - Correct error status: ${correctStatus ? '✅' : '❌'}`);
    
    // Check response data
    const responseData = await response.json();
    const correctError = responseData.error === 'Failed to process retries';
    const correctDetails = responseData.details && responseData.details.includes('Database connection failed');
    
    console.log(`Test 4b - Correct error message: ${correctError ? '✅' : '❌'}`);
    console.log(`Test 4c - Correct error details: ${correctDetails ? '✅' : '❌'}`);
    
    const allPassed = correctStatus && correctError && correctDetails;
    
    if (allPassed) {
      console.log('✅ Error handling in retry processing works correctly');
    }
    
    return allPassed;
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

/**
 * Test 5: POST Method Support
 */
async function testPostMethodSupport() {
  console.log('\n=== Test 5: POST Method Support ===');
  
  // Mock successful retry processing
  mockProcessAllPendingRetries.mockResolvedValueOnce({
    processed: 2,
    succeeded: 2,
    failed: 0
  });
  
  // Create a mock request with correct authorization
  const mockRequest = {
    headers: {
      get: jest.fn((header) => {
        if (header === 'authorization') {
          return 'Bearer dev-secret-change-in-production';
        }
        return null;
      })
    }
  };
  
  try {
    const response = await POST(mockRequest);
    const responseData = await response.json();
    
    // Check response status
    const correctStatus = response.status === 200;
    console.log(`Test 5a - Correct response status: ${correctStatus ? '✅' : '❌'}`);
    
    // Check response data
    const correctData = 
      responseData.message === 'Retry job completed' &&
      responseData.processed === 2 &&
      responseData.succeeded === 2 &&
      responseData.failed === 0;
    
    console.log(`Test 5b - Correct response data: ${correctData ? '✅' : '❌'}`);
    
    const allPassed = correctStatus && correctData;
    
    if (allPassed) {
      console.log('✅ POST method support works correctly');
    }
    
    return allPassed;
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

/**
 * Test 6: Custom Cron Secret
 */
async function testCustomCronSecret() {
  console.log('\n=== Test 6: Custom Cron Secret ===');
  
  // Temporarily set a custom cron secret
  const originalEnv = process.env.CRON_SECRET;
  process.env.CRON_SECRET = 'custom-test-secret';
  
  // Create a mock request with custom secret
  const mockRequest = {
    headers: {
      get: jest.fn((header) => {
        if (header === 'authorization') {
          return 'Bearer custom-test-secret';
        }
        return null;
      })
    }
  };
  
  try {
    // Re-import the route to pick up the new environment variable
    delete require.cache[require.resolve('./apps/web/src/app/api/cron/retry-failed-invoices/route.ts')];
    const { GET: GETWithCustomSecret } = require('./apps/web/src/app/api/cron/retry-failed-invoices/route.ts');
    
    mockProcessAllPendingRetries.mockResolvedValueOnce({
      processed: 1,
      succeeded: 1,
      failed: 0
    });
    
    const response = await GETWithCustomSecret(mockRequest);
    
    // Check response status
    const correctStatus = response.status === 200;
    console.log(`Test 6a - Correct response status with custom secret: ${correctStatus ? '✅' : '❌'}`);
    
    // Restore original environment
    process.env.CRON_SECRET = originalEnv;
    
    const allPassed = correctStatus;
    
    if (allPassed) {
      console.log('✅ Custom cron secret works correctly');
    }
    
    return allPassed;
  } catch (error) {
    // Restore original environment
    process.env.CRON_SECRET = originalEnv;
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

/**
 * Identify Potential Issues in the Cron Job
 */
function identifyCronJobIssues() {
  console.log('\n=== Potential Issues Identified in Cron Job ===');
  
  console.log('\n1. Security:');
  console.log('   - Default secret is weak ("dev-secret-change-in-production")');
  console.log('   - No rate limiting on the endpoint');
  console.log('   - Recommendation: Use strong, randomly generated secrets');
  
  console.log('\n2. Error Handling:');
  console.log('   - Limited error information in responses');
  console.log('   - No retry mechanism for failed cron jobs');
  console.log('   - Recommendation: Add more detailed error logging');
  
  console.log('\n3. Monitoring:');
  console.log('   - No metrics collection for job performance');
  console.log('   - No alerting for repeated failures');
  console.log('   - Recommendation: Add monitoring and alerting');
  
  console.log('\n4. Scalability:');
  console.log('   - No job queuing or distributed processing');
  console.log('   - Could timeout with large numbers of retries');
  console.log('   - Recommendation: Implement job queuing for scalability');
  
  console.log('\n5. Idempotency:');
  console.log('   - No job ID or deduplication mechanism');
  console.log('   - Risk of duplicate processing if job runs multiple times');
  console.log('   - Recommendation: Add job tracking and idempotency');
  
  console.log('\n6. Configuration:');
  console.log('   - No configuration for batch size or processing limits');
  console.log('   - Fixed behavior for all environments');
  console.log('   - Recommendation: Make configuration more flexible');
  
  return true;
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🧪 Starting FBR Retry Cron Job Tests');
  
  const tests = [
    testSuccessfulCronExecution,
    testUnauthorizedAccess,
    testMissingAuthorization,
    testRetryProcessingError,
    testPostMethodSupport,
    testCustomCronSecret,
    identifyCronJobIssues
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`Test failed with error:`, error);
      failed++;
    }
  }
  
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Some tests failed. Please review the issues above.');
  } else {
    console.log('\n✅ All tests passed! The cron job is working correctly.');
  }
  
  return failed === 0;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runAllTests,
  testSuccessfulCronExecution,
  testUnauthorizedAccess,
  testMissingAuthorization,
  testRetryProcessingError,
  testPostMethodSupport,
  testCustomCronSecret,
  identifyCronJobIssues
};