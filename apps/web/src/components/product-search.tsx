'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string | null
  hsCode: string
  unitOfMeasurement: string
  unitPrice: number
  taxRate: number
  fbrSaleType: string | null
}

interface ProductSearchProps {
  onSelect: (product: Product) => void
  className?: string
  placeholder?: string
}

export function ProductSearch({ onSelect, className = '', placeholder = 'Search products...' }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Search products with debounce
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchTerm)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.products || [])
        }
      } catch (error) {
        console.error('Product search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleSelectProduct = (product: Product) => {
    onSelect(product)
    setSearchTerm('')
    setShowDropdown(false)
    setResults([])
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (searchTerm.length >= 2 || results.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-sm text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
                >
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-gray-600 truncate">{product.description}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1 flex gap-3">
                        <span>HS: {product.hsCode}</span>
                        <span>PKR {product.unitPrice.toLocaleString()}</span>
                        <span>{product.taxRate}% tax</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : searchTerm.length >= 2 ? (
            <div className="p-3 text-center text-sm text-gray-500">
              No products found
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
