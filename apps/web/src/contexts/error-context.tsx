'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AppError, ErrorSeverity, ErrorCategory } from '@/components/error-boundary'

// Toast notification types
export type ToastType = 'error' | 'warning' | 'info' | 'success'

export interface ToastNotification {
  id: string
  type: ToastType
  title: string
  message: string
  duration?: number
  persistent?: boolean
  actions?: Array<{
    label: string
    action: () => void
    variant?: 'default' | 'destructive'
  }>
}

interface ErrorContextType {
  // Error state
  errors: AppError[]
  toasts: ToastNotification[]
  
  // Error handling methods
  addError: (error: AppError) => void
  clearErrors: () => void
  clearError: (id: string) => void
  
  // Toast notification methods
  showToast: (toast: Omit<ToastNotification, 'id'>) => void
  showSuccessToast: (title: string, message: string, duration?: number) => void
  showErrorToast: (title: string, message: string, duration?: number) => void
  showWarningToast: (title: string, message: string, duration?: number) => void
  showInfoToast: (title: string, message: string, duration?: number) => void
  clearToast: (id: string) => void
  clearToasts: () => void
  
  // Convenience methods for common errors
  handleNetworkError: (error: Error, context?: string) => void
  handleValidationError: (message: string, field?: string) => void
  handleAuthError: (message?: string) => void
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
  const [errors, setErrors] = useState<AppError[]>([])
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  // Add error to the error log
  const addError = useCallback((error: AppError) => {
    setErrors(prevErrors => {
      const newErrors = [error, ...prevErrors].slice(0, maxErrors)
      
      // Log error to console
      if (enableErrorLogging) {
        console.group(`🚨 Error Logged: ${error.category.toUpperCase()}`)
        console.error('Error:', error)
        console.groupEnd()
      }
      
      // In production, send to error reporting service
      if (process.env.NODE_ENV === 'production') {
        // sendErrorToReportingService(error)
      }
      
      return newErrors
    })

    // Auto-show toast for user-facing errors
    if (error.severity === ErrorSeverity.HIGH || error.severity === ErrorSeverity.CRITICAL) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.userMessage,
        duration: 5000
      })
    }
  }, [enableErrorLogging, maxErrors])

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  // Clear a specific error
  const clearError = useCallback((id: string) => {
    setErrors(prevErrors => prevErrors.filter(error => error.message !== id))
  }, [])

  // Show toast notification
  const showToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = crypto.randomUUID()
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration ?? 4000
    }
    
    setToasts(prevToasts => {
      const updatedToasts = [newToast, ...prevToasts].slice(0, maxToasts)
      return updatedToasts
    })
    
    // Auto-dismiss toast after duration
    if (newToast.duration && newToast.duration > 0 && !newToast.persistent) {
      setTimeout(() => {
        clearToast(id)
      }, newToast.duration)
    }
  }, [maxToasts])

  // Clear a specific toast
  const clearToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }, [])

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods for different toast types
  const showSuccessToast = useCallback((title: string, message: string, duration = 3000) => {
    showToast({ type: 'success', title, message, duration })
  }, [showToast])

  const showErrorToast = useCallback((title: string, message: string, duration = 5000) => {
    showToast({ type: 'error', title, message, duration })
  }, [showToast])

  const showWarningToast = useCallback((title: string, message: string, duration = 4000) => {
    showToast({ type: 'warning', title, message, duration })
  }, [showToast])

  const showInfoToast = useCallback((title: string, message: string, duration = 3000) => {
    showToast({ type: 'info', title, message, duration })
  }, [showToast])

  // Convenience methods for common error types
  const handleNetworkError = useCallback((error: Error, context?: string) => {
    const appError: AppError = {
      message: error.message,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.NETWORK,
      timestamp: new Date(),
      recoverable: true,
      userMessage: 'Network connection issue. Please check your internet connection and try again.',
      code: 'NETWORK_ERROR',
      context: { context, originalError: error.toString() }
    }
    addError(appError)
  }, [addError])

  const handleValidationError = useCallback((message: string, field?: string) => {
    const appError: AppError = {
      message,
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.VALIDATION,
      timestamp: new Date(),
      recoverable: true,
      userMessage: message,
      code: 'VALIDATION_ERROR',
      context: { field }
    }
    addError(appError)
  }, [addError])

  const handleAuthError = useCallback((message = 'You need to log in to access this feature.') => {
    const appError: AppError = {
      message,
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.AUTHENTICATION,
      timestamp: new Date(),
      recoverable: false,
      userMessage: message,
      code: 'AUTH_ERROR'
    }
    addError(appError)
  }, [addError])

  const handleApiError = useCallback((error: any, context?: string) => {
    const message = error?.message || error?.error || 'API request failed'
    const userMessage = error?.userMessage || 'Server error occurred. Please try again later.'
    
    const appError: AppError = {
      message,
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.API,
      timestamp: new Date(),
      recoverable: true,
      userMessage,
      code: error?.code || 'API_ERROR',
      context: { 
        context, 
        status: error?.status,
        url: error?.url,
        originalError: error.toString()
      }
    }
    addError(appError)
  }, [addError])

  const handleGenericError = useCallback((error: Error, context?: string) => {
    const appError: AppError = {
      message: error.message,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.UNKNOWN,
      timestamp: new Date(),
      recoverable: true,
      userMessage: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
      context: { context, originalError: error.toString() }
    }
    addError(appError)
  }, [addError])

  const value: ErrorContextType = {
    // Error state
    errors,
    toasts,
    
    // Error handling methods
    addError,
    clearErrors,
    clearError,
    
    // Toast notification methods
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    clearToast,
    clearToasts,
    
    // Convenience methods
    handleNetworkError,
    handleValidationError,
    handleAuthError,
    handleApiError,
    handleGenericError
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}

// Hook to use the error context
export function useError() {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}

// Higher-order component to provide error context
export function withErrorContext<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    enableErrorLogging?: boolean
    maxErrors?: number
    maxToasts?: number
  }
) {
  const WrappedComponent = (props: P) => (
    <ErrorProvider 
      enableErrorLogging={options?.enableErrorLogging}
      maxErrors={options?.maxErrors}
      maxToasts={options?.maxToasts}
    >
      <Component {...props} />
    </ErrorProvider>
  )

  WrappedComponent.displayName = `withErrorContext(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorContext