/**
 * Pakistani Tax Calculation Engine
 * 
 * Handles all FBR-compliant tax calculations including:
 * - Sales Tax (Standard 18%, Reduced rates, Zero-rated, Exempt)
 * - Withholding Tax at Source
 * - Extra Tax (Additional Sales Tax)
 * - Further Tax
 * - Federal Excise Duty (FED)
 * - SRO-based exemptions and reductions
 * - Provincial variations
 */

import type { 
  FBRCompliantInvoiceItem, 
  TaxCalculation, 
  SROReference 
} from './fbr-compliant-types'

// ==================== TAX BREAKDOWN INTERFACE ====================

export interface TaxBreakdown {
  baseAmount: number // Total value excluding taxes
  salesTax: number // Sales tax amount
  withholdingTax: number // Withholding tax amount
  extraTax: number // Extra tax amount
  furtherTax: number // Further tax amount
  federalExciseDuty: number // Federal excise duty amount
  totalAmount: number // Total amount including all taxes
  effectiveRate?: number // Effective tax rate percentage
  taxDetails?: {
    [itemId: string]: {
      baseAmount: number
      salesTax: number
      withholdingTax: number
      extraTax: number
      furtherTax: number
      federalExciseDuty: number
    }
  }
}

// ==================== TAX RATES AND CATEGORIES ====================

export interface TaxRateMatrix {
  standardRate: number // 18%
  reducedRates: number[] // [5%, 10%, 12%]
  zeroRated: string[] // Export items, essential commodities
  exempt: string[] // Books, newspapers, etc.
  
  // Withholding tax rates by sector
  withholdingRates: {
    [sector: string]: {
      rate: number
      threshold: number // Minimum amount for withholding
    }
  }
  
  // Provincial variations
  provincialRates: {
    [province: string]: {
      extraTaxRate?: number
      provincialSalesTax?: number
    }
  }
}

export const PAKISTANI_TAX_MATRIX: TaxRateMatrix = {
  standardRate: 18,
  reducedRates: [5, 10, 12, 15],
  zeroRated: [
    'Rice', 'Wheat', 'Sugar', 'Edible Oil', 'Fertilizer',
    'Pesticides', 'Agricultural Machinery', 'Export Items'
  ],
  exempt: [
    'Books', 'Newspapers', 'Educational Materials', 'Medicine',
    'Medical Equipment', 'Charity Items'
  ],
  
  withholdingRates: {
    'Manufacturing': { rate: 1.0, threshold: 25000 },
    'Trading': { rate: 0.25, threshold: 50000 },
    'Services': { rate: 8.0, threshold: 15000 },
    'Import': { rate: 5.5, threshold: 100000 },
    'Export': { rate: 0.0, threshold: 0 },
    'Telecommunication': { rate: 10.0, threshold: 1000 },
    'Banking': { rate: 0.6, threshold: 5000 }
  },
  
  provincialRates: {
    'Punjab': { extraTaxRate: 0.0 },
    'Sindh': { extraTaxRate: 0.0 },
    'KPK': { extraTaxRate: 0.0 },
    'Balochistan': { extraTaxRate: 0.0 },
    'Islamabad': { extraTaxRate: 0.0 }
  }
}

// ==================== SRO PROCESSING ====================

export interface SROProcessor {
  applySRO(itemValue: number, hsCode: string, sroRef?: SROReference): {
    originalRate: number
    adjustedRate: number
    exemptionAmount: number
    applicableSRO?: string
  }
}

export class SROTaxProcessor implements SROProcessor {
  // Common SRO exemptions and reductions
  private sroExemptions = new Map([
    // IT Sector exemptions
    ['8471.60.90', { type: 'REDUCED', rate: 5, sro: 'SRO 1125(I)/2011' }], // Computer peripherals
    ['8473.30.20', { type: 'REDUCED', rate: 5, sro: 'SRO 1125(I)/2011' }], // Computer parts
    
    // Export incentives
    ['EXPORT_ITEMS', { type: 'ZERO', rate: 0, sro: 'SRO 1125(I)/2011' }],
    
    // Essential commodities
    ['1006.30.00', { type: 'ZERO', rate: 0, sro: 'SRO 350(I)/2024' }], // Rice
    ['1001.90.90', { type: 'ZERO', rate: 0, sro: 'SRO 350(I)/2024' }], // Wheat
    
    // Medical supplies
    ['3004.90.00', { type: 'EXEMPT', rate: 0, sro: 'SRO 1125(I)/2011' }], // Medicines
    
    // Educational materials
    ['4901.99.00', { type: 'EXEMPT', rate: 0, sro: 'SRO 1125(I)/2011' }] // Books
  ])
  
  applySRO(itemValue: number, hsCode: string, sroRef?: SROReference) {
    const standardRate = PAKISTANI_TAX_MATRIX.standardRate
    let adjustedRate = standardRate
    let exemptionAmount = 0
    let applicableSRO: string | undefined
    
    // Check for HS code based SRO
    const sroRule = this.sroExemptions.get(hsCode)
    if (sroRule) {
      adjustedRate = sroRule.rate
      exemptionAmount = (itemValue * (standardRate - adjustedRate)) / 100
      applicableSRO = sroRule.sro
    }
    
    // Apply specific SRO reference if provided
    if (sroRef) {
      adjustedRate = sroRef.applicableRate
      exemptionAmount = sroRef.exemptionPercentage 
        ? (itemValue * sroRef.exemptionPercentage) / 100 
        : exemptionAmount
      applicableSRO = sroRef.sroScheduleNo
    }
    
    return {
      originalRate: standardRate,
      adjustedRate,
      exemptionAmount,
      applicableSRO
    }
  }
}

// ==================== COMPREHENSIVE TAX CALCULATOR ====================

export class PakistaniTaxCalculator {
  private sroProcessor: SROProcessor
  
  constructor() {
    this.sroProcessor = new SROTaxProcessor()
  }
  
  /**
   * Calculate complete tax breakdown for an invoice item
   */
  calculateItemTax(item: Partial<FBRCompliantInvoiceItem>, context: {
    sellerProvince: string
    buyerProvince: string
    sellerSector: string
    buyerSector?: string
    isExport?: boolean
    isRegisteredBuyer?: boolean
  }): TaxCalculation {
    
    const baseAmount = item.valueSalesExcludingST || 0
    const quantity = item.quantity || 1
    const unitPrice = baseAmount / quantity
    
    // Step 1: Determine applicable sales tax rate
    const salesTaxInfo = this.determineSalesTaxRate(
      item.hsCode || '', 
      context.isExport || false,
      item.sroScheduleNo
    )
    
    // Step 2: Apply SRO adjustments
    const sroAdjustment = this.sroProcessor.applySRO(
      baseAmount,
      item.hsCode || '',
      item.sroScheduleNo ? {
        sroScheduleNo: item.sroScheduleNo,
        sroItemSerialNo: item.sroItemSerialNo || '',
        applicableRate: salesTaxInfo.rate,
        applicableFrom: new Date().toISOString().split('T')[0]
      } : undefined
    )
    
    // Step 3: Calculate sales tax
    const salesTaxRate = sroAdjustment.adjustedRate
    const salesTaxAmount = (baseAmount * salesTaxRate) / 100
    
    // Step 4: Calculate withholding tax
    const withholdingInfo = this.calculateWithholdingTax(
      baseAmount,
      context.sellerSector,
      context.isRegisteredBuyer || false
    )
    
    // Step 5: Calculate additional taxes
    const extraTaxAmount = this.calculateExtraTax(
      baseAmount,
      context.sellerProvince,
      context.buyerProvince
    )
    
    const furtherTaxAmount = this.calculateFurtherTax(
      baseAmount,
      item.hsCode || '',
      context.isExport || false
    )
    
    // Step 6: Calculate Federal Excise Duty
    const fedAmount = this.calculateFED(
      baseAmount,
      item.hsCode || ''
    )
    
    // Step 7: Apply discounts
    const discountRate = item.discountPercentage || 0
    const discountAmount = (baseAmount * discountRate) / 100
    
    // Step 8: Calculate totals
    const totalTaxAmount = salesTaxAmount + extraTaxAmount + furtherTaxAmount + fedAmount
    const finalAmount = baseAmount + totalTaxAmount - discountAmount - withholdingInfo.amount
    
    return {
      baseAmount,
      salesTaxRate,
      salesTaxAmount,
      witholdingTaxRate: withholdingInfo.rate,
      witholdingTaxAmount: withholdingInfo.amount,
      extraTaxRate: extraTaxAmount > 0 ? 3 : 0, // Typical extra tax rate
      extraTaxAmount,
      furtherTaxRate: furtherTaxAmount > 0 ? 1 : 0, // Typical further tax rate
      furtherTaxAmount,
      fedRate: fedAmount > 0 ? 10 : 0, // Typical FED rate
      fedAmount,
      discountRate,
      discountAmount,
      totalTaxAmount,
      finalAmount
    }
  }
  
  /**
   * Determine sales tax rate based on HS code and export status
   */
  private determineSalesTaxRate(hsCode: string, isExport: boolean, sroSchedule?: string): {
    rate: number
    category: 'STANDARD' | 'REDUCED' | 'ZERO' | 'EXEMPT'
    description: string
  } {
    if (isExport) {
      return { rate: 0, category: 'ZERO', description: 'Export - Zero Rated' }
    }
    
    // Check for exempt items
    const productDescription = this.getProductDescription(hsCode)
    if (PAKISTANI_TAX_MATRIX.exempt.some(item => 
      productDescription.toLowerCase().includes(item.toLowerCase())
    )) {
      return { rate: 0, category: 'EXEMPT', description: 'Exempt Item' }
    }
    
    // Check for zero-rated items
    if (PAKISTANI_TAX_MATRIX.zeroRated.some(item => 
      productDescription.toLowerCase().includes(item.toLowerCase())
    )) {
      return { rate: 0, category: 'ZERO', description: 'Zero Rated Item' }
    }
    
    // Check for reduced rates based on HS code
    const reducedRateItems = this.getReducedRateItems()
    const reducedRate = reducedRateItems.get(hsCode)
    if (reducedRate) {
      return { rate: reducedRate, category: 'REDUCED', description: 'Reduced Rate Item' }
    }
    
    // Default to standard rate
    return { 
      rate: PAKISTANI_TAX_MATRIX.standardRate, 
      category: 'STANDARD', 
      description: 'Standard Sales Tax' 
    }
  }
  
  /**
   * Calculate withholding tax based on sector and buyer registration
   */
  private calculateWithholdingTax(
    amount: number, 
    sellerSector: string, 
    isRegisteredBuyer: boolean
  ): { rate: number; amount: number; applicable: boolean } {
    
    // Withholding tax only applies to registered buyers
    if (!isRegisteredBuyer) {
      return { rate: 0, amount: 0, applicable: false }
    }
    
    const withholdingRule = PAKISTANI_TAX_MATRIX.withholdingRates[sellerSector]
    if (!withholdingRule || amount < withholdingRule.threshold) {
      return { rate: 0, amount: 0, applicable: false }
    }
    
    const withholdingAmount = (amount * withholdingRule.rate) / 100
    
    return {
      rate: withholdingRule.rate,
      amount: withholdingAmount,
      applicable: true
    }
  }
  
  /**
   * Calculate extra tax (additional sales tax)
   */
  private calculateExtraTax(
    amount: number,
    sellerProvince: string,
    buyerProvince: string
  ): number {
    // Extra tax typically applies on inter-provincial transactions
    // or specific categories (implementation depends on current rules)
    
    const provincialRule = PAKISTANI_TAX_MATRIX.provincialRates[sellerProvince]
    if (provincialRule?.extraTaxRate && sellerProvince !== buyerProvince) {
      return (amount * provincialRule.extraTaxRate) / 100
    }
    
    return 0
  }
  
  /**
   * Calculate further tax
   */
  private calculateFurtherTax(
    amount: number,
    hsCode: string,
    isExport: boolean
  ): number {
    // Further tax applies to specific categories
    // Implementation based on current FBR rules
    
    if (isExport) return 0
    
    // Luxury items typically have further tax
    const luxuryItems = ['8703.23.11', '8703.24.11'] // Cars, motorcycles, etc.
    if (luxuryItems.includes(hsCode)) {
      return (amount * 1) / 100 // 1% further tax
    }
    
    return 0
  }
  
  /**
   * Calculate Federal Excise Duty
   */
  private calculateFED(amount: number, hsCode: string): number {
    // FED applies to specific items like cigarettes, beverages, etc.
    const fedItems = new Map([
      ['2402.20.10', 10], // Cigarettes - 10%
      ['2203.00.10', 25], // Beer - 25%
      ['2208.90.90', 30], // Spirits - 30%
    ])
    
    const fedRate = fedItems.get(hsCode)
    if (fedRate) {
      return (amount * fedRate) / 100
    }
    
    return 0
  }
  
  /**
   * Get product description from HS code (mock implementation)
   */
  private getProductDescription(hsCode: string): string {
    // In real implementation, this would query the FBR HS codes API
    const descriptions = new Map([
      ['8471.60.90', 'Computer Mouse'],
      ['8473.30.20', 'Computer Parts'],
      ['1006.30.00', 'Rice'],
      ['1001.90.90', 'Wheat'],
      ['3004.90.00', 'Medicines'],
      ['4901.99.00', 'Books']
    ])
    
    return descriptions.get(hsCode) || 'General Item'
  }
  
  /**
   * Get reduced rate items mapping
   */
  private getReducedRateItems(): Map<string, number> {
    return new Map([
      ['8471.60.90', 5], // IT equipment - 5%
      ['8473.30.20', 5], // Computer parts - 5%
      ['8517.62.00', 10], // Mobile phones - 10%
      ['2710.19.10', 12], // Petroleum products - 12%
    ])
  }

  /**
   * Calculate tax breakdown for multiple items (convenience method)
   */
  calculateTax(items: any[], province: string = 'PUNJAB'): TaxBreakdown {
    let totalBaseAmount = 0
    let totalSalesTax = 0
    let totalWithholdingTax = 0
    let totalExtraTax = 0
    let totalFurtherTax = 0
    let totalFederalExciseDuty = 0

    items.forEach(item => {
      const baseAmount = item.unitPrice * item.quantity
      const salesTax = (baseAmount * (item.applicableTaxRate || 18)) / 100
      
      totalBaseAmount += baseAmount
      totalSalesTax += salesTax
      // Add other taxes as needed based on item properties
    })

    const totalAmount = totalBaseAmount + totalSalesTax + totalWithholdingTax + 
                       totalExtraTax + totalFurtherTax + totalFederalExciseDuty

    return {
      baseAmount: totalBaseAmount,
      salesTax: totalSalesTax,
      withholdingTax: totalWithholdingTax,
      extraTax: totalExtraTax,
      furtherTax: totalFurtherTax,
      federalExciseDuty: totalFederalExciseDuty,
      totalAmount: totalAmount,
      effectiveRate: totalBaseAmount > 0 ? (totalSalesTax / totalBaseAmount) * 100 : 0
    }
  }

  /**
   * Get SRO details (mock implementation)
   */
  async getSRODetails(sroNumber: string): Promise<any> {
    // Mock SRO data - in real implementation, this would call FBR API
    const sroDatabase: { [key: string]: any } = {
      'SRO-1087-2019': {
        scheduleNumber: 'SRO 1087(I)/2019',
        serialNumber: '001',
        description: 'Export Exemption',
        reducedRate: 0,
        applicableHSCodes: ['1006.30.00', '1001.90.90'] // Rice, Wheat exports
      },
      'SRO-350-2024': {
        scheduleNumber: 'SRO 350(I)/2024', 
        serialNumber: '002',
        description: 'Reduced Rate 5%',
        reducedRate: 5,
        applicableHSCodes: ['8471.60.90', '8473.30.20'] // IT equipment
      },
      'SRO-691-2019': {
        scheduleNumber: 'SRO 691(I)/2019',
        serialNumber: '003', 
        description: 'Zero Rating',
        reducedRate: 0,
        applicableHSCodes: ['3004.90.00'] // Medicines
      }
    }

    return sroDatabase[sroNumber] || null
  }
}

// ==================== VALIDATION HELPERS ====================

export class TaxValidationService {
  /**
   * Validate tax calculations for FBR compliance
   */
  validateTaxCalculation(calculation: TaxCalculation): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Check for negative values
    if (calculation.baseAmount < 0) {
      errors.push('Base amount cannot be negative')
    }
    
    if (calculation.salesTaxAmount < 0) {
      errors.push('Sales tax amount cannot be negative')
    }
    
    // Check rate limits
    if (calculation.salesTaxRate > 25) {
      warnings.push('Sales tax rate exceeds typical maximum (25%)')
    }
    
    if (calculation.witholdingTaxRate > 15) {
      warnings.push('Withholding tax rate exceeds typical maximum (15%)')
    }
    
    // Check calculation accuracy
    const expectedSalesTax = (calculation.baseAmount * calculation.salesTaxRate) / 100
    if (Math.abs(expectedSalesTax - calculation.salesTaxAmount) > 0.01) {
      errors.push('Sales tax calculation appears incorrect')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }
}