/**
 * Basic validation utilities for FBR compliance
 * Simplified version without external dependencies
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

/**
 * Basic invoice data validation
 */
export function validateInvoiceData(invoiceData: any): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Basic validation without zod
  if (!invoiceData.sellerNTNCNIC) errors.push('Seller NTN/CNIC is required')
  if (!invoiceData.sellerBusinessName) errors.push('Seller business name is required')
  if (!invoiceData.buyerBusinessName) errors.push('Buyer business name is required')
  if (!invoiceData.invoiceDate) errors.push('Invoice date is required')
  if (!invoiceData.items || invoiceData.items.length === 0) errors.push('At least one item is required')
  
  // NTN validation
  if (invoiceData.sellerNTNCNIC && !validateNTN(invoiceData.sellerNTNCNIC)) {
    errors.push('Invalid seller NTN/CNIC format')
  }
  
  if (invoiceData.buyerNTNCNIC && !validateNTN(invoiceData.buyerNTNCNIC)) {
    errors.push('Invalid buyer NTN/CNIC format')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}