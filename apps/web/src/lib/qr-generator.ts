/**
 * QR Code Generation for FBR Digital Invoicing
 * Generates 7x7MM QR codes as per SRO 69(I)/2025 requirements
 */

import QRCode from 'qrcode'

export interface QRCodeData {
  /**
   * FBR Invoice Reference Number (IRN) - e.g., 7000007DI1747119701593
   * This is the unique invoice number assigned by FBR
   */
  fbrInvoiceNumber: string
  
  /**
   * Seller NTN (7 digits) or CNIC (13 digits)
   */
  sellerNTN: string
  
  /**
   * Invoice Date in ISO format
   */
  invoiceDate: string
  
  /**
   * Total Amount including all taxes
   */
  totalAmount: number
  
  /**
   * Buyer NTN (optional - for registered buyers)
   */
  buyerNTN?: string
  
  /**
   * FBR timestamp from submission response
   */
  fbrTimestamp?: string
}

/**
 * Generate QR Code for FBR Invoice
 * Returns base64-encoded PNG image
 */
export async function generateFBRQRCode(data: QRCodeData): Promise<string> {
  try {
    // Create QR code content as JSON
    const qrContent = JSON.stringify({
      irn: data.fbrInvoiceNumber,        // FBR Invoice Reference Number
      stn: data.sellerNTN,                // Seller Tax Number
      dt: data.invoiceDate,               // Date
      amt: data.totalAmount,              // Amount
      btn: data.buyerNTN || null,         // Buyer Tax Number
      ts: data.fbrTimestamp || new Date().toISOString() // Timestamp
    })
    
    // Generate QR code as base64 PNG
    // Size: 200px = approximately 7x7MM at 72 DPI for printing
    const qrCodeDataURL = await QRCode.toDataURL(qrContent, {
      errorCorrectionLevel: 'M', // Medium error correction (15% recovery)
      type: 'image/png',
      width: 200,  // 200px width
      margin: 1,   // Minimal margin
      color: {
        dark: '#000000',  // Black modules
        light: '#FFFFFF'  // White background
      }
    })
    
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate QR Code as SVG
 * Useful for high-quality printing
 */
export async function generateFBRQRCodeSVG(data: QRCodeData): Promise<string> {
  try {
    const qrContent = JSON.stringify({
      irn: data.fbrInvoiceNumber,
      stn: data.sellerNTN,
      dt: data.invoiceDate,
      amt: data.totalAmount,
      btn: data.buyerNTN || null,
      ts: data.fbrTimestamp || new Date().toISOString()
    })
    
    // Generate QR code as SVG string
    const qrCodeSVG = await QRCode.toString(qrContent, {
      errorCorrectionLevel: 'M',
      type: 'svg',
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    return qrCodeSVG
  } catch (error) {
    console.error('Error generating QR code SVG:', error)
    throw new Error(`Failed to generate QR code SVG: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Verify QR Code Data
 * Ensures all required fields are present before generation
 */
export function validateQRCodeData(data: QRCodeData): boolean {
  if (!data.fbrInvoiceNumber || data.fbrInvoiceNumber.trim() === '') {
    throw new Error('FBR Invoice Number (IRN) is required for QR code generation')
  }
  
  if (!data.sellerNTN || data.sellerNTN.trim() === '') {
    throw new Error('Seller NTN is required for QR code generation')
  }
  
  if (!data.invoiceDate || data.invoiceDate.trim() === '') {
    throw new Error('Invoice Date is required for QR code generation')
  }
  
  if (data.totalAmount === undefined || data.totalAmount === null || data.totalAmount < 0) {
    throw new Error('Valid Total Amount is required for QR code generation')
  }
  
  return true
}

/**
 * Parse QR Code Content
 * Extracts invoice data from QR code string
 */
export function parseQRCodeContent(qrContent: string): QRCodeData | null {
  try {
    const data = JSON.parse(qrContent)
    
    return {
      fbrInvoiceNumber: data.irn,
      sellerNTN: data.stn,
      invoiceDate: data.dt,
      totalAmount: data.amt,
      buyerNTN: data.btn,
      fbrTimestamp: data.ts
    }
  } catch (error) {
    console.error('Error parsing QR code content:', error)
    return null
  }
}
