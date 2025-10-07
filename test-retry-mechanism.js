/**
 * Comprehensive Test Suite for FBR Retry Mechanism
 * 
 * This test suite validates the retry service implementation under various failure scenarios
 * and identifies potential issues in the retry logic.
 */

const { PrismaClient } = require('@prisma/client');
const { 
  calculateNextRetryTime,
  isEligibleForRetry,
  getInvoicesReadyForRetry,
  retryFBRSubmission,
  processAllPendingRetries,
  resetRetryCount,
  disableRetry
} = require('./apps/web/src/lib/retry-service.ts');

const prisma = new PrismaClient();

// Test configuration
const TEST_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000, // 1 second for testing
  maxDelayMs: 10000, // 10 seconds for testing
  backoffMultiplier: 2
};

// Mock invoice data for testing
const mockInvoiceData = {
  id: 'test-invoice-id',
  invoiceNumber: 'TEST-001',
  status: 'FAILED',
  retryCount: 0,
  maxRetries: 3,
  retryEnabled: true,
  fbrSubmitted: false,
  fbrValidated: false,
  nextRetryAt: null,
  business: {
    ntnNumber: '1234567',
    companyName: 'Test Business',
    province: 'Punjab',
    address: 'Test Address',
    productionToken: 'test-token'
  },
  customer: {
    name: 'Test Customer',
    ntnNumber: '7654321',
    address: 'Customer Address',
    buyerProvince: 'Punjab'
  },
  items: [
    {
      hsCode: '2204.2100',
      description: 'Test Product',
      taxRate: 18,
      unitOfMeasurement: 'LTR',
      quantity: 10,
      totalValue: 1000,
      valueSalesExcludingST: 847.46,
      fixedNotifiedValueOrRetailPrice: 0,
      salesTaxApplicable: 152.54,
      salesTaxWithheldAtSource: 0,
      extraTax: 0,
      furtherTax: 0,
      fedPayable: 0,
      discount: 0,
      saleType: 'Standard'
    }
  ]
};

/**
 * Test 1: Exponential Backoff Calculation
 */
async function testExponentialBackoff() {
  console.log('\n=== Test 1: Exponential Backoff Calculation ===');
  
  const testCases = [
    { retryCount: 0, expectedMinDelay: 1000, expectedMaxDelay: 1000 },
    { retryCount: 1, expectedMinDelay: 2000, expectedMaxDelay: 2000 },
    { retryCount: 2, expectedMinDelay: 4000, expectedMaxDelay: 4000 },
    { retryCount: 3, expectedMinDelay: 8000, expectedMaxDelay: 10000 }, // Capped at maxDelay
    { retryCount: 4, expectedMinDelay: 10000, expectedMaxDelay: 10000 } // Capped at maxDelay
  ];
  
  for (const testCase of testCases) {
    const nextRetryTime = calculateNextRetryTime(testCase.retryCount, TEST_CONFIG);
    const delayMs = nextRetryTime.getTime() - Date.now();
    
    console.log(`Retry ${testCase.retryCount}: Delay = ${delayMs}ms`);
    
    if (delayMs < testCase.expectedMinDelay || delayMs > testCase.expectedMaxDelay) {
      console.error(`❌ Failed: Expected delay between ${testCase.expectedMinDelay}ms and ${testCase.expectedMaxDelay}ms, got ${delayMs}ms`);
      return false;
    }
  }
  
  console.log('✅ Exponential backoff calculation works correctly');
  return true;
}

/**
 * Test 2: Invoice Eligibility for Retry
 */
async function testRetryEligibility() {
  console.log('\n=== Test 2: Invoice Eligibility for Retry ===');
  
  // Create test invoice in database
  const testInvoice = await prisma.invoice.create({
    data: {
      businessId: 'test-business-id',
      invoiceNumber: 'RETRY-TEST-001',
      status: 'FAILED',
      retryCount: 0,
      maxRetries: 3,
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      invoiceDate: new Date(),
      invoiceSequence: 1
    }
  });
  
  try {
    // Test 2a: Eligible invoice
    const eligible1 = await isEligibleForRetry(testInvoice.id);
    console.log(`Test 2a - Eligible invoice: ${eligible1 ? '✅' : '❌'}`);
    
    // Test 2b: Non-eligible invoice (wrong status)
    await prisma.invoice.update({
      where: { id: testInvoice.id },
      data: { status: 'PUBLISHED' }
    });
    const eligible2 = await isEligibleForRetry(testInvoice.id);
    console.log(`Test 2b - Non-eligible (wrong status): ${!eligible2 ? '✅' : '❌'}`);
    
    // Test 2c: Non-eligible invoice (retry disabled)
    await prisma.invoice.update({
      where: { id: testInvoice.id },
      data: { status: 'FAILED', retryEnabled: false }
    });
    const eligible3 = await isEligibleForRetry(testInvoice.id);
    console.log(`Test 2c - Non-eligible (retry disabled): ${!eligible3 ? '✅' : '❌'}`);
    
    // Test 2d: Non-eligible invoice (max retries reached)
    await prisma.invoice.update({
      where: { id: testInvoice.id },
      data: { retryEnabled: true, retryCount: 3 }
    });
    const eligible4 = await isEligibleForRetry(testInvoice.id);
    console.log(`Test 2d - Non-eligible (max retries): ${!eligible4 ? '✅' : '❌'}`);
    
    // Test 2e: Non-eligible invoice (already submitted)
    await prisma.invoice.update({
      where: { id: testInvoice.id },
      data: { retryCount: 0, fbrSubmitted: true }
    });
    const eligible5 = await isEligibleForRetry(testInvoice.id);
    console.log(`Test 2e - Non-eligible (already submitted): ${!eligible5 ? '✅' : '❌'}`);
    
    return true;
  } finally {
    // Clean up
    await prisma.invoice.delete({ where: { id: testInvoice.id } });
  }
}

/**
 * Test 3: Get Invoices Ready for Retry
 */
async function testGetInvoicesReadyForRetry() {
  console.log('\n=== Test 3: Get Invoices Ready for Retry ===');
  
  // Create test invoices
  const testInvoice1 = await prisma.invoice.create({
    data: {
      businessId: 'test-business-id',
      invoiceNumber: 'RETRY-TEST-002',
      status: 'FAILED',
      retryCount: 0,
      maxRetries: 3,
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      nextRetryAt: new Date(Date.now() - 1000), // Past time
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      invoiceDate: new Date(),
      invoiceSequence: 2
    }
  });
  
  const testInvoice2 = await prisma.invoice.create({
    data: {
      businessId: 'test-business-id',
      invoiceNumber: 'RETRY-TEST-003',
      status: 'FAILED',
      retryCount: 0,
      maxRetries: 3,
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      nextRetryAt: new Date(Date.now() + 60000), // Future time
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      invoiceDate: new Date(),
      invoiceSequence: 3
    }
  });
  
  try {
    const readyInvoices = await getInvoicesReadyForRetry();
    
    // Should only return invoice1 (past retry time)
    if (readyInvoices.length === 1 && readyInvoices[0] === testInvoice1.id) {
      console.log('✅ Correctly identified invoices ready for retry');
      return true;
    } else {
      console.error(`❌ Expected 1 invoice, got ${readyInvoices.length}`);
      return false;
    }
  } finally {
    // Clean up
    await prisma.invoice.delete({ where: { id: testInvoice1.id } });
    await prisma.invoice.delete({ where: { id: testInvoice2.id } });
  }
}

/**
 * Test 4: Network Error Handling
 */
async function testNetworkErrorHandling() {
  console.log('\n=== Test 4: Network Error Handling ===');
  
  // Create test invoice
  const testInvoice = await prisma.invoice.create({
    data: {
      businessId: 'test-business-id',
      invoiceNumber: 'NETWORK-TEST-001',
      status: 'FAILED',
      retryCount: 0,
      maxRetries: 3,
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      invoiceDate: new Date(),
      invoiceSequence: 4
    }
  });
  
  try {
    // Mock the PRAL client to throw a network error
    const originalPostInvoice = require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice;
    
    // Temporarily replace the method with one that throws an error
    require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice = async () => {
      throw new Error('Network timeout: Failed to connect to FBR servers');
    };
    
    const result = await retryFBRSubmission(testInvoice.id);
    
    // Restore original method
    require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice = originalPostInvoice;
    
    if (!result.success && result.error.includes('Network timeout')) {
      console.log('✅ Network error handled correctly');
      
      // Check that retry count was incremented
      const updatedInvoice = await prisma.invoice.findUnique({
        where: { id: testInvoice.id }
      });
      
      if (updatedInvoice.retryCount === 1 && updatedInvoice.nextRetryAt) {
        console.log('✅ Retry count incremented and next retry scheduled');
        return true;
      } else {
        console.error('❌ Retry state not updated correctly');
        return false;
      }
    } else {
      console.error('❌ Network error not handled properly');
      return false;
    }
  } finally {
    // Clean up
    await prisma.invoice.delete({ where: { id: testInvoice.id } });
  }
}

/**
 * Test 5: FBR API Error Handling
 */
async function testFBRAPIErrorHandling() {
  console.log('\n=== Test 5: FBR API Error Handling ===');
  
  // Create test invoice
  const testInvoice = await prisma.invoice.create({
    data: {
      businessId: 'test-business-id',
      invoiceNumber: 'API-ERROR-TEST-001',
      status: 'FAILED',
      retryCount: 0,
      maxRetries: 3,
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      invoiceDate: new Date(),
      invoiceSequence: 5
    }
  });
  
  try {
    // Mock the PRAL client to return an API error response
    const originalPostInvoice = require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice;
    
    // Temporarily replace the method with one that returns an error response
    require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice = async () => {
      return {
        ValidationResponse: {
          StatusCode: '01',
          Status: 'Failed',
          ErrorCode: 'ERR001',
          Error: 'Invalid invoice data: Tax calculation error'
        }
      };
    };
    
    const result = await retryFBRSubmission(testInvoice.id);
    
    // Restore original method
    require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice = originalPostInvoice;
    
    if (!result.success && result.error.includes('Invalid invoice data')) {
      console.log('✅ FBR API error handled correctly');
      
      // Check that retry count was incremented
      const updatedInvoice = await prisma.invoice.findUnique({
        where: { id: testInvoice.id }
      });
      
      if (updatedInvoice.retryCount === 1 && updatedInvoice.nextRetryAt) {
        console.log('✅ Retry count incremented and next retry scheduled');
        return true;
      } else {
        console.error('❌ Retry state not updated correctly');
        return false;
      }
    } else {
      console.error('❌ FBR API error not handled properly');
      return false;
    }
  } finally {
    // Clean up
    await prisma.invoice.delete({ where: { id: testInvoice.id } });
  }
}

/**
 * Test 6: Max Retry Limit Enforcement
 */
async function testMaxRetryLimit() {
  console.log('\n=== Test 6: Max Retry Limit Enforcement ===');
  
  // Create test invoice with max retries reached
  const testInvoice = await prisma.invoice.create({
    data: {
      businessId: 'test-business-id',
      invoiceNumber: 'MAX-RETRY-TEST-001',
      status: 'FAILED',
      retryCount: 3, // Already at max
      maxRetries: 3,
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      invoiceDate: new Date(),
      invoiceSequence: 6
    }
  });
  
  try {
    const result = await retryFBRSubmission(testInvoice.id);
    
    if (!result.success && result.error === 'NOT_ELIGIBLE') {
      console.log('✅ Max retry limit enforced correctly');
      return true;
    } else {
      console.error('❌ Max retry limit not enforced');
      return false;
    }
  } finally {
    // Clean up
    await prisma.invoice.delete({ where: { id: testInvoice.id } });
  }
}

/**
 * Test 7: Manual Retry Functionality
 */
async function testManualRetry() {
  console.log('\n=== Test 7: Manual Retry Functionality ===');
  
  // Create test invoice
  const testInvoice = await prisma.invoice.create({
    data: {
      businessId: 'test-business-id',
      invoiceNumber: 'MANUAL-RETRY-TEST-001',
      status: 'FAILED',
      retryCount: 3, // At max retries
      maxRetries: 3,
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      invoiceDate: new Date(),
      invoiceSequence: 7
    }
  });
  
  try {
    // Test 7a: Reset retry count
    const resetSuccess = await resetRetryCount(testInvoice.id);
    console.log(`Test 7a - Reset retry count: ${resetSuccess ? '✅' : '❌'}`);
    
    if (resetSuccess) {
      const updatedInvoice = await prisma.invoice.findUnique({
        where: { id: testInvoice.id }
      });
      
      if (updatedInvoice.retryCount === 0 && updatedInvoice.nextRetryAt) {
        console.log('✅ Retry count reset and immediate retry scheduled');
      } else {
        console.error('❌ Retry state not reset correctly');
        return false;
      }
    }
    
    // Test 7b: Disable retry
    const disableSuccess = await disableRetry(testInvoice.id);
    console.log(`Test 7b - Disable retry: ${disableSuccess ? '✅' : '❌'}`);
    
    if (disableSuccess) {
      const updatedInvoice = await prisma.invoice.findUnique({
        where: { id: testInvoice.id }
      });
      
      if (!updatedInvoice.retryEnabled && !updatedInvoice.nextRetryAt) {
        console.log('✅ Retry disabled successfully');
      } else {
        console.error('❌ Retry not disabled correctly');
        return false;
      }
    }
    
    return true;
  } finally {
    // Clean up
    await prisma.invoice.delete({ where: { id: testInvoice.id } });
  }
}

/**
 * Test 8: Process Multiple Pending Retries
 */
async function testProcessMultipleRetries() {
  console.log('\n=== Test 8: Process Multiple Pending Retries ===');
  
  // Create multiple test invoices
  const testInvoice1 = await prisma.invoice.create({
    data: {
      businessId: 'test-business-id',
      invoiceNumber: 'MULTI-RETRY-001',
      status: 'FAILED',
      retryCount: 0,
      maxRetries: 3,
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      nextRetryAt: new Date(Date.now() - 1000), // Past time
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      invoiceDate: new Date(),
      invoiceSequence: 8
    }
  });
  
  const testInvoice2 = await prisma.invoice.create({
    data: {
      businessId: 'test-business-id',
      invoiceNumber: 'MULTI-RETRY-002',
      status: 'FAILED',
      retryCount: 0,
      maxRetries: 3,
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      nextRetryAt: new Date(Date.now() - 1000), // Past time
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      invoiceDate: new Date(),
      invoiceSequence: 9
    }
  });
  
  try {
    // Mock the PRAL client to return success for one invoice and error for another
    const originalPostInvoice = require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice;
    let callCount = 0;
    
    require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice = async () => {
      callCount++;
      if (callCount === 1) {
        return {
          ValidationResponse: {
            StatusCode: '00',
            Status: 'Valid'
          },
          InvoiceNumber: 'FBR-001',
          Dated: new Date().toISOString()
        };
      } else {
        return {
          ValidationResponse: {
            StatusCode: '01',
            Status: 'Failed',
            ErrorCode: 'ERR002',
            Error: 'Validation failed'
          }
        };
      }
    };
    
    const result = await processAllPendingRetries();
    
    // Restore original method
    require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice = originalPostInvoice;
    
    if (result.processed === 2 && result.succeeded === 1 && result.failed === 1) {
      console.log('✅ Multiple retries processed correctly');
      return true;
    } else {
      console.error(`❌ Expected 2 processed, 1 succeeded, 1 failed; got ${result.processed} processed, ${result.succeeded} succeeded, ${result.failed} failed`);
      return false;
    }
  } finally {
    // Clean up
    await prisma.invoice.delete({ where: { id: testInvoice1.id } });
    await prisma.invoice.delete({ where: { id: testInvoice2.id } });
  }
}

/**
 * Test 9: Race Condition Detection
 */
async function testRaceConditions() {
  console.log('\n=== Test 9: Race Condition Detection ===');
  
  // Create test invoice
  const testInvoice = await prisma.invoice.create({
    data: {
      businessId: 'test-business-id',
      invoiceNumber: 'RACE-CONDITION-TEST-001',
      status: 'FAILED',
      retryCount: 0,
      maxRetries: 3,
      retryEnabled: true,
      fbrSubmitted: false,
      fbrValidated: false,
      nextRetryAt: new Date(Date.now() - 1000), // Past time
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      invoiceDate: new Date(),
      invoiceSequence: 10
    }
  });
  
  try {
    // Mock the PRAL client to simulate a slow response
    const originalPostInvoice = require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice;
    
    require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice = async () => {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return {
        ValidationResponse: {
          StatusCode: '00',
          Status: 'Valid'
        },
        InvoiceNumber: 'FBR-002',
        Dated: new Date().toISOString()
      };
    };
    
    // Start two concurrent retries
    const [result1, result2] = await Promise.all([
      retryFBRSubmission(testInvoice.id),
      retryFBRSubmission(testInvoice.id)
    ]);
    
    // Restore original method
    require('./apps/web/src/lib/fbr-pral-client').PRALAPIClient.prototype.postInvoice = originalPostInvoice;
    
    // Check that only one retry succeeded
    const successCount = [result1, result2].filter(r => r.success).length;
    
    if (successCount === 1) {
      console.log('✅ Race condition handled - only one retry succeeded');
      return true;
    } else {
      console.error(`❌ Race condition not handled - ${successCount} retries succeeded`);
      return false;
    }
  } finally {
    // Clean up
    await prisma.invoice.delete({ where: { id: testInvoice.id } });
  }
}

/**
 * Test 10: Memory and Performance Impact
 */
async function testMemoryPerformance() {
  console.log('\n=== Test 10: Memory and Performance Impact ===');
  
  // Create multiple test invoices
  const testInvoices = [];
  for (let i = 0; i < 20; i++) {
    const invoice = await prisma.invoice.create({
      data: {
        businessId: 'test-business-id',
        invoiceNumber: `PERF-TEST-${String(i).padStart(3, '0')}`,
        status: 'FAILED',
        retryCount: 0,
        maxRetries: 3,
        retryEnabled: true,
        fbrSubmitted: false,
        fbrValidated: false,
        nextRetryAt: new Date(Date.now() - 1000), // Past time
        subtotal: 1000,
        taxAmount: 180,
        totalAmount: 1180,
        invoiceDate: new Date(),
        invoiceSequence: 10 + i
      }
    });
    testInvoices.push(invoice);
  }
  
  try {
    // Measure memory before
    const memBefore = process.memoryUsage();
    
    // Process all retries
    const result = await processAllPendingRetries();
    
    // Measure memory after
    const memAfter = process.memoryUsage();
    const memUsed = (memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024; // MB
    
    console.log(`Processed ${result.processed} invoices`);
    console.log(`Memory used: ${memUsed.toFixed(2)} MB`);
    
    if (memUsed < 50) { // Less than 50MB is acceptable
      console.log('✅ Memory usage within acceptable limits');
      return true;
    } else {
      console.error('❌ Memory usage too high');
      return false;
    }
  } finally {
    // Clean up
    for (const invoice of testInvoices) {
      await prisma.invoice.delete({ where: { id: invoice.id } });
    }
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🧪 Starting FBR Retry Mechanism Tests');
  
  const tests = [
    testExponentialBackoff,
    testRetryEligibility,
    testGetInvoicesReadyForRetry,
    testNetworkErrorHandling,
    testFBRAPIErrorHandling,
    testMaxRetryLimit,
    testManualRetry,
    testProcessMultipleRetries,
    testRaceConditions,
    testMemoryPerformance
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
    console.log('\n✅ All tests passed! The retry mechanism is working correctly.');
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
  testExponentialBackoff,
  testRetryEligibility,
  testGetInvoicesReadyForRetry,
  testNetworkErrorHandling,
  testFBRAPIErrorHandling,
  testMaxRetryLimit,
  testManualRetry,
  testProcessMultipleRetries,
  testRaceConditions,
  testMemoryPerformance
};