// Service Worker for Easy Filer PWA
const CACHE_NAME = 'easy-filer-v1.0.0'
const STATIC_CACHE_NAME = 'easy-filer-static-v1'
const DYNAMIC_CACHE_NAME = 'easy-filer-dynamic-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/invoices',
  '/customers',
  '/analytics',
  '/bulk-operations',
  '/settings/fbr',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// API routes that should be cached
const API_CACHE_PATTERNS = [
  /^\/api\/invoices/,
  /^\/api\/customers/,
  /^\/api\/analytics/,
  /^\/api\/settings/
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    }).then(() => {
      // Force activation of new service worker
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Take control of all pages
      return self.clients.claim()
    })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    return
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(handleStaticAssets(request))
  } else {
    event.respondWith(handlePageRequest(request))
  }
})

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url)
  
  try {
    // Try network first for fresh data
    const response = await fetch(request)
    
    // Cache successful responses for offline access
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.log('[SW] Network failed for API request, trying cache:', url.pathname)
    
    // Fall back to cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline response for specific endpoints
    if (url.pathname.includes('/invoices')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Offline mode - invoices not available',
        offline: true,
        invoices: []
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    }
    
    if (url.pathname.includes('/analytics')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Offline mode - analytics not available',
        offline: true,
        analytics: null
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    }
    
    // Generic offline response
    return new Response(JSON.stringify({
      success: false,
      error: 'Offline - please check your internet connection',
      offline: true
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    })
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[SW] Failed to fetch static asset:', request.url)
    throw error
  }
}

// Handle page requests with cache-first for cached pages, network-first for new pages
async function handlePageRequest(request) {
  const url = new URL(request.url)
  
  // Check cache first for known routes
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    // Serve from cache and update in background
    fetch(request).then((response) => {
      if (response.ok) {
        const cache = caches.open(DYNAMIC_CACHE_NAME)
        cache.then(c => c.put(request, response))
      }
    }).catch(() => {
      // Ignore background update failures
    })
    return cachedResponse
  }
  
  try {
    // Try network for new pages
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[SW] Network failed for page request, serving offline page')
    
    // Serve offline page
    const offlineResponse = await caches.match('/offline')
    if (offlineResponse) {
      return offlineResponse
    }
    
    // Fallback offline response
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Easy Filer - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; }
            .offline-message { max-width: 400px; margin: 0 auto; }
            .icon { font-size: 3rem; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          <div class="offline-message">
            <div class="icon">📱</div>
            <h1>You're Offline</h1>
            <p>Easy Filer is not available right now. Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 200
    })
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-invoices') {
    event.waitUntil(syncInvoices())
  }
  
  if (event.tag === 'sync-customers') {
    event.waitUntil(syncCustomers())
  }
  
  if (event.tag === 'sync-bulk-operations') {
    event.waitUntil(syncBulkOperations())
  }
  
  if (event.tag === 'process-sync-queue') {
    event.waitUntil(processSyncQueue())
  }
})

async function syncInvoices() {
  try {
    console.log('[SW] Starting invoice sync...')
    const offlineInvoices = await getOfflineInvoices()
    
    if (offlineInvoices.length === 0) {
      console.log('[SW] No invoices to sync')
      return true
    }
    
    let syncSuccess = true
    for (const invoice of offlineInvoices) {
      try {
        // Add to sync queue for retry mechanism
        await addToSyncQueue({
          type: 'invoice',
          id: invoice.id,
          data: invoice.data,
          endpoint: '/api/invoices',
          method: 'POST'
        })
        
        const response = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoice.data)
        })
        
        if (response.ok) {
          // Mark as synced in the original store
          await markInvoiceAsSynced(invoice.id)
          // Remove from sync queue if it exists
          await removeFromSyncQueue(invoice.id)
          console.log('[SW] Synced offline invoice:', invoice.id)
          
          // Send notification for successful sync
          self.registration.showNotification('Easy Filer', {
            body: `Invoice ${invoice.data.invoiceNumber || invoice.id} synced successfully`,
            icon: '/icons/icon-192x192.png',
            tag: 'sync-success'
          })
        } else if (response.status === 409) {
          // Conflict detected
          console.log('[SW] Conflict detected for invoice:', invoice.id)
          await handleSyncConflict('invoice', invoice, await response.json())
          syncSuccess = false
        } else {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.log('[SW] Failed to sync invoice:', invoice.id, error)
        
        // Add to sync queue for retry
        await addToSyncQueue({
          type: 'invoice',
          id: invoice.id,
          data: invoice.data,
          endpoint: '/api/invoices',
          method: 'POST',
          error: error.message
        })
        
        syncSuccess = false
      }
    }
    
    return syncSuccess
  } catch (error) {
    console.log('[SW] Background sync failed:', error)
    return false
  }
}

async function syncCustomers() {
  try {
    console.log('[SW] Starting customer sync...')
    const offlineCustomers = await getOfflineCustomers()
    
    if (offlineCustomers.length === 0) {
      console.log('[SW] No customers to sync')
      return true
    }
    
    let syncSuccess = true
    for (const customer of offlineCustomers) {
      try {
        // Add to sync queue for retry mechanism
        await addToSyncQueue({
          type: 'customer',
          id: customer.id,
          data: customer.data,
          endpoint: '/api/customers',
          method: 'POST'
        })
        
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer.data)
        })
        
        if (response.ok) {
          // Mark as synced in the original store
          await markCustomerAsSynced(customer.id)
          // Remove from sync queue if it exists
          await removeFromSyncQueue(customer.id)
          console.log('[SW] Synced offline customer:', customer.id)
          
          // Send notification for successful sync
          self.registration.showNotification('Easy Filer', {
            body: `Customer ${customer.data.name || customer.id} synced successfully`,
            icon: '/icons/icon-192x192.png',
            tag: 'sync-success'
          })
        } else if (response.status === 409) {
          // Conflict detected
          console.log('[SW] Conflict detected for customer:', customer.id)
          await handleSyncConflict('customer', customer, await response.json())
          syncSuccess = false
        } else {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.log('[SW] Failed to sync customer:', customer.id, error)
        
        // Add to sync queue for retry
        await addToSyncQueue({
          type: 'customer',
          id: customer.id,
          data: customer.data,
          endpoint: '/api/customers',
          method: 'POST',
          error: error.message
        })
        
        syncSuccess = false
      }
    }
    
    return syncSuccess
  } catch (error) {
    console.log('[SW] Customer sync failed:', error)
    return false
  }
}

async function syncBulkOperations() {
  try {
    console.log('[SW] Syncing bulk operations...')
    // Implementation for bulk operations
    return true
  } catch (error) {
    console.log('[SW] Bulk operations sync failed:', error)
    return false
  }
}

async function processSyncQueue() {
  try {
    console.log('[SW] Processing sync queue...')
    const syncQueue = await getSyncQueue()
    
    if (syncQueue.length === 0) {
      console.log('[SW] Sync queue is empty')
      return true
    }
    
    const now = Date.now()
    let processedItems = 0
    
    for (const item of syncQueue) {
      // Check if we should retry this item based on exponential backoff
      if (item.lastRetry && !shouldRetryNow(item.lastRetry, item.retryCount)) {
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
          await removeFromSyncQueue(item.id)
          
          if (item.type === 'invoice') {
            await markInvoiceAsSynced(item.id)
          } else if (item.type === 'customer') {
            await markCustomerAsSynced(item.id)
          }
          
          console.log(`[SW] Successfully synced ${item.type}:`, item.id)
          processedItems++
          
          // Send notification for successful sync
          self.registration.showNotification('Easy Filer', {
            body: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} synced successfully after retry`,
            icon: '/icons/icon-192x192.png',
            tag: 'sync-retry-success'
          })
        } else if (response.status === 409) {
          // Conflict detected
          console.log(`[SW] Conflict detected for ${item.type}:`, item.id)
          await handleSyncConflict(item.type, item, await response.json())
          
          // Update the item in the queue with conflict status
          await updateSyncQueueItem(item.id, {
            status: 'conflict',
            lastRetry: now,
            retryCount: item.retryCount + 1,
            conflictData: await response.json()
          })
        } else {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.log(`[SW] Failed to sync ${item.type}:`, item.id, error)
        
        // Update the item with retry information
        await updateSyncQueueItem(item.id, {
          status: 'failed',
          lastRetry: now,
          retryCount: item.retryCount + 1,
          error: error.message
        })
        
        // If max retries reached, notify user
        if (item.retryCount >= 5) {
          console.log(`[SW] Max retries reached for ${item.type}:`, item.id)
          
          // Send notification for failed sync
          self.registration.showNotification('Easy Filer - Sync Failed', {
            body: `Failed to sync ${item.type} after multiple attempts. Please check your connection and try manually.`,
            icon: '/icons/icon-192x192.png',
            tag: 'sync-failed',
            requireInteraction: true,
            actions: [
              {
                action: 'retry',
                title: 'Retry Now'
              },
              {
                action: 'dismiss',
                title: 'Dismiss'
              }
            ]
          })
        }
      }
    }
    
    console.log(`[SW] Processed ${processedItems} items from sync queue`)
    return true
  } catch (error) {
    console.log('[SW] Failed to process sync queue:', error)
    return false
  }
}

// Helper functions for managing sync status
async function markInvoiceAsSynced(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 2)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('invoices')) {
        resolve(false)
        return
      }
      
      const transaction = db.transaction(['invoices'], 'readwrite')
      const store = transaction.objectStore('invoices')
      
      // First get the existing invoice
      const getRequest = store.get(id)
      getRequest.onerror = () => reject(getRequest.error)
      
      getRequest.onsuccess = () => {
        const invoice = getRequest.result
        if (!invoice) {
          resolve(false)
          return
        }
        
        // Update the synced status
        invoice.synced = true
        invoice.syncedAt = Date.now()
        
        const putRequest = store.put(invoice)
        putRequest.onerror = () => reject(putRequest.error)
        putRequest.onsuccess = () => resolve(true)
      }
    }
  })
}

async function markCustomerAsSynced(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 2)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('customers')) {
        resolve(false)
        return
      }
      
      const transaction = db.transaction(['customers'], 'readwrite')
      const store = transaction.objectStore('customers')
      
      // First get the existing customer
      const getRequest = store.get(id)
      getRequest.onerror = () => reject(getRequest.error)
      
      getRequest.onsuccess = () => {
        const customer = getRequest.result
        if (!customer) {
          resolve(false)
          return
        }
        
        // Update the synced status
        customer.synced = true
        customer.syncedAt = Date.now()
        
        const putRequest = store.put(customer)
        putRequest.onerror = () => reject(putRequest.error)
        putRequest.onsuccess = () => resolve(true)
      }
    }
  })
}

// Handle sync conflicts
async function handleSyncConflict(type, localItem, serverData) {
  // Store conflict information for user resolution
  await addToSyncQueue({
    type: type,
    id: localItem.id,
    data: localItem.data,
    endpoint: type === 'invoice' ? '/api/invoices' : '/api/customers',
    method: 'POST',
    status: 'conflict',
    serverData: serverData,
    localData: localItem.data,
    timestamp: Date.now()
  })
  
  // Send notification about conflict
  self.registration.showNotification('Easy Filer - Sync Conflict', {
    body: `Conflict detected for ${type}. Please resolve in the app.`,
    icon: '/icons/icon-192x192.png',
    tag: 'sync-conflict',
    requireInteraction: true,
    actions: [
      {
        action: 'resolve',
        title: 'Resolve Conflict'
      }
    ]
  })
}

// Calculate if an item should be retried now based on exponential backoff
function shouldRetryNow(lastRetry, retryCount) {
  const now = Date.now()
  const delay = Math.min(Math.pow(2, retryCount) * 1000, 30000) // Max 30 seconds
  return (now - lastRetry) >= delay
}

// Helper functions for IndexedDB operations
async function getOfflineInvoices() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 2)
    
    request.onerror = () => {
      console.log('[SW] Failed to open IndexedDB:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      // Check if the invoices store exists
      if (!db.objectStoreNames.contains('invoices')) {
        console.log('[SW] Invoices store not found in IndexedDB')
        resolve([])
        return
      }
      
      const transaction = db.transaction(['invoices'], 'readonly')
      const store = transaction.objectStore('invoices')
      const getAllRequest = store.getAll()
      
      getAllRequest.onerror = () => {
        console.log('[SW] Failed to get offline invoices:', getAllRequest.error)
        reject(getAllRequest.error)
      }
      
      getAllRequest.onsuccess = () => {
        const invoices = getAllRequest.result || []
        // Filter for unsynced invoices
        const unsyncedInvoices = invoices.filter(invoice => !invoice.synced)
        console.log(`[SW] Found ${unsyncedInvoices.length} unsynced invoices`)
        resolve(unsyncedInvoices)
      }
    }
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      // Create object stores if they don't exist
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
      
      if (!db.objectStoreNames.contains('syncQueue')) {
        // Fix: Use keyPath: 'id' without autoIncrement to match sync service
        const syncQueueStore = db.createObjectStore('syncQueue', { keyPath: 'id' })
        syncQueueStore.createIndex('timestamp', 'timestamp')
        syncQueueStore.createIndex('retryCount', 'retryCount')
        syncQueueStore.createIndex('status', 'status')
      } else {
        // Ensure all indexes exist on existing store
        const transaction = event.target.transaction
        if (transaction) {
          const syncQueueStore = transaction.objectStore('syncQueue')
          if (!syncQueueStore.indexNames.contains('status')) {
            syncQueueStore.createIndex('status', 'status')
          }
        }
      }
    }
  })
}

async function removeOfflineInvoice(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 2)
    
    request.onerror = () => {
      console.log('[SW] Failed to open IndexedDB:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('invoices')) {
        console.log('[SW] Invoices store not found in IndexedDB')
        resolve(false)
        return
      }
      
      const transaction = db.transaction(['invoices'], 'readwrite')
      const store = transaction.objectStore('invoices')
      const deleteRequest = store.delete(id)
      
      deleteRequest.onerror = () => {
        console.log('[SW] Failed to remove offline invoice:', deleteRequest.error)
        reject(deleteRequest.error)
      }
      
      deleteRequest.onsuccess = () => {
        console.log('[SW] Successfully removed offline invoice:', id)
        resolve(true)
      }
    }
  })
}

async function getOfflineCustomers() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 2)
    
    request.onerror = () => {
      console.log('[SW] Failed to open IndexedDB:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('customers')) {
        console.log('[SW] Customers store not found in IndexedDB')
        resolve([])
        return
      }
      
      const transaction = db.transaction(['customers'], 'readonly')
      const store = transaction.objectStore('customers')
      const getAllRequest = store.getAll()
      
      getAllRequest.onerror = () => {
        console.log('[SW] Failed to get offline customers:', getAllRequest.error)
        reject(getAllRequest.error)
      }
      
      getAllRequest.onsuccess = () => {
        const customers = getAllRequest.result || []
        // Filter for unsynced customers
        const unsyncedCustomers = customers.filter(customer => !customer.synced)
        console.log(`[SW] Found ${unsyncedCustomers.length} unsynced customers`)
        resolve(unsyncedCustomers)
      }
    }
  })
}

async function removeOfflineCustomer(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 2)
    
    request.onerror = () => {
      console.log('[SW] Failed to open IndexedDB:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('customers')) {
        console.log('[SW] Customers store not found in IndexedDB')
        resolve(false)
        return
      }
      
      const transaction = db.transaction(['customers'], 'readwrite')
      const store = transaction.objectStore('customers')
      const deleteRequest = store.delete(id)
      
      deleteRequest.onerror = () => {
        console.log('[SW] Failed to remove offline customer:', deleteRequest.error)
        reject(deleteRequest.error)
      }
      
      deleteRequest.onsuccess = () => {
        console.log('[SW] Successfully removed offline customer:', id)
        resolve(true)
      }
    }
  })
}

async function getSyncQueue() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 2)
    
    request.onerror = () => {
      console.log('[SW] Failed to open IndexedDB:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('syncQueue')) {
        console.log('[SW] Sync queue store not found in IndexedDB')
        resolve([])
        return
      }
      
      const transaction = db.transaction(['syncQueue'], 'readonly')
      const store = transaction.objectStore('syncQueue')
      const getAllRequest = store.getAll()
      
      getAllRequest.onerror = () => {
        console.log('[SW] Failed to get sync queue:', getAllRequest.error)
        reject(getAllRequest.error)
      }
      
      getAllRequest.onsuccess = () => {
        const queue = getAllRequest.result || []
        // Sort by timestamp and retry count
        queue.sort((a, b) => {
          if (a.retryCount !== b.retryCount) {
            return a.retryCount - b.retryCount // Items with fewer retries first
          }
          return a.timestamp - b.timestamp // Older items first
        })
        resolve(queue)
      }
    }
  })
}

async function addToSyncQueue(item) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 2)
    
    request.onerror = () => {
      console.log('[SW] Failed to open IndexedDB:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('syncQueue')) {
        console.log('[SW] Sync queue store not found in IndexedDB')
        resolve(false)
        return
      }
      
      const transaction = db.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')
      const addRequest = store.add({
        ...item,
        timestamp: Date.now(),
        retryCount: 0,
        lastRetry: null,
        status: 'pending'
      })
      
      addRequest.onerror = () => {
        console.log('[SW] Failed to add to sync queue:', addRequest.error)
        reject(addRequest.error)
      }
      
      addRequest.onsuccess = () => {
        console.log('[SW] Added item to sync queue:', item.type, item.id)
        resolve(true)
      }
    }
  })
}

async function updateSyncQueueItem(id, updates) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 2)
    
    request.onerror = () => {
      console.log('[SW] Failed to open IndexedDB:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('syncQueue')) {
        console.log('[SW] Sync queue store not found in IndexedDB')
        resolve(false)
        return
      }
      
      const transaction = db.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')
      
      // First get the existing item
      const getRequest = store.get(id)
      getRequest.onerror = () => {
        console.log('[SW] Failed to get sync queue item:', getRequest.error)
        reject(getRequest.error)
      }
      
      getRequest.onsuccess = () => {
        const existingItem = getRequest.result
        if (!existingItem) {
          console.log('[SW] Sync queue item not found:', id)
          resolve(false)
          return
        }
        
        // Update the item
        const updatedItem = { ...existingItem, ...updates }
        const putRequest = store.put(updatedItem)
        
        putRequest.onerror = () => {
          console.log('[SW] Failed to update sync queue item:', putRequest.error)
          reject(putRequest.error)
        }
        
        putRequest.onsuccess = () => {
          console.log('[SW] Updated sync queue item:', id)
          resolve(true)
        }
      }
    }
  })
}

async function removeFromSyncQueue(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EasyFilerDB', 2)
    
    request.onerror = () => {
      console.log('[SW] Failed to open IndexedDB:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('syncQueue')) {
        console.log('[SW] Sync queue store not found in IndexedDB')
        resolve(false)
        return
      }
      
      const transaction = db.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')
      const deleteRequest = store.delete(id)
      
      deleteRequest.onerror = () => {
        console.log('[SW] Failed to remove from sync queue:', deleteRequest.error)
        reject(deleteRequest.error)
      }
      
      deleteRequest.onsuccess = () => {
        console.log('[SW] Removed item from sync queue:', id)
        resolve(true)
      }
    }
  })
}

// Push notifications for FBR status updates
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')
  
  const options = {
    body: 'Your FBR submission has been processed',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'fbr-status',
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ],
    data: {
      url: '/invoices',
      timestamp: Date.now()
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('Easy Filer - FBR Update', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'view') {
    event.waitUntil(
      self.clients.openWindow(event.notification.data.url || '/')
    )
  }
})

console.log('[SW] Service worker loaded')