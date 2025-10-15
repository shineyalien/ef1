'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  UserPlus,
  Wifi,
  WifiOff
} from "lucide-react"
import { useNetworkStatus } from '@/hooks/use-network-status'
import { useOfflineCustomers } from '@/hooks/use-offline'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  ntn?: string
  createdAt: string
  isOffline?: boolean
}

export default function MobileCustomerManager() {
  const { data: session } = useSession()
  const { isOnline } = useNetworkStatus()
  const { saveOfflineCustomer, getOfflineCustomers, hasUnsyncedCustomers } = useOfflineCustomers()
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    ntn: ''
  })

  useEffect(() => {
    loadCustomers()
  }, [isOnline])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      let customerData: Customer[] = []
      
      if (isOnline) {
        // Load from server
        const response = await fetch('/api/customers')
        if (response.ok) {
          customerData = await response.json()
        }
      }
      
      // Always load offline customers and merge
      const offlineCustomers = await getOfflineCustomers()
      const mergedCustomers = [
        ...customerData,
        ...offlineCustomers.map((c: any) => ({ ...c, isOffline: true }))
      ]
      
      setCustomers(mergedCustomers)
    } catch (error) {
      console.error('Load customers error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCustomer = async () => {
    if (!newCustomer.name.trim()) return
    
    setSaving(true)
    try {
      const customerData = {
        ...newCustomer,
        id: `cust_${Date.now()}`,
        createdAt: new Date().toISOString()
      }

      if (isOnline) {
        // Save to server
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData)
        })

        if (response.ok) {
          const savedCustomer = await response.json()
          setCustomers(prev => [savedCustomer, ...prev])
        } else {
          throw new Error('Failed to save customer')
        }
      } else {
        // Save offline
        const offlineId = await saveOfflineCustomer(customerData)
        if (offlineId) {
          setCustomers(prev => [{ ...customerData, isOffline: true }, ...prev])
        }
      }
      
      setNewCustomer({ name: '', email: '', phone: '', address: '', ntn: '' })
      setShowAddForm(false)
    } catch (error) {
      console.error('Save customer error:', error)
      alert('Failed to save customer')
    } finally {
      setSaving(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Customers</span>
            </div>
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              {hasUnsyncedCustomers && (
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              )}
              <Button
                onClick={() => setShowAddForm(true)}
                size="sm"
                className="h-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Connection Status */}
        {!isOnline && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <WifiOff className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  Offline Mode - Changes will sync when online
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="pl-10"
          />
        </div>

        {/* Add Customer Form */}
        {showAddForm && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Add New Customer</CardTitle>
                <Button
                  onClick={() => setShowAddForm(false)}
                  size="sm"
                  variant="ghost"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+92 xxx xxx xxxx"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ntn" className="text-sm font-medium">NTN</Label>
                <Input
                  id="ntn"
                  value={newCustomer.ntn}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, ntn: e.target.value }))}
                  placeholder="NTN Number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Customer address"
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <Button
                  onClick={addCustomer}
                  disabled={saving || !newCustomer.name.trim()}
                  className="flex-1"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Add Customer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No customers match your search.' : 'Start by adding your first customer.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className={customer.isOffline ? 'border-orange-200 bg-orange-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        {customer.isOffline && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            Offline
                          </span>
                        )}
                      </div>
                      
                      {customer.email && (
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                      
                      {customer.phone && (
                        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      
                      {customer.address && (
                        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{customer.address}</span>
                        </div>
                      )}
                      
                      {customer.ntn && (
                        <div className="mt-1 text-sm text-gray-600">
                          <span className="font-medium">NTN:</span> {customer.ntn}
                        </div>
                      )}
                      
                      <div className="mt-2 text-xs text-gray-500">
                        Added {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}