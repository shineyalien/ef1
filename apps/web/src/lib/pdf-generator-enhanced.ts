import { jsPDF } from 'jspdf'
import { generateFBRQRCode, validateQRCodeData } from './qr-generator'

interface BusinessSettings {
  companyName: string
  ntnNumber: string
  address: string
  province: string
  sellerCity?: string
  sellerContact?: string
  sellerEmail?: string
  logoUrl?: string | null
  invoiceTemplate?: string
  invoicePrefix?: string
  footerText?: string | null
  taxIdLabel?: string | null
  defaultCurrency?: string
  primaryColor?: string | null
  secondaryColor?: string | null
  defaultPaymentTerms?: string | null
}

interface InvoiceData {
  id: string
  invoiceNumber: string
  invoiceDate: string
  fbrInvoiceNumber?: string | null
  totalAmount: number
  subtotal?: number
  taxAmount?: number
  totalWithholdingTax?: number
  qrCode?: string | null
  business: BusinessSettings
  customer?: {
    name: string
    ntnNumber?: string | null
    address?: string | null
    phoneNumber?: string | null
  } | null
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    taxRate: number
    totalAmount: number
    hsCode?: string | null
    uom?: string | null
  }>
}

type PDFTheme = 'default' | 'modern' | 'classic'

interface ThemeColors {
  primary: string
  secondary: string
  text: string
  lightGray: string
  mediumGray: string
  darkGray: string
  accent: string
  success: string
  warning: string
}

const getThemeColors = (theme: PDFTheme, business: BusinessSettings): ThemeColors => {
  const businessPrimary = business.primaryColor || '#3B82F6'
  const businessSecondary = business.secondaryColor || '#10B981'
  
  switch (theme) {
    case 'modern':
      return {
        primary: businessPrimary,
        secondary: businessSecondary,
        text: '#1F2937',
        lightGray: '#F9FAFB',
        mediumGray: '#E5E7EB',
        darkGray: '#374151',
        accent: '#6366F1',
        success: '#10B981',
        warning: '#F59E0B'
      }
    case 'classic':
      return {
        primary: '#1F2937',
        secondary: '#4B5563',
        text: '#111827',
        lightGray: '#F9FAFB',
        mediumGray: '#D1D5DB',
        darkGray: '#374151',
        accent: '#059669',
        success: '#047857',
        warning: '#D97706'
      }
    default: // original theme
      return {
        primary: businessPrimary,
        secondary: businessSecondary,
        text: '#000000',
        lightGray: '#F8F9FA',
        mediumGray: '#DEE2E6',
        darkGray: '#495057',
        accent: businessSecondary,
        success: '#28A745',
        warning: '#FFC107'
      }
  }
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1] || '0', 16),
    g: parseInt(result[2] || '0', 16),
    b: parseInt(result[3] || '0', 16)
  } : { r: 0, g: 0, b: 0 }
}

const drawHeader = (
  doc: jsPDF, 
  theme: PDFTheme, 
  colors: ThemeColors, 
  business: BusinessSettings,
  yPosition: number
): number => {
  const rgb = hexToRgb(colors.primary)
  
  if (theme === 'modern') {
    // Modern header with colored background
    doc.setFillColor(rgb.r, rgb.g, rgb.b)
    doc.rect(0, yPosition, 210, 40, 'F')
    
    // White text on colored background
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text(business.companyName, 20, yPosition + 20)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`${business.taxIdLabel || 'NTN'}: ${business.ntnNumber}`, 20, yPosition + 30)
    
    // Contact info on the right
    doc.text(`${business.sellerCity || ''}, ${business.province}`, 150, yPosition + 20, { align: 'right' })
    if (business.sellerContact) {
      doc.text(business.sellerContact, 150, yPosition + 30, { align: 'right' })
    }
    
    return yPosition + 50
  } else if (theme === 'classic') {
    // Classic elegant header
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.text(business.companyName, 105, yPosition + 10, { align: 'center' })
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`${business.taxIdLabel || 'NTN'}: ${business.ntnNumber}`, 105, yPosition + 20, { align: 'center' })
    doc.text(business.address, 105, yPosition + 30, { align: 'center' })
    doc.text(`${business.sellerCity || ''}, ${business.province}`, 105, yPosition + 40, { align: 'center' })
    
    // Decorative line
    doc.setDrawColor(rgb.r, rgb.g, rgb.b)
    doc.setLineWidth(2)
    doc.line(20, yPosition + 45, 190, yPosition + 45)
    
    return yPosition + 55
  } else {
    // Original theme
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(business.companyName, 20, yPosition)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`${business.taxIdLabel || 'NTN'}: ${business.ntnNumber}`, 20, yPosition + 8)
    doc.text(business.address, 20, yPosition + 16)
    doc.text(`${business.sellerCity || ''}, ${business.province}`, 20, yPosition + 24)
    
    if (business.sellerContact) {
      doc.text(`Tel: ${business.sellerContact}`, 20, yPosition + 32)
    }
    
    return yPosition + 45
  }
}

const drawInvoiceTitle = (
  doc: jsPDF,
  theme: PDFTheme,
  colors: ThemeColors,
  invoice: InvoiceData,
  yPosition: number
): number => {
  const rgb = hexToRgb(colors.secondary)
  
  if (theme === 'modern') {
    // Modern centered title with background
    doc.setFillColor(colors.lightGray)
    doc.rect(20, yPosition, 170, 30, 'F')
    
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.text('TAX INVOICE', 105, yPosition + 20, { align: 'center' })
    
    return yPosition + 40
  } else if (theme === 'classic') {
    // Classic elegant title
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text('TAX INVOICE', 105, yPosition + 10, { align: 'center' })
    
    // FBR status
    doc.setFontSize(11)
    if (invoice.fbrInvoiceNumber) {
      doc.setTextColor(colors.success)
      doc.setFont('helvetica', 'bold')
      doc.text(`FBR VALIDATED - IRN: ${invoice.fbrInvoiceNumber}`, 105, yPosition + 25, { align: 'center' })
    } else {
      doc.setTextColor(colors.warning)
      doc.setFont('helvetica', 'italic')
      doc.text('DRAFT - NOT SUBMITTED TO FBR', 105, yPosition + 25, { align: 'center' })
    }
    
    return yPosition + 40
  } else {
    // Original theme
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('TAX INVOICE', 105, yPosition, { align: 'center' })
    
    doc.setFontSize(10)
    if (invoice.fbrInvoiceNumber) {
      doc.setTextColor(colors.success)
      doc.setFont('helvetica', 'bold')
      doc.text(`FBR VALIDATED - IRN: ${invoice.fbrInvoiceNumber}`, 105, yPosition + 15, { align: 'center' })
    } else {
      doc.setTextColor(colors.warning)
      doc.setFont('helvetica', 'bold')
      doc.text('DRAFT - NOT SUBMITTED TO FBR', 105, yPosition + 15, { align: 'center' })
    }
    
    return yPosition + 30
  }
}

const drawInvoiceDetails = (
  doc: jsPDF,
  theme: PDFTheme,
  colors: ThemeColors,
  invoice: InvoiceData,
  yPosition: number
): number => {
  const rgb = hexToRgb(colors.mediumGray)
  
  if (theme === 'modern') {
    // Modern card-style layout
    doc.setFillColor(colors.lightGray)
    doc.rect(20, yPosition, 85, 50, 'F')
    doc.rect(105, yPosition, 85, 50, 'F')
    
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Invoice Details', 25, yPosition + 10)
    doc.text('Customer Details', 110, yPosition + 10)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 25, yPosition + 22)
    doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 25, yPosition + 32)
    doc.text(`Tax Period: ${new Date(invoice.invoiceDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'short' })}`, 25, yPosition + 42)
    
    doc.text(`Customer: ${invoice.customer?.name || 'N/A'}`, 110, yPosition + 22)
    if (invoice.customer?.ntnNumber) {
      doc.text(`${invoice.business.taxIdLabel || 'NTN'}: ${invoice.customer.ntnNumber}`, 110, yPosition + 32)
    }
    if (invoice.customer?.address) {
      doc.text(`Address: ${invoice.customer.address}`, 110, yPosition + 42)
    }
    
    return yPosition + 60
  } else if (theme === 'classic') {
    // Classic elegant layout
    doc.setDrawColor(colors.mediumGray)
    doc.rect(20, yPosition, 80, 45)
    doc.rect(110, yPosition, 80, 45)
    
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Invoice Details', 25, yPosition + 10)
    doc.text('Customer Details', 115, yPosition + 10)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`No: ${invoice.invoiceNumber}`, 25, yPosition + 22)
    doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 25, yPosition + 32)
    doc.text(`Period: ${new Date(invoice.invoiceDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'short' })}`, 25, yPosition + 42)
    
    doc.text(`${invoice.customer?.name || 'N/A'}`, 115, yPosition + 22)
    if (invoice.customer?.ntnNumber) {
      doc.text(`${invoice.business.taxIdLabel || 'NTN'}: ${invoice.customer.ntnNumber}`, 115, yPosition + 32)
    }
    if (invoice.customer?.address) {
      doc.text(invoice.customer.address, 115, yPosition + 42)
    }
    
    return yPosition + 55
  } else {
    // Original theme
    doc.setDrawColor(colors.mediumGray)
    doc.rect(20, yPosition, 80, 40)
    doc.rect(110, yPosition, 80, 40)
    
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Invoice Details', 25, yPosition + 7)
    doc.text('Customer Details', 115, yPosition + 7)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 25, yPosition + 15)
    doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 25, yPosition + 22)
    doc.text(`Tax Period: ${new Date(invoice.invoiceDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'short' })}`, 25, yPosition + 29)
    
    doc.text(`Customer: ${invoice.customer?.name || 'N/A'}`, 115, yPosition + 15)
    if (invoice.customer?.ntnNumber) {
      doc.text(`NTN: ${invoice.customer.ntnNumber}`, 115, yPosition + 22)
    }
    if (invoice.customer?.address) {
      doc.text(`Address: ${invoice.customer.address}`, 115, yPosition + 29)
    }
    
    return yPosition + 50
  }
}

const drawItemsTable = (
  doc: jsPDF,
  theme: PDFTheme,
  colors: ThemeColors,
  invoice: InvoiceData,
  yPosition: number
): number => {
  const rgb = hexToRgb(colors.primary)
  
  // Table header
  if (theme === 'modern') {
    doc.setFillColor(rgb.r, rgb.g, rgb.b)
    doc.rect(20, yPosition, 170, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('#', 25, yPosition + 8)
    doc.text('Description', 40, yPosition + 8)
    doc.text('HS Code', 90, yPosition + 8)
    doc.text('Qty', 125, yPosition + 8)
    doc.text('Rate', 145, yPosition + 8)
    doc.text('Amount', 175, yPosition + 8, { align: 'right' })
  } else if (theme === 'classic') {
    doc.setFillColor(colors.lightGray)
    doc.rect(20, yPosition, 170, 10, 'F')
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('#', 25, yPosition + 7)
    doc.text('Description', 40, yPosition + 7)
    doc.text('HS Code', 90, yPosition + 7)
    doc.text('Qty', 125, yPosition + 7)
    doc.text('Rate', 145, yPosition + 7)
    doc.text('Amount', 175, yPosition + 7, { align: 'right' })
  } else {
    doc.setFillColor(rgb.r, rgb.g, rgb.b)
    doc.rect(20, yPosition, 170, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('#', 25, yPosition + 7)
    doc.text('Description', 40, yPosition + 7)
    doc.text('HS Code', 90, yPosition + 7)
    doc.text('Qty', 120, yPosition + 7)
    doc.text('Rate', 135, yPosition + 7)
    doc.text('Tax %', 155, yPosition + 7)
    doc.text('Amount', 170, yPosition + 7)
  }
  
  yPosition += theme === 'modern' ? 12 : 10
  doc.setTextColor(colors.text)
  doc.setFont('helvetica', 'normal')
  
  // Table items
  invoice.items.forEach((item, index) => {
    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }
    
    // Alternate row background for modern theme
    if (theme === 'modern' && index % 2 === 1) {
      doc.setFillColor(colors.lightGray)
      doc.rect(20, yPosition, 170, 8, 'F')
    }
    
    doc.setFontSize(theme === 'classic' ? 8 : 9)
    doc.text(`${index + 1}`, 25, yPosition + 6)
    doc.text(item.description.substring(0, theme === 'classic' ? 20 : 25), 40, yPosition + 6)
    doc.text(item.hsCode || '-', 90, yPosition + 6)
    doc.text(item.quantity.toString(), 125, yPosition + 6)
    doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${item.unitPrice.toFixed(2)}`, 145, yPosition + 6)
    
    if (theme === 'default') {
      doc.text(`${item.taxRate}%`, 155, yPosition + 6)
      doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${item.totalAmount.toFixed(2)}`, 170, yPosition + 6, { align: 'right' })
    } else {
      doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${item.totalAmount.toFixed(2)}`, 175, yPosition + 6, { align: 'right' })
    }
    
    yPosition += theme === 'classic' ? 7 : 8
  })
  
  return yPosition + 10
}

const drawSummary = (
  doc: jsPDF,
  theme: PDFTheme,
  colors: ThemeColors,
  invoice: InvoiceData,
  yPosition: number
): number => {
  const rgb = hexToRgb(colors.secondary)
  
  if (theme === 'modern') {
    // Modern summary box
    doc.setFillColor(colors.lightGray)
    doc.rect(110, yPosition, 80, 60, 'F')
    doc.setDrawColor(colors.mediumGray)
    doc.rect(110, yPosition, 80, 60)
    
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Invoice Summary', 115, yPosition + 10)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Subtotal:`, 115, yPosition + 20)
    doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${(invoice.subtotal || 0).toFixed(2)}`, 175, yPosition + 20, { align: 'right' })
    
    doc.text(`Sales Tax:`, 115, yPosition + 28)
    doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${(invoice.taxAmount || 0).toFixed(2)}`, 175, yPosition + 28, { align: 'right' })
    
    if (invoice.totalWithholdingTax && invoice.totalWithholdingTax > 0) {
      doc.text(`Withholding Tax:`, 115, yPosition + 36)
      doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${invoice.totalWithholdingTax.toFixed(2)}`, 175, yPosition + 36, { align: 'right' })
    }
    
    // Total line
    doc.setDrawColor(rgb.r, rgb.g, rgb.b)
    doc.setLineWidth(1.5)
    doc.line(115, yPosition + 44, 185, yPosition + 44)
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(`Total:`, 115, yPosition + 52)
    doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${invoice.totalAmount.toFixed(2)}`, 175, yPosition + 52, { align: 'right' })
    
    return yPosition + 70
  } else if (theme === 'classic') {
    // Classic elegant summary
    doc.setDrawColor(colors.mediumGray)
    doc.rect(110, yPosition, 80, 50)
    
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Summary', 115, yPosition + 10)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Subtotal:`, 115, yPosition + 18)
    doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${(invoice.subtotal || 0).toFixed(2)}`, 175, yPosition + 18, { align: 'right' })
    
    doc.text(`Tax:`, 115, yPosition + 25)
    doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${(invoice.taxAmount || 0).toFixed(2)}`, 175, yPosition + 25, { align: 'right' })
    
    if (invoice.totalWithholdingTax && invoice.totalWithholdingTax > 0) {
      doc.text(`WHT:`, 115, yPosition + 32)
      doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${invoice.totalWithholdingTax.toFixed(2)}`, 175, yPosition + 32, { align: 'right' })
    }
    
    doc.setDrawColor(colors.text)
    doc.line(115, yPosition + 38, 185, yPosition + 38)
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(`Total:`, 115, yPosition + 44)
    doc.text(`${invoice.business.defaultCurrency || 'PKR'} ${invoice.totalAmount.toFixed(2)}`, 175, yPosition + 44, { align: 'right' })
    
    return yPosition + 60
  } else {
    // Original theme
    doc.setDrawColor(colors.mediumGray)
    doc.rect(110, yPosition, 80, 50)
    
    doc.setTextColor(colors.text)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Invoice Summary', 115, yPosition + 10)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Subtotal:`, 115, yPosition + 20)
    doc.text(`Rs. ${(invoice.subtotal || 0).toFixed(2)}`, 155, yPosition + 20, { align: 'right' })
    
    doc.text(`Sales Tax:`, 115, yPosition + 27)
    doc.text(`Rs. ${(invoice.taxAmount || 0).toFixed(2)}`, 155, yPosition + 27, { align: 'right' })
    
    if (invoice.totalWithholdingTax && invoice.totalWithholdingTax > 0) {
      doc.text(`Withholding Tax:`, 115, yPosition + 34)
      doc.text(`Rs. ${invoice.totalWithholdingTax.toFixed(2)}`, 155, yPosition + 34, { align: 'right' })
    }
    
    doc.setDrawColor(colors.text)
    doc.line(115, yPosition + 38, 185, yPosition + 38)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`Total Amount:`, 115, yPosition + 45)
    doc.text(`Rs. ${invoice.totalAmount.toFixed(2)}`, 155, yPosition + 45, { align: 'right' })
    
    return yPosition + 60
  }
}

const drawQRCode = (
  doc: jsPDF,
  theme: PDFTheme,
  colors: ThemeColors,
  invoice: InvoiceData,
  yPosition: number
): number => {
  if (!invoice.qrCode || !invoice.fbrInvoiceNumber) {
    return yPosition
  }

  // Add QR code section
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(colors.text)
  doc.text('FBR QR Code', 105, yPosition, { align: 'center' })
  
  // Add QR code image (placeholder for now - in real implementation, this would render the actual QR code)
  try {
    // For now, we'll add a placeholder rectangle
    // In a real implementation, you would convert the base64 QR code to an image
    doc.setFillColor(0, 0, 0)
    doc.rect(85, yPosition + 5, 40, 40, 'S') // Border for QR code
    
    // Add QR code text representation
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(colors.mediumGray)
    doc.text(`IRN: ${invoice.fbrInvoiceNumber}`, 105, yPosition + 50, { align: 'center' })
    
    return yPosition + 55
  } catch (error) {
    console.error('Error adding QR code to PDF:', error)
    return yPosition + 10
  }
}

const drawFooter = (
  doc: jsPDF,
  theme: PDFTheme,
  colors: ThemeColors,
  invoice: InvoiceData,
  yPosition: number
): void => {
  doc.setFontSize(theme === 'classic' ? 7 : 8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(colors.mediumGray)
  
  if (invoice.business.footerText) {
    doc.text(invoice.business.footerText, 105, yPosition, { align: 'center' })
    yPosition += 5
  }
  
  doc.text('This is a computer-generated invoice and does not require a signature.', 105, yPosition, { align: 'center' })
  yPosition += 5
  
  if (invoice.fbrInvoiceNumber) {
    doc.setTextColor(colors.success)
    doc.setFont('helvetica', 'bold')
    doc.text('✓ FBR Digital Invoice - Validated - SRO 69(I)/2025 Compliant', 105, yPosition, { align: 'center' })
  }
}

export const generateEnhancedPDF = async (
  invoice: InvoiceData,
  theme: PDFTheme = 'default'
): Promise<ReadableStream> => {
  const doc = new jsPDF()
  const colors = getThemeColors(theme, invoice.business)
  
  let yPosition = 20
  
  // Draw sections
  yPosition = drawHeader(doc, theme, colors, invoice.business, yPosition)
  yPosition = drawInvoiceTitle(doc, theme, colors, invoice, yPosition)
  yPosition = drawInvoiceDetails(doc, theme, colors, invoice, yPosition)
  yPosition = drawItemsTable(doc, theme, colors, invoice, yPosition)
  yPosition = drawSummary(doc, theme, colors, invoice, yPosition)
  yPosition = drawQRCode(doc, theme, colors, invoice, yPosition)
  drawFooter(doc, theme, colors, invoice, yPosition)
  
  // Return as ReadableStream
  const buffer = Buffer.from(doc.output('arraybuffer'))
  return new ReadableStream({
    start(controller) {
      controller.enqueue(buffer)
      controller.close()
    }
  })
}