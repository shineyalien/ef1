'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Plus,
  Trash2,
  Calculator,
  Smartphone,
  Wifi,
  WifiOff,
  Save,
  Send,
  Search,
  Package,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  QrCode,
  Settings
} from "lucide-react"
import { useNetworkStatus } from '@/hooks/use-network-status'
import { useOfflineInvoices } from '@/hooks/use-offline'
import { useError } from '@/contexts/error-context'
import { useAutoSave } from '@/lib/auto-save'
import { syncService } from '@/lib/sync-service'
import { EnhancedProductSearch } from '@/components/enhanced-product-search'
import ErrorBoundary from '@/components/error-boundary'
import { PakistaniTaxCalculator } from '@/lib/fbr-integration'
import { QRCodeGenerator } from '@/lib/fbr-integration'
import { getApplicableScenarios, FBRScenario } from '@/lib/fbr-scenarios'

export default function MobileInvoiceForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { isOnline } = useNetworkStatus()
  const { saveOfflineInvoice, hasUnsyncedInvoices, syncStatus } = useOfflineInvoices()
  const {
    showErrorToast,
    showSuccessToast,
    handleAuthError,
    handleNetworkError,
    handleApiError,
    handleGenericError,
    handleValidationError
  } = useError()
  
  // Form state
  const [invoice, setInvoice] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    customerNTN: '',
    items: [{
      description: '',
      quantity: 1,
      price: 0,
      total: 0,
      hsCode: '',
      taxRate: 18,
      productId: ''
    }],
    subtotal: 0,
    tax: 0,
    extraTax: 0,
    total: 0,
    fbrScenario: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })
  
  // UI state
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('customer')
  const [formProgress, setFormProgress] = useState(0)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showFBRPreview, setShowFBRPreview] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<string>('')
  const [taxBreakdown, setTaxBreakdown] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  
  // Refs for swipe gestures
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  
  // Services
  const taxCalculator = useMemo(() => new PakistaniTaxCalculator(), [])
  const [availableScenarios, setAvailableScenarios] = useState<FBRScenario[]>([])
  const [selectedScenario, setSelectedScenario] = useState<FBRScenario | null>(null)
  
  // Auto-save functionality
  const formId = `invoice_${session?.user?.id}_${Date.now()}`
  const { updateData, saveNow, clearDraft } = useAutoSave(formId, {
    formType: 'invoice',
    debounceMs: 3000,
    onSave: (data) => {
      setLastSaved(new Date())
      setIsDirty(false)
      showSuccessToast('Auto-saved', 'Your invoice has been automatically saved')
    },
    onError: (error) => {
      showErrorToast('Auto-save failed', 'Failed to auto-save your invoice')
      console.error('Auto-save error:', error)
    }
  })

  // Initialize FBR scenarios
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      redirect('/auth/login')
      return
    }
    
    // Load FBR scenarios
    const scenarios = getApplicableScenarios('Manufacturer', 'Steel')
    setAvailableScenarios(scenarios.scenarios)
    
    // Set default scenario
    if (scenarios.defaultScenario) {
      const defaultScen = scenarios.scenarios.find(s => s.code === scenarios.defaultScenario)
      if (defaultScen) {
        setSelectedScenario(defaultScen)
        setInvoice(prev => ({ ...prev, fbrScenario: defaultScen.code }))
      }
    }
    
    calculateTotals()
  }, [session, status, invoice.items])

  // Calculate form progress
  useEffect(() => {
    let progress = 0
    
    // Customer info (30%)
    if (invoice.customerName) progress += 10
    if (invoice.customerEmail) progress += 5
    if (invoice.customerAddress) progress += 5
    if (invoice.customerNTN) progress += 10
    
    // Items (40%)
    if (invoice.items.length > 0) {
      progress += 10
      const validItems = invoice.items.filter(item => item.description && item.price > 0)
      progress += (validItems.length / invoice.items.length) * 30
    }
    
    // FBR compliance (20%)
    if (invoice.fbrScenario) progress += 10
    if (invoice.invoiceDate) progress += 5
    if (invoice.dueDate) progress += 5
    
    // Save status (10%)
    if (lastSaved) progress += 10
    
    setFormProgress(progress)
  }, [invoice, lastSaved])

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches && e.targetTouches[0]) {
      touchStartX.current = e.targetTouches[0].clientX
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchEndX.current = e.changedTouches[0].clientX
      handleSwipeGesture()
    }
  }

  const handleSwipeGesture = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe) {
      // Swipe left - go to next tab
      if (activeTab === 'customer') setActiveTab('items')
      else if (activeTab === 'items') setActiveTab('fbr')
      else if (activeTab === 'fbr') setActiveTab('preview')
    }
    
    if (isRightSwipe) {
      // Swipe right - go to previous tab
      if (activeTab === 'items') setActiveTab('customer')
      else if (activeTab === 'fbr') setActiveTab('items')
      else if (activeTab === 'preview') setActiveTab('fbr')
    }
  }

  const calculateTotals = useCallback(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0)
    
    // Calculate tax using FBR tax calculator
    const taxBreakdownData = invoice.items.map(item => ({
      valueSalesExcludingST: item.price * item.quantity,
      quantity: item.quantity,
      hsCode: item.hsCode,
      unitPrice: item.price
    }))
    
    let tax = 0
    let extraTax = 0
    
    try {
      if (selectedScenario && taxBreakdownData.length > 0) {
        const breakdown = taxCalculator.calculateTax(taxBreakdownData, 'Punjab')
        tax = breakdown.salesTax
        extraTax = breakdown.extraTax
        setTaxBreakdown(breakdown)
      } else {
        // Fallback to simple calculation
        tax = subtotal * 0.18 // 18% tax rate
      }
    } catch (error) {
      console.error('Tax calculation error:', error)
      tax = subtotal * 0.18 // Fallback
    }
    
    const total = subtotal + tax + extraTax
    
    setInvoice(prev => ({
      ...prev,
      subtotal,
      tax,
      extraTax,
      total
    }))
    
    // Mark form as dirty
    setIsDirty(true)
  }, [invoice.items, selectedScenario, taxCalculator])

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        price: 0,
        total: 0,
        hsCode: '',
        taxRate: 18,
        productId: ''
      }]
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
    
    // Ensure the item exists
    if (!newItems[index]) {
      newItems[index] = {
        description: '',
        quantity: 1,
        price: 0,
        total: 0,
        hsCode: '',
        taxRate: 18,
        productId: ''
      }
    }
    
    const currentItem = newItems[index]
    
    // Update the field
    if (field === 'description') {
      currentItem.description = value || ''
    } else if (field === 'quantity') {
      currentItem.quantity = value || 0
    } else if (field === 'price') {
      currentItem.price = value || 0
    } else if (field === 'hsCode') {
      currentItem.hsCode = value || ''
    } else if (field === 'taxRate') {
      currentItem.taxRate = value || 18
    } else if (field === 'productId') {
      currentItem.productId = value || ''
    }
    
    // Calculate total
    currentItem.total = currentItem.quantity * currentItem.price
    
    setInvoice(prev => ({ ...prev, items: newItems }))
    
    // Recalculate totals after updating the item
    setTimeout(() => {
      calculateTotals()
    }, 50)
    
    // Clear validation error for this field
    if (validationErrors[`items.${index}.${field}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`items.${index}.${field}`]
        return newErrors
      })
    }
  }

  // Handle product selection from enhanced search
  const handleProductSelect = useCallback((product: any, itemIndex: number) => {
    // DEBUG: Log the entire product object to understand its structure
    console.log('🔍 MOBILE DEBUG: Product object received:', product)
    console.log('🔍 MOBILE DEBUG: Product unitPrice field:', product.unitPrice)
    console.log('🔍 MOBILE DEBUG: Product price field:', product.price)
    
    updateItem(itemIndex, 'description', product.name)
    updateItem(itemIndex, 'price', product.unitPrice)
    updateItem(itemIndex, 'hsCode', product.hsCode)
    updateItem(itemIndex, 'taxRate', product.taxRate)
    updateItem(itemIndex, 'productId', product.id)
    
    console.log('🔍 MOBILE DEBUG: Price set to:', product.unitPrice)
    
    // Recalculate totals after updating the item
    setTimeout(() => {
      calculateTotals()
    }, 100)
    
    // Update auto-save
    updateData({ items: invoice.items })
  }, [invoice.items, updateData, calculateTotals])

  // Auto-save when form data changes
  useEffect(() => {
    if (isDirty) {
      updateData(invoice)
    }
  }, [invoice, isDirty, updateData])

  // Form validation
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {}
    
    // Customer validation
    if (!invoice.customerName.trim()) {
      errors.customerName = 'Customer name is required'
    }
    
    if (!invoice.customerEmail.trim()) {
      errors.customerEmail = 'Customer email is required'
    } else if (!/\S+@\S+\.\S+/.test(invoice.customerEmail)) {
      errors.customerEmail = 'Please enter a valid email address'
    }
    
    if (!invoice.customerAddress.trim()) {
      errors.customerAddress = 'Customer address is required'
    }
    
    // Items validation
    if (invoice.items.length === 0) {
      errors.items = 'At least one item is required'
    } else {
      invoice.items.forEach((item, index) => {
        if (!item.description.trim()) {
          errors[`items.${index}.description`] = 'Item description is required'
        }
        
        if (item.quantity <= 0) {
          errors[`items.${index}.quantity`] = 'Quantity must be greater than 0'
        }
        
        if (item.price <= 0) {
          errors[`items.${index}.price`] = 'Price must be greater than 0'
        }
      })
    }
    
    // FBR validation (if applicable)
    if (selectedScenario && selectedScenario.specialConditions && selectedScenario.specialConditions.length > 0) {
      if (!invoice.customerNTN.trim()) {
        errors.customerNTN = 'Customer NTN is required for this scenario'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [invoice, selectedScenario])

  // Generate QR code for FBR compliance
  const generateQRCode = useCallback(async () => {
    if (!invoice.invoiceNumber) {
      return ''
    }
    
    try {
      // Get business NTN from session user or use a default
      const businessNTN = (session?.user as any)?.businessNTN || 'DEFAULT_NTN'
      
      const qrData = await QRCodeGenerator.generateQRCodeAsDataURL(
        invoice.invoiceNumber,
        {
          sellerNTN: businessNTN,
          invoiceDate: invoice.invoiceDate || new Date().toISOString().split('T')[0] as string,
          totalAmount: invoice.total,
          buyerNTN: invoice.customerNTN || undefined
        }
      )
      
      setQrCodeData(qrData)
      return qrData
    } catch (error) {
      console.error('QR code generation error:', error)
      showErrorToast('QR Code Error', 'Failed to generate QR code for FBR compliance')
      return ''
    }
  }, [invoice.invoiceNumber, invoice.invoiceDate, invoice.total, invoice.customerNTN, session?.user, showErrorToast])

  const saveInvoice = async (isDraft: boolean = false) => {
    // Validate form first
    if (!validateForm()) {
      handleValidationError('Please fix the errors in the form before saving')
      return
    }
    
    setSaving(true)
    setIsLoading(true)
    
    try {
      // Generate invoice number if not present
      let invoiceNumber = invoice.invoiceNumber
      if (!invoiceNumber) {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        invoiceNumber = `INV-${year}${month}${day}-${random}`
      }
      
      const invoiceData = {
        ...invoice,
        invoiceNumber,
        isDraft,
        userId: session?.user?.id,
        businessId: (session?.user as any)?.businessId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fbrScenarioCode: invoice.fbrScenario,
        taxBreakdown
      }
      
      if (isOnline) {
        // Save to server
        const response = await fetch('/api/invoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: 'temp-id',
            invoiceDate: invoice.invoiceDate,
            dueDate: invoice.dueDate,
            invoiceNumber: invoiceNumber,
            items: invoice.items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.price,
              unitOfMeasurement: 'Each',
              taxRate: item.taxRate,
              hsCode: item.hsCode || '0000.00.00'
            })),
            subtotal: invoice.subtotal,
            taxAmount: invoice.tax,
            extraTaxAmount: invoice.extraTax,
            totalAmount: invoice.total,
            fbrScenarioCode: invoice.fbrScenario,
            isDraft
          })
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Failed to save invoice: ${response.statusText}`)
        }
        
        const savedInvoice = await response.json()
        
        // Generate QR code for FBR compliance
        if (!isDraft && savedInvoice.invoiceNumber) {
          await generateQRCode()
        }
        
        showSuccessToast('Success', 'Invoice saved successfully')
        
        // Reset form after successful save
        if (!isDraft) {
          resetForm()
          setActiveTab('customer')
          
          // Redirect to invoices list after 1.5 seconds
          setTimeout(() => {
            router.push('/invoices')
          }, 1500)
        }
        
        // Mark as not dirty
        setIsDirty(false)
      } else {
        // Save offline
        const offlineId = await saveOfflineInvoice(invoiceData)
        if (offlineId) {
          showSuccessToast('Saved Offline', 'Invoice will sync when online')
          
          // Mark as not dirty
          setIsDirty(false)
        } else {
          throw new Error('Failed to save invoice offline')
        }
      }
    } catch (error: any) {
      console.error('Save error:', error)
      
      // Handle different error types
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        handleNetworkError(error, 'Saving invoice')
      } else if (error.status === 401) {
        handleAuthError('Your session has expired. Please log in again.')
      } else if (error.status === 403) {
        showErrorToast('Permission Denied', 'You don\'t have permission to save invoices')
      } else if (error.status >= 500) {
        handleApiError(error, 'Saving invoice')
      } else {
        handleGenericError(error instanceof Error ? error : new Error('Failed to save invoice'), 'Saving invoice')
      }
    } finally {
      setSaving(false)
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setInvoice({
      customerName: '',
      customerEmail: '',
      customerAddress: '',
      customerNTN: '',
      items: [{
        description: '',
        quantity: 1,
        price: 0,
        total: 0,
        hsCode: '',
        taxRate: 18,
        productId: ''
      }],
      subtotal: 0,
      tax: 0,
      extraTax: 0,
      total: 0,
      fbrScenario: '',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
    
    // Clear validation errors
    setValidationErrors({})
    
    // Clear auto-save
    clearDraft()
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
    <ErrorBoundary>
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

        {/* Progress Indicator */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Form Progress</span>
              <span className="text-sm text-blue-600">{Math.round(formProgress)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
            {lastSaved && (
              <div className="flex items-center mt-2 text-xs text-blue-600">
                <Clock className="h-3 w-3 mr-1" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer" className="text-xs">Customer</TabsTrigger>
            <TabsTrigger value="items" className="text-xs">Items</TabsTrigger>
            <TabsTrigger value="fbr" className="text-xs">FBR</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
          </TabsList>
          
          {/* Customer Tab */}
          <TabsContent value="customer" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Customer Details</CardTitle>
                <CardDescription>Enter customer information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="customerName" className="text-sm font-medium">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={invoice.customerName}
                    onChange={(e) => setInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer name"
                    className={`mt-1 ${validationErrors.customerName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.customerName && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.customerName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customerEmail" className="text-sm font-medium">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={invoice.customerEmail}
                    onChange={(e) => setInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="customer@example.com"
                    className={`mt-1 ${validationErrors.customerEmail ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.customerEmail && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.customerEmail}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customerAddress" className="text-sm font-medium">Address</Label>
                  <Input
                    id="customerAddress"
                    value={invoice.customerAddress}
                    onChange={(e) => setInvoice(prev => ({ ...prev, customerAddress: e.target.value }))}
                    placeholder="Customer address"
                    className={`mt-1 ${validationErrors.customerAddress ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.customerAddress && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.customerAddress}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customerNTN" className="text-sm font-medium">NTN (Optional)</Label>
                  <Input
                    id="customerNTN"
                    value={invoice.customerNTN}
                    onChange={(e) => setInvoice(prev => ({ ...prev, customerNTN: e.target.value }))}
                    placeholder="Customer NTN"
                    className={`mt-1 ${validationErrors.customerNTN ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.customerNTN && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.customerNTN}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button
                onClick={() => setActiveTab('items')}
                className="w-full sm:w-auto"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </TabsContent>
          
          {/* Items Tab */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <TabsContent value="items" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Invoice Items</CardTitle>
                    <CardDescription>Add products or services</CardDescription>
                  </div>
                  <Button onClick={addItem} size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {validationErrors.items && (
                  <div className="bg-red-50 p-2 rounded text-sm text-red-600">
                    {validationErrors.items}
                  </div>
                )}
                
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
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Item description"
                        className={`text-sm ${validationErrors[`items.${index}.description`] ? 'border-red-500' : ''}`}
                      />
                      {validationErrors[`items.${index}.description`] && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors[`items.${index}.description`]}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">HS Code</Label>
                        <Input
                          value={item.hsCode}
                          onChange={(e) => updateItem(index, 'hsCode', e.target.value)}
                          placeholder="0000.00.00"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Tax Rate (%)</Label>
                        <Input
                          type="number"
                          value={item.taxRate}
                          onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 18)}
                          className="text-sm"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className={`text-sm ${validationErrors[`items.${index}.quantity`] ? 'border-red-500' : ''}`}
                          min="1"
                        />
                        {validationErrors[`items.${index}.quantity`] && (
                          <p className="text-xs text-red-500 mt-1">{validationErrors[`items.${index}.quantity`]}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs">Price</Label>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                          className={`text-sm ${validationErrors[`items.${index}.price`] ? 'border-red-500' : ''}`}
                          min="0"
                          step="0.01"
                        />
                        {validationErrors[`items.${index}.price`] && (
                          <p className="text-xs text-red-500 mt-1">{validationErrors[`items.${index}.price`]}</p>
                        )}
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
                    
                    {/* Enhanced Product Search */}
                    <EnhancedProductSearch
                      onSelect={(product) => handleProductSelect(product, index)}
                      placeholder="Search for products..."
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button
                onClick={() => setActiveTab('customer')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                onClick={() => setActiveTab('fbr')}
                className="w-full sm:w-auto"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            </TabsContent>
          </div>
          
          {/* FBR Tab */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <TabsContent value="fbr" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">FBR Compliance</CardTitle>
                <CardDescription>Configure tax and compliance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fbrScenario" className="text-sm font-medium">FBR Scenario</Label>
                  <Select value={invoice.fbrScenario} onValueChange={(value) => {
                    setInvoice(prev => ({ ...prev, fbrScenario: value }))
                    const scenario = availableScenarios.find(s => s.code === value)
                    setSelectedScenario(scenario || null)
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select FBR scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableScenarios.map(scenario => (
                        <SelectItem key={scenario.code} value={scenario.code}>
                          {scenario.code} - {scenario.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedScenario && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <p className="font-medium">Selected Scenario:</p>
                      <p>{selectedScenario.description}</p>
                      {selectedScenario.specialConditions && selectedScenario.specialConditions.length > 0 && (
                        <div className="mt-1">
                          <p className="font-medium">Special Conditions:</p>
                          <ul className="list-disc list-inside">
                            {selectedScenario.specialConditions.map((condition, idx) => (
                              <li key={idx}>{condition}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="invoiceDate" className="text-sm font-medium">Invoice Date</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={invoice.invoiceDate}
                      onChange={(e) => setInvoice(prev => ({ ...prev, invoiceDate: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoice.dueDate}
                      onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Tax Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>PKR {invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sales Tax:</span>
                  <span>PKR {invoice.tax.toFixed(2)}</span>
                </div>
                {invoice.extraTax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Extra Tax:</span>
                    <span>PKR {invoice.extraTax.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>PKR {invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button
                onClick={() => setActiveTab('items')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                onClick={() => setActiveTab('preview')}
                className="w-full sm:w-auto"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            </TabsContent>
          </div>
          
          {/* Preview Tab */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <TabsContent value="preview" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Invoice Preview</CardTitle>
                <CardDescription>Review your invoice before saving</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Customer Information</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Name:</span> {invoice.customerName}</p>
                    <p><span className="font-medium">Email:</span> {invoice.customerEmail}</p>
                    <p><span className="font-medium">Address:</span> {invoice.customerAddress}</p>
                    {invoice.customerNTN && <p><span className="font-medium">NTN:</span> {invoice.customerNTN}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Invoice Items</h3>
                  <div className="text-sm space-y-2">
                    {invoice.items.map((item, index) => (
                      <div key={index} className="border-b pb-2">
                        <p className="font-medium">{item.description}</p>
                        <div className="flex justify-between">
                          <span>{item.quantity} × PKR {item.price.toFixed(2)}</span>
                          <span>PKR {item.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Summary</h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>PKR {invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales Tax:</span>
                      <span>PKR {invoice.tax.toFixed(2)}</span>
                    </div>
                    {invoice.extraTax > 0 && (
                      <div className="flex justify-between">
                        <span>Extra Tax:</span>
                        <span>PKR {invoice.extraTax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total:</span>
                      <span>PKR {invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {qrCodeData && (
                  <div className="space-y-2">
                    <h3 className="font-medium">FBR QR Code</h3>
                    <div className="flex justify-center">
                      <img src={qrCodeData} alt="FBR QR Code" className="h-32 w-32" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button
                onClick={() => setActiveTab('fbr')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                onClick={() => saveNow()}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Save Now
              </Button>
            </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pb-6">
          <Button
            onClick={() => saveInvoice(true)}
            disabled={saving || isLoading}
            variant="outline"
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          
          <Button
            onClick={() => saveInvoice(false)}
            disabled={saving || isLoading || !isOnline}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {!isOnline ? 'Needs Internet' : 'Submit'}
          </Button>
        </div>
      </main>
      </div>
    </ErrorBoundary>
  )
}