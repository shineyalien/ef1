import QRCode from 'qrcode'
import { QRCodeData } from './types'

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
    }
  ): Promise<string> {
    const qrContent = this.buildQRContent(irn, invoiceData)
    
    try {
      // Generate QR code as SVG (7x7MM as per SRO requirements)
      const qrCodeSVG = await QRCode.toString(JSON.stringify(qrContent), {
        type: 'svg',
        width: 200, // Adjust for 7x7MM print size
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      
      return qrCodeSVG
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
    }
  ): Promise<string> {
    const qrContent = this.buildQRContent(irn, invoiceData)
    
    try {
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrContent), {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      
      return qrCodeDataURL
    } catch (error) {
      throw new Error(`Failed to generate QR code data URL: ${error}`)
    }
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
   * Validate QR code content format
   */
  static validateQRCode(qrContent: string): boolean {
    try {
      const parsed = JSON.parse(qrContent)
      
      // Check required fields
      const requiredFields = ['invoiceNumber', 'sellerNTN', 'invoiceDate', 'totalAmount', 'timestamp']
      
      for (const field of requiredFields) {
        if (!(field in parsed) || parsed[field] === null || parsed[field] === undefined) {
          return false
        }
      }

      // Validate FBR invoice number format (basic check)
      if (typeof parsed.invoiceNumber !== 'string' || parsed.invoiceNumber.length < 10) {
        return false
      }

      // Validate NTN format (7 or 13 digits)
      const ntnRegex = /^\d{7}$|^\d{13}$/
      if (!ntnRegex.test(parsed.sellerNTN)) {
        return false
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(parsed.invoiceDate)) {
        return false
      }

      // Validate amount is positive number
      if (typeof parsed.totalAmount !== 'number' || parsed.totalAmount <= 0) {
        return false
      }

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Extract invoice data from QR code
   */
  static parseQRCode(qrContent: string): QRCodeData | null {
    try {
      const parsed = JSON.parse(qrContent)
      
      if (this.validateQRCode(qrContent)) {
        return parsed as QRCodeData
      }
      
      return null
    } catch (error) {
      return null
    }
  }

  /**
   * Generate QR code for testing/sandbox purposes
   */
  static async generateTestQRCode(testInvoiceNumber: string): Promise<string> {
    const testData = {
      sellerNTN: '1234567',
      invoiceDate: new Date().toISOString().split('T')[0] || '2024-01-01',
      totalAmount: 1000,
      buyerNTN: '7654321'
    }

    return this.generateQRCodeFromIRN(testInvoiceNumber, testData)
  }
}