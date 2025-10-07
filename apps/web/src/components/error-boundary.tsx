'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react'

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error categories
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  DATABASE = 'database',
  API = 'api',
  UI = 'ui',
  UNKNOWN = 'unknown'
}

// Enhanced error interface
export interface AppError {
  message: string
  code?: string
  severity: ErrorSeverity
  category: ErrorCategory
  timestamp: Date
  context?: Record<string, any>
  recoverable: boolean
  userMessage: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: AppError
  errorInfo?: React.ErrorInfo
  retryCount: number
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: AppError; retry: () => void; retryCount: number }>
  onError?: (error: AppError, errorInfo?: React.ErrorInfo) => void
  maxRetries?: number
  showErrorDetails?: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Convert Error to AppError
    const appError: AppError = ErrorBoundary.categorizeError(error)
    
    return {
      hasError: true,
      error: appError
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = ErrorBoundary.categorizeError(error)
    
    this.setState({
      error: appError,
      errorInfo
    })

    // Log error to monitoring service
    this.logError(appError, errorInfo)
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo)
    }
  }

  // Categorize errors based on message and stack
  private static categorizeError(error: Error): AppError {
    const message = error.message.toLowerCase()
    const stack = error.stack?.toLowerCase() || ''
    
    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('networkerror')) {
      return {
        message: error.message,
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.NETWORK,
        timestamp: new Date(),
        recoverable: true,
        userMessage: 'Network connection issue. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR'
      }
    }
    
    // Authentication errors
    if (message.includes('unauthorized') || message.includes('authentication') || message.includes('401')) {
      return {
        message: error.message,
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.AUTHENTICATION,
        timestamp: new Date(),
        recoverable: false,
        userMessage: 'You need to log in to access this feature.',
        code: 'AUTH_ERROR'
      }
    }
    
    // Permission errors
    if (message.includes('permission') || message.includes('forbidden') || message.includes('403')) {
      return {
        message: error.message,
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.PERMISSION,
        timestamp: new Date(),
        recoverable: false,
        userMessage: 'You don\'t have permission to perform this action.',
        code: 'PERMISSION_ERROR'
      }
    }
    
    // Validation errors
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return {
        message: error.message,
        severity: ErrorSeverity.LOW,
        category: ErrorCategory.VALIDATION,
        timestamp: new Date(),
        recoverable: true,
        userMessage: 'Please check your input and try again.',
        code: 'VALIDATION_ERROR'
      }
    }
    
    // API errors
    if (message.includes('api') || message.includes('500') || message.includes('server error')) {
      return {
        message: error.message,
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.API,
        timestamp: new Date(),
        recoverable: true,
        userMessage: 'Server error occurred. Please try again later.',
        code: 'API_ERROR'
      }
    }
    
    // Database errors
    if (message.includes('database') || message.includes('prisma') || message.includes('query')) {
      return {
        message: error.message,
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.DATABASE,
        timestamp: new Date(),
        recoverable: true,
        userMessage: 'Data storage error. Please try again.',
        code: 'DATABASE_ERROR'
      }
    }
    
    // Default/Unknown errors
    return {
      message: error.message,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.UNKNOWN,
      timestamp: new Date(),
      recoverable: true,
      userMessage: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR'
    }
  }

  // Log error to console and external services
  private logError(error: AppError, errorInfo?: React.ErrorInfo) {
    console.group(`🚨 Error Boundary: ${error.category.toUpperCase()} - ${error.severity.toUpperCase()}`)
    console.error('Error:', error)
    if (errorInfo) {
      console.error('Component Stack:', errorInfo.componentStack)
    }
    console.groupEnd()
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // This would integrate with services like Sentry, LogRocket, etc.
      // reportErrorToService(error, errorInfo)
    }
  }

  retry = () => {
    const maxRetries = this.props.maxRetries || 3
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  goHome = () => {
    window.location.href = '/'
  }

  reportBug = () => {
    const errorDetails = this.state.error
      ? `Error: ${this.state.error.message}\nCategory: ${this.state.error.category}\nSeverity: ${this.state.error.severity}\nTimestamp: ${this.state.error.timestamp.toISOString()}`
      : 'Unknown error occurred'
    
    // Open email client with error details
    window.location.href = `mailto:support@easyfiler.com?subject=Bug Report - Easy Filer&body=${encodeURIComponent(errorDetails)}`
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback: Fallback } = this.props
      const { error, retryCount } = this.state
      
      if (Fallback) {
        return <Fallback error={error} retry={this.retry} retryCount={retryCount} />
      }

      const isRetryable = error.recoverable && retryCount < (this.props.maxRetries || 3)
      const showDetails = this.props.showErrorDetails !== false && process.env.NODE_ENV === 'development'

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">
                {error.severity === ErrorSeverity.CRITICAL ? 'Critical Error' : 'Something went wrong'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {error.userMessage}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error details in development */}
              {showDetails && (
                <div className="bg-gray-100 p-3 rounded text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Error Details:</p>
                    <Bug className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <p><span className="font-medium">Message:</span> {error.message}</p>
                    <p><span className="font-medium">Category:</span> {error.category}</p>
                    <p><span className="font-medium">Severity:</span> {error.severity}</p>
                    <p><span className="font-medium">Code:</span> {error.code}</p>
                    <p><span className="font-medium">Retry Count:</span> {retryCount}</p>
                    {this.state.errorInfo && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">Component Stack</summary>
                        <pre className="text-xs mt-1 whitespace-pre-wrap bg-white p-2 rounded border">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                {isRetryable && (
                  <Button
                    onClick={this.retry}
                    className="flex-1"
                    disabled={retryCount >= (this.props.maxRetries || 3)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again {retryCount > 0 && `(${retryCount}/${this.props.maxRetries || 3})`}
                  </Button>
                )}
                
                <Button
                  onClick={this.goHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>

              {/* Report bug button */}
              <Button
                onClick={this.reportBug}
                variant="ghost"
                size="sm"
                className="w-full text-gray-500"
              >
                <Mail className="h-4 w-4 mr-2" />
                Report this issue
              </Button>

              {/* Retry exceeded message */}
              {retryCount >= (this.props.maxRetries || 3) && (
                <div className="text-center text-sm text-gray-500 p-3 bg-yellow-50 rounded border border-yellow-200">
                  Maximum retry attempts reached. Please refresh the page or contact support if the problem persists.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for handling errors in functional components
export function useErrorHandler() {
  return (error: Error | AppError, errorInfo?: React.ErrorInfo) => {
    const appError = error instanceof Error ? ErrorBoundary['categorizeError'](error) : error
    
    console.group(`🚨 Error Handler: ${appError.category.toUpperCase()}`)
    console.error('Error:', appError)
    if (errorInfo) {
      console.error('Component Stack:', errorInfo.componentStack)
    }
    console.groupEnd()
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // reportErrorToService(appError, errorInfo)
    }
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ComponentType<{ error?: AppError; retry: () => void; retryCount: number }>
    onError?: (error: AppError, errorInfo?: React.ErrorInfo) => void
    maxRetries?: number
    showErrorDetails?: boolean
  }
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary
      fallback={options?.fallback}
      onError={options?.onError}
      maxRetries={options?.maxRetries}
      showErrorDetails={options?.showErrorDetails}
    >
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorBoundary