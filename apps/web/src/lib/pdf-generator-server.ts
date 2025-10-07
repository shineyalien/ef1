import { jsPDF } from 'jspdf'

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
  business: {
    companyName: string
    ntnNumber: string
    address: string
    province: string
    phoneNumber?: string
    email?: string
  }
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

export const generatePDFOnServer = async (invoice: InvoiceData): Promise<ReadableStream> => {
  const doc = new jsPDF()
  
  // Set font
  doc.setFont('helvetica')
  
  let yPosition = 20
  
  // Company Header
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(invoice.business.companyName, 20, yPosition)
  yPosition += 8
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`NTN: ${invoice.business.ntnNumber}`, 20, yPosition)
  yPosition += 6
  doc.text(invoice.business.address, 20, yPosition)
  yPosition += 6
  doc.text(`${invoice.business.province}, Pakistan`, 20, yPosition)
  yPosition += 6
  if (invoice.business.phoneNumber) {
    doc.text(`Tel: ${invoice.business.phoneNumber}`, 20, yPosition)
    yPosition += 6
  }
  
  // Invoice Title
  yPosition += 10
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('TAX INVOICE', 105, yPosition, { align: 'center' })
  yPosition += 15
  
  // FBR Status
  doc.setFontSize(10)
  if (invoice.fbrInvoiceNumber) {
    doc.setTextColor(0, 128, 0)
    doc.setFont('helvetica', 'bold')
    doc.text(`FBR VALIDATED - IRN: ${invoice.fbrInvoiceNumber}`, 105, yPosition, { align: 'center' })
    doc.setTextColor(0, 0, 0)
  } else {
    doc.setTextColor(255, 165, 0)
    doc.setFont('helvetica', 'bold')
    doc.text('DRAFT - NOT SUBMITTED TO FBR', 105, yPosition, { align: 'center' })
    doc.setTextColor(0, 0, 0)
  }
  yPosition += 15
  
  // Invoice Details Box
  doc.setFont('helvetica', 'normal')
  doc.setDrawColor(200, 200, 200)
  doc.rect(20, yPosition, 80, 40)
  doc.rect(110, yPosition, 80, 40)
  
  // Left box - Invoice Details
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Invoice Details', 25, yPosition + 7)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, 25, yPosition + 15)
  doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 25, yPosition + 22)
  doc.text(`Tax Period: ${new Date(invoice.invoiceDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'short' })}`, 25, yPosition + 29)
  
  // Right box - Customer Details
  doc.setFont('helvetica', 'bold')
  doc.text('Customer Details', 115, yPosition + 7)
  doc.setFont('helvetica', 'normal')
  doc.text(`Customer: ${invoice.customer?.name || 'N/A'}`, 115, yPosition + 15)
  if (invoice.customer?.ntnNumber) {
    doc.text(`NTN: ${invoice.customer.ntnNumber}`, 115, yPosition + 22)
  }
  if (invoice.customer?.address) {
    doc.text(`Address: ${invoice.customer.address}`, 115, yPosition + 29)
  }
  
  yPosition += 50
  
  // Items Table Header
  doc.setDrawColor(0, 0, 0)
  doc.setFillColor(44, 62, 80)
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
  
  yPosition += 10
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  
  // Table Items
  invoice.items.forEach((item, index) => {
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }
    
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor(248, 249, 250)
      doc.rect(20, yPosition, 170, 8, 'F')
    }
    
    doc.text(`${index + 1}`, 25, yPosition + 6)
    doc.text(item.description.substring(0, 25), 40, yPosition + 6)
    doc.text(item.hsCode || '-', 90, yPosition + 6)
    doc.text(item.quantity.toString(), 120, yPosition + 6)
    doc.text(`Rs. ${item.unitPrice.toFixed(2)}`, 135, yPosition + 6)
    doc.text(`${item.taxRate}%`, 155, yPosition + 6)
    doc.text(`Rs. ${item.totalAmount.toFixed(2)}`, 170, yPosition + 6)
    
    yPosition += 8
  })
  
  yPosition += 10
  
  // Summary Box
  doc.setDrawColor(200, 200, 200)
  doc.rect(110, yPosition, 80, 50)
  
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
  
  // Total
  doc.setDrawColor(0, 0, 0)
  doc.line(115, yPosition + 38, 185, yPosition + 38)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(`Total Amount:`, 115, yPosition + 45)
  doc.text(`Rs. ${invoice.totalAmount.toFixed(2)}`, 155, yPosition + 45, { align: 'right' })
  
  // Footer
  yPosition = 270
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('This is a computer-generated invoice and does not require a signature.', 105, yPosition, { align: 'center' })
  yPosition += 5
  doc.text(`For queries, please contact ${invoice.business.companyName}`, 105, yPosition, { align: 'center' })
  
  if (invoice.fbrInvoiceNumber) {
    yPosition += 5
    doc.setTextColor(0, 128, 0)
    doc.setFont('helvetica', 'bold')
    doc.text('✓ FBR Digital Invoice - Validated - SRO 69(I)/2025 Compliant', 105, yPosition, { align: 'center' })
  }
  
  // Return as ReadableStream
  const buffer = Buffer.from(doc.output('arraybuffer'))
  return new ReadableStream({
    start(controller) {
      controller.enqueue(buffer)
      controller.close()
    }
  })
}