import { AppError } from '@/components/error-boundary'

interface ErrorLoggerConfig {
  enabled?: boolean
  endpoint?: string
  apiKey?: string
  environment?: 'development' | 'production' | 'test'
}

interface ErrorContext {
  componentStack?: string
  global?: boolean
  [key: string]: any
}

class ErrorLogger {
  private config: ErrorLoggerConfig = {
    enabled: true,
    environment: 'development'
  }

  private errors: AppError[] = []

  updateConfig(newConfig: Partial<ErrorLoggerConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  logError(error: AppError | Error, context?: ErrorContext): string {
    const errorId = this.generateErrorId()
    
    const appError: AppError = error instanceof Error 
      ? {
          message: error.message,
          severity: 'medium' as any,
          category: 'unknown' as any,
          timestamp: new Date(),
          recoverable: true,
          userMessage: 'An error occurred. Please try again.',
          code: 'UNKNOWN_ERROR',
          context
        }
      : error

    // Add to local storage
    this.errors.push(appError)

    // Log to console
    if (this.config.enabled) {
      console.group(`🚨 Error Logged: ${appError.category?.toUpperCase()}`)
      console.error('Error:', appError)
      if (context) {
        console.error('Context:', context)
      }
      console.groupEnd()
    }

    // In production, send to error reporting service
    if (this.config.environment === 'production' && this.config.endpoint) {
      this.sendToService(appError, context)
    }

    return errorId
  }

  getErrorAggregation() {
    const aggregation = this.errors.reduce((acc, error) => {
      const key = `${error.category}-${error.severity}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: this.errors.length,
      byCategoryAndSeverity: aggregation,
      recentErrors: this.errors.slice(-10)
    }
  }

  exportErrors() {
    return {
      errors: this.errors,
      exportedAt: new Date().toISOString(),
      total: this.errors.length
    }
  }

  clearErrors() {
    this.errors = []
  }

  private generateErrorId(): string {
    return `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private sendToService(error: AppError, context?: ErrorContext) {
    // This would integrate with services like Sentry, LogRocket, etc.
    if (this.config.endpoint && this.config.apiKey) {
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          error,
          context,
          timestamp: new Date().toISOString(),
          environment: this.config.environment
        })
      }).catch(err => {
        console.error('Failed to send error to service:', err)
      })
    }
  }
}

const errorLogger = new ErrorLogger()
export default errorLogger