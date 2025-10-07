'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Search, Package, Filter, X, ChevronDown, Loader2, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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

interface SearchFilters {
  category: string
  minPrice: string
  maxPrice: string
  sortBy: string
  sortOrder: string
  hsCode: string
}

interface ProductSearchResponse {
  success: boolean
  products: Product[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  filters: SearchFilters
  metadata: {
    processingTime: number
    businessId: string
  }
}

interface EnhancedProductSearchProps {
  onSelect: (product: Product) => void
  className?: string
  placeholder?: string
  showAdvancedFilters?: boolean
  enableCaching?: boolean
  cacheExpiry?: number // in minutes
}

// Cache configuration
const CACHE_KEY_PREFIX = 'product_search_cache_'
const DEFAULT_CACHE_EXPIRY = 30 // 30 minutes
const RECENT_SEARCHES_KEY = 'product_recent_searches'
const MAX_RECENT_SEARCHES = 5

export function EnhancedProductSearch({ 
  onSelect, 
  className = '', 
  placeholder = 'Search products by name, code, or category...',
  showAdvancedFilters = true,
  enableCaching = true,
  cacheExpiry = DEFAULT_CACHE_EXPIRY
}: EnhancedProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc',
    hsCode: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [cacheHit, setCacheHit] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (stored) {
        setRecentSearches(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get cache key for current search
  const getCacheKey = useCallback((query: string, filters: SearchFilters, page: number) => {
    const filterString = JSON.stringify({ ...filters, page })
    return `${CACHE_KEY_PREFIX}${btoa(query + filterString)}`
  }, [])

  // Get cached results
  const getCachedResults = useCallback((cacheKey: string) => {
    if (!enableCaching) return null
    
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        const ageInMinutes = (Date.now() - timestamp) / (1000 * 60)
        
        if (ageInMinutes < cacheExpiry) {
          return data
        } else {
          // Remove expired cache
          localStorage.removeItem(cacheKey)
        }
      }
    } catch (error) {
      console.error('Failed to get cached results:', error)
    }
    
    return null
  }, [enableCaching, cacheExpiry])

  // Cache results
  const cacheResults = useCallback((cacheKey: string, data: ProductSearchResponse) => {
    if (!enableCaching) return
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Failed to cache results:', error)
    }
  }, [enableCaching])

  // Add search to recent searches
  const addToRecentSearches = useCallback((query: string) => {
    if (!query.trim()) return
    
    try {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES)
      setRecentSearches(updated)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to save recent searches:', error)
    }
  }, [recentSearches])

  // Search products with debounce and caching
  const searchProducts = useCallback(async (query: string, page: number = 1) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setCacheHit(false)

    try {
      // Check cache first
      const cacheKey = getCacheKey(query, filters, page)
      const cachedResults = getCachedResults(cacheKey)
      
      if (cachedResults) {
        setResults(cachedResults.products)
        setPagination(cachedResults.pagination)
        setCacheHit(true)
        setLoading(false)
        return
      }

      // Build search URL with parameters
      const searchParams = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: '20',
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })

      // Add filters if provided
      if (filters.category) searchParams.append('category', filters.category)
      if (filters.minPrice) searchParams.append('minPrice', filters.minPrice)
      if (filters.maxPrice) searchParams.append('maxPrice', filters.maxPrice)
      if (filters.hsCode) searchParams.append('hsCode', filters.hsCode)

      const response = await fetch(`/api/products/search?${searchParams}`, {
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data: ProductSearchResponse = await response.json()
      
      if (data.success) {
        setResults(data.products)
        setPagination(data.pagination)
        
        // Cache the results
        cacheResults(cacheKey, data)
        
        // Add to recent searches if this is a new search
        if (page === 1 && query.length >= 2) {
          addToRecentSearches(query)
        }
      } else {
        throw new Error('Search failed')
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Search request was aborted')
        return
      }
      console.error('Product search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [filters, getCacheKey, getCachedResults, cacheResults, addToRecentSearches])

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Only search if query is empty or has at least 2 characters
    if (searchTerm.length === 0 || searchTerm.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchProducts(searchTerm, 1)
      }, 300) // 300ms debounce
    } else {
      setResults([])
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false
      })
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm, filters, searchProducts])

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setShowDropdown(true)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  // Handle filter change
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    searchProducts(searchTerm, page)
  }

  // Handle product selection
  const handleSelectProduct = (product: Product) => {
    onSelect(product)
    setSearchTerm('')
    setShowDropdown(false)
    setResults([])
  }

  // Handle recent search click
  const handleRecentSearchClick = (query: string) => {
    setSearchTerm(query)
    setShowDropdown(true)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
      sortOrder: 'asc',
      hsCode: ''
    })
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '' && value !== 'name' && value !== 'asc')
  }, [filters])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          </div>
        )}
        {!loading && cacheHit && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Clock className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      {showAdvancedFilters && (
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            {showFilters ? 'Hide' : 'Show'} Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">Active</Badge>
            )}
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <Card className="mt-2">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Filter by category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="hsCode">HS Code</Label>
                <Input
                  id="hsCode"
                  placeholder="Filter by HS code"
                  value={filters.hsCode}
                  onChange={(e) => handleFilterChange('hsCode', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="minPrice">Min Price</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxPrice">Max Price</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="999999"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="unitPrice">Price</SelectItem>
                    <SelectItem value="createdAt">Created</SelectItem>
                    <SelectItem value="updatedAt">Updated</SelectItem>
                    <SelectItem value="hsCode">HS Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                  disabled={!hasActiveFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Searching...</span>
            </div>
          )}

          {/* Recent Searches */}
          {!loading && searchTerm.length === 0 && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Recent Searches</span>
                <Clock className="h-3 w-3 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-1">
                {recentSearches.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(query)}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {!loading && results.length > 0 && (
            <>
              {/* Results Header */}
              <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    {pagination.totalCount} Products Found
                    {cacheHit && <span className="ml-1 text-green-600">(Cached)</span>}
                  </span>
                  {searchTerm && (
                    <Badge variant="outline" className="text-xs">
                      {searchTerm}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product List */}
              <div className="divide-y divide-gray-100">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors focus:outline-none focus:bg-blue-50"
                  >
                    <div className="flex items-start gap-3">
                      <Package className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="font-medium text-gray-900 truncate">{product.name}</div>
                          <div className="text-sm font-semibold text-blue-600 ml-2 flex-shrink-0">
                            PKR {product.unitPrice.toLocaleString()}
                          </div>
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-600 truncate mt-1">{product.description}</div>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">HS: {product.hsCode}</span>
                          <span className="text-xs text-gray-500">{product.unitOfMeasurement}</span>
                          <span className="text-xs text-gray-500">{product.taxRate}% tax</span>
                          {product.category && (
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="sticky bottom-0 bg-gray-50 px-4 py-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!loading && searchTerm.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No products found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Initial State */}
          {!loading && searchTerm.length < 2 && (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}