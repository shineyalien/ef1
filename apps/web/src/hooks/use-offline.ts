import { useEffect, useState } from 'react'
import { PWAUtils } from '../components/pwa/pwa-manager'

interface OfflineInvoice {
  id: string
  data: any
  timestamp: number
  synced: boolean
}

export function useOfflineInvoices() {
  const [offlineInvoices, setOfflineInvoices] = useState<OfflineInvoice[]>([])
  const [isOnline, setIsOnline] = useState(true) // Default to true for SSR
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)

    // Set initial online status on client
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    // Only load data on client-side
    if (typeof window !== 'undefined') {
      loadOfflineInvoices()
    }

    const handleOnline = () => {
      setIsOnline(true)
      syncOfflineInvoices()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadOfflineInvoices = async () => {
    try {
      const stored = await PWAUtils.getOfflineData('invoices') as OfflineInvoice[]
      setOfflineInvoices(Array.isArray(stored) ? stored : [])
    } catch (error) {
      console.error('Error loading offline invoices:', error)
      setOfflineInvoices([])
    }
  }

  const saveOfflineInvoice = async (invoiceData: any) => {
    const offlineInvoice: OfflineInvoice = {
      id: `offline_${Date.now()}`,
      data: invoiceData,
      timestamp: Date.now(),
      synced: false
    }

    const success = await PWAUtils.storeOfflineData('invoices', offlineInvoice)
    if (success) {
      setOfflineInvoices(prev => [...prev, offlineInvoice])
      
      // Register for background sync
      PWAUtils.registerBackgroundSync('sync-invoices')
      
      return offlineInvoice.id
    }
    return null
  }

  const syncOfflineInvoices = async () => {
    const unsynced = offlineInvoices.filter(invoice => !invoice.synced)
    
    for (const invoice of unsynced) {
      try {
        const response = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoice.data)
        })

        if (response.ok) {
          // Mark as synced
          invoice.synced = true
          console.log('Synced offline invoice:', invoice.id)
        }
      } catch (error) {
        console.log('Failed to sync invoice:', error)
      }
    }

    setOfflineInvoices([...offlineInvoices])
  }

  return {
    offlineInvoices,
    saveOfflineInvoice,
    syncOfflineInvoices,
    isOnline,
    hasUnsyncedInvoices: Array.isArray(offlineInvoices) ? offlineInvoices.some(inv => !inv.synced) : false
  }
}

export function useOfflineCustomers() {
  const [offlineCustomers, setOfflineCustomers] = useState<any[]>([])
  const [isOnline, setIsOnline] = useState(true) // Default to true for SSR
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)

    // Set initial online status on client
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    // Only load data on client-side
    if (typeof window !== 'undefined') {
      loadOfflineCustomers()
    }

    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadOfflineCustomers = async () => {
    try {
      const stored = await PWAUtils.getOfflineData('customers') as any[]
      setOfflineCustomers(Array.isArray(stored) ? stored : [])
    } catch (error) {
      console.error('Error loading offline customers:', error)
      setOfflineCustomers([])
    }
  }

  const getOfflineCustomers = async (): Promise<any[]> => {
    try {
      const stored = await PWAUtils.getOfflineData('customers') as any[]
      const customers = Array.isArray(stored) ? stored : []
      setOfflineCustomers(customers)
      return customers
    } catch (error) {
      console.error('Error getting offline customers:', error)
      setOfflineCustomers([])
      return []
    }
  }

  const saveOfflineCustomer = async (customerData: any): Promise<string | null> => {
    const offlineCustomer = {
      id: `offline_${Date.now()}`,
      ...customerData,
      timestamp: Date.now(),
      synced: false
    }

    const success = await PWAUtils.storeOfflineData('customers', offlineCustomer)
    if (success) {
      setOfflineCustomers(prev => [...prev, offlineCustomer])
      return offlineCustomer.id
    }
    return null
  }

  return {
    offlineCustomers,
    saveOfflineCustomer,
    getOfflineCustomers,
    hasUnsyncedCustomers: Array.isArray(offlineCustomers) ? offlineCustomers.length > 0 : false,
    isOnline
  }
}

export function useOfflineBulkOperations() {
  const [offlineOperations, setOfflineOperations] = useState([])
  const [isOnline, setIsOnline] = useState(true) // Default to true for SSR

  useEffect(() => {
    // Set initial online status on client
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine)
    }
  }, [])

  const saveOfflineBulkOperation = async (operationData: any) => {
    // Implementation for bulk operations
    console.log('Saving offline bulk operation:', operationData)
  }

  return {
    offlineOperations,
    saveOfflineBulkOperation,
    isOnline
  }
}