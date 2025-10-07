/**
 * Retry Mechanism Monitoring and Logging Service
 * 
 * Provides comprehensive logging and metrics collection for the FBR retry mechanism
 */

import { prisma } from '@/lib/database'
import { ErrorType } from './retry-service'

// Metrics interface
export interface RetryMetrics {
  totalProcessed: number
  totalSucceeded: number
  totalFailed: number
  successRate: number
  averageRetryAttempts: number
  errorDistribution: Record<ErrorType, number>
  queueSize: number
  oldestPendingRetry: Date | null
  stuckLocksCount: number
}

// Log entry interface
export interface RetryLogEntry {
  id: string
  timestamp: Date
  invoiceId: string
  invoiceNumber: string
  event: 'RETRY_ATTEMPT' | 'RETRY_SUCCESS' | 'RETRY_FAILURE' | 'RETRY_DISABLED' | 'LOCK_TIMEOUT'
  errorType?: ErrorType
  errorMessage?: string
  retryCount: number
  businessId: string
  processingTimeMs?: number
}

// Monitoring service class
export class RetryMonitoringService {
  private static instance: RetryMonitoringService
  private metrics: Map<string, any> = new Map()
  
  private constructor() {}
  
  static getInstance(): RetryMonitoringService {
    if (!this.instance) {
      this.instance = new RetryMonitoringService()
    }
    return this.instance
  }
  
  /**
   * Log a retry event with detailed information
   */
  async logRetryEvent(entry: Omit<RetryLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const logEntry: RetryLogEntry = {
      ...entry,
      id: `retry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    
    // Log to console with structured format
    console.log(`🔄 Retry Event [${logEntry.event}]:`, {
      invoiceId: logEntry.invoiceId,
      invoiceNumber: logEntry.invoiceNumber,
      retryCount: logEntry.retryCount,
      errorType: logEntry.errorType,
      processingTime: logEntry.processingTimeMs ? `${logEntry.processingTimeMs}ms` : undefined
    })
    
    // Store in database for persistence
    try {
      await this.persistLogEntry(logEntry)
    } catch (error) {
      console.error('Failed to persist retry log entry:', error)
    }
    
    // Update metrics
    this.updateMetrics(logEntry)
  }
  
  /**
   * Get current retry metrics
   */
  async getRetryMetrics(): Promise<RetryMetrics> {
    try {
      // Get queue statistics
      const queueStats = await prisma.$queryRaw<any[]>`
        SELECT 
          COUNT(*) as queue_size,
          MIN(next_retry_at) as oldest_pending_retry
        FROM invoices 
        WHERE 
          status = 'FAILED' 
          AND retry_enabled = true 
          AND retry_count < max_retries
          AND (next_retry_at IS NULL OR next_retry_at <= NOW())
      `
      
      // Get success/failure statistics from last 24 hours
      const stats = await prisma.$queryRaw<any[]>`
        SELECT 
          COUNT(*) as total_processed,
          COUNT(CASE WHEN status IN ('VALIDATED', 'PUBLISHED') THEN 1 END) as total_succeeded,
          COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as total_failed,
          AVG(retry_count) as avg_retry_attempts
        FROM invoices 
        WHERE last_retry_at >= NOW() - INTERVAL '24 hours'
          AND last_retry_at IS NOT NULL
      `
      
      // Get error distribution
      const errorStats = await prisma.$queryRaw<any[]>`
        SELECT 
          fbr_error_code,
          COUNT(*) as count
        FROM invoices 
        WHERE 
          status = 'FAILED' 
          AND fbr_error_code IS NOT NULL
          AND last_retry_at >= NOW() - INTERVAL '24 hours'
        GROUP BY fbr_error_code
        ORDER BY count DESC
      `
      
      // Get stuck locks count
      const stuckLocks = await prisma.$queryRaw<any[]>`
        SELECT COUNT(*) as count
        FROM invoices 
        WHERE 
          retry_processing = true 
          AND retry_processing_since < NOW() - INTERVAL '5 minutes'
      `
      
      const queueData = queueStats[0] || { queue_size: 0, oldest_pending_retry: null }
      const statsData = stats[0] || { 
        total_processed: 0, 
        total_succeeded: 0, 
        total_failed: 0, 
        avg_retry_attempts: 0 
      }
      const stuckLocksData = stuckLocks[0] || { count: 0 }
      
      // Categorize errors
      const errorDistribution: Record<ErrorType, number> = {
        [ErrorType.TRANSIENT]: 0,
        [ErrorType.PERMANENT]: 0,
        [ErrorType.TOKEN_EXPIRED]: 0,
        [ErrorType.VALIDATION]: 0,
        [ErrorType.NETWORK]: 0,
        [ErrorType.RATE_LIMIT]: 0,
        [ErrorType.UNKNOWN]: 0
      }
      
      errorStats.forEach((stat: any) => {
        const errorType = this.categorizeErrorCode(stat.fbr_error_code)
        errorDistribution[errorType] = Number(stat.count)
      })
      
      const totalProcessed = Number(statsData.total_processed) || 0
      const totalSucceeded = Number(statsData.total_succeeded) || 0
      const successRate = totalProcessed > 0 ? (totalSucceeded / totalProcessed) * 100 : 0
      
      return {
        totalProcessed,
        totalSucceeded,
        totalFailed: Number(statsData.total_failed) || 0,
        successRate: Math.round(successRate * 100) / 100,
        averageRetryAttempts: Number(statsData.avg_retry_attempts) || 0,
        errorDistribution,
        queueSize: Number(queueData.queue_size) || 0,
        oldestPendingRetry: queueData.oldest_pending_retry ? new Date(queueData.oldest_pending_retry) : null,
        stuckLocksCount: Number(stuckLocksData.count) || 0
      }
    } catch (error) {
      console.error('Error getting retry metrics:', error)
      return {
        totalProcessed: 0,
        totalSucceeded: 0,
        totalFailed: 0,
        successRate: 0,
        averageRetryAttempts: 0,
        errorDistribution: {
          [ErrorType.TRANSIENT]: 0,
          [ErrorType.PERMANENT]: 0,
          [ErrorType.TOKEN_EXPIRED]: 0,
          [ErrorType.VALIDATION]: 0,
          [ErrorType.NETWORK]: 0,
          [ErrorType.RATE_LIMIT]: 0,
          [ErrorType.UNKNOWN]: 0
        },
        queueSize: 0,
        oldestPendingRetry: null,
        stuckLocksCount: 0
      }
    }
  }
  
  /**
   * Get retry history for an invoice
   */
  async getInvoiceRetryHistory(invoiceId: string): Promise<RetryLogEntry[]> {
    try {
      // Get invoice information
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        select: {
          id: true,
          invoiceNumber: true,
          businessId: true,
          retryCount: true,
          lastRetryAt: true,
          fbrErrorCode: true,
          fbrErrorMessage: true,
          status: true,
          createdAt: true
        }
      })
      
      if (!invoice) {
        return []
      }
      
      // Create log entries from invoice data
      const entries: RetryLogEntry[] = []
      
      // Initial submission
      entries.push({
        id: `initial_${invoice.id}`,
        timestamp: invoice.createdAt,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        event: invoice.status === 'FAILED' ? 'RETRY_FAILURE' : 'RETRY_SUCCESS',
        retryCount: 0,
        businessId: invoice.businessId
      })
      
      // Retry attempts
      if (invoice.lastRetryAt && invoice.retryCount > 0) {
        entries.push({
          id: `retry_${invoice.id}`,
          timestamp: invoice.lastRetryAt,
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          event: invoice.status === 'FAILED' ? 'RETRY_FAILURE' : 'RETRY_SUCCESS',
          errorType: invoice.fbrErrorCode ? this.categorizeErrorCode(invoice.fbrErrorCode) : undefined,
          errorMessage: invoice.fbrErrorMessage || undefined,
          retryCount: invoice.retryCount,
          businessId: invoice.businessId
        })
      }
      
      return entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    } catch (error) {
      console.error('Error getting invoice retry history:', error)
      return []
    }
  }
  
  /**
   * Get retry performance report
   */
  async getRetryPerformanceReport(days: number = 7): Promise<any> {
    try {
      const report = await prisma.$queryRaw<any[]>`
        SELECT 
          DATE(last_retry_at) as date,
          COUNT(*) as total_retries,
          COUNT(CASE WHEN status IN ('VALIDATED', 'PUBLISHED') THEN 1 END) as successful_retries,
          COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_retries,
          AVG(retry_count) as avg_retry_count,
          COUNT(CASE WHEN fbr_error_code LIKE '%TIMEOUT%' OR fbr_error_code LIKE '%NETWORK%' THEN 1 END) as network_errors,
          COUNT(CASE WHEN fbr_error_code LIKE '%TOKEN%' OR fbr_error_code LIKE '%AUTH%' THEN 1 END) as auth_errors,
          COUNT(CASE WHEN fbr_error_code LIKE '%VALID%' OR fbr_error_code LIKE '%INVAL%' THEN 1 END) as validation_errors
        FROM invoices 
        WHERE last_retry_at >= NOW() - INTERVAL '${days} days'
          AND last_retry_at IS NOT NULL
        GROUP BY DATE(last_retry_at)
        ORDER BY date DESC
      `
      
      return report.map((row: any) => ({
        date: row.date,
        totalRetries: Number(row.total_retries),
        successfulRetries: Number(row.successful_retries),
        failedRetries: Number(row.failed_retries),
        successRate: Number(row.total_retries) > 0 
          ? (Number(row.successful_retries) / Number(row.total_retries)) * 100 
          : 0,
        averageRetryCount: Number(row.avg_retry_count) || 0,
        networkErrors: Number(row.network_errors),
        authErrors: Number(row.auth_errors),
        validationErrors: Number(row.validation_errors)
      }))
    } catch (error) {
      console.error('Error getting retry performance report:', error)
      return []
    }
  }
  
  /**
   * Persist log entry to database
   */
  private async persistLogEntry(entry: RetryLogEntry): Promise<void> {
    // In a real implementation, you might want to store these in a separate logs table
    // For now, we'll just log to console
    console.debug('Persisting retry log entry:', entry)
  }
  
  /**
   * Update in-memory metrics
   */
  private updateMetrics(entry: RetryLogEntry): void {
    const key = `${entry.event}_${entry.errorType || 'NONE'}`
    const current = this.metrics.get(key) || 0
    this.metrics.set(key, current + 1)
  }
  
  /**
   * Categorize error code into ErrorType
   */
  private categorizeErrorCode(errorCode: string): ErrorType {
    const code = errorCode?.toLowerCase() || ''
    
    if (code.includes('token') || code.includes('auth')) {
      return ErrorType.TOKEN_EXPIRED
    }
    
    if (code.includes('network') || code.includes('timeout') || code.includes('connection')) {
      return ErrorType.NETWORK
    }
    
    if (code.includes('rate') || code.includes('limit')) {
      return ErrorType.RATE_LIMIT
    }
    
    if (code.includes('valid') || code.includes('inval')) {
      return ErrorType.VALIDATION
    }
    
    if (code.startsWith('4') && !code.startsWith('429')) {
      return ErrorType.PERMANENT
    }
    
    return ErrorType.TRANSIENT
  }
}

// Export singleton instance
export const retryMonitoring = RetryMonitoringService.getInstance()

// Helper functions for common logging tasks
export async function logRetryAttempt(invoiceId: string, invoiceNumber: string, retryCount: number, businessId: string): Promise<void> {
  await retryMonitoring.logRetryEvent({
    invoiceId,
    invoiceNumber,
    event: 'RETRY_ATTEMPT',
    retryCount,
    businessId
  })
}

export async function logRetrySuccess(invoiceId: string, invoiceNumber: string, retryCount: number, businessId: string, processingTimeMs?: number): Promise<void> {
  await retryMonitoring.logRetryEvent({
    invoiceId,
    invoiceNumber,
    event: 'RETRY_SUCCESS',
    retryCount,
    businessId,
    processingTimeMs
  })
}

export async function logRetryFailure(invoiceId: string, invoiceNumber: string, retryCount: number, businessId: string, errorType: ErrorType, errorMessage: string): Promise<void> {
  await retryMonitoring.logRetryEvent({
    invoiceId,
    invoiceNumber,
    event: 'RETRY_FAILURE',
    errorType,
    errorMessage,
    retryCount,
    businessId
  })
}

export async function logRetryDisabled(invoiceId: string, invoiceNumber: string, retryCount: number, businessId: string): Promise<void> {
  await retryMonitoring.logRetryEvent({
    invoiceId,
    invoiceNumber,
    event: 'RETRY_DISABLED',
    retryCount,
    businessId
  })
}

export async function logLockTimeout(invoiceId: string, invoiceNumber: string, retryCount: number, businessId: string): Promise<void> {
  await retryMonitoring.logRetryEvent({
    invoiceId,
    invoiceNumber,
    event: 'LOCK_TIMEOUT',
    retryCount,
    businessId
  })
}