'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Calendar, DollarSign, CheckCircle, Clock, XCircle, ArrowLeft, Home, Eye, Code, Send, Download, Trash2 } from "lucide-react"
import { FBRSubmissionModal } from "@/components/fbr-submission-modal"
import { DeleteInvoiceDialog } from "@/components/delete-invoice-dialog"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function InvoicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [invoices, setInvoices] = useState<any[]>([])
  const [businesses, setBusinesses] = useState<any[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [showJsonModal, setShowJsonModal] = useState(false)
  const [jsonData, setJsonData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      redirect('/auth/login')
      return
    }

    loadData()
  }, [session, status])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Fetch invoices from API
      const response = await fetch('/api/invoices')
      if (response.ok) {
        const data = await response.json()
        setInvoices(data.invoices || [])
      } else {
        console.error('Failed to fetch invoices:', response.statusText)
        setInvoices([])
      }
      
      // For now, use mock business data
      const mockBusinesses = [
        {
          id: '1',
          name: session?.user?.name || 'Demo Business',
          ntn: '1234567',
          address: '123 Business Street'
        }
      ]
      setBusinesses(mockBusinesses)
      
    } catch (error) {
      console.error('Failed to load data:', error)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitToFBR = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (invoice) {
      setSelectedInvoice(invoice)
      setShowSubmissionModal(true)
    }
  }

  const handleViewInvoice = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}`)
  }

  const handleViewJson = async (invoice: any) => {
    try {
      // Fetch the actual FBR production JSON that would be sent
      const response = await fetch(`/api/invoices/${invoice.id}/fbr-json`)
      if (!response.ok) {
        throw new Error('Failed to generate FBR JSON')
      }
      
      const data = await response.json()
      setJsonData(data.fbrJson)
      setShowJsonModal(true)
    } catch (error) {
      console.error('Error generating FBR JSON:', error)
      
      // Fallback to client-side generation if API fails
      const fbrData = {
        invoiceType: invoice.documentType || 'Sale Invoice',
        invoiceDate: invoice.invoiceDate ? invoice.invoiceDate.split('T')[0] : new Date().toISOString().split('T')[0],
        
        // Seller information
        sellerNTNCNIC: invoice.business?.ntnNumber || '1234567',
        sellerBusinessName: invoice.business?.companyName || 'Demo Business',
        sellerProvince: invoice.business?.province || 'Punjab',
        sellerAddress: invoice.business?.address || 'Demo Address',
        
        // Buyer information
        buyerNTNCNIC: invoice.customer?.ntnNumber || invoice.customer?.buyerNTN || undefined,
        buyerBusinessName: invoice.customer?.name || invoice.customerName || 'Walk-in Customer',
        buyerProvince: invoice.customer?.buyerProvince || invoice.customer?.province || 'Punjab',
        buyerAddress: invoice.customer?.address || 'N/A',
        buyerRegistrationType: invoice.customer?.ntnNumber ? 'Registered' : 'Unregistered',
        
        // Reference for debit notes
        invoiceRefNo: invoice.referenceInvoiceNo || undefined,
        scenarioId: invoice.scenarioId || undefined,
        
        // Line items (camelCase - FBR production compliant)
        items: invoice.items?.map((item: any) => ({
          hsCode: item.hsCode,
          productDescription: item.description,
          rate: `${item.taxRate}%`,
          uoM: item.unitOfMeasurement,
          quantity: item.quantity,
          totalValues: item.totalValue,
          valueSalesExcludingST: item.valueSalesExcludingST || (item.quantity * item.unitPrice),
          fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice || 0,
          salesTaxApplicable: item.salesTaxApplicable,
          salesTaxWithheldAtSource: item.salesTaxWithheldAtSource || 0,
          extraTax: item.extraTax || 0,
          furtherTax: item.furtherTax || 0,
          fedPayable: item.fedPayable || 0,
          discount: item.discount || 0,
          saleType: item.fbrSaleType || mapToFBRSaleType(item.saleType, item.taxRate),
          sroScheduleNo: item.sroScheduleNo || undefined,
          sroItemSerialNo: item.sroItemSerialNo || undefined
        })) || []
      }
      
      setJsonData(fbrData)
      setShowJsonModal(true)
    }
  }

  // Helper function to map internal sale types to FBR format
  function mapToFBRSaleType(saleType: string, taxRate: number): string {
    // Map internal sale types to FBR-compliant sale type descriptions
    switch (saleType) {
      case 'Standard':
        return 'Goods at standard rate (default)'
      case 'Reduced':
        return 'Goods at Reduced Rate'
      case 'Exempt':
        return 'Exempt Goods'
      case 'Zero':
        return 'Goods at zero-rate'
      case 'Services':
        return 'Services rendered or provided'
      case 'FED':
        return 'Goods (FED in ST Mode)'
      case 'Steel':
        return 'Sale of Steel (Melted and Re-Rolled)'
      case 'Textile':
        return 'Cotton Spinners purchase from Cotton Ginners'
      case 'Telecom':
        return 'Telecommunication services rendered or provided'
      default:
        // Default based on tax rate
        if (taxRate === 0) return 'Goods at zero-rate'
        if (taxRate < 18) return 'Goods at Reduced Rate'
        return 'Goods at standard rate (default)'
    }
  }

  const handleFBRSubmission = async (environment: string) => {
    console.log('Submitting to FBR:', selectedInvoice, environment)
    // Reload invoice data after submission
    await loadData()
    // Close modal
    setShowSubmissionModal(false)
    setSelectedInvoice(null)
  }

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceToDelete.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        // Success - reload invoice list
        await loadData()
        setShowDeleteDialog(false)
        setInvoiceToDelete(null)
        alert(result.message || 'Invoice deleted successfully')
      } else {
        // Error - show message
        alert(result.error || result.message || 'Failed to delete invoice')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting the invoice')
    } finally {
      setDeleting(false)
    }
  }

  const handleInitiateDelete = (invoice: any) => {
    // Check if invoice can be deleted
    const deletableStatuses = ['DRAFT', 'SAVED', 'FAILED']
    
    if (!deletableStatuses.includes(invoice.status)) {
      alert(`Cannot delete invoice with status: ${invoice.status}. Only draft, saved, or failed invoices can be deleted.`)
      return
    }

    if (invoice.fbrSubmitted || invoice.fbrValidated) {
      alert('Cannot delete FBR-submitted or validated invoices.')
      return
    }

    setInvoiceToDelete(invoice)
    setShowDeleteDialog(true)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    )
  }

  const firstBusiness = businesses[0]
  
  // Calculate stats
  const totalInvoices = invoices.length
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const submittedToFBR = invoices.filter(inv => inv.fbrSubmitted).length
  const pendingInvoices = invoices.filter(inv => inv.status === 'DRAFT' || inv.status === 'PENDING').length

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        {/* Navigation */}
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Button>
        </div>

        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">Manage your FBR compliant invoices</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/invoices/failed">
              <Button variant="outline">
                <XCircle className="h-4 w-4 mr-2" />
                Failed Invoices
              </Button>
            </Link>
            <Link href="/invoices/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Invoice
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices}</div>
              <p className="text-xs text-muted-foreground">
                {totalInvoices === 0 ? 'Create your first invoice' : 'Invoices created'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">PKR {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From all invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">FBR Submitted</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submittedToFBR}</div>
              <p className="text-xs text-muted-foreground">
                Successfully submitted to FBR
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInvoices}</div>
              <p className="text-xs text-muted-foreground">
                Drafts and pending submission
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>
              {totalInvoices} invoice{totalInvoices !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h3>
                <p className="text-gray-600 mb-6">Create your first invoice to get started with FBR compliance.</p>
                <Link href="/invoices/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Invoice
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Invoice #{invoice.invoiceNumber}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            invoice.status === 'VALIDATED' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                            invoice.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {invoice.status}
                          </span>
                          {invoice.fbrSubmitted && (
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                              FBR Submitted
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {invoice.invoiceDate}
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            PKR {invoice.totalAmount.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            {invoice.mode === 'PRODUCTION' ? (
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            ) : invoice.mode === 'SANDBOX' ? (
                              <Clock className="h-4 w-4 mr-2 text-orange-600" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2 text-gray-400" />
                            )}
                            {invoice.mode || 'LOCAL'}
                          </div>
                          <div>
                            {invoice.items?.length || 0} item{(invoice.items?.length || 0) !== 1 ? 's' : ''}
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">Customer: {invoice.customerName}</p>
                          {invoice.fbrInvoiceNumber && (
                            <p className="text-sm text-green-600 font-medium">
                              FBR Invoice: {invoice.fbrInvoiceNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewInvoice(invoice.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {invoice.status !== 'PUBLISHED' && (
                          <Link href={`/invoices/${invoice.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/invoices/${invoice.id}/pdf`)
                              if (!response.ok) throw new Error('Failed to generate PDF')
                              const blob = await response.blob()
                              const url = window.URL.createObjectURL(blob)
                              const link = document.createElement('a')
                              link.href = url
                              link.download = `Invoice-${invoice.invoiceNumber}.pdf`
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                              window.URL.revokeObjectURL(url)
                            } catch (error) {
                              console.error('PDF download error:', error)
                              alert('Failed to download PDF')
                            }
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewJson(invoice)}
                        >
                          <Code className="h-4 w-4 mr-1" />
                          JSON
                        </Button>
                        {!invoice.fbrSubmitted && (
                          <Button 
                            size="sm"
                            onClick={() => handleSubmitToFBR(invoice.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Submit to FBR
                          </Button>
                        )}
                        {(['DRAFT', 'SAVED', 'FAILED'].includes(invoice.status) && !invoice.fbrSubmitted) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleInitiateDelete(invoice)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* FBR Submission Modal */}
      {showSubmissionModal && selectedInvoice && (
        <FBRSubmissionModal
          isOpen={showSubmissionModal}
          onClose={() => {
            setShowSubmissionModal(false)
            setSelectedInvoice(null)
            loadData() // Refresh invoice list after modal closes
          }}
          invoice={selectedInvoice}
          onSubmit={handleFBRSubmission}
        />
      )}

      {/* JSON View Modal */}
      <Dialog open={showJsonModal} onOpenChange={setShowJsonModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>FBR Invoice JSON Data</DialogTitle>
            <DialogDescription>
              This is the JSON format that will be sent to FBR for submission
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm font-mono">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
              }}
            >
              Copy to Clipboard
            </Button>
            <Button onClick={() => setShowJsonModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Invoice Confirmation Dialog */}
      {showDeleteDialog && invoiceToDelete && (
        <DeleteInvoiceDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDeleteInvoice}
          invoiceNumber={invoiceToDelete.invoiceNumber}
          status={invoiceToDelete.status}
          isDeleting={deleting}
        />
      )}
    </div>
  )
}