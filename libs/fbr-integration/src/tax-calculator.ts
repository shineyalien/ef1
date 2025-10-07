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
import { FBRConfig } from './config'

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

// Use the centralized tax configuration
export const PAKISTANI_TAX_MATRIX: TaxRateMatrix = {
  standardRate: FBRConfig.tax.standardRate,
  reducedRates: FBRConfig.tax.reducedRates,
  zeroRated: FBRConfig.tax.zeroRatedItems,
  exempt: FBRConfig.tax.exemptItems,
  
  withholdingRates: FBRConfig.tax.withholdingRates,
  
  provincialRates: FBRConfig.tax.provincialRates
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
  // Enhanced SRO exemptions and reductions with configurable rates
  private sroExemptions = new Map([
    // IT Sector exemptions
    ['8471.60.90', { type: 'REDUCED', rate: 5, sro: 'SRO 1125(I)/2011' }], // Computer peripherals
    ['8473.30.20', { type: 'REDUCED', rate: 5, sro: 'SRO 1125(I)/2011' }], // Computer parts
    ['8471.41.00', { type: 'REDUCED', rate: 5, sro: 'SRO 1125(I)/2011' }], // Other computers
    ['8471.50.00', { type: 'REDUCED', rate: 5, sro: 'SRO 1125(I)/2011' }], // Processing units
    ['8517.62.00', { type: 'REDUCED', rate: 10, sro: 'SRO 1125(I)/2011' }], // Mobile phones
    ['8517.61.00', { type: 'REDUCED', rate: 10, sro: 'SRO 1125(I)/2011' }], // Other phones
    
    // Export incentives
    ['EXPORT_ITEMS', { type: 'ZERO', rate: 0, sro: 'SRO 1125(I)/2011' }],
    
    // Essential commodities
    ['1006.30.00', { type: 'ZERO', rate: 0, sro: 'SRO 350(I)/2024' }], // Rice
    ['1001.90.90', { type: 'ZERO', rate: 0, sro: 'SRO 350(I)/2024' }], // Wheat
    ['1701.99.00', { type: 'ZERO', rate: 0, sro: 'SRO 350(I)/2024' }], // Sugar
    ['1507.90.00', { type: 'ZERO', rate: 0, sro: 'SRO 350(I)/2024' }], // Edible oil
    ['3102.10.00', { type: 'ZERO', rate: 0, sro: 'SRO 350(I)/2024' }], // Fertilizer
    ['3808.90.00', { type: 'ZERO', rate: 0, sro: 'SRO 350(I)/2024' }], // Pesticides
    ['8432.80.00', { type: 'ZERO', rate: 0, sro: 'SRO 350(I)/2024' }], // Agricultural machinery
    
    // Medical supplies
    ['3004.90.00', { type: 'EXEMPT', rate: 0, sro: 'SRO 1125(I)/2011' }], // Medicines
    ['3003.90.00', { type: 'EXEMPT', rate: 0, sro: 'SRO 1125(I)/2011' }], // Medical preparations
    ['9018.90.00', { type: 'EXEMPT', rate: 0, sro: 'SRO 1125(I)/2011' }], // Medical equipment
    
    // Educational materials
    ['4901.99.00', { type: 'EXEMPT', rate: 0, sro: 'SRO 1125(I)/2011' }], // Books
    ['4902.90.00', { type: 'EXEMPT', rate: 0, sro: 'SRO 1125(I)/2011' }], // Newspapers
    ['4903.90.00', { type: 'EXEMPT', rate: 0, sro: 'SRO 1125(I)/2011' }], // Educational materials
    
    // Industrial machinery
    ['8479.89.00', { type: 'REDUCED', rate: 10, sro: 'SRO 1125(I)/2011' }], // Industrial machinery
    ['8421.19.00', { type: 'REDUCED', rate: 10, sro: 'SRO 1125(I)/2011' }], // Industrial equipment
    
    // Petroleum products
    ['2710.19.10', { type: 'REDUCED', rate: 12, sro: 'SRO 1125(I)/2011' }], // Petroleum products
    
    // Renewable energy equipment
    ['8501.61.00', { type: 'EXEMPT', rate: 0, sro: 'SRO 1125(I)/2011' }], // Solar panels
    ['8502.31.00', { type: 'EXEMPT', rate: 0, sro: 'SRO 1125(I)/2011' }], // Solar batteries
  ])
  
  applySRO(itemValue: number, hsCode: string, sroRef?: SROReference) {
    const standardRate = PAKISTANI_TAX_MATRIX.standardRate
    let adjustedRate = standardRate
    let exemptionAmount = 0
    let applicableSRO: string | undefined
    let exemptionType: 'STANDARD' | 'REDUCED' | 'ZERO' | 'EXEMPT' = 'STANDARD'
    
    // Validate inputs
    if (itemValue < 0) {
      throw new Error('Item value cannot be negative')
    }
    
    if (!hsCode || typeof hsCode !== 'string') {
      throw new Error('HS code must be a non-empty string')
    }
    
    // Check for HS code based SRO
    const sroRule = this.sroExemptions.get(hsCode)
    if (sroRule) {
      adjustedRate = sroRule.rate
      exemptionAmount = (itemValue * (standardRate - adjustedRate)) / 100
      applicableSRO = sroRule.sro
      exemptionType = sroRule.type as 'REDUCED' | 'ZERO' | 'EXEMPT'
    }
    
    // Apply specific SRO reference if provided
    if (sroRef) {
      // Validate SRO reference
      if (sroRef.applicableRate < 0 || sroRef.applicableRate > 100) {
        throw new Error('SRO applicable rate must be between 0 and 100')
      }
      
      adjustedRate = sroRef.applicableRate
      exemptionAmount = sroRef.exemptionPercentage
        ? (itemValue * sroRef.exemptionPercentage) / 100
        : exemptionAmount
      applicableSRO = sroRef.sroScheduleNo
      
      // Determine exemption type based on rate
      if (adjustedRate === 0) {
        exemptionType = 'ZERO'
      } else if (adjustedRate < standardRate) {
        exemptionType = 'REDUCED'
      } else {
        exemptionType = 'STANDARD'
      }
    }
    
    // Ensure adjusted rate is not negative
    adjustedRate = Math.max(0, adjustedRate)
    
    return {
      originalRate: standardRate,
      adjustedRate,
      exemptionAmount,
      applicableSRO,
      exemptionType
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
    
    // Validate inputs
    if (!item) {
      throw new Error('Invoice item is required')
    }
    
    if (!context || !context.sellerProvince || !context.sellerSector) {
      throw new Error('Context with seller province and sector is required')
    }
    
    const baseAmount = item.valueSalesExcludingST || 0
    const quantity = item.quantity || 1
    
    // Validate base amount
    if (baseAmount < 0) {
      throw new Error('Base amount cannot be negative')
    }
    
    if (quantity <= 0) {
      throw new Error('Quantity must be positive')
    }
    
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
        applicableFrom: new Date().toISOString().split('T')[0] || '2024-01-01'
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
    // Validate inputs
    if (!hsCode || typeof hsCode !== 'string') {
      throw new Error('HS code must be a non-empty string')
    }
    
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
    
    // Default to standard rate from configuration
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
    
    // Validate inputs
    if (amount < 0) {
      throw new Error('Amount cannot be negative for withholding tax calculation')
    }
    
    if (!sellerSector || typeof sellerSector !== 'string') {
      throw new Error('Seller sector must be a non-empty string')
    }
    
    // Withholding tax only applies to registered buyers
    if (!isRegisteredBuyer) {
      return { rate: 0, amount: 0, applicable: false }
    }
    
    const withholdingRule = PAKISTANI_TAX_MATRIX.withholdingRates[sellerSector]
    if (!withholdingRule) {
      // Log warning for unknown sector
      console.warn(`Unknown seller sector for withholding tax: ${sellerSector}`)
      return { rate: 0, amount: 0, applicable: false }
    }
    
    if (amount < withholdingRule.threshold) {
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
    // Validate inputs
    if (amount < 0) {
      throw new Error('Amount cannot be negative for extra tax calculation')
    }
    
    if (!sellerProvince || !buyerProvince) {
      throw new Error('Both seller and buyer provinces are required')
    }
    
    // Extra tax typically applies on inter-provincial transactions
    // or specific categories (implementation depends on current rules)
    
    const provincialRule = PAKISTANI_TAX_MATRIX.provincialRates[sellerProvince]
    if (!provincialRule) {
      console.warn(`Unknown seller province for extra tax: ${sellerProvince}`)
      return 0
    }
    
    if (provincialRule.extraTaxRate && sellerProvince !== buyerProvince) {
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
    // Validate inputs
    if (amount < 0) {
      throw new Error('Amount cannot be negative for further tax calculation')
    }
    
    if (!hsCode || typeof hsCode !== 'string') {
      throw new Error('HS code must be a non-empty string for further tax calculation')
    }
    
    // Further tax applies to specific categories
    // Implementation based on current FBR rules
    
    if (isExport) return 0
    
    // Luxury items typically have further tax
    const luxuryItems = [
      '8703.23.11', // Cars
      '8703.24.11', // Motorcycles
      '8703.32.90', // Other vehicles
      '8703.33.90', // Other vehicles
      '9102.11.00', // Luxury watches
      '9102.12.00', // Luxury watches
      '7113.11.00', // Jewelry
      '7113.19.00'  // Jewelry
    ]
    
    if (luxuryItems.includes(hsCode)) {
      return (amount * 1) / 100 // 1% further tax
    }
    
    return 0
  }
  
  /**
   * Calculate Federal Excise Duty
   */
  private calculateFED(amount: number, hsCode: string): number {
    // Validate inputs
    if (amount < 0) {
      throw new Error('Amount cannot be negative for FED calculation')
    }
    
    if (!hsCode || typeof hsCode !== 'string') {
      throw new Error('HS code must be a non-empty string for FED calculation')
    }
    
    // FED applies to specific items like cigarettes, beverages, etc.
    const fedItems = new Map([
      ['2402.20.10', 10], // Cigarettes - 10%
      ['2402.20.90', 10], // Other cigarettes - 10%
      ['2203.00.10', 25], // Beer - 25%
      ['2203.00.90', 25], // Other beer - 25%
      ['2208.90.90', 30], // Spirits - 30%
      ['2208.20.00', 30], // Spirits - 30%
      ['2208.30.00', 30], // Spirits - 30%
      ['2208.70.00', 30], // Spirits - 30%
      ['2204.10.00', 20], // Wine - 20%
      ['2204.21.00', 20], // Wine - 20%
      ['2204.29.00', 20], // Wine - 20%
      ['2205.00.00', 20], // Vermouth - 20%
      ['2206.00.00', 20], // Other fermented beverages - 20%
      ['2106.90.20', 15], // Energy drinks - 15%
      ['2106.90.90', 15], // Other beverages - 15%
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
  calculateTax(items: any[], province: string = 'Punjab'): TaxBreakdown {
    // Validate inputs
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Items array is required and cannot be empty')
    }
    
    if (!province || typeof province !== 'string') {
      throw new Error('Province must be a non-empty string')
    }
    
    let totalBaseAmount = 0
    let totalSalesTax = 0
    let totalWithholdingTax = 0
    let totalExtraTax = 0
    let totalFurtherTax = 0
    let totalFederalExciseDuty = 0
    const taxDetails: { [itemId: string]: any } = {}

    items.forEach((item, index) => {
      // Validate each item
      if (!item || typeof item !== 'object') {
        throw new Error(`Item at index ${index} is not a valid object`)
      }
      
      if (!item.unitPrice || !item.quantity) {
        throw new Error(`Item at index ${index} must have unitPrice and quantity`)
      }
      
      if (item.unitPrice < 0 || item.quantity <= 0) {
        throw new Error(`Item at index ${index} has invalid unitPrice or quantity`)
      }
      
      const baseAmount = item.unitPrice * item.quantity
      const salesTaxRate = item.applicableTaxRate || PAKISTANI_TAX_MATRIX.standardRate
      const salesTax = (baseAmount * salesTaxRate) / 100
      
      // Calculate other taxes based on item properties
      const withholdingTax = item.withholdingTax || 0
      const extraTax = item.extraTax || 0
      const furtherTax = item.furtherTax || 0
      const federalExciseDuty = item.federalExciseDuty || 0
      
      // Store item tax details
      const itemId = item.id || `item_${index}`
      taxDetails[itemId] = {
        baseAmount,
        salesTax,
        withholdingTax,
        extraTax,
        furtherTax,
        federalExciseDuty
      }
      
      totalBaseAmount += baseAmount
      totalSalesTax += salesTax
      totalWithholdingTax += withholdingTax
      totalExtraTax += extraTax
      totalFurtherTax += furtherTax
      totalFederalExciseDuty += federalExciseDuty
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
      effectiveRate: totalBaseAmount > 0 ? (totalSalesTax / totalBaseAmount) * 100 : 0,
      taxDetails
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
   * Validate tax calculations for FBR compliance with enhanced validation
   */
  validateTaxCalculation(calculation: TaxCalculation): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Validate input
    if (!calculation || typeof calculation !== 'object') {
      errors.push('Tax calculation object is required')
      return { isValid: false, errors, warnings }
    }
    
    // Check for negative values
    if (calculation.baseAmount < 0) {
      errors.push('Base amount cannot be negative')
    }
    
    if (calculation.salesTaxAmount < 0) {
      errors.push('Sales tax amount cannot be negative')
    }
    
    if (calculation.witholdingTaxAmount < 0) {
      errors.push('Withholding tax amount cannot be negative')
    }
    
    if (calculation.extraTaxAmount !== undefined && calculation.extraTaxAmount < 0) {
      errors.push('Extra tax amount cannot be negative')
    }
    
    if (calculation.furtherTaxAmount !== undefined && calculation.furtherTaxAmount < 0) {
      errors.push('Further tax amount cannot be negative')
    }
    
    if (calculation.fedAmount !== undefined && calculation.fedAmount < 0) {
      errors.push('Federal excise duty amount cannot be negative')
    }
    
    if (calculation.discountAmount !== undefined && calculation.discountAmount < 0) {
      errors.push('Discount amount cannot be negative')
    }
    
    // Check rate limits
    if (calculation.salesTaxRate < 0 || calculation.salesTaxRate > 100) {
      errors.push('Sales tax rate must be between 0 and 100')
    } else if (calculation.salesTaxRate > 25) {
      warnings.push('Sales tax rate exceeds typical maximum (25%)')
    }
    
    if (calculation.witholdingTaxRate < 0 || calculation.witholdingTaxRate > 100) {
      errors.push('Withholding tax rate must be between 0 and 100')
    } else if (calculation.witholdingTaxRate > 15) {
      warnings.push('Withholding tax rate exceeds typical maximum (15%)')
    }
    
    if (calculation.extraTaxRate !== undefined && (calculation.extraTaxRate < 0 || calculation.extraTaxRate > 100)) {
      errors.push('Extra tax rate must be between 0 and 100')
    }
    
    if (calculation.furtherTaxRate !== undefined && (calculation.furtherTaxRate < 0 || calculation.furtherTaxRate > 100)) {
      errors.push('Further tax rate must be between 0 and 100')
    }
    
    if (calculation.fedRate !== undefined && (calculation.fedRate < 0 || calculation.fedRate > 100)) {
      errors.push('Federal excise duty rate must be between 0 and 100')
    }
    
    if (calculation.discountRate !== undefined && (calculation.discountRate < 0 || calculation.discountRate > 100)) {
      errors.push('Discount rate must be between 0 and 100')
    }
    
    // Check calculation accuracy
    const expectedSalesTax = (calculation.baseAmount * calculation.salesTaxRate) / 100
    if (Math.abs(expectedSalesTax - calculation.salesTaxAmount) > 0.01) {
      errors.push(`Sales tax calculation appears incorrect: expected ${expectedSalesTax.toFixed(2)}, got ${calculation.salesTaxAmount.toFixed(2)}`)
    }
    
    const expectedWithholdingTax = (calculation.baseAmount * calculation.witholdingTaxRate) / 100
    if (Math.abs(expectedWithholdingTax - calculation.witholdingTaxAmount) > 0.01) {
      errors.push(`Withholding tax calculation appears incorrect: expected ${expectedWithholdingTax.toFixed(2)}, got ${calculation.witholdingTaxAmount.toFixed(2)}`)
    }
    
    // Check total calculation
    const expectedTotalTaxAmount = calculation.salesTaxAmount +
                                   (calculation.extraTaxAmount || 0) +
                                   (calculation.furtherTaxAmount || 0) +
                                   (calculation.fedAmount || 0)
    if (Math.abs(expectedTotalTaxAmount - calculation.totalTaxAmount) > 0.01) {
      errors.push(`Total tax amount calculation appears incorrect: expected ${expectedTotalTaxAmount.toFixed(2)}, got ${calculation.totalTaxAmount.toFixed(2)}`)
    }
    
    const expectedFinalAmount = calculation.baseAmount + calculation.totalTaxAmount -
                               (calculation.discountAmount || 0) - calculation.witholdingTaxAmount
    if (Math.abs(expectedFinalAmount - calculation.finalAmount) > 0.01) {
      errors.push(`Final amount calculation appears incorrect: expected ${expectedFinalAmount.toFixed(2)}, got ${calculation.finalAmount.toFixed(2)}`)
    }
    
    // Check for unusual combinations
    if (calculation.salesTaxRate === 0 && calculation.baseAmount > 1000) {
      warnings.push('Zero sales tax rate on high-value transaction - verify if exempt or zero-rated')
    }
    
    if (calculation.discountRate !== undefined && calculation.discountRate > 20) {
      warnings.push('High discount rate - verify if calculation is correct')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }
  
  /**
   * Validate tax breakdown for multiple items
   */
  validateTaxBreakdown(breakdown: TaxBreakdown): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Validate input
    if (!breakdown || typeof breakdown !== 'object') {
      errors.push('Tax breakdown object is required')
      return { isValid: false, errors, warnings }
    }
    
    // Check for negative values
    if (breakdown.baseAmount < 0) {
      errors.push('Base amount cannot be negative')
    }
    
    if (breakdown.salesTax < 0) {
      errors.push('Sales tax cannot be negative')
    }
    
    if (breakdown.withholdingTax < 0) {
      errors.push('Withholding tax cannot be negative')
    }
    
    if (breakdown.extraTax < 0) {
      errors.push('Extra tax cannot be negative')
    }
    
    if (breakdown.furtherTax < 0) {
      errors.push('Further tax cannot be negative')
    }
    
    if (breakdown.federalExciseDuty < 0) {
      errors.push('Federal excise duty cannot be negative')
    }
    
    // Check total calculation
    const expectedTotalAmount = breakdown.baseAmount + breakdown.salesTax +
                               breakdown.withholdingTax + breakdown.extraTax +
                               breakdown.furtherTax + breakdown.federalExciseDuty
    if (Math.abs(expectedTotalAmount - breakdown.totalAmount) > 0.01) {
      errors.push(`Total amount calculation appears incorrect: expected ${expectedTotalAmount.toFixed(2)}, got ${breakdown.totalAmount.toFixed(2)}`)
    }
    
    // Check effective rate
    if (breakdown.effectiveRate && breakdown.effectiveRate > 25) {
      warnings.push('Effective tax rate exceeds typical maximum (25%)')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }
}