import { PWAUtils } from '../components/pwa/pwa-manager'

export interface StorageQuota {
  used: number
  quota: number
  percentage: number
  isNearLimit: boolean
  isOverLimit: boolean
}

export interface StorageStats {
  invoices: { count: number; size: number }
  customers: { count: number; size: number }
  bulkOperations: { count: number; size: number }
  syncQueue: { count: number; size: number }
  autoDrafts: { count: number; size: number }
  total: { count: number; size: number }
}

export interface CleanupOptions {
  maxAge?: number // Maximum age in milliseconds
  keepSynced?: boolean // Whether to keep synced items
  keepRecent?: number // Number of recent items to keep regardless of age
  stores?: string[] // Specific stores to clean (empty = all)
}

class StorageManager {
  private static instance: StorageManager
  private quotaCache: StorageQuota | null = null
  private quotaCacheTime: number = 0
  private readonly QUOTA_CACHE_DURATION = 30000 // 30 seconds

  private constructor() {
    // Initialize storage monitoring
    if (typeof window !== 'undefined') {
      this.monitorStorageUsage()
    }
  }

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  // Get storage quota information
  public async getStorageQuota(): Promise<StorageQuota> {
    const now = Date.now()
    
    // Return cached value if still valid
    if (this.quotaCache && (now - this.quotaCacheTime) < this.QUOTA_CACHE_DURATION) {
      return this.quotaCache
    }

    let quota: StorageQuota = {
      used: 0,
      quota: 0,
      percentage: 0,
      isNearLimit: false,
      isOverLimit: false
    }

    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        const used = estimate.usage || 0
        const quotaLimit = estimate.quota || 0
        
        quota = {
          used,
          quota: quotaLimit,
          percentage: quotaLimit > 0 ? (used / quotaLimit) * 100 : 0,
          isNearLimit: quotaLimit > 0 && (used / quotaLimit) > 0.8,
          isOverLimit: quotaLimit > 0 && used >= quotaLimit
        }
      } catch (error) {
        console.error('[StorageManager] Failed to get storage quota:', error)
      }
    }

    // Cache the result
    this.quotaCache = quota
    this.quotaCacheTime = now

    return quota
  }

  // Get detailed storage statistics
  public async getStorageStats(): Promise<StorageStats> {
    const stats: StorageStats = {
      invoices: { count: 0, size: 0 },
      customers: { count: 0, size: 0 },
      bulkOperations: { count: 0, size: 0 },
      syncQueue: { count: 0, size: 0 },
      autoDrafts: { count: 0, size: 0 },
      total: { count: 0, size: 0 }
    }

    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return stats
    }

    try {
      const db = await this.openDB()
      const stores = ['invoices', 'customers', 'bulkOperations', 'syncQueue', 'autoDrafts']

      for (const storeName of stores) {
        if (!db.objectStoreNames.contains(storeName)) continue

        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        
        try {
          const items = await this.getAllFromStore(store)
          const size = JSON.stringify(items).length
          
          if (stats[storeName as keyof StorageStats]) {
            (stats[storeName as keyof StorageStats] as { count: number; size: number }) = {
              count: items.length,
              size
            }
          }
        } catch (error) {
          console.error(`[StorageManager] Failed to get stats for ${storeName}:`, error)
        }
      }

      // Calculate totals
      stats.total.count = Object.values(stats).reduce((sum, stat) => sum + stat.count, 0)
      stats.total.size = Object.values(stats).reduce((sum, stat) => sum + stat.size, 0)
    } catch (error) {
      console.error('[StorageManager] Failed to get storage stats:', error)
    }

    return stats
  }

  // Clean up old data
  public async cleanupOldData(options: CleanupOptions = {}): Promise<{ deleted: number; freed: number }> {
    const {
      maxAge = 30 * 24 * 60 * 60 * 1000, // 30 days default
      keepSynced = true,
      keepRecent = 10,
      stores = ['invoices', 'customers', 'bulkOperations', 'syncQueue', 'autoDrafts']
    } = options

    let deleted = 0
    let freed = 0

    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return { deleted, freed }
    }

    try {
      const db = await this.openDB()
      const now = Date.now()
      const cutoffTime = now - maxAge

      for (const storeName of stores) {
        if (!db.objectStoreNames.contains(storeName)) continue

        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        
        try {
          const items = await this.getAllFromStore(store)
          let itemsToDelete: any[] = []

          if (storeName === 'syncQueue') {
            // For sync queue, delete failed items older than maxAge
            itemsToDelete = items.filter(item => 
              item.status === 'failed' && 
              item.retryCount >= 5 && 
              item.timestamp < cutoffTime
            )
          } else if (storeName === 'autoDrafts') {
            // For auto drafts, delete all items older than maxAge
            itemsToDelete = items.filter(item => item.timestamp < cutoffTime)
          } else {
            // For other stores, apply general rules
            const sortedItems = items.sort((a, b) => b.timestamp - a.timestamp)
            const recentItems = sortedItems.slice(0, keepRecent)
            const recentIds = new Set(recentItems.map(item => item.id))
            
            itemsToDelete = items.filter(item => {
              // Keep recent items
              if (recentIds.has(item.id)) return false
              
              // Keep synced items if option is enabled
              if (keepSynced && item.synced) return false
              
              // Delete items older than maxAge
              return item.timestamp < cutoffTime
            })
          }

          // Delete the items
          for (const item of itemsToDelete) {
            await store.delete(item.id)
            deleted++
            freed += JSON.stringify(item).length
          }

          console.log(`[StorageManager] Cleaned up ${itemsToDelete.length} items from ${storeName}`)
        } catch (error) {
          console.error(`[StorageManager] Failed to cleanup ${storeName}:`, error)
        }
      }

      console.log(`[StorageManager] Cleanup completed: ${deleted} items deleted, ${freed} bytes freed`)
    } catch (error) {
      console.error('[StorageManager] Cleanup failed:', error)
    }

    // Clear quota cache after cleanup
    this.quotaCache = null
    this.quotaCacheTime = 0

    return { deleted, freed }
  }

  // Optimize storage by compressing data
  public async optimizeStorage(): Promise<{ before: number; after: number; saved: number }> {
    const beforeStats = await this.getStorageStats()
    let before = beforeStats.total.size
    let after = before
    let saved = 0

    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return { before, after, saved }
    }

    try {
      const db = await this.openDB()
      const stores = ['invoices', 'customers', 'bulkOperations']

      for (const storeName of stores) {
        if (!db.objectStoreNames.contains(storeName)) continue

        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        
        try {
          const items = await this.getAllFromStore(store)
          
          for (const item of items) {
            // Remove unnecessary properties
            const optimized = this.optimizeItem(item)
            
            // Update if changed
            if (JSON.stringify(item) !== JSON.stringify(optimized)) {
              await store.put(optimized)
            }
          }
        } catch (error) {
          console.error(`[StorageManager] Failed to optimize ${storeName}:`, error)
        }
      }

      const afterStats = await this.getStorageStats()
      after = afterStats.total.size
      saved = before - after

      console.log(`[StorageManager] Optimization completed: ${saved} bytes saved`)
    } catch (error) {
      console.error('[StorageManager] Optimization failed:', error)
    }

    return { before, after, saved }
  }

  // Check if storage is available
  public async isStorageAvailable(): Promise<boolean> {
    try {
      const quota = await this.getStorageQuota()
      return !quota.isOverLimit
    } catch (error) {
      console.error('[StorageManager] Failed to check storage availability:', error)
      return false
    }
  }

  // Get storage recommendation
  public async getStorageRecommendation(): Promise<string> {
    const quota = await this.getStorageQuota()
    const stats = await this.getStorageStats()

    if (quota.isOverLimit) {
      return 'Storage quota exceeded. Please clean up old data immediately.'
    }

    if (quota.isNearLimit) {
      return 'Storage quota is nearly full. Consider cleaning up old data.'
    }

    if (stats.total.count > 1000) {
      return 'Large number of items stored. Consider regular cleanup.'
    }

    if (stats.syncQueue.count > 50) {
      return 'Many items in sync queue. Check your network connection.'
    }

    return 'Storage usage is normal.'
  }

  // Monitor storage usage and alert if needed
  private monitorStorageUsage(): void {
    // Check storage usage every 5 minutes
    setInterval(async () => {
      const quota = await this.getStorageQuota()
      
      if (quota.isNearLimit || quota.isOverLimit) {
        console.warn(`[StorageManager] Storage warning: ${quota.percentage.toFixed(1)}% used`)
        
        // Show notification if supported
        PWAUtils.showNotification('Easy Filer - Storage Warning', {
          body: await this.getStorageRecommendation(),
          icon: '/icons/icon-192x192.png',
          requireInteraction: quota.isOverLimit
        })
      }
    }, 5 * 60 * 1000) // 5 minutes
  }

  // Private helper methods
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('EasyFilerDB', 2) // Use version 2 for autoDrafts support
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object stores if they don't exist
        const stores = [
          { name: 'invoices', keyPath: 'id' },
          { name: 'customers', keyPath: 'id' },
          { name: 'bulkOperations', keyPath: 'id' },
          { name: 'syncQueue', keyPath: 'id' },
          { name: 'autoDrafts', keyPath: 'id' }
        ]
        
        stores.forEach(({ name, keyPath }) => {
          if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, { keyPath })
            store.createIndex('timestamp', 'timestamp')
            
            // Add additional indexes for specific stores
            if (name === 'syncQueue') {
              store.createIndex('status', 'status')
              store.createIndex('retryCount', 'retryCount')
            } else if (name === 'autoDrafts') {
              store.createIndex('formType', 'formType')
            }
          }
        })
      }
    })
  }

  private async getAllFromStore(store: IDBObjectStore): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  private optimizeItem(item: any): any {
    // Create a copy of the item
    const optimized = { ...item }
    
    // Remove temporary properties
    delete optimized._temp
    delete optimized._cache
    
    // Convert dates to timestamps for storage
    if (optimized.createdAt instanceof Date) {
      optimized.createdAt = optimized.createdAt.getTime()
    }
    
    if (optimized.updatedAt instanceof Date) {
      optimized.updatedAt = optimized.updatedAt.getTime()
    }
    
    // Remove undefined values
    Object.keys(optimized).forEach(key => {
      if (optimized[key] === undefined) {
        delete optimized[key]
      }
    })
    
    return optimized
  }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance()
export default storageManager