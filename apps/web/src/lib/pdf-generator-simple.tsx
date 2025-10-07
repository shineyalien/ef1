import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

// Simple, reliable PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
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
    marginBottom: 2,
  },
  qrSection: {
    width: 80,
    alignItems: 'center',
  },
  qrCode: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  qrLabel: {
    fontSize: 7,
    color: '#666666',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  fbrBadge: {
    backgroundColor: '#28a745',
    color: '#ffffff',
    padding: '6 12',
    textAlign: 'center',
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 15,
    borderRadius: 4,
  },
  draftBadge: {
    backgroundColor: '#ffc107',
    color: '#000000',
    padding: '6 12',
    textAlign: 'center',
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 15,
    borderRadius: 4,
  },
  detailsSection: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
  },
  detailsBox: {
    flex: 1,
    border: '1 solid #dee2e6',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  detailsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    borderBottom: '1 solid #dee2e6',
    paddingBottom: 3,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 3,
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
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    padding: '8 10',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: '6 10',
    borderBottom: '1 solid #dee2e6',
    fontSize: 9,
  },
  tableRowAlt: {
    backgroundColor: '#f8f9fa',
  },
  colSr: { width: '8%' },
  colDesc: { width: '35%' },
  colHs: { width: '12%' },
  colQty: { width: '8%' },
  colRate: { width: '12%' },
  colTax: { width: '8%' },
  colAmount: { width: '17%' },
  summary: {
    width: '40%',
    marginLeft: 'auto',
    border: '1 solid #dee2e6',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
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
    paddingTop: 6,
    marginTop: 6,
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
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1 solid #dee2e6',
    fontSize: 8,
    color: '#6c757d',
    textAlign: 'center',
  },
  compliance: {
    marginTop: 10,
    fontSize: 8,
    color: '#28a745',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})

interface SimpleInvoicePDFProps {
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

export const SimpleInvoicePDF: React.FC<SimpleInvoicePDFProps> = ({ invoice }) => {
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{invoice.business.companyName}</Text>
            <Text style={styles.companyDetails}>NTN: {invoice.business.ntnNumber}</Text>
            <Text style={styles.companyDetails}>{invoice.business.address}</Text>
            <Text style={styles.companyDetails}>{invoice.business.province}, Pakistan</Text>
            {invoice.business.phoneNumber && (
              <Text style={styles.companyDetails}>Tel: {invoice.business.phoneNumber}</Text>
            )}
          </View>
          
          {invoice.qrCode && (
            <View style={styles.qrSection}>
              <Image src={invoice.qrCode} style={styles.qrCode} />
              <Text style={styles.qrLabel}>Scan to Verify</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>TAX INVOICE</Text>

        {/* FBR Status Badge */}
        {invoice.fbrInvoiceNumber ? (
          <View style={styles.fbrBadge}>
            <Text>FBR VALIDATED - IRN: {invoice.fbrInvoiceNumber}</Text>
          </View>
        ) : (
          <View style={styles.draftBadge}>
            <Text>DRAFT - NOT SUBMITTED TO FBR</Text>
          </View>
        )}

        {/* Invoice Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Invoice Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Invoice No:</Text>
              <Text style={styles.detailValue}>{invoice.invoiceNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{formatDate(invoice.invoiceDate)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tax Period:</Text>
              <Text style={styles.detailValue}>
                {new Date(invoice.invoiceDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'short' })}
              </Text>
            </View>
          </View>

          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Customer Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Customer:</Text>
              <Text style={styles.detailValue}>{invoice.customer?.name || 'N/A'}</Text>
            </View>
            {invoice.customer?.ntnNumber && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>NTN:</Text>
                <Text style={styles.detailValue}>{invoice.customer.ntnNumber}</Text>
              </View>
            )}
            {invoice.customer?.address && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Address:</Text>
                <Text style={styles.detailValue}>{invoice.customer.address}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colSr}>#</Text>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colHs}>HS Code</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colTax}>Tax %</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>

          {invoice.items.map((item, index) => (
            <View 
              key={item.id} 
              style={[
                styles.tableRow, 
                index % 2 === 1 ? styles.tableRowAlt : {}
              ]}
            >
              <Text style={styles.colSr}>{index + 1}</Text>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colHs}>{item.hsCode || '-'}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colRate}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.colTax}>{item.taxRate}%</Text>
              <Text style={styles.colAmount}>{formatCurrency(item.totalAmount)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
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
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is a computer-generated invoice and does not require a signature.</Text>
          <Text>For queries, please contact {invoice.business.companyName}</Text>
          {invoice.fbrInvoiceNumber && (
            <Text style={styles.compliance}>
              ✓ FBR Digital Invoice - Validated - SRO 69(I)/2025 Compliant
            </Text>
          )}
        </View>
      </Page>
    </Document>
  )
}

// Export helper functions
export const generateSimpleInvoicePDFBlob = async (invoice: SimpleInvoicePDFProps['invoice']) => {
  const { pdf } = await import('@react-pdf/renderer')
  const blob = await pdf(<SimpleInvoicePDF invoice={invoice} />).toBlob()
  return blob
}

export const downloadSimpleInvoicePDF = async (invoice: SimpleInvoicePDFProps['invoice']) => {
  const { pdf } = await import('@react-pdf/renderer')
  const blob = await pdf(<SimpleInvoicePDF invoice={invoice} />).toBlob()
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Invoice-${invoice.invoiceNumber}-${new Date().getTime()}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}