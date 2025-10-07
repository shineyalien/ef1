import { useState, useEffect, useCallback } from 'react'
import { PWAUtils } from '../components/pwa/pwa-manager'

export interface AutoSaveData {
  id: string
  formType: string
  data: any
  timestamp: number
  lastSaved: number
  isDirty: boolean
}

export interface AutoSaveOptions {
  formType: string
  debounceMs?: number
  maxAge?: number // Maximum age in milliseconds before auto-cleanup
  onSave?: (data: any) => void
  onError?: (error: Error) => void
}

class AutoSaveService {
  private static instance: AutoSaveService
  private saveIntervals: Map<string, NodeJS.Timeout> = new Map()
  private saveTimeouts: Map<string, NodeJS.Timeout> = new Map()
  private formStates: Map<string, AutoSaveData> = new Map()

  private constructor() {
    // Clean up old drafts on initialization
    if (typeof window !== 'undefined') {
      this.cleanupOldDrafts()
    }
  }

  public static getInstance(): AutoSaveService {
    if (!AutoSaveService.instance) {
      AutoSaveService.instance = new AutoSaveService()
    }
    return AutoSaveService.instance
  }

  // Start auto-saving for a form
  public startAutoSave(formId: string, options: AutoSaveOptions): void {
    const { formType, debounceMs = 3000, maxAge = 7 * 24 * 60 * 60 * 1000 } = options // Default 7 days

    // Clear any existing auto-save for this form
    this.stopAutoSave(formId)

    // Set up periodic save
    const interval = setInterval(() => {
      this.saveFormData(formId, options)
    }, debounceMs)

    this.saveIntervals.set(formId, interval)

    // Store options for later use
    this.formStates.set(formId, {
      id: formId,
      formType,
      data: {},
      timestamp: Date.now(),
      lastSaved: 0,
      isDirty: false
    })
  }

  // Stop auto-saving for a form
  public stopAutoSave(formId: string): void {
    const interval = this.saveIntervals.get(formId)
    if (interval) {
      clearInterval(interval)
      this.saveIntervals.delete(formId)
    }

    const timeout = this.saveTimeouts.get(formId)
    if (timeout) {
      clearTimeout(timeout)
      this.saveTimeouts.delete(formId)
    }
  }

  // Update form data and mark as dirty
  public updateFormData(formId: string, data: any): void {
    const currentState = this.formStates.get(formId)
    if (!currentState) return

    currentState.data = { ...currentState.data, ...data }
    currentState.isDirty = true
    currentState.timestamp = Date.now()

    this.formStates.set(formId, currentState)
  }

  // Save form data immediately
  public async saveFormData(formId: string, options: AutoSaveOptions): Promise<void> {
    const currentState = this.formStates.get(formId)
    if (!currentState || !currentState.isDirty) return

    try {
      const autoSaveData: AutoSaveData = {
        ...currentState,
        lastSaved: Date.now(),
        isDirty: false
      }

      // Save to IndexedDB
      await this.saveToIndexedDB(autoSaveData)

      // Update state
      this.formStates.set(formId, autoSaveData)

      // Call save callback if provided
      if (options.onSave) {
        options.onSave(currentState.data)
      }

      console.log(`[AutoSave] Saved form data for ${formId}`)
    } catch (error) {
      console.error(`[AutoSave] Failed to save form data for ${formId}:`, error)
      
      // Call error callback if provided
      if (options.onError) {
        options.onError(error as Error)
      }
    }
  }

  // Get saved form data
  public async getSavedFormData(formId: string): Promise<AutoSaveData | null> {
    try {
      const savedData = await this.getFromIndexedDB(formId)
      return savedData
    } catch (error) {
      console.error(`[AutoSave] Failed to get saved form data for ${formId}:`, error)
      return null
    }
  }

  // Get all saved drafts for a form type
  public async getSavedDrafts(formType: string): Promise<AutoSaveData[]> {
    try {
      const allDrafts = await this.getAllFromIndexedDB()
      return allDrafts.filter(draft => draft.formType === formType)
    } catch (error) {
      console.error(`[AutoSave] Failed to get saved drafts for ${formType}:`, error)
      return []
    }
  }

  // Delete a saved draft
  public async deleteDraft(formId: string): Promise<boolean> {
    try {
      await this.deleteFromIndexedDB(formId)
      this.formStates.delete(formId)
      console.log(`[AutoSave] Deleted draft for ${formId}`)
      return true
    } catch (error) {
      console.error(`[AutoSave] Failed to delete draft for ${formId}:`, error)
      return false
    }
  }

  // Clear all drafts for a form type
  public async clearDrafts(formType: string): Promise<boolean> {
    try {
      const drafts = await this.getSavedDrafts(formType)
      for (const draft of drafts) {
        await this.deleteFromIndexedDB(draft.id)
        this.formStates.delete(draft.id)
      }
      console.log(`[AutoSave] Cleared all drafts for ${formType}`)
      return true
    } catch (error) {
      console.error(`[AutoSave] Failed to clear drafts for ${formType}:`, error)
      return false
    }
  }

  // Clean up old drafts
  public async cleanupOldDrafts(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const allDrafts = await this.getAllFromIndexedDB()
      const now = Date.now()
      const oldDrafts = allDrafts.filter(draft => (now - draft.timestamp) > maxAge)

      for (const draft of oldDrafts) {
        await this.deleteFromIndexedDB(draft.id)
        this.formStates.delete(draft.id)
      }

      if (oldDrafts.length > 0) {
        console.log(`[AutoSave] Cleaned up ${oldDrafts.length} old drafts`)
      }
    } catch (error) {
      console.error('[AutoSave] Failed to cleanup old drafts:', error)
    }
  }

  // Get storage usage for drafts
  public async getStorageUsage(): Promise<{ used: number; count: number }> {
    try {
      const allDrafts = await this.getAllFromIndexedDB()
      const used = JSON.stringify(allDrafts).length
      return { used, count: allDrafts.length }
    } catch (error) {
      console.error('[AutoSave] Failed to get storage usage:', error)
      return { used: 0, count: 0 }
    }
  }

  // Private methods for IndexedDB operations
  private async saveToIndexedDB(data: AutoSaveData): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      throw new Error('IndexedDB not supported')
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('EasyFilerDB', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result

        // Create autoDrafts store if it doesn't exist
        if (!db.objectStoreNames.contains('autoDrafts')) {
          const versionRequest = indexedDB.open('EasyFilerDB', 2)
          versionRequest.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains('autoDrafts')) {
              const draftStore = db.createObjectStore('autoDrafts', { keyPath: 'id' })
              draftStore.createIndex('formType', 'formType')
              draftStore.createIndex('timestamp', 'timestamp')
            }
          }
          versionRequest.onsuccess = () => {
            this.saveToIndexedDB(data).then(resolve).catch(reject)
          }
          versionRequest.onerror = () => reject(versionRequest.error)
          return
        }

        const transaction = db.transaction(['autoDrafts'], 'readwrite')
        const store = transaction.objectStore('autoDrafts')
        const putRequest = store.put(data)

        putRequest.onerror = () => reject(putRequest.error)
        putRequest.onsuccess = () => resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create autoDrafts store if it doesn't exist
        if (!db.objectStoreNames.contains('autoDrafts')) {
          const draftStore = db.createObjectStore('autoDrafts', { keyPath: 'id' })
          draftStore.createIndex('formType', 'formType')
          draftStore.createIndex('timestamp', 'timestamp')
        }
      }
    })
  }

  private async getFromIndexedDB(formId: string): Promise<AutoSaveData | null> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return null
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('EasyFilerDB', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result

        if (!db.objectStoreNames.contains('autoDrafts')) {
          resolve(null)
          return
        }

        const transaction = db.transaction(['autoDrafts'], 'readonly')
        const store = transaction.objectStore('autoDrafts')
        const getRequest = store.get(formId)

        getRequest.onerror = () => reject(getRequest.error)
        getRequest.onsuccess = () => resolve(getRequest.result || null)
      }
    })
  }

  private async getAllFromIndexedDB(): Promise<AutoSaveData[]> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return []
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('EasyFilerDB', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result

        if (!db.objectStoreNames.contains('autoDrafts')) {
          resolve([])
          return
        }

        const transaction = db.transaction(['autoDrafts'], 'readonly')
        const store = transaction.objectStore('autoDrafts')
        const getAllRequest = store.getAll()

        getAllRequest.onerror = () => reject(getAllRequest.error)
        getAllRequest.onsuccess = () => resolve(getAllRequest.result || [])
      }
    })
  }

  private async deleteFromIndexedDB(formId: string): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('EasyFilerDB', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result

        if (!db.objectStoreNames.contains('autoDrafts')) {
          resolve()
          return
        }

        const transaction = db.transaction(['autoDrafts'], 'readwrite')
        const store = transaction.objectStore('autoDrafts')
        const deleteRequest = store.delete(formId)

        deleteRequest.onerror = () => reject(deleteRequest.error)
        deleteRequest.onsuccess = () => resolve()
      }
    })
  }
}

// React hook for auto-save functionality
export function useAutoSave(formId: string, options: AutoSaveOptions) {
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasDraft, setHasDraft] = useState(false)

  useEffect(() => {
    // Check for existing draft on mount
    const checkForDraft = async () => {
      const autoSaveService = AutoSaveService.getInstance()
      const draft = await autoSaveService.getSavedFormData(formId)
      if (draft) {
        setHasDraft(true)
        setLastSaved(new Date(draft.lastSaved))
      }
    }

    if (typeof window !== 'undefined') {
      checkForDraft()
    }
  }, [formId])

  useEffect(() => {
    const autoSaveService = AutoSaveService.getInstance()
    
    // Start auto-save
    autoSaveService.startAutoSave(formId, {
      ...options,
      onSave: (data) => {
        setIsDirty(false)
        setLastSaved(new Date())
        if (options.onSave) {
          options.onSave(data)
        }
      },
      onError: (error) => {
        if (options.onError) {
          options.onError(error)
        }
      }
    })

    return () => {
      // Stop auto-save on unmount
      autoSaveService.stopAutoSave(formId)
    }
  }, [formId, options])

  const updateData = useCallback((data: any) => {
    const autoSaveService = AutoSaveService.getInstance()
    autoSaveService.updateFormData(formId, data)
    setIsDirty(true)
  }, [formId])

  const saveNow = useCallback(async () => {
    const autoSaveService = AutoSaveService.getInstance()
    await autoSaveService.saveFormData(formId, options)
  }, [formId, options])

  const clearDraft = useCallback(async () => {
    const autoSaveService = AutoSaveService.getInstance()
    await autoSaveService.deleteDraft(formId)
    setHasDraft(false)
    setLastSaved(null)
    setIsDirty(false)
  }, [formId])

  return {
    isDirty,
    lastSaved,
    hasDraft,
    updateData,
    saveNow,
    clearDraft
  }
}

// Export singleton instance
export const autoSaveService = AutoSaveService.getInstance()
export default autoSaveService