import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'
import { PRALAPIClient } from '@/lib/fbr-pral-client'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { token, environment } = body

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    if (!environment || !['sandbox', 'production'].includes(environment)) {
      return NextResponse.json({ error: 'Invalid environment' }, { status: 400 })
    }

    // Get business
    const business = await getAuthenticatedBusiness()

    // Initialize PRAL client with the provided token
    const pralClient = new PRALAPIClient({
      bearerToken: token,
      environment: environment as 'sandbox' | 'production'
    })

    // Test connection by fetching provinces (lightweight API call)
    try {
      const response = await pralClient.getLookupData('provinces')
      
      if (!response || !response.data || response.data.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Invalid token or API error',
          message: 'Failed to connect to FBR servers. Please check your token.'
        }, { status: 400 })
      }

      // Token is valid
      return NextResponse.json({
        success: true,
        message: `Successfully connected to FBR ${environment} environment`,
        details: {
          environment,
          provincesCount: response.data.length,
          timestamp: new Date().toISOString()
        }
      })

    } catch (apiError: any) {
      console.error(`FBR ${environment} validation error:`, apiError)
      
      return NextResponse.json({
        success: false,
        error: 'Connection failed',
        message: apiError.message || `Failed to connect to FBR ${environment} servers`,
        details: {
          statusCode: apiError.response?.status,
          errorCode: apiError.code
        }
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
