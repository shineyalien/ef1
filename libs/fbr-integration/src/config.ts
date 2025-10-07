/**
 * Centralized FBR Configuration
 * 
 * This file contains all configurable settings for FBR integration,
 * making it easier to update settings without modifying code.
 */

// Environment Configuration
export const FBREnvironment = {
  // Determine current environment
  current: (process.env.FBR_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',
  
  // API endpoints - can be overridden by environment variables
  endpoints: {
    BASE_URL: process.env.FBR_BASE_URL || 'https://gw.fbr.gov.pk',
    POST_INVOICE_SANDBOX: process.env.FBR_POST_INVOICE_SANDBOX || '/di_data/v1/di/postinvoicedata_sb',
    POST_INVOICE_PRODUCTION: process.env.FBR_POST_INVOICE_PRODUCTION || '/di_data/v1/di/postinvoicedata',
    VALIDATE_INVOICE_SANDBOX: process.env.FBR_VALIDATE_INVOICE_SANDBOX || '/di_data/v1/di/validateinvoicedata_sb',
    PROVINCES: process.env.FBR_PROVINCES || '/pdi/v1/provinces',
    DOCUMENT_TYPES: process.env.FBR_DOCUMENT_TYPES || '/pdi/v1/doctypecode',
    HS_CODES: process.env.FBR_HS_CODES || '/pdi/v1/itemdesccode',
    SRO_ITEMS: process.env.FBR_SRO_ITEMS || '/pdi/v1/sroitemcode',
    TRANSACTION_TYPES: process.env.FBR_TRANSACTION_TYPES || '/pdi/v1/transtypecode',
    UNITS_OF_MEASUREMENT: process.env.FBR_UNITS_OF_MEASUREMENT || '/pdi/v1/uom',
    SRO_SCHEDULE: process.env.FBR_SRO_SCHEDULE || '/pdi/v1/SroSchedule',
    TAX_RATES: process.env.FBR_TAX_RATES || '/pdi/v2/SaleTypeToRate'
  },
  
  // Authentication
  credentials: {
    bearerToken: process.env.FBR_SANDBOX_TOKEN || 'test-token',
    environment: (process.env.FBR_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production'
  },
  
  // Request settings
  request: {
    timeout: parseInt(process.env.FBR_REQUEST_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.FBR_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.FBR_RETRY_DELAY || '1000')
  }
}

// Tax Configuration - can be overridden by environment variables or fetched from API
export const FBRTaxConfig = {
  // Standard tax rates
  standardRate: parseFloat(process.env.FBR_STANDARD_TAX_RATE || '18'),
  reducedRates: (process.env.FBR_REDUCED_TAX_RATES || '5,10,12,15').split(',').map(Number),
  
  // Withholding tax rates by sector
  withholdingRates: {
    'Manufacturing': { 
      rate: parseFloat(process.env.FBR_WITHHOLDING_RATE_MANUFACTURING || '1.0'), 
      threshold: parseFloat(process.env.FBR_WITHHOLDING_THRESHOLD_MANUFACTURING || '25000') 
    },
    'Trading': { 
      rate: parseFloat(process.env.FBR_WITHHOLDING_RATE_TRADING || '0.25'), 
      threshold: parseFloat(process.env.FBR_WITHHOLDING_THRESHOLD_TRADING || '50000') 
    },
    'Services': { 
      rate: parseFloat(process.env.FBR_WITHHOLDING_RATE_SERVICES || '8.0'), 
      threshold: parseFloat(process.env.FBR_WITHHOLDING_THRESHOLD_SERVICES || '15000') 
    },
    'Import': { 
      rate: parseFloat(process.env.FBR_WITHHOLDING_RATE_IMPORT || '5.5'), 
      threshold: parseFloat(process.env.FBR_WITHHOLDING_THRESHOLD_IMPORT || '100000') 
    },
    'Export': { 
      rate: parseFloat(process.env.FBR_WITHHOLDING_RATE_EXPORT || '0.0'), 
      threshold: parseFloat(process.env.FBR_WITHHOLDING_THRESHOLD_EXPORT || '0') 
    },
    'Telecommunication': { 
      rate: parseFloat(process.env.FBR_WITHHOLDING_RATE_TELECOMMUNICATION || '10.0'), 
      threshold: parseFloat(process.env.FBR_WITHHOLDING_THRESHOLD_TELECOMMUNICATION || '1000') 
    },
    'Banking': { 
      rate: parseFloat(process.env.FBR_WITHHOLDING_RATE_BANKING || '0.6'), 
      threshold: parseFloat(process.env.FBR_WITHHOLDING_THRESHOLD_BANKING || '5000') 
    }
  },
  
  // Provincial tax rates
  provincialRates: {
    'Punjab': { 
      extraTaxRate: parseFloat(process.env.FBR_PUNJAB_EXTRA_TAX_RATE || '0.0'),
      provincialSalesTax: parseFloat(process.env.FBR_PUNJAB_PROVINCIAL_SALES_TAX || '0.0')
    },
    'Sindh': { 
      extraTaxRate: parseFloat(process.env.FBR_SINDH_EXTRA_TAX_RATE || '0.0'),
      provincialSalesTax: parseFloat(process.env.FBR_SINDH_PROVINCIAL_SALES_TAX || '0.0')
    },
    'KPK': { 
      extraTaxRate: parseFloat(process.env.FBR_KPK_EXTRA_TAX_RATE || '0.0'),
      provincialSalesTax: parseFloat(process.env.FBR_KPK_PROVINCIAL_SALES_TAX || '0.0')
    },
    'Balochistan': { 
      extraTaxRate: parseFloat(process.env.FBR_BALOCHISTAN_EXTRA_TAX_RATE || '0.0'),
      provincialSalesTax: parseFloat(process.env.FBR_BALOCHISTAN_PROVINCIAL_SALES_TAX || '0.0')
    },
    'Islamabad': { 
      extraTaxRate: parseFloat(process.env.FBR_ISLAMABAD_EXTRA_TAX_RATE || '0.0'),
      provincialSalesTax: parseFloat(process.env.FBR_ISLAMABAD_PROVINCIAL_SALES_TAX || '0.0')
    }
  },
  
  // Zero-rated and exempt items
  zeroRatedItems: (process.env.FBR_ZERO_RATED_ITEMS || 'Rice,Wheat,Sugar,Edible Oil,Fertilizer,Pesticides,Agricultural Machinery,Export Items').split(','),
  exemptItems: (process.env.FBR_EXEMPT_ITEMS || 'Books,Newspapers,Educational Materials,Medicine,Medical Equipment,Charity Items').split(',')
}

// QR Code Configuration
export const FBRQRConfig = {
  // QR code generation settings
  size: parseInt(process.env.FBR_QR_SIZE || '200'),
  margin: parseInt(process.env.FBR_QR_MARGIN || '1'),
  errorCorrectionLevel: (process.env.FBR_QR_ERROR_CORRECTION || 'M') as 'L' | 'M' | 'Q' | 'H',
  
  // QR code validation settings
  validation: {
    strict: process.env.FBR_QR_VALIDATION_STRICT === 'true',
    minInvoiceNumberLength: parseInt(process.env.FBR_QR_MIN_INVOICE_NUMBER_LENGTH || '10'),
    allowPartialFields: process.env.FBR_QR_ALLOW_PARTIAL_FIELDS === 'true'
  }
}

// Invoice Number Configuration
export const FBRInvoiceNumberConfig = {
  // Invoice number parsing patterns
  patterns: {
    // Default FBR format: 7000007DI1747119701593
    default: {
      ntnLength: 7,
      minLength: 20,
      prefixRegex: /^(\d{7})/,
      sequenceRegex: /(\d{4})$/
    },
    // Alternative formats can be added here
    alternative: [
      {
        name: 'Extended Format',
        ntnLength: 13,
        minLength: 26,
        prefixRegex: /^(\d{13})/,
        sequenceRegex: /(\d{4})$/
      }
    ]
  },
  
  // Validation settings
  validation: {
    allowUnknownFormats: process.env.FBR_INVOICE_ALLOW_UNKNOWN_FORMATS === 'true',
    strictValidation: process.env.FBR_INVOICE_STRICT_VALIDATION !== 'false' // Default true
  }
}

// Error Handling Configuration
export const FBRErrorConfig = {
  // Error handling settings
  includeStackTrace: process.env.FBR_ERROR_INCLUDE_STACK_TRACE === 'true',
  logLevel: (process.env.FBR_ERROR_LOG_LEVEL || 'error') as 'debug' | 'info' | 'warn' | 'error',
  
  // Retry configuration
  retry: {
    enabled: process.env.FBR_RETRY_ENABLED !== 'false', // Default true
    maxAttempts: parseInt(process.env.FBR_RETRY_MAX_ATTEMPTS || '3'),
    baseDelay: parseInt(process.env.FBR_RETRY_BASE_DELAY || '1000'),
    maxDelay: parseInt(process.env.FBR_RETRY_MAX_DELAY || '10000'),
    backoffMultiplier: parseFloat(process.env.FBR_RETRY_BACKOFF_MULTIPLIER || '2')
  }
}

// Scenario Configuration
export const FBRScenarioConfig = {
  // Default scenarios
  defaultScenarios: {
    'GEN-001': 'General - Registered to Registered',
    'GEN-002': 'General - Registered to Unregistered',
    'GEN-003': 'General - Export Sales'
  },
  
  // Business type mappings
  businessTypeMappings: {
    'Manufacturer': ['MFG-001', 'MFG-002', 'MFG-003'],
    'Service Provider': ['SRV-001', 'SRV-002', 'SRV-003'],
    'Distributor': ['TRD-001', 'TRD-002']
  },
  
  // Validation settings
  validation: {
    allowUnknownScenarios: process.env.FBR_SCENARIO_ALLOW_UNKNOWN === 'true',
    requireScenarioForSandbox: process.env.FBR_SCENARIO_REQUIRED_FOR_SANDBOX !== 'false' // Default true
  }
}

// Export all configurations
export const FBRConfig = {
  environment: FBREnvironment,
  tax: FBRTaxConfig,
  qr: FBRQRConfig,
  invoiceNumber: FBRInvoiceNumberConfig,
  error: FBRErrorConfig,
  scenario: FBRScenarioConfig
}