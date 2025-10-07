/**
 * Comprehensive Test Suite for Offline-to-Online Synchronization Workflow
 * Easy Filer v3 Application
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Test configuration
const config = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  headless: process.env.TEST_HEADLESS !== 'false',
  timeout: 30000,
  retries: 3
};

// Test data
const testInvoice = {
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  customerAddress: '123 Test Street, Karachi, Pakistan',
  items: [
    {
      description: 'Test Product 1',
      quantity: 2,
      price: 100.00
    },
    {
      description: 'Test Product 2',
      quantity: 1,
      price: 50.00
    }
  ]
};

const testCustomer = {
  name: 'Test Customer',
  email: 'test@example.com',
  address: '123 Test Street, Karachi, Pakistan',
  province: 'Sindh',
  phone: '+92-300-1234567'
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  details: []
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
  console.log(`${prefix} ${message}`);
  
  if (type === 'error') {
    testResults.errors.push({ timestamp, message });
  }
}

function recordTestResult(testName, passed, details = '') {
  testResults.details.push({
    test: testName,
    passed,
    details,
    timestamp: new Date().toISOString()
  });
  
  if (passed) {
    testResults.passed++;
    log(`✅ PASSED: ${testName}`, 'success');
  } else {
    testResults.failed++;
    log(`❌ FAILED: ${testName} - ${details}`, 'error');
  }
}

async function simulateNetworkConditions(page, condition) {
  const context = page.context();
  
  switch (condition) {
    case 'offline':
      await context.setOffline(true);
      log('Network set to OFFLINE');
      break;
    case 'online':
      await context.setOffline(false);
      log('Network set to ONLINE');
      break;
    case 'slow':
      // Simulate slow 3G connection
      await context.route('**/*', route => {
        // Allow some resources to load normally
        if (route.request().resourceType() === 'document' || 
            route.request().url().includes('/api/')) {
          setTimeout(() => route.continue(), 2000);
        } else {
          route.continue();
        }
      });
      log('Network set to SLOW (2s delay)');
      break;
    case 'unstable':
      // Simulate unstable connection with random failures
      let requestCount = 0;
      await context.route('**/*', route => {
        requestCount++;
        // Fail every 3rd API request
        if (route.request().url().includes('/api/') && requestCount % 3 === 0) {
          route.abort();
        } else {
          route.continue();
        }
      });
      log('Network set to UNSTABLE (random failures)');
      break;
  }
}

async function checkIndexedDBData(page, storeName) {
  return await page.evaluate((store) => {
    return new Promise((resolve) => {
      const request = indexedDB.open('EasyFilerDB', 1);
      
      request.onerror = () => resolve([]);
      request.onsuccess = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(store)) {
          resolve([]);
          return;
        }
        
        const transaction = db.transaction([store], 'readonly');
        const objectStore = transaction.objectStore(store);
        const getAllRequest = objectStore.getAll();
        
        getAllRequest.onerror = () => resolve([]);
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      };
    });
  }, storeName);
}

async function clearIndexedDB(page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const request = indexedDB.open('EasyFilerDB', 1);
      
      request.onerror = () => resolve();
      request.onsuccess = (event) => {
        const db = event.target.result;
        const storeNames = Array.from(db.objectStoreNames);
        
        if (storeNames.length === 0) {
          resolve();
          return;
        }
        
        const transaction = db.transaction(storeNames, 'versionchange');
        
        storeNames.forEach(storeName => {
          const objectStore = transaction.objectStore(storeName);
          objectStore.clear();
        });
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => resolve();
      };
    });
  });
}

// Test functions
async function testNetworkStatusDetection(page) {
  log('Testing network status detection...');
  
  try {
    // Test online status
    await simulateNetworkConditions(page, 'online');
    await page.waitForTimeout(1000);
    
    const isOnline = await page.evaluate(() => navigator.onLine);
    recordTestResult('Network Status Detection - Online', isOnline, 
      isOnline ? 'Correctly detected online status' : 'Failed to detect online status');
    
    // Test offline status
    await simulateNetworkConditions(page, 'offline');
    await page.waitForTimeout(1000);
    
    const isOffline = await page.evaluate(() => !navigator.onLine);
    recordTestResult('Network Status Detection - Offline', isOffline,
      isOffline ? 'Correctly detected offline status' : 'Failed to detect offline status');
    
    // Reset to online
    await simulateNetworkConditions(page, 'online');
    
  } catch (error) {
    recordTestResult('Network Status Detection', false, error.message);
  }
}

async function testOfflineInvoiceCreation(page) {
  log('Testing offline invoice creation...');
  
  try {
    // Go offline
    await simulateNetworkConditions(page, 'offline');
    
    // Navigate to invoice creation page
    await page.goto(`${config.baseUrl}/invoices/create`);
    await page.waitForLoadState('networkidle');
    
    // Fill invoice form
    await page.fill('#customerName', testInvoice.customerName);
    await page.fill('#customerEmail', testInvoice.customerEmail);
    await page.fill('#customerAddress', testInvoice.customerAddress);
    
    // Add items
    await page.fill('input[placeholder="Item description"]', testInvoice.items[0].description);
    await page.fill('input[type="number"][value="1"]', testInvoice.items[0].quantity.toString());
    await page.fill('input[placeholder="0"]', testInvoice.items[0].price.toString());
    
    // Save invoice offline
    await page.click('button:has-text("Save Draft")');
    await page.waitForTimeout(2000);
    
    // Check if invoice was saved to IndexedDB
    const offlineInvoices = await checkIndexedDBData(page, 'invoices');
    const hasOfflineInvoice = offlineInvoices.length > 0;
    
    recordTestResult('Offline Invoice Creation', hasOfflineInvoice,
      hasOfflineInvoice ? `Invoice saved offline (${offlineInvoices.length} total)` : 'Invoice not saved offline');
    
    return offlineInvoices.length > 0;
    
  } catch (error) {
    recordTestResult('Offline Invoice Creation', false, error.message);
    return false;
  }
}

async function testOfflineCustomerCreation(page) {
  log('Testing offline customer creation...');
  
  try {
    // Go offline
    await simulateNetworkConditions(page, 'offline');
    
    // Navigate to customer creation page
    await page.goto(`${config.baseUrl}/customers/new`);
    await page.waitForLoadState('networkidle');
    
    // Fill customer form
    await page.fill('input[name="name"]', testCustomer.name);
    await page.fill('input[name="email"]', testCustomer.email);
    await page.fill('input[name="address"]', testCustomer.address);
    await page.fill('input[name="province"]', testCustomer.province);
    await page.fill('input[name="phone"]', testCustomer.phone);
    
    // Save customer offline
    await page.click('button:has-text("Save Customer")');
    await page.waitForTimeout(2000);
    
    // Check if customer was saved to IndexedDB
    const offlineCustomers = await checkIndexedDBData(page, 'customers');
    const hasOfflineCustomer = offlineCustomers.length > 0;
    
    recordTestResult('Offline Customer Creation', hasOfflineCustomer,
      hasOfflineCustomer ? `Customer saved offline (${offlineCustomers.length} total)` : 'Customer not saved offline');
    
    return offlineCustomers.length > 0;
    
  } catch (error) {
    recordTestResult('Offline Customer Creation', false, error.message);
    return false;
  }
}

async function testSynchronizationOnReconnect(page) {
  log('Testing synchronization on reconnection...');
  
  try {
    // Ensure we have some offline data first
    const hasOfflineData = await testOfflineInvoiceCreation(page);
    
    if (!hasOfflineData) {
      recordTestResult('Synchronization on Reconnect', false, 'No offline data to sync');
      return false;
    }
    
    // Get offline invoice count before sync
    const offlineInvoicesBefore = await checkIndexedDBData(page, 'invoices');
    const unsyncedCount = offlineInvoicesBefore.filter(inv => !inv.synced).length;
    
    // Go back online
    await simulateNetworkConditions(page, 'online');
    await page.waitForTimeout(3000); // Wait for sync to trigger
    
    // Check if sync occurred
    const offlineInvoicesAfter = await checkIndexedDBData(page, 'invoices');
    const syncedCount = offlineInvoicesAfter.filter(inv => inv.synced).length;
    
    // Check if invoices appear in the system
    await page.goto(`${config.baseUrl}/invoices`);
    await page.waitForLoadState('networkidle');
    
    const hasInvoices = await page.locator('table tbody tr').count() > 0;
    
    const syncWorked = syncedCount > 0 || hasInvoices;
    
    recordTestResult('Synchronization on Reconnect', syncWorked,
      syncWorked ? `Synced ${syncedCount} invoices` : 'No invoices synced');
    
    return syncWorked;
    
  } catch (error) {
    recordTestResult('Synchronization on Reconnect', false, error.message);
    return false;
  }
}

async function testBackgroundSync(page) {
  log('Testing background sync functionality...');
  
  try {
    // Clear any existing data
    await clearIndexedDB(page);
    
    // Go offline
    await simulateNetworkConditions(page, 'offline');
    
    // Create multiple invoices offline
    for (let i = 0; i < 3; i++) {
      await page.goto(`${config.baseUrl}/invoices/create`);
      await page.waitForLoadState('networkidle');
      
      await page.fill('#customerName', `${testInvoice.customerName} ${i + 1}`);
      await page.fill('#customerEmail', `${i + 1}${testInvoice.customerEmail}`);
      await page.fill('#customerAddress', testInvoice.customerAddress);
      
      await page.fill('input[placeholder="Item description"]', `${testInvoice.items[0].description} ${i + 1}`);
      await page.fill('input[type="number"][value="1"]', testInvoice.items[0].quantity.toString());
      await page.fill('input[placeholder="0"]', testInvoice.items[0].price.toString());
      
      await page.click('button:has-text("Save Draft")');
      await page.waitForTimeout(1000);
    }
    
    // Check offline data
    const offlineInvoices = await checkIndexedDBData(page, 'invoices');
    const hasMultipleInvoices = offlineInvoices.length >= 3;
    
    if (!hasMultipleInvoices) {
      recordTestResult('Background Sync', false, 'Failed to create multiple offline invoices');
      return false;
    }
    
    // Register service worker and go online
    await page.goto(`${config.baseUrl}`);
    await page.waitForLoadState('networkidle');
    
    // Trigger background sync
    await page.evaluate(() => {
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          return registration.sync.register('sync-invoices');
        });
      }
    });
    
    // Go online
    await simulateNetworkConditions(page, 'online');
    await page.waitForTimeout(5000); // Wait for background sync
    
    // Check results
    const syncedInvoices = await checkIndexedDBData(page, 'invoices');
    const allSynced = syncedInvoices.every(inv => inv.synced);
    
    recordTestResult('Background Sync', allSynced,
      allSynced ? 'All invoices synced via background sync' : 'Background sync failed');
    
    return allSynced;
    
  } catch (error) {
    recordTestResult('Background Sync', false, error.message);
    return false;
  }
}

async function testErrorHandlingDuringSync(page) {
  log('Testing error handling during sync...');
  
  try {
    // Clear any existing data
    await clearIndexedDB(page);
    
    // Go offline
    await simulateNetworkConditions(page, 'offline');
    
    // Create an invoice with invalid data
    await page.goto(`${config.baseUrl}/invoices/create`);
    await page.waitForLoadState('networkidle');
    
    await page.fill('#customerName', ''); // Invalid - empty customer name
    await page.fill('#customerEmail', testInvoice.customerEmail);
    await page.fill('#customerAddress', testInvoice.customerAddress);
    
    await page.fill('input[placeholder="Item description"]', testInvoice.items[0].description);
    await page.fill('input[type="number"][value="1"]', testInvoice.items[0].quantity.toString());
    await page.fill('input[placeholder="0"]', testInvoice.items[0].price.toString());
    
    await page.click('button:has-text("Save Draft")');
    await page.waitForTimeout(1000);
    
    // Now go online with unstable connection
    await simulateNetworkConditions(page, 'unstable');
    await page.waitForTimeout(3000);
    
    // Check if error handling works
    const offlineInvoices = await checkIndexedDBData(page, 'invoices');
    const hasFailedSync = offlineInvoices.some(inv => !inv.synced);
    
    recordTestResult('Error Handling During Sync', hasFailedSync,
      hasFailedSync ? 'Properly handled sync failures' : 'Error handling failed');
    
    return hasFailedSync;
    
  } catch (error) {
    recordTestResult('Error Handling During Sync', false, error.message);
    return false;
  }
}

async function testUIReflectionOfNetworkStatus(page) {
  log('Testing UI reflection of network status...');
  
  try {
    // Go to invoice creation page
    await page.goto(`${config.baseUrl}/invoices/create`);
    await page.waitForLoadState('networkidle');
    
    // Test online status UI
    await simulateNetworkConditions(page, 'online');
    await page.waitForTimeout(1000);
    
    const onlineIndicator = await page.locator('svg:has-text("Wifi")').isVisible();
    const offlineMessage = await page.locator('text=Offline Mode').isVisible();
    
    const correctOnlineUI = onlineIndicator && !offlineMessage;
    
    recordTestResult('UI Reflection - Online Status', correctOnlineUI,
      correctOnlineUI ? 'UI correctly shows online status' : 'UI does not reflect online status');
    
    // Test offline status UI
    await simulateNetworkConditions(page, 'offline');
    await page.waitForTimeout(1000);
    
    const offlineIndicator = await page.locator('svg:has-text("WifiOff")').isVisible();
    const onlineSubmitDisabled = await page.locator('button:has-text("Needs Internet")').isVisible();
    
    const correctOfflineUI = offlineIndicator && onlineSubmitDisabled;
    
    recordTestResult('UI Reflection - Offline Status', correctOfflineUI,
      correctOfflineUI ? 'UI correctly shows offline status' : 'UI does not reflect offline status');
    
    return correctOnlineUI && correctOfflineUI;
    
  } catch (error) {
    recordTestResult('UI Reflection of Network Status', false, error.message);
    return false;
  }
}

async function testOfflinePageFunctionality(page) {
  log('Testing offline page functionality...');
  
  try {
    // Go offline
    await simulateNetworkConditions(page, 'offline');
    
    // Navigate to offline page
    await page.goto(`${config.baseUrl}/offline`);
    await page.waitForLoadState('networkidle');
    
    // Check if offline page loads correctly
    const pageTitle = await page.locator('h1:has-text("Easy Filer Works Offline")').isVisible();
    const retryButton = await page.locator('button:has-text("Retry")').isVisible();
    const featuresListed = await page.locator('text=Available Offline').isVisible();
    
    const offlinePageWorks = pageTitle && retryButton && featuresListed;
    
    recordTestResult('Offline Page Functionality', offlinePageWorks,
      offlinePageWorks ? 'Offline page loads correctly' : 'Offline page has issues');
    
    // Test retry functionality
    await simulateNetworkConditions(page, 'online');
    await page.click('button:has-text("Retry")');
    await page.waitForTimeout(2000);
    
    const redirected = page.url().includes('/dashboard');
    
    recordTestResult('Offline Page Retry Functionality', redirected,
      redirected ? 'Retry button redirects correctly' : 'Retry button failed');
    
    return offlinePageWorks && redirected;
    
  } catch (error) {
    recordTestResult('Offline Page Functionality', false, error.message);
    return false;
  }
}

async function testServiceWorkerCaching(page) {
  log('Testing service worker caching...');
  
  try {
    // Navigate to a page
    await page.goto(`${config.baseUrl}/invoices`);
    await page.waitForLoadState('networkidle');
    
    // Check if service worker is active
    const swActive = await page.evaluate(() => {
      return navigator.serviceWorker && navigator.serviceWorker.controller;
    });
    
    recordTestResult('Service Worker Active', swActive,
      swActive ? 'Service worker is active' : 'Service worker not active');
    
    // Go offline and try to access the page again
    await simulateNetworkConditions(page, 'offline');
    await page.goto(`${config.baseUrl}/invoices`);
    await page.waitForLoadState('networkidle');
    
    // Check if page loads from cache
    const pageLoadsOffline = await page.locator('h1:has-text("Invoices")').isVisible();
    
    recordTestResult('Service Worker Caching', pageLoadsOffline,
      pageLoadsOffline ? 'Page loads from cache when offline' : 'Page does not load from cache');
    
    // Reset to online
    await simulateNetworkConditions(page, 'online');
    
    return swActive && pageLoadsOffline;
    
  } catch (error) {
    recordTestResult('Service Worker Caching', false, error.message);
    return false;
  }
}

async function testLargeDataSync(page) {
  log('Testing large data synchronization...');
  
  try {
    // Clear any existing data
    await clearIndexedDB(page);
    
    // Go offline
    await simulateNetworkConditions(page, 'offline');
    
    // Create multiple invoices with multiple items
    for (let i = 0; i < 5; i++) {
      await page.goto(`${config.baseUrl}/invoices/create`);
      await page.waitForLoadState('networkidle');
      
      await page.fill('#customerName', `${testInvoice.customerName} ${i + 1}`);
      await page.fill('#customerEmail', `${i + 1}${testInvoice.customerEmail}`);
      await page.fill('#customerAddress', testInvoice.customerAddress);
      
      // Add multiple items
      for (let j = 0; j < 3; j++) {
        if (j > 0) {
          await page.click('button:has-text("Plus")');
          await page.waitForTimeout(500);
        }
        
        await page.fill(`input[placeholder="Item description"]`, `${testInvoice.items[0].description} ${i + 1}-${j + 1}`);
        await page.fill(`input[type="number"][value="1"]`, testInvoice.items[0].quantity.toString());
        await page.fill(`input[placeholder="0"]`, testInvoice.items[0].price.toString());
      }
      
      await page.click('button:has-text("Save Draft")');
      await page.waitForTimeout(1000);
    }
    
    // Check offline data
    const offlineInvoices = await checkIndexedDBData(page, 'invoices');
    const hasLargeDataSet = offlineInvoices.length >= 5;
    
    if (!hasLargeDataSet) {
      recordTestResult('Large Data Sync', false, 'Failed to create large dataset');
      return false;
    }
    
    // Go online and sync
    await simulateNetworkConditions(page, 'online');
    await page.waitForTimeout(5000); // Wait for sync
    
    // Check results
    const syncedInvoices = await checkIndexedDBData(page, 'invoices');
    const allSynced = syncedInvoices.every(inv => inv.synced);
    
    // Check if all invoices appear in the system
    await page.goto(`${config.baseUrl}/invoices`);
    await page.waitForLoadState('networkidle');
    
    const invoiceCount = await page.locator('table tbody tr').count();
    const allInvoicesInSystem = invoiceCount >= 5;
    
    const largeDataSyncWorked = allSynced && allInvoicesInSystem;
    
    recordTestResult('Large Data Sync', largeDataSyncWorked,
      largeDataSyncWorked ? `Successfully synced ${offlineInvoices.length} invoices` : 'Large data sync failed');
    
    return largeDataSyncWorked;
    
  } catch (error) {
    recordTestResult('Large Data Sync', false, error.message);
    return false;
  }
}

async function testConflictResolution(page) {
  log('Testing conflict resolution...');
  
  try {
    // This test simulates a scenario where data might have changed on the server
    // while the user was offline
    
    // Clear any existing data
    await clearIndexedDB(page);
    
    // First, create an invoice online
    await simulateNetworkConditions(page, 'online');
    await page.goto(`${config.baseUrl}/invoices/create`);
    await page.waitForLoadState('networkidle');
    
    await page.fill('#customerName', 'Conflict Test Customer');
    await page.fill('#customerEmail', 'conflict@example.com');
    await page.fill('#customerAddress', testInvoice.customerAddress);
    
    await page.fill('input[placeholder="Item description"]', testInvoice.items[0].description);
    await page.fill('input[type="number"][value="1"]', testInvoice.items[0].quantity.toString());
    await page.fill('input[placeholder="0"]', testInvoice.items[0].price.toString());
    
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(2000);
    
    // Go offline
    await simulateNetworkConditions(page, 'offline');
    
    // Create another invoice with similar data
    await page.goto(`${config.baseUrl}/invoices/create`);
    await page.waitForLoadState('networkidle');
    
    await page.fill('#customerName', 'Conflict Test Customer Modified');
    await page.fill('#customerEmail', 'conflict@example.com');
    await page.fill('#customerAddress', testInvoice.customerAddress);
    
    await page.fill('input[placeholder="Item description"]', testInvoice.items[0].description);
    await page.fill('input[type="number"][value="1"]', testInvoice.items[0].quantity.toString());
    await page.fill('input[placeholder="0"]', testInvoice.items[0].price.toString());
    
    await page.click('button:has-text("Save Draft")');
    await page.waitForTimeout(1000);
    
    // Go back online
    await simulateNetworkConditions(page, 'online');
    await page.waitForTimeout(3000);
    
    // Check if conflict was handled
    const offlineInvoices = await checkIndexedDBData(page, 'invoices');
    const hasConflictResolution = offlineInvoices.every(inv => inv.synced || inv.conflictHandled);
    
    recordTestResult('Conflict Resolution', hasConflictResolution,
      hasConflictResolution ? 'Conflicts resolved properly' : 'Conflict resolution needs improvement');
    
    return hasConflictResolution;
    
  } catch (error) {
    recordTestResult('Conflict Resolution', false, error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  log('Starting offline-to-online synchronization workflow tests...');
  
  const browser = await chromium.launch({ headless: config.headless });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Set up error handling
    page.on('pageerror', error => {
      log(`Page error: ${error.message}`, 'error');
    });
    
    page.on('requestfailed', request => {
      log(`Request failed: ${request.url()} - ${request.failure().errorText}`, 'error');
    });
    
    // Run all tests
    await testNetworkStatusDetection(page);
    await testOfflineInvoiceCreation(page);
    await testOfflineCustomerCreation(page);
    await testSynchronizationOnReconnect(page);
    await testBackgroundSync(page);
    await testErrorHandlingDuringSync(page);
    await testUIReflectionOfNetworkStatus(page);
    await testOfflinePageFunctionality(page);
    await testServiceWorkerCaching(page);
    await testLargeDataSync(page);
    await testConflictResolution(page);
    
    // Generate test report
    const report = {
      summary: {
        total: testResults.passed + testResults.failed,
        passed: testResults.passed,
        failed: testResults.failed,
        timestamp: new Date().toISOString()
      },
      details: testResults.details,
      errors: testResults.errors
    };
    
    // Save report to file
    const reportPath = path.join(__dirname, 'offline-sync-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Print summary
    log('\n=== TEST SUMMARY ===');
    log(`Total tests: ${report.summary.total}`);
    log(`Passed: ${report.summary.passed}`);
    log(`Failed: ${report.summary.failed}`);
    log(`Success rate: ${((report.summary.passed / report.summary.total) * 100).toFixed(2)}%`);
    log(`Report saved to: ${reportPath}`);
    
    if (report.summary.failed > 0) {
      log('\n=== FAILED TESTS ===');
      testResults.details
        .filter(test => !test.passed)
        .forEach(test => {
          log(`${test.test}: ${test.details}`, 'error');
        });
    }
    
    return report.summary.failed === 0;
    
  } catch (error) {
    log(`Test runner error: ${error.message}`, 'error');
    return false;
  } finally {
    await browser.close();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`Fatal error: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = {
  runTests,
  testNetworkStatusDetection,
  testOfflineInvoiceCreation,
  testOfflineCustomerCreation,
  testSynchronizationOnReconnect,
  testBackgroundSync,
  testErrorHandlingDuringSync,
  testUIReflectionOfNetworkStatus,
  testOfflinePageFunctionality,
  testServiceWorkerCaching,
  testLargeDataSync,
  testConflictResolution
};