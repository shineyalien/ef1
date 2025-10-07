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

/**
 * PRAL API Client for FBR Integration
 * Based on official PRAL API documentation v1.12
 */
export class PRALAPIClient {
  private axiosInstance: AxiosInstance
  private bearerToken: string
  private environment: 'sandbox' | 'production'

  constructor(credentials: PRALCredentials) {
    this.bearerToken = credentials.bearerToken
    this.environment = credentials.environment

    this.axiosInstance = axios.create({
      baseURL: PRAL_ENDPOINTS.BASE_URL,
      timeout: 30000,
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
        PRAL_ENDPOINTS.POST_INVOICE_SANDBOX,
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
        PRAL_ENDPOINTS.POST_INVOICE_PRODUCTION,
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
        PRAL_ENDPOINTS.VALIDATE_INVOICE_SANDBOX,
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
      ? PRAL_ENDPOINTS.POST_INVOICE_SANDBOX
      : PRAL_ENDPOINTS.POST_INVOICE_PRODUCTION
    
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
      const response = await this.makePublicRequest('GET', PRAL_ENDPOINTS.PROVINCES)
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
      const response = await this.makePublicRequest('GET', PRAL_ENDPOINTS.HS_CODES)
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
      const response = await this.makePublicRequest('GET', PRAL_ENDPOINTS.UNITS_OF_MEASUREMENT)
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
      const response = await this.makePublicRequest('GET', `${PRAL_ENDPOINTS.TAX_RATES}${query}`)
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
      const response = await this.makePublicRequest('GET', PRAL_ENDPOINTS.DOCUMENT_TYPES)
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
      const response = await this.makePublicRequest('GET', PRAL_ENDPOINTS.SRO_ITEMS)
      return response.data
    } catch (error) {
      throw this.convertToPRALError(error)
    }
  }

  /**
   * Parse FBR invoice number format
   */
  parseInvoiceNumber(fbrInvoiceNumber: string): {
    ntnPart: string
    timestamp: string
    sequence: string
  } {
    // Format: 7000007DI1747119701593
    // First 7: NTN part
    // Next part: Timestamp
    // Last 4: Sequence
    const ntnPart = fbrInvoiceNumber.substring(0, 7)
    const remaining = fbrInvoiceNumber.substring(7)
    
    // Find the last 4 digits for sequence
    const sequence = remaining.substring(remaining.length - 4)
    const timestamp = remaining.substring(0, remaining.length - 4)
    
    return { ntnPart, timestamp, sequence }
  }

  /**
   * Process FBR response and add metadata
   */
  private processResponse(response: AxiosResponse): PRALInvoiceResponse {
    const rawData = response.data
    
    // Normalize response to support both camelCase and PascalCase
    const fbrResponse: PRALInvoiceResponse = {
      // Core fields (try camelCase first, fallback to PascalCase)
      invoiceNumber: rawData.invoiceNumber || rawData.InvoiceNumber,
      dated: rawData.dated || rawData.Dated,
      
      // Validation response (normalize to camelCase)
      validationResponse: rawData.validationResponse || rawData.ValidationResponse ? {
        statusCode: rawData.validationResponse?.statusCode || rawData.ValidationResponse?.StatusCode,
        status: rawData.validationResponse?.status || rawData.ValidationResponse?.Status,
        error: rawData.validationResponse?.error || rawData.ValidationResponse?.Error,
        errorCode: rawData.validationResponse?.errorCode || rawData.ValidationResponse?.ErrorCode,
        invoiceStatuses: rawData.validationResponse?.invoiceStatuses || rawData.ValidationResponse?.InvoiceStatuses
      } : undefined,
      
      // Keep legacy PascalCase for backward compatibility
      ValidationResponse: rawData.ValidationResponse,
      
      // Metadata fields
      transmissionId: rawData.transmissionId || rawData.TransmissionId,
      TransmissionId: rawData.TransmissionId,
      acknowledgmentNumber: rawData.acknowledgmentNumber || rawData.AcknowledgmentNumber,
      AcknowledgmentNumber: rawData.AcknowledgmentNumber,
      fbrTimestamp: rawData.fbrTimestamp,
      
      // HTTP metadata
      httpStatusCode: response.status,
      responseHeaders: response.headers as Record<string, string>
    }

    return fbrResponse
  }

  /**
   * Make public API requests (no authentication)
   */
  private async makePublicRequest(method: 'GET' | 'POST', endpoint: string): Promise<AxiosResponse> {
    const publicAxios = axios.create({
      baseURL: PRAL_ENDPOINTS.BASE_URL,
      timeout: 30000
    })

    return publicAxios.request({
      method,
      url: endpoint
    })
  }

  /**
   * Handle axios errors
   */
  private handleError(error: any): Promise<never> {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const data = error.response.data

      throw new Error(`PRAL API Error ${status}: ${data?.message || error.message}`)
    } else if (error.request) {
      // Network error
      throw new Error('Network error: Unable to connect to FBR servers')
    } else {
      // Other error
      throw new Error(`Request error: ${error.message}`)
    }
  }

  /**
   * Convert error to PRALError format
   */
  private convertToPRALError(error: any): PRALError {
    if (error.response?.data?.validationResponse) {
      const validation = error.response.data.validationResponse
      return {
        statusCode: validation.statusCode || '01',
        errorCode: validation.errorCode,
        message: validation.error || error.message,
        field: validation.field
      }
    }

    return {
      statusCode: '01',
      message: error.message || 'Unknown error occurred'
    }
  }

  /**
   * Retry mechanism with exponential backoff
   */
  async retryWithBackoff<T>(
    operation: () => Promise<T>, 
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        if (attempt === maxRetries) {
          throw error
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1)
        await new Promise(resolve => setTimeout(resolve, delay))
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