import { z } from 'zod'
import { PRALInvoiceRequest, PRALInvoiceItem } from './types'

/**
 * Validation utilities for FBR compliance
 */

// NTN Validation
const NTN_REGEX = /^\d{7}$|^\d{13}$/

export function validateNTN(ntn: string): boolean {
  return NTN_REGEX.test(ntn)
}

// STRN Validation  
const STRN_REGEX = /^\d{2}-\d{2}-\d{4}-\d{3}-\d{2}$/

export function validateSTRN(strn: string): boolean {
  return STRN_REGEX.test(strn)
}

// Date validation (YYYY-MM-DD format)
export function validateInvoiceDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false
  
  // Check if it's a valid date
  const parsedDate = new Date(date)
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime())
}

// HS Code validation (basic format check)
export function validateHSCode(hsCode: string): boolean {
  // HS codes can be 4, 6, 8, or 10 digits with optional dots
  const hsCodeRegex = /^\d{4}(\.\d{2})?(\.\d{2})?(\.\d{2})?$/
  return hsCodeRegex.test(hsCode)
}

// Province validation
const VALID_PROVINCES = [
  'PUNJAB',
  'SINDH', 
  'KHYBER PAKHTUNKHWA',
  'BALOCHISTAN',
  'ISLAMABAD CAPITAL TERRITORY',
  'GILGIT BALTISTAN',
  'AZAD JAMMU & KASHMIR'
]

export function validateProvince(province: string): boolean {
  return VALID_PROVINCES.includes(province.toUpperCase())
}

// Zod schemas for comprehensive validation
const PRALInvoiceItemSchema = z.object({
  hsCode: z.string().refine(validateHSCode, 'Invalid HS Code format'),
  productDescription: z.string().min(1, 'Product description is required'),
  rate: z.string().regex(/^\d+(\.\d+)?%$/, 'Rate must be in percentage format (e.g., "18%")'),
  uoM: z.string().min(1, 'Unit of measurement is required'),
  quantity: z.number().positive('Quantity must be positive'),
  totalValues: z.number().positive('Total value must be positive'),
  valueSalesExcludingST: z.number().min(0, 'Value excluding sales tax must be non-negative'),
  fixedNotifiedValueOrRetailPrice: z.number().min(0, 'Fixed notified value must be non-negative'),
  salesTaxApplicable: z.number().min(0, 'Sales tax amount must be non-negative'),
  salesTaxWithheldAtSource: z.number().min(0, 'Withholding tax must be non-negative'),
  extraTax: z.number().min(0, 'Extra tax must be non-negative').optional(),
  furtherTax: z.number().min(0, 'Further tax must be non-negative').optional(),
  sroScheduleNo: z.string().optional(),
  fedPayable: z.number().min(0, 'Federal excise duty must be non-negative').optional(),
  discount: z.number().min(0, 'Discount must be non-negative').optional(),
  saleType: z.string().min(1, 'Sale type is required'),
  sroItemSerialNo: z.string().optional()
})

const PRALInvoiceRequestSchema = z.object({
  invoiceType: z.enum(['Sale Invoice', 'Debit Note'], {
    errorMap: () => ({ message: 'Invoice type must be "Sale Invoice" or "Debit Note"' })
  }),
  invoiceDate: z.string().refine(validateInvoiceDate, 'Invalid invoice date format (use YYYY-MM-DD)'),
  
  // Seller information
  sellerNTNCNIC: z.string().refine(validateNTN, 'Invalid seller NTN/CNIC format'),
  sellerBusinessName: z.string().min(1, 'Seller business name is required'),
  sellerProvince: z.string().refine(validateProvince, 'Invalid seller province'),
  sellerAddress: z.string().min(1, 'Seller address is required'),
  
  // Buyer information
  buyerNTNCNIC: z.string().refine(validateNTN, 'Invalid buyer NTN/CNIC format').optional(),
  buyerBusinessName: z.string().min(1, 'Buyer business name is required'),
  buyerProvince: z.string().refine(validateProvince, 'Invalid buyer province'),
  buyerAddress: z.string().min(1, 'Buyer address is required'),
  buyerRegistrationType: z.enum(['Registered', 'Unregistered'], {
    errorMap: () => ({ message: 'Buyer registration type must be "Registered" or "Unregistered"' })
  }),
  
  // Reference and scenario
  invoiceRefNo: z.string().optional(),
  scenarioId: z.string().optional(),
  
  // Items
  items: z.array(PRALInvoiceItemSchema).min(1, 'At least one item is required')
})

/**
 * Validate complete invoice data
 */
export function validateInvoiceData(invoiceData: PRALInvoiceRequest): {
  isValid: boolean
  errors: string[]
} {
  try {
    PRALInvoiceRequestSchema.parse(invoiceData)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.join('.')
        return `${path}: ${err.message}`
      })
      return { isValid: false, errors }
    }
    
    return { isValid: false, errors: ['Unknown validation error'] }
  }
}

/**
 * Validate individual invoice item
 */
export function validateInvoiceItem(item: PRALInvoiceItem): {
  isValid: boolean
  errors: string[]
} {
  try {
    PRALInvoiceItemSchema.parse(item)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.join('.')
        return `${path}: ${err.message}`
      })
      return { isValid: false, errors }
    }
    
    return { isValid: false, errors: ['Unknown validation error'] }
  }
}

/**
 * Validate tax calculations
 */
export function validateTaxCalculations(item: PRALInvoiceItem): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Extract tax rate from rate string (e.g., "18%" -> 18)
  const taxRateMatch = item.rate.match(/^(\d+(?:\.\d+)?)%$/)
  if (!taxRateMatch) {
    errors.push('Invalid tax rate format')
    return { isValid: false, errors }
  }
  
  const taxRatePercent = parseFloat(taxRateMatch[1])
  const expectedTaxAmount = (item.valueSalesExcludingST * taxRatePercent) / 100
  
  // Allow small rounding differences (within 0.01)
  const taxDifference = Math.abs(item.salesTaxApplicable - expectedTaxAmount)
  if (taxDifference > 0.01) {
    errors.push(`Tax calculation mismatch: expected ${expectedTaxAmount.toFixed(2)}, got ${item.salesTaxApplicable}`)
  }
  
  // Validate total calculation
  const expectedTotal = item.valueSalesExcludingST + item.salesTaxApplicable + (item.extraTax || 0) + (item.furtherTax || 0) + (item.fedPayable || 0) - (item.discount || 0) - item.salesTaxWithheldAtSource
  const totalDifference = Math.abs(item.totalValues - expectedTotal)
  
  if (totalDifference > 0.01) {
    errors.push(`Total calculation mismatch: expected ${expectedTotal.toFixed(2)}, got ${item.totalValues}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate business registration requirement
 */
export function validateBusinessRegistration(
  buyerNTN: string | undefined,
  registrationType: 'Registered' | 'Unregistered'
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (registrationType === 'Registered' && !buyerNTN) {
    errors.push('Buyer NTN is required for registered buyers')
  }
  
  if (registrationType === 'Registered' && buyerNTN && !validateNTN(buyerNTN)) {
    errors.push('Invalid buyer NTN format for registered buyer')
  }
  
  if (registrationType === 'Unregistered' && buyerNTN) {
    errors.push('Buyer NTN should not be provided for unregistered buyers')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}