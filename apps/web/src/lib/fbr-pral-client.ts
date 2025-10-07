/**
 * FBR PRAL API Integration Service
 * Based on Technical Documentation for DI (Digital Invoicing) APIs v1.12
 * 
 * This service handles actual communication with FBR's PRAL system
 * Supports both Sandbox and Production environments
 */

interface PRALConfig {
  environment: 'sandbox' | 'production'
  bearerToken: string
  baseURL?: string
}

interface PRALInvoiceRequest {
  // Invoice Type
  InvoiceType: string // "Sale Invoice", "Debit Note", "Credit Note"
  
  // Seller Information
  SellerNTNCNIC: string // 7 or 13 digit
  SellerBusinessName: string
  SellerProvince: string
  SellerAddress: string
  
  // Buyer Information
  BuyerNTNCNIC?: string // Optional for unregistered buyers
  BuyerBusinessName: string
  BuyerProvince: string
  BuyerAddress: string
  BuyerRegistrationType: 'Registered' | 'Unregistered'
  
  // Invoice Details
  InvoiceDate: string // Format: "YYYY-MM-DD"
  InvoiceRefNo?: string // Required for Debit/Credit Notes (22 or 28 digits)
  ScenarioId?: string // Required for sandbox testing
  
  // Line Items
  Items: PRALInvoiceItem[]
}

interface PRALInvoiceItem {
  HSCode: string
  ProductDescription: string
  Rate: string // e.g., "18%"
  UOM: string // Unit of Measurement
  Quantity: number
  ValueSalesExcludingST: number // Value excluding sales tax
  SalesTaxApplicable: number // Sales tax amount
  TotalValues: number // Total including all taxes
  FixedNotifiedValueOrRetailPrice: number
  SalesTaxWithheldAtSource: number
  ExtraTax?: number
  FurtherTax?: number
  SROScheduleNo?: string
  FEDPayable?: number // Federal Excise Duty
  Discount?: number
  SaleType: string
  SROItemSerialNo?: string
}

interface PRALInvoiceResponse {
  // Success response
  InvoiceNumber?: string // FBR-issued IRN (Invoice Reference Number)
  Dated?: string // FBR timestamp
  
  // Validation Response
  ValidationResponse: {
    StatusCode: '00' | '01' // 00 = Success, 01 = Failed
    Status: 'Valid' | 'Invalid' | 'Success' | 'Failed'
    Error?: string
    ErrorCode?: string
    
    // For multi-item invoices
    InvoiceStatuses?: Array<{
      ItemSNo: string
      StatusCode: '00' | '01'
      Status: 'Valid' | 'Invalid'
      InvoiceNo?: string
      ErrorCode?: string
      Error?: string
    }>
  }
  
  // Additional metadata
  TransmissionId?: string
  AcknowledgmentNumber?: string
}

interface PRALLookupResponse<T> {
  success: boolean
  data: T[]
  error?: string
}

/**
 * Main PRAL API Client
 */
export class PRALAPIClient {
  private config: PRALConfig
  private baseURL: string
  
  constructor(config: PRALConfig) {
    this.config = config
    this.baseURL = config.baseURL || 'https://gw.fbr.gov.pk'
  }
  
  /**
   * Submit invoice to FBR (Sandbox or Production)
   */
  async postInvoice(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    const endpoint = this.config.environment === 'sandbox'
      ? '/di_data/v1/di/postinvoicedata_sb'
      : '/di_data/v1/di/postinvoicedata'
    
    console.log(`📤 Submitting invoice to FBR ${this.config.environment}:`, {
      endpoint,
      invoiceType: invoice.InvoiceType,
      seller: invoice.SellerBusinessName,
      buyer: invoice.BuyerBusinessName,
      itemCount: invoice.Items.length
    })
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoice)
      })
      
      if (!response.ok) {
        throw new Error(`FBR API Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json() as PRALInvoiceResponse
      
      console.log(`✅ FBR Response:`, {
        statusCode: data.ValidationResponse.StatusCode,
        status: data.ValidationResponse.Status,
        invoiceNumber: data.InvoiceNumber,
        error: data.ValidationResponse.Error
      })
      
      return data
      
    } catch (error) {
      console.error('❌ FBR API Request Failed:', error)
      throw error
    }
  }
  
  /**
   * Validate invoice (Sandbox only - for testing before submission)
   */
  async validateInvoice(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    if (this.config.environment !== 'sandbox') {
      throw new Error('Validation endpoint only available in sandbox environment')
    }
    
    const endpoint = '/di_data/v1/di/validateinvoicedata_sb'
    
    console.log(`🔍 Validating invoice in sandbox...`)
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoice)
      })
      
      if (!response.ok) {
        throw new Error(`FBR Validation Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json() as PRALInvoiceResponse
      
      console.log(`✅ Validation Response:`, {
        statusCode: data.ValidationResponse.StatusCode,
        status: data.ValidationResponse.Status
      })
      
      return data
      
    } catch (error) {
      console.error('❌ FBR Validation Failed:', error)
      throw error
    }
  }
  
  /**
   * Get FBR Lookup Data (Provinces, HS Codes, etc.)
   * NOTE: These endpoints DO require Bearer Token authentication
   */
  async getLookupData<T>(lookupType: string): Promise<PRALLookupResponse<T>> {
    const lookupEndpoints: Record<string, string> = {
      'provinces': '/pdi/v1/provinces',
      'documentTypes': '/pdi/v1/doctypecode',
      'hsCodes': '/pdi/v1/itemdesccode',
      'sroItems': '/pdi/v1/sroitemcode',
      'transactionTypes': '/pdi/v1/transtypecode',
      'uom': '/pdi/v1/uom'
    }
    
    const endpoint = lookupEndpoints[lookupType]
    if (!endpoint) {
      throw new Error(`Unknown lookup type: ${lookupType}`)
    }
    
    console.log(`📋 Fetching ${lookupType} from FBR with Bearer Token...`)
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`FBR API Error Response:`, errorText)
        throw new Error(`FBR Lookup Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      console.log(`✅ Retrieved ${lookupType}:`, data.length || 0, 'records')
      
      return {
        success: true,
        data: data
      }
      
    } catch (error) {
      console.error(`❌ Failed to fetch ${lookupType}:`, error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  /**
   * Get Tax Rates (with query parameters)
   * NOTE: Requires Bearer Token authentication
   */
  async getTaxRates(params: {
    date: string // Format: DD-MMM-YYYY (e.g., "24-Feb-2024")
    transTypeId: number
    originationSupplier: number // Province ID
  }): Promise<PRALLookupResponse<any>> {
    const endpoint = '/pdi/v2/SaleTypeToRate'
    const queryString = new URLSearchParams({
      date: params.date,
      transTypeId: params.transTypeId.toString(),
      originationSupplier: params.originationSupplier.toString()
    }).toString()
    
    console.log(`📋 Fetching tax rates from FBR with Bearer Token:`, params)
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}?${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`FBR API Error Response:`, errorText)
        throw new Error(`FBR Tax Rates Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      console.log(`✅ Retrieved tax rates:`, data.length || 0, 'records')
      
      return {
        success: true,
        data: data
      }
      
    } catch (error) {
      console.error(`❌ Failed to fetch tax rates:`, error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  /**
   * Get SRO Schedule (with query parameters)
   * NOTE: Requires Bearer Token authentication
   * URL: https://gw.fbr.gov.pk/pdi/v1/SroSchedule?rate_id=413&date=04-Feb-2024&origination_supplier_csv=1
   */
  async getSROSchedule(params: {
    rateId: number
    date: string // Format: DD-MMM-YYYY
    originationSupplier: number
  }): Promise<PRALLookupResponse<any>> {
    const endpoint = '/pdi/v1/SroSchedule'
    const queryString = new URLSearchParams({
      rate_id: params.rateId.toString(),
      date: params.date,
      origination_supplier_csv: params.originationSupplier.toString()
    }).toString()
    
    console.log(`📋 Fetching SRO Schedule from FBR with Bearer Token:`, params)
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}?${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`FBR API Error Response:`, errorText)
        throw new Error(`FBR SRO Schedule Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      console.log(`✅ Retrieved SRO Schedule:`, data.length || 0, 'records')
      
      return {
        success: true,
        data: data
      }
      
    } catch (error) {
      console.error(`❌ Failed to fetch SRO schedule:`, error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get HS Code with UOM
   * NOTE: Requires Bearer Token authentication
   * URL: https://gw.fbr.gov.pk/pdi/v2/HS_UOM?hs_code=5904.9000&annexure_id=3
   */
  async getHSCodeWithUOM(params: {
    hsCode: string
    annexureId: number
  }): Promise<PRALLookupResponse<any>> {
    const endpoint = '/pdi/v2/HS_UOM'
    const queryString = new URLSearchParams({
      hs_code: params.hsCode,
      annexure_id: params.annexureId.toString()
    }).toString()
    
    console.log(`📋 Fetching HS Code UOM from FBR with Bearer Token:`, params)
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}?${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`FBR API Error Response:`, errorText)
        throw new Error(`FBR HS UOM Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      console.log(`✅ Retrieved HS Code UOM:`, data.length || 0, 'records')
      
      return {
        success: true,
        data: data
      }
      
    } catch (error) {
      console.error(`❌ Failed to fetch HS Code UOM:`, error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get SRO Item by Date and SRO ID
   * NOTE: Requires Bearer Token authentication
   * URL: https://gw.fbr.gov.pk/pdi/v2/SROItem?date=2025-03-25&sro_id=389
   */
  async getSROItem(params: {
    date: string // Format: YYYY-MM-DD
    sroId: number
  }): Promise<PRALLookupResponse<any>> {
    const endpoint = '/pdi/v2/SROItem'
    const queryString = new URLSearchParams({
      date: params.date,
      sro_id: params.sroId.toString()
    }).toString()
    
    console.log(`📋 Fetching SRO Item from FBR with Bearer Token:`, params)
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}?${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`FBR API Error Response:`, errorText)
        throw new Error(`FBR SRO Item Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      console.log(`✅ Retrieved SRO Items:`, data.length || 0, 'records')
      
      return {
        success: true,
        data: data
      }
      
    } catch (error) {
      console.error(`❌ Failed to fetch SRO Items:`, error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Check STATL (Sales Tax Active Taxpayers List)
   * NOTE: Requires Bearer Token authentication
   * URL: https://gw.fbr.gov.pk/dist/v1/statl
   */
  async checkSTATL(params: {
    regno: string
    date: string // Format: YYYY-MM-DD
  }): Promise<{ statusCode: string; status: string }> {
    const endpoint = '/dist/v1/statl'
    
    console.log(`🔍 Checking STATL status for:`, params.regno)
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`FBR API Error Response:`, errorText)
        throw new Error(`FBR STATL Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      console.log(`✅ STATL Status:`, data)
      
      return data
      
    } catch (error) {
      console.error(`❌ Failed to check STATL:`, error)
      throw error
    }
  }

  /**
   * Get Registration Type
   * NOTE: Requires Bearer Token authentication
   * URL: https://gw.fbr.gov.pk/dist/v1/Get_Reg_Type
   */
  async getRegistrationType(registrationNo: string): Promise<{
    statuscode: string
    REGISTRATION_NO: string
    REGISTRATION_TYPE: string
  }> {
    const endpoint = '/dist/v1/Get_Reg_Type'
    
    console.log(`🔍 Checking registration type for:`, registrationNo)
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Registration_No: registrationNo })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`FBR API Error Response:`, errorText)
        throw new Error(`FBR Registration Type Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      console.log(`✅ Registration Type:`, data)
      
      return data
      
    } catch (error) {
      console.error(`❌ Failed to get registration type:`, error)
      throw error
    }
  }
}

/**
 * Helper function to format invoice data for PRAL API
 */
export function formatInvoiceForPRAL(invoice: any, business: any, customer: any): PRALInvoiceRequest {
  return {
    InvoiceType: invoice.documentType || 'Sale Invoice',
    
    // Seller
    SellerNTNCNIC: business.ntnNumber,
    SellerBusinessName: business.companyName,
    SellerProvince: business.province,
    SellerAddress: business.address,
    
    // Buyer
    BuyerNTNCNIC: customer?.buyerNTN || customer?.buyerCNIC || customer?.buyerPassport || undefined,
    BuyerBusinessName: customer?.name || 'General Public',
    BuyerProvince: customer?.buyerProvince || customer?.address?.split(',').pop()?.trim() || 'Punjab',
    BuyerAddress: customer?.buyerAddress || customer?.address || 'N/A',
    BuyerRegistrationType: customer?.registrationType === 'REGISTERED' ? 'Registered' : 'Unregistered',
    
    // Invoice Details
    InvoiceDate: invoice.invoiceDate.toISOString().split('T')[0],
    InvoiceRefNo: invoice.referenceInvoiceNo,
    ScenarioId: invoice.scenarioId,
    
    // Items
    Items: invoice.items.map((item: any, index: number) => ({
      HSCode: item.hsCode,
      ProductDescription: item.description,
      Rate: `${item.taxRate}%`,
      UOM: item.unitOfMeasurement,
      Quantity: item.quantity,
      ValueSalesExcludingST: item.valueSalesExcludingST,
      SalesTaxApplicable: item.salesTaxApplicable,
      TotalValues: item.totalValue,
      FixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice || 0,
      SalesTaxWithheldAtSource: item.salesTaxWithheldAtSource || 0,
      ExtraTax: item.extraTax || 0,
      FurtherTax: item.furtherTax || 0,
      SROScheduleNo: item.sroScheduleNo,
      FEDPayable: item.fedPayable || 0,
      Discount: item.discount || 0,
      SaleType: item.fbrSaleType || 'GSR',
      SROItemSerialNo: item.sroItemSerialNo
    }))
  }
}

/**
 * Export types for use in other files
 */
export type {
  PRALConfig,
  PRALInvoiceRequest,
  PRALInvoiceItem,
  PRALInvoiceResponse,
  PRALLookupResponse
}