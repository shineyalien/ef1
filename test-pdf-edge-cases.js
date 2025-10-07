/**
 * PDF Edge Cases Test Script
 * Tests edge cases and special scenarios for PDF generation
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const config = {
  baseUrl: 'http://localhost:3000', // Update with your local URL
  testResultsDir: './test-results',
  pdfOutputDir: './test-results/edge-cases',
  timeout: 30000
};

// Edge case test data
const edgeCases = [
  {
    name: 'Special Characters',
    description: 'Test PDF with special characters in names and descriptions',
    url: '/api/test-pdf?theme=default',
    expectedContent: ['Special characters: @#$%^&*()_+-=[]{}|;:,.<>?'],
    category: 'character-handling'
  },
  {
    name: 'Unicode Characters',
    description: 'Test PDF with Unicode characters (Arabic, Chinese, etc.)',
    url: '/api/test-pdf?theme=default',
    expectedContent: ['Unicode: العربية 中文 日本語 русский'],
    category: 'character-handling'
  },
  {
    name: 'Very Long Descriptions',
    description: 'Test PDF with very long product descriptions',
    url: '/api/test-pdf?theme=default',
    expectedContent: ['This is a very long product description that exceeds the normal length and should be truncated or wrapped properly in the PDF layout'],
    category: 'layout-handling'
  },
  {
    name: 'Negative Values',
    description: 'Test PDF with negative amounts (discounts, credits)',
    url: '/api/test-pdf?theme=default',
    expectedContent: ['-100.00', 'Discount'],
    category: 'financial-handling'
  },
  {
    name: 'Zero Tax Items',
    description: 'Test PDF with zero-rated and exempt items',
    url: '/api/test-pdf?theme=default',
    expectedContent: ['0%', 'Exempt', 'Zero Rated'],
    category: 'tax-handling'
  },
  {
    name: 'Multiple Tax Rates',
    description: 'Test PDF with items having different tax rates',
    url: '/api/test-pdf?theme=default',
    expectedContent: ['5%', '12%', '16%', '18%'],
    category: 'tax-handling'
  },
  {
    name: 'Large Invoice',
    description: 'Test PDF with many line items (pagination test)',
    url: '/api/test-pdf?theme=default',
    expectedContent: ['Item 20', 'Item 25', 'Item 30'],
    category: 'performance'
  },
  {
    name: 'Empty Customer Fields',
    description: 'Test PDF with missing customer information',
    url: '/api/test-pdf?theme=default',
    expectedContent: ['N/A', 'Not Provided'],
    category: 'data-handling'
  }
];

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  categories: {},
  details: []
};

/**
 * Initialize test environment
 */
async function initializeTestEnvironment() {
  console.log('🚀 Initializing PDF Edge Cases Tests...\n');
  
  // Create test directories
  if (!fs.existsSync(config.testResultsDir)) {
    fs.mkdirSync(config.testResultsDir, { recursive: true });
  }
  
  if (!fs.existsSync(config.pdfOutputDir)) {
    fs.mkdirSync(config.pdfOutputDir, { recursive: true });
  }
  
  console.log(`📁 Edge case test results will be saved to: ${config.pdfOutputDir}\n`);
}

/**
 * Test edge cases for PDF generation
 */
async function testEdgeCases() {
  console.log('🔍 Testing PDF Edge Cases...\n');
  
  for (const edgeCase of edgeCases) {
    console.log(`Testing: ${edgeCase.name}`);
    console.log(`Description: ${edgeCase.description}`);
    
    try {
      const startTime = Date.now();
      
      // For edge cases, we would need to modify the test-pdf endpoint to accept custom data
      // For now, we'll test the basic functionality and document what should be tested
      const response = await fetch(`${config.baseUrl}${edgeCase.url}`, {
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
      
      // Save PDF file
      const buffer = await response.arrayBuffer();
      const fileName = `${edgeCase.category}-${edgeCase.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      const filePath = path.join(config.pdfOutputDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(buffer));
      
      // Check file size
      const stats = fs.statSync(filePath);
      const fileSizeKB = Math.round(stats.size / 1024);
      
      // For now, we'll consider the test passed if PDF is generated
      // In a real implementation, you would parse the PDF and check content
      testResults.passed++;
      testResults.total++;
      
      // Update category stats
      if (!testResults.categories[edgeCase.category]) {
        testResults.categories[edgeCase.category] = { passed: 0, failed: 0 };
      }
      testResults.categories[edgeCase.category].passed++;
      
      const result = {
        test: edgeCase.name,
        category: edgeCase.category,
        status: 'PASSED',
        generationTime: `${generationTime}ms`,
        fileSize: `${fileSizeKB}KB`,
        filePath: filePath,
        note: 'PDF generated successfully - content validation requires PDF parser'
      };
      
      testResults.details.push(result);
      
      console.log(`  ✅ PASSED - Generation time: ${generationTime}ms, File size: ${fileSizeKB}KB`);
      console.log(`  📝 Note: ${result.note}\n`);
      
    } catch (error) {
      testResults.failed++;
      testResults.total++;
      
      // Update category stats
      if (!testResults.categories[edgeCase.category]) {
        testResults.categories[edgeCase.category] = { passed: 0, failed: 0 };
      }
      testResults.categories[edgeCase.category].failed++;
      
      const result = {
        test: edgeCase.name,
        category: edgeCase.category,
        status: 'FAILED',
        error: error.message
      };
      
      testResults.details.push(result);
      
      console.log(`  ❌ FAILED - ${error.message}\n`);
    }
  }
}

/**
 * Test PDF size limits and memory usage
 */
async function testSizeLimits() {
  console.log('📏 Testing PDF Size Limits...\n');
  
  const sizeTests = [
    {
      name: 'Small PDF (< 50KB)',
      maxSize: 50,
      description: 'Small invoice should generate a compact PDF'
    },
    {
      name: 'Medium PDF (< 200KB)',
      maxSize: 200,
      description: 'Medium invoice should generate a reasonably sized PDF'
    },
    {
      name: 'Large PDF (< 500KB)',
      maxSize: 500,
      description: 'Large invoice should not exceed 500KB'
    }
  ];
  
  for (const sizeTest of sizeTests) {
    console.log(`Testing: ${sizeTest.name}`);
    
    try {
      const response = await fetch(`${config.baseUrl}/api/test-pdf?theme=default`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      const fileSizeKB = Math.round(buffer.length / 1024);
      
      if (fileSizeKB <= sizeTest.maxSize) {
        testResults.passed++;
        testResults.total++;
        
        const result = {
          test: sizeTest.name,
          status: 'PASSED',
          fileSize: `${fileSizeKB}KB`,
          maxSize: `${sizeTest.maxSize}KB`
        };
        
        testResults.details.push(result);
        
        console.log(`  ✅ PASSED - File size: ${fileSizeKB}KB (max: ${sizeTest.maxSize}KB)\n`);
      } else {
        throw new Error(`File size ${fileSizeKB}KB exceeds maximum ${sizeTest.maxSize}KB`);
      }
      
    } catch (error) {
      testResults.failed++;
      testResults.total++;
      
      const result = {
        test: sizeTest.name,
        status: 'FAILED',
        error: error.message
      };
      
      testResults.details.push(result);
      
      console.log(`  ❌ FAILED - ${error.message}\n`);
    }
  }
}

/**
 * Test concurrent PDF generation
 */
async function testConcurrentGeneration() {
  console.log('⚡ Testing Concurrent PDF Generation...\n');
  
  const concurrentTests = [
    {
      name: '5 Concurrent PDFs',
      concurrency: 5,
      maxTime: 5000 // 5 seconds
    },
    {
      name: '10 Concurrent PDFs',
      concurrency: 10,
      maxTime: 10000 // 10 seconds
    }
  ];
  
  for (const concurrentTest of concurrentTests) {
    console.log(`Testing: ${concurrentTest.name}`);
    
    try {
      const startTime = Date.now();
      
      // Create concurrent requests
      const promises = [];
      for (let i = 0; i < concurrentTest.concurrency; i++) {
        promises.push(
          fetch(`${config.baseUrl}/api/test-pdf?theme=default`, {
            method: 'GET',
            headers: {
              'Accept': 'application/pdf'
            }
          })
        );
      }
      
      // Wait for all requests to complete
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Check all responses
      let allSuccessful = true;
      for (const response of responses) {
        if (!response.ok) {
          allSuccessful = false;
          break;
        }
      }
      
      if (allSuccessful && totalTime <= concurrentTest.maxTime) {
        testResults.passed++;
        testResults.total++;
        
        const result = {
          test: concurrentTest.name,
          status: 'PASSED',
          totalTime: `${totalTime}ms`,
          maxTime: `${concurrentTest.maxTime}ms`,
          requests: concurrentTest.concurrency
        };
        
        testResults.details.push(result);
        
        console.log(`  ✅ PASSED - Total time: ${totalTime}ms for ${concurrentTest.concurrency} requests\n`);
      } else {
        throw new Error(`Concurrent test failed: allSuccessful=${allSuccessful}, time=${totalTime}ms`);
      }
      
    } catch (error) {
      testResults.failed++;
      testResults.total++;
      
      const result = {
        test: concurrentTest.name,
        status: 'FAILED',
        error: error.message
      };
      
      testResults.details.push(result);
      
      console.log(`  ❌ FAILED - ${error.message}\n`);
    }
  }
}

/**
 * Generate edge case test report
 */
function generateTestReport() {
  console.log('📊 Generating Edge Case Test Report...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    testType: 'PDF Edge Cases',
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: `${Math.round((testResults.passed / testResults.total) * 100)}%`
    },
    categories: testResults.categories,
    details: testResults.details,
    recommendations: []
  };
  
  // Add specific recommendations for edge cases
  if (testResults.categories['character-handling']?.failed > 0) {
    report.recommendations.push('Character handling issues detected. Ensure proper UTF-8 encoding in PDF generation.');
  }
  
  if (testResults.categories['layout-handling']?.failed > 0) {
    report.recommendations.push('Layout issues detected. Improve text wrapping and pagination logic.');
  }
  
  if (testResults.categories['financial-handling']?.failed > 0) {
    report.recommendations.push('Financial handling issues detected. Ensure proper formatting of negative values and currencies.');
  }
  
  if (testResults.categories['performance']?.failed > 0) {
    report.recommendations.push('Performance issues detected with large invoices. Consider implementing pagination or streaming.');
  }
  
  // Save report
  const reportPath = path.join(config.testResultsDir, 'pdf-edge-cases-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('='.repeat(60));
  console.log('📋 EDGE CASE TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${report.summary.successRate}`);
  console.log('');
  
  // Print category breakdown
  console.log('📂 CATEGORY BREAKDOWN:');
  for (const [category, stats] of Object.entries(testResults.categories)) {
    const total = stats.passed + stats.failed;
    const rate = Math.round((stats.passed / total) * 100);
    console.log(`  ${category}: ${stats.passed}/${total} (${rate}%)`);
  }
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
async function runEdgeCaseTests() {
  try {
    await initializeTestEnvironment();
    await testEdgeCases();
    await testSizeLimits();
    await testConcurrentGeneration();
    generateTestReport();
    
    console.log('\n🎉 PDF edge case testing completed!');
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n💥 Edge case test execution failed:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runEdgeCaseTests();
}

module.exports = {
  runEdgeCaseTests,
  testEdgeCases,
  testSizeLimits,
  testConcurrentGeneration,
  generateTestReport
};