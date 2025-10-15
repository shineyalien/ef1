'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Plus, Mail, Phone, MapPin, Building } from "lucide-react"
import Link from "next/link"
import { SharedLoading } from "@/components/shared-loading"
import { SharedNavigation } from "@/components/shared-navigation"

// Prevent static generation for this page since it uses useSession
export const dynamic = 'force-dynamic'

export default function CustomersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [customers, setCustomers] = useState<any[]>([])
  const [businessData, setBusinessData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      redirect('/auth/login')
      return
    }

    loadData()
  }, [session, status])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Fetch customers from API
      const customersResponse = await fetch('/api/customers')
      if (customersResponse.ok) {
        const result = await customersResponse.json()
        setCustomers(result.customers || [])
      } else {
        console.error('Failed to fetch customers:', customersResponse.statusText)
        setCustomers([])
      }
      
      // Fetch business data
      const businessResponse = await fetch('/api/settings/business')
      if (businessResponse.ok) {
        const businessResult = await businessResponse.json()
        setBusinessData(businessResult.business)
      } else {
        console.error('Failed to fetch business data:', businessResponse.statusText)
      }
      
    } catch (error) {
      console.error('Failed to load data:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return <SharedLoading message="Loading customers..." />
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
              <form action="/api/auth/signout" method="post">
                <Button variant="outline" type="submit">Sign out</Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SharedNavigation
          backUrl="/dashboard"
          backLabel="Dashboard"
          showHome={false}
          currentPage="Customers"
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
            <p className="text-gray-600">Manage your customer database and information.</p>
          </div>
          <Link href="/customers/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        </div>

        {/* Business Info - Mock for now */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              {businessData?.companyName || 'Demo Business'} ({session?.user?.name})
            </CardTitle>
            <CardDescription>
              NTN: {businessData?.ntnNumber || '1234567'} • {businessData?.province || 'Punjab'}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Directory</CardTitle>
            <CardDescription>
              {customers.length} customer{customers.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first customer to create invoices.</p>
                <Link href="/customers/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Customer
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            customer.registrationType === 'REGISTERED' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {customer.registrationType}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          {customer.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {customer.phone}
                            </div>
                          )}
                          {customer.address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {customer.city}, {customer.province}
                            </div>
                          )}
                        </div>

                        {customer.ntnNumber && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>NTN:</strong> {customer.ntnNumber}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Create Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}