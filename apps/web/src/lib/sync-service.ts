import { PWAUtils } from '../components/pwa/pwa-manager'

export interface SyncQueueItem {
  id: string
  type: 'invoice' | 'customer' | 'bulk-operation'
  data: any
  endpoint: string
  method?: string
  timestamp: number
  retryCount: number
  lastRetry?: number
  status: 'pending' | 'failed' | 'conflict' | 'synced'
  error?: string
  serverData?: any
  localData?: any
}

export interface SyncStatus {
  totalItems: number
  pendingItems: number
  failedItems: number
  conflictItems: number
  syncedItems: number
  lastSyncTime?: number
  isSyncing: boolean
}

export interface StorageQuota {
  used: number
  quota: number
  percentage: number
  isNearLimit: boolean
}

class SyncService {
  private isOnline: boolean = true
  private syncInProgress: boolean = false
  private syncStatusListeners: ((status: SyncStatus) => void)[] = []
  private networkStatusListeners: ((isOnline: boolean) => void)[] = []

  constructor() {
    // Initialize network status
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine
      
      // Listen for network status changes
      window.addEventListener('online', this.handleOnline.bind(this))
      window.addEventListener('offline', this.handleOffline.bind(this))
    }
  }

  // Network status management
  private handleOnline() {
    console.log('[SyncService] Connection restored')
    this.isOnline = true
    this.notifyNetworkStatusListeners(true)
    
    // Trigger sync when coming back online
    this.triggerSync()
  }

  private handleOffline() {
    console.log('[SyncService] Connection lost')
    this.isOnline = false
    this.notifyNetworkStatusListeners(false)
  }

  public getNetworkStatus(): boolean {
    return this.isOnline
  }

  // Event listener management
  public addSyncStatusListener(listener: (status: SyncStatus) => void) {
    this.syncStatusListeners.push(listener)
  }

  public removeSyncStatusListener(listener: (status: SyncStatus) => void) {
    this.syncStatusListeners = this.syncStatusListeners.filter(l => l !== listener)
  }

  public addNetworkStatusListener(listener: (isOnline: boolean) => void) {
    this.networkStatusListeners.push(listener)
  }

  public removeNetworkStatusListener(listener: (isOnline: boolean) => void) {
    this.networkStatusListeners = this.networkStatusListeners.filter(l => l !== listener)
  }

  private notifySyncStatusListeners(status: SyncStatus) {
    this.syncStatusListeners.forEach(listener => listener(status))
  }

  private notifyNetworkStatusListeners(isOnline: boolean) {
    this.networkStatusListeners.forEach(listener => listener(isOnline))
  }

  // Sync queue management
  public async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'status'>): Promise<string> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      console.error('[SyncService] IndexedDB not supported')
      throw new Error('IndexedDB not supported')
    }

    try {
      const db = await this.openDB()
      const transaction = db.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')
      
      const syncItem: SyncQueueItem = {
        ...item,
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0,
        status: 'pending'
      }
      
      await store.add(syncItem)
      console.log(`[SyncService] Added ${item.type} to sync queue:`, syncItem.id)
      
      // Trigger sync if online
      if (this.isOnline) {
        this.triggerSync()
      }
      
      // Update sync status
      this.updateSyncStatus()
      
      return syncItem.id
    } catch (error) {
      console.error('[SyncService] Failed to add to sync queue:', error)
      throw error
    }
  }

  public async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return []
    }

    try {
      const db = await this.openDB()
      const transaction = db.transaction(['syncQueue'], 'readonly')
      const store = transaction.objectStore('syncQueue')
      
      return new Promise<SyncQueueItem[]>((resolve, reject) => {
        const request = store.getAll()
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const items = request.result as SyncQueueItem[]
          // Sort by timestamp and retry count
          const sortedItems = items.sort((a: SyncQueueItem, b: SyncQueueItem) => {
            if (a.retryCount !== b.retryCount) {
              return a.retryCount - b.retryCount
            }
            return a.timestamp - b.timestamp
          })
          resolve(sortedItems)
        }
      })
    } catch (error) {
      console.error('[SyncService] Failed to get sync queue:', error)
      return []
    }
  }

  public async updateSyncQueueItem(id: string, updates: Partial<SyncQueueItem>): Promise<boolean> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return false
    }

    try {
      const db = await this.openDB()
      const transaction = db.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')
      
      // Get existing item
      const existingItem = await store.get(id)
      if (!existingItem) {
        console.warn(`[SyncService] Sync queue item not found: ${id}`)
        return false
      }
      
      // Update item
      const updatedItem = { ...existingItem, ...updates }
      await store.put(updatedItem)
      
      console.log(`[SyncService] Updated sync queue item: ${id}`)
      
      // Update sync status
      this.updateSyncStatus()
      
      return true
    } catch (error) {
      console.error('[SyncService] Failed to update sync queue item:', error)
      return false
    }
  }

  public async removeFromSyncQueue(id: string): Promise<boolean> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return false
    }

    try {
      const db = await this.openDB()
      const transaction = db.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')
      await store.delete(id)
      
      console.log(`[SyncService] Removed from sync queue: ${id}`)
      
      // Update sync status
      this.updateSyncStatus()
      
      return true
    } catch (error) {
      console.error('[SyncService] Failed to remove from sync queue:', error)
      return false
    }
  }

  // Sync process management
  public async triggerSync(): Promise<boolean> {
    if (this.syncInProgress || !this.isOnline) {
      console.log('[SyncService] Sync already in progress or offline')
      return false
    }

    this.syncInProgress = true
    console.log('[SyncService] Starting sync process...')
    
    try {
      // Register background sync if supported
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready
        // @ts-ignore - Background sync API may not be in TypeScript definitions
        await registration.sync.register('process-sync-queue')
        console.log('[SyncService] Background sync registered')
      } else {
        // Fallback to manual sync
        await this.processSyncQueue()
      }
      
      return true
    } catch (error) {
      console.error('[SyncService] Failed to trigger sync:', error)
      return false
    } finally {
      this.syncInProgress = false
      this.updateSyncStatus()
    }
  }

  private async processSyncQueue(): Promise<void> {
    console.log('[SyncService] Processing sync queue...')
    const syncQueue = await this.getSyncQueue()
    
    if (syncQueue.length === 0) {
      console.log('[SyncService] Sync queue is empty')
      return
    }
    
    const now = Date.now()
    
    for (const item of syncQueue) {
      // Skip if not ready for retry
      if (item.lastRetry && !this.shouldRetryNow(item.lastRetry, item.retryCount)) {
        continue
      }
      
      try {
        // Attempt to sync the item
        const response = await fetch(item.endpoint, {
          method: item.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        })
        
        if (response.ok) {
          // Success - remove from queue and mark as synced
          await this.removeFromSyncQueue(item.id)
          await this.markItemAsSynced(item.type, item.id)
          
          console.log(`[SyncService] Successfully synced ${item.type}:`, item.id)
          
          // Show notification
          PWAUtils.showNotification('Easy Filer', {
            body: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} synced successfully`,
            icon: '/icons/icon-192x192.png'
          })
        } else if (response.status === 409) {
          // Conflict detected
          const serverData = await response.json()
          await this.handleConflict(item, serverData)
        } else {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error(`[SyncService] Failed to sync ${item.type}:`, item.id, error)
        
        // Update retry information
        await this.updateSyncQueueItem(item.id, {
          status: 'failed',
          lastRetry: now,
          retryCount: item.retryCount + 1,
          error: (error as Error).message
        })
        
        // Show notification if max retries reached
        if (item.retryCount >= 5) {
          PWAUtils.showNotification('Easy Filer - Sync Failed', {
            body: `Failed to sync ${item.type} after multiple attempts. Please check your connection.`,
            icon: '/icons/icon-192x192.png',
            requireInteraction: true
          })
        }
      }
    }
  }

  // Conflict resolution
  public async handleConflict(item: SyncQueueItem, serverData: any): Promise<void> {
    console.log(`[SyncService] Handling conflict for ${item.type}:`, item.id)
    
    // Update item with conflict status
    await this.updateSyncQueueItem(item.id, {
      status: 'conflict',
      serverData,
      localData: item.data
    })
    
    // Show notification
    PWAUtils.showNotification('Easy Filer - Sync Conflict', {
      body: `Conflict detected for ${item.type}. Please resolve in the app.`,
      icon: '/icons/icon-192x192.png',
      requireInteraction: true
    })
  }

  public async resolveConflict(itemId: string, resolution: 'local' | 'server' | 'merge'): Promise<boolean> {
    try {
      const syncQueue = await this.getSyncQueue()
      const conflictItem = syncQueue.find(item => item.id === itemId)
      
      if (!conflictItem || conflictItem.status !== 'conflict') {
        console.error('[SyncService] Conflict item not found:', itemId)
        return false
      }
      
      let finalData: any
      
      switch (resolution) {
        case 'local':
          finalData = conflictItem.localData
          break
        case 'server':
          // Remove from queue since we're accepting server version
          await this.removeFromSyncQueue(itemId)
          return true
        case 'merge':
          // Simple merge strategy - in a real app, this would be more sophisticated
          finalData = { ...conflictItem.serverData, ...conflictItem.localData }
          break
        default:
          return false
      }
      
      // Update the item with resolved data and reset for retry
      await this.updateSyncQueueItem(itemId, {
        data: finalData,
        status: 'pending',
        retryCount: 0,
        lastRetry: undefined,
        error: undefined
      })
      
      // Trigger sync to retry with resolved data
      if (this.isOnline) {
        this.triggerSync()
      }
      
      console.log(`[SyncService] Resolved conflict for ${conflictItem.type}:`, itemId)
      return true
    } catch (error) {
      console.error('[SyncService] Failed to resolve conflict:', error)
      return false
    }
  }

  // Storage management
  public async getStorageQuota(): Promise<StorageQuota> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        const used = estimate.usage || 0
        const quota = estimate.quota || 0
        const percentage = quota > 0 ? (used / quota) * 100 : 0
        
        return {
          used,
          quota,
          percentage,
          isNearLimit: percentage > 80
        }
      } catch (error) {
        console.error('[SyncService] Failed to get storage quota:', error)
      }
    }
    
    // Fallback values
    return {
      used: 0,
      quota: 0,
      percentage: 0,
      isNearLimit: false
    }
  }

  public async cleanupOldData(): Promise<void> {
    console.log('[SyncService] Cleaning up old data...')
    
    try {
      const db = await this.openDB()
      const now = Date.now()
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
      
      // Clean up old synced items
      const stores = ['invoices', 'customers', 'bulkOperations']
      
      for (const storeName of stores) {
        if (!db.objectStoreNames.contains(storeName)) continue
        
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const index = store.index('timestamp')
        
        // Get all items older than 30 days that are synced
        const range = IDBKeyRange.upperBound(thirtyDaysAgo)
        const request = index.openCursor(range)
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            const item = cursor.value
            if (item.synced) {
              cursor.delete()
            }
            cursor.continue()
          }
        }
      }
      
      // Clean up old sync queue items (older than 7 days and failed)
      const syncTransaction = db.transaction(['syncQueue'], 'readwrite')
      const syncStore = syncTransaction.objectStore('syncQueue')
      const syncIndex = syncStore.index('timestamp')
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
      const syncRange = IDBKeyRange.upperBound(sevenDaysAgo)
      
      const syncRequest = syncIndex.openCursor(syncRange)
      syncRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          const item = cursor.value
          if (item.status === 'failed' && item.retryCount >= 5) {
            cursor.delete()
          }
          cursor.continue()
        }
      }
      
      console.log('[SyncService] Old data cleanup completed')
    } catch (error) {
      console.error('[SyncService] Failed to cleanup old data:', error)
    }
  }

  // Status reporting
  public async getSyncStatus(): Promise<SyncStatus> {
    const syncQueue = await this.getSyncQueue()
    
    const status: SyncStatus = {
      totalItems: syncQueue.length,
      pendingItems: syncQueue.filter(item => item.status === 'pending').length,
      failedItems: syncQueue.filter(item => item.status === 'failed').length,
      conflictItems: syncQueue.filter(item => item.status === 'conflict').length,
      syncedItems: 0, // This would be calculated from the main stores
      isSyncing: this.syncInProgress
    }
    
    // Get last sync time from localStorage
    if (typeof window !== 'undefined') {
      const lastSyncTime = localStorage.getItem('lastSyncTime')
      if (lastSyncTime) {
        status.lastSyncTime = parseInt(lastSyncTime, 10)
      }
    }
    
    return status
  }

  private async updateSyncStatus(): Promise<void> {
    const status = await this.getSyncStatus()
    this.notifySyncStatusListeners(status)
  }

  // Helper methods
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('EasyFilerDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncQueueStore = db.createObjectStore('syncQueue', { keyPath: 'id' })
          syncQueueStore.createIndex('timestamp', 'timestamp')
          syncQueueStore.createIndex('retryCount', 'retryCount')
          syncQueueStore.createIndex('status', 'status')
        }
      }
    })
  }

  private shouldRetryNow(lastRetry: number, retryCount: number): boolean {
    const now = Date.now()
    const delay = Math.min(Math.pow(2, retryCount) * 1000, 30000) // Max 30 seconds
    return (now - lastRetry) >= delay
  }

  private async markItemAsSynced(type: string, id: string): Promise<void> {
    try {
      const db = await this.openDB()
      const storeName = type === 'invoice' ? 'invoices' : type === 'customer' ? 'customers' : 'bulkOperations'
      
      if (!db.objectStoreNames.contains(storeName)) {
        return
      }
      
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      // Get the existing item
      return new Promise<void>((resolve, reject) => {
        const request = store.get(id)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const item = request.result
          if (item) {
            item.synced = true
            item.syncedAt = Date.now()
            const putRequest = store.put(item)
            putRequest.onerror = () => reject(putRequest.error)
            putRequest.onsuccess = () => resolve()
          } else {
            resolve()
          }
        }
      })
      
      // Update last sync time
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastSyncTime', Date.now().toString())
      }
    } catch (error) {
      console.error('[SyncService] Failed to mark item as synced:', error)
    }
  }
}

// Create singleton instance
export const syncService = new SyncService()
export default syncService