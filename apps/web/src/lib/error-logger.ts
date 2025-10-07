import { AppError, ErrorSeverity, ErrorCategory } from '@/components/error-boundary'

// Error logging interface
export interface ErrorLogEntry {
  id: string
  error: AppError
  userAgent: string
  url: string
  userId?: string
  sessionId: string
  timestamp: Date
  resolved: boolean
  resolvedAt?: Date
  resolvedBy?: string
}

// Error filter options
export interface ErrorFilterOptions {
  severity?: ErrorSeverity[]
  category?: ErrorCategory[]
  dateRange?: {
    start: Date
    end: Date
  }
  resolved?: boolean
  userId?: string
  search?: string
}

// Error aggregation data
export interface ErrorAggregation {
  totalErrors: number
  errorsByCategory: Record<ErrorCategory, number>
  errorsBySeverity: Record<ErrorSeverity, number>
  errorsOverTime: Array<{
    date: string
    count: number
  }>
  topErrors: Array<{
    message: string
    count: number
    category: ErrorCategory
  }>
}

// Error reporting service configuration
export interface ErrorReportingConfig {
  enabled: boolean
  endpoint?: string
  apiKey?: string
  environment: 'development' | 'staging' | 'production'
  userId?: string
  version?: string
  tags?: Record<string, string>
  sampleRate?: number // 0.0 to 1.0, default 1.0
  maxErrors?: number // Maximum errors to store locally
}

class ErrorLogger {
  private config: ErrorReportingConfig
  private errorLogs: ErrorLogEntry[] = []
  private sessionId: string
  private maxLocalErrors: number = 100

  constructor(config: Partial<ErrorReportingConfig> = {}) {
    this.config = {
      enabled: true,
      environment: process.env.NODE_ENV as any || 'development',
      sampleRate: 1.0,
      maxErrors: 100,
      ...config
    }
    
    this.sessionId = this.generateSessionId()
    this.maxLocalErrors = this.config.maxErrors || 100
    
    // Load existing errors from localStorage
    this.loadErrorsFromStorage()
    
    // Set up global error handlers
    this.setupGlobalHandlers()
  }

  // Generate a unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Set up global error handlers for unhandled errors
  private setupGlobalHandlers() {
    if (typeof window !== 'undefined') {
      // Handle unhandled JavaScript errors
      window.addEventListener('error', (event) => {
        this.logError({
          message: event.message,
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.UNKNOWN,
          timestamp: new Date(),
          recoverable: false,
          userMessage: 'An unexpected error occurred.',
          code: 'UNHANDLED_ERROR',
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
          }
        })
      })

      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.logError({
          message: event.reason?.message || 'Unhandled promise rejection',
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.UNKNOWN,
          timestamp: new Date(),
          recoverable: false,
          userMessage: 'An unexpected error occurred.',
          code: 'UNHANDLED_PROMISE_REJECTION',
          context: {
            reason: event.reason?.toString(),
            stack: event.reason?.stack
          }
        })
      })
    }
  }

  // Log an error
  logError(error: AppError, additionalContext?: Record<string, any>): string {
    if (!this.config.enabled) {
      return ''
    }

    // Sample errors based on sample rate
    if (Math.random() > (this.config.sampleRate || 1.0)) {
      return ''
    }

    const errorId = this.generateErrorId()
    const logEntry: ErrorLogEntry = {
      id: errorId,
      error: {
        ...error,
        context: {
          ...error.context,
          ...additionalContext,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
          url: typeof window !== 'undefined' ? window.location.href : 'server'
        }
      },
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userId: this.config.userId,
      sessionId: this.sessionId,
      timestamp: new Date(),
      resolved: false
    }

    // Add to local logs
    this.errorLogs.unshift(logEntry)
    
    // Limit the number of errors stored locally
    if (this.errorLogs.length > this.maxLocalErrors) {
      this.errorLogs = this.errorLogs.slice(0, this.maxLocalErrors)
    }

    // Save to localStorage
    this.saveErrorsToStorage()

    // Send to external service if configured
    if (this.config.endpoint) {
      this.sendToExternalService(logEntry)
    }

    console.group(`🚨 Error Logged: ${error.category.toUpperCase()}`)
    console.error('Error:', error)
    console.error('Log Entry:', logEntry)
    console.groupEnd()

    return errorId
  }

  // Generate a unique error ID
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Send error to external service
  private async sendToExternalService(logEntry: ErrorLogEntry) {
    if (!this.config.endpoint || !this.config.apiKey) {
      return
    }

    try {
      const payload = {
        ...logEntry,
        environment: this.config.environment,
        version: this.config.version,
        tags: this.config.tags
      }

      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey
        },
        body: JSON.stringify(payload)
      })
    } catch (err) {
      console.error('Failed to send error to external service:', err)
    }
  }

  // Get all logged errors
  getErrors(filter?: ErrorFilterOptions): ErrorLogEntry[] {
    let filteredErrors = [...this.errorLogs]

    if (filter) {
      if (filter.severity && filter.severity.length > 0) {
        filteredErrors = filteredErrors.filter(log => 
          filter.severity!.includes(log.error.severity)
        )
      }

      if (filter.category && filter.category.length > 0) {
        filteredErrors = filteredErrors.filter(log => 
          filter.category!.includes(log.error.category)
        )
      }

      if (filter.dateRange) {
        filteredErrors = filteredErrors.filter(log => 
          log.timestamp >= filter.dateRange!.start && 
          log.timestamp <= filter.dateRange!.end
        )
      }

      if (filter.resolved !== undefined) {
        filteredErrors = filteredErrors.filter(log => 
          log.resolved === filter.resolved
        )
      }

      if (filter.userId) {
        filteredErrors = filteredErrors.filter(log => 
          log.userId === filter.userId
        )
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        filteredErrors = filteredErrors.filter(log => 
          log.error.message.toLowerCase().includes(searchLower) ||
          log.error.code?.toLowerCase().includes(searchLower) ||
          log.error.userMessage.toLowerCase().includes(searchLower)
        )
      }
    }

    return filteredErrors
  }

  // Get error aggregation data
  getErrorAggregation(filter?: ErrorFilterOptions): ErrorAggregation {
    const errors = this.getErrors(filter)
    
    const errorsByCategory = errors.reduce((acc, log) => {
      acc[log.error.category] = (acc[log.error.category] || 0) + 1
      return acc
    }, {} as Record<ErrorCategory, number>)

    const errorsBySeverity = errors.reduce((acc, log) => {
      acc[log.error.severity] = (acc[log.error.severity] || 0) + 1
      return acc
    }, {} as Record<ErrorSeverity, number>)

    // Group errors by date
    const errorsByDate = errors.reduce((acc, log) => {
      const date = log.timestamp.toISOString().split('T')[0]
      if (date) {
        acc[date] = (acc[date] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const errorsOverTime = Object.entries(errorsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Find top errors
    const errorCounts = errors.reduce((acc, log) => {
      const key = log.error.message
      if (!acc[key]) {
        acc[key] = {
          message: log.error.message,
          count: 0,
          category: log.error.category
        }
      }
      acc[key].count++
      return acc
    }, {} as Record<string, { message: string; count: number; category: ErrorCategory }>)

    const topErrors = Object.values(errorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalErrors: errors.length,
      errorsByCategory,
      errorsBySeverity,
      errorsOverTime,
      topErrors
    }
  }

  // Mark an error as resolved
  resolveError(errorId: string, resolvedBy?: string): boolean {
    const errorLog = this.errorLogs.find(log => log.id === errorId)
    if (errorLog) {
      errorLog.resolved = true
      errorLog.resolvedAt = new Date()
      errorLog.resolvedBy = resolvedBy
      this.saveErrorsToStorage()
      return true
    }
    return false
  }

  // Clear all errors
  clearErrors(): void {
    this.errorLogs = []
    this.saveErrorsToStorage()
  }

  // Save errors to localStorage
  private saveErrorsToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const dataToSave = this.errorLogs.slice(0, 50) // Limit to 50 errors in localStorage
        window.localStorage.setItem('error_logs', JSON.stringify(dataToSave))
      } catch (err) {
        console.error('Failed to save errors to localStorage:', err)
      }
    }
  }

  // Load errors from localStorage
  private loadErrorsFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedErrors = window.localStorage.getItem('error_logs')
        if (savedErrors) {
          const parsedErrors = JSON.parse(savedErrors) as ErrorLogEntry[]
          this.errorLogs = parsedErrors.map(log => ({
            ...log,
            timestamp: new Date(log.timestamp),
            resolvedAt: log.resolvedAt ? new Date(log.resolvedAt) : undefined
          }))
        }
      } catch (err) {
        console.error('Failed to load errors from localStorage:', err)
      }
    }
  }

  // Export errors for analysis
  exportErrors(filter?: ErrorFilterOptions): string {
    const errors = this.getErrors(filter)
    return JSON.stringify(errors, null, 2)
  }

  // Update configuration
  updateConfig(newConfig: Partial<ErrorReportingConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.maxLocalErrors = this.config.maxErrors || 100
  }
}

// Create singleton instance
const errorLogger = new ErrorLogger({
  enabled: process.env.NODE_ENV === 'production',
  environment: process.env.NODE_ENV as any || 'development',
  endpoint: process.env.NEXT_PUBLIC_ERROR_ENDPOINT,
  apiKey: process.env.NEXT_PUBLIC_ERROR_API_KEY,
  sampleRate: 1.0,
  maxErrors: 100
})

export default errorLogger

// Convenience functions
export const logError = (error: AppError, additionalContext?: Record<string, any>) => {
  return errorLogger.logError(error, additionalContext)
}

export const getErrors = (filter?: ErrorFilterOptions) => {
  return errorLogger.getErrors(filter)
}

export const getErrorAggregation = (filter?: ErrorFilterOptions) => {
  return errorLogger.getErrorAggregation(filter)
}

export const resolveError = (errorId: string, resolvedBy?: string) => {
  return errorLogger.resolveError(errorId, resolvedBy)
}

export const clearErrors = () => {
  return errorLogger.clearErrors()
}

export const exportErrors = (filter?: ErrorFilterOptions) => {
  return errorLogger.exportErrors(filter)
}