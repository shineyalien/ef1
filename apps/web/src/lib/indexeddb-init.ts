/**
 * IndexedDB initialization utility for Easy Filer
 * Ensures consistent database schema across the application
 */

export const DB_NAME = 'EasyFilerDB'
export const DB_VERSION = 2

export interface ObjectStoreSchema {
  name: string
  keyPath?: string
  autoIncrement?: boolean
  indexes?: Array<{
    name: string
    keyPath: string | string[]
    unique?: boolean
    multiEntry?: boolean
  }>
}

export const DATABASE_SCHEMA: ObjectStoreSchema[] = [
  {
    name: 'invoices',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'timestamp', keyPath: 'timestamp' }
    ]
  },
  {
    name: 'customers',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'timestamp', keyPath: 'timestamp' }
    ]
  },
  {
    name: 'bulkOperations',
    keyPath: 'id',
    autoIncrement: true,
    indexes: [
      { name: 'timestamp', keyPath: 'timestamp' }
    ]
  },
  {
    name: 'syncQueue',
    keyPath: 'id',
    autoIncrement: false,
    indexes: [
      { name: 'timestamp', keyPath: 'timestamp' },
      { name: 'retryCount', keyPath: 'retryCount' },
      { name: 'status', keyPath: 'status' }
    ]
  }
]

/**
 * Opens and initializes the IndexedDB with proper schema
 * @param name - Database name (defaults to EasyFilerDB)
 * @param version - Database version (defaults to 2)
 * @returns Promise<IDBDatabase>
 */
export function openDatabase(name: string = DB_NAME, version: number = DB_VERSION): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version)
    
    request.onerror = () => {
      console.error(`[Database] Failed to open database: ${request.error}`)
      reject(request.error)
    }
    
    request.onsuccess = () => {
      console.log(`[Database] Successfully opened database ${name} v${version}`)
      resolve(request.result)
    }
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const oldVersion = event.oldVersion
      console.log(`[Database] Upgrading database from v${oldVersion} to v${version}`)
      
      // Create object stores based on schema
      DATABASE_SCHEMA.forEach(storeSchema => {
        if (!db.objectStoreNames.contains(storeSchema.name)) {
          console.log(`[Database] Creating object store: ${storeSchema.name}`)
          const store = db.createObjectStore(storeSchema.name, {
            keyPath: storeSchema.keyPath,
            autoIncrement: storeSchema.autoIncrement
          })
          
          // Create indexes
          if (storeSchema.indexes) {
            storeSchema.indexes.forEach(index => {
              if (!store.indexNames.contains(index.name)) {
                console.log(`[Database] Creating index: ${index.name} on ${storeSchema.name}`)
                store.createIndex(index.name, index.keyPath, {
                  unique: index.unique,
                  multiEntry: index.multiEntry
                })
              }
            })
          }
        } else {
          // Ensure indexes exist on existing store
          const transaction = request.transaction
          if (transaction) {
            const store = transaction.objectStore(storeSchema.name)
            
            if (storeSchema.indexes) {
              storeSchema.indexes.forEach(index => {
                if (!store.indexNames.contains(index.name)) {
                  console.log(`[Database] Adding missing index: ${index.name} on ${storeSchema.name}`)
                  store.createIndex(index.name, index.keyPath, {
                    unique: index.unique,
                    multiEntry: index.multiEntry
                  })
                }
              })
            }
          }
        }
      })
    }
    
    request.onblocked = () => {
      console.log('[Database] Database opening blocked - waiting for other connections to close')
    }
  })
}

/**
 * Checks if an object store exists in the database
 * @param db - The database instance
 * @param storeName - The name of the object store to check
 * @returns boolean indicating if the store exists
 */
export function objectStoreExists(db: IDBDatabase, storeName: string): boolean {
  return db.objectStoreNames.contains(storeName)
}

/**
 * Safely creates a transaction with error handling
 * @param db - The database instance
 * @param storeNames - Array of store names to include in transaction
 * @param mode - Transaction mode ('readonly' or 'readwrite')
 * @returns Promise<IDBTransaction>
 */
export function createTransaction(
  db: IDBDatabase, 
  storeNames: string[], 
  mode: IDBTransactionMode = 'readonly'
): Promise<IDBTransaction> {
  return new Promise((resolve, reject) => {
    // Check if all stores exist
    const missingStores = storeNames.filter(name => !objectStoreExists(db, name))
    if (missingStores.length > 0) {
      const error = new Error(`Object stores not found: ${missingStores.join(', ')}`)
      console.error('[Database]', error.message)
      reject(error)
      return
    }
    
    try {
      const transaction = db.transaction(storeNames, mode)
      
      transaction.onerror = () => {
        console.error(`[Database] Transaction error: ${transaction.error}`)
        reject(transaction.error)
      }
      
      transaction.onabort = () => {
        console.warn('[Database] Transaction aborted')
        reject(new Error('Transaction aborted'))
      }
      
      transaction.oncomplete = () => {
        console.debug('[Database] Transaction completed successfully')
      }
      
      resolve(transaction)
    } catch (error) {
      console.error('[Database] Failed to create transaction:', error)
      reject(error)
    }
  })
}

/**
 * Deletes the entire database
 * @param name - Database name (defaults to EasyFilerDB)
 * @returns Promise<void>
 */
export function deleteDatabase(name: string = DB_NAME): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name)
    
    request.onerror = () => {
      console.error(`[Database] Failed to delete database: ${request.error}`)
      reject(request.error)
    }
    
    request.onsuccess = () => {
      console.log(`[Database] Successfully deleted database ${name}`)
      resolve()
    }
    
    request.onblocked = () => {
      console.log('[Database] Database deletion blocked - waiting for other connections to close')
    }
  })
}

/**
 * Gets database usage information
 * @returns Promise with usage details
 */
export async function getDatabaseUsage(): Promise<{
  used: number
  quota: number
  percentage: number
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate()
      const used = estimate.usage || 0
      const quota = estimate.quota || 0
      
      return {
        used,
        quota,
        percentage: quota > 0 ? (used / quota) * 100 : 0
      }
    } catch (error) {
      console.error('[Database] Failed to get storage estimate:', error)
    }
  }
  
  // Fallback values
  return {
    used: 0,
    quota: 0,
    percentage: 0
  }
}