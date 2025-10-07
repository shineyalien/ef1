'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  ntnNumber: string | null
  address: string
  buyerProvince: string | null
  registrationType: string
}

interface InvoiceItem {
  id?: string
  itemCode: string
  description: string
  hsCode: string
  quantity: number
  unitOfMeasurement: string
  unitPrice: number
  taxRate: number
  valueSalesExcludingST: number
  salesTaxApplicable: number
  salesTaxWithheldAtSource: number
  extraTax: number | null
  furtherTax: number | null
  fedPayable: number | null
  discount: number | null
  totalValue: number
  fixedNotifiedValueOrRetailPrice: number
  sroScheduleNo: string | null
  sroItemSerialNo: string | null
}

interface Invoice {
  id: string
  invoiceNumber: string
  documentType: string
  invoiceDate: string
  taxPeriod: string
  paymentMode: string
  notes: string | null
  status: string
  customerId: string | null
  customer: Customer | null
  items: InvoiceItem[]
  totalAmount: number
}

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Invoice data
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [customerId, setCustomerId] = useState<string>('')
  const [documentType, setDocumentType] = useState<string>('Sale Invoice')
  const [invoiceDate, setInvoiceDate] = useState<string>('')
  const [taxPeriod, setTaxPeriod] = useState<string>('')
  const [paymentMode, setPaymentMode] = useState<string>('Cash')
  const [notes, setNotes] = useState<string>('')
  const [items, setItems] = useState<InvoiceItem[]>([])

  // Customer search
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerSearch, setCustomerSearch] = useState<string>('')
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)

  // FBR Lookup data
  const [hsCodes, setHsCodes] = useState<any[]>([])
  const [uoms, setUoms] = useState<any[]>([])

  // Load invoice data
  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/invoices/${invoiceId}`)
        
        if (!response.ok) {
          throw new Error('Failed to load invoice')
        }

        const responseData = await response.json()
        
        // Handle nested response structure
        const data = responseData.invoice || responseData
        setInvoice(data)

        // Check if invoice can be edited
        if (data.status === 'PUBLISHED') {
          setError('This invoice is published and cannot be edited.')
          setLoading(false)
          return
        }

        // Populate form fields
        setCustomerId(data.customerId || '')
        setDocumentType(data.documentType || 'Sale Invoice')
        setInvoiceDate(data.invoiceDate ? new Date(data.invoiceDate).toISOString().split('T')[0] : '')
        setTaxPeriod(data.taxPeriod || '')
        setPaymentMode(data.paymentMode || 'Cash')
        setNotes(data.notes || '')
        setItems(data.items || [])

        if (data.customer) {
          setCustomerSearch(data.customer.name)
        }

        setLoading(false)
      } catch (err: any) {
        console.error('Error loading invoice:', err)
        setError(err.message || 'Failed to load invoice')
        setLoading(false)
      }
    }

    loadInvoice()
  }, [invoiceId])

  // Load customers for search
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetch('/api/customers')
        if (response.ok) {
          const data = await response.json()
          // Handle both array response and object with customers array
          setCustomers(Array.isArray(data) ? data : (data.customers || []))
        }
      } catch (error) {
        console.error('Failed to load customers:', error)
      }
    }

    loadCustomers()
  }, [])

  // Load FBR lookup data
  useEffect(() => {
    const loadFBRData = async () => {
      try {
        const response = await fetch('/api/fbr/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'all' })
        })

        if (response.ok) {
          const data = await response.json()
          setHsCodes(data.hsCodes || [])
          setUoms(data.uoms || [])
        }
      } catch (error) {
        console.error('Failed to load FBR data:', error)
      }
    }

    loadFBRData()
  }, [])

  // Filter customers based on search
  const filteredCustomers = Array.isArray(customers) ? customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (customer.ntnNumber && customer.ntnNumber.includes(customerSearch))
  ) : []

  const handleCustomerSelect = (customer: Customer) => {
    setCustomerId(customer.id)
    setCustomerSearch(customer.name)
    setShowCustomerDropdown(false)
  }

  // Item management
  const addItem = () => {
    const newItem: InvoiceItem = {
      itemCode: '',
      description: '',
      hsCode: '',
      quantity: 1,
      unitOfMeasurement: 'EACH',
      unitPrice: 0,
      taxRate: 18,
      valueSalesExcludingST: 0,
      salesTaxApplicable: 0,
      salesTaxWithheldAtSource: 0,
      extraTax: null,
      furtherTax: null,
      fedPayable: null,
      discount: null,
      totalValue: 0,
      fixedNotifiedValueOrRetailPrice: 0,
      sroScheduleNo: null,
      sroItemSerialNo: null
    }
    setItems([...items, newItem])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Recalculate if quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
      const item = updatedItems[index]
      const baseValue = item.quantity * item.unitPrice
      const taxAmount = (baseValue * item.taxRate) / 100

      updatedItems[index].valueSalesExcludingST = baseValue
      updatedItems[index].salesTaxApplicable = taxAmount
      updatedItems[index].totalValue = baseValue + taxAmount + (item.salesTaxWithheldAtSource || 0)
      updatedItems[index].fixedNotifiedValueOrRetailPrice = baseValue
    }

    setItems(updatedItems)
  }

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.valueSalesExcludingST, 0)
    const totalTax = items.reduce((sum, item) => sum + item.salesTaxApplicable, 0)
    const totalWithholding = items.reduce((sum, item) => sum + item.salesTaxWithheldAtSource, 0)
    const grandTotal = items.reduce((sum, item) => sum + item.totalValue, 0)

    return { subtotal, totalTax, totalWithholding, grandTotal }
  }

  const totals = calculateTotals()

  // Save invoice
  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      if (!customerId) {
        throw new Error('Please select a customer')
      }

      if (items.length === 0) {
        throw new Error('Please add at least one item')
      }

      const payload = {
        documentType,
        invoiceDate: new Date(invoiceDate).toISOString(),
        taxPeriod,
        paymentMode,
        notes,
        customerId,
        items: items.map(item => ({
          ...item,
          extraTax: item.extraTax || 0,
          furtherTax: item.furtherTax || 0,
          fedPayable: item.fedPayable || 0,
          discount: item.discount || 0
        })),
        totalAmount: totals.grandTotal,
        status: 'SAVED'
      }

      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update invoice')
      }

      setSuccessMessage('Invoice updated successfully!')
      setTimeout(() => {
        router.push('/invoices')
      }, 1500)
    } catch (err: any) {
      console.error('Save error:', err)
      setError(err.message || 'Failed to save invoice')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-center text-gray-500">Loading invoice...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/invoices"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                ← Back to Invoices
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🏠 Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (invoice?.status === 'PUBLISHED') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-yellow-800 font-semibold mb-2">Cannot Edit Published Invoice</h2>
            <p className="text-yellow-700 mb-4">
              This invoice has been published to FBR and cannot be edited. 
              Invoice Number: <strong>{invoice.invoiceNumber}</strong>
            </p>
            <div className="flex gap-3">
              <Link
                href="/invoices"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                ← Back to Invoices
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🏠 Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Invoice</h1>
              <p className="text-gray-600 mt-1">Invoice: {invoice?.invoiceNumber}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                invoice?.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                invoice?.status === 'SAVED' ? 'bg-blue-100 text-blue-700' :
                invoice?.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {invoice?.status}
              </span>
            </div>
            <div className="flex gap-3">
              <Link
                href="/invoices"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                ← Back
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                🏠 Home
              </Link>
            </div>
          </div>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4">
              ✓ {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
              ✗ {error}
            </div>
          )}
        </div>

        {/* Invoice Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value)
                  setShowCustomerDropdown(true)
                }}
                onFocus={() => setShowCustomerDropdown(true)}
                placeholder="Search customer by name or NTN..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {showCustomerDropdown && filteredCustomers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">
                        {customer.ntnNumber || 'No NTN'} • {customer.registrationType}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <Link
                href="/customers/new"
                className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
              >
                + Add New Customer
              </Link>
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Sale Invoice">Sale Invoice</option>
                <option value="Debit Note">Debit Note</option>
              </select>
            </div>

            {/* Invoice Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tax Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Period
              </label>
              <input
                type="text"
                value={taxPeriod}
                onChange={(e) => setTaxPeriod(e.target.value)}
                placeholder="e.g., 2025-01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Optional notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Line Items</h2>
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items added yet. Click "Add Item" to start.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-gray-700">Item #{index + 1}</h3>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Product/Service description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">HS Code</label>
                      <select
                        value={item.hsCode}
                        onChange={(e) => updateItem(index, 'hsCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select...</option>
                        {hsCodes.map((code) => (
                          <option key={code.id} value={code.code}>
                            {code.code} - {code.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <select
                        value={item.unitOfMeasurement}
                        onChange={(e) => updateItem(index, 'unitOfMeasurement', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        {uoms.map((uom) => (
                          <option key={uom.id} value={uom.code}>
                            {uom.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (PKR)</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                      <input
                        type="number"
                        value={item.taxRate}
                        onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="md:col-span-3 bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Base Amount:</span>
                          <span className="font-medium ml-2">PKR {item.valueSalesExcludingST.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Sales Tax:</span>
                          <span className="font-medium ml-2">PKR {item.salesTaxApplicable.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Withholding:</span>
                          <span className="font-medium ml-2">PKR {item.salesTaxWithheldAtSource.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold ml-2 text-blue-600">PKR {item.totalValue.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Invoice Totals</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal (excl. tax):</span>
              <span className="font-medium">PKR {totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Sales Tax:</span>
              <span className="font-medium">PKR {totals.totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Withholding Tax:</span>
              <span className="font-medium">PKR {totals.totalWithholding.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Grand Total:</span>
                <span className="text-blue-600">PKR {totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-end gap-4">
            <Link
              href="/invoices"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || !customerId || items.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
