/**
 * Complete FBR-Compliant Invoice Structure
 * Based on SRO 69(I)/2025 and PRAL API v1.12
 * 
 * This file contains the complete 26 mandatory fields and all interconnected
 * tax calculations, SRO references, and buyer/seller information required
 * for Pakistani FBR digital invoicing compliance.
 */

// ==================== BUYER INFORMATION ====================
export interface BuyerInformation {
  // Core buyer details
  buyerNTNCNIC?: string // Optional for unregistered buyers (13 digits for CNIC, 7 for NTN)
  buyerBusinessName: string // Company/Individual name
  buyerAddress: string // Complete address
  buyerProvince: string // From FBR provinces API
  buyerCity?: string // Optional city
  buyerPostalCode?: string // Optional postal code
  buyerRegistrationType: 'Registered' | 'Unregistered'
  
  // Additional buyer fields for registered buyers
  buyerSTRN?: string // Sales Tax Registration Number
  buyerGSTNumber?: string // GST Number if applicable
  buyerPhoneNumber?: string // Contact information
  buyerEmail?: string // Contact email
  
  // Business classification for registered buyers
  buyerBusinessType?: string // Type of business
  buyerSector?: string // Business sector
}

// ==================== SELLER INFORMATION ====================
export interface SellerInformation {
  // Mandatory seller details
  sellerNTNCNIC: string // 7 or 13 digit NTN/CNIC
  sellerBusinessName: string // Business name
  sellerAddress: string // Complete business address
  sellerProvince: string // From FBR provinces API
  sellerCity: string // Business city
  sellerPostalCode?: string // Postal code
  
  // Registration details
  sellerSTRN: string // Sales Tax Registration Number
  sellerGSTNumber?: string // GST Number if applicable
  sellerPhoneNumber: string // Business phone
  sellerEmail: string // Business email
  sellerWebsite?: string // Optional website
  
  // Business classification
  businessType: string // Type of business entity
  sector: string // Business sector
}

// ==================== COMPLETE LINE ITEM STRUCTURE ====================
export interface FBRCompliantInvoiceItem {
  // Product identification
  itemSerialNumber: number // Sequential item number (1, 2, 3...)
  productDescription: string // Product/service description
  hsCode: string // Harmonized System code from FBR API
  quantity: number // Quantity
  uoM: string // Unit of Measurement from FBR API
  
  // Pricing (all amounts in PKR)
  unitPrice: number // Price per unit
  valueSalesExcludingST: number // Base amount before taxes
  fixedNotifiedValueOrRetailPrice: number // Fixed/notified value or retail price
  
  // Tax calculations
  salesTaxRate: number // Tax rate percentage (e.g., 18)
  salesTaxApplicable: number // Calculated sales tax amount
  salesTaxWithheldAtSource: number // Withholding tax amount
  
  // Additional taxes
  extraTax?: number // Additional tax if applicable
  furtherTax?: number // Further tax if applicable
  federalExciseDuty?: number // FED amount
  
  // SRO (Statutory Regulatory Order) references
  sroScheduleNo?: string // SRO schedule reference
  sroItemSerialNo?: string // SRO item serial number
  sroRate?: number // SRO-specific tax rate
  
  // Discounts and adjustments
  discount?: number // Discount amount
  discountPercentage?: number // Discount percentage
  
  // Final calculations
  totalValues: number // Total including all taxes and discounts
  
  // Classification and rates
  saleType: string // Sale type from FBR tax rates API
  taxCategory: string // Tax category classification
  
  // Reference data
  ratE_ID?: number // Rate ID from FBR API
  tranS_TYPE_ID?: number // Transaction type ID
}

// Simplified type alias for common usage
export interface InvoiceItem {
  description: string
  quantity: number
  hsCode: string
  unitOfMeasurement: string
  unitPrice: number
  totalValue: number
  applicableTaxRate: number
  sroScheduleNo?: string
  sroItemSerialNo?: string
}

// SRO Reference Data
export interface SROReferenceData {
  scheduleNumber: string
  serialNumber: string
  description: string
  reducedRate?: number
  applicableHSCodes: string[]
  applicableFrom?: string
  applicableTo?: string
}

// ==================== COMPLETE INVOICE STRUCTURE ====================
export interface FBRCompliantInvoice {
  // ============ MANDATORY DIGITAL INVOICE FIELDS (26 fields from SRO) ============
  
  // a) Unique FBR Invoice Number (generated after FBR submission)
  fbrInvoiceNumber?: string // Format: XXXXXX-DDMMYYHHMMSS-0001
  localInvoiceNumber: string // Our internal invoice number
  
  // b) QR Code (generated using FBR IRN)
  qrCode?: string // 7x7MM QR code generated after FBR response
  
  // c) Electronic Software Registration Number
  softwareRegistrationNumber: string // Our software registration with FBR
  
  // d) FBR Digital Invoicing Logo
  fbrDigitalInvoicingLogo: string // Official FBR logo reference
  
  // e-j) Business entities
  seller: SellerInformation
  buyer: BuyerInformation
  
  // k-z) Invoice details and calculations
  invoiceType: 'Sale Invoice' | 'Debit Note' | 'Credit Note'
  invoiceDate: string // ISO date format YYYY-MM-DD
  invoiceTime?: string // Time of invoice generation
  taxPeriod: string // Tax period identifier
  dueDate?: string // Payment due date
  
  // Reference numbers
  invoiceRefNo?: string // Required for debit/credit notes (22/28 digits)
  purchaseOrderNumber?: string // Customer PO number
  
  // Line items with complete tax structure
  items: FBRCompliantInvoiceItem[]
  
  // ============ INVOICE TOTALS AND TAX SUMMARY ============
  
  // Subtotals
  subtotalExcludingTax: number // Total before any taxes
  totalSalesTax: number // Total sales tax amount
  totalWithholdingTax: number // Total withholding tax
  totalExtraTax: number // Total additional taxes
  totalFurtherTax: number // Total further taxes
  totalFederalExciseDuty: number // Total FED
  totalDiscount: number // Total discount amount
  
  // Final totals
  grandTotal: number // Final amount including all taxes and discounts
  amountInWords: string // Amount spelled out in words
  
  // ============ FBR INTEGRATION FIELDS ============
  
  // Submission tracking
  fbrSubmitted: boolean // Whether submitted to FBR
  fbrValidated: boolean // Whether validated by FBR
  submissionTimestamp?: Date // When submitted to FBR
  fbrTimestamp?: string // Official FBR processing timestamp
  fbrTransmissionId?: string // FBR transmission reference
  fbrAcknowledgmentNumber?: string // FBR acknowledgment reference
  
  // Processing mode
  mode: 'LOCAL' | 'SANDBOX' | 'PRODUCTION' // Current processing mode
  
  // Scenario and testing
  scenarioId?: string // Required for sandbox testing
  
  // ============ BUSINESS WORKFLOW FIELDS ============
  
  // Status tracking
  status: 'DRAFT' | 'PENDING' | 'SUBMITTED' | 'VALIDATED' | 'FAILED'
  
  // Additional information
  description?: string // Invoice description
  notes?: string // Internal notes
  termsAndConditions?: string // T&C text
  
  // Payment information
  paymentTerms?: string // Payment terms
  paymentMethod?: string // Payment method
  bankDetails?: {
    accountTitle: string
    accountNumber: string
    bankName: string
    branchCode: string
  }
  
  // Audit trail
  createdAt: Date
  updatedAt: Date
  createdBy: string // User who created the invoice
  lastModifiedBy?: string // User who last modified
  
  // Document storage
  pdfGenerated: boolean // Whether PDF is generated
  pdfStoragePath?: string // Path to stored PDF
  encryptedData?: string // Encrypted data for 6-year retention
  
  // Complete FBR response for audit
  fbrResponse?: any // Complete PRAL API response
}

// ==================== TAX CALCULATION HELPERS ====================

export interface TaxCalculation {
  baseAmount: number
  salesTaxRate: number
  salesTaxAmount: number
  witholdingTaxRate: number
  witholdingTaxAmount: number
  extraTaxRate?: number
  extraTaxAmount?: number
  furtherTaxRate?: number
  furtherTaxAmount?: number
  fedRate?: number
  fedAmount?: number
  discountRate?: number
  discountAmount?: number
  totalTaxAmount: number
  finalAmount: number
}

// ==================== SRO INTEGRATION ====================

export interface SROReference {
  sroScheduleNo: string // SRO schedule number
  sroItemSerialNo: string // Item serial in SRO
  applicableRate: number // SRO-specific rate
  exemptionType?: 'FULL' | 'PARTIAL' | 'REDUCED'
  exemptionPercentage?: number
  applicableFrom: string // Date from which SRO is applicable
  applicableUntil?: string // Date until which SRO is applicable
}

// ==================== VALIDATION SCHEMAS ====================

export interface ValidationRule {
  field: string
  required: boolean
  type: 'string' | 'number' | 'date' | 'email' | 'ntn' | 'cnic'
  minLength?: number
  maxLength?: number
  pattern?: string
  dependsOn?: string[] // Fields that this field depends on
}

// ==================== COMPREHENSIVE FBR VALIDATION RULES ====================

// Comprehensive validation rules for FBR compliance
export const FBR_VALIDATION_RULES: ValidationRule[] = [
  // Seller information
  { field: 'seller.sellerNTNCNIC', required: true, type: 'ntn', minLength: 7, maxLength: 13 },
  { field: 'seller.sellerBusinessName', required: true, type: 'string', minLength: 2, maxLength: 100 },
  { field: 'seller.sellerAddress', required: true, type: 'string', minLength: 10, maxLength: 200 },
  { field: 'seller.sellerProvince', required: true, type: 'string' },
  { field: 'seller.sellerSTRN', required: true, type: 'string', minLength: 7, maxLength: 15 },
  
  // Buyer information
  { field: 'buyer.buyerBusinessName', required: true, type: 'string', minLength: 2, maxLength: 100 },
  { field: 'buyer.buyerAddress', required: true, type: 'string', minLength: 5, maxLength: 200 },
  { field: 'buyer.buyerProvince', required: true, type: 'string' },
  { field: 'buyer.buyerRegistrationType', required: true, type: 'string' },
  
  // Invoice details
  { field: 'invoiceType', required: true, type: 'string' },
  { field: 'invoiceDate', required: true, type: 'date' },
  { field: 'localInvoiceNumber', required: true, type: 'string', minLength: 5, maxLength: 50 },
  
  // Line items
  { field: 'items', required: true, type: 'string' }, // Array validation handled separately
  
  // Amounts
  { field: 'grandTotal', required: true, type: 'number' },
  { field: 'totalSalesTax', required: true, type: 'number' }
]