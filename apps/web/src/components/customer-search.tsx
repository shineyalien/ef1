'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Plus, User } from 'lucide-react'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  ntnNumber: string | null
  registrationType: string
  address: string
  buyerProvince: string | null
  phone: string | null
  email: string | null
}

interface CustomerSearchProps {
  onSelect: (customer: Customer) => void
  selectedCustomer: Customer | null
  className?: string
}

export function CustomerSearch({ onSelect, selectedCustomer, className = '' }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Customer[]>([])
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

  // Search customers with debounce
  useEffect(() => {
    const searchCustomers = async () => {
      if (searchTerm.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/customers/search?q=${encodeURIComponent(searchTerm)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.customers || [])
        }
      } catch (error) {
        console.error('Customer search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchCustomers, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleSelectCustomer = (customer: Customer) => {
    onSelect(customer)
    setSearchTerm(customer.name)
    setShowDropdown(false)
  }

  const handleClearSelection = () => {
    onSelect(null as any)
    setSearchTerm('')
    setResults([])
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Customer <span className="text-red-500">*</span>
      </label>
      
      {selectedCustomer ? (
        // Selected customer display
        <div className="border border-green-300 bg-green-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-gray-900">{selectedCustomer.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedCustomer.registrationType === 'REGISTERED'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedCustomer.registrationType}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {selectedCustomer.ntnNumber && (
                  <div>NTN: {selectedCustomer.ntnNumber}</div>
                )}
                <div>{selectedCustomer.address}</div>
                {selectedCustomer.buyerProvince && (
                  <div>Province: {selectedCustomer.buyerProvince}</div>
                )}
                {selectedCustomer.phone && <div>Phone: {selectedCustomer.phone}</div>}
                {selectedCustomer.email && <div>Email: {selectedCustomer.email}</div>}
              </div>
            </div>
            <button
              onClick={handleClearSelection}
              className="ml-4 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        // Search input
        <>
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
              placeholder="Search by name, NTN, phone, or email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Dropdown results */}
          {showDropdown && (searchTerm.length >= 2 || results.length > 0) && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
              ) : results.length > 0 ? (
                <>
                  {results.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
                    >
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {customer.ntnNumber && `NTN: ${customer.ntnNumber} • `}
                        {customer.registrationType}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {customer.address}
                      </div>
                    </button>
                  ))}
                </>
              ) : searchTerm.length >= 2 ? (
                <div className="p-4 text-center text-gray-500">
                  No customers found
                </div>
              ) : null}
              
              {/* Add new customer link */}
              <Link
                href="/customers/new"
                className="block w-full px-4 py-3 text-blue-600 hover:bg-blue-50 border-t border-gray-200 flex items-center gap-2 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Customer</span>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
