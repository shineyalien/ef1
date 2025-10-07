'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCcw, AlertCircle, XCircle, CheckCircle2, Clock, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FailedInvoice {
  id: string
  invoiceNumber: string
  invoiceDate: string
  totalAmount: number
  status: string
  retryCount: number
  maxRetries: number
  lastRetryAt: string | null
  nextRetryAt: string | null
  retryEnabled: boolean
  fbrErrorCode: string | null
  fbrErrorMessage: string | null
}

export default function FailedInvoicesPage() {
  const [invoices, setInvoices] = useState<FailedInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState<string | null>(null)
  const router = useRouter()

  const loadFailedInvoices = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/invoices?status=FAILED')
      if (response.ok) {
        const data = await response.json()
        setInvoices(data.invoices || [])
      }
    } catch (error) {
      console.error('Error loading failed invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFailedInvoices()
  }, [])

  const handleRetry = async (invoiceId: string) => {
    setRetrying(invoiceId)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/retry`, {
        method: 'POST'
      })

      const result = await response.json()

      if (response.ok) {
        alert(`✅ ${result.message}\nFBR Invoice Number: ${result.fbrInvoiceNumber || 'N/A'}`)
        await loadFailedInvoices() // Reload list
      } else {
        alert(`❌ Retry failed: ${result.error}\n${result.details || ''}`)
      }
    } catch (error) {
      console.error('Error retrying invoice:', error)
      alert('An error occurred while retrying the invoice')
    } finally {
      setRetrying(null)
    }
  }

  const handleResetRetryCount = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/retry`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message)
        await loadFailedInvoices()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error resetting retry count:', error)
      alert('An error occurred')
    }
  }

  const handleDisableRetry = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to disable automatic retry for this invoice?')) {
      return
    }

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/retry`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable' })
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message)
        await loadFailedInvoices()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error disabling retry:', error)
      alert('An error occurred')
    }
  }

  const getRetryStatusColor = (invoice: FailedInvoice) => {
    if (!invoice.retryEnabled) return 'text-gray-500'
    if (invoice.retryCount >= invoice.maxRetries) return 'text-red-600'
    if (invoice.nextRetryAt) {
      const nextRetry = new Date(invoice.nextRetryAt)
      if (nextRetry > new Date()) return 'text-yellow-600'
    }
    return 'text-green-600'
  }

  const getRetryStatusText = (invoice: FailedInvoice) => {
    if (!invoice.retryEnabled) return 'Retry Disabled'
    if (invoice.retryCount >= invoice.maxRetries) return 'Max Retries Reached'
    if (invoice.nextRetryAt) {
      const nextRetry = new Date(invoice.nextRetryAt)
      if (nextRetry > new Date()) {
        const minutes = Math.ceil((nextRetry.getTime() - Date.now()) / 60000)
        return `Next retry in ${minutes}m`
      }
      return 'Ready for Retry'
    }
    return 'Ready for Retry'
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Failed Invoices</h1>
          <p className="text-gray-500">Manage and retry failed FBR submissions</p>
        </div>
        <Button onClick={loadFailedInvoices} variant="outline" size="sm">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-red-600">{invoices.length}</span>
              <span className="text-sm text-gray-500">Total Failed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-yellow-600">
                {invoices.filter(i => i.retryEnabled && i.retryCount < i.maxRetries).length}
              </span>
              <span className="text-sm text-gray-500">Retry Eligible</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-600">
                {invoices.filter(i => i.retryCount >= i.maxRetries).length}
              </span>
              <span className="text-sm text-gray-500">Max Retries</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Failed Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>Failed Invoices</CardTitle>
          <CardDescription>
            Invoices that failed FBR submission with automatic retry support
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Loading failed invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Failed Invoices</h3>
              <p className="text-gray-500">All invoices have been successfully submitted to FBR</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="font-medium">{invoice.invoiceNumber}</span>
                        <span className={`text-sm ${getRetryStatusColor(invoice)}`}>
                          {getRetryStatusText(invoice)}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          Amount: PKR {invoice.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                          Retry: {invoice.retryCount} / {invoice.maxRetries} attempts
                        </p>
                        
                        {invoice.fbrErrorMessage && (
                          <div className="flex items-start space-x-2 mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-red-800 font-medium text-xs">Error:</p>
                              <p className="text-red-700 text-xs break-words">{invoice.fbrErrorMessage}</p>
                              {invoice.fbrErrorCode && (
                                <p className="text-red-600 text-xs mt-1">Code: {invoice.fbrErrorCode}</p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {invoice.lastRetryAt && (
                          <p className="text-gray-500 text-xs flex items-center space-x-1 mt-2">
                            <Clock className="h-3 w-3" />
                            <span>Last retry: {new Date(invoice.lastRetryAt).toLocaleString()}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRetry(invoice.id)}
                        disabled={
                          retrying === invoice.id ||
                          !invoice.retryEnabled ||
                          invoice.retryCount >= invoice.maxRetries
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {retrying === invoice.id ? (
                          <>
                            <RefreshCcw className="h-4 w-4 mr-1 animate-spin" />
                            Retrying...
                          </>
                        ) : (
                          <>
                            <RefreshCcw className="h-4 w-4 mr-1" />
                            Retry Now
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/invoices/${invoice.id}`)}
                      >
                        View
                      </Button>
                      
                      <div className="relative group">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <button
                            onClick={() => handleResetRetryCount(invoice.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            disabled={invoice.retryCount >= invoice.maxRetries}
                          >
                            Reset Retry Count
                          </button>
                          <button
                            onClick={() => handleDisableRetry(invoice.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                          >
                            Disable Retry
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
