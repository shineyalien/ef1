import { NextRequest, NextResponse } from 'next/server'
import { PRALAPIClient } from '@/lib/fbr-pral-client'

/**
 * Test endpoint for FBR API integration
 * Used to verify FBR connectivity and authentication
 */
export async function POST(request: NextRequest) {
  try {
    const { token, environment = 'sandbox' } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'FBR token is required' },
        { status: 400 }
      )
    }

    // Initialize PRAL client with provided token
    const client = new PRALAPIClient({
      environment,
      bearerToken: token
    })

    // Test basic connectivity by fetching provinces
    const provincesResult = await client.getLookupData('provinces')
    
    if (!provincesResult.success) {
      return NextResponse.json(
        { 
          error: 'Failed to connect to FBR API',
          details: provincesResult.error
        },
        { status: 500 }
      )
    }

    // Test tax rates endpoint
    const taxRatesResult = await client.getTaxRates({
      date: '24-Feb-2024',
      transTypeId: 18,
      originationSupplier: 1
    })

    // Test STATL endpoint
    const statlResult = await client.checkSTATL({
      regno: '1234567',
      date: '2025-01-01'
    })

    return NextResponse.json({
      success: true,
      message: 'FBR API integration test successful',
      environment,
      results: {
        provinces: {
          success: provincesResult.success,
          count: provincesResult.data?.length || 0,
          sample: provincesResult.data?.slice(0, 3) || []
        },
        taxRates: {
          success: taxRatesResult.success,
          count: taxRatesResult.data?.length || 0,
          sample: taxRatesResult.data?.slice(0, 3) || []
        },
        statl: {
          success: !!statlResult,
          data: statlResult || null
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('FBR integration test error:', error)
    
    return NextResponse.json(
      { 
        error: 'FBR integration test failed',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint for test information
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/test/fbr-integration',
    method: 'POST',
    description: 'Test FBR API integration and connectivity',
    requiredFields: ['token'],
    optionalFields: ['environment'],
    exampleRequest: {
      token: 'your-fbr-bearer-token',
      environment: 'sandbox'
    },
    tests: [
      'Provinces lookup',
      'Tax rates lookup',
      'STATL verification'
    ]
  })
}