import { NextRequest, NextResponse } from 'next/server'
import { processAllPendingRetries } from '@/lib/retry-service'

// GET /api/cron/retry-failed-invoices - Process all pending retries (called by cron job)
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (for security)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'dev-secret-change-in-production'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Starting automatic retry job...')

    // Process all pending retries
    const result = await processAllPendingRetries()

    console.log(`✅ Retry job complete:`, result)

    return NextResponse.json({
      message: 'Retry job completed',
      ...result
    })
  } catch (error: any) {
    console.error('Error in retry cron job:', error)
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
