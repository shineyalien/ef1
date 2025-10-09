/**
 * IndexedDB migration utility for Easy Filer
 * Handles database schema migrations and data preservation
 */

import { DB_NAME, DB_VERSION, DATABASE_SCHEMA, openDatabase } from './indexeddb-init'

export interface Migration {
  version: number
  name: string
  description: string
  up: (db: IDBDatabase, transaction: IDBTransaction, oldVersion: number) => Promise<void>
  down?: (db: IDBDatabase, transaction: IDBTransaction) => Promise<void>
}

/**
 * Database migration definitions
 * Each migration handles a specific version upgrade
 */
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: 'Initial Schema',
    description: 'Create initial object stores for invoices, customers, and bulk operations',
    up: async (db: IDBDatabase, transaction: IDBTransaction, oldVersion: number) => {
      console.log('[Migration] Setting up initial schema v1')
      
      // Create initial stores
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
  },
  {
    version: 2,
    name: 'Add Sync Queue',
    description: 'Add syncQueue object store with proper indexes for offline synchronization',
    up: async (db: IDBDatabase, transaction: IDBTransaction, oldVersion: number) => {
      console.log('[Migration] Adding syncQueue store v2')
      
      // Create syncQueue store with correct keyPath (no autoIncrement)
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncQueueStore = db.createObjectStore('syncQueue', { keyPath: 'id' })
        syncQueueStore.createIndex('timestamp', 'timestamp')
        syncQueueStore.createIndex('retryCount', 'retryCount')
        syncQueueStore.createIndex('status', 'status')
      } else {
        // If store exists but with wrong configuration, migrate data
        console.log('[Migration] syncQueue store exists, checking configuration')
        const store = transaction.objectStore('syncQueue')
        
        // Ensure all required indexes exist
        if (!store.indexNames.contains('status')) {
          store.createIndex('status', 'status')
        }
        
        // Migrate data if needed (e.g., if store was created with autoIncrement)
        await migrateSyncQueueData(store)
      }
    }
  }
]

/**
 * Migrates data from an incorrectly configured syncQueue store
 * This handles the case where the store was created with autoIncrement
 */
async function migrateSyncQueueData(store: IDBObjectStore): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('[Migration] Checking syncQueue data migration')
    
    // Get all items to check if they need migration
    const getAllRequest = store.getAll()
    
    getAllRequest.onerror = () => {
      console.error('[Migration] Failed to get syncQueue items for migration')
      reject(getAllRequest.error)
    }
    
    getAllRequest.onsuccess = () => {
      const items = getAllRequest.result
      let migratedCount = 0
      
      // Check if items have string IDs (correct) or numeric IDs (need migration)
      const needsMigration = items.some((item: any) => 
        typeof item.id === 'number' || !item.id.startsWith('sync_')
      )
      
      if (!needsMigration) {
        console.log('[Migration] syncQueue data migration not needed')
        resolve()
        return
      }
      
      console.log(`[Migration] Migrating ${items.length} syncQueue items`)
      
      // Migrate each item to have a proper string ID
      items.forEach((item: any) => {
        if (typeof item.id === 'number' || !item.id.startsWith('sync_')) {
          const oldId = item.id
          item.id = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          // Add the new item
          const addRequest = store.add(item)
          addRequest.onerror = () => {
            console.error(`[Migration] Failed to migrate item ${oldId}`)
          }
          addRequest.onsuccess = () => {
            // Delete the old item
            const deleteRequest = store.delete(oldId)
            deleteRequest.onerror = () => {
              console.error(`[Migration] Failed to delete old item ${oldId}`)
            }
            deleteRequest.onsuccess = () => {
              migratedCount++
              if (migratedCount === items.length) {
                console.log(`[Migration] Successfully migrated ${migratedCount} items`)
                resolve()
              }
            }
          }
        } else {
          migratedCount++
          if (migratedCount === items.length) {
            console.log(`[Migration] No migration needed for ${items.length} items`)
            resolve()
          }
        }
      })
    }
  })
}

/**
 * Runs database migrations to bring the database to the current version
 * @param currentVersion - Current database version
 * @param targetVersion - Target database version (defaults to DB_VERSION)
 * @returns Promise<void>
 */
export async function runMigrations(
  currentVersion: number, 
  targetVersion: number = DB_VERSION
): Promise<void> {
  console.log(`[Migration] Running migrations from v${currentVersion} to v${targetVersion}`)
  
  // Get migrations that need to be run
  const migrationsToRun = MIGRATIONS.filter(
    migration => migration.version > currentVersion && migration.version <= targetVersion
  )
  
  if (migrationsToRun.length === 0) {
    console.log('[Migration] No migrations to run')
    return
  }
  
  // Open database with target version to trigger upgrade
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, targetVersion)
    
    request.onerror = () => {
      console.error(`[Migration] Failed to open database for migration: ${request.error}`)
      reject(request.error)
    }
    
    request.onsuccess = () => {
      console.log('[Migration] Database opened successfully after migrations')
      resolve()
    }
    
    request.onupgradeneeded = async (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = request.transaction!
      
      try {
        console.log(`[Migration] Upgrading database from v${currentVersion} to v${targetVersion}`)
        
        // Run each migration in order
        for (const migration of migrationsToRun) {
          console.log(`[Migration] Running ${migration.name} (v${migration.version})`)
          await migration.up(db, transaction, currentVersion)
          console.log(`[Migration] Completed ${migration.name}`)
        }
        
        console.log('[Migration] All migrations completed successfully')
      } catch (error) {
        console.error('[Migration] Migration failed:', error)
        transaction.abort()
        reject(error)
      }
    }
    
    request.onblocked = () => {
      console.warn('[Migration] Database migration blocked - waiting for other connections to close')
    }
  })
}

/**
 * Checks if database needs migration and runs them if needed
 * @returns Promise<boolean> - true if migrations were run, false otherwise
 */
export async function checkAndRunMigrations(): Promise<boolean> {
  try {
    // Check current database version
    const currentVersion = await getCurrentDatabaseVersion()
    
    if (currentVersion < DB_VERSION) {
      console.log(`[Migration] Database v${currentVersion} needs upgrade to v${DB_VERSION}`)
      await runMigrations(currentVersion, DB_VERSION)
      return true
    } else {
      console.log(`[Migration] Database is up to date (v${currentVersion})`)
      return false
    }
  } catch (error) {
    console.error('[Migration] Failed to check/run migrations:', error)
    throw error
  }
}

/**
 * Gets the current version of the database
 * @returns Promise<number> - Current database version
 */
export async function getCurrentDatabaseVersion(): Promise<number> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME)
    
    request.onerror = () => {
      // Database doesn't exist
      resolve(0)
    }
    
    request.onsuccess = () => {
      const db = request.result
      const version = db.version
      db.close()
      resolve(version)
    }
    
    request.onupgradeneeded = () => {
      // Database doesn't exist (being created)
      resolve(0)
    }
  })
}

/**
 * Creates a backup of the database before migration
 * @param backupName - Name for the backup database
 * @returns Promise<void>
 */
export async function createDatabaseBackup(backupName?: string): Promise<void> {
  const backupDBName = backupName || `${DB_NAME}_backup_${Date.now()}`
  
  try {
    console.log(`[Migration] Creating database backup: ${backupDBName}`)
    
    // Open source database
    const sourceDB = await openDatabase(DB_NAME, DB_VERSION)
    
    // Create backup database
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(backupDBName, DB_VERSION)
      
      request.onerror = () => reject(request.error)
      
      request.onsuccess = () => {
        console.log(`[Migration] Database backup created: ${backupDBName}`)
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const backupDB = (event.target as IDBOpenDBRequest).result
        
        // Create all object stores in backup
        DATABASE_SCHEMA.forEach(storeSchema => {
          if (!backupDB.objectStoreNames.contains(storeSchema.name)) {
            const store = backupDB.createObjectStore(storeSchema.name, {
              keyPath: storeSchema.keyPath,
              autoIncrement: storeSchema.autoIncrement
            })
            
            // Create indexes
            if (storeSchema.indexes) {
              storeSchema.indexes.forEach(index => {
                store.createIndex(index.name, index.keyPath, {
                  unique: index.unique,
                  multiEntry: index.multiEntry
                })
              })
            }
          }
        })
        
        // Copy data from source to backup
        const transaction = request.transaction!
        
        DATABASE_SCHEMA.forEach(storeSchema => {
          const sourceStore = sourceDB.transaction(storeSchema.name).objectStore(storeSchema.name)
          const backupStore = transaction.objectStore(storeSchema.name)
          
          const getAllRequest = sourceStore.getAll()
          getAllRequest.onsuccess = () => {
            const items = getAllRequest.result
            items.forEach((item: any) => {
              backupStore.add(item)
            })
          }
        })
      }
    })
  } catch (error) {
    console.error('[Migration] Failed to create database backup:', error)
    throw error
  }
}

/**
 * Restores database from a backup
 * @param backupName - Name of the backup database
 * @returns Promise<void>
 */
export async function restoreFromBackup(backupName: string): Promise<void> {
  try {
    console.log(`[Migration] Restoring database from backup: ${backupName}`)
    
    // Delete current database
    await deleteDatabase(DB_NAME)
    
    // Copy backup to main database
    const backupDB = await openDatabase(backupName, DB_VERSION)
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onerror = () => reject(request.error)
      
      request.onsuccess = () => {
        console.log('[Migration] Database restored from backup')
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const restoredDB = (event.target as IDBOpenDBRequest).result
        
        // Create all object stores
        DATABASE_SCHEMA.forEach(storeSchema => {
          if (!restoredDB.objectStoreNames.contains(storeSchema.name)) {
            const store = restoredDB.createObjectStore(storeSchema.name, {
              keyPath: storeSchema.keyPath,
              autoIncrement: storeSchema.autoIncrement
            })
            
            // Create indexes
            if (storeSchema.indexes) {
              storeSchema.indexes.forEach(index => {
                store.createIndex(index.name, index.keyPath, {
                  unique: index.unique,
                  multiEntry: index.multiEntry
                })
              })
            }
          }
        })
        
        // Copy data from backup to restored database
        const transaction = request.transaction!
        
        DATABASE_SCHEMA.forEach(storeSchema => {
          const backupStore = backupDB.transaction(storeSchema.name).objectStore(storeSchema.name)
          const restoredStore = transaction.objectStore(storeSchema.name)
          
          const getAllRequest = backupStore.getAll()
          getAllRequest.onsuccess = () => {
            const items = getAllRequest.result
            items.forEach((item: any) => {
              restoredStore.add(item)
            })
          }
        })
      }
    })
  } catch (error) {
    console.error('[Migration] Failed to restore from backup:', error)
    throw error
  }
}

/**
 * Deletes a database
 * @param name - Database name to delete
 * @returns Promise<void>
 */
function deleteDatabase(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
    request.onblocked = () => {
      console.log(`[Migration] Database deletion blocked for ${name}`)
    }
  })
}