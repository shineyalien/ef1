// Common types used across the Easy Filer application

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  subscriptionPlan: SubscriptionPlan
  country: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Business {
  id: string
  userId: string
  companyName: string
  ntnNumber: string
  address: string
  province: string
  businessType: string
  sector: string
  phoneNumber?: string
  email?: string
  fbrSetupComplete: boolean
  integrationMode: IntegrationMode
  sandboxValidated: boolean
  sandboxToken?: string
  productionToken?: string
  createdAt: Date
  updatedAt: Date
  
  // FBR Seller Fields
  sellerCity?: string
  sellerContact?: string
  sellerEmail?: string
  posId?: string
  electronicSoftwareRegNo?: string
  fbrIntegratorLicenseNo?: string
  
  // Phase 2: Business Customization Fields
  logoUrl?: string
  invoicePrefix?: string
  defaultPaymentTerms?: string
  footerText?: string
  taxIdLabel?: string
  primaryColor?: string
  secondaryColor?: string
  defaultCurrency?: string
  invoiceTemplate?: string
  
  // FBR Scenario Selection
  defaultScenario?: string
}

export interface Customer {
  id: string
  businessId: string
  name: string
  email?: string
  phone?: string
  address?: string
  ntnNumber?: string
  registrationType: RegistrationType
  buyerType?: string
  buyerNTN?: string
  buyerCNIC?: string
  buyerPassport?: string
  buyerCity?: string
  buyerProvince?: string
  buyerContact?: string
  buyerEmail?: string
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  businessId: string
  customerId?: string
  invoiceNumber: string
  invoiceSequence: number
  invoiceDate: Date
  dueDate?: Date
  subtotal: number
  taxAmount: number
  totalAmount: number
  status: InvoiceStatus
  mode: IntegrationMode
  fbrSubmitted: boolean
  fbrValidated: boolean
  submissionTimestamp?: Date
  fbrInvoiceNumber?: string
  qrCode?: string
  qrCodeData?: string
  documentType: string
  scenarioId?: string
  referenceInvoiceNo?: string
  paymentMode: string
  taxPeriod?: string
  fbrResponse?: any
  fbrTimestamp?: Date
  fbrTransactionId?: string
  fbrErrorCode?: string
  fbrErrorMessage?: string
  retryCount: number
  lastRetryAt?: Date
  maxRetries: number
  retryEnabled: boolean
  nextRetryAt?: Date
  totalBillAmount?: number
  totalQuantity?: number
  totalDiscount?: number
  totalSalesTax?: number
  totalWithholdingTax?: number
  totalExtraTax?: number
  totalFurtherTax?: number
  totalFED?: number
  isOfflineInvoice: boolean
  offlineCreatedAt?: Date
  syncedAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceItem {
  id: string
  invoiceId: string
  productId?: string
  itemCode?: string
  description: string
  hsCode: string
  quantity: number
  unitOfMeasurement: string
  unitPrice: number
  saleValue: number
  discount: number
  valueSalesExcludingST: number
  fbrSaleType?: string
  taxRate: number
  salesTaxApplicable: number
  taxCharged?: number
  taxAmount: number
  salesTaxWithheldAtSource: number
  extraTax: number
  furtherTax: number
  fedPayable: number
  sroScheduleNo?: string
  salesTaxAct: string
  totalValue: number
  fixedNotifiedValueOrRetailPrice: number
  saleType: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  businessId: string
  name: string
  description?: string
  hsCode: string
  unitOfMeasurement: string
  unitPrice: number
  taxRate: number
  category?: string
  fbrSaleType?: string
  serialNumber?: string
  hsCodeDescription?: string
  transactionType?: string
  transactionTypeDesc?: string
  rateId?: string
  rateDescription?: string
  sroNo?: string
  sroItemSerialNo?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Enums
export enum SubscriptionPlan {
  FREE = 'FREE',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE'
}

export enum IntegrationMode {
  LOCAL = 'LOCAL',
  SANDBOX = 'SANDBOX',
  PRODUCTION = 'PRODUCTION'
}

export enum RegistrationType {
  REGISTERED = 'REGISTERED',
  UNREGISTERED = 'UNREGISTERED'
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SAVED = 'SAVED',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

// FBR Lookup Types
export interface FBRProvince {
  id: string
  code: string
  name: string
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FBRHSCode {
  id: string
  code: string
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FBRUnitOfMeasurement {
  id: string
  code: string
  hsCode?: string
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}