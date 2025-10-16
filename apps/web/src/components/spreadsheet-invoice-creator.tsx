'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { Plus, Save, Edit2, Check, X, Upload, AlertCircle, CheckCircle, Clock, Filter, Calendar, CheckSquare, Square, MoreHorizontal, Eye, Trash2, Download, Send, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useError } from '@/contexts/error-context'
import ClientWrapper from '@/components/client-wrapper'

interface InvoiceItem {
  id: string
  description: string
  hsCode: string
  quantity: number
  unitPrice: number
  taxRate: number
  total: number
  unitOfMeasurement: string
  productId?: string
  // Additional FBR tax fields
  discount?: number
  valueSalesExcludingST: number
  salesTaxApplicable: number
  salesTaxWithheldAtSource: number
  extraTax: number
  furtherTax: number
  fedPayable: number
  totalValue: number
  saleType: string
  sroScheduleNo?: string
  sroItemSerialNo?: string
  fixedNotifiedValueOrRetailPrice?: number
  // Show additional tax fields
  showAdditionalTaxes?: boolean
}

interface Invoice {
  id: string
  invoiceNumber?: string
  customerId?: string
  customerName?: string
  invoiceDate: string
  dueDate: string
  status: 'DRAFT' | 'SAVED' | 'VALIDATED' | 'PUBLISHED' | 'FAILED'
  fbrStatus?: 'PENDING' | 'SUBMITTED' | 'VALIDATED' | 'PUBLISHED' | 'ERROR'
  fbrErrorMessage?: string
  fbrSubmitted?: boolean
  fbrValidated?: boolean
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  totalAmount: number
  totalWithholdingTax?: number
  totalExtraTax?: number
  totalFurtherTax?: number
  totalFED?: number
  isEditing?: boolean
  isNew?: boolean
  // FBR Required Fields
  documentType?: string
  scenarioId?: string
  paymentMode?: string
  taxPeriod?: string
  invoiceRefNo?: string // For debit notes only
  // FBR Production Compliance Fields
  fbrBuyerNTN?: string
  fbrBuyerCNIC?: string
  fbrBuyerPassport?: string
  fbrBuyerType?: string
  fbrBuyerCity?: string
  fbrBuyerProvince?: string
  fbrBuyerAddress?: string
  fbrBuyerContact?: string
  fbrBuyerEmail?: string
  // Additional fields
  notes?: string
  fbrInvoiceNumber?: string
}

interface Customer {
  id: string
  name: string
  ntnNumber?: string
  address: string
  city?: string
  province?: string
  phone?: string
  email?: string
  // Additional FBR fields
  buyerCNIC?: string
  buyerPassport?: string
  buyerType?: string
  buyerCity?: string
  buyerProvince?: string
  buyerContact?: string
  buyerEmail?: string
}

interface Product {
  id: string
  name: string
  description?: string
  hsCode: string
  unitPrice: number
  taxRate: number
  unitOfMeasurement: string
  category?: string
  serialNumber?: string
  transactionType?: string
  transactionTypeDesc?: string
  rateId?: string
  rateDescription?: string
  sroScheduleNo?: string
  sroItemSerialNo?: string
}

// Define interfaces for error handling
interface ValidationError {
  id: string;
  error: string;
}

interface PublicationError {
  id: string;
  error: string;
}

const SpreadsheetInvoiceCreator: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [hsCodes, setHsCodes] = useState<any[]>([])
  const [uomList, setUomList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string[]>([])
  const [validating, setValidating] = useState<string[]>([])
  const [publishing, setPublishing] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [bulkValidating, setBulkValidating] = useState(false)
  const [bulkPublishing, setBulkPublishing] = useState(false)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [jsonViewInvoice, setJsonViewInvoice] = useState<any>(null)
  const [errorModal, setErrorModal] = useState<{ open: boolean; invoice: Invoice | null; error: string | null; details: any }>({
    open: false,
    invoice: null,
    error: null,
    details: null
  })
  const { showSuccessToast, showErrorToast } = useError()

  // Convert internal invoice format to FBR format using unified utility
  const convertToFbrFormat = async (invoice: Invoice) => {
    // Import the unified FBR JSON generator
    const { convertToFbrFormat: unifiedConverter } = await import('@/lib/fbr-json-generator')
    
    // Find customer data
    const customer = customers.find(c => c.id === invoice.customerId)
    
    // Create invoice object with customer data for the unified converter
    const invoiceWithCustomer = {
      ...invoice,
      customer
    }
    
    // Use the unified converter
    return await unifiedConverter(invoiceWithCustomer)
  }

  // Fetch initial data
  useEffect(() => {
    Promise.all([
      fetchInvoices(),
      fetchCustomers(),
      fetchProducts()
    ]).finally(() => setLoading(false))
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices')
      if (!response.ok) throw new Error('Failed to fetch invoices')
      
      const data = await response.json()
      const formattedInvoices = data.invoices.map((inv: any) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        customerId: inv.customerId,
        customerName: inv.customer?.name,
        invoiceDate: format(new Date(inv.invoiceDate), 'yyyy-MM-dd'),
        dueDate: format(new Date(inv.dueDate), 'yyyy-MM-dd'),
        status: inv.status,
        fbrStatus: inv.fbrSubmitted ? (inv.fbrValidated ? 'VALIDATED' : 'SUBMITTED') : 'PENDING',
        fbrSubmitted: inv.fbrSubmitted || false,
        fbrValidated: inv.fbrValidated || false,
        items: inv.items.map((item: any) => ({
          id: item.id,
          description: item.description,
          hsCode: item.hsCode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          total: item.totalValue,
          unitOfMeasurement: item.unitOfMeasurement || 'PCS',
          // Additional FBR tax fields
          discount: item.discount || 0,
          valueSalesExcludingST: item.valueSalesExcludingST || (item.quantity * item.unitPrice),
          salesTaxApplicable: item.salesTaxApplicable || 0,
          salesTaxWithheldAtSource: item.salesTaxWithheldAtSource || 0,
          extraTax: item.extraTax || 0,
          furtherTax: item.furtherTax || 0,
          fedPayable: item.fedPayable || 0,
          totalValue: item.totalValue || (item.quantity * item.unitPrice * (1 + item.taxRate / 100)),
          saleType: item.saleType || 'Standard',
          sroScheduleNo: item.sroScheduleNo || '',
          sroItemSerialNo: item.sroItemSerialNo || '',
          fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice || 0,
          showAdditionalTaxes: false
        })),
        subtotal: inv.subtotal || 0,
        taxAmount: inv.taxAmount || 0,
        totalAmount: inv.totalAmount || 0,
        fbrErrorMessage: inv.fbrErrorMessage,
        fbrInvoiceNumber: inv.fbrInvoiceNumber,
        // FBR Required Fields
        documentType: inv.documentType || 'Sale Invoice',
        scenarioId: inv.scenarioId || 'SN001',
        paymentMode: inv.paymentMode || '1',
        taxPeriod: inv.taxPeriod || format(new Date(), 'yyyy-MM'),
        // FBR Production Compliance Fields
        fbrBuyerNTN: inv.fbrBuyerNTN || '',
        fbrBuyerCNIC: inv.fbrBuyerCNIC || '',
        fbrBuyerPassport: inv.fbrBuyerPassport || '',
        fbrBuyerType: inv.fbrBuyerType || '',
        fbrBuyerCity: inv.fbrBuyerCity || '',
        fbrBuyerProvince: inv.fbrBuyerProvince || '',
        fbrBuyerAddress: inv.fbrBuyerAddress || '',
        fbrBuyerContact: inv.fbrBuyerContact || '',
        fbrBuyerEmail: inv.fbrBuyerEmail || ''
      }))
      
      setInvoices(formattedInvoices)
    } catch (error) {
      console.error('Error fetching invoices:', error)
      showErrorToast('Error', 'Failed to fetch invoices')
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (!response.ok) throw new Error('Failed to fetch customers')
      
      const data = await response.json()
      setCustomers(data.customers)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }


  const addNewInvoice = () => {
    const newInvoice: Invoice = {
      id: `new-${Date.now()}`,
      invoiceDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      status: 'DRAFT',
      fbrStatus: 'PENDING',
      items: [{
        id: `item-${Date.now()}`,
        description: '',
        hsCode: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 18,
        total: 0,
        unitOfMeasurement: 'PCS',
        // Additional FBR tax fields
        discount: 0,
        valueSalesExcludingST: 0,
        salesTaxApplicable: 0,
        salesTaxWithheldAtSource: 0,
        extraTax: 0,
        furtherTax: 0,
        fedPayable: 0,
        totalValue: 0,
        saleType: 'Standard',
        sroScheduleNo: '',
        sroItemSerialNo: '',
        fixedNotifiedValueOrRetailPrice: 0,
        showAdditionalTaxes: false
      }],
      subtotal: 0,
      taxAmount: 0,
      totalAmount: 0,
      isEditing: true,
      isNew: true,
      // FBR Required Fields
      documentType: 'Sale Invoice',
      scenarioId: 'SN001',
      paymentMode: '1',
      taxPeriod: format(new Date(), 'yyyy-MM'),
      // FBR Production Compliance Fields
      fbrBuyerNTN: '',
      fbrBuyerCNIC: '',
      fbrBuyerPassport: '',
      fbrBuyerType: '',
      fbrBuyerCity: '',
      fbrBuyerProvince: '',
      fbrBuyerAddress: '',
      fbrBuyerContact: '',
      fbrBuyerEmail: ''
    }
    
    setInvoices(prev => [newInvoice, ...prev])
  }


  const updateInvoice = (invoiceId: string, field: string, value: any) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const updated = { ...inv, [field]: value }
        
        // Update customer name and buyer information when customer changes
        if (field === 'customerId') {
          const customer = customers.find(c => c.id === value)
          updated.customerName = customer?.name || ''
          
          // Map customer data to FBR Buyer Information fields
          if (customer) {
            updated.fbrBuyerNTN = customer.ntnNumber || ''
            updated.fbrBuyerCNIC = customer.buyerCNIC || ''
            updated.fbrBuyerPassport = customer.buyerPassport || ''
            updated.fbrBuyerType = customer.buyerType || (customer.ntnNumber ? '1' : '2') // Default to NTN if available, otherwise CNIC
            updated.fbrBuyerCity = customer.buyerCity || customer.city || ''
            updated.fbrBuyerProvince = customer.buyerProvince || customer.province || ''
            updated.fbrBuyerAddress = customer.address || ''
            updated.fbrBuyerContact = customer.phone || customer.buyerContact || ''
            updated.fbrBuyerEmail = customer.email || customer.buyerEmail || ''
          } else {
            // Clear buyer fields if no customer selected
            updated.fbrBuyerNTN = ''
            updated.fbrBuyerCNIC = ''
            updated.fbrBuyerPassport = ''
            updated.fbrBuyerType = ''
            updated.fbrBuyerCity = ''
            updated.fbrBuyerProvince = ''
            updated.fbrBuyerAddress = ''
            updated.fbrBuyerContact = ''
            updated.fbrBuyerEmail = ''
          }
        }
        
        // Clear irrelevant buyer ID fields when buyer type changes
        if (field === 'fbrBuyerType') {
          if (value === '1') { // NTN selected
            updated.fbrBuyerCNIC = ''
            updated.fbrBuyerPassport = ''
          } else if (value === '2') { // CNIC selected
            updated.fbrBuyerNTN = ''
            updated.fbrBuyerPassport = ''
          } else if (value === '3') { // Passport selected
            updated.fbrBuyerNTN = ''
            updated.fbrBuyerCNIC = ''
          }
        }
        
        return updated
      }
      return inv
    }))
  }

  const updateInvoiceItem = (invoiceId: string, itemId: string, field: string, value: any) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const updatedItems = inv.items.map(item => {
          if (item.id === itemId) {
            // Don't allow editing hsCode or unitOfMeasurement if a product is selected
            if (item.productId && (field === 'hsCode' || field === 'unitOfMeasurement')) {
              return item
            }
            
            const updatedItem = { ...item, [field]: value }
            
            // If a product is selected, populate fields from product data
            if (field === 'productId' && value) {
              const product = products.find(p => p.id === value)
              if (product) {
                updatedItem.description = product.description || product.name
                updatedItem.hsCode = product.hsCode
                updatedItem.unitPrice = product.unitPrice
                updatedItem.taxRate = product.taxRate
                updatedItem.unitOfMeasurement = product.unitOfMeasurement
                updatedItem.sroScheduleNo = product.sroScheduleNo || ''
                updatedItem.sroItemSerialNo = product.sroItemSerialNo || ''
                updatedItem.saleType = product.transactionTypeDesc || 'Standard'
              }
            }
            
            // Calculate totals when quantity, unit price, tax rate, or discount changes
            if (['quantity', 'unitPrice', 'taxRate', 'discount', 'salesTaxWithheldAtSource', 'extraTax', 'furtherTax', 'fedPayable'].includes(field)) {
              const baseAmount = updatedItem.quantity * updatedItem.unitPrice
              const discountAmount = (baseAmount * (updatedItem.discount || 0)) / 100
              updatedItem.valueSalesExcludingST = baseAmount - discountAmount
              updatedItem.salesTaxApplicable = (updatedItem.valueSalesExcludingST * updatedItem.taxRate) / 100
              updatedItem.total = updatedItem.valueSalesExcludingST
              updatedItem.totalValue = updatedItem.valueSalesExcludingST + updatedItem.salesTaxApplicable +
                                      (updatedItem.extraTax || 0) + (updatedItem.furtherTax || 0) +
                                      (updatedItem.fedPayable || 0)
            }
            
            return updatedItem
          }
          return item
        })
        
        // Recalculate invoice totals
        const subtotal = updatedItems.reduce((sum, item) => sum + (item.valueSalesExcludingST || 0), 0)
        const taxAmount = updatedItems.reduce((sum, item) => sum + (item.salesTaxApplicable || 0), 0)
        const totalWithholdingTax = updatedItems.reduce((sum, item) => sum + (item.salesTaxWithheldAtSource || 0), 0)
        const totalExtraTax = updatedItems.reduce((sum, item) => sum + (item.extraTax || 0), 0)
        const totalFurtherTax = updatedItems.reduce((sum, item) => sum + (item.furtherTax || 0), 0)
        const totalFED = updatedItems.reduce((sum, item) => sum + (item.fedPayable || 0), 0)
        const grandTotal = updatedItems.reduce((sum, item) => sum + (item.totalValue || 0), 0)
        
        return {
          ...inv,
          items: updatedItems,
          subtotal,
          taxAmount,
          totalAmount: grandTotal,
          totalWithholdingTax,
          totalExtraTax,
          totalFurtherTax,
          totalFED
        }
      }
      return inv
    }))
  }

  const addInvoiceItem = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newItem: InvoiceItem = {
          id: `item-${Date.now()}`,
          description: '',
          hsCode: '',
          quantity: 1,
          unitPrice: 0,
          taxRate: 18,
          total: 0,
          unitOfMeasurement: 'PCS',
          // Additional FBR tax fields
          discount: 0,
          valueSalesExcludingST: 0,
          salesTaxApplicable: 0,
          salesTaxWithheldAtSource: 0,
          extraTax: 0,
          furtherTax: 0,
          fedPayable: 0,
          totalValue: 0,
          saleType: 'Standard',
          sroScheduleNo: '',
          sroItemSerialNo: '',
          fixedNotifiedValueOrRetailPrice: 0,
          showAdditionalTaxes: false
        }
        
        return {
          ...inv,
          items: [...inv.items, newItem]
        }
      }
      return inv
    }))
  }

  const removeInvoiceItem = (invoiceId: string, itemId: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const updatedItems = inv.items.filter(item => item.id !== itemId)
        
        // Recalculate totals
        const subtotal = updatedItems.reduce((sum, item) => sum + (item.valueSalesExcludingST || 0), 0)
        const taxAmount = updatedItems.reduce((sum, item) => sum + (item.salesTaxApplicable || 0), 0)
        const totalWithholdingTax = updatedItems.reduce((sum, item) => sum + (item.salesTaxWithheldAtSource || 0), 0)
        const totalExtraTax = updatedItems.reduce((sum, item) => sum + (item.extraTax || 0), 0)
        const totalFurtherTax = updatedItems.reduce((sum, item) => sum + (item.furtherTax || 0), 0)
        const totalFED = updatedItems.reduce((sum, item) => sum + (item.fedPayable || 0), 0)
        const grandTotal = updatedItems.reduce((sum, item) => sum + (item.totalValue || 0), 0)
        
        return {
          ...inv,
          items: updatedItems,
          subtotal,
          taxAmount,
          totalAmount: grandTotal,
          totalWithholdingTax,
          totalExtraTax,
          totalFurtherTax,
          totalFED
        }
      }
      return inv
    }))
  }

  const saveInvoice = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) return

    if (!invoice.customerId || invoice.items.some(item => !item.description || !item.hsCode)) {
      showErrorToast('Validation Error', 'Please fill in all required fields')
      return
    }

    setSaving(prev => [...prev, invoiceId])
    
    try {
      const invoiceData = {
        customerId: invoice.customerId,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        status: 'SAVED', // Explicitly set status to SAVED
        // FBR Required Fields
        documentType: invoice.documentType || 'Sale Invoice',
        scenarioId: invoice.scenarioId,
        paymentMode: invoice.paymentMode || '1',
        taxPeriod: invoice.taxPeriod,
        invoiceRefNo: invoice.invoiceRefNo,
        // FBR Production Compliance Fields
        fbrBuyerNTN: invoice.fbrBuyerNTN,
        fbrBuyerCNIC: invoice.fbrBuyerCNIC,
        fbrBuyerPassport: invoice.fbrBuyerPassport,
        fbrBuyerType: invoice.fbrBuyerType,
        fbrBuyerCity: invoice.fbrBuyerCity,
        fbrBuyerProvince: invoice.fbrBuyerProvince,
        fbrBuyerAddress: invoice.fbrBuyerAddress,
        fbrBuyerContact: invoice.fbrBuyerContact,
        fbrBuyerEmail: invoice.fbrBuyerEmail,
        notes: invoice.notes,
        subtotal: invoice.subtotal,
        taxAmount: invoice.taxAmount,
        totalAmount: invoice.totalAmount,
        totalWithholdingTax: invoice.totalWithholdingTax,
        totalExtraTax: invoice.totalExtraTax,
        totalFurtherTax: invoice.totalFurtherTax,
        totalFED: invoice.totalFED,
        items: invoice.items.map(item => ({
          description: item.description,
          hsCode: item.hsCode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          unitOfMeasurement: item.unitOfMeasurement,
          discount: item.discount || 0,
          valueSalesExcludingST: item.valueSalesExcludingST || 0,
          salesTaxApplicable: item.salesTaxApplicable || 0,
          salesTaxWithheldAtSource: item.salesTaxWithheldAtSource || 0,
          extraTax: item.extraTax || 0,
          furtherTax: item.furtherTax || 0,
          fedPayable: item.fedPayable || 0,
          totalValue: item.totalValue || 0,
          saleType: item.saleType || 'Standard',
          sroScheduleNo: item.sroScheduleNo || '',
          sroItemSerialNo: item.sroItemSerialNo || '',
          fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice || 0,
          productName: item.description
        }))
      }

      let response
      let savedInvoice: any
      
      // Check if this is a new invoice or an existing one
      if (invoice.isNew) {
        // Create new invoice
        response = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error?.message || 'Failed to save invoice')
        }
        
        savedInvoice = await response.json()
        
        // Update the invoice in state with all the returned data
        setInvoices(prev => prev.map(inv => {
          if (inv.id === invoiceId) {
            return {
              ...inv,
              id: savedInvoice.invoice.id,
              invoiceNumber: savedInvoice.invoice.invoiceNumber,
              isEditing: false,
              isNew: false,
              status: 'SAVED', // Always set to SAVED after successful save
              // Update all fields from the saved invoice to ensure state persistence
              customerId: savedInvoice.invoice.customerId,
              customerName: savedInvoice.invoice.customer?.name,
              invoiceDate: format(new Date(savedInvoice.invoice.invoiceDate), 'yyyy-MM-dd'),
              dueDate: format(new Date(savedInvoice.invoice.dueDate), 'yyyy-MM-dd'),
              items: savedInvoice.invoice.items.map((item: any) => ({
                ...item,
                id: item.id,
                showAdditionalTaxes: false // Reset additional taxes view
              })),
              subtotal: savedInvoice.invoice.subtotal || 0,
              taxAmount: savedInvoice.invoice.taxAmount || 0,
              totalAmount: savedInvoice.invoice.totalAmount || 0,
              // Preserve FBR fields
              documentType: savedInvoice.invoice.documentType || inv.documentType,
              scenarioId: savedInvoice.invoice.scenarioId || inv.scenarioId,
              paymentMode: savedInvoice.invoice.paymentMode || inv.paymentMode,
              taxPeriod: savedInvoice.invoice.taxPeriod || inv.taxPeriod,
              fbrBuyerNTN: savedInvoice.invoice.fbrBuyerNTN || inv.fbrBuyerNTN,
              fbrBuyerCNIC: savedInvoice.invoice.fbrBuyerCNIC || inv.fbrBuyerCNIC,
              fbrBuyerPassport: savedInvoice.invoice.fbrBuyerPassport || inv.fbrBuyerPassport,
              fbrBuyerType: savedInvoice.invoice.fbrBuyerType || inv.fbrBuyerType,
              fbrBuyerCity: savedInvoice.invoice.fbrBuyerCity || inv.fbrBuyerCity,
              fbrBuyerProvince: savedInvoice.invoice.fbrBuyerProvince || inv.fbrBuyerProvince,
              fbrBuyerAddress: savedInvoice.invoice.fbrBuyerAddress || inv.fbrBuyerAddress,
              fbrBuyerContact: savedInvoice.invoice.fbrBuyerContact || inv.fbrBuyerContact,
              fbrBuyerEmail: savedInvoice.invoice.fbrBuyerEmail || inv.fbrBuyerEmail,
              notes: savedInvoice.invoice.notes || inv.notes
            }
          }
          return inv
        }))
      } else {
        // Update existing invoice
        response = await fetch(`/api/invoices/${invoiceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoiceData)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error?.message || 'Failed to update invoice')
        }
        
        savedInvoice = await response.json()
        
        // Update the invoice in state with the updated data
        setInvoices(prev => prev.map(inv => {
          if (inv.id === invoiceId) {
            return {
              ...inv,
              isEditing: false,
              status: 'SAVED', // Always set to SAVED after successful save
              // Update all fields from the saved invoice to ensure state persistence
              customerId: savedInvoice.invoice.customerId,
              customerName: savedInvoice.invoice.customer?.name,
              invoiceDate: format(new Date(savedInvoice.invoice.invoiceDate), 'yyyy-MM-dd'),
              dueDate: format(new Date(savedInvoice.invoice.dueDate), 'yyyy-MM-dd'),
              items: savedInvoice.invoice.items.map((item: any) => ({
                ...item,
                id: item.id,
                showAdditionalTaxes: false // Reset additional taxes view
              })),
              subtotal: savedInvoice.invoice.subtotal || 0,
              taxAmount: savedInvoice.invoice.taxAmount || 0,
              totalAmount: savedInvoice.invoice.totalAmount || 0,
              // Preserve FBR fields
              documentType: savedInvoice.invoice.documentType || inv.documentType,
              scenarioId: savedInvoice.invoice.scenarioId || inv.scenarioId,
              paymentMode: savedInvoice.invoice.paymentMode || inv.paymentMode,
              taxPeriod: savedInvoice.invoice.taxPeriod || inv.taxPeriod,
              fbrBuyerNTN: savedInvoice.invoice.fbrBuyerNTN || inv.fbrBuyerNTN,
              fbrBuyerCNIC: savedInvoice.invoice.fbrBuyerCNIC || inv.fbrBuyerCNIC,
              fbrBuyerPassport: savedInvoice.invoice.fbrBuyerPassport || inv.fbrBuyerPassport,
              fbrBuyerType: savedInvoice.invoice.fbrBuyerType || inv.fbrBuyerType,
              fbrBuyerCity: savedInvoice.invoice.fbrBuyerCity || inv.fbrBuyerCity,
              fbrBuyerProvince: savedInvoice.invoice.fbrBuyerProvince || inv.fbrBuyerProvince,
              fbrBuyerAddress: savedInvoice.invoice.fbrBuyerAddress || inv.fbrBuyerAddress,
              fbrBuyerContact: savedInvoice.invoice.fbrBuyerContact || inv.fbrBuyerContact,
              fbrBuyerEmail: savedInvoice.invoice.fbrBuyerEmail || inv.fbrBuyerEmail,
              notes: savedInvoice.invoice.notes || inv.notes
            }
          }
          return inv
        }))
      }

      showSuccessToast('Success', `Invoice ${savedInvoice.invoice.invoiceNumber} saved successfully`)
    } catch (error) {
      console.error('Error saving invoice:', error)
      showErrorToast('Error', error instanceof Error ? error.message : 'Failed to save invoice')
    } finally {
      setSaving(prev => prev.filter(id => id !== invoiceId))
    }
  }

  const validateInvoice = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice || invoice.isNew) return

    setValidating(prev => [...prev, invoiceId])
    
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment: 'sandbox' })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to validate invoice')
      }

      const result = await response.json()
      
      // Update invoice status
      setInvoices(prev => prev.map(inv => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'VALIDATED',
            fbrStatus: 'VALIDATED',
            fbrInvoiceNumber: result.fbrInvoiceNumber
          }
        }
        return inv
      }))

      showSuccessToast('Success', 'Invoice validated successfully with FBR')
    } catch (error) {
      console.error('Error validating invoice:', error)
      
      // Update invoice with error status
      setInvoices(prev => prev.map(inv => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'FAILED',
            fbrStatus: 'ERROR',
            fbrErrorMessage: error instanceof Error ? error.message : 'Validation failed'
          }
        }
        return inv
      }))
      
      // Refresh the invoice list to ensure the state persists
      setTimeout(() => {
        fetchInvoices()
      }, 500)

      // Show error toast
      showErrorToast('Validation Error', error instanceof Error ? error.message : 'Failed to validate invoice')
      
      // Store error details for modal
      const invoice = invoices.find(inv => inv.id === invoiceId)
      if (invoice) {
        setErrorModal({
          open: true,
          invoice,
          error: error instanceof Error ? error.message : 'Validation failed',
          details: {
            type: 'validation',
            environment: 'sandbox',
            timestamp: new Date().toISOString(),
            error: error
          }
        })
      }
    } finally {
      setValidating(prev => prev.filter(id => id !== invoiceId))
    }
  }

  const publishInvoice = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) return

    setPublishing(prev => [...prev, invoiceId])
    
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment: 'production' })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to publish invoice')
      }

      const result = await response.json()
      
      // Update invoice status
      setInvoices(prev => prev.map(inv => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'PUBLISHED',
            fbrStatus: 'PUBLISHED',
            fbrInvoiceNumber: result.fbrInvoiceNumber
          }
        }
        return inv
      }))
      
      // Refresh the invoice list to ensure the state persists
      setTimeout(() => {
        fetchInvoices()
      }, 500)

      showSuccessToast('Success', 'Invoice published to FBR production')
    } catch (error) {
      console.error('Error publishing invoice:', error)
      // Show error toast
      showErrorToast('Publish Error', error instanceof Error ? error.message : 'Failed to publish invoice')
      
      // Store error details for modal
      const invoice = invoices.find(inv => inv.id === invoiceId)
      if (invoice) {
        setErrorModal({
          open: true,
          invoice,
          error: error instanceof Error ? error.message : 'Failed to publish invoice',
          details: {
            type: 'publish',
            environment: 'production',
            timestamp: new Date().toISOString(),
            error: error
          }
        })
      }
    } finally {
      setPublishing(prev => prev.filter(id => id !== invoiceId))
    }
  }

  const deleteInvoice = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) return

    if (!invoice.isNew) {
      try {
        const response = await fetch(`/api/invoices/${invoiceId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to delete invoice')
        }
      } catch (error) {
        console.error('Error deleting invoice:', error)
        showErrorToast('Error', error instanceof Error ? error.message : 'Failed to delete invoice')
        return
      }
    }

    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId))
    
    showSuccessToast('Success', 'Invoice deleted successfully')
  }

  const bulkValidateInvoices = async () => {
    if (selectedInvoices.length === 0) {
      showErrorToast('Error', 'Please select at least one invoice to validate')
      return
    }

    setBulkValidating(true)
    
    try {
      const results = await Promise.allSettled(
        selectedInvoices.map(async (invoiceId) => {
          const invoice = invoices.find(inv => inv.id === invoiceId)
          if (!invoice || invoice.isNew || invoice.status !== 'SAVED') {
            throw new Error(`Invoice ${invoice?.invoiceNumber || invoiceId} is not in a valid state for validation`)
          }

          const response = await fetch(`/api/invoices/${invoiceId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ environment: 'sandbox' })
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to validate invoice')
          }

          return { invoiceId, success: true, result: await response.json() }
        })
      )

      // Update invoice statuses based on results
      const successfulValidations: string[] = []
      const failedValidations: ValidationError[] = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulValidations.push(result.value.invoiceId)
          setInvoices(prev => prev.map(inv => {
            if (inv.id === result.value.invoiceId) {
              return {
                ...inv,
                status: 'VALIDATED',
                fbrStatus: 'VALIDATED',
                fbrInvoiceNumber: result.value.result.fbrInvoiceNumber
              }
            }
            return inv
          }))
        } else {
          const invoiceId = selectedInvoices[index]
          const errorReason = result.reason as any
          let errorMessage: string
          
          try {
            if (typeof errorReason?.message === 'string') {
              errorMessage = errorReason.message
            } else if (typeof errorReason === 'string') {
              errorMessage = errorReason
            } else if (errorReason && typeof errorReason.toString === 'function') {
              errorMessage = errorReason.toString()
            } else {
              errorMessage = 'Unknown validation error'
            }
          } catch (e) {
            errorMessage = 'Unknown validation error'
          }
          
          failedValidations.push({ id: invoiceId, error: errorMessage } as ValidationError)
          setInvoices(prev => prev.map(inv => {
            if (inv.id === invoiceId) {
              return {
                ...inv,
                status: 'FAILED',
                fbrStatus: 'ERROR',
                fbrErrorMessage: (result.reason as any)?.message || (result.reason as any)?.toString() || 'Unknown validation error'
              }
            }
            return inv
          }))
          
          // Store error details for modal
          const invoice = invoices.find(inv => inv.id === invoiceId)
          if (invoice) {
            setErrorModal({
              open: true,
              invoice,
              error: errorMessage,
              details: {
                type: 'bulk_validation',
                environment: 'sandbox',
                timestamp: new Date().toISOString(),
                error: result.reason,
                errorMessage
              }
            })
          }
        }
      })

      // Show summary message
      if (successfulValidations.length > 0) {
        showSuccessToast(
          'Bulk Validation Complete',
          `${successfulValidations.length} invoice(s) validated successfully`
        )
      }
      
      if (failedValidations.length > 0) {
        showErrorToast(
          'Validation Errors',
          `${failedValidations.length} invoice(s) failed to validate`
        )
      }

      // Clear selection after operation
      setSelectedInvoices([])
    } catch (error) {
      console.error('Error during bulk validation:', error)
      showErrorToast('Error', 'Bulk validation failed')
    } finally {
      setBulkValidating(false)
    }
  }

  const bulkPublishInvoices = async () => {
    if (selectedInvoices.length === 0) {
      showErrorToast('Error', 'Please select at least one invoice to publish')
      return
    }

    setBulkPublishing(true)
    
    try {
      const results = await Promise.allSettled(
        selectedInvoices.map(async (invoiceId) => {
          const invoice = invoices.find(inv => inv.id === invoiceId)
          if (!invoice || invoice.status !== 'VALIDATED') {
            throw new Error(`Invoice ${invoice?.invoiceNumber || invoiceId} must be validated before publishing`)
          }

          const response = await fetch(`/api/invoices/${invoiceId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ environment: 'production' })
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to publish invoice')
          }

          return { invoiceId, success: true, result: await response.json() }
        })
      )

      // Update invoice statuses based on results
      const successfulPublications: string[] = []
      const failedPublications: PublicationError[] = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulPublications.push(result.value.invoiceId)
          setInvoices(prev => prev.map(inv => {
            if (inv.id === result.value.invoiceId) {
              return {
                ...inv,
                status: 'PUBLISHED',
                fbrStatus: 'PUBLISHED',
                fbrInvoiceNumber: result.value.result.fbrInvoiceNumber
              }
            }
            return inv
          }))
        } else {
          const invoiceId = selectedInvoices[index]
          const errorReason = result.reason as any
          let errorMessage: string
          
          try {
            if (typeof errorReason?.message === 'string') {
              errorMessage = errorReason.message
            } else if (typeof errorReason === 'string') {
              errorMessage = errorReason
            } else if (errorReason && typeof errorReason.toString === 'function') {
              errorMessage = errorReason.toString()
            } else {
              errorMessage = 'Unknown publishing error'
            }
          } catch (e) {
            errorMessage = 'Unknown publishing error'
          }
          
          failedPublications.push({ id: invoiceId, error: errorMessage } as PublicationError)
          setInvoices(prev => prev.map(inv => {
            if (inv.id === invoiceId) {
              return {
                ...inv,
                status: 'FAILED',
                fbrStatus: 'ERROR',
                fbrErrorMessage: (result.reason as any)?.message || (result.reason as any)?.toString() || 'Unknown publishing error'
              }
            }
            return inv
          }))
          
          // Store error details for modal
          const invoice = invoices.find(inv => inv.id === invoiceId)
          if (invoice) {
            setErrorModal({
              open: true,
              invoice,
              error: errorMessage,
              details: {
                type: 'bulk_publish',
                environment: 'production',
                timestamp: new Date().toISOString(),
                error: result.reason,
                errorMessage
              }
            })
          }
        }
      })

      // Show summary message
      if (successfulPublications.length > 0) {
        showSuccessToast(
          'Bulk Publishing Complete',
          `${successfulPublications.length} invoice(s) published to FBR production`
        )
      }
      
      if (failedPublications.length > 0) {
        showErrorToast(
          'Publishing Errors',
          `${failedPublications.length} invoice(s) failed to publish`
        )
      }

      // Clear selection after operation
      setSelectedInvoices([])
    } catch (error) {
      console.error('Error during bulk publishing:', error)
      showErrorToast('Error', 'Bulk publishing failed')
    } finally {
      setBulkPublishing(false)
    }
  }

  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices(prev =>
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    )
  }

  const viewInvoiceJson = async (invoice: Invoice) => {
    // Convert the invoice to FBR format before displaying
    const fbrFormatInvoice = await convertToFbrFormat(invoice)
    setJsonViewInvoice(fbrFormatInvoice)
  }

  const selectAllInvoices = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id))
    }
  }

  const getStatusBadge = (status: string, fbrStatus?: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'DRAFT': 'outline',
      'SAVED': 'default',
      'VALIDATED': 'secondary',
      'PUBLISHED': 'default',
      'FAILED': 'destructive',
      'PENDING': 'outline',
      'SUBMITTED': 'secondary',
      'ERROR': 'destructive'
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
        {fbrStatus && fbrStatus !== status && ` (${fbrStatus})`}
      </Badge>
    )
  }

  const filteredInvoices = invoices.filter(inv => {
    if (dateFilter && !inv.invoiceDate.includes(dateFilter)) return false
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading invoices...</p>
        </div>
      </div>
    )
  }

  return (
    <ClientWrapper fallback={
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Rapid Invoice Creator</h2>
          <Button onClick={addNewInvoice} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading invoice creator...</p>
          </div>
        </div>
      </div>
    }>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Rapid Invoice Creator</h2>
          <Button onClick={addNewInvoice} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Date Filter</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Filter by date"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Status Filter</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SAVED">Saved</SelectItem>
                  <SelectItem value="VALIDATED">Validated</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                {selectedInvoices.length} invoice(s) selected
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={bulkValidateInvoices}
                  disabled={bulkValidating}
                >
                  {bulkValidating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2"></div>
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Validate Selected
                </Button>
                <Button
                  size="sm"
                  onClick={bulkPublishInvoices}
                  disabled={bulkPublishing}
                >
                  {bulkPublishing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2"></div>
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Publish Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  <button
                    onClick={selectAllInvoices}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0 ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FBR Invoice #
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <React.Fragment key={invoice.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleInvoiceSelection(invoice.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {selectedInvoices.includes(invoice.id) ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {invoice.fbrInvoiceNumber ? (
                        <span className="font-medium text-green-600">{invoice.fbrInvoiceNumber}</span>
                      ) : (
                        <span className="text-gray-400">Not submitted</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {invoice.isEditing ? (
                        <Input
                          value={invoice.invoiceNumber || ''}
                          onChange={(e) => updateInvoice(invoice.id, 'invoiceNumber', e.target.value)}
                          placeholder="Auto-generated"
                          disabled
                        />
                      ) : (
                        <span className="font-medium">{invoice.invoiceNumber || 'Draft'}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {invoice.isEditing ? (
                        <Select
                          value={invoice.customerId || ''}
                          onValueChange={(value) => updateInvoice(invoice.id, 'customerId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        invoice.customerName || 'No customer'
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {invoice.isEditing ? (
                        <Input
                          type="date"
                          value={invoice.invoiceDate}
                          onChange={(e) => updateInvoice(invoice.id, 'invoiceDate', e.target.value)}
                        />
                      ) : (
                        invoice.invoiceDate
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <div className="space-y-1">
                        {invoice.items.map((item, index) => (
                          <div key={item.id} className="text-xs bg-gray-50 p-1 rounded">
                            {item.description || 'New item'} - {item.quantity} x {item.unitPrice}
                          </div>
                        ))}
                        {invoice.isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addInvoiceItem(invoice.id)}
                            className="text-xs h-6"
                          >
                            + Add Item
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      {invoice.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {getStatusBadge(invoice.status, invoice.fbrStatus)}
                      {invoice.fbrErrorMessage && (
                        <Alert className="mt-1 py-1 cursor-pointer hover:bg-red-50 transition-colors" onClick={() => {
                          setErrorModal({
                            open: true,
                            invoice,
                            error: invoice.fbrErrorMessage || 'Unknown error',
                            details: {
                              type: 'stored_error',
                              timestamp: new Date().toISOString(),
                              error: invoice.fbrErrorMessage
                            }
                          })
                        }}>
                          <AlertCircle className="h-3 w-3" />
                          <AlertDescription className="text-xs">
                            {invoice.fbrErrorMessage} (Click for details)
                          </AlertDescription>
                        </Alert>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1">
                        {invoice.isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveInvoice(invoice.id)}
                              disabled={saving.includes(invoice.id)}
                              title="Save Invoice"
                              className={invoice.status === 'DRAFT' ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : ''}
                            >
                              {saving.includes(invoice.id) ? (
                                <div className="animate-spin h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (invoice.isNew) {
                                  deleteInvoice(invoice.id)
                                } else {
                                  updateInvoice(invoice.id, 'isEditing', false)
                                  // For existing invoices, refresh the data to discard changes
                                  if (!invoice.isNew) {
                                    fetchInvoices()
                                  }
                                }
                              }}
                              title={invoice.isNew ? "Delete Invoice" : "Cancel Editing"}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            {/* Save button for DRAFT invoices */}
                            {invoice.status === 'DRAFT' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => saveInvoice(invoice.id)}
                                disabled={saving.includes(invoice.id)}
                                title="Save Invoice"
                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              >
                                {saving.includes(invoice.id) ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent mr-2"></div>
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateInvoice(invoice.id, 'isEditing', true)}
                              title="Edit Invoice"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            
                            {/* FBR Action Buttons - Only show for non-editing invoices */}
                            {invoice.status === 'SAVED' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => validateInvoice(invoice.id)}
                                disabled={validating.includes(invoice.id)}
                                title="Validate with FBR Sandbox"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                {validating.includes(invoice.id) ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            
                            {invoice.status === 'VALIDATED' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => publishInvoice(invoice.id)}
                                disabled={publishing.includes(invoice.id)}
                                title="Submit to FBR Production"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                {publishing.includes(invoice.id) ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            
                            {/* PDF Download Button - Show for all saved/validated/published invoices */}
                            {(invoice.status === 'SAVED' || invoice.status === 'VALIDATED' || invoice.status === 'PUBLISHED') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={async () => {
                                  try {
                                    const response = await fetch(`/api/invoices/${invoice.id}/pdf`)
                                    if (!response.ok) throw new Error('Failed to generate PDF')
                                    const blob = await response.blob()
                                    const url = window.URL.createObjectURL(blob)
                                    const link = document.createElement('a')
                                    link.href = url
                                    link.download = `Invoice-${invoice.invoiceNumber || invoice.id}-${Date.now()}.pdf`
                                    document.body.appendChild(link)
                                    link.click()
                                    document.body.removeChild(link)
                                    window.URL.revokeObjectURL(url)
                                  } catch (error) {
                                    console.error('PDF download error:', error)
                                    alert('Failed to download PDF')
                                  }
                                }}
                                title="Download PDF"
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {/* Dot menu with additional options */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" title="More Options">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => viewInvoiceJson(invoice)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View JSON
                                </DropdownMenuItem>
                                {invoice.fbrInvoiceNumber && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      navigator.clipboard.writeText(invoice.fbrInvoiceNumber!)
                                      alert('FBR Invoice Number copied to clipboard!')
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Copy FBR Invoice #
                                  </DropdownMenuItem>
                                )}
                                {(['DRAFT', 'SAVED', 'FAILED'].includes(invoice.status) && !invoice.fbrSubmitted) && (
                                  <DropdownMenuItem
                                    onClick={() => deleteInvoice(invoice.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded row for editing items */}
                  {invoice.isEditing && (
                    <tr>
                      <td colSpan={9} className="px-4 py-2 bg-gray-50">
                        <div className="space-y-4">
                          {/* FBR Compliance Fields */}
                          <div className="border-b pb-2">
                            <h4 className="font-medium text-sm mb-2">FBR Compliance Fields</h4>
                            <div className="grid grid-cols-4 gap-2">
                              <div>
                                <label className="text-xs font-medium">Document Type</label>
                                <Select
                                  value={invoice.documentType || 'Sale Invoice'}
                                  onValueChange={(value) => updateInvoice(invoice.id, 'documentType', value)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Document Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Sale Invoice">Sale Invoice</SelectItem>
                                    <SelectItem value="Debit Note">Debit Note</SelectItem>
                                    <SelectItem value="Credit Note">Credit Note</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-xs font-medium">Scenario ID</label>
                                <Input
                                  value={invoice.scenarioId || ''}
                                  onChange={(e) => updateInvoice(invoice.id, 'scenarioId', e.target.value)}
                                  placeholder="SN001"
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium">Payment Mode</label>
                                <Select
                                  value={invoice.paymentMode || '1'}
                                  onValueChange={(value) => updateInvoice(invoice.id, 'paymentMode', value)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Payment Mode" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Cash</SelectItem>
                                    <SelectItem value="2">Credit Card</SelectItem>
                                    <SelectItem value="3">Debit Card</SelectItem>
                                    <SelectItem value="4">Cheque</SelectItem>
                                    <SelectItem value="5">Bank Transfer</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-xs font-medium">Tax Period</label>
                                <Input
                                  value={invoice.taxPeriod || ''}
                                  onChange={(e) => updateInvoice(invoice.id, 'taxPeriod', e.target.value)}
                                  placeholder="2025-01"
                                  className="h-8"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* FBR Buyer Information */}
                          <div className="border-b pb-2">
                            <h4 className="font-medium text-sm mb-2">FBR Buyer Information</h4>
                            <div className="grid grid-cols-4 gap-2">
                              <div>
                                <label className="text-xs font-medium">Buyer Type</label>
                                <Select
                                  value={invoice.fbrBuyerType || '1'}
                                  onValueChange={(value) => updateInvoice(invoice.id, 'fbrBuyerType', value)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Buyer Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">NTN</SelectItem>
                                    <SelectItem value="2">CNIC</SelectItem>
                                    <SelectItem value="3">Passport</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Show NTN field only when NTN is selected */}
                              {invoice.fbrBuyerType === '1' && (
                                <div>
                                  <label className="text-xs font-medium">Buyer NTN</label>
                                  <Input
                                    value={invoice.fbrBuyerNTN || ''}
                                    onChange={(e) => updateInvoice(invoice.id, 'fbrBuyerNTN', e.target.value)}
                                    placeholder="Buyer NTN"
                                    className="h-8"
                                  />
                                </div>
                              )}
                              
                              {/* Show CNIC field only when CNIC is selected */}
                              {invoice.fbrBuyerType === '2' && (
                                <div>
                                  <label className="text-xs font-medium">Buyer CNIC</label>
                                  <Input
                                    value={invoice.fbrBuyerCNIC || ''}
                                    onChange={(e) => updateInvoice(invoice.id, 'fbrBuyerCNIC', e.target.value)}
                                    placeholder="Buyer CNIC"
                                    className="h-8"
                                  />
                                </div>
                              )}
                              
                              {/* Show Passport field only when Passport is selected */}
                              {invoice.fbrBuyerType === '3' && (
                                <div>
                                  <label className="text-xs font-medium">Buyer Passport</label>
                                  <Input
                                    value={invoice.fbrBuyerPassport || ''}
                                    onChange={(e) => updateInvoice(invoice.id, 'fbrBuyerPassport', e.target.value)}
                                    placeholder="Buyer Passport"
                                    className="h-8"
                                  />
                                </div>
                              )}
                              
                              <div>
                                <label className="text-xs font-medium">Buyer City</label>
                                <Input
                                  value={invoice.fbrBuyerCity || ''}
                                  onChange={(e) => updateInvoice(invoice.id, 'fbrBuyerCity', e.target.value)}
                                  placeholder="Buyer City"
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium">Buyer Province</label>
                                <Input
                                  value={invoice.fbrBuyerProvince || ''}
                                  onChange={(e) => updateInvoice(invoice.id, 'fbrBuyerProvince', e.target.value)}
                                  placeholder="Buyer Province"
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium">Buyer Address</label>
                                <Input
                                  value={invoice.fbrBuyerAddress || ''}
                                  onChange={(e) => updateInvoice(invoice.id, 'fbrBuyerAddress', e.target.value)}
                                  placeholder="Buyer Address"
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium">Buyer Contact</label>
                                <Input
                                  value={invoice.fbrBuyerContact || ''}
                                  onChange={(e) => updateInvoice(invoice.id, 'fbrBuyerContact', e.target.value)}
                                  placeholder="Buyer Contact"
                                  className="h-8"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* FBR Invoice Number Display */}
                          {invoice.fbrInvoiceNumber && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-sm mb-1 text-green-800">FBR Invoice Number</h4>
                                  <p className="text-green-700 font-mono">{invoice.fbrInvoiceNumber}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    navigator.clipboard.writeText(invoice.fbrInvoiceNumber!)
                                    alert('FBR Invoice Number copied to clipboard!')
                                  }}
                                  className="text-green-700 border-green-300 hover:bg-green-100"
                                >
                                  Copy
                                </Button>
                              </div>
                              <p className="text-xs text-green-600 mt-2">This invoice has been submitted to FBR</p>
                            </div>
                          )}
                          
                          {/* Quick Actions - Always visible in expanded view */}
                          {invoice.status !== 'DRAFT' && (
                            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <h4 className="font-medium text-sm mb-2 text-gray-700">Quick Actions</h4>
                              <div className="flex flex-wrap gap-2">
                                {invoice.status === 'SAVED' && (
                                  <Button
                                    size="sm"
                                    onClick={() => validateInvoice(invoice.id)}
                                    disabled={validating.includes(invoice.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    {validating.includes(invoice.id) ? (
                                      <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2"></div>
                                        Validating...
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-3 w-3 mr-2" />
                                        Validate with FBR
                                      </>
                                    )}
                                  </Button>
                                )}
                                
                                {invoice.status === 'VALIDATED' && (
                                  <Button
                                    size="sm"
                                    onClick={() => publishInvoice(invoice.id)}
                                    disabled={publishing.includes(invoice.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    {publishing.includes(invoice.id) ? (
                                      <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2"></div>
                                        Submitting...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="h-3 w-3 mr-2" />
                                        Submit to FBR
                                      </>
                                    )}
                                  </Button>
                                )}
                                
                                {(invoice.status === 'SAVED' || invoice.status === 'VALIDATED' || invoice.status === 'PUBLISHED') && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(`/api/invoices/${invoice.id}/pdf`)
                                        if (!response.ok) throw new Error('Failed to generate PDF')
                                        const blob = await response.blob()
                                        const url = window.URL.createObjectURL(blob)
                                        const link = document.createElement('a')
                                        link.href = url
                                        link.download = `Invoice-${invoice.invoiceNumber || invoice.id}-${Date.now()}.pdf`
                                        document.body.appendChild(link)
                                        link.click()
                                        document.body.removeChild(link)
                                        window.URL.revokeObjectURL(url)
                                      } catch (error) {
                                        console.error('PDF download error:', error)
                                        alert('Failed to download PDF')
                                      }
                                    }}
                                    className="text-purple-700 border-purple-300 hover:bg-purple-50"
                                  >
                                    <Download className="h-3 w-3 mr-2" />
                                    Download PDF
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Invoice Items */}
                          <div>
                            <h4 className="font-medium text-sm mb-2">Invoice Items</h4>
                            {invoice.items.map((item, index) => (
                              <div key={item.id} className="grid grid-cols-8 gap-2 items-end">
                                <div>
                                  <label className="text-xs font-medium">Product</label>
                                  <Select
                                    value={item.productId || ''}
                                    onValueChange={(value) => updateInvoiceItem(invoice.id, item.id, 'productId', value)}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                          {product.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-xs font-medium">Description</label>
                                  <Input
                                    value={item.description}
                                    onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'description', e.target.value)}
                                    placeholder="Item description"
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-medium">HS Code</label>
                                  {item.productId ? (
                                    <Input
                                      value={item.hsCode || ''}
                                      disabled
                                      className="h-8 bg-gray-50"
                                      title="HS Code is inherited from the selected product"
                                    />
                                  ) : (
                                    <Input
                                      value={item.hsCode || ''}
                                      onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'hsCode', e.target.value)}
                                      placeholder="Enter HS Code"
                                      className="h-8"
                                    />
                                  )}
                                </div>
                                <div>
                                  <label className="text-xs font-medium">Quantity</label>
                                  <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-medium">Unit Price</label>
                                  <Input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-medium">UOM</label>
                                  {item.productId ? (
                                    <Input
                                      value={item.unitOfMeasurement || 'PCS'}
                                      disabled
                                      className="h-8 bg-gray-50"
                                      title="Unit of Measurement is inherited from the selected product"
                                    />
                                  ) : (
                                    <Input
                                      value={item.unitOfMeasurement || 'PCS'}
                                      onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'unitOfMeasurement', e.target.value)}
                                      placeholder="Enter UOM"
                                      className="h-8"
                                    />
                                  )}
                                </div>
                                <div>
                                  <label className="text-xs font-medium">Tax Rate %</label>
                                  <Input
                                    type="number"
                                    value={item.taxRate}
                                    onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeInvoiceItem(invoice.id, item.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            
                            {/* Additional Tax Fields for each item - shown when toggle is on */}
                            {invoice.items.map((item) => (
                              item.showAdditionalTaxes && (
                                <div key={`taxes-${item.id}`} className="grid grid-cols-8 gap-2 items-end mt-2 p-2 bg-blue-50 rounded">
                                  <div>
                                    <label className="text-xs font-medium">Discount %</label>
                                    <Input
                                      type="number"
                                      value={item.discount || 0}
                                      onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'discount', parseFloat(e.target.value) || 0)}
                                      className="h-8"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium">Withholding Tax</label>
                                    <Input
                                      type="number"
                                      value={item.salesTaxWithheldAtSource || 0}
                                      onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'salesTaxWithheldAtSource', parseFloat(e.target.value) || 0)}
                                      className="h-8"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium">Extra Tax</label>
                                    <Input
                                      type="number"
                                      value={item.extraTax || 0}
                                      onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'extraTax', parseFloat(e.target.value) || 0)}
                                      className="h-8"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium">Further Tax</label>
                                    <Input
                                      type="number"
                                      value={item.furtherTax || 0}
                                      onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'furtherTax', parseFloat(e.target.value) || 0)}
                                      className="h-8"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium">FED</label>
                                    <Input
                                      type="number"
                                      value={item.fedPayable || 0}
                                      onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'fedPayable', parseFloat(e.target.value) || 0)}
                                      className="h-8"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium">Sale Type</label>
                                    <Select
                                      value={item.saleType || 'Standard'}
                                      onValueChange={(value) => updateInvoiceItem(invoice.id, item.id, 'saleType', value)}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Standard">Standard</SelectItem>
                                        <SelectItem value="Exempt">Exempt</SelectItem>
                                        <SelectItem value="Zero-rated">Zero-rated</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium">SRO Schedule</label>
                                    <Input
                                      value={item.sroScheduleNo || ''}
                                      onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'sroScheduleNo', e.target.value)}
                                      className="h-8"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium">SRO Item</label>
                                    <Input
                                      value={item.sroItemSerialNo || ''}
                                      onChange={(e) => updateInvoiceItem(invoice.id, item.id, 'sroItemSerialNo', e.target.value)}
                                      className="h-8"
                                    />
                                  </div>
                                </div>
                              )
                            ))}
                            <div className="flex justify-between items-center pt-2 border-t">
                              <div className="text-sm space-x-4">
                                <span>Subtotal: {invoice.subtotal.toFixed(2)}</span>
                                <span>Tax: {invoice.taxAmount.toFixed(2)}</span>
                                {invoice.totalWithholdingTax && invoice.totalWithholdingTax > 0 && (
                                  <span>Withholding Tax: {invoice.totalWithholdingTax.toFixed(2)}</span>
                                )}
                                {invoice.totalExtraTax && invoice.totalExtraTax > 0 && (
                                  <span>Extra Tax: {invoice.totalExtraTax.toFixed(2)}</span>
                                )}
                                {invoice.totalFurtherTax && invoice.totalFurtherTax > 0 && (
                                  <span>Further Tax: {invoice.totalFurtherTax.toFixed(2)}</span>
                                )}
                                {invoice.totalFED && invoice.totalFED > 0 && (
                                  <span>FED: {invoice.totalFED.toFixed(2)}</span>
                                )}
                                <span className="font-medium">Total: {invoice.totalAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Toggle additional taxes for all items
                                    const updatedItems = invoice.items.map(item => ({
                                      ...item,
                                      showAdditionalTaxes: !item.showAdditionalTaxes
                                    }))
                                    setInvoices(prev => prev.map(inv =>
                                      inv.id === invoice.id ? { ...inv, items: updatedItems } : inv
                                    ))
                                  }}
                                >
                                  {invoice.items.some(item => item.showAdditionalTaxes) ? 'Hide' : 'Show'} Additional Taxes
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addInvoiceItem(invoice.id)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Item
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No invoices found. Create your first invoice to get started.</p>
          </CardContent>
        </Card>
      )}

      {/* JSON View Dialog */}
      <Dialog open={!!jsonViewInvoice} onOpenChange={() => setJsonViewInvoice(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>FBR Format JSON Data</DialogTitle>
          </DialogHeader>
          {jsonViewInvoice && (
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(jsonViewInvoice, null, 2)}
            </pre>
          )}
        </DialogContent>
      </Dialog>

      {/* Error Modal Dialog */}
      <Dialog open={errorModal.open} onOpenChange={() => setErrorModal({ open: false, invoice: null, error: null, details: null })}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              FBR Error Details
            </DialogTitle>
          </DialogHeader>
          {errorModal.invoice && errorModal.error && (
            <div className="space-y-4">
              {/* Invoice Information */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Invoice Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Invoice #:</span> {errorModal.invoice.invoiceNumber || 'Draft'}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge variant="destructive" className="ml-2">{errorModal.invoice.status}</Badge>
                  </div>
                  {errorModal.invoice.customerName && (
                    <div>
                      <span className="font-medium">Customer:</span> {errorModal.invoice.customerName}
                    </div>
                  )}
                  {errorModal.invoice.fbrInvoiceNumber && (
                    <div>
                      <span className="font-medium">FBR Invoice #:</span> {errorModal.invoice.fbrInvoiceNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Error Summary */}
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <h3 className="font-medium text-sm mb-2 text-red-800">Error Summary</h3>
                <p className="text-sm text-red-700">{errorModal.error}</p>
              </div>

              {/* Error Details */}
              {errorModal.details && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-medium text-sm mb-2 text-blue-800">Technical Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Error Type:</span> {errorModal.details.type}
                    </div>
                    <div>
                      <span className="font-medium">Environment:</span> {errorModal.details.environment}
                    </div>
                    <div>
                      <span className="font-medium">Timestamp:</span> {new Date(errorModal.details.timestamp).toLocaleString()}
                    </div>
                    {errorModal.details.errorMessage && (
                      <div>
                        <span className="font-medium">Full Error Message:</span>
                        <pre className="mt-1 bg-white p-2 rounded text-xs overflow-auto border">
                          {errorModal.details.errorMessage}
                        </pre>
                      </div>
                    )}
                    {errorModal.details.error && (
                      <div>
                        <span className="font-medium">Error Object:</span>
                        <pre className="mt-1 bg-white p-2 rounded text-xs overflow-auto border">
                          {JSON.stringify(errorModal.details.error, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Invoice: ${errorModal.invoice?.invoiceNumber || 'Draft'}\nError: ${errorModal.error}\nTimestamp: ${errorModal.details?.timestamp}\n\nFull Details:\n${JSON.stringify(errorModal.details, null, 2)}`
                    )
                    alert('Error details copied to clipboard!')
                  }}
                >
                  Copy Error Details
                </Button>
                {errorModal.invoice?.status === 'FAILED' && (
                  <Button
                    onClick={() => {
                      setErrorModal({ open: false, invoice: null, error: null, details: null })
                      // Retry the operation based on the error type
                      if (errorModal.details?.type === 'validation') {
                        validateInvoice(errorModal.invoice!.id)
                      } else if (errorModal.details?.type === 'publish') {
                        publishInvoice(errorModal.invoice!.id)
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Retry Operation
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => setErrorModal({ open: false, invoice: null, error: null, details: null })}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </ClientWrapper>
  )
}

export default SpreadsheetInvoiceCreator