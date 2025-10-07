import { useEffect, useState, useCallback } from 'react'
import { PWAUtils } from '../components/pwa/pwa-manager'
import { syncService, SyncStatus } from '../lib/sync-service'

interface OfflineInvoice {
  id: string
  data: any
  timestamp: number
  synced: boolean
  syncedAt?: number
}

export function useOfflineInvoices() {
  const [offlineInvoices, setOfflineInvoices] = useState<OfflineInvoice[]>([])
  const [isOnline, setIsOnline] = useState(true) // Default to true for SSR
  const [isClient, setIsClient] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    totalItems: 0,
    pendingItems: 0,
    failedItems: 0,
    conflictItems: 0,
    syncedItems: 0,
    isSyncing: false
  })

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
      updateSyncStatus()
    }

    const handleOnline = () => {
      setIsOnline(true)
      syncService.triggerSync()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    // Listen to network status changes
    syncService.addNetworkStatusListener((online) => {
      setIsOnline(online)
    })

    // Listen to sync status changes
    syncService.addSyncStatusListener((status) => {
      setSyncStatus(status)
    })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      syncService.removeNetworkStatusListener(handleOnline)
    }
  }, [])

  const updateSyncStatus = useCallback(async () => {
    const status = await syncService.getSyncStatus()
    setSyncStatus(status)
  }, [])

  const loadOfflineInvoices = useCallback(async () => {
    try {
      const stored = await PWAUtils.getOfflineData('invoices') as OfflineInvoice[]
      setOfflineInvoices(Array.isArray(stored) ? stored : [])
    } catch (error) {
      console.error('Error loading offline invoices:', error)
      setOfflineInvoices([])
    }
  }, [])

  const saveOfflineInvoice = useCallback(async (invoiceData: any) => {
    const offlineInvoice: OfflineInvoice = {
      id: `offline_${Date.now()}`,
      data: invoiceData,
      timestamp: Date.now(),
      synced: false
    }

    try {
      // Save to IndexedDB
      const success = await PWAUtils.storeOfflineData('invoices', offlineInvoice)
      if (success) {
        setOfflineInvoices(prev => [...prev, offlineInvoice])
        
        // Add to sync queue
        await syncService.addToSyncQueue({
          type: 'invoice',
          data: invoiceData,
          endpoint: '/api/invoices',
          method: 'POST'
        })
        
        // Register for background sync
        await PWAUtils.registerBackgroundSync('sync-invoices')
        
        return offlineInvoice.id
      }
    } catch (error) {
      console.error('Error saving offline invoice:', error)
    }
    return null
  }, [])

  const syncOfflineInvoices = useCallback(async () => {
    await syncService.triggerSync()
    // Reload invoices after sync attempt
    await loadOfflineInvoices()
  }, [loadOfflineInvoices])

  const retryFailedSync = useCallback(async () => {
    await syncService.triggerSync()
  }, [])

  return {
    offlineInvoices,
    saveOfflineInvoice,
    syncOfflineInvoices,
    retryFailedSync,
    isOnline,
    syncStatus,
    hasUnsyncedInvoices: Array.isArray(offlineInvoices) ? offlineInvoices.some(inv => !inv.synced) : false,
    hasFailedSyncs: syncStatus.failedItems > 0,
    hasConflicts: syncStatus.conflictItems > 0
  }
}

export function useOfflineCustomers() {
  const [offlineCustomers, setOfflineCustomers] = useState<any[]>([])
  const [isOnline, setIsOnline] = useState(true) // Default to true for SSR
  const [isClient, setIsClient] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    totalItems: 0,
    pendingItems: 0,
    failedItems: 0,
    conflictItems: 0,
    syncedItems: 0,
    isSyncing: false
  })

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
      updateSyncStatus()
    }

    const handleOnline = () => {
      setIsOnline(true)
      syncService.triggerSync()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    // Listen to network status changes
    syncService.addNetworkStatusListener((online) => {
      setIsOnline(online)
    })

    // Listen to sync status changes
    syncService.addSyncStatusListener((status) => {
      setSyncStatus(status)
    })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      syncService.removeNetworkStatusListener(handleOnline)
    }
  }, [])

  const updateSyncStatus = useCallback(async () => {
    const status = await syncService.getSyncStatus()
    setSyncStatus(status)
  }, [])

  const loadOfflineCustomers = useCallback(async () => {
    try {
      const stored = await PWAUtils.getOfflineData('customers') as any[]
      setOfflineCustomers(Array.isArray(stored) ? stored : [])
    } catch (error) {
      console.error('Error loading offline customers:', error)
      setOfflineCustomers([])
    }
  }, [])

  const getOfflineCustomers = useCallback(async (): Promise<any[]> => {
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
  }, [])

  const saveOfflineCustomer = useCallback(async (customerData: any): Promise<string | null> => {
    const offlineCustomer = {
      id: `offline_${Date.now()}`,
      ...customerData,
      timestamp: Date.now(),
      synced: false
    }

    try {
      // Save to IndexedDB
      const success = await PWAUtils.storeOfflineData('customers', offlineCustomer)
      if (success) {
        setOfflineCustomers(prev => [...prev, offlineCustomer])
        
        // Add to sync queue
        await syncService.addToSyncQueue({
          type: 'customer',
          data: customerData,
          endpoint: '/api/customers',
          method: 'POST'
        })
        
        // Register for background sync
        await PWAUtils.registerBackgroundSync('sync-customers')
        
        return offlineCustomer.id
      }
    } catch (error) {
      console.error('Error saving offline customer:', error)
    }
    return null
  }, [])

  const syncOfflineCustomers = useCallback(async () => {
    await syncService.triggerSync()
    // Reload customers after sync attempt
    await loadOfflineCustomers()
  }, [loadOfflineCustomers])

  const retryFailedSync = useCallback(async () => {
    await syncService.triggerSync()
  }, [])

  return {
    offlineCustomers,
    saveOfflineCustomer,
    getOfflineCustomers,
    syncOfflineCustomers,
    retryFailedSync,
    syncStatus,
    hasUnsyncedCustomers: Array.isArray(offlineCustomers) ? offlineCustomers.some(c => !c.synced) : false,
    hasFailedSyncs: syncStatus.failedItems > 0,
    hasConflicts: syncStatus.conflictItems > 0,
    isOnline
  }
}

export function useOfflineBulkOperations() {
  const [offlineOperations, setOfflineOperations] = useState<any[]>([])
  const [isOnline, setIsOnline] = useState(true) // Default to true for SSR
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    totalItems: 0,
    pendingItems: 0,
    failedItems: 0,
    conflictItems: 0,
    syncedItems: 0,
    isSyncing: false
  })

  useEffect(() => {
    // Set initial online status on client
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    // Only load data on client-side
    if (typeof window !== 'undefined') {
      updateSyncStatus()
    }

    const handleOnline = () => {
      setIsOnline(true)
      syncService.triggerSync()
    }

    // Listen to network status changes
    syncService.addNetworkStatusListener((online) => {
      setIsOnline(online)
    })

    // Listen to sync status changes
    syncService.addSyncStatusListener((status) => {
      setSyncStatus(status)
    })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', () => setIsOnline(false))

    return () => {
      window.removeEventListener('online', handleOnline)
      syncService.removeNetworkStatusListener(handleOnline)
    }
  }, [])

  const updateSyncStatus = useCallback(async () => {
    const status = await syncService.getSyncStatus()
    setSyncStatus(status)
  }, [])

  const saveOfflineBulkOperation = useCallback(async (operationData: any) => {
    const offlineOperation = {
      id: `offline_${Date.now()}`,
      ...operationData,
      timestamp: Date.now(),
      synced: false
    }

    try {
      // Save to IndexedDB
      const success = await PWAUtils.storeOfflineData('bulkOperations', offlineOperation)
      if (success) {
        setOfflineOperations(prev => [...prev, offlineOperation])
        
        // Add to sync queue
        await syncService.addToSyncQueue({
          type: 'bulk-operation',
          data: operationData,
          endpoint: '/api/bulk-operations',
          method: 'POST'
        })
        
        // Register for background sync
        await PWAUtils.registerBackgroundSync('sync-bulk-operations')
        
        return offlineOperation.id
      }
    } catch (error) {
      console.error('Error saving offline bulk operation:', error)
    }
    return null
  }, [])

  const syncOfflineOperations = useCallback(async () => {
    await syncService.triggerSync()
  }, [])

  const retryFailedSync = useCallback(async () => {
    await syncService.triggerSync()
  }, [])

  return {
    offlineOperations,
    saveOfflineBulkOperation,
    syncOfflineOperations,
    retryFailedSync,
    syncStatus,
    hasFailedSyncs: syncStatus.failedItems > 0,
    hasConflicts: syncStatus.conflictItems > 0,
    isOnline
  }
}