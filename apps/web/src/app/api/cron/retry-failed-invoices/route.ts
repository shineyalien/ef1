import { NextRequest, NextResponse } from 'next/server'
import { processAllPendingRetries, cleanupStuckRetryLocks } from '@/lib/retry-service'
import crypto from 'crypto'

// Enhanced security functions
function verifyCronSecret(request: NextRequest): { success: boolean; error?: string } {
  // Check for Bearer token in Authorization header
  const authHeader = request.headers.get('authorization')
  
  // Check for X-Cron-Secret header as alternative
  const cronSecretHeader = request.headers.get('x-cron-secret')
  
  // Get the configured secret
  const cronSecret = process.env.CRON_SECRET
  
  // Ensure secret is configured and not the default weak one
  if (!cronSecret || cronSecret === 'dev-secret-change-in-production') {
    return {
      success: false,
      error: 'Cron secret not properly configured'
    }
  }
  
  // Verify secret from either header
  const providedSecret = authHeader?.replace('Bearer ', '') || cronSecretHeader
  
  if (!providedSecret) {
    return {
      success: false,
      error: 'No authentication token provided'
    }
  }
  
  // Use constant-time comparison to prevent timing attacks
  try {
    const expectedBuffer = Buffer.from(cronSecret, 'utf8')
    const providedBuffer = Buffer.from(providedSecret, 'utf8')
    
    if (expectedBuffer.length !== providedBuffer.length) {
      return {
        success: false,
        error: 'Invalid authentication token'
      }
    }
    
    // Constant-time comparison
    let result = 0
    for (let i = 0; i < expectedBuffer.length; i++) {
      result |= (expectedBuffer[i] ?? 0) ^ (providedBuffer[i] ?? 0)
    }
    
    if (result !== 0) {
      return {
        success: false,
        error: 'Invalid authentication token'
      }
    }
    
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: 'Authentication verification failed'
    }
  }
}

function logSecurityEvent(event: string, details: any, request: NextRequest) {
  const timestamp = new Date().toISOString()
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  console.warn(`🔒 Security Event [${timestamp}]:`, {
    event,
    ip,
    userAgent: userAgent.substring(0, 100), // Limit length
    ...details
  })
}

// Rate limiting for cron endpoint (prevent abuse)
const cronExecutions: Map<string, number[]> = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5 // Max 5 requests per minute

function checkRateLimit(request: NextRequest): { success: boolean; error?: string } {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown'
  
  const now = Date.now()
  const executions = cronExecutions.get(ip) || []
  
  // Filter out old executions outside the window
  const recentExecutions = executions.filter((time: number) => now - time < RATE_LIMIT_WINDOW)
  
  // Check if limit exceeded
  if (recentExecutions.length >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      success: false,
      error: 'Rate limit exceeded'
    }
  }
  
  // Add current execution
  recentExecutions.push(now)
  cronExecutions.set(ip, recentExecutions)
  
  return { success: true }
}

// GET /api/cron/retry-failed-invoices - Process all pending retries (called by cron job)
export async function GET(request: NextRequest) {
  try {
    // Check rate limit first
    const rateLimitResult = checkRateLimit(request)
    if (!rateLimitResult.success) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip: request.headers.get('x-forwarded-for') }, request)
      return NextResponse.json({ error: rateLimitResult.error }, { status: 429 })
    }
    
    // Verify cron secret with enhanced security
    const authResult = verifyCronSecret(request)
    if (!authResult.success) {
      logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', {
        error: authResult.error,
        hasAuthHeader: !!request.headers.get('authorization'),
        hasCronHeader: !!request.headers.get('x-cron-secret')
      }, request)
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    console.log('🔄 Starting automatic retry job...')

    // Clean up any stuck retry locks first
    await cleanupStuckRetryLocks()

    // Process all pending retries
    const result = await processAllPendingRetries()

    console.log(`✅ Retry job complete:`, {
      processed: result.processed,
      succeeded: result.succeeded,
      failed: result.failed,
      errorCount: result.errors.length
    })

    // Log detailed errors if any
    if (result.errors.length > 0) {
      console.error('❌ Retry errors:', result.errors)
    }

    return NextResponse.json({
      message: 'Retry job completed',
      processed: result.processed,
      succeeded: result.succeeded,
      failed: result.failed,
      errors: result.errors
    })
  } catch (error: any) {
    console.error('Error in retry cron job:', error)
    logSecurityEvent('CRON_JOB_ERROR', {
      error: error.message,
      stack: error.stack?.substring(0, 500) // Limit stack trace length
    }, request)
    return NextResponse.json({
      error: 'Failed to process retries',
      details: error.message
    }, { status: 500 })
  }
}

// Allow POST as well for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}
