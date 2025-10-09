'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Save, Send, Plus, Trash2,
  CheckCircle, AlertCircle, Loader2, Search
} from 'lucide-react'
import Link from 'next/link'
import { SharedLoading } from "@/components/shared-loading"
import { SharedNavigation } from "@/components/shared-navigation"
import { EnhancedProductSearch } from "@/components/enhanced-product-search"

// Dynamically import the error context and boundary to prevent SSR issues
// Note: useError is a hook, not a component, so we'll handle it differently

interface InvoiceItem {
  id: string
  description: string
  hsCode: string
  quantity: number
  unitPrice: number
  unitOfMeasurement: string
  taxRate: number
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
}

interface Customer {
  id: string
  name: string
  registrationType: 'REGISTERED' | 'UNREGISTERED'
  ntnCnic?: string
  address: string
  province: string
  phoneNumber?: string
  email?: string
}

interface LookupData {
  provinces: Array<{ stateProvinceCode: number; stateProvinceDesc: string }>
  hsCodes: Array<{ hS_CODE: string; description: string }>
  uoms: Array<{ uoM_ID: number; description: string }>
  documentTypes: Array<{ docTypeId: number; docDescription: string }>
}

// Import error context directly to avoid dynamic loading issues
import { useError } from '@/contexts/error-context'
import { generateUUID } from '@/lib/uuid'

export default function CreateInvoicePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  // Use error hooks directly
  const {
    showErrorToast,
    showSuccessToast,
    handleNetworkError,
    handleValidationError,
    handleApiError,
    handleGenericError
  } = useError()
  
  // State management
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  
  // Lookup data
  const [lookupData, setLookupData] = useState<LookupData | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerSearch, setCustomerSearch] = useState('')
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [availableUOMs, setAvailableUOMs] = useState<Record<string, Array<{ uoM_ID: number; description: string }>>>({}) // HS Code → UOMs mapping
  const [scenarios, setScenarios] = useState<Array<{ code: string; description: string; businessTypes?: string[]; sectors?: string[] }>>([])
  const [loadingScenarios, setLoadingScenarios] = useState(false)
  
  // Product search state - using enhanced search
  const [productSearchQueries, setProductSearchQueries] = useState<Record<string, string>>({}) // itemId → search query
  const [selectedProducts, setSelectedProducts] = useState<Record<string, any>>({}) // itemId → selected product
  const [productDropdownOpen, setProductDropdownOpen] = useState<Record<string, boolean>>({}) // itemId → dropdown open state
  
  // Ref to prevent duplicate selections
  const selectingProductRef = useRef<boolean>(false)
  const lastSelectedRef = useRef<{ productId: string; itemIndex: number; timestamp: number } | null>(null)
  
  // Invoice form data
  const [invoiceData, setInvoiceData] = useState({
    customerId: '',
    customerName: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentType: 'Sale Invoice',
    paymentMode: 'Cash',
    scenarioId: '',
    taxPeriod: new Date().toISOString().slice(0, 7), // YYYY-MM format
    invoiceRefNo: '', // For debit notes only
    notes: ''
  })
  
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: generateUUID(),
      description: '',
      hsCode: '',
      quantity: 1,
      unitPrice: 0,
      unitOfMeasurement: 'Each',
      taxRate: 18,
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
      fixedNotifiedValueOrRetailPrice: 0
    }
  ])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Close product dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Check if click is outside any dropdown
      if (!target.closest('.product-autocomplete-container')) {
        setProductDropdownOpen({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Load lookup data, customers, and products
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load customers
        try {
          const customersRes = await fetch('/api/customers')
          if (customersRes.ok) {
            const data = await customersRes.json()
            if (data.success) {
              setCustomers(data.customers || [])
              setFilteredCustomers(data.customers || [])
            } else {
              throw new Error(data.error?.message || 'Failed to load customers')
            }
          } else {
            throw new Error(`Failed to load customers: ${customersRes.status}`)
          }
        } catch (customerError) {
          console.error('Error loading customers:', customerError)
          handleApiError(customerError, 'Loading customers')
        }
        
        // Products are now loaded on-demand with enhanced search
        
        // Load scenarios based on user's business profile
        await loadScenarios()
      } catch (error) {
        console.error('Error loading data:', error)
        handleGenericError(error instanceof Error ? error : new Error('Failed to load required data'), 'Loading initial data')
        setError('Failed to load required data')
      } finally {
        setLoading(false)
      }
    }
    
    if (status === 'authenticated') {
      loadData()
    }
  }, [status])


  // Load FBR scenarios based on business type and sector
  const loadScenarios = async () => {
    try {
      setLoadingScenarios(true)
      
      // First, get user's business profile from settings API
      try {
        const businessRes = await fetch('/api/settings/business')
        if (businessRes.ok) {
          const businessData = await businessRes.json()
          const business = businessData.business
          
          // Fetch scenarios from API with business type and sector filtering
          const businessType = business.businessType || ''
          const sector = business.sector || ''
          const apiUrl = `/api/fbr/scenarios?businessType=${encodeURIComponent(businessType)}&sector=${encodeURIComponent(sector)}&includeGeneral=true`
          
          console.log(`🔍 Fetching scenarios:`, {
            businessType,
            sector,
            apiUrl,
            businessProfile: business
          })
          
          const scenariosRes = await fetch(apiUrl)
          
          if (scenariosRes.ok) {
            const data = await scenariosRes.json()
            console.log('📋 API Response:', {
              success: data.success,
              recordCount: data.metadata?.recordCount,
              businessType: data.metadata?.businessType,
              sector: data.metadata?.sector,
              scenarios: data.data?.map((s: any) => s.code),
              metadata: data.metadata
            })
            
            if (data.success) {
              setScenarios(data.data || [])
              console.log(`✅ Loaded ${data.data?.length || 0} scenarios for ${business.businessType} (${business.sector})`)
              
              // Set default scenario if not already set
              if (!invoiceData.scenarioId && business.defaultScenario) {
                setInvoiceData(prev => ({
                  ...prev,
                  scenarioId: business.defaultScenario
                }))
                console.log(`✅ Set default scenario from business settings: ${business.defaultScenario}`)
              }
            } else {
              throw new Error(data.error?.message || 'Failed to load scenarios')
            }
          } else {
            throw new Error(`Failed to load scenarios: ${scenariosRes.status}`)
          }
        } else {
          throw new Error(`Failed to load business settings: ${businessRes.status}`)
        }
      } catch (businessError) {
        console.error('Error loading business settings:', businessError)
        handleApiError(businessError instanceof Error ? businessError : new Error('Failed to load business settings'), 'Loading business settings')
        
        // Fallback: load all general scenarios
        try {
          const scenariosRes = await fetch('/api/fbr/scenarios?includeGeneral=true')
          if (scenariosRes.ok) {
            const data = await scenariosRes.json()
            if (data.success) {
              setScenarios(data.data || [])
              console.log(`✅ Loaded ${data.data?.length || 0} general scenarios as fallback`)
            }
          }
        } catch (fallbackError) {
          console.error('Error loading fallback scenarios:', fallbackError)
        }
      }
    } catch (error) {
      console.error('Error loading scenarios:', error)
      handleGenericError(error instanceof Error ? error : new Error('Failed to load scenarios'), 'Loading scenarios')
      // Continue without scenarios (they're optional)
    } finally {
      setLoadingScenarios(false)
    }
  }

  // Auto-save functionality (every 30 seconds)
  useEffect(() => {
    if (!invoiceData.customerId || items.length === 0) return
    
    const autoSaveInterval = setInterval(() => {
      handleSave(true) // true = auto-save mode
    }, 30000) // 30 seconds
    
    return () => clearInterval(autoSaveInterval)
  }, [invoiceData, items, invoiceId])

  // Filter customers based on search - always show all customers
  useEffect(() => {
    if (customerSearch.trim() === '') {
      // Show all customers when no search query
      setFilteredCustomers(customers)
    } else {
      // Filter customers as user types
      const searchLower = customerSearch.toLowerCase()
      setFilteredCustomers(
        customers.filter(c => 
          c.name.toLowerCase().includes(searchLower) ||
          c.ntnCnic?.toLowerCase().includes(searchLower) ||
          c.address.toLowerCase().includes(searchLower)
        )
      )
    }
  }, [customerSearch, customers])

  // Fetch UOMs for a specific HS Code (FBR Data Chaining)
  const fetchUOMsForHSCode = async (hsCode: string, itemIndex: number) => {
    if (!hsCode || hsCode.length < 4) return
    
    try {
      const response = await fetch('/api/fbr/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'hsUom', hsCode })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data.length > 0) {
          // CRITICAL FIX: Only update availableUOMs, DO NOT call updateItem
          // Calling updateItem causes a state race condition that overwrites selectProduct changes
          setAvailableUOMs(prev => ({
            ...prev,
            [hsCode]: data.data
          }))
          
          console.log(`✅ Loaded ${data.data.length} UOMs for HS ${hsCode}`)
          
          // NOTE: We do NOT auto-select UOM here anymore to prevent state conflicts
          // The product already has a UoM set from the product data
          // User can manually change it if needed
        }
      } else {
        console.warn(`Failed to fetch UOMs for HS Code ${hsCode}: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to fetch UOMs for HS Code:', error)
      handleNetworkError(error instanceof Error ? error : new Error('Failed to fetch UOMs'), `Fetching UOMs for HS ${hsCode}`)
    }
  }

  // Auto-fill line item from selected product
  const selectProduct = async (product: any, itemIndex: number, event?: React.MouseEvent) => {
    // CRITICAL: Prevent duplicate calls with multiple safeguards
    const now = Date.now()
    const lastSelection = lastSelectedRef.current
    
    // Check if this is a duplicate call (within 500ms of same product/item)
    if (lastSelection &&
        lastSelection.productId === product.id &&
        lastSelection.itemIndex === itemIndex &&
        now - lastSelection.timestamp < 500) {
      console.log('⚠️ DUPLICATE CALL BLOCKED:', { product: product.name, timeSince: now - lastSelection.timestamp })
      return
    }
    
    // Check if already selecting
    if (selectingProductRef.current) {
      console.log('⚠️ SELECTION IN PROGRESS, IGNORING')
      return
    }
    
    // Stop event propagation to prevent bubbling
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    // Mark as selecting and update last selected
    selectingProductRef.current = true
    lastSelectedRef.current = { productId: product.id, itemIndex, timestamp: now }
    
    console.log('🔵 selectProduct called', { product: product.name, itemIndex })
    
    // DEBUG: Log the entire product object to understand its structure
    console.log('🔍 DEBUG: Product object received:', product)
    console.log('🔍 DEBUG: Product unitPrice field:', product.unitPrice)
    console.log('🔍 DEBUG: Product price field:', product.price)
    
    try {
      // Get current item before any state updates
      const currentItem = items[itemIndex]
      if (!currentItem) return
      
      // Create updated item with product data
      const updatedItems = [...items]
      const updatedItem = {
        ...currentItem,
        description: product.description || product.name,
        hsCode: product.hsCode || '',
        // FIX: Use unitPrice instead of price to match the Product interface
        unitPrice: product.unitPrice || product.price || 0,
        unitOfMeasurement: product.unitOfMeasurement || 'Each',
        taxRate: product.taxRate || 18,
        saleType: product.saleType || 'Standard'
      }
      
      console.log('🟢 Updated item data', updatedItem)
      console.log('🔍 DEBUG: Unit price set to:', updatedItem.unitPrice)
      
      // Recalculate totals for this item
      const calculatedItem = calculateItemTotals(updatedItem)
      updatedItems[itemIndex] = calculatedItem
      
      console.log('🟡 After calculation', calculatedItem)
      
      // Update items first (most important!)
      setItems(updatedItems)
      
      console.log('✅ Items state updated')

      // Close dropdown and keep product name in the input field
      setProductDropdownOpen(prev => ({ ...prev, [currentItem.id]: false }))
      setProductSearchQueries(prev => ({ ...prev, [currentItem.id]: product.name }))
      console.log('✅ Dropdown closed, product name set:', product.name)

      // Fetch UOMs for the selected product's HS Code (non-blocking)
      // Do NOT await - let it run in background to avoid state conflicts
      if (product.hsCode && product.hsCode.length >= 4) {
        console.log('📡 Fetching UOMs for HS Code:', product.hsCode)
        fetchUOMsForHSCode(product.hsCode, itemIndex).catch(err => {
          console.error('UOM fetch failed:', err)
        })
      }
      
      // Recalculate invoice totals after updating the item
      setTimeout(() => {
        calculateTotals()
      }, 100)
    } finally {
      // Always reset the flag after completion
      setTimeout(() => {
        selectingProductRef.current = false
        console.log('🔓 Selection lock released')
      }, 500)
    }
  }

  // Handle product selection from enhanced search
  const handleProductSelect = useCallback((product: any, itemIndex: number) => {
    const itemId = items[itemIndex]?.id
    if (!itemId) return
    
    setSelectedProducts(prev => ({
      ...prev,
      [itemId]: product
    }))
    
    // Update search query to show selected product name
    setProductSearchQueries(prev => ({
      ...prev,
      [itemId]: product.name || ''
    }))
    
    // Auto-fill line item from selected product
    selectProduct(product, itemIndex)
  }, [items, selectProduct])

  // Select product by ID for pre-filling
  const selectProductById = async (productId: string) => {
    try {
      // Fetch product directly
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        const fetchedProduct = data.product
        if (fetchedProduct) {
          await selectProduct(fetchedProduct, 0)
          console.log('✅ Pre-selected product from API:', fetchedProduct.name)
        }
      }
    } catch (error) {
      console.error('Failed to pre-select product:', error)
    }
  }

  // Calculate item totals
  const calculateItemTotals = useCallback((item: InvoiceItem) => {
    const baseAmount = item.quantity * item.unitPrice
    const discountAmount = (baseAmount * (item.discount || 0)) / 100
    const valueSalesExcludingST = baseAmount - discountAmount
    
    const salesTaxApplicable = (valueSalesExcludingST * item.taxRate) / 100
    const salesTaxWithheldAtSource = (valueSalesExcludingST * 0) / 100 // Default 0%, can be configured
    const extraTax = (valueSalesExcludingST * 0) / 100 // Default 0%
    const furtherTax = (valueSalesExcludingST * 0) / 100 // Default 0%
    const fedPayable = item.fedPayable || 0
    
    const totalValue = valueSalesExcludingST + salesTaxApplicable + extraTax + furtherTax + fedPayable
    
    return {
      ...item,
      valueSalesExcludingST,
      salesTaxApplicable,
      salesTaxWithheldAtSource,
      extraTax,
      furtherTax,
      fedPayable,
      totalValue
    }
  }, [])

  // Update item
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...items]
    const currentItem = updatedItems[index]
    if (!currentItem) return
    
    updatedItems[index] = {
      ...currentItem,
      [field]: value
    }
    // Recalculate totals
    const calculatedItem = calculateItemTotals(updatedItems[index])
    updatedItems[index] = calculatedItem
    setItems(updatedItems)
  }

  // Add new item
  const addItem = () => {
    setItems([
      ...items,
      {
        id: generateUUID(),
        description: '',
        hsCode: '',
        quantity: 1,
        unitPrice: 0,
        unitOfMeasurement: 'Each',
        taxRate: 18,
        discount: 0,
        valueSalesExcludingST: 0,
        salesTaxApplicable: 0,
        salesTaxWithheldAtSource: 0,
        extraTax: 0,
        furtherTax: 0,
        fedPayable: 0,
        totalValue: 0,
        saleType: 'Standard'
      }
    ])
  }

  // Remove item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  // Calculate invoice totals
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.valueSalesExcludingST, 0)
    const totalTax = items.reduce((sum, item) => sum + item.salesTaxApplicable, 0)
    const totalWithholdingTax = items.reduce((sum, item) => sum + item.salesTaxWithheldAtSource, 0)
    const totalExtraTax = items.reduce((sum, item) => sum + item.extraTax, 0)
    const totalFurtherTax = items.reduce((sum, item) => sum + item.furtherTax, 0)
    const totalFED = items.reduce((sum, item) => sum + item.fedPayable, 0)
    const grandTotal = items.reduce((sum, item) => sum + item.totalValue, 0)
    
    return {
      subtotal,
      totalTax,
      totalWithholdingTax,
      totalExtraTax,
      totalFurtherTax,
      totalFED,
      grandTotal
    }
  }

  // Save invoice (draft or auto-save)
  const handleSave = async (isAutoSave = false) => {
    try {
      if (isAutoSave) {
        setAutoSaving(true)
      } else {
        setSaving(true)
      }
      setError('')
      
      // Validate required fields
      if (!invoiceData.customerId) {
        const errorMsg = 'Please select a customer'
        if (!isAutoSave) {
          handleValidationError(errorMsg, 'customerId')
        }
        throw new Error(errorMsg)
      }
      
      if (items.length === 0) {
        const errorMsg = 'Please add at least one item'
        if (!isAutoSave) {
          handleValidationError(errorMsg, 'items')
        }
        throw new Error(errorMsg)
      }
      
      // Validate each item has required fields
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (!item) continue
        
        if (!item.description && !item.hsCode) {
          const errorMsg = `Item ${i + 1}: Please add a description or HS code`
          if (!isAutoSave) {
            handleValidationError(errorMsg, `item${i}.description`)
          }
          throw new Error(errorMsg)
        }
        if (!item.hsCode) {
          const errorMsg = `Item ${i + 1}: HS Code is required`
          if (!isAutoSave) {
            handleValidationError(errorMsg, `item${i}.hsCode`)
          }
          throw new Error(errorMsg)
        }
        if (item.quantity <= 0) {
          const errorMsg = `Item ${i + 1}: Quantity must be greater than 0`
          if (!isAutoSave) {
            handleValidationError(errorMsg, `item${i}.quantity`)
          }
          throw new Error(errorMsg)
        }
        if (item.unitPrice < 0) {
          const errorMsg = `Item ${i + 1}: Unit price cannot be negative`
          if (!isAutoSave) {
            handleValidationError(errorMsg, `item${i}.unitPrice`)
          }
          throw new Error(errorMsg)
        }
      }
      
      const totals = calculateTotals()
      
      const payload = {
        id: invoiceId,
        customerId: invoiceData.customerId,
        invoiceDate: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
        documentType: invoiceData.documentType,
        paymentMode: invoiceData.paymentMode,
        scenarioId: invoiceData.scenarioId || undefined,
        taxPeriod: invoiceData.taxPeriod,
        invoiceRefNo: invoiceData.invoiceRefNo || undefined,
        notes: invoiceData.notes,
        subtotal: totals.subtotal,
        taxAmount: totals.totalTax,
        totalAmount: totals.grandTotal,
        totalWithholdingTax: totals.totalWithholdingTax,
        totalExtraTax: totals.totalExtraTax,
        totalFurtherTax: totals.totalFurtherTax,
        totalFED: totals.totalFED,
        status: 'SAVED', // Save as SAVED status (can be edited later)
        mode: 'LOCAL',
        items: items.map(item => ({
          description: item.description,
          hsCode: item.hsCode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          unitOfMeasurement: item.unitOfMeasurement,
          taxRate: item.taxRate,
          discount: item.discount,
          valueSalesExcludingST: item.valueSalesExcludingST,
          salesTaxApplicable: item.salesTaxApplicable,
          salesTaxWithheldAtSource: item.salesTaxWithheldAtSource,
          extraTax: item.extraTax,
          furtherTax: item.furtherTax,
          fedPayable: item.fedPayable,
          totalValue: item.totalValue,
          saleType: item.saleType,
          sroScheduleNo: item.sroScheduleNo,
          sroItemSerialNo: item.sroItemSerialNo,
          fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice
        }))
      }
      
      const method = invoiceId ? 'PUT' : 'POST'
      const url = invoiceId ? `/api/invoices/${invoiceId}` : '/api/invoices'
      
      console.log('💾 Saving invoice with payload:', JSON.stringify(payload, null, 2))
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Save failed:', errorData)
        const errorMessage = errorData.error?.message || errorData.error || 'Failed to save invoice'
        
        if (!isAutoSave) {
          if (response.status === 400) {
            handleValidationError(errorMessage)
          } else if (response.status >= 500) {
            handleApiError(new Error(errorMessage), 'Saving invoice')
          } else {
            handleGenericError(new Error(errorMessage), 'Saving invoice')
          }
        }
        
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      
      if (!invoiceId) {
        setInvoiceId(data.invoice.id)
      }
      
      setLastSaved(new Date())
      
      if (!isAutoSave) {
        setSuccess('Invoice saved successfully!')
        showSuccessToast('Invoice Saved', 'Your invoice has been saved successfully.')
        setTimeout(() => setSuccess(''), 3000)
        
        // Redirect to invoices list after 1.5 seconds
        setTimeout(() => {
          router.push('/invoices')
        }, 1500)
      }
      
    } catch (error: any) {
      console.error('Save error:', error)
      if (!isAutoSave) {
        setError(error.message || 'Failed to save invoice')
        showErrorToast('Save Failed', error.message || 'Failed to save invoice')
      }
    } finally {
      if (isAutoSave) {
        setAutoSaving(false)
      } else {
        setSaving(false)
      }
    }
  }

  // Submit to FBR Sandbox
  const handleSubmitToSandbox = async () => {
    try {
      setSaving(true)
      setError('')
      
      // First save the invoice if not already saved
      if (!invoiceId) {
        await handleSave()
        if (!invoiceId) {
          const errorMsg = 'Failed to save invoice before submission'
          handleApiError(new Error(errorMsg), 'Saving invoice before submission')
          throw new Error(errorMsg)
        }
      }
      
      // Submit to FBR sandbox
      const response = await fetch(`/api/invoices/${invoiceId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment: 'sandbox' })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.error?.message || errorData.error || 'Failed to submit to FBR'
        
        if (response.status === 400) {
          handleValidationError(errorMessage)
        } else if (response.status >= 500) {
          handleApiError(new Error(errorMessage), 'Submitting to FBR sandbox')
        } else {
          handleGenericError(new Error(errorMessage), 'Submitting to FBR sandbox')
        }
        
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      setSuccess(`Invoice submitted to FBR Sandbox! IRN: ${data.fbrInvoiceNumber}`)
      showSuccessToast('Submitted to FBR', `Invoice submitted to FBR Sandbox! IRN: ${data.fbrInvoiceNumber}`)
      
      // Redirect to invoice list after 2 seconds
      setTimeout(() => {
        router.push('/invoices')
      }, 2000)
      
    } catch (error: any) {
      console.error('Submit error:', error)
      setError(error.message || 'Failed to submit to FBR')
      showErrorToast('Submission Failed', error.message || 'Failed to submit to FBR')
    } finally {
      setSaving(false)
    }
  }

  const totals = calculateTotals()

  if (status === 'loading' || loading) {
    return <SharedLoading message="Loading invoice form..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <SharedNavigation
              backUrl="/invoices"
              backLabel="Back to Invoices"
              showHome={true}
              currentPage="Create Invoice"
            />
          </div>
          <div className="flex items-center space-x-2">
            {autoSaving && (
              <span className="text-sm text-gray-500 flex items-center">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Auto-saving...
              </span>
            )}
            {lastSaved && !autoSaving && (
              <span className="text-sm text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {invoiceId ? 'Edit Invoice' : 'Create New Invoice'}
          </h1>
          <p className="text-gray-600 mt-1">
            All fields marked with <span className="text-red-500">*</span> are required for FBR compliance
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Invoice Form */}
        <div className="space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information <span className="text-red-500">*</span></CardTitle>
              <CardDescription>Select or add a customer for this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer-search">Search Customer</Label>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="customer-search"
                      placeholder="Type to filter customers..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Link href="/customers/new">
                    <Button type="button" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      New Customer
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {customers.length} customers loaded • Showing {filteredCustomers.length} • Type to filter
                </p>
              </div>

              {/* Always show customers - all by default, filtered when typing */}
              <div className="border rounded-lg max-h-80 overflow-y-auto">
                {filteredCustomers.length > 0 ? (
                  <div className="divide-y">
                    {filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => {
                          setInvoiceData({
                            ...invoiceData,
                            customerId: customer.id,
                            customerName: customer.name
                          })
                          setCustomerSearch('')
                        }}
                        className={`w-full p-4 text-left transition-all hover:bg-gray-50 ${
                          invoiceData.customerId === customer.id
                            ? 'bg-blue-50 border-l-4 border-l-blue-500'
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{customer.ntnCnic}</div>
                            <div className="text-xs text-gray-500 mt-1">{customer.address}</div>
                          </div>
                          {invoiceData.customerId === customer.id && (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No customers found matching "{customerSearch}"</p>
                    <Link href="/customers/new">
                      <Button type="button" variant="link" className="mt-2">
                        Create new customer
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {invoiceData.customerId && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-900">
                      Selected: {invoiceData.customerName}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>Basic invoice information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoice-date">Invoice Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="invoice-date"
                    type="date"
                    value={invoiceData.invoiceDate}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="document-type">Document Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={invoiceData.documentType}
                    onValueChange={(value) => setInvoiceData({ ...invoiceData, documentType: value })}
                  >
                    <SelectTrigger id="document-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sale Invoice">Sale Invoice</SelectItem>
                      <SelectItem value="Debit Note">Debit Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payment-mode">Payment Mode <span className="text-red-500">*</span></Label>
                  <Select
                    value={invoiceData.paymentMode}
                    onValueChange={(value) => setInvoiceData({ ...invoiceData, paymentMode: value })}
                  >
                    <SelectTrigger id="payment-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit">Credit</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tax-period">Tax Period <span className="text-red-500">*</span></Label>
                  <Input
                    id="tax-period"
                    type="month"
                    value={invoiceData.taxPeriod}
                    onChange={(e) => setInvoiceData({ ...invoiceData, taxPeriod: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="scenario-id">
                    Scenario ID
                    {loadingScenarios && (
                      <span className="ml-2 text-xs text-blue-600">
                        <Loader2 className="inline h-3 w-3 animate-spin" /> Loading scenarios...
                      </span>
                    )}
                  </Label>
                  <Select
                    value={invoiceData.scenarioId || ""}
                    onValueChange={(value) => setInvoiceData({ ...invoiceData, scenarioId: value })}
                    disabled={loadingScenarios}
                  >
                    <SelectTrigger id="scenario-id">
                      <SelectValue placeholder="Select scenario (from business settings)">
                        {invoiceData.scenarioId && (
                          <span className="font-medium">{invoiceData.scenarioId}</span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.length > 0 ? (
                        scenarios.map((scenario) => (
                          <SelectItem key={scenario.code} value={scenario.code}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium text-sm">{scenario.code}</span>
                              <span className="text-xs text-gray-600 mt-1 leading-tight">{scenario.description}</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No scenarios available (check business profile)
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Default scenario from business settings will be used automatically.
                    {scenarios.length > 0 && (
                      <span className="text-green-600 ml-1">
                        ({scenarios.length} scenarios available)
                      </span>
                    )}
                  </p>
                </div>

                {invoiceData.documentType === 'Debit Note' && (
                  <div>
                    <Label htmlFor="invoice-ref">Reference Invoice No <span className="text-red-500">*</span></Label>
                    <Input
                      id="invoice-ref"
                      placeholder="22/28 digit reference"
                      value={invoiceData.invoiceRefNo}
                      onChange={(e) => setInvoiceData({ ...invoiceData, invoiceRefNo: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items <span className="text-red-500">*</span></CardTitle>
              <CardDescription>Add products or services to this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Enhanced Product Search */}
                  <div className="mb-4">
                    <Label>Select Product (Optional)</Label>
                    <EnhancedProductSearch
                      onSelect={(product) => handleProductSelect(product, index)}
                      placeholder="Search products by name, code, or category..."
                      className="mt-1"
                      showAdvancedFilters={false}
                      enableCaching={true}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Search from your product catalog • Auto-fills all fields when selected
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <Label>Description <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="Product or service description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>HS Code <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="e.g., 8523.4990"
                        value={item.hsCode}
                        onChange={(e) => {
                          const newHsCode = e.target.value
                          updateItem(index, 'hsCode', newHsCode)
                          // Fetch UOMs for this HS Code (FBR Data Chaining)
                          if (newHsCode.length >= 4) {
                            fetchUOMsForHSCode(newHsCode, index)
                          }
                        }}
                      />
                      {item.hsCode && availableUOMs[item.hsCode] && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {availableUOMs[item.hsCode]?.length || 0} valid UOM(s) for this HS Code
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Quantity <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>Unit Price <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>Unit of Measurement</Label>
                      <Select
                        value={item.unitOfMeasurement}
                        onValueChange={(value) => updateItem(index, 'unitOfMeasurement', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.hsCode && availableUOMs[item.hsCode] && availableUOMs[item.hsCode]!.length > 0 ? (
                            // Show HS Code-specific UOMs (FBR Data Chaining)
                            <>
                              {availableUOMs[item.hsCode]!.map((uom) => (
                                <SelectItem key={uom.uoM_ID} value={uom.description}>
                                  {uom.description} <span className="text-xs text-green-600">(Valid for HS {item.hsCode})</span>
                                </SelectItem>
                              ))}
                            </>
                          ) : (
                            // Show generic UOMs as fallback
                            <>
                              <SelectItem value="Each">Each</SelectItem>
                              <SelectItem value="KG">Kilogram</SelectItem>
                              <SelectItem value="Meter">Meter</SelectItem>
                              <SelectItem value="Liter">Liter</SelectItem>
                              <SelectItem value="Service">Service</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      {item.hsCode && availableUOMs[item.hsCode] && availableUOMs[item.hsCode]!.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Showing {availableUOMs[item.hsCode]!.length} FBR-approved UOM(s) for HS Code {item.hsCode}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Tax Rate (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.taxRate}
                        onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>Discount (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.discount || 0}
                        onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>FED Payable</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.fedPayable}
                        onChange={(e) => updateItem(index, 'fedPayable', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Item Totals */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm bg-gray-50 p-3 rounded">
                    <div>
                      <span className="text-gray-600">Base Amount:</span>
                      <div className="font-medium">Rs. {item.valueSalesExcludingST.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Tax Amount:</span>
                      <div className="font-medium">Rs. {item.salesTaxApplicable.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">FED:</span>
                      <div className="font-medium">Rs. {item.fedPayable.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <div className="font-bold text-blue-600">Rs. {item.totalValue.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Item
              </Button>
            </CardContent>
          </Card>

          {/* Invoice Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal (Excluding Tax):</span>
                  <span className="font-medium">Rs. {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Sales Tax:</span>
                  <span className="font-medium">Rs. {totals.totalTax.toFixed(2)}</span>
                </div>
                {totals.totalWithholdingTax > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Withholding Tax:</span>
                    <span className="font-medium">Rs. {totals.totalWithholdingTax.toFixed(2)}</span>
                  </div>
                )}
                {totals.totalExtraTax > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Extra Tax:</span>
                    <span className="font-medium">Rs. {totals.totalExtraTax.toFixed(2)}</span>
                  </div>
                )}
                {totals.totalFurtherTax > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Further Tax:</span>
                    <span className="font-medium">Rs. {totals.totalFurtherTax.toFixed(2)}</span>
                  </div>
                )}
                {totals.totalFED > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Federal Excise Duty:</span>
                    <span className="font-medium">Rs. {totals.totalFED.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Grand Total:</span>
                    <span className="text-blue-600">Rs. {totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional notes or comments..."
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/invoices">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={saving || autoSaving}
              className={success ? "border-green-500 bg-green-50" : ""}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
