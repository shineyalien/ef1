'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  FileText, 
  Plus, 
  Trash2, 
  Calculator,
  Smartphone,
  Wifi,
  WifiOff,
  Save,
  Send
} from "lucide-react"
import { useNetworkStatus } from '@/hooks/use-network-status'
import { useOfflineInvoices } from '@/hooks/use-offline'

export default function MobileInvoiceForm() {
  const { data: session, status } = useSession()
  const { isOnline } = useNetworkStatus()
  const { saveOfflineInvoice, hasUnsyncedInvoices } = useOfflineInvoices()
  
  const [invoice, setInvoice] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    items: [{ description: '', quantity: 1, price: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0
  })
  
  const [saving, setSaving] = useState(false)
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      redirect('/auth/login')
      return
    }
    
    calculateTotals()
  }, [session, status, invoice.items])

  const calculateTotals = () => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.18 // 18% tax rate
    const total = subtotal + tax
    
    setInvoice(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }))
  }

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0, total: 0 }]
    }))
  }

  const removeItem = (index: number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...invoice.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'price') {
      newItems[index].total = newItems[index].quantity * newItems[index].price
    }
    
    setInvoice(prev => ({ ...prev, items: newItems }))
  }

  const saveInvoice = async (isDraft = true) => {
    setSaving(true)
    try {
      const invoiceData = {
        ...invoice,
        status: isDraft ? 'DRAFT' : 'PENDING',
        createdAt: new Date().toISOString()
      }

      if (isOnline) {
        // Save to server
        const response = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData)
        })

        if (response.ok) {
          alert('Invoice saved successfully!')
          resetForm()
        } else {
          throw new Error('Failed to save invoice')
        }
      } else {
        // Save offline
        const offlineId = await saveOfflineInvoice(invoiceData)
        if (offlineId) {
          alert('Invoice saved offline. Will sync when online.')
          resetForm()
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save invoice')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setInvoice({
      customerName: '',
      customerEmail: '',
      customerAddress: '',
      items: [{ description: '', quantity: 1, price: 0, total: 0 }],
      subtotal: 0,
      tax: 0,
      total: 0
    })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">New Invoice</span>
            </div>
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              {hasUnsyncedInvoices && (
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Connection Status */}
        {!isOnline && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <WifiOff className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Offline Mode - Invoices will sync when online
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="customerName" className="text-sm font-medium">Customer Name</Label>
              <Input
                id="customerName"
                value={invoice.customerName}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter customer name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customerEmail" className="text-sm font-medium">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={invoice.customerEmail}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="customer@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customerAddress" className="text-sm font-medium">Address</Label>
              <Input
                id="customerAddress"
                value={invoice.customerAddress}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerAddress: e.target.value }))}
                placeholder="Customer address"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Invoice Items</CardTitle>
              <Button onClick={addItem} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoice.items.map((item, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  {invoice.items.length > 1 && (
                    <Button
                      onClick={() => removeItem(index)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <div>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Item description"
                    className="text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="text-sm"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Price</Label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      className="text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Total</Label>
                    <Input
                      value={item.total.toFixed(2)}
                      disabled
                      className="text-sm bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>PKR {invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (18%):</span>
              <span>PKR {invoice.tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>PKR {invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pb-6">
          <Button
            onClick={() => saveInvoice(true)}
            disabled={saving}
            variant="outline"
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          
          <Button
            onClick={() => saveInvoice(false)}
            disabled={saving || !isOnline}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {!isOnline ? 'Needs Internet' : 'Submit'}
          </Button>
        </div>
      </main>
    </div>
  )
}