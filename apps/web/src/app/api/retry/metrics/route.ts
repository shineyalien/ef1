import { NextRequest, NextResponse } from 'next/server'
import { retryMonitoring } from '@/lib/retry-monitoring'

// GET /api/retry/metrics - Get retry metrics
export async function GET(request: NextRequest) {
  try {
    // Get metrics
    const metrics = await retryMonitoring.getRetryMetrics()
    
    // Get performance report for the last 7 days
    const performanceReport = await retryMonitoring.getRetryPerformanceReport(7)
    
    return NextResponse.json({
      metrics,
      performanceReport,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Error getting retry metrics:', error)
    return NextResponse.json({
      error: 'Failed to get retry metrics',
      details: error.message
    }, { status: 500 })
  }
}