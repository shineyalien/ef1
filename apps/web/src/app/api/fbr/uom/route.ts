import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PRALAPIClient } from '@/lib/fbr-integration'

// Error response helper
function createErrorResponse(
  message: string,
  code: string,
  status: number = 500,
  details?: any
) {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code,
      details,
      timestamp: new Date().toISOString()
    }
  }, { status })
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Authentication check
    const session = await auth()
    if (!session?.user?.email) {
      return createErrorResponse(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100')

    console.log('🔍 Fetching UOM:', { search, limit })

    try {
      // Initialize FBR API client
      const fbrClient = new PRALAPIClient()
      
      // Fetch UOM from FBR API
      const uomData = await fbrClient.getUnitOfMeasurements()
      
      // Filter if search term provided
      let filteredUOM = uomData
      if (search) {
        const searchLower = search.toLowerCase()
        filteredUOM = uomData.filter(uom => 
          uom.description?.toLowerCase().includes(searchLower) ||
          uom.uoM_ID?.toString().includes(searchLower)
        )
      }
      
      // Limit results
      const limitedUOM = filteredUOM.slice(0, limit)
      
      console.log(`✅ Retrieved ${limitedUOM.length} UOM from FBR API`)

      return NextResponse.json({
        success: true,
        data: limitedUOM,
        metadata: {
          count: limitedUOM.length,
          totalAvailable: uomData.length,
          search,
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      })

    } catch (fbrError) {
      console.error('FBR API Error:', fbrError)
      
      // Return mock data as fallback
      const mockUOM = [
        { uoM_ID: 1, description: 'Number' },
        { uoM_ID: 2, description: 'Kilogram' },
        { uoM_ID: 3, description: 'Gram' },
        { uoM_ID: 4, description: 'Metric Tonne' },
        { uoM_ID: 5, description: 'Litre' },
        { uoM_ID: 6, description: 'Millilitre' },
        { uoM_ID: 7, description: 'Square Metre' },
        { uoM_ID: 8, description: 'Cubic Metre' },
        { uoM_ID: 9, description: 'Metre' },
        { uoM_ID: 10, description: 'Centimetre' },
        { uoM_ID: 11, description: 'Pair' },
        { uoM_ID: 12, description: 'Dozen' },
        { uoM_ID: 13, description: 'Gross' },
        { uoM_ID: 14, description: 'Pack' },
        { uoM_ID: 15, description: 'Box' },
        { uoM_ID: 16, description: 'Carton' },
        { uoM_ID: 17, description: 'Bag' },
        { uoM_ID: 18, description: 'Bottle' },
        { uoM_ID: 19, description: 'Jar' },
        { uoM_ID: 20, description: 'Can' }
      ]
      
      // Filter mock data if search term provided
      let filteredMockUOM = mockUOM
      if (search) {
        const searchLower = search.toLowerCase()
        filteredMockUOM = mockUOM.filter(uom => 
          uom.description?.toLowerCase().includes(searchLower) ||
          uom.uoM_ID?.toString().includes(searchLower)
        )
      }
      
      console.log(`⚠️ Using mock UOM: ${filteredMockUOM.length} results`)

      return NextResponse.json({
        success: true,
        data: filteredMockUOM,
        metadata: {
          count: filteredMockUOM.length,
          totalAvailable: mockUOM.length,
          search,
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          source: 'mock'
        }
      })
    }

  } catch (error) {
    console.error('❌ UOM API Error:', error)
    return createErrorResponse(
      'An unexpected error occurred while fetching UOM',
      'UNEXPECTED_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}