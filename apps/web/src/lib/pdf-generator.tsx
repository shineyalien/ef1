import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer'

// FBR-compliant invoice PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '2 solid #000000',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.5,
  },
  qrCodeSection: {
    width: 100,
    alignItems: 'center',
  },
  qrCode: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  qrLabel: {
    fontSize: 7,
    color: '#666666',
    textAlign: 'center',
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  fbrBadge: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: 5,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailsColumn: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    width: 120,
  },
  value: {
    flex: 1,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
    borderBottom: '1 solid #cccccc',
    paddingBottom: 3,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontWeight: 'bold',
    fontSize: 9,
    borderBottom: '1 solid #d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '0.5 solid #e5e7eb',
    fontSize: 9,
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  col1: { width: '5%' },
  col2: { width: '30%' },
  col3: { width: '12%' },
  col4: { width: '8%' },
  col5: { width: '12%' },
  col6: { width: '10%' },
  col7: { width: '11%' },
  col8: { width: '12%' },
  summary: {
    marginTop: 20,
    marginLeft: 'auto',
    width: '45%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 10,
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalRow: {
    borderTop: '2 solid #000000',
    paddingTop: 8,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #cccccc',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  fbrCompliance: {
    marginTop: 10,
    fontSize: 7,
    color: '#10b981',
    textAlign: 'center',
    fontWeight: 'bold',
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
    }
    customer?: {
      name: string
      ntnNumber?: string | null
      address?: string | null
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

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-PK', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Company Info and QR Code */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{invoice.business.companyName}</Text>
            <Text style={styles.companyDetails}>
              NTN: {invoice.business.ntnNumber}
            </Text>
            <Text style={styles.companyDetails}>
              {invoice.business.address}
            </Text>
            <Text style={styles.companyDetails}>
              {invoice.business.province}, Pakistan
            </Text>
          </View>
          
          {invoice.qrCode && (
            <View style={styles.qrCodeSection}>
              <Image 
                src={invoice.qrCode} 
                style={styles.qrCode}
              />
              <Text style={styles.qrLabel}>
                Scan to Verify
              </Text>
            </View>
          )}
        </View>

        {/* Invoice Title */}
        <Text style={styles.invoiceTitle}>TAX INVOICE</Text>

        {/* FBR Validation Badge */}
        {invoice.fbrInvoiceNumber && (
          <View style={styles.fbrBadge}>
            <Text>✓ FBR VALIDATED - Digital Invoice</Text>
          </View>
        )}

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.detailsColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Invoice Number:</Text>
              <Text style={styles.value}>{invoice.invoiceNumber}</Text>
            </View>
            {invoice.fbrInvoiceNumber && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>FBR Invoice No:</Text>
                <Text style={styles.value}>{invoice.fbrInvoiceNumber}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.label}>Invoice Date:</Text>
              <Text style={styles.value}>{formatDate(invoice.invoiceDate)}</Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        {invoice.customer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Customer Name:</Text>
              <Text style={styles.value}>{invoice.customer.name}</Text>
            </View>
            {invoice.customer.ntnNumber && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>NTN:</Text>
                <Text style={styles.value}>{invoice.customer.ntnNumber}</Text>
              </View>
            )}
            {invoice.customer.address && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{invoice.customer.address}</Text>
              </View>
            )}
          </View>
        )}

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>#</Text>
              <Text style={styles.col2}>Description</Text>
              <Text style={styles.col3}>HS Code</Text>
              <Text style={styles.col4}>UoM</Text>
              <Text style={styles.col5}>Qty</Text>
              <Text style={styles.col6}>Rate</Text>
              <Text style={styles.col7}>Tax %</Text>
              <Text style={styles.col8}>Amount</Text>
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
                <Text style={styles.col1}>{index + 1}</Text>
                <Text style={styles.col2}>{item.description}</Text>
                <Text style={styles.col3}>{item.hsCode || '-'}</Text>
                <Text style={styles.col4}>{item.uom || '-'}</Text>
                <Text style={styles.col5}>{item.quantity}</Text>
                <Text style={styles.col6}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={styles.col7}>{item.taxRate}%</Text>
                <Text style={styles.col8}>{formatCurrency(item.totalAmount)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal (Excl. Tax):</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(invoice.subtotal || 0)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sales Tax:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(invoice.taxAmount || 0)}
            </Text>
          </View>
          {invoice.totalWithholdingTax && invoice.totalWithholdingTax > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Withholding Tax:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(invoice.totalWithholdingTax)}
              </Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.totalAmount)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is a computer-generated invoice and does not require a signature.
          </Text>
          <Text style={styles.footerText}>
            For queries, please contact {invoice.business.companyName}
          </Text>
          {invoice.fbrInvoiceNumber && (
            <Text style={styles.fbrCompliance}>
              ✓ FBR Digital Invoicing Compliant - SRO 69(I)/2025
            </Text>
          )}
        </View>
      </Page>
    </Document>
  )
}

// Export helper function to generate PDF blob (server-safe, no JSX)
export const generateInvoicePDFBlob = async (invoice: InvoicePDFProps['invoice']) => {
  const { pdf } = await import('@react-pdf/renderer')
  const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob()
  return blob
}

// Export helper function to download PDF
export const downloadInvoicePDF = async (invoice: InvoicePDFProps['invoice']) => {
  const { pdf } = await import('@react-pdf/renderer')
  const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob()
  
  // Create download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Invoice-${invoice.invoiceNumber}-${new Date().getTime()}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Re-export the professional PDF generator
export { ProfessionalInvoicePDF, downloadProfessionalInvoicePDF } from './pdf-generator-v2'
