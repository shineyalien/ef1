import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

const FBR_BASE_URL = process.env.FBR_API_BASE_URL || 'https://gw.fbr.gov.pk'

/**
 * POST /api/settings/fbr/test-connection
 * Test FBR Bearer Token connection
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { token, environment } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Test connection by fetching provinces (lightweight endpoint)
    const testEndpoint = '/pdi/v1/provinces'
    const url = `${FBR_BASE_URL}${testEndpoint}`

    console.log(`🧪 Testing FBR connection: ${environment} environment`)
    console.log(`📡 Endpoint: ${url}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ FBR API Error (${response.status}):`, errorText)
      
      let errorMessage = 'Connection failed'
      if (response.status === 401) {
        errorMessage = 'Invalid token - Authentication failed'
      } else if (response.status === 403) {
        errorMessage = 'Token does not have required permissions'
      } else if (response.status === 500) {
        errorMessage = 'FBR server error - Try again later'
      } else {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }

      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          statusCode: response.status
        },
        { status: 200 } // Return 200 so frontend can handle error message
      )
    }

    const data = await response.json()
    const recordCount = Array.isArray(data) ? data.length : 0

    console.log(`✅ FBR Connection Test Successful: ${recordCount} records fetched`)

    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      recordCount,
      endpoint: testEndpoint,
      environment
    })

  } catch (error) {
    console.error('❌ Test connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 200 } // Return 200 so frontend can display error
    )
  }
}
