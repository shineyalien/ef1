'use client'

import { useEffect } from 'react'

export default function PWAManager() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('PWA: Service Worker registered successfully:', registration.scope)
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  console.log('PWA: New version available')
                  showUpdateNotification()
                }
              })
            }
          })
          
        } catch (error) {
          console.log('PWA: Service Worker registration failed:', error)
        }
      })
    }

    // Setup background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      console.log('PWA: Background sync supported')
    }

    // Setup push notifications
    if ('Notification' in window && 'serviceWorker' in navigator) {
      // Request permission for notifications
      if (Notification.permission === 'default') {
        // Don't request immediately, wait for user action
        console.log('PWA: Notification permission not requested yet')
      }
    }

  }, [])

  const showUpdateNotification = () => {
    // Show a toast or modal about app update
    if (window.confirm('A new version of Easy Filer is available. Reload to update?')) {
      window.location.reload()
    }
  }

  return null // This component doesn't render anything
}

// Utility functions for PWA features
export const PWAUtils = {
  // Request notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('PWA: Notifications not supported')
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    console.log('PWA: Notification permission:', permission)
    return permission
  },

  // Show local notification
  showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options
      })
    }
  },

  // Register for background sync
  async registerBackgroundSync(tag: string) {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        // @ts-ignore - Background sync API may not be in TypeScript definitions yet
        await registration.sync.register(tag)
        console.log(`PWA: Background sync registered for tag: ${tag}`)
      } catch (error) {
        console.log('PWA: Background sync registration failed:', error)
      }
    }
  },

  // Check if app is installed
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true
  },

  // Check if running on mobile
  isMobile(): boolean {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  // Add to IndexedDB for offline storage
  async storeOfflineData(storeName: string, data: any) {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      console.log('PWA: IndexedDB not supported')
      return false
    }

    try {
      const db = await openDB()
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      await store.add(data)
      console.log(`PWA: Data stored offline in ${storeName}`)
      return true
    } catch (error) {
      console.log('PWA: Failed to store offline data:', error)
      return false
    }
  },

  // Get offline data from IndexedDB
  async getOfflineData(storeName: string) {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return []
    }

    try {
      const db = await openDB()
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const data = await store.getAll()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.log('PWA: Failed to get offline data:', error)
      return []
    }
  }
}

// Helper function to open IndexedDB
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      // Create object stores for offline data
      if (!db.objectStoreNames.contains('invoices')) {
        const invoiceStore = db.createObjectStore('invoices', { keyPath: 'id', autoIncrement: true })
        invoiceStore.createIndex('timestamp', 'timestamp')
      }
      
      if (!db.objectStoreNames.contains('customers')) {
        const customerStore = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true })
        customerStore.createIndex('timestamp', 'timestamp')
      }
      
      if (!db.objectStoreNames.contains('bulkOperations')) {
        const bulkStore = db.createObjectStore('bulkOperations', { keyPath: 'id', autoIncrement: true })
        bulkStore.createIndex('timestamp', 'timestamp')
      }
    }
  })
}