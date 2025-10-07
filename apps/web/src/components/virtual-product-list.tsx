'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Search, Package, Loader2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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

interface VirtualProductListProps {
  products: Product[]
  onSelect: (product: Product) => void
  loading?: boolean
  hasNextPage?: boolean
  onLoadMore?: () => void
  className?: string
  itemHeight?: number
  containerHeight?: number
  searchPlaceholder?: string
  showSearch?: boolean
  emptyMessage?: string
  loadingMoreMessage?: string
}

export function VirtualProductList({
  products,
  onSelect,
  loading = false,
  hasNextPage = false,
  onLoadMore,
  className = '',
  itemHeight = 80,
  containerHeight = 400,
  searchPlaceholder = 'Search products...',
  showSearch = true,
  emptyMessage = 'No products found',
  loadingMoreMessage = 'Loading more products...'
}: VirtualProductListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [scrollTop, setScrollTop] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products
    
    const searchLower = searchTerm.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.hsCode.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower) ||
      product.serialNumber?.toLowerCase().includes(searchLower)
    )
  }, [products, searchTerm])

  // Calculate visible items
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      filteredProducts.length
    )
    
    return {
      startIndex,
      endIndex,
      items: filteredProducts.slice(startIndex, endIndex)
    }
  }, [scrollTop, itemHeight, containerHeight, filteredProducts])

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    setScrollTop(element.scrollTop)
    
    // Set scrolling state for performance optimization
    setIsScrolling(true)
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150)

    // Check if we need to load more items
    if (
      hasNextPage &&
      onLoadMore &&
      element.scrollTop + element.clientHeight >= element.scrollHeight - 200
    ) {
      onLoadMore()
    }
  }, [hasNextPage, onLoadMore])

  // Handle product selection
  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProductId(product.id)
    onSelect(product)
  }, [onSelect])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!filteredProducts.length) return
    
    const currentIndex = selectedProductId 
      ? filteredProducts.findIndex(p => p.id === selectedProductId)
      : -1
    
    let newIndex = currentIndex
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        newIndex = Math.min(currentIndex + 1, filteredProducts.length - 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        newIndex = Math.max(currentIndex - 1, 0)
        break
      case 'Enter':
        e.preventDefault()
        if (currentIndex >= 0 && currentIndex < filteredProducts.length) {
          const product = filteredProducts[currentIndex]
          if (product) {
            handleProductSelect(product)
          }
        }
        return
      case 'Escape':
        e.preventDefault()
        setSelectedProductId(null)
        return
      default:
        return
    }
    
    if (newIndex !== currentIndex && newIndex >= 0) {
      const product = filteredProducts[newIndex]
      if (product) {
        setSelectedProductId(product.id)
        
        // Scroll the selected item into view
        const container = containerRef.current
        if (container) {
          const targetScrollTop = newIndex * itemHeight
          container.scrollTop = targetScrollTop
        }
      }
    }
  }, [filteredProducts, selectedProductId, handleProductSelect, itemHeight])

  // Cleanup scroll timeout
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Search Input */}
      {showSearch && (
        <div className="relative mb-3">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10"
            onKeyDown={handleKeyDown}
          />
        </div>
      )}

      {/* Virtual List Container */}
      <div
        ref={containerRef}
        className="relative overflow-auto border border-gray-200 rounded-lg"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Total height spacer */}
        <div style={{ height: filteredProducts.length * itemHeight }} />
        
        {/* Visible items */}
        {visibleItems.items.map((product, index) => {
          const actualIndex = visibleItems.startIndex + index
          const isSelected = selectedProductId === product.id
          
          return (
            <div
              key={product.id}
              className={cn(
                'absolute left-0 right-0 p-4 border-b border-gray-100 cursor-pointer transition-colors',
                'hover:bg-blue-50 focus:bg-blue-50 focus:outline-none',
                isSelected && 'bg-blue-100 border-blue-200',
                isScrolling && 'transition-none'
              )}
              style={{
                height: itemHeight,
                top: actualIndex * itemHeight
              }}
              onClick={() => handleProductSelect(product)}
            >
              <div className="flex items-start gap-3 h-full">
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
            </div>
          )
        })}

        {/* Loading indicator */}
        {loading && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-2" />
            <span className="text-sm text-gray-600">{loadingMoreMessage}</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">{emptyMessage}</p>
            </div>
          </div>
        )}

        {/* Load more indicator */}
        {hasNextPage && !loading && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              className="w-full"
            >
              <ChevronDown className="h-3 w-3 mr-1" />
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        {filteredProducts.length > 0 && (
          <>
            Showing {visibleItems.startIndex + 1}-{Math.min(visibleItems.endIndex, filteredProducts.length)} of {filteredProducts.length} products
            {searchTerm && ` (filtered from ${products.length} total)`}
          </>
        )}
      </div>
    </div>
  )
}