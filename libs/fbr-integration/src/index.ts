/**
 * Easy Filer - FBR Integration Library
 * PRAL API integration for Pakistani businesses
 */

// Main API Client
export { PRALAPIClient } from './client'

// QR Code Generator
export { QRCodeGenerator } from './qr-generator'

// Pakistani Tax Calculator (CORE FEATURE)
export { PakistaniTaxCalculator } from './tax-calculator'
export type { TaxRateMatrix, TaxBreakdown } from './tax-calculator'

// FBR Compliant Types (CORE FEATURE)
export * from './fbr-compliant-types'

// Types and Interfaces
export * from './types'

// Validators - using simplified version without zod dependencies
export { validateNTN, validateInvoiceData } from './validators-simple'