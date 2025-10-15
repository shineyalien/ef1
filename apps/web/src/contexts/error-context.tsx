'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { toast } from 'sonner'

interface ErrorContextType {
  showErrorToast: (title: string, message: string) => void
  showSuccessToast: (title: string, message: string) => void
  handleNetworkError: (error: Error, context?: string) => void
  handleValidationError: (message: string, field?: string) => void
  handleApiError: (error: any, context?: string) => void
  handleGenericError: (error: Error, context?: string) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

interface ErrorProviderProps {
  children: ReactNode
  enableErrorLogging?: boolean
  maxErrors?: number
  maxToasts?: number
}

export function ErrorProvider({ 
  children, 
  enableErrorLogging = true,
  maxErrors = 50,
  maxToasts = 5
}: ErrorProviderProps) {
  const [errorCount, setErrorCount] = useState(0)
  const [toastCount, setToastCount] = useState(0)

  const showErrorToast = useCallback((title: string, message: string) => {
    if (typeof window === 'undefined') return // SSR guard
    
    if (toastCount < maxToasts) {
      toast.error(title, { description: message })
      setToastCount(prev => prev + 1)
    }
    if (enableErrorLogging) {
      console.error(`[Error Toast] ${title}: ${message}`)
    }
  }, [toastCount, maxToasts, enableErrorLogging])

  const showSuccessToast = useCallback((title: string, message: string) => {
    if (typeof window === 'undefined') return // SSR guard
    
    if (toastCount < maxToasts) {
      toast.success(title, { description: message })
      setToastCount(prev => prev + 1)
    }
    if (enableErrorLogging) {
      console.log(`[Success Toast] ${title}: ${message}`)
    }
  }, [toastCount, maxToasts, enableErrorLogging])

  const handleNetworkError = useCallback((error: Error, context?: string) => {
    if (errorCount < maxErrors) {
      showErrorToast(
        'Network Error',
        `Failed to connect${context ? ` in ${context}` : ''}. Please check your internet connection.`
      )
      setErrorCount(prev => prev + 1)
    }
    if (enableErrorLogging) {
      console.error(`[Network Error]${context ? ` ${context}:` : ''}`, error)
    }
  }, [errorCount, maxErrors, showErrorToast, enableErrorLogging])

  const handleValidationError = useCallback((message: string, field?: string) => {
    if (errorCount < maxErrors) {
      showErrorToast(
        'Validation Error',
        field ? `${field}: ${message}` : message
      )
      setErrorCount(prev => prev + 1)
    }
    if (enableErrorLogging) {
      console.error(`[Validation Error]${field ? ` ${field}:` : ''}`, message)
    }
  }, [errorCount, maxErrors, showErrorToast, enableErrorLogging])

  const handleApiError = useCallback((error: any, context?: string) => {
    if (errorCount < maxErrors) {
      const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred'
      showErrorToast(
        'API Error',
        `${context ? `${context}: ` : ''}${message}`
      )
      setErrorCount(prev => prev + 1)
    }
    if (enableErrorLogging) {
      console.error(`[API Error]${context ? ` ${context}:` : ''}`, error)
    }
  }, [errorCount, maxErrors, showErrorToast, enableErrorLogging])

  const handleGenericError = useCallback((error: Error, context?: string) => {
    if (errorCount < maxErrors) {
      showErrorToast(
        'Error',
        `${context ? `${context}: ` : ''}${error.message}`
      )
      setErrorCount(prev => prev + 1)
    }
    if (enableErrorLogging) {
      console.error(`[Generic Error]${context ? ` ${context}:` : ''}`, error)
    }
  }, [errorCount, maxErrors, showErrorToast, enableErrorLogging])

  const value: ErrorContextType = {
    showErrorToast,
    showSuccessToast,
    handleNetworkError,
    handleValidationError,
    handleApiError,
    handleGenericError
  }

  // Explicitly return valid React children
  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useError() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within ErrorProvider')
  }
  return context
}

export default ErrorContext