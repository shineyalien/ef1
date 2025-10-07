'use client'

import React, { useEffect, useState } from 'react'
import ErrorBoundary, { AppError, ErrorSeverity, ErrorCategory } from '@/components/error-boundary'
import { ErrorProvider, useError } from '@/contexts/error-context'
import { ToastContainer } from '@/components/ui/toast'
import errorLogger from '@/lib/error-logger'

interface GlobalErrorHandlerProps {
  children: React.ReactNode
  enableErrorLogging?: boolean
  enableToastNotifications?: boolean
  errorReportingEndpoint?: string
  errorReportingApiKey?: string
}

// Global error handler component that wraps the entire app
function GlobalErrorHandlerContent({ 
  children, 
  enableErrorLogging = true,
  enableToastNotifications = true
}: GlobalErrorHandlerProps) {
  const { toasts, clearToast } = useError()
  const [mounted, setMounted] = useState(false)

  // Set up global error handlers
  useEffect(() => {
    setMounted(true)
    
    // Configure error logger if enabled
    if (enableErrorLogging) {
      errorLogger.updateConfig({
        enabled: true,
        endpoint: process.env.NEXT_PUBLIC_ERROR_ENDPOINT,
        apiKey: process.env.NEXT_PUBLIC_ERROR_API_KEY,
        environment: process.env.NODE_ENV as any || 'development'
      })
    }

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(event.reason?.toString() || 'Unhandled promise rejection')
      
      const appError: AppError = {
        message: error.message,
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.UNKNOWN,
        timestamp: new Date(),
        recoverable: false,
        userMessage: 'An unexpected error occurred. Please refresh the page.',
        code: 'UNHANDLED_PROMISE_REJECTION',
        context: {
          stack: error.stack,
          reason: event.reason?.toString()
        }
      }
      
      errorLogger.logError(appError)
    }

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      const error = event.error || new Error(event.message)
      
      const appError: AppError = {
        message: error.message,
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.UNKNOWN,
        timestamp: new Date(),
        recoverable: false,
        userMessage: 'A critical error occurred. Please refresh the page.',
        code: 'UNCAUGHT_ERROR',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: error.stack
        }
      }
      
      errorLogger.logError(appError)
    }

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [enableErrorLogging])

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      
      {/* Toast notifications */}
      {enableToastNotifications && (
        <ToastContainer 
          toasts={toasts} 
          onClose={clearToast}
          position="top-right"
        />
      )}
    </>
  )
}

// Main global error handler component
export default function GlobalErrorHandler({ 
  children, 
  enableErrorLogging = true,
  enableToastNotifications = true,
  errorReportingEndpoint,
  errorReportingApiKey
}: GlobalErrorHandlerProps) {
  // Configure error logger
  useEffect(() => {
    if (errorReportingEndpoint || errorReportingApiKey) {
      errorLogger.updateConfig({
        endpoint: errorReportingEndpoint,
        apiKey: errorReportingApiKey
      })
    }
  }, [errorReportingEndpoint, errorReportingApiKey])

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error to the error logger
        errorLogger.logError(error, {
          componentStack: errorInfo?.componentStack,
          global: true
        })
      }}
      maxRetries={3}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <ErrorProvider
        enableErrorLogging={enableErrorLogging}
        maxErrors={50}
        maxToasts={5}
      >
        <GlobalErrorHandlerContent
          enableErrorLogging={enableErrorLogging}
          enableToastNotifications={enableToastNotifications}
        >
          {children}
        </GlobalErrorHandlerContent>
      </ErrorProvider>
    </ErrorBoundary>
  )
}

// Hook to access global error handling functionality
export function useGlobalErrorHandler() {
  const { 
    addError, 
    clearErrors, 
    showToast, 
    showSuccessToast, 
    showErrorToast, 
    showWarningToast, 
    showInfoToast 
  } = useError()

  // Enhanced error reporting
  const reportError = (
    error: Error | AppError, 
    context?: Record<string, any>
  ) => {
    const appError = error instanceof Error 
      ? {
          message: error.message,
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.UNKNOWN,
          timestamp: new Date(),
          recoverable: true,
          userMessage: 'An error occurred. Please try again.',
          code: 'REPORTED_ERROR',
          context
        } as AppError
      : error

    // Log to error logger
    const errorId = errorLogger.logError(appError, context)
    
    // Add to error context
    addError(appError)
    
    // Show error toast
    showErrorToast('Error Occurred', appError.userMessage)
    
    return errorId
  }

  // Report error with custom severity
  const reportErrorWithSeverity = (
    error: Error | AppError, 
    severity: ErrorSeverity,
    context?: Record<string, any>
  ) => {
    const appError = error instanceof Error 
      ? {
          message: error.message,
          severity,
          category: ErrorCategory.UNKNOWN,
          timestamp: new Date(),
          recoverable: severity !== ErrorSeverity.CRITICAL,
          userMessage: severity === ErrorSeverity.CRITICAL 
            ? 'A critical error occurred. Please refresh the page.'
            : 'An error occurred. Please try again.',
          code: 'REPORTED_ERROR',
          context
        } as AppError
      : { ...error, severity }

    // Log to error logger
    const errorId = errorLogger.logError(appError, context)
    
    // Add to error context
    addError(appError)
    
    // Show error toast
    if (severity === ErrorSeverity.CRITICAL) {
      showErrorToast('Critical Error', appError.userMessage)
    } else if (severity === ErrorSeverity.HIGH) {
      showErrorToast('Error', appError.userMessage)
    } else if (severity === ErrorSeverity.MEDIUM) {
      showWarningToast('Warning', appError.userMessage)
    } else {
      showInfoToast('Notice', appError.userMessage)
    }
    
    return errorId
  }

  // Get error analytics
  const getErrorAnalytics = () => {
    return errorLogger.getErrorAggregation()
  }

  // Export error logs
  const exportErrorLogs = () => {
    return errorLogger.exportErrors()
  }

  // Clear all error logs
  const clearErrorLogs = () => {
    errorLogger.clearErrors()
    clearErrors()
  }

  return {
    // Basic error reporting
    reportError,
    reportErrorWithSeverity,
    
    // Analytics
    getErrorAnalytics,
    
    // Management
    exportErrorLogs,
    clearErrorLogs,
    
    // Toast notifications
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast
  }
}