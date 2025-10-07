'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Eye, EyeOff, Building, User, Mail, Phone, MapPin } from 'lucide-react'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // User data
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })

  // Business data
  const [businessData, setBusinessData] = useState({
    companyName: '',
    ntnNumber: '',
    address: '',
    province: '',
    city: '',
    businessType: '',
    sector: ''
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

  const businessTypes = [
    'Manufacturer',
    'Trader',
    'Service Provider',
    'Retailer',
    'Wholesaler',
    'Importer',
    'Exporter',
    'Restaurant',
    'IT Services',
    'Consultant'
  ]

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setStep(2)
  }

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Call the registration API with both user and business data
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // User data
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          // Business data
          companyName: businessData.companyName,
          ntnNumber: businessData.ntnNumber,
          address: businessData.address,
          province: businessData.province,
          city: businessData.city,
          businessType: businessData.businessType,
          sector: businessData.sector
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed')
      }

      alert('Account created successfully! Please login with your credentials.')
      router.push('/auth/login')
    } catch (error) {
      console.error('Registration error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Easy Filer</span>
          </div>
          <p className="text-gray-600">Create your account</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {step === 1 ? 'Personal Information' : 'Business Information'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 ? 'Step 1 of 2: Enter your personal details' : 'Step 2 of 2: Set up your business profile'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <form onSubmit={handleUserSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      <User className="inline h-4 w-4 mr-1" />
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+92-300-1234567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={userData.password}
                      onChange={(e) => setUserData({...userData, password: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={userData.confirmPassword}
                    onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Continue to Business Information
                </Button>
              </form>
            )}

            {/* Step 2: Business Information */}
            {step === 2 && (
              <form onSubmit={handleBusinessSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                    <Building className="inline h-4 w-4 mr-1" />
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={businessData.companyName}
                    onChange={(e) => setBusinessData({...businessData, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="ntnNumber" className="text-sm font-medium text-gray-700">
                    NTN Number
                  </label>
                  <input
                    id="ntnNumber"
                    type="text"
                    value={businessData.ntnNumber}
                    onChange={(e) => setBusinessData({...businessData, ntnNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1234567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-gray-700">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={businessData.address}
                    onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="province" className="text-sm font-medium text-gray-700">
                      Province
                    </label>
                    <select
                      id="province"
                      value={businessData.province}
                      onChange={(e) => setBusinessData({...businessData, province: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Province</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={businessData.city}
                      onChange={(e) => setBusinessData({...businessData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="businessType" className="text-sm font-medium text-gray-700">
                    Business Type
                  </label>
                  <select
                    id="businessType"
                    value={businessData.businessType}
                    onChange={(e) => setBusinessData({...businessData, businessType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Business Type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="sector" className="text-sm font-medium text-gray-700">
                    Sector
                  </label>
                  <input
                    id="sector"
                    type="text"
                    value={businessData.sector}
                    onChange={(e) => setBusinessData({...businessData, sector: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Technology, Manufacturing, etc."
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}