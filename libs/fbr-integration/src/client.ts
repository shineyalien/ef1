import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  PRALCredentials,
  PRALInvoiceRequest,
  PRALInvoiceResponse,
  PRALInvoiceRequestPascal,
  PRALInvoiceItem,
  PRALInvoiceItemPascal,
  ProvinceData,
  HSCodeData,
  UOMData,
  TaxRateData,
  DocumentTypeData,
  SROItemData,
  PRALError,
  PRAL_ENDPOINTS,
  PRALHttpStatus
} from './types'
import { FBRConfig } from './config'

/**
 * PRAL API Client for FBR Integration
 * Based on official PRAL API documentation v1.12
 */
export class PRALAPIClient {
  private axiosInstance: AxiosInstance
  private bearerToken: string
  private environment: 'sandbox' | 'production'

  constructor(credentials?: PRALCredentials) {
    // Use provided credentials or fall back to config
    const configCredentials = credentials || FBRConfig.environment.credentials
    this.bearerToken = configCredentials.bearerToken
    this.environment = configCredentials.environment

    this.axiosInstance = axios.create({
      baseURL: FBRConfig.environment.endpoints.BASE_URL,
      timeout: FBRConfig.environment.request.timeout,
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'EasyFiler/1.0.0'
      }
    })

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    )
  }

  /**
   * Submit invoice to sandbox for testing/validation
   */
  async postInvoiceSandbox(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    try {
      // Convert to camelCase for production API
      const camelCaseInvoice = this.convertToCamelCase(invoice)
      const response = await this.axiosInstance.post(
        FBRConfig.environment.endpoints.POST_INVOICE_SANDBOX,
        camelCaseInvoice
      )
      return this.processResponse(response)
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Submit invoice to production
   */
  async postInvoiceProduction(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    try {
      // Convert to camelCase for production API
      const camelCaseInvoice = this.convertToCamelCase(invoice)
      const response = await this.axiosInstance.post(
        FBRConfig.environment.endpoints.POST_INVOICE_PRODUCTION,
        camelCaseInvoice
      )
      return this.processResponse(response)
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Validate invoice in sandbox (optional pre-check)
   */
  async validateInvoiceSandbox(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    if (this.environment !== 'sandbox') {
      throw new Error('Validation only available in sandbox environment')
    }

    try {
      // Convert to camelCase for production API
      const camelCaseInvoice = this.convertToCamelCase(invoice)
      const response = await this.axiosInstance.post(
        FBRConfig.environment.endpoints.VALIDATE_INVOICE_SANDBOX,
        camelCaseInvoice
      )
      return this.processResponse(response)
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Submit invoice with PascalCase format (legacy support)
   */
  async postInvoicePascal(invoice: PRALInvoiceRequestPascal): Promise<PRALInvoiceResponse> {
    const endpoint = this.environment === 'sandbox'
      ? FBRConfig.environment.endpoints.POST_INVOICE_SANDBOX
      : FBRConfig.environment.endpoints.POST_INVOICE_PRODUCTION
    
    try {
      const response = await this.axiosInstance.post(endpoint, invoice)
      return this.processResponse(response)
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Submit invoice with correct workflow based on environment
   */
  async submitInvoice(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    if (this.environment === 'sandbox') {
      // Sandbox workflow: optionally pre-validate, then submit
      try {
        const validation = await this.validateInvoiceSandbox(invoice)
        if (validation.validationResponse?.statusCode !== "00") {
          console.warn('Pre-validation failed, proceeding with direct submission:', validation.validationResponse?.error || 'Unknown validation error')
        }
      } catch (error) {
        console.warn('Pre-validation failed, proceeding with direct submission:', error)
      }
      
      // The actual validation happens when posting to sandbox
      return this.postInvoiceSandbox(invoice)
    } else {
      // Production workflow: direct submission to live system
      return this.postInvoiceProduction(invoice)
    }
  }

  /**
   * Get provinces (cached reference data)
   */
  async getProvinces(): Promise<ProvinceData[]> {
    try {
      const response = await this.makePublicRequest('GET', FBRConfig.environment.endpoints.PROVINCES)
      return response.data
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Get HS codes (cached reference data)
   */
  async getHSCodes(): Promise<HSCodeData[]> {
    try {
      const response = await this.makePublicRequest('GET', FBRConfig.environment.endpoints.HS_CODES)
      return response.data
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Get units of measurement (cached reference data)
   */
  async getUnitOfMeasurements(): Promise<UOMData[]> {
    try {
      const response = await this.makePublicRequest('GET', FBRConfig.environment.endpoints.UNITS_OF_MEASUREMENT)
      return response.data
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Get tax rates with query parameters
   */
  async getTaxRates(date: string, transTypeId: number, provinceId: number): Promise<TaxRateData[]> {
    try {
      const query = `?date=${date}&transTypeId=${transTypeId}&originationSupplier=${provinceId}`
      const response = await this.makePublicRequest('GET', `${FBRConfig.environment.endpoints.TAX_RATES}${query}`)
      return response.data
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Get document types
   */
  async getDocumentTypes(): Promise<DocumentTypeData[]> {
    try {
      const response = await this.makePublicRequest('GET', FBRConfig.environment.endpoints.DOCUMENT_TYPES)
      return response.data
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Get SRO items
   */
  async getSROItems(): Promise<SROItemData[]> {
    try {
      const response = await this.makePublicRequest('GET', FBRConfig.environment.endpoints.SRO_ITEMS)
      return response.data
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Parse FBR invoice number format with flexible parsing
   */
  parseInvoiceNumber(fbrInvoiceNumber: string): {
    ntnPart: string
    timestamp: string
    sequence: string
    formatType?: string
  } {
    // Validate input
    if (!fbrInvoiceNumber || typeof fbrInvoiceNumber !== 'string') {
      throw new Error('Invalid invoice number: must be a non-empty string')
    }

    // Try default pattern first
    const defaultPattern = FBRConfig.invoiceNumber.patterns.default
    if (fbrInvoiceNumber.length >= defaultPattern.minLength) {
      const ntnMatch = fbrInvoiceNumber.match(defaultPattern.prefixRegex)
      const sequenceMatch = fbrInvoiceNumber.match(defaultPattern.sequenceRegex)
      
      if (ntnMatch && sequenceMatch) {
        const ntnPart = ntnMatch[1]
        const sequence = sequenceMatch[1]
        if (!ntnPart || !sequence) {
          throw new Error(`Unable to parse invoice number: ${fbrInvoiceNumber}. Invalid format.`)
        }
        const startIndex = ntnPart.length
        const endIndex = fbrInvoiceNumber.length - sequence.length
        const timestamp = fbrInvoiceNumber.substring(startIndex, endIndex)
        
        return {
          ntnPart,
          timestamp,
          sequence,
          formatType: 'default'
        }
      }
    }

    // Try alternative patterns
    for (const pattern of FBRConfig.invoiceNumber.patterns.alternative) {
      if (fbrInvoiceNumber.length >= pattern.minLength) {
        const ntnMatch = fbrInvoiceNumber.match(pattern.prefixRegex)
        const sequenceMatch = fbrInvoiceNumber.match(pattern.sequenceRegex)
        
        if (ntnMatch && sequenceMatch) {
          const ntnPart = ntnMatch[1]
          const sequence = sequenceMatch[1]
          if (!ntnPart || !sequence) {
            throw new Error(`Unable to parse invoice number: ${fbrInvoiceNumber}. Invalid format.`)
          }
          const startIndex = ntnPart.length
          const endIndex = fbrInvoiceNumber.length - sequence.length
          const timestamp = fbrInvoiceNumber.substring(startIndex, endIndex)
          
          return {
            ntnPart,
            timestamp,
            sequence,
            formatType: pattern.name
          }
        }
      }
    }

    // If strict validation is not enabled, try a more flexible approach
    if (!FBRConfig.invoiceNumber.validation.strictValidation) {
      // Try to extract any 7 or 13 digit NTN from the beginning
      const flexibleNtnMatch = fbrInvoiceNumber.match(/^(\d{7}|\d{13})/)
      if (flexibleNtnMatch) {
        const ntnPart = flexibleNtnMatch[1]
        const remaining = fbrInvoiceNumber.substring(ntnPart.length)
        
        // Try to extract 4 digits from the end as sequence
        const flexibleSequenceMatch = remaining.match(/(\d{4})$/)
        if (flexibleSequenceMatch) {
          const sequence = flexibleSequenceMatch[1]
          const timestamp = remaining.substring(0, remaining.length - sequence.length)
          
          return {
            ntnPart,
            timestamp,
            sequence,
            formatType: 'flexible'
          }
        }
      }
    }

    // If all parsing attempts fail and unknown formats are allowed, return a best effort
    if (FBRConfig.invoiceNumber.validation.allowUnknownFormats) {
      return {
        ntnPart: fbrInvoiceNumber.substring(0, 7),
        timestamp: fbrInvoiceNumber.substring(7, fbrInvoiceNumber.length - 4),
        sequence: fbrInvoiceNumber.substring(fbrInvoiceNumber.length - 4),
        formatType: 'unknown'
      }
    }

    throw new Error(`Unable to parse invoice number: ${fbrInvoiceNumber}. Format not recognized.`)
  }

  /**
   * Process FBR response and add metadata with improved normalization
   */
  private processResponse(response: AxiosResponse): PRALInvoiceResponse {
    const rawData = response.data
    
    // Normalize to camelCase consistently
    const normalizedData = this.normalizeToCamelCase(rawData)
    
    // Build standardized response
    const fbrResponse: PRALInvoiceResponse = {
      // Core fields (camelCase only)
      invoiceNumber: normalizedData.invoiceNumber,
      dated: normalizedData.dated,
      
      // Validation response (camelCase only)
      validationResponse: normalizedData.validationResponse,
      
      // Metadata fields (camelCase only)
      transmissionId: normalizedData.transmissionId,
      acknowledgmentNumber: normalizedData.acknowledgmentNumber,
      fbrTimestamp: normalizedData.fbrTimestamp,
      
      // HTTP metadata
      httpStatusCode: response.status,
      responseHeaders: response.headers as Record<string, string>
    }

    // Include legacy PascalCase fields for backward compatibility if needed
    if (rawData.InvoiceNumber || rawData.ValidationResponse) {
      (fbrResponse as any).InvoiceNumber = rawData.InvoiceNumber
      (fbrResponse as any).ValidationResponse = rawData.ValidationResponse
      (fbrResponse as any).TransmissionId = rawData.TransmissionId
      (fbrResponse as any).AcknowledgmentNumber = rawData.AcknowledgmentNumber
    }

    return fbrResponse
  }

  /**
   * Normalize response data from PascalCase to camelCase
   */
  private normalizeToCamelCase(data: any): any {
    if (!data || typeof data !== 'object') {
      return data
    }

    const normalized: any = {}
    
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Convert PascalCase to camelCase
        const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1)
        
        if (Array.isArray(data[key])) {
          normalized[camelCaseKey] = data[key].map((item: any) =>
            typeof item === 'object' ? this.normalizeToCamelCase(item) : item
          )
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          normalized[camelCaseKey] = this.normalizeToCamelCase(data[key])
        } else {
          normalized[camelCaseKey] = data[key]
        }
      }
    }
    
    return normalized
  }

  /**
   * Make public API requests (no authentication)
   */
  private async makePublicRequest(method: 'GET' | 'POST', endpoint: string): Promise<AxiosResponse> {
    const publicAxios = axios.create({
      baseURL: FBRConfig.environment.endpoints.BASE_URL,
      timeout: FBRConfig.environment.request.timeout
    })

    return publicAxios.request({
      method,
      url: endpoint
    })
  }

  /**
   * Handle axios errors with improved context and detail
   */
  private handleError(error: any): Promise<never> {
    // Log error details if configured
    if (FBRConfig.error.logLevel === 'debug' || FBRConfig.error.logLevel === 'error') {
      console.error('FBR API Error Details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      })
    }

    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const data = error.response.data
      
      // Extract detailed error information
      let errorMessage = `PRAL API Error ${status}`
      let errorCode: string | undefined
      let field: string | undefined
      let itemIndex: number | undefined
      
      if (data) {
        // Handle validation response errors
        if (data.validationResponse) {
          const validation = data.validationResponse
          errorMessage += `: ${validation.error || validation.Error || 'Validation failed'}`
          errorCode = validation.errorCode || validation.ErrorCode
          
          // Check for item-level errors
          if (validation.invoiceStatuses && Array.isArray(validation.invoiceStatuses)) {
            const failedItem = validation.invoiceStatuses.find((item: any) =>
              item.statusCode === '01' || item.StatusCode === '01'
            )
            if (failedItem) {
              itemIndex = parseInt(failedItem.itemSNo || failedItem.ItemSNo || '0')
              field = `item_${itemIndex}`
              errorMessage += ` (Item ${itemIndex}: ${failedItem.error || failedItem.Error})`
            }
          }
        }
        // Handle direct error responses
        else if (data.message || data.Message) {
          errorMessage += `: ${data.message || data.Message}`
          errorCode = data.errorCode || data.ErrorCode
          field = data.field
        }
        // Handle other error formats
        else {
          errorMessage += `: ${JSON.stringify(data)}`
        }
      } else {
        errorMessage += `: ${error.message}`
      }

      const fbrError: PRALError = {
        statusCode: status === 401 ? '01' : (data?.validationResponse?.statusCode || '01'),
        message: errorMessage,
        errorCode,
        field,
        itemIndex
      }

      throw fbrError
    } else if (error.request) {
      // Network error
      const networkError: PRALError = {
        statusCode: '01',
        message: 'Network error: Unable to connect to FBR servers. Please check your internet connection.',
        errorCode: 'NETWORK_ERROR'
      }
      throw networkError
    } else {
      // Other error (request configuration, etc.)
      const configError: PRALError = {
        statusCode: '01',
        message: `Request configuration error: ${error.message}`,
        errorCode: 'CONFIG_ERROR'
      }
      throw configError
    }
  }

  /**
   * Convert error to PRALError format with enhanced details
   */
  private convertToPRALError(error: any): PRALError {
    // If it's already a PRALError, return as-is
    if (error.statusCode && error.message) {
      return error as PRALError
    }

    // Handle axios errors with response
    if (error.response?.data) {
      const data = error.response.data
      
      // Handle validation response errors
      if (data.validationResponse) {
        const validation = data.validationResponse
        const fbrError: PRALError = {
          statusCode: validation.statusCode || validation.StatusCode || '01',
          errorCode: validation.errorCode || validation.ErrorCode,
          message: validation.error || validation.Error || 'Validation failed',
          field: validation.field
        }
        
        // Check for item-level errors
        if (validation.invoiceStatuses && Array.isArray(validation.invoiceStatuses)) {
          const failedItem = validation.invoiceStatuses.find((item: any) =>
            item.statusCode === '01' || item.StatusCode === '01'
          )
          if (failedItem) {
            fbrError.itemIndex = parseInt(failedItem.itemSNo || failedItem.ItemSNo || '0')
            fbrError.field = fbrError.field || `item_${fbrError.itemIndex}`
            fbrError.message += ` (Item ${fbrError.itemIndex}: ${failedItem.error || failedItem.Error})`
          }
        }
        
        return fbrError
      }
      
      // Handle direct error responses
      return {
        statusCode: '01',
        errorCode: data.errorCode || data.ErrorCode,
        message: data.message || data.Message || error.message,
        field: data.field
      }
    }

    // Handle network or other errors
    return {
      statusCode: '01',
      message: error.message || 'Unknown error occurred',
      errorCode: error.code === 'ECONNABORTED' ? 'TIMEOUT' :
                 error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' ? 'NETWORK_ERROR' :
                 'UNKNOWN_ERROR'
    }
  }

  /**
   * Retry mechanism with configurable exponential backoff
   */
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries?: number,
    baseDelay?: number
  ): Promise<T> {
    if (!FBRConfig.error.retry.enabled) {
      return operation()
    }

    const retries = maxRetries || FBRConfig.error.retry.maxAttempts
    const delay = baseDelay || FBRConfig.error.retry.baseDelay
    let lastError: any

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        // Don't retry on authentication errors or client errors (4xx)
        if ((error as any).statusCode &&
            ((error as any).statusCode === '401' ||
             ((error as any).statusCode >= 400 && (error as any).statusCode < 500))) {
          throw error
        }
        
        if (attempt === retries) {
          // Add retry information to the error
          if (lastError.message) {
            lastError.message = `${lastError.message} (Failed after ${retries} retries)`
          }
          throw lastError
        }

        // Calculate delay with exponential backoff and jitter
        const exponentialDelay = Math.min(
          delay * Math.pow(FBRConfig.error.retry.backoffMultiplier, attempt - 1),
          FBRConfig.error.retry.maxDelay
        )
        
        // Add jitter to prevent thundering herd
        const jitter = Math.random() * 0.3 * exponentialDelay
        const finalDelay = exponentialDelay + jitter
        
        if (FBRConfig.error.logLevel === 'debug') {
          console.log(`Retrying operation after ${finalDelay}ms (attempt ${attempt}/${retries})`)
        }
        
        await new Promise(resolve => setTimeout(resolve, finalDelay))
      }
    }

    throw lastError
  }

  /**
   * Convert PascalCase invoice to camelCase for production API
   */
  private convertToCamelCase(invoice: PRALInvoiceRequest): any {
    return {
      invoiceType: invoice.invoiceType,
      invoiceDate: invoice.invoiceDate,
      sellerNTNCNIC: invoice.sellerNTNCNIC,
      sellerBusinessName: invoice.sellerBusinessName,
      sellerProvince: invoice.sellerProvince,
      sellerAddress: invoice.sellerAddress,
      buyerNTNCNIC: invoice.buyerNTNCNIC,
      buyerBusinessName: invoice.buyerBusinessName,
      buyerProvince: invoice.buyerProvince,
      buyerAddress: invoice.buyerAddress,
      buyerRegistrationType: invoice.buyerRegistrationType,
      invoiceRefNo: invoice.invoiceRefNo,
      scenarioId: invoice.scenarioId,
      items: invoice.items.map(item => ({
        hsCode: item.hsCode,
        productDescription: item.productDescription,
        rate: item.rate,
        uoM: item.uoM,
        quantity: item.quantity,
        totalValues: item.totalValues,
        valueSalesExcludingST: item.valueSalesExcludingST,
        fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice,
        salesTaxApplicable: item.salesTaxApplicable,
        salesTaxWithheldAtSource: item.salesTaxWithheldAtSource,
        extraTax: item.extraTax,
        furtherTax: item.furtherTax,
        sroScheduleNo: item.sroScheduleNo,
        fedPayable: item.fedPayable,
        discount: item.discount,
        saleType: item.saleType,
        sroItemSerialNo: item.sroItemSerialNo
      }))
    }
  }

  /**
   * Convert PascalCase item to camelCase
   */
  private convertItemToCamelCase(item: PRALInvoiceItemPascal): PRALInvoiceItem {
    return {
      hsCode: item.HSCode,
      productDescription: item.ProductDescription,
      rate: item.Rate,
      uoM: item.UOM,
      quantity: item.Quantity,
      totalValues: item.TotalValues,
      valueSalesExcludingST: item.ValueSalesExcludingST,
      fixedNotifiedValueOrRetailPrice: item.FixedNotifiedValueOrRetailPrice,
      salesTaxApplicable: item.SalesTaxApplicable,
      salesTaxWithheldAtSource: item.SalesTaxWithheldAtSource,
      extraTax: item.ExtraTax,
      furtherTax: item.FurtherTax,
      sroScheduleNo: item.SROScheduleNo,
      fedPayable: item.FEDPayable,
      discount: item.Discount,
      saleType: item.SaleType,
      sroItemSerialNo: item.SROItemSerialNo
    }
  }
}