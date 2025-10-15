'use client'

import { useEffect, useState } from 'react'

// Simple implementation of offline hooks
export function useOfflineInvoices() {
  const [hasUnsyncedInvoices, setHasUnsyncedInvoices] = useState(false)
  const [syncStatus, setSyncStatus] = useState({
    status: 'idle' as 'idle' | 'syncing' | 'success' | 'error',
    pendingItems: 0
  })
  const [isClient, setIsClient] = useState(false)
  
  const saveOfflineInvoice = (invoice: any) => {
    if (!isClient) return false
    try {
      const unsyncedInvoices = JSON.parse(localStorage.getItem('unsyncedInvoices') || '[]')
      unsyncedInvoices.push(invoice)
      localStorage.setItem('unsyncedInvoices', JSON.stringify(unsyncedInvoices))
      setHasUnsyncedInvoices(true)
      setSyncStatus(prev => ({ ...prev, pendingItems: unsyncedInvoices.length }))
      return true
    } catch (error) {
      console.error('Error saving offline invoice:', error)
      return false
    }
  }
  
  useEffect(() => {
    setIsClient(true)
    
    // Check for unsynced invoices in localStorage or IndexedDB
    const checkUnsyncedInvoices = () => {
      if (typeof window === 'undefined') return
      try {
        const unsyncedInvoices = localStorage.getItem('unsyncedInvoices')
        const invoices = unsyncedInvoices ? JSON.parse(unsyncedInvoices) : []
        setHasUnsyncedInvoices(invoices.length > 0)
        setSyncStatus(prev => ({ ...prev, pendingItems: invoices.length }))
      } catch (error) {
        console.error('Error checking unsynced invoices:', error)
        setHasUnsyncedInvoices(false)
        setSyncStatus(prev => ({ ...prev, pendingItems: 0 }))
      }
    }
    
    checkUnsyncedInvoices()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkUnsyncedInvoices()
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
    
    return () => {}
  }, [])
  
  return { hasUnsyncedInvoices, saveOfflineInvoice, syncStatus }
}

export function useOfflineCustomers() {
  const [hasUnsyncedCustomers, setHasUnsyncedCustomers] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  const saveOfflineCustomer = (customer: any) => {
    if (!isClient) return false
    try {
      const unsyncedCustomers = JSON.parse(localStorage.getItem('unsyncedCustomers') || '[]')
      unsyncedCustomers.push(customer)
      localStorage.setItem('unsyncedCustomers', JSON.stringify(unsyncedCustomers))
      setHasUnsyncedCustomers(true)
      return true
    } catch (error) {
      console.error('Error saving offline customer:', error)
      return false
    }
  }
  
  const getOfflineCustomers = () => {
    if (!isClient) return []
    try {
      const unsyncedCustomers = localStorage.getItem('unsyncedCustomers')
      return unsyncedCustomers ? JSON.parse(unsyncedCustomers) : []
    } catch (error) {
      console.error('Error getting offline customers:', error)
      return []
    }
  }
  
  useEffect(() => {
    setIsClient(true)
    
    // Check for unsynced customers in localStorage or IndexedDB
    const checkUnsyncedCustomers = () => {
      if (typeof window === 'undefined') return
      try {
        const unsyncedCustomers = localStorage.getItem('unsyncedCustomers')
        setHasUnsyncedCustomers(!!unsyncedCustomers && JSON.parse(unsyncedCustomers).length > 0)
      } catch (error) {
        console.error('Error checking unsynced customers:', error)
        setHasUnsyncedCustomers(false)
      }
    }
    
    checkUnsyncedCustomers()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkUnsyncedCustomers()
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
    
    return () => {}
  }, [])
  
  return { hasUnsyncedCustomers, saveOfflineCustomer, getOfflineCustomers }
}