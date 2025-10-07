/**
 * Comprehensive Test Suite for FBR Integration Components
 * 
 * This test suite validates the FBR integration components including:
 * 1. FBR Client API integration
 * 2. Tax calculation engine
 * 3. QR code generation
 * 4. FBR scenarios management
 * 5. API endpoints
 */

import { PRALAPIClient } from './libs/fbr-integration/src/client';
import { PakistaniTaxCalculator, TaxValidationService } from './libs/fbr-integration/src/tax-calculator';
import { QRCodeGenerator } from './libs/fbr-integration/src/qr-generator';
import { getApplicableScenarios, validateScenarioApplicability } from './apps/web/src/lib/fbr-scenarios';
import { validateInvoiceData } from './libs/fbr-integration/src/validators';
import { PRALInvoiceRequest } from './libs/fbr-integration/src/types';

// Test configuration
const TEST_CONFIG = {
  // Test credentials (sandbox)
  credentials: {
    bearerToken: process.env.FBR_SANDBOX_TOKEN || 'test-token',
    environment: 'sandbox' as const
  },
  
  // Test invoice data
  testInvoice: {
    invoiceType: 'Sale Invoice' as const,
    invoiceDate: '2024-01-15',
    sellerNTNCNIC: '1234567',
    sellerBusinessName: 'Test Business',
    sellerProvince: 'PUNJAB',
    sellerAddress: '123 Test Street, Lahore',
    buyerNTNCNIC: '7654321',
    buyerBusinessName: 'Test Customer',
    buyerProvince: 'SINDH',
    buyerAddress: '456 Customer Street, Karachi',
    buyerRegistrationType: 'Registered' as const,
    scenarioId: 'MFG-001',
    items: [
      {
        hsCode: '8471.60.90',
        productDescription: 'Computer Mouse',
        rate: '18%',
        uoM: 'PCS',
        quantity: 10,
        totalValues: 1180,
        valueSalesExcludingST: 1000,
        fixedNotifiedValueOrRetailPrice: 100,
        salesTaxApplicable: 180,
        salesTaxWithheldAtSource: 0,
        extraTax: 0,
        furtherTax: 0,
        sroScheduleNo: 'SRO 1125(I)/2011',
        fedPayable: 0,
        discount: 0,
        saleType: 'Goods at standard rate (default)',
        sroItemSerialNo: '001'
      }
    ]
  } as PRALInvoiceRequest
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: [] as { test: string; error: string }[]
};

// Helper function to log test results
function logTest(testName: string, passed: boolean, error: string | null = null): void {
  if (passed) {
    console.log(`✅ ${testName}: PASSED`);
    testResults.passed++;
  } else {
    console.log(`❌ ${testName}: FAILED`);
    console.log(`   Error: ${error}`);
    testResults.failed++;
    testResults.errors.push({ test: testName, error: error || 'Unknown error' });
  }
}

// 1. Test FBR Client
async function testFBRClient(): Promise<void> {
  console.log('\n🔍 Testing FBR Client...');
  
  try {
    // Test client initialization
    const client = new PRALAPIClient(TEST_CONFIG.credentials);
    logTest('FBR Client Initialization', client !== null);
    
    // Test invoice number parsing
    const testInvoiceNumber = '7000007DI1747119701593';
    const parsed = client.parseInvoiceNumber(testInvoiceNumber);
    const expectedParses = {
      ntnPart: '7000007',
      timestamp: 'DI1747119701',
      sequence: '593'
    };
    
    const parseCorrect = JSON.stringify(parsed) === JSON.stringify(expectedParses);
    logTest('Invoice Number Parsing', parseCorrect, 
      !parseCorrect ? `Expected ${JSON.stringify(expectedParses)}, got ${JSON.stringify(parsed)}` : null);
    
    // Test public API endpoints (these don't require authentication)
    try {
      const provinces = await client.getProvinces();
      logTest('Get Provinces API', Array.isArray(provinces) && provinces.length > 0,
        !Array.isArray(provinces) ? 'Response is not an array' : 'Empty provinces array');
    } catch (error: any) {
      logTest('Get Provinces API', false, error.message);
    }
    
    try {
      const documentTypes = await client.getDocumentTypes();
      logTest('Get Document Types API', Array.isArray(documentTypes) && documentTypes.length > 0,
        !Array.isArray(documentTypes) ? 'Response is not an array' : 'Empty document types array');
    } catch (error: any) {
      logTest('Get Document Types API', false, error.message);
    }
    
  } catch (error: any) {
    logTest('FBR Client Setup', false, error.message);
  }
}

// 2. Test Tax Calculator
async function testTaxCalculator(): Promise<void> {
  console.log('\n🧮 Testing Tax Calculator...');
  
  try {
    const calculator = new PakistaniTaxCalculator();
    
    // Test standard tax calculation
    const standardItem = {
      hsCode: '8471.60.90',
      valueSalesExcludingST: 1000,
      quantity: 1,
      sroScheduleNo: 'SRO 1125(I)/2011'
    };
    
    const context = {
      sellerProvince: 'PUNJAB',
      buyerProvince: 'SINDH',
      sellerSector: 'Manufacturing',
      isExport: false,
      isRegisteredBuyer: true
    };
    
    const taxCalculation = calculator.calculateItemTax(standardItem, context);
    
    // Verify tax calculation
    const expectedSalesTax = 50; // 5% rate for IT equipment
    const salesTaxCorrect = Math.abs(taxCalculation.salesTaxAmount - expectedSalesTax) < 0.01;
    logTest('Standard Tax Calculation', salesTaxCorrect,
      !salesTaxCorrect ? `Expected sales tax: ${expectedSalesTax}, got: ${taxCalculation.salesTaxAmount}` : null);
    
    // Test zero-rated export calculation
    const exportContext = { ...context, isExport: true };
    const exportCalculation = calculator.calculateItemTax(standardItem, exportContext);
    const exportTaxCorrect = exportCalculation.salesTaxAmount === 0;
    logTest('Export Tax Calculation (Zero-rated)', exportTaxCorrect,
      !exportTaxCorrect ? `Expected zero tax for export, got: ${exportCalculation.salesTaxAmount}` : null);
    
    // Test withholding tax calculation
    const highValueItem = { ...standardItem, valueSalesExcludingST: 50000 };
    const withholdingCalc = calculator.calculateItemTax(highValueItem, context);
    const withholdingCorrect = withholdingCalc.witholdingTaxAmount > 0;
    logTest('Withholding Tax Calculation', withholdingCorrect,
      !withholdingCorrect ? `Expected withholding tax for high value item, got: ${withholdingCalc.witholdingTaxAmount}` : null);
    
    // Test tax validation
    const validator = new TaxValidationService();
    const validation = validator.validateTaxCalculation(taxCalculation);
    logTest('Tax Calculation Validation', validation.isValid,
      !validation.isValid ? validation.errors.join(', ') : null);
    
  } catch (error: any) {
    logTest('Tax Calculator Setup', false, error.message);
  }
}

// 3. Test QR Code Generator
async function testQRCodeGenerator(): Promise<void> {
  console.log('\n📱 Testing QR Code Generator...');
  
  try {
    // Test QR code generation
    const irn = '7000007DI1747119701593';
    const invoiceData = {
      sellerNTN: '1234567',
      invoiceDate: '2024-01-15',
      totalAmount: 1180,
      buyerNTN: '7654321'
    };
    
    const qrCodeSVG = await QRCodeGenerator.generateQRCodeFromIRN(irn, invoiceData);
    const qrGenerated = Boolean(qrCodeSVG && qrCodeSVG.includes('<svg'));
    logTest('QR Code SVG Generation', qrGenerated,
      !qrGenerated ? 'QR code SVG not generated properly' : null);
    
    // Test QR code data URL generation
    const qrCodeDataURL = await QRCodeGenerator.generateQRCodeAsDataURL(irn, invoiceData);
    const dataURLGenerated = Boolean(qrCodeDataURL && qrCodeDataURL.startsWith('data:image/png;base64,'));
    logTest('QR Code Data URL Generation', dataURLGenerated,
      !dataURLGenerated ? 'QR code data URL not generated properly' : null);
    
    // Test QR code validation
    const qrContent = JSON.stringify({
      invoiceNumber: irn,
      sellerNTN: '1234567',
      invoiceDate: '2024-01-15',
      totalAmount: 1180,
      timestamp: new Date().toISOString()
    });
    
    const isValidQR = QRCodeGenerator.validateQRCode(qrContent);
    logTest('QR Code Validation', isValidQR, !isValidQR ? 'Valid QR content failed validation' : null);
    
    // Test QR code parsing
    const parsedQR = QRCodeGenerator.parseQRCode(qrContent);
    const parseSuccess = parsedQR !== null && parsedQR.invoiceNumber === irn;
    logTest('QR Code Parsing', parseSuccess, !parseSuccess ? 'Failed to parse valid QR content' : null);
    
    // Test invalid QR code validation
    const invalidQRContent = '{ invalid json }';
    const invalidQRRejected = !QRCodeGenerator.validateQRCode(invalidQRContent);
    logTest('Invalid QR Code Rejection', invalidQRRejected, 
      !invalidQRRejected ? 'Invalid QR content was incorrectly validated' : null);
    
  } catch (error: any) {
    logTest('QR Code Generator Setup', false, error.message);
  }
}

// 4. Test FBR Scenarios
async function testFBRScenarios(): Promise<void> {
  console.log('\n📋 Testing FBR Scenarios...');
  
  try {
    // Test scenario retrieval for manufacturing
    const manufacturingScenarios = getApplicableScenarios('Manufacturer', 'Steel');
    const hasManufacturingScenarios = manufacturingScenarios.scenarios.length > 0;
    logTest('Manufacturing Scenarios Retrieval', hasManufacturingScenarios,
      !hasManufacturingScenarios ? 'No scenarios found for manufacturing sector' : null);
    
    // Test scenario retrieval for services
    const serviceScenarios = getApplicableScenarios('Service Provider', 'IT Services');
    const hasServiceScenarios = serviceScenarios.scenarios.length > 0;
    logTest('Service Scenarios Retrieval', hasServiceScenarios,
      !hasServiceScenarios ? 'No scenarios found for service sector' : null);
    
    // Test scenario validation
    const scenarioValidation = validateScenarioApplicability('MFG-001', 'Manufacturer', 'Steel');
    logTest('Scenario Validation', scenarioValidation.isValid,
      !scenarioValidation.isValid ? scenarioValidation.errors.join(', ') : null);
    
    // Test invalid scenario rejection
    const invalidScenarioValidation = validateScenarioApplicability('INVALID-001', 'Manufacturer', 'Steel');
    logTest('Invalid Scenario Rejection', !invalidScenarioValidation.isValid,
      invalidScenarioValidation.isValid ? 'Invalid scenario was incorrectly validated' : null);
    
    // Test default scenario selection
    const defaultScenario = manufacturingScenarios.defaultScenario;
    const hasDefaultScenario = Boolean(defaultScenario && defaultScenario.length > 0);
    logTest('Default Scenario Selection', hasDefaultScenario,
      !hasDefaultScenario ? 'No default scenario selected' : null);
    
  } catch (error: any) {
    logTest('FBR Scenarios Setup', false, error.message);
  }
}

// 5. Test Error Handling
async function testErrorHandling(): Promise<void> {
  console.log('\n⚠️ Testing Error Handling...');
  
  try {
    // Test invalid invoice data validation
    const invalidInvoice = {
      ...TEST_CONFIG.testInvoice,
      invoiceDate: 'invalid-date',
      sellerNTNCNIC: 'invalid-ntn'
    };
    
    const validation = validateInvoiceData(invalidInvoice);
    const validationFailed = !validation.isValid && validation.errors.length > 0;
    logTest('Invalid Invoice Data Rejection', validationFailed,
      !validationFailed ? 'Invalid invoice data was incorrectly validated' : null);
    
    // Test tax calculator with negative values
    const calculator = new PakistaniTaxCalculator();
    const negativeItem = {
      hsCode: '8471.60.90',
      valueSalesExcludingST: -1000, // Negative value
      quantity: 1
    };
    
    const negativeContext = {
      sellerProvince: 'PUNJAB',
      buyerProvince: 'SINDH',
      sellerSector: 'Manufacturing',
      isExport: false,
      isRegisteredBuyer: true
    };
    
    try {
      const negativeCalculation = calculator.calculateItemTax(negativeItem, negativeContext);
      const negativeHandled = negativeCalculation.baseAmount >= 0;
      logTest('Negative Value Handling', negativeHandled,
        !negativeHandled ? 'Negative values were not properly handled' : null);
    } catch (error: any) {
      // Exception is also acceptable for negative values
      logTest('Negative Value Handling', true, 'Negative values properly threw exception');
    }
    
  } catch (error: any) {
    logTest('Error Handling Setup', false, error.message);
  }
}

// 6. Test Integration Issues
async function testIntegrationIssues(): Promise<void> {
  console.log('\n🔗 Testing Integration Issues...');
  
  try {
    // Test tax calculation with missing SRO data
    const calculator = new PakistaniTaxCalculator();
    const itemWithoutSRO = {
      hsCode: '9999.99.99', // Non-existent HS code
      valueSalesExcludingST: 1000,
      quantity: 1
    };
    
    const context = {
      sellerProvince: 'PUNJAB',
      buyerProvince: 'SINDH',
      sellerSector: 'Manufacturing',
      isExport: false,
      isRegisteredBuyer: true
    };
    
    const calculationWithoutSRO = calculator.calculateItemTax(itemWithoutSRO, context);
    const handledMissingSRO = calculationWithoutSRO.salesTaxRate > 0; // Should default to standard rate
    logTest('Missing SRO Data Handling', handledMissingSRO,
      !handledMissingSRO ? 'Missing SRO data not properly handled' : null);
    
    // Test QR code with missing buyer NTN
    const qrWithoutBuyer = await QRCodeGenerator.generateQRCodeFromIRN('7000007DI1747119701593', {
      sellerNTN: '1234567',
      invoiceDate: '2024-01-15',
      totalAmount: 1180
      // buyerNTN omitted
    });
    const qrGeneratedWithoutBuyer = Boolean(qrWithoutBuyer && qrWithoutBuyer.includes('<svg'));
    logTest('QR Code Without Buyer NTN', qrGeneratedWithoutBuyer,
      !qrGeneratedWithoutBuyer ? 'QR code generation failed without buyer NTN' : null);
    
    // Test scenario with invalid business type
    const invalidBusinessScenarios = getApplicableScenarios('Invalid Business Type', 'Invalid Sector');
    const hasGeneralScenarios = invalidBusinessScenarios.scenarios.some(s => !s.businessType && !s.sector);
    logTest('Invalid Business Type Fallback', hasGeneralScenarios,
      !hasGeneralScenarios ? 'System did not fall back to general scenarios' : null);
    
  } catch (error: any) {
    logTest('Integration Issues Setup', false, error.message);
  }
}

// Main test execution
async function runAllTests(): Promise<typeof testResults> {
  console.log('🚀 Starting FBR Integration Component Tests...\n');
  
  await testFBRClient();
  await testTaxCalculator();
  await testQRCodeGenerator();
  await testFBRScenarios();
  await testErrorHandling();
  await testIntegrationIssues();
  
  // Print test summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  
  if (testResults.failed > 0) {
    console.log('\n🔍 Failed Tests Details:');
    testResults.errors.forEach(({ test, error }) => {
      console.log(`  - ${test}: ${error}`);
    });
  }
  
  const successRate = (testResults.passed / (testResults.passed + testResults.failed)) * 100;
  console.log(`\n📈 Success Rate: ${successRate.toFixed(2)}%`);
  
  if (successRate >= 90) {
    console.log('🎉 FBR Integration components are in good condition!');
  } else if (successRate >= 70) {
    console.log('⚠️ FBR Integration components have some issues that need attention.');
  } else {
    console.log('🚨 FBR Integration components have significant issues that need immediate attention.');
  }
  
  return testResults;
}

// Execute tests if this file is run directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests, testResults };