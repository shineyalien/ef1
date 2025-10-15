'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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

export interface SearchFilters {
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

interface UseProductSearchOptions {
  enableCaching?: boolean
  cacheExpiry?: number // in minutes
  debounceMs?: number
  minSearchLength?: number
  autoSearch?: boolean
}

interface UseProductSearchReturn {
  products: Product[]
  loading: boolean
  error: string | null
  pagination: ProductSearchResponse['pagination']
  searchTerm: string
  filters: SearchFilters
  cacheHit: boolean
  recentSearches: string[]
  search: (query: string, page?: number) => Promise<void>
  setSearchTerm: (term: string) => void
  setFilters: (filters: Partial<SearchFilters>) => void
  clearFilters: () => void
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  addToRecentSearches: (query: string) => void
  clearCache: () => void
}

const CACHE_KEY_PREFIX = 'product_search_cache_'
const RECENT_SEARCHES_KEY = 'product_recent_searches'
const MAX_RECENT_SEARCHES = 5
const DEFAULT_CACHE_EXPIRY = 30 // 30 minutes
const DEFAULT_DEBOUNCE_MS = 300
const DEFAULT_MIN_SEARCH_LENGTH = 2

export function useProductSearch(options: UseProductSearchOptions = {}): UseProductSearchReturn {
  const {
    enableCaching = true,
    cacheExpiry = DEFAULT_CACHE_EXPIRY,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
    autoSearch = true
  } = options

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFiltersState] = useState<SearchFilters>({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc',
    hsCode: ''
  })
  const [pagination, setPagination] = useState<ProductSearchResponse['pagination']>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [cacheHit, setCacheHit] = useState(false)

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastSearchRef = useRef<{ query: string; page: number } | null>(null)

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

  // Clear all cache
  const clearCache = useCallback(() => {
    if (!enableCaching) return
    
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }, [enableCaching])

  // Search products
  const search = useCallback(async (query: string, page: number = 1) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)
    setCacheHit(false)

    try {
      // Check if this is the same search as the last one
      if (lastSearchRef.current && 
          lastSearchRef.current.query === query && 
          lastSearchRef.current.page === page) {
        setLoading(false)
        return
      }

      // Update last search ref
      lastSearchRef.current = { query, page }

      // Check cache first
      const cacheKey = getCacheKey(query, filters, page)
      const cachedResults = getCachedResults(cacheKey)
      
      if (cachedResults) {
        setProducts(cachedResults.products)
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
        setProducts(data.products)
        setPagination(data.pagination)
        
        // Cache the results
        cacheResults(cacheKey, data)
        
        // Add to recent searches if this is a new search
        if (page === 1 && query.length >= minSearchLength) {
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
      setError(error.message || 'Search failed')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [filters, getCacheKey, getCachedResults, cacheResults, addToRecentSearches, minSearchLength])

  // Debounced search effect
  useEffect(() => {
    if (!autoSearch) return

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Only search if query is empty or meets minimum length
    if (searchTerm.length === 0 || searchTerm.length >= minSearchLength) {
      searchTimeoutRef.current = setTimeout(() => {
        search(searchTerm, 1)
      }, debounceMs)
    } else {
      setProducts([])
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 20,
        hasNextPage: false,
        hasPreviousPage: false
      })
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm, filters, search, autoSearch, debounceMs, minSearchLength])

  // Update filters
  const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFiltersState({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
      sortOrder: 'asc',
      hsCode: ''
    })
  }, [])

  // Load more results
  const loadMore = useCallback(async () => {
    if (pagination.hasNextPage && !loading) {
      await search(searchTerm, pagination.currentPage + 1)
    }
  }, [search, searchTerm, pagination.currentPage, pagination.hasNextPage, loading])

  // Refresh current search
  const refresh = useCallback(async () => {
    // Clear cache for current search
    const cacheKey = getCacheKey(searchTerm, filters, pagination.currentPage)
    if (enableCaching) {
      localStorage.removeItem(cacheKey)
    }
    
    // Re-execute search
    await search(searchTerm, pagination.currentPage)
  }, [search, searchTerm, filters, pagination.currentPage, getCacheKey, enableCaching])

  return {
    products,
    loading,
    error,
    pagination,
    searchTerm,
    filters,
    cacheHit,
    recentSearches,
    search,
    setSearchTerm,
    setFilters,
    clearFilters,
    loadMore,
    refresh,
    addToRecentSearches,
    clearCache
  }
}