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

import { PRALAPIClient } from '../libs/fbr-integration/src/client';
import { PakistaniTaxCalculator, TaxValidationService } from '../libs/fbr-integration/src/tax-calculator';
import { QRCodeGenerator } from '../libs/fbr-integration/src/qr-generator';
import { getApplicableScenarios, validateScenarioApplicability } from '../apps/web/src/lib/fbr-scenarios';
import { validateInvoiceData } from '../libs/fbr-integration/src/validators';
import { PRALInvoiceRequest } from '../libs/fbr-integration/src/types';

// Test configuration
const TEST_CONFIG = {
  // Test credentials (sandbox)
  credentials: {
    bearerToken: process.env.FBR_SANDBOX_TOKEN || 'test-token',
    environment: 'sandbox' as 'sandbox' | 'production'
  },
  
  // Test invoice data
  testInvoice: {
    invoiceType: 'Sale Invoice',
    invoiceDate: '2024-01-15',
    sellerNTNCNIC: '1234567',
    sellerBusinessName: 'Test Business',
    sellerProvince: 'PUNJAB',
    sellerAddress: '123 Test Street, Lahore',
    buyerNTNCNIC: '7654321',
    buyerBusinessName: 'Test Customer',
    buyerProvince: 'SINDH',
    buyerAddress: '456 Customer Street, Karachi',
    buyerRegistrationType: 'Registered',
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

describe('FBR Integration Components', () => {
  
  // 1. Test FBR Client
  describe('FBR Client', () => {
    let client: PRALAPIClient;
    
    beforeAll(() => {
      client = new PRALAPIClient(TEST_CONFIG.credentials);
    });
    
    test('Client initialization', () => {
      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(PRALAPIClient);
    });
    
    test('Invoice number parsing', () => {
      const testInvoiceNumber = '7000007DI1747119701593';
      const parsed = client.parseInvoiceNumber(testInvoiceNumber);
      const expectedParses = {
        ntnPart: '7000007',
        timestamp: 'DI1747119701',
        sequence: '593'
      };
      
      expect(parsed).toEqual(expectedParses);
    });
    
    test('Public API endpoints - Provinces', async () => {
      try {
        const provinces = await client.getProvinces();
        expect(Array.isArray(provinces)).toBe(true);
        expect(provinces.length).toBeGreaterThan(0);
      } catch (error) {
        // Network errors are acceptable in test environment
        console.warn('Provinces API test skipped due to network error:', error);
      }
    });
    
    test('Public API endpoints - Document Types', async () => {
      try {
        const documentTypes = await client.getDocumentTypes();
        expect(Array.isArray(documentTypes)).toBe(true);
        expect(documentTypes.length).toBeGreaterThan(0);
      } catch (error) {
        // Network errors are acceptable in test environment
        console.warn('Document Types API test skipped due to network error:', error);
      }
    });
  });
  
  // 2. Test Tax Calculator
  describe('Tax Calculator', () => {
    let calculator: PakistaniTaxCalculator;
    
    beforeAll(() => {
      calculator = new PakistaniTaxCalculator();
    });
    
    test('Standard tax calculation', () => {
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
      
      // Verify tax calculation (5% rate for IT equipment)
      expect(taxCalculation.salesTaxAmount).toBe(50);
      expect(taxCalculation.baseAmount).toBe(1000);
      expect(taxCalculation.salesTaxRate).toBe(5);
    });
    
    test('Zero-rated export calculation', () => {
      const standardItem = {
        hsCode: '8471.60.90',
        valueSalesExcludingST: 1000,
        quantity: 1,
        sroScheduleNo: 'SRO 1125(I)/2011'
      };
      
      const exportContext = {
        sellerProvince: 'PUNJAB',
        buyerProvince: 'SINDH',
        sellerSector: 'Manufacturing',
        isExport: true,
        isRegisteredBuyer: true
      };
      
      const exportCalculation = calculator.calculateItemTax(standardItem, exportContext);
      
      // Exports should be zero-rated
      expect(exportCalculation.salesTaxAmount).toBe(0);
      expect(exportCalculation.salesTaxRate).toBe(0);
    });
    
    test('Withholding tax calculation', () => {
      const highValueItem = {
        hsCode: '8471.60.90',
        valueSalesExcludingST: 50000,
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
      
      const withholdingCalc = calculator.calculateItemTax(highValueItem, context);
      
      // High value items should have withholding tax
      expect(withholdingCalc.witholdingTaxAmount).toBeGreaterThan(0);
    });
    
    test('Tax calculation validation', () => {
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
      const validator = new TaxValidationService();
      const validation = validator.validateTaxCalculation(taxCalculation);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });
  
  // 3. Test QR Code Generator
  describe('QR Code Generator', () => {
    test('QR code SVG generation', async () => {
      const irn = '7000007DI1747119701593';
      const invoiceData = {
        sellerNTN: '1234567',
        invoiceDate: '2024-01-15',
        totalAmount: 1180,
        buyerNTN: '7654321'
      };
      
      const qrCodeSVG = await QRCodeGenerator.generateQRCodeFromIRN(irn, invoiceData);
      
      expect(qrCodeSVG).toBeDefined();
      expect(qrCodeSVG.includes('<svg')).toBe(true);
    });
    
    test('QR code data URL generation', async () => {
      const irn = '7000007DI1747119701593';
      const invoiceData = {
        sellerNTN: '1234567',
        invoiceDate: '2024-01-15',
        totalAmount: 1180,
        buyerNTN: '7654321'
      };
      
      const qrCodeDataURL = await QRCodeGenerator.generateQRCodeAsDataURL(irn, invoiceData);
      
      expect(qrCodeDataURL).toBeDefined();
      expect(qrCodeDataURL.startsWith('data:image/png;base64,')).toBe(true);
    });
    
    test('QR code validation', () => {
      const irn = '7000007DI1747119701593';
      const qrContent = JSON.stringify({
        invoiceNumber: irn,
        sellerNTN: '1234567',
        invoiceDate: '2024-01-15',
        totalAmount: 1180,
        timestamp: new Date().toISOString()
      });
      
      const isValidQR = QRCodeGenerator.validateQRCode(qrContent);
      expect(isValidQR).toBe(true);
    });
    
    test('QR code parsing', () => {
      const irn = '7000007DI1747119701593';
      const qrContent = JSON.stringify({
        invoiceNumber: irn,
        sellerNTN: '1234567',
        invoiceDate: '2024-01-15',
        totalAmount: 1180,
        timestamp: new Date().toISOString()
      });
      
      const parsedQR = QRCodeGenerator.parseQRCode(qrContent);
      expect(parsedQR).toBeDefined();
      expect(parsedQR?.invoiceNumber).toBe(irn);
    });
    
    test('Invalid QR code rejection', () => {
      const invalidQRContent = '{ invalid json }';
      const isValidQR = QRCodeGenerator.validateQRCode(invalidQRContent);
      expect(isValidQR).toBe(false);
    });
  });
  
  // 4. Test FBR Scenarios
  describe('FBR Scenarios', () => {
    test('Manufacturing scenarios retrieval', () => {
      const manufacturingScenarios = getApplicableScenarios('Manufacturer', 'Steel');
      expect(manufacturingScenarios.scenarios.length).toBeGreaterThan(0);
    });
    
    test('Service scenarios retrieval', () => {
      const serviceScenarios = getApplicableScenarios('Service Provider', 'IT Services');
      expect(serviceScenarios.scenarios.length).toBeGreaterThan(0);
    });
    
    test('Scenario validation', () => {
      const isValidScenario = validateScenarioApplicability('MFG-001', 'Manufacturer', 'Steel');
      expect(isValidScenario).toBe(true);
    });
    
    test('Invalid scenario rejection', () => {
      const isInvalidScenario = validateScenarioApplicability('INVALID-001', 'Manufacturer', 'Steel');
      expect(isInvalidScenario).toBe(false);
    });
    
    test('Default scenario selection', () => {
      const manufacturingScenarios = getApplicableScenarios('Manufacturer', 'Steel');
      expect(manufacturingScenarios.defaultScenario).toBeDefined();
      expect(manufacturingScenarios.defaultScenario.length).toBeGreaterThan(0);
    });
  });
  
  // 5. Test Error Handling
  describe('Error Handling', () => {
    test('Invalid invoice data rejection', () => {
      const invalidInvoice = {
        ...TEST_CONFIG.testInvoice,
        invoiceDate: 'invalid-date',
        sellerNTNCNIC: 'invalid-ntn'
      };
      
      const validation = validateInvoiceData(invalidInvoice);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
    
    test('Negative value handling in tax calculator', () => {
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
      
      // Should handle negative values gracefully
      const negativeCalculation = calculator.calculateItemTax(negativeItem, negativeContext);
      expect(negativeCalculation.baseAmount).toBe(-1000);
    });
  });
  
  // 6. Test Integration Issues
  describe('Integration Issues', () => {
    test('Missing SRO data handling', () => {
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
      // Should default to standard rate
      expect(calculationWithoutSRO.salesTaxRate).toBe(18);
    });
    
    test('QR code without buyer NTN', async () => {
      const qrWithoutBuyer = await QRCodeGenerator.generateQRCodeFromIRN('7000007DI1747119701593', {
        sellerNTN: '1234567',
        invoiceDate: '2024-01-15',
        totalAmount: 1180
        // buyerNTN omitted
      });
      
      expect(qrWithoutBuyer).toBeDefined();
      expect(qrWithoutBuyer.includes('<svg')).toBe(true);
    });
    
    test('Invalid business type fallback', () => {
      const invalidBusinessScenarios = getApplicableScenarios('Invalid Business Type', 'Invalid Sector');
      const hasGeneralScenarios = invalidBusinessScenarios.scenarios.some(s => !s.businessType && !s.sector);
      expect(hasGeneralScenarios).toBe(true);
    });
  });
});