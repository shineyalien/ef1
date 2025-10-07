import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer'

// Register custom fonts for better typography
Font.register({
  family: 'Arial',
  fonts: [
    { src: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
  ],
})

// Professional FBR-compliant invoice PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    lineHeight: 1.2,
  },
  
  // Header Section
  headerContainer: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  
  // Company Logo and Info
  companySection: {
    flex: 2,
  },
  logoPlaceholder: {
    width: 120,
    height: 50,
    backgroundColor: '#f8f9fa',
    border: '1 solid #dee2e6',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 8,
    color: '#6c757d',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  companyAddress: {
    fontSize: 9,
    color: '#495057',
    marginBottom: 2,
  },
  companyTaxInfo: {
    fontSize: 9,
    color: '#495057',
    fontWeight: '500',
  },
  
  // FBR Validation Section
  fbrSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  fbrBadge: {
    backgroundColor: '#28a745',
    color: '#ffffff',
    padding: '6 12',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  qrCodeContainer: {
    border: '1 solid #dee2e6',
    padding: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  qrCode: {
    width: 80,
    height: 80,
    marginBottom: 4,
  },
  qrText: {
    fontSize: 7,
    color: '#6c757d',
    textAlign: 'center',
  },
  
  // Invoice Title Bar
  titleBar: {
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    padding: '12 20',
    textAlign: 'center',
    marginBottom: 20,
    borderRadius: 4,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  
  // Invoice Details Section
  detailsSection: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
  },
  detailsColumn: {
    flex: 1,
  },
  detailsBox: {
    border: '1 solid #dee2e6',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  detailsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    borderBottom: '1 solid #dee2e6',
    paddingBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 9,
    color: '#6c757d',
    width: 80,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 9,
    color: '#2c3e50',
    flex: 1,
    fontWeight: '600',
  },
  
  // Customer Section
  customerSection: {
    marginBottom: 20,
  },
  customerBox: {
    border: '1 solid #dee2e6',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  customerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    borderBottom: '1 solid #dee2e6',
    paddingBottom: 4,
  },
  
  // Items Table
  tableSection: {
    marginBottom: 20,
  },
  table: {
    border: '1 solid #dee2e6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    flexDirection: 'row',
    padding: '10 12',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: '8 12',
    borderBottom: '1 solid #dee2e6',
    fontSize: 9,
    backgroundColor: '#ffffff',
  },
  tableRowAlt: {
    backgroundColor: '#f8f9fa',
  },
  
  // Column Widths
  colSr: { width: '8%' },
  colDescription: { width: '35%' },
  colHsCode: { width: '12%' },
  colQty: { width: '8%' },
  colRate: { width: '12%' },
  colTax: { width: '8%' },
  colAmount: { width: '17%' },
  
  // Summary Section
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  summaryBox: {
    width: '40%',
    border: '1 solid #dee2e6',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    borderBottom: '1 solid #dee2e6',
    paddingBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#495057',
  },
  summaryValue: {
    fontSize: 9,
    color: '#2c3e50',
    fontWeight: '600',
  },
  totalRow: {
    borderTop: '2 solid #2c3e50',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  // Footer Section
  footerSection: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1 solid #dee2e6',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  footerColumn: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 8,
    color: '#6c757d',
    marginBottom: 2,
  },
  
  // Compliance Section
  complianceSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#e8f5e8',
    border: '1 solid #28a745',
    borderRadius: 4,
  },
  complianceTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 4,
    textAlign: 'center',
  },
  complianceText: {
    fontSize: 8,
    color: '#155724',
    textAlign: 'center',
  },
  
  // Watermark
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    opacity: 0.1,
    fontSize: 72,
    fontWeight: 'bold',
    color: '#000000',
  },
})

interface InvoicePDFProps {
  invoice: {
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
}

export const ProfessionalInvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-PK', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark for Draft */}
        {!invoice.fbrInvoiceNumber && (
          <Text style={styles.watermark}>DRAFT</Text>
        )}

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            {/* Company Information */}
            <View style={styles.companySection}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>COMPANY LOGO</Text>
              </View>
              <Text style={styles.companyName}>{invoice.business.companyName}</Text>
              <Text style={styles.companyAddress}>{invoice.business.address}</Text>
              <Text style={styles.companyAddress}>{invoice.business.province}, Pakistan</Text>
              <Text style={styles.companyTaxInfo}>NTN: {invoice.business.ntnNumber}</Text>
              {invoice.business.phoneNumber && (
                <Text style={styles.companyTaxInfo}>Tel: {invoice.business.phoneNumber}</Text>
              )}
              {invoice.business.email && (
                <Text style={styles.companyTaxInfo}>Email: {invoice.business.email}</Text>
              )}
            </View>

            {/* FBR Validation Section */}
            <View style={styles.fbrSection}>
              {invoice.fbrInvoiceNumber ? (
                <View style={styles.fbrBadge}>
                  <Text>FBR VALIDATED</Text>
                </View>
              ) : (
                <View style={{ backgroundColor: '#ffc107', color: '#000000', padding: '6 12', borderRadius: 4, fontSize: 9, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
                  <Text>DRAFT - NOT SUBMITTED</Text>
                </View>
              )}
              
              {invoice.qrCode && (
                <View style={styles.qrCodeContainer}>
                  <Image src={invoice.qrCode} style={styles.qrCode} />
                  <Text style={styles.qrText}>Scan to Verify</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Invoice Title */}
        <View style={styles.titleBar}>
          <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
        </View>

        {/* Invoice Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailsColumn}>
            <View style={styles.detailsBox}>
              <Text style={styles.detailsTitle}>Invoice Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice No:</Text>
                <Text style={styles.detailValue}>{invoice.invoiceNumber}</Text>
              </View>
              {invoice.fbrInvoiceNumber && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>FBR IRN:</Text>
                  <Text style={styles.detailValue}>{invoice.fbrInvoiceNumber}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{formatDate(invoice.invoiceDate)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsColumn}>
            <View style={styles.detailsBox}>
              <Text style={styles.detailsTitle}>Tax Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tax Period:</Text>
                <Text style={styles.detailValue}>
                  {new Date(invoice.invoiceDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'short' })}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Sales Tax Reg:</Text>
                <Text style={styles.detailValue}>Registered</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Province:</Text>
                <Text style={styles.detailValue}>{invoice.business.province}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        {invoice.customer && (
          <View style={styles.customerSection}>
            <View style={styles.customerBox}>
              <Text style={styles.customerTitle}>Customer Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer:</Text>
                <Text style={styles.detailValue}>{invoice.customer.name}</Text>
              </View>
              {invoice.customer.ntnNumber && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>NTN:</Text>
                  <Text style={styles.detailValue}>{invoice.customer.ntnNumber}</Text>
                </View>
              )}
              {invoice.customer.address && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.detailValue}>{invoice.customer.address}</Text>
                </View>
              )}
              {invoice.customer.phoneNumber && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>{invoice.customer.phoneNumber}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Items Table */}
        <View style={styles.tableSection}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.colSr}>Sr#</Text>
              <Text style={styles.colDescription}>Description of Goods</Text>
              <Text style={styles.colHsCode}>HS Code</Text>
              <Text style={styles.colQty}>Qty</Text>
              <Text style={styles.colRate}>Rate</Text>
              <Text style={styles.colTax}>Tax %</Text>
              <Text style={styles.colAmount}>Amount</Text>
            </View>

            {/* Table Rows */}
            {invoice.items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowAlt : {}
                ]}
              >
                <Text style={styles.colSr}>{index + 1}</Text>
                <Text style={styles.colDescription}>{item.description}</Text>
                <Text style={styles.colHsCode}>{item.hsCode || '-'}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colRate}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={styles.colTax}>{item.taxRate}%</Text>
                <Text style={styles.colAmount}>{formatCurrency(item.totalAmount)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Invoice Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal (Excl. Tax):</Text>
              <Text style={styles.summaryValue}>{formatCurrency(invoice.subtotal || 0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sales Tax:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(invoice.taxAmount || 0)}</Text>
            </View>
            {invoice.totalWithholdingTax && invoice.totalWithholdingTax > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Withholding Tax:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(invoice.totalWithholdingTax)}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.totalAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total in Words:</Text>
              <Text style={styles.summaryValue}>
                {NumberToWords(invoice.totalAmount)} Rupees Only
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <View style={styles.footerRow}>
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Banking Details</Text>
              <Text style={styles.footerText}>Bank: [Bank Name]</Text>
              <Text style={styles.footerText}>Account Title: {invoice.business.companyName}</Text>
              <Text style={styles.footerText}>Account Number: [Account Number]</Text>
            </View>
            <View style={styles.footerColumn}>
              <Text style={styles.footerTitle}>Contact Information</Text>
              <Text style={styles.footerText}>Phone: {invoice.business.phoneNumber || 'N/A'}</Text>
              <Text style={styles.footerText}>Email: {invoice.business.email || 'N/A'}</Text>
              <Text style={styles.footerText}>Website: [Website]</Text>
            </View>
          </View>
        </View>

        {/* Compliance Section */}
        <View style={styles.complianceSection}>
          <Text style={styles.complianceTitle}>
            {invoice.fbrInvoiceNumber ? 'FBR Digital Invoice - Validated' : 'Computer Generated Invoice'}
          </Text>
          <Text style={styles.complianceText}>
            {invoice.fbrInvoiceNumber 
              ? `This invoice is validated by Federal Board of Revenue (FBR) - IRN: ${invoice.fbrInvoiceNumber}`
              : 'This is a computer-generated invoice and is valid without signature.'
            }
          </Text>
          <Text style={styles.complianceText}>
            Compliant with SRO 69(I)/2025 - Digital Invoicing System
          </Text>
        </View>
      </Page>
    </Document>
  )
}

// Helper function to convert number to words
const NumberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  
  if (num === 0) return 'Zero'
  
  const convert = (n: number): string => {
    if (n < 10) return ones[n] || ''
    if (n < 20) return teens[n - 10] || ''
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '')
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '')
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '')
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '')
  }
  
  return convert(Math.floor(num))
}

// Export helper functions
export const generateProfessionalInvoicePDFBlob = async (invoice: InvoicePDFProps['invoice']) => {
  const { pdf } = await import('@react-pdf/renderer')
  const blob = await pdf(<ProfessionalInvoicePDF invoice={invoice} />).toBlob()
  return blob
}

export const downloadProfessionalInvoicePDF = async (invoice: InvoicePDFProps['invoice']) => {
  const { pdf } = await import('@react-pdf/renderer')
  const blob = await pdf(<ProfessionalInvoicePDF invoice={invoice} />).toBlob()
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Invoice-${invoice.invoiceNumber}-${new Date().getTime()}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}