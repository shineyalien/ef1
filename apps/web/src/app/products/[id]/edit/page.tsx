'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, ArrowLeft, Package, DollarSign, Hash, Tag } from 'lucide-react'
import { SharedLoading } from "@/components/shared-loading"
import { SharedNavigation } from "@/components/shared-navigation"

export default function EditProductPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    hsCode: '',
    hsCodeDescription: '',
    unitOfMeasurement: 'Each',
    unitPrice: '',
    taxRate: '18',
    category: '',
    serialNumber: '',
    transactionType: '',
    rateId: '',
    rateDescription: '',
    sroScheduleNo: '',
    sroItemSerialNo: ''
  })

  // State for FBR data chaining
  const [availableUOMs, setAvailableUOMs] = useState<Array<{ uoM_ID: number; description: string }>>([])
  const [transactionTypes, setTransactionTypes] = useState<Array<{ transTypeId: number; transTypeDesc: string }>>([])
  const [hsCodeSearchResults, setHSCodeSearchResults] = useState<Array<{ hS_CODE: string; description: string }>>([])
  const [searchingHSCode, setSearchingHSCode] = useState(false)
  const [fetchingTaxRate, setFetchingTaxRate] = useState(false)

  const unitOptions = [
    'Each', 'Piece', 'Kilogram', 'Gram', 'Liter', 'Meter', 'Square Meter', 
    'Cubic Meter', 'Hour', 'Day', 'Month', 'Year', 'Box', 'Carton', 'Set'
  ]

  // Load existing product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log('🔄 Loading product:', productId)
        const response = await fetch(`/api/products/${productId}`)
        console.log('📡 API Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('📦 API Response data:', data)
          const product = data.product
          setProductData({
            name: product.name || '',
            description: product.description || '',
            hsCode: product.hsCode || '',
            hsCodeDescription: product.hsCodeDescription || '',
            unitOfMeasurement: product.unitOfMeasurement || 'Each',
            unitPrice: product.unitPrice?.toString() || '',
            taxRate: product.taxRate?.toString() || '18',
            category: product.category || '',
            serialNumber: product.serialNumber || '',
            transactionType: product.transactionType || '',
            rateId: product.rateId || '',
            rateDescription: product.rateDescription || '',
            sroScheduleNo: product.sroScheduleNo || '',
            sroItemSerialNo: product.sroItemSerialNo || ''
          })
        } else {
          const errorData = await response.json()
          console.log('❌ API Error:', errorData)
          throw new Error(errorData.error || 'Product not found')
        }
      } catch (error) {
        console.error('Failed to load product:', error)
        setError('Failed to load product data')
      } finally {
        setInitialLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  // FBR DATA CHAINING FUNCTIONS
  const searchHSCode = async (query: string) => {
    if (query.length < 3) {
      setHSCodeSearchResults([])
      return
    }

    setSearchingHSCode(true)
    try {
      const response = await fetch(`/api/fbr/lookup?type=hsCodeSearch&query=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setHSCodeSearchResults(data.data || [])
      }
    } catch (error) {
      console.error('HS Code search failed:', error)
    } finally {
      setSearchingHSCode(false)
    }
  }

  const fetchUOMsForHSCode = async (hsCode: string) => {
    if (!hsCode || hsCode.length < 4) return

    try {
      const response = await fetch('/api/fbr/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'hsUom', hsCode })
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableUOMs(data.data || [])
        
        if (data.data && data.data.length > 0) {
          setProductData(prev => ({ ...prev, unitOfMeasurement: data.data[0].description }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch UOMs:', error)
    }
  }

  const fetchTransactionTypes = async () => {
    try {
      const response = await fetch('/api/fbr/lookup?type=transactionTypes')
      if (response.ok) {
        const data = await response.json()
        setTransactionTypes(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch transaction types:', error)
    }
  }

  const fetchTaxRate = async (transTypeId: string, hsCode: string) => {
    if (!transTypeId || !hsCode) return

    setFetchingTaxRate(true)
    try {
      const businessRes = await fetch('/api/business/current')
      let provinceId = 1 // Default to Punjab
      
      if (businessRes.ok) {
        const business = await businessRes.json()
        provinceId = business.provinceId || 1
      }

      const response = await fetch('/api/fbr/tax-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          transTypeId: parseInt(transTypeId),
          provinceId,
          hsCode
        })
      })

      if (response.ok) {
        const data = await response.json()
        setProductData(prev => ({
          ...prev,
          rateId: data.rateId?.toString() || '',
          rateDescription: data.rateDescription || '',
          taxRate: data.rateValue?.toString() || prev.taxRate
        }))
      }
    } catch (error) {
      console.error('Failed to fetch tax rate:', error)
    } finally {
      setFetchingTaxRate(false)
    }
  }

  // Load transaction types on component mount
  useEffect(() => {
    fetchTransactionTypes()
  }, [])

  // Debounced HS Code search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (productData.hsCode) {
        searchHSCode(productData.hsCode)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [productData.hsCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!productData.name.trim()) {
        setError('Product name is required.')
        return
      }
      if (!productData.hsCode.trim()) {
        setError('HS Code is required.')
        return
      }
      if (!productData.unitPrice || parseFloat(productData.unitPrice) <= 0) {
        setError('Valid unit price is required.')
        return
      }

      const payload = {
        ...productData,
        unitPrice: parseFloat(productData.unitPrice),
        taxRate: parseFloat(productData.taxRate)
      }

      console.log('Updating product:', payload)
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      const result = await response.json()
      console.log('Product updated successfully:', result)
      
      router.push('/products')
    } catch (error) {
      console.error('Error updating product:', error)
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <SharedLoading message="Loading product data..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <FileText className="h-8 w-8 text-blue-600" />
              </Link>
              <span className="text-xl font-bold text-gray-900">Easy Filer</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {session?.user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SharedNavigation 
          backUrl="/products" 
          backLabel="Back to Products" 
          showHome={true} 
          currentPage="Edit Product" 
        />
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
          <p className="text-gray-600">Update product information and FBR compliance details.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Update details for your product or service. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productData.name}
                      onChange={(e) => setProductData({...productData, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Software License"
                      required
                    />
                  </div>
                   
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={productData.category}
                      onChange={(e) => setProductData({...productData, category: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Software, Hardware, Services (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Product Serial Number
                    </label>
                    <input
                      type="text"
                      value={productData.serialNumber}
                      onChange={(e) => setProductData({...productData, serialNumber: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
                      placeholder="PRD-2025-0001 (auto-generated)"
                      readOnly
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Internal tracking number (automatically assigned)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={productData.description}
                    onChange={(e) => setProductData({...productData, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe your product or service"
                  />
                </div>
              </div>

              {/* FBR Compliance */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  FBR Compliance & Tax Information
                </h3>
                
                {/* HS Code Live Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    HS Code * <span className="text-blue-600">(Live Search)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={productData.hsCode}
                      onChange={(e) => {
                        const value = e.target.value
                        setProductData({...productData, hsCode: value})
                        if (value.length >= 4) {
                          fetchUOMsForHSCode(value)
                        }
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="Start typing HS Code... (e.g. 8523)"
                      required
                    />
                    {searchingHSCode && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                      </div>
                    )}
                  </div>
                   
                  {/* HS Code Search Results Dropdown */}
                  {hsCodeSearchResults.length > 0 && (
                    <div className="mt-1 max-h-48 overflow-y-auto border border-gray-300 rounded-lg bg-white shadow-lg">
                      {hsCodeSearchResults.map((result) => (
                        <button
                          key={result.hS_CODE}
                          type="button"
                          onClick={() => {
                            setProductData(prev => ({
                              ...prev,
                              hsCode: result.hS_CODE,
                              hsCodeDescription: result.description
                            }))
                            setHSCodeSearchResults([])
                            fetchUOMsForHSCode(result.hS_CODE)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-mono text-sm font-semibold text-blue-600">{result.hS_CODE}</div>
                          <div className="text-xs text-gray-600 mt-1">{result.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                   
                  <p className="text-xs text-gray-500 mt-1">
                    Type at least 3 characters to search FBR HS Code database
                  </p>
                </div>

                {/* HS Code Description */}
                {productData.hsCodeDescription && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      HS Code Description
                    </label>
                    <textarea
                      value={productData.hsCodeDescription}
                      readOnly
                      disabled
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                      rows={2}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Unit of Measurement - Auto-populated from HS Code */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Unit of Measurement * <span className="text-green-600">(Auto-filtered by HS Code)</span>
                    </label>
                    <select
                      value={productData.unitOfMeasurement}
                      onChange={(e) => setProductData({...productData, unitOfMeasurement: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={availableUOMs.length === 0}
                    >
                      {availableUOMs.length === 0 ? (
                        <>
                          <option value="Each">Each</option>
                          <option value="Piece">Piece</option>
                          <option value="Kilogram">Kilogram</option>
                          <option value="Liter">Liter</option>
                          <option value="Meter">Meter</option>
                        </>
                      ) : (
                        availableUOMs.map(uom => (
                          <option key={uom.uoM_ID} value={uom.description}>
                            {uom.description}
                          </option>
                        ))
                      )}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {availableUOMs.length > 0 
                        ? `${availableUOMs.length} valid UOM(s) for this HS Code` 
                        : 'Select HS Code to see valid UOMs'}
                    </p>
                  </div>

                  {/* Transaction Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Transaction Type *
                    </label>
                    <select
                      value={productData.transactionType}
                      onChange={(e) => {
                        setProductData({...productData, transactionType: e.target.value})
                        if (e.target.value && productData.hsCode) {
                          fetchTaxRate(e.target.value, productData.hsCode)
                        }
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select transaction type</option>
                      {transactionTypes.map(type => (
                        <option key={type.transTypeId} value={type.transTypeId.toString()}>
                          {type.transTypeDesc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tax Rate Information - Auto-populated */}
                {(productData.rateId || fetchingTaxRate) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3">Tax Rate Information</h4>
                    
                    {fetchingTaxRate ? (
                      <div className="flex items-center gap-2 text-blue-700">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                        <span className="text-sm">Fetching tax rate from FBR...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">Rate ID</label>
                          <input
                            type="text"
                            value={productData.rateId}
                            readOnly
                            disabled
                            className="w-full p-2 border border-blue-300 rounded bg-white text-sm font-mono"
                          />
                        </div>
                         
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-blue-700 mb-1">Rate Description</label>
                          <input
                            type="text"
                            value={productData.rateDescription}
                            readOnly
                            disabled
                            className="w-full p-2 border border-blue-300 rounded bg-white text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SRO Fields (Optional) */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    SRO Information <span className="text-gray-500 font-normal">(Optional - for special tax exemptions)</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        FBR SRO Schedule No.
                      </label>
                      <input
                        type="text"
                        value={productData.sroScheduleNo}
                        onChange={(e) => setProductData({...productData, sroScheduleNo: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. SRO-1125(I)/2011"
                      />
                    </div>
                     
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        SRO Item Serial No.
                      </label>
                      <input
                        type="text"
                        value={productData.sroItemSerialNo}
                        onChange={(e) => setProductData({...productData, sroItemSerialNo: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. 1, 2, 3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pricing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Unit Price (PKR) *
                    </label>
                    <input
                      type="number"
                      value={productData.unitPrice}
                      onChange={(e) => setProductData({...productData, unitPrice: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10000"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                   
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={productData.taxRate}
                      onChange={(e) => setProductData({...productData, taxRate: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="18"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>


              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/products">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}