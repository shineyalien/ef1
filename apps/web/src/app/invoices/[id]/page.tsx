'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Download, Send, Edit, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string
  
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [errorModal, setErrorModal] = useState<{ open: boolean; error: string | null; details: any }>({
    open: false,
    error: null,
    details: null
  })

  useEffect(() => {
    loadInvoice()
  }, [invoiceId])

  const loadInvoice = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/invoices/${invoiceId}`)
      
      if (!response.ok) {
        throw new Error('Failed to load invoice')
      }

      const data = await response.json()
      
      // Handle nested response structure
      const invoiceData = data.invoice || data
      
      // Calculate totals if not present
      if (!invoiceData.subtotal && invoiceData.items) {
        const subtotal = invoiceData.items.reduce((sum: number, item: any) => 
          sum + (item.valueSalesExcludingST || 0), 0
        )
        const taxAmount = invoiceData.items.reduce((sum: number, item: any) => 
          sum + (item.salesTaxApplicable || 0), 0
        )
        const totalWithholdingTax = invoiceData.items.reduce((sum: number, item: any) => 
          sum + (item.salesTaxWithheldAtSource || 0), 0
        )
        
        invoiceData.subtotal = subtotal
        invoiceData.taxAmount = taxAmount
        invoiceData.totalWithholdingTax = totalWithholdingTax
      }
      
      setInvoice(invoiceData)
    } catch (err: any) {
      console.error('Error loading invoice:', err)
      setError(err.message || 'Failed to load invoice')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true)
      
      // Call PDF generation API
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Get the PDF blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Invoice-${invoice.invoiceNumber}-${Date.now()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (err: any) {
      console.error('Error downloading PDF:', err)
      alert(err.message || 'Failed to download PDF')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center mb-4">{error || 'Invoice not found'}</p>
            <Link href="/invoices">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Invoices
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/invoices')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoice.invoiceNumber}</h1>
              <p className="text-gray-600 text-sm">
                Created on {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {invoice.status === 'FAILED' && (
              <Button 
                onClick={async () => {
                  if (confirm('Retry FBR submission for this invoice?')) {
                    try {
                      const response = await fetch(`/api/invoices/${invoice.id}/retry`, {
                        method: 'POST'
                      })
                      const result = await response.json()
                      if (response.ok) {
                        alert(`✅ ${result.message}`)
                        loadInvoice() // Reload invoice
                      } else {
                        alert(`❌ ${result.error}\n${result.details || ''}`)
                      }
                    } catch (error) {
                      alert('Failed to retry submission')
                    }
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Retry FBR
              </Button>
            )}
            {invoice.status !== 'PUBLISHED' && invoice.status !== 'FAILED' && (
              <Link href={`/invoices/${invoice.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            <Button
              onClick={async () => {
                try {
                  setDownloading(true)
                  const response = await fetch(`/api/invoices/${invoiceId}/pdf`)
                  if (!response.ok) throw new Error('Failed to generate PDF')
                  const blob = await response.blob()
                  const url = window.URL.createObjectURL(blob)
                  window.open(url, '_blank')
                  window.URL.revokeObjectURL(url)
                } catch (err: any) {
                  alert(err.message || 'Failed to preview PDF')
                } finally {
                  setDownloading(false)
                }
              }}
              disabled={downloading}
              variant="secondary"
            >
              {downloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Preview PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Invoice Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  invoice.status === 'VALIDATED' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                  invoice.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mode</p>
                <p className="font-semibold">{invoice.mode || 'LOCAL'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">FBR Submitted</p>
                <p className="font-semibold">{invoice.fbrSubmitted ? 'Yes' : 'No'}</p>
              </div>
              {invoice.fbrInvoiceNumber && (
                <div>
                  <p className="text-sm text-gray-600">FBR Invoice Number</p>
                  <p className="font-semibold text-green-600">{invoice.fbrInvoiceNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FBR Error Display */}
        {invoice.fbrErrorMessage && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                FBR Submission Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-2">{invoice.fbrErrorMessage}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setErrorModal({
                    open: true,
                    error: invoice.fbrErrorMessage,
                    details: {
                      type: 'fbr_submission_error',
                      timestamp: invoice.updatedAt || new Date().toISOString(),
                      invoiceId: invoice.id,
                      invoiceNumber: invoice.invoiceNumber,
                      status: invoice.status,
                      fbrResponse: invoice.fbrResponse
                    }
                  })
                }}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                View Full Error Details
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Customer & Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{invoice.customer?.name || 'N/A'}</p>
              </div>
              {invoice.customer?.ntnNumber && (
                <div>
                  <p className="text-sm text-gray-600">NTN Number</p>
                  <p className="font-semibold">{invoice.customer.ntnNumber}</p>
                </div>
              )}
              {invoice.customer?.address && (
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold">{invoice.customer.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Invoice Date</p>
                <p className="font-semibold">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
              </div>
              {invoice.dueDate && (
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Document Type</p>
                <p className="font-semibold">{invoice.documentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Mode</p>
                <p className="font-semibold">{invoice.paymentMode}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Line Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-left py-2">HS Code</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Unit Price</th>
                    <th className="text-right py-2">Tax Rate</th>
                    <th className="text-right py-2">Tax Amount</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">{item.description}</td>
                      <td className="py-3">{item.hsCode}</td>
                      <td className="text-right py-3">{item.quantity}</td>
                      <td className="text-right py-3">PKR {item.unitPrice.toLocaleString()}</td>
                      <td className="text-right py-3">{item.taxRate}%</td>
                      <td className="text-right py-3">PKR {item.salesTaxApplicable.toLocaleString()}</td>
                      <td className="text-right py-3 font-semibold">PKR {item.totalValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Totals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal (excl. tax)</span>
                <span className="font-semibold">PKR {(invoice.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sales Tax</span>
                <span className="font-semibold">PKR {(invoice.taxAmount || 0).toLocaleString()}</span>
              </div>
              {(invoice.totalWithholdingTax || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Withholding Tax</span>
                  <span className="font-semibold">PKR {(invoice.totalWithholdingTax || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t text-lg">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold text-blue-600">PKR {(invoice.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {invoice.notes && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{invoice.notes}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
