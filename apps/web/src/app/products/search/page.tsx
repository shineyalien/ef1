'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Package, Grid, List, Download, Upload, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductSearch, SearchFilters } from '@/hooks/use-product-search'
import { useError } from '@/contexts/error-context'
import Link from 'next/link'

// Prevent static generation since this page uses ErrorProvider hooks
export const dynamic = 'force-dynamic'

interface Product {
  id: string
  name: string
  description: string | null
  hsCode: string
  unitOfMeasurement: string
  unitPrice: number
  taxRate: number
  category: string | null
  serialNumber: string | null
  createdAt: string
  updatedAt: string
  isActive: boolean
}

// Create fallback error handlers for SSR safety
const createFallbackErrorHandlers = () => ({
  showErrorToast: (title: string, message: string) => {
    console.error(`${title}: ${message}`)
  },
  showSuccessToast: (title: string, message: string) => {
    console.log(`${title}: ${message}`)
  },
  handleNetworkError: (error: Error, context?: string) => {
    console.error(`Network error in ${context}:`, error)
  },
  handleValidationError: (message: string, field?: string) => {
    console.error(`Validation error: ${message}`, field)
  },
  handleApiError: (error: any, context?: string) => {
    console.error(`API error in ${context}:`, error)
  },
  handleGenericError: (error: Error, context?: string) => {
    console.error(`Error in ${context}:`, error)
  }
})

function ProductSearchContent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('')
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [isClient, setIsClient] = useState(false)
  
  // Initialize with fallback handlers
  const [errorHandlers, setErrorHandlers] = useState(createFallbackErrorHandlers())

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Use error context only on client side
  let contextErrorHandlers
  try {
    contextErrorHandlers = useError()
  } catch (error) {
    // If error context not available, use fallback
    contextErrorHandlers = null
  }

  // Use context handlers if available, otherwise fallback
  const {
    showErrorToast,
    showSuccessToast,
    handleNetworkError,
    handleValidationError,
    handleApiError,
    handleGenericError
  } = contextErrorHandlers || errorHandlers

  const {
    products = [],
    loading = false,
    error,
    pagination,
    searchTerm = '',
    filters,
    cacheHit = false,
    recentSearches = [],
    search,
    setSearchTerm,
    setFilters,
    clearFilters,
    loadMore,
    refresh,
    addToRecentSearches,
    clearCache
  } = useProductSearch({
    enableCaching: true,
    cacheExpiry: 30,
    debounceMs: 300,
    minSearchLength: 2,
    autoSearch: true
  })

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map(p => p.category).filter(Boolean) as string[])
  ).sort()

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
  }

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setFilters({ category: category === 'all' ? '' : category })
  }

  // Handle price range filter
  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRange(range)
    
    let minPrice = ''
    let maxPrice = ''
    
    switch (range) {
      case '0-100':
        minPrice = '0'
        maxPrice = '100'
        break
      case '100-500':
        minPrice = '100'
        maxPrice = '500'
        break
      case '500-1000':
        minPrice = '500'
        maxPrice = '1000'
        break
      case '1000+':
        minPrice = '1000'
        maxPrice = '999999'
        break
      default:
        break
    }
    
    setFilters({ minPrice, maxPrice })
  }

  // Export selected products
  const handleExportSelected = () => {
    try {
      const selectedProductsData = products.filter(p => selectedProducts.has(p.id))
      
      if (selectedProductsData.length === 0) {
        showErrorToast('Export Failed', 'No products selected for export')
        return
      }
      
      // Create CSV content
      const headers = ['Name', 'Description', 'HS Code', 'Category', 'Price', 'Tax Rate', 'UOM']
      const csvContent = [
        headers.join(','),
        ...selectedProductsData.map(p => [
          `"${p.name.replace(/"/g, '""')}"`,
          `"${(p.description || '').replace(/"/g, '""')}"`,
          p.hsCode,
          `"${(p.category || '').replace(/"/g, '""')}"`,
          p.unitPrice,
          p.taxRate,
          p.unitOfMeasurement
        ].join(','))
      ].join('\n')
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `products_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      showSuccessToast('Export Successful', `Exported ${selectedProductsData.length} products`)
    } catch (error) {
      handleGenericError(
        error instanceof Error ? error : new Error('Export failed'), 
        'Exporting products'
      )
    }
  }

  // Clear cache
  const handleClearCache = () => {
    try {
      clearCache()
      showSuccessToast('Cache Cleared', 'Product search cache has been cleared')
    } catch (error) {
      handleGenericError(
        error instanceof Error ? error : new Error('Clear cache failed'), 
        'Clearing cache'
      )
    }
  }

  // Show loading skeleton for SSR
  if (!isClient) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Search</h1>
          <p className="text-gray-600 mt-1">
            Search and manage your product catalog with advanced filtering
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
          <Button variant="outline" onClick={handleClearCache}>
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination?.totalCount || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Page</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination?.currentPage || 1}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                of {pagination?.totalPages || 1}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cache Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cacheHit ? 'Hit' : 'Miss'}
                </p>
              </div>
              <div className={`h-3 w-3 rounded-full ${cacheHit ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-gray-900">{selectedProducts.size}</p>
              </div>
              {selectedProducts.size > 0 && (
                <Button variant="outline" size="sm" onClick={handleExportSelected}>
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <Label htmlFor="priceRange">Price Range (PKR)</Label>
                <Select value={selectedPriceRange} onValueChange={handlePriceRangeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Price</SelectItem>
                    <SelectItem value="0-100">0 - 100</SelectItem>
                    <SelectItem value="100-500">100 - 500</SelectItem>
                    <SelectItem value="500-1000">500 - 1,000</SelectItem>
                    <SelectItem value="1000+">1,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select 
                  value={filters?.sortBy || 'name'} 
                  onValueChange={(value) => setFilters({ sortBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="unitPrice">Price</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="updatedAt">Updated Date</SelectItem>
                    <SelectItem value="hsCode">HS Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Select 
                  value={filters?.sortOrder || 'asc'} 
                  onValueChange={(value) => setFilters({ sortOrder: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Recent Searches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {recentSearches.map((query, index) => (
                    <Badge
                      key={`${query}-${index}`}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-300"
                      onClick={() => setSearchTerm(query)}
                    >
                      {query}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {selectedProducts.size > 0 && (
                <Button variant="outline" size="sm" onClick={handleExportSelected}>
                  <Download className="h-4 w-4 mr-1" />
                  Export ({selectedProducts.size})
                </Button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="mb-4 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-800">Error: {String(error)}</p>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && products.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-2'
            }>
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedProducts.has(product.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleProductSelect(product.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate flex-1">
                        {product.name}
                      </h3>
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => {}} // Handled by card click
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 text-blue-600 rounded ml-2"
                      />
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-blue-600">
                        PKR {product.unitPrice.toLocaleString()}
                      </span>
                      <Badge variant="secondary">{product.unitOfMeasurement}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>HS: {product.hsCode}</span>
                      <span>{product.taxRate}% tax</span>
                    </div>
                    {product.category && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {product.category}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => search(searchTerm, pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage || loading}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => search(searchTerm, pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage || loading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductSearchPage() {
  return <ProductSearchContent />
}