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

// Background sync for offline invoice creation
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-invoices') {
    event.waitUntil(syncInvoices())
  }
  
  if (event.tag === 'sync-bulk-operations') {
    event.waitUntil(syncBulkOperations())
  }
})

async function syncInvoices() {
  try {
    // Get stored offline invoices from IndexedDB
    const offlineInvoices = await getOfflineInvoices()
    
    for (const invoice of offlineInvoices) {
      try {
        const response = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invoice.data)
        })
        
        if (response.ok) {
          // Remove from offline storage
          await removeOfflineInvoice(invoice.id)
          console.log('[SW] Synced offline invoice:', invoice.id)
        }
      } catch (error) {
        console.log('[SW] Failed to sync invoice:', invoice.id, error)
      }
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error)
  }
}

async function syncBulkOperations() {
  // Similar implementation for bulk operations
  console.log('[SW] Syncing bulk operations...')
}

// Helper functions for IndexedDB operations
async function getOfflineInvoices() {
  // Implementation would use IndexedDB to store/retrieve offline data
  return []
}

async function removeOfflineInvoice(id) {
  // Implementation would remove item from IndexedDB
  console.log('[SW] Removing offline invoice:', id)
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