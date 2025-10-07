'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ArrowLeft, User, Mail, Phone, MapPin, Building } from 'lucide-react'

export default function NewCustomerPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    ntnNumber: '',
    registrationType: 'UNREGISTERED'
  })

  const provinces = [
    'Punjab',
    'Sindh', 
    'Khyber Pakhtunkhwa',
    'Balochistan',
    'Islamabad Capital Territory',
    'Gilgit-Baltistan',
    'Azad Jammu & Kashmir'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!customerData.name.trim()) {
        setError('Customer name is required.')
        return
      }
      if (!customerData.address.trim()) {
        setError('Address is required.')
        return
      }
      if (!customerData.province) {
        setError('Province is required.')
        return
      }

      console.log('Creating customer:', customerData)
      
      // Call the API
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create customer')
      }

      const result = await response.json()
      console.log('Customer created successfully:', result)
      
      router.push('/customers')
    } catch (error) {
      console.error('Error creating customer:', error)
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegistrationTypeChange = (type: string) => {
    setCustomerData({
      ...customerData,
      registrationType: type,
      ntnNumber: type === 'UNREGISTERED' ? '' : customerData.ntnNumber
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <Building className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

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
              <Link href="/customers">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Customers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Customer</h1>
          <p className="text-gray-600">Enter customer information to start creating invoices.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>
              Fill in the details for your new customer. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Registration Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Customer Type *</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="registrationType"
                      value="REGISTERED"
                      checked={customerData.registrationType === 'REGISTERED'}
                      onChange={(e) => handleRegistrationTypeChange(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Registered (Has NTN)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="registrationType"
                      value="UNREGISTERED"
                      checked={customerData.registrationType === 'UNREGISTERED'}
                      onChange={(e) => handleRegistrationTypeChange(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Unregistered (Individual)</span>
                  </label>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    <User className="inline h-4 w-4 mr-1" />
                    Customer Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={customerData.registrationType === 'REGISTERED' ? 'Company Name' : 'Full Name'}
                    required
                  />
                </div>

                {customerData.registrationType === 'REGISTERED' && (
                  <div className="space-y-2">
                    <label htmlFor="ntnNumber" className="text-sm font-medium text-gray-700">
                      <Building className="inline h-4 w-4 mr-1" />
                      NTN Number *
                    </label>
                    <input
                      id="ntnNumber"
                      type="text"
                      value={customerData.ntnNumber}
                      onChange={(e) => setCustomerData({...customerData, ntnNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234567"
                      required={customerData.registrationType === 'REGISTERED'}
                    />
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+92-300-1234567"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-gray-700">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={customerData.address}
                    onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={customerData.city}
                      onChange={(e) => setCustomerData({...customerData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="province" className="text-sm font-medium text-gray-700">
                      Province
                    </label>
                    <select
                      id="province"
                      value={customerData.province}
                      onChange={(e) => setCustomerData({...customerData, province: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Province</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      value={customerData.postalCode}
                      onChange={(e) => setCustomerData({...customerData, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="54000"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6">
                <Link href="/customers">
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Creating Customer...' : 'Create Customer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}