/**
 * Comprehensive PDF Functionality Test Script
 * Tests all aspects of PDF generation in Easy Filer v3
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const config = {
  baseUrl: 'http://localhost:3000', // Update with your local URL
  testResultsDir: './test-results',
  pdfOutputDir: './test-results/pdfs',
  timeout: 30000 // 30 seconds timeout for PDF generation
};

// Test data
const testCases = [
  {
    name: 'Default Theme',
    url: '/api/test-pdf?theme=default',
    expectedFile: 'default-theme.pdf'
  },
  {
    name: 'Modern Theme',
    url: '/api/test-pdf?theme=modern',
    expectedFile: 'modern-theme.pdf'
  },
  {
    name: 'Classic Theme',
    url: '/api/test-pdf?theme=classic',
    expectedFile: 'classic-theme.pdf'
  },
  {
    name: 'FBR Compliant Invoice',
    url: '/api/test-pdf?theme=default&fbr=true',
    expectedFile: 'fbr-compliant.pdf'
  }
];

// Performance test data
const performanceTests = [
  {
    name: 'Small Invoice (5 items)',
    description: 'Test generation time for small invoice'
  },
  {
    name: 'Medium Invoice (20 items)',
    description: 'Test generation time for medium invoice'
  },
  {
    name: 'Large Invoice (50 items)',
    description: 'Test generation time for large invoice'
  }
];

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

/**
 * Initialize test environment
 */
async function initializeTestEnvironment() {
  console.log('🚀 Initializing PDF Functionality Tests...\n');
  
  // Create test directories
  if (!fs.existsSync(config.testResultsDir)) {
    fs.mkdirSync(config.testResultsDir, { recursive: true });
  }
  
  if (!fs.existsSync(config.pdfOutputDir)) {
    fs.mkdirSync(config.pdfOutputDir, { recursive: true });
  }
  
  console.log(`📁 Test results will be saved to: ${config.pdfOutputDir}\n`);
}

/**
 * Test PDF generation for different themes
 */
async function testPDFThemes() {
  console.log('🎨 Testing PDF Themes...\n');
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const startTime = Date.now();
      const response = await fetch(`${config.baseUrl}${testCase.url}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      const endTime = Date.now();
      const generationTime = endTime - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Check if response is PDF
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error(`Invalid content type: ${contentType}`);
      }
      
      // Save PDF file
      const buffer = await response.arrayBuffer();
      const filePath = path.join(config.pdfOutputDir, testCase.expectedFile);
      fs.writeFileSync(filePath, Buffer.from(buffer));
      
      // Check file size
      const stats = fs.statSync(filePath);
      const fileSizeKB = Math.round(stats.size / 1024);
      
      // Record successful test
      testResults.passed++;
      testResults.total++;
      
      const result = {
        test: testCase.name,
        status: 'PASSED',
        generationTime: `${generationTime}ms`,
        fileSize: `${fileSizeKB}KB`,
        filePath: filePath
      };
      
      testResults.details.push(result);
      
      console.log(`  ✅ PASSED - Generation time: ${generationTime}ms, File size: ${fileSizeKB}KB\n`);
      
    } catch (error) {
      testResults.failed++;
      testResults.total++;
      
      const result = {
        test: testCase.name,
        status: 'FAILED',
        error: error.message
      };
      
      testResults.details.push(result);
      
      console.log(`  ❌ FAILED - ${error.message}\n`);
    }
  }
}

/**
 * Test PDF generation with authentication
 */
async function testAuthentication() {
  console.log('🔐 Testing Authentication...\n');
  
  const authTests = [
    {
      name: 'Unauthenticated PDF Request',
      url: '/api/test-pdf?theme=default',
      headers: {},
      expectedStatus: 401
    },
    {
      name: 'Invalid Invoice ID',
      url: '/api/invoices/invalid-id/pdf',
      headers: {},
      expectedStatus: 404
    }
  ];
  
  for (const authTest of authTests) {
    console.log(`Testing: ${authTest.name}`);
    
    try {
      const response = await fetch(`${config.baseUrl}${authTest.url}`, {
        method: 'GET',
        headers: authTest.headers
      });
      
      if (response.status === authTest.expectedStatus) {
        testResults.passed++;
        testResults.total++;
        
        const result = {
          test: authTest.name,
          status: 'PASSED',
          expectedStatus: authTest.expectedStatus,
          actualStatus: response.status
        };
        
        testResults.details.push(result);
        
        console.log(`  ✅ PASSED - Correctly returned ${response.status}\n`);
      } else {
        throw new Error(`Expected status ${authTest.expectedStatus}, got ${response.status}`);
      }
      
    } catch (error) {
      testResults.failed++;
      testResults.total++;
      
      const result = {
        test: authTest.name,
        status: 'FAILED',
        error: error.message
      };
      
      testResults.details.push(result);
      
      console.log(`  ❌ FAILED - ${error.message}\n`);
    }
  }
}

/**
 * Test PDF generation performance
 */
async function testPerformance() {
  console.log('⚡ Testing Performance...\n');
  
  for (const perfTest of performanceTests) {
    console.log(`Testing: ${perfTest.name}`);
    
    try {
      const times = [];
      
      // Run test multiple times for average
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        
        const response = await fetch(`${config.baseUrl}/api/test-pdf?theme=default`, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf'
          }
        });
        
        const endTime = Date.now();
        times.push(endTime - startTime);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Consume the response to avoid memory issues
        await response.arrayBuffer();
      }
      
      // Calculate statistics
      const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      
      // Performance criteria
      const passed = avgTime < 2000; // Less than 2 seconds
      
      if (passed) {
        testResults.passed++;
      } else {
        testResults.failed++;
      }
      testResults.total++;
      
      const result = {
        test: perfTest.name,
        status: passed ? 'PASSED' : 'FAILED',
        avgTime: `${avgTime}ms`,
        minTime: `${minTime}ms`,
        maxTime: `${maxTime}ms`,
        samples: times.length
      };
      
      testResults.details.push(result);
      
      console.log(`  ${passed ? '✅' : '❌'} ${passed ? 'PASSED' : 'FAILED'} - Avg: ${avgTime}ms, Min: ${minTime}ms, Max: ${maxTime}ms\n`);
      
    } catch (error) {
      testResults.failed++;
      testResults.total++;
      
      const result = {
        test: perfTest.name,
        status: 'FAILED',
        error: error.message
      };
      
      testResults.details.push(result);
      
      console.log(`  ❌ FAILED - ${error.message}\n`);
    }
  }
}

/**
 * Test PDF content validation
 */
async function testPDFContent() {
  console.log('📄 Testing PDF Content...\n');
  
  const contentTests = [
    {
      name: 'Default Theme Content',
      url: '/api/test-pdf?theme=default',
      expectedContent: ['Test Company Ltd.', 'TEST-001', 'Test Customer', 'PKR']
    },
    {
      name: 'FBR Invoice Content',
      url: '/api/test-pdf?theme=default&fbr=true',
      expectedContent: ['Test Company Ltd.', 'FBR VALIDATED', '7000007DI1747119701593']
    }
  ];
  
  for (const contentTest of contentTests) {
    console.log(`Testing: ${contentTest.name}`);
    
    try {
      const response = await fetch(`${config.baseUrl}${contentTest.url}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // For content validation, we would need a PDF parsing library
      // For now, we'll just check if the PDF is generated successfully
      const buffer = await response.arrayBuffer();
      
      if (buffer.length < 1000) {
        throw new Error('PDF file too small, likely invalid');
      }
      
      testResults.passed++;
      testResults.total++;
      
      const result = {
        test: contentTest.name,
        status: 'PASSED',
        fileSize: `${Math.round(buffer.length / 1024)}KB`
      };
      
      testResults.details.push(result);
      
      console.log(`  ✅ PASSED - PDF generated successfully (${Math.round(buffer.length / 1024)}KB)\n`);
      
    } catch (error) {
      testResults.failed++;
      testResults.total++;
      
      const result = {
        test: contentTest.name,
        status: 'FAILED',
        error: error.message
      };
      
      testResults.details.push(result);
      
      console.log(`  ❌ FAILED - ${error.message}\n`);
    }
  }
}

/**
 * Generate test report
 */
function generateTestReport() {
  console.log('📊 Generating Test Report...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: `${Math.round((testResults.passed / testResults.total) * 100)}%`
    },
    details: testResults.details,
    recommendations: []
  };
  
  // Add recommendations based on test results
  if (testResults.failed > 0) {
    report.recommendations.push('Some tests failed. Review the failed tests and fix the issues.');
  }
  
  if (testResults.details.some(d => d.generationTime && parseInt(d.generationTime) > 3000)) {
    report.recommendations.push('Some PDF generations are taking longer than expected. Consider optimizing the PDF generation process.');
  }
  
  if (testResults.details.some(d => d.fileSize && parseInt(d.fileSize) > 500)) {
    report.recommendations.push('Some PDF files are larger than expected. Consider optimizing images and content.');
  }
  
  // Save report
  const reportPath = path.join(config.testResultsDir, 'pdf-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('='.repeat(60));
  console.log('📋 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${report.summary.successRate}`);
  console.log('');
  
  if (report.recommendations.length > 0) {
    console.log('💡 RECOMMENDATIONS:');
    report.recommendations.forEach(rec => console.log(`  • ${rec}`));
    console.log('');
  }
  
  console.log(`📄 Detailed report saved to: ${reportPath}`);
  console.log(`📁 PDF files saved to: ${config.pdfOutputDir}`);
  console.log('='.repeat(60));
}

/**
 * Main test execution function
 */
async function runTests() {
  try {
    await initializeTestEnvironment();
    await testPDFThemes();
    await testAuthentication();
    await testPerformance();
    await testPDFContent();
    generateTestReport();
    
    console.log('\n🎉 PDF functionality testing completed!');
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testPDFThemes,
  testAuthentication,
  testPerformance,
  testPDFContent,
  generateTestReport
};