import QRCode from 'qrcode'
import { QRCodeData } from './types'
import { FBRConfig } from './config'

/**
 * QR Code Generator for FBR-compliant invoices
 * Generates QR codes using FBR-provided IRN (Invoice Reference Number)
 */
export class QRCodeGenerator {
  /**
   * Generate QR code using FBR-provided IRN
   */
  static async generateQRCodeFromIRN(
    irn: string,
    invoiceData: {
      sellerNTN: string
      invoiceDate: string
      totalAmount: number
      buyerNTN?: string
    },
    options?: {
      format?: 'svg' | 'png' | 'dataURL'
      size?: number
      margin?: number
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    }
  ): Promise<string> {
    // Validate inputs
    if (!irn || typeof irn !== 'string') {
      throw new Error('Invoice Reference Number (IRN) is required and must be a string')
    }
    
    if (!invoiceData || typeof invoiceData !== 'object') {
      throw new Error('Invoice data is required and must be an object')
    }
    
    if (!invoiceData.sellerNTN || !invoiceData.invoiceDate || !invoiceData.totalAmount) {
      throw new Error('Seller NTN, invoice date, and total amount are required')
    }
    
    if (invoiceData.totalAmount <= 0) {
      throw new Error('Total amount must be positive')
    }
    
    const qrContent = this.buildQRContent(irn, invoiceData)
    
    try {
      // Use configured options or defaults
      const format = options?.format || 'svg'
      const size = options?.size || FBRConfig.qr.size
      const margin = options?.margin || FBRConfig.qr.margin
      const errorCorrectionLevel = options?.errorCorrectionLevel || FBRConfig.qr.errorCorrectionLevel
      
      // Generate QR code
      let qrCodeResult: string
      
      if (format === 'png') {
        // Generate PNG as buffer, then convert to base64
        const buffer = await QRCode.toBuffer(JSON.stringify(qrContent), {
          width: size,
          margin: margin,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: errorCorrectionLevel
        })
        qrCodeResult = `data:image/png;base64,${buffer.toString('base64')}`
      } else if (format === 'dataURL') {
        // Generate data URL
        qrCodeResult = await QRCode.toDataURL(JSON.stringify(qrContent), {
          width: size,
          margin: margin,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: errorCorrectionLevel
        })
      } else {
        // Generate SVG
        qrCodeResult = await QRCode.toString(JSON.stringify(qrContent), {
          type: 'svg',
          width: size,
          margin: margin,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: errorCorrectionLevel
        })
      }
      
      return qrCodeResult
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`)
    }
  }

  /**
   * Generate QR code as base64 data URL
   */
  static async generateQRCodeAsDataURL(
    irn: string,
    invoiceData: {
      sellerNTN: string
      invoiceDate: string
      totalAmount: number
      buyerNTN?: string
    },
    options?: {
      size?: number
      margin?: number
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    }
  ): Promise<string> {
    return this.generateQRCodeFromIRN(irn, invoiceData, {
      ...options,
      format: 'dataURL'
    })
  }

  /**
   * Build QR code content structure based on FBR requirements
   */
  private static buildQRContent(
    irn: string,
    metadata: {
      sellerNTN: string
      invoiceDate: string
      totalAmount: number
      buyerNTN?: string
    }
  ): QRCodeData {
    return {
      invoiceNumber: irn, // FBR-provided Invoice Reference Number
      sellerNTN: metadata.sellerNTN,
      invoiceDate: metadata.invoiceDate,
      totalAmount: metadata.totalAmount,
      buyerNTN: metadata.buyerNTN || undefined,
      timestamp: new Date().toISOString()
    }
  }
  
  /**
   * Build flexible QR content with additional optional fields
   */
  private static buildFlexibleQRContent(
    irn: string,
    metadata: {
      sellerNTN: string
      invoiceDate: string
      totalAmount: number
      buyerNTN?: string
      [key: string]: any
    }
  ): any {
    // Base content
    const qrContent: any = {
      invoiceNumber: irn,
      sellerNTN: metadata.sellerNTN,
      invoiceDate: metadata.invoiceDate,
      totalAmount: metadata.totalAmount,
      timestamp: new Date().toISOString()
    }
    
    // Add optional buyer NTN if provided
    if (metadata.buyerNTN) {
      qrContent.buyerNTN = metadata.buyerNTN
    }
    
    // Add any additional fields from metadata
    Object.keys(metadata).forEach(key => {
      if (!['sellerNTN', 'invoiceDate', 'totalAmount', 'buyerNTN'].includes(key)) {
        qrContent[key] = metadata[key]
      }
    })
    
    return qrContent
  }

  /**
   * Validate QR code content format
   */
  static validateQRCode(qrContent: string, options?: {
    strict?: boolean
    allowPartialFields?: boolean
    minInvoiceNumberLength?: number
  }): boolean {
    try {
      // Use configured options or defaults
      const isStrict = options?.strict !== undefined ? options.strict : FBRConfig.qr.validation.strict
      const allowPartial = options?.allowPartialFields !== undefined ?
        options.allowPartialFields : FBRConfig.qr.validation.allowPartialFields
      const minLength = options?.minInvoiceNumberLength ||
        FBRConfig.qr.validation.minInvoiceNumberLength
      
      const parsed = JSON.parse(qrContent)
      
      // Define required fields based on validation mode
      const requiredFields = ['invoiceNumber', 'sellerNTN', 'invoiceDate', 'totalAmount']
      if (!allowPartial) {
        requiredFields.push('timestamp')
      }
      
      // Check required fields
      for (const field of requiredFields) {
        if (!(field in parsed) || parsed[field] === null || parsed[field] === undefined) {
          if (isStrict || !allowPartial) {
            return false
          }
        }
      }

      // Validate invoice number format (flexible check)
      if (parsed.invoiceNumber) {
        if (typeof parsed.invoiceNumber !== 'string') {
          return false
        }
        
        if (isStrict && parsed.invoiceNumber.length < minLength) {
          return false
        }
        
        // Try to validate with the client's invoice number parser
        try {
          const { PRALAPIClient } = require('./client')
          const client = new PRALAPIClient()
          client.parseInvoiceNumber(parsed.invoiceNumber)
        } catch (error) {
          if (isStrict) {
            return false
          }
          // In non-strict mode, just check basic length
          if (parsed.invoiceNumber.length < 5) {
            return false
          }
        }
      }

      // Validate NTN format (flexible check for different formats)
      if (parsed.sellerNTN) {
        if (typeof parsed.sellerNTN !== 'string') {
          return false
        }
        
        if (isStrict) {
          const ntnRegex = /^\d{7}$|^\d{13}$/
          if (!ntnRegex.test(parsed.sellerNTN)) {
            return false
          }
        } else {
          // More flexible validation
          const ntnRegex = /^\d+$/
          if (!ntnRegex.test(parsed.sellerNTN) || parsed.sellerNTN.length < 7) {
            return false
          }
        }
      }

      // Validate date format (flexible check)
      if (parsed.invoiceDate) {
        if (typeof parsed.invoiceDate !== 'string') {
          return false
        }
        
        if (isStrict) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/
          if (!dateRegex.test(parsed.invoiceDate)) {
            return false
          }
        } else {
          // Try to parse as date
          const date = new Date(parsed.invoiceDate)
          if (isNaN(date.getTime())) {
            return false
          }
        }
      }

      // Validate amount is positive number
      if (parsed.totalAmount !== undefined) {
        if (typeof parsed.totalAmount !== 'number' || parsed.totalAmount <= 0) {
          return false
        }
      }

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Extract invoice data from QR code
   */
  static parseQRCode(qrContent: string, options?: {
    strict?: boolean
    allowPartialFields?: boolean
    minInvoiceNumberLength?: number
  }): QRCodeData | null {
    try {
      const parsed = JSON.parse(qrContent)
      
      if (this.validateQRCode(qrContent, options)) {
        return parsed as QRCodeData
      }
      
      return null
    } catch (error) {
      return null
    }
  }
  
  /**
   * Parse QR code with flexible validation and partial data recovery
   */
  static parseQRCodeFlexible(qrContent: string): {
    data: any
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const result = {
      data: null as any,
      isValid: false,
      errors: [] as string[],
      warnings: [] as string[]
    }
    
    try {
      const parsed = JSON.parse(qrContent)
      result.data = parsed
      
      // Check for missing fields
      const requiredFields = ['invoiceNumber', 'sellerNTN', 'invoiceDate', 'totalAmount']
      
      for (const field of requiredFields) {
        if (!(field in parsed) || parsed[field] === null || parsed[field] === undefined) {
          result.errors.push(`Missing required field: ${field}`)
        }
      }
      
      // Validate specific fields
      if (parsed.invoiceNumber && typeof parsed.invoiceNumber === 'string') {
        if (parsed.invoiceNumber.length < 5) {
          result.errors.push('Invoice number appears to be too short')
        }
      } else {
        result.errors.push('Invoice number is missing or invalid')
      }
      
      if (parsed.sellerNTN && typeof parsed.sellerNTN === 'string') {
        const ntnRegex = /^\d+$/
        if (!ntnRegex.test(parsed.sellerNTN)) {
          result.errors.push('Seller NTN should contain only digits')
        } else if (parsed.sellerNTN.length < 7) {
          result.warnings.push('Seller NTN appears to be shorter than expected')
        }
      } else {
        result.errors.push('Seller NTN is missing or invalid')
      }
      
      if (parsed.invoiceDate && typeof parsed.invoiceDate === 'string') {
        const date = new Date(parsed.invoiceDate)
        if (isNaN(date.getTime())) {
          result.errors.push('Invoice date is not a valid date')
        }
      } else {
        result.errors.push('Invoice date is missing or invalid')
      }
      
      if (parsed.totalAmount !== undefined) {
        if (typeof parsed.totalAmount !== 'number') {
          result.errors.push('Total amount must be a number')
        } else if (parsed.totalAmount <= 0) {
          result.errors.push('Total amount must be positive')
        }
      } else {
        result.errors.push('Total amount is missing')
      }
      
      // Check for optional fields
      if (!parsed.timestamp) {
        result.warnings.push('Timestamp is missing')
      }
      
      if (!parsed.buyerNTN) {
        result.warnings.push('Buyer NTN is not included')
      }
      
      // Determine overall validity
      result.isValid = result.errors.length === 0
      
      return result
    } catch (error) {
      result.errors.push('Invalid JSON format')
      return result
    }
  }

  /**
   * Generate QR code for testing/sandbox purposes
   */
  static async generateTestQRCode(
    testInvoiceNumber: string,
    options?: {
      sellerNTN?: string
      invoiceDate?: string
      totalAmount?: number
      buyerNTN?: string
      format?: 'svg' | 'png' | 'dataURL'
      size?: number
    }
  ): Promise<string> {
    const testData = {
      sellerNTN: options?.sellerNTN || '1234567',
      invoiceDate: options?.invoiceDate || new Date().toISOString().split('T')[0] || '2024-01-01',
      totalAmount: options?.totalAmount || 1000,
      buyerNTN: options?.buyerNTN || '7654321'
    }

    return this.generateQRCodeFromIRN(testInvoiceNumber, testData, {
      format: options?.format,
      size: options?.size
    })
  }
  
  /**
   * Generate QR code with custom content structure
   */
  static async generateCustomQRCode(
    content: any,
    options?: {
      format?: 'svg' | 'png' | 'dataURL'
      size?: number
      margin?: number
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    }
  ): Promise<string> {
    if (!content || typeof content !== 'object') {
      throw new Error('Content is required and must be an object')
    }
    
    try {
      // Use configured options or defaults
      const format = options?.format || 'svg'
      const size = options?.size || FBRConfig.qr.size
      const margin = options?.margin || FBRConfig.qr.margin
      const errorCorrectionLevel = options?.errorCorrectionLevel || FBRConfig.qr.errorCorrectionLevel
      
      // Generate QR code
      let qrCodeResult: string
      
      if (format === 'png') {
        // Generate PNG as buffer, then convert to base64
        const buffer = await QRCode.toBuffer(JSON.stringify(content), {
          width: size,
          margin: margin,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: errorCorrectionLevel
        })
        qrCodeResult = `data:image/png;base64,${buffer.toString('base64')}`
      } else if (format === 'dataURL') {
        // Generate data URL
        qrCodeResult = await QRCode.toDataURL(JSON.stringify(content), {
          width: size,
          margin: margin,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: errorCorrectionLevel
        })
      } else {
        // Generate SVG
        qrCodeResult = await QRCode.toString(JSON.stringify(content), {
          type: 'svg',
          width: size,
          margin: margin,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: errorCorrectionLevel
        })
      }
      
      return qrCodeResult
    } catch (error) {
      throw new Error(`Failed to generate custom QR code: ${error}`)
    }
  }
}