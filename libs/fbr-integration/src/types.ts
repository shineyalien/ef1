/**
 * FBR PRAL API Integration Types
 * Based on official PRAL API documentation v1.12
 */

export interface PRALCredentials {
  bearerToken: string
  environment: 'sandbox' | 'production'
}

// Main Invoice Request Structure (Production JSON Format)
export interface PRALInvoiceRequest {
  // Required fields for all invoices
  invoiceType: 'Sale Invoice' | 'Debit Note'
  invoiceDate: string // Format: "YYYY-MM-DD"
  
  // Seller information (required)
  sellerNTNCNIC: string // 7 or 13 digit NTN/CNIC
  sellerBusinessName: string
  sellerProvince: string // From provinces API
  sellerAddress: string
  
  // Buyer information
  buyerNTNCNIC?: string // Optional for unregistered buyers
  buyerBusinessName: string
  buyerProvince: string // From provinces API
  buyerAddress: string
  buyerRegistrationType: 'Registered' | 'Unregistered'
  
  // Reference and scenario
  invoiceRefNo?: string // Required only for debit notes (22/28 digits)
  scenarioId?: string // Required for sandbox only
  
  // Line items
  items: PRALInvoiceItem[]
}

export interface PRALInvoiceItem {
  hsCode: string // From itemdesccode API
  productDescription: string
  rate: string // Percentage like "18%"
  uoM: string // From uom API - Note: FBR uses "uoM" (camelCase)
  quantity: number // Should be formatted as 1.0000 (4 decimal places)
  totalValues: number // Total including tax
  valueSalesExcludingST: number // Base amount
  fixedNotifiedValueOrRetailPrice: number
  salesTaxApplicable: number // Sales tax amount
  salesTaxWithheldAtSource: number // Withholding tax
  extraTax?: number // Optional
  furtherTax?: number // Optional
  sroScheduleNo?: string // Optional SRO reference
  fedPayable?: number // Federal excise duty
  discount?: number // Optional discount
  saleType: string // From tax rates API - Should be "Goods at standard rate (default)" etc.
  sroItemSerialNo?: string // Optional
}

// Legacy PascalCase interfaces (for backward compatibility)
export interface PRALInvoiceRequestPascal {
  InvoiceType: string
  InvoiceDate: string
  SellerNTNCNIC: string
  SellerBusinessName: string
  SellerProvince: string
  SellerAddress: string
  BuyerNTNCNIC?: string
  BuyerBusinessName: string
  BuyerProvince: string
  BuyerAddress: string
  BuyerRegistrationType: 'Registered' | 'Unregistered'
  InvoiceRefNo?: string
  ScenarioId?: string
  Items: PRALInvoiceItemPascal[]
}

export interface PRALInvoiceItemPascal {
  HSCode: string
  ProductDescription: string
  Rate: string
  UOM: string
  Quantity: number
  ValueSalesExcludingST: number
  SalesTaxApplicable: number
  TotalValues: number
  FixedNotifiedValueOrRetailPrice: number
  SalesTaxWithheldAtSource: number
  ExtraTax?: number
  FurtherTax?: number
  SROScheduleNo?: string
  FEDPayable?: number
  Discount?: number
  SaleType: string
  SROItemSerialNo?: string
}

// FBR Response Structure (camelCase for production)
export interface PRALInvoiceResponse {
  // Core FBR Response Data
  invoiceNumber?: string // Format: 7000007DI1747119701593 (FBR-generated IRN)
  dated: string // FBR timestamp of processing
  
  // Validation Response Structure
  validationResponse?: {
    statusCode: '00' | '01' // 00 = Valid/Success, 01 = Invalid/Failed
    status: 'Valid' | 'Invalid' | 'Success' | 'Failed'
    error?: string
    errorCode?: string
    
    // Item-level responses for multi-item invoices
    invoiceStatuses?: Array<{
      itemSNo: string
      statusCode: '00' | '01'
      status: 'Valid' | 'Invalid'
      invoiceNo?: string // Individual item invoice number from FBR
      errorCode?: string
      error?: string
    }>
  }
  
  // Legacy PascalCase support
  ValidationResponse?: {
    StatusCode: '00' | '01'
    Status: 'Valid' | 'Invalid' | 'Success' | 'Failed'
    Error?: string
    ErrorCode?: string
    InvoiceStatuses?: Array<{
      ItemSNo: string
      StatusCode: '00' | '01'
      Status: 'Valid' | 'Invalid'
      InvoiceNo?: string
      ErrorCode?: string
      Error?: string
    }>
  }
  
  // Additional FBR Metadata (if provided)
  transmissionId?: string // FBR internal transmission reference
  TransmissionId?: string // Legacy PascalCase
  acknowledgmentNumber?: string // FBR acknowledgment reference
  AcknowledgmentNumber?: string // Legacy PascalCase
  fbrTimestamp?: string // Official FBR processing timestamp
  
  // HTTP Response Metadata
  httpStatusCode?: number // 200, 401, 500, etc.
  responseHeaders?: Record<string, string> // Any additional headers from FBR
}

// Reference Data Types
export interface ProvinceData {
  stateProvinceCode: number
  stateProvinceDesc: string // "PUNJAB", "SINDH", etc.
}

export interface HSCodeData {
  hS_CODE: string // "8432.1010"
  description: string // Full HS code description
}

export interface UOMData {
  uoM_ID: number
  description: string // "Square Metre", "KG", etc.
}

export interface TaxRateData {
  ratE_ID: number
  ratE_DESC: string // "18% along with rupees 60 per kilogram"
  ratE_VALUE: number // 18
}

export interface DocumentTypeData {
  docTypeId: number
  docDescription: string
}

export interface SROItemData {
  srO_ITEM_ID: number
  srO_ITEM_DESC: string
}

// Error Types
export interface PRALError {
  statusCode: string // "00", "01", etc.
  errorCode?: string // "0046", "0052", etc.
  message: string
  field?: string // Which field caused the error
  itemIndex?: number // For item-specific errors
}

// QR Code Types
export interface QRCodeData {
  invoiceNumber: string // FBR-provided IRN
  sellerNTN: string
  invoiceDate: string
  totalAmount: number
  buyerNTN?: string
  timestamp: string
}

// API Endpoints
export const PRAL_ENDPOINTS = {
  // Base URL
  BASE_URL: 'https://gw.fbr.gov.pk',
  
  // Invoice submission endpoints
  POST_INVOICE_SANDBOX: '/di_data/v1/di/postinvoicedata_sb',
  POST_INVOICE_PRODUCTION: '/di_data/v1/di/postinvoicedata',
  VALIDATE_INVOICE_SANDBOX: '/di_data/v1/di/validateinvoicedata_sb',
  
  // Reference data endpoints (public, no auth required)
  PROVINCES: '/pdi/v1/provinces',
  DOCUMENT_TYPES: '/pdi/v1/doctypecode',
  HS_CODES: '/pdi/v1/itemdesccode',
  SRO_ITEMS: '/pdi/v1/sroitemcode',
  TRANSACTION_TYPES: '/pdi/v1/transtypecode',
  UNITS_OF_MEASUREMENT: '/pdi/v1/uom',
  SRO_SCHEDULE: '/pdi/v1/SroSchedule',
  TAX_RATES: '/pdi/v2/SaleTypeToRate'
} as const

// HTTP Status Codes
export enum PRALHttpStatus {
  OK = 200,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500
}