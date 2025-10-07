// FBR PRAL API Integration Service
// Based on official PRAL API documentation v1.12

export interface PRALInvoiceRequest {
  invoiceType: 'Sale Invoice' | 'Debit Note'
  invoiceDate: string // YYYY-MM-DD format
  sellerNTNCNIC: string
  sellerBusinessName: string
  sellerProvince: string
  sellerAddress: string
  buyerNTNCNIC?: string
  buyerBusinessName: string
  buyerProvince: string
  buyerAddress: string
  buyerRegistrationType: 'Registered' | 'Unregistered'
  invoiceRefNo?: string // Required for debit notes
  scenarioId?: string // Required for sandbox
  items: PRALInvoiceItem[]
}

export interface PRALInvoiceItem {
  hsCode: string
  productDescription: string
  rate: string // "18%"
  uoM: string
  quantity: number
  totalValues: number
  valueSalesExcludingST: number
  fixedNotifiedValueOrRetailPrice: number
  salesTaxApplicable: number
  salesTaxWithheldAtSource: number
  extraTax?: number
  furtherTax?: number
  sroScheduleNo?: string
  fedPayable?: number
  discount?: number
  saleType: string
  sroItemSerialNo?: string
}

export interface PRALInvoiceResponse {
  invoiceNumber?: string // FBR-generated IRN
  dated: string
  validationResponse: {
    statusCode: '00' | '01' // 00 = Success, 01 = Failed
    status: 'Valid' | 'Invalid' | 'Success' | 'Failed'
    error?: string
    errorCode?: string
    invoiceStatuses?: Array<{
      itemSNo: string
      statusCode: '00' | '01'
      status: 'Valid' | 'Invalid'
      invoiceNo?: string
      errorCode?: string
      error?: string
    }>
  }
  transmissionId?: string
  acknowledgmentNumber?: string
  fbrTimestamp?: string
  httpStatusCode?: number
  responseHeaders?: Record<string, string>
}

export interface ProvinceData {
  stateProvinceCode: number
  stateProvinceDesc: string
}

export interface HSCodeData {
  hS_CODE: string
  description: string
}

export interface UOMData {
  uoM_ID: number
  description: string
}

export interface TaxRateData {
  ratE_ID: number
  ratE_DESC: string
  ratE_VALUE: number
}

export class PRALAPIClient {
  private baseURL = 'https://gw.fbr.gov.pk'
  private bearerToken: string
  private environment: 'sandbox' | 'production'

  constructor(token: string, env: 'sandbox' | 'production' = 'sandbox') {
    this.bearerToken = token
    this.environment = env
  }

  // Validate invoice before submission (sandbox only)
  async validateInvoice(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    if (this.environment !== 'sandbox') {
      throw new Error('Validation only available in sandbox environment')
    }
    const endpoint = '/di_data/v1/di/validateinvoicedata_sb'
    return this.makeAuthenticatedRequest('POST', endpoint, invoice)
  }

  // Submit invoice to sandbox for testing
  async postInvoiceSandbox(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    const endpoint = '/di_data/v1/di/postinvoicedata_sb'
    return this.makeAuthenticatedRequest('POST', endpoint, invoice)
  }

  // Submit invoice to production
  async postInvoiceProduction(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    const endpoint = '/di_data/v1/di/postinvoicedata'
    return this.makeAuthenticatedRequest('POST', endpoint, invoice)
  }

  // Main invoice submission method
  async submitInvoice(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    if (this.environment === 'sandbox') {
      // Optional pre-validation
      try {
        const validation = await this.validateInvoice(invoice)
        if (validation.validationResponse.statusCode !== "00") {
          console.warn('Pre-validation failed, proceeding with direct submission:', validation.validationResponse.error)
        }
      } catch (error) {
        console.warn('Pre-validation failed, proceeding with direct submission:', error)
      }
      
      // Submit to sandbox
      return this.postInvoiceSandbox(invoice)
    } else {
      // Submit to production
      return this.postInvoiceProduction(invoice)
    }
  }

  // Get reference data (public endpoints)
  async getProvinces(): Promise<ProvinceData[]> {
    return this.makePublicRequest('GET', '/pdi/v1/provinces')
  }

  async getHSCodes(): Promise<HSCodeData[]> {
    return this.makePublicRequest('GET', '/pdi/v1/itemdesccode')
  }

  async getUnitOfMeasurements(): Promise<UOMData[]> {
    return this.makePublicRequest('GET', '/pdi/v1/uom')
  }

  async getTaxRates(date: string, transTypeId: number, provinceId: number): Promise<TaxRateData[]> {
    const query = `?date=${date}&transTypeId=${transTypeId}&originationSupplier=${provinceId}`
    return this.makePublicRequest('GET', `/pdi/v2/SaleTypeToRate${query}`)
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      // Try to get provinces (public endpoint)
      await this.getProvinces()
      return true
    } catch (error) {
      return false
    }
  }

  private async makeAuthenticatedRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    })

    if (!response.ok) {
      throw new Error(`PRAL API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  private async makePublicRequest(method: string, endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, { method })

    if (!response.ok) {
      throw new Error(`PRAL API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

// QR Code Generator using FBR IRN
export class QRCodeGenerator {
  static generateQRCodeFromIRN(irn: string, metadata: {
    sellerNTN: string
    invoiceDate: string
    totalAmount: number
    buyerNTN?: string
  }): string {
    // Build QR content with FBR IRN as core data
    const qrContent = {
      invoiceNumber: irn, // FBR-provided Invoice Reference Number
      sellerNTN: metadata.sellerNTN,
      invoiceDate: metadata.invoiceDate,
      totalAmount: metadata.totalAmount,
      buyerNTN: metadata.buyerNTN || null,
      timestamp: new Date().toISOString()
    }
    
    // For now, return JSON string - in production, use actual QR code library
    return JSON.stringify(qrContent)
  }

  static validateQRCode(qrContent: string): boolean {
    try {
      const parsed = JSON.parse(qrContent)
      return parsed.invoiceNumber && parsed.sellerNTN && parsed.invoiceDate && parsed.totalAmount
    } catch {
      return false
    }
  }
}

// Invoice data transformer
export class InvoiceTransformer {
  static transformToPRALFormat(invoice: any, business: any): PRALInvoiceRequest {
    return {
      invoiceType: invoice.invoiceType || 'Sale Invoice',
      invoiceDate: invoice.invoiceDate,
      sellerNTNCNIC: business.ntnNumber,
      sellerBusinessName: business.companyName,
      sellerProvince: business.province,
      sellerAddress: business.address,
      buyerNTNCNIC: invoice.customer?.ntnNumber,
      buyerBusinessName: invoice.customer?.name || 'Walk-in Customer',
      buyerProvince: invoice.customer?.province || business.province,
      buyerAddress: invoice.customer?.address || 'N/A',
      buyerRegistrationType: invoice.customer?.registrationType === 'REGISTERED' ? 'Registered' : 'Unregistered',
      invoiceRefNo: invoice.invoiceRefNo || '', // Required field - empty for regular invoices
      scenarioId: business.defaultScenario || undefined, // Use business default scenario
      items: invoice.items.map((item: any) => ({
        hsCode: item.hsCode || '9999.99.99',
        productDescription: item.description,
        rate: `${item.taxRate}%`,
        uoM: item.unitOfMeasurement, // FBR expects "uoM" (camelCase)
        quantity: parseFloat(item.quantity.toFixed(4)), // Format to 4 decimal places
        valueSalesExcludingST: item.quantity * item.unitPrice,
        salesTaxApplicable: item.taxAmount || (item.quantity * item.unitPrice * item.taxRate / 100),
        totalValues: item.totalValue || (item.quantity * item.unitPrice + (item.taxAmount || (item.quantity * item.unitPrice * item.taxRate / 100))),
        fixedNotifiedValueOrRetailPrice: item.unitPrice || 0,
        salesTaxWithheldAtSource: item.salesTaxWithheldAtSource || 0,
        extraTax: item.extraTax || 0,
        furtherTax: item.furtherTax || 0,
        fedPayable: item.fedPayable || 0,
        discount: item.discount || 0,
        saleType: item.saleType || 'Goods at standard rate (default)', // Use proper FBR sale type description
        sroScheduleNo: item.sroScheduleNo || undefined,
        sroItemSerialNo: item.sroItemSerialNo || undefined
      }))
    }
  }
}

// Mock FBR service for local development
export class MockFBRService {
  static async submitInvoice(invoice: any): Promise<PRALInvoiceResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate mock IRN
    const mockIRN = `7000007DI${Date.now()}`

    return {
      invoiceNumber: mockIRN,
      dated: new Date().toISOString(),
      validationResponse: {
        statusCode: '00',
        status: 'Success'
      },
      transmissionId: `TX${Date.now()}`,
      acknowledgmentNumber: `ACK${Date.now()}`,
      fbrTimestamp: new Date().toISOString()
    }
  }

  static async validateInvoice(invoice: any): Promise<boolean> {
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 500))
    return true
  }

  static async testConnection(): Promise<boolean> {
    return true
  }
}

// Main FBR service factory
export class FBRServiceFactory {
  static create(environment: 'local' | 'sandbox' | 'production', token?: string) {
    switch (environment) {
      case 'local':
        return MockFBRService
      case 'sandbox':
        return new PRALAPIClient(token || '', 'sandbox')
      case 'production':
        return new PRALAPIClient(token || '', 'production')
      default:
        return MockFBRService
    }
  }
}