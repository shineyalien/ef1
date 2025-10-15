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

    console.log('🔍 Fetching HS codes:', { search, limit })

    try {
      // Initialize FBR API client
      const fbrClient = new PRALAPIClient()
      
      // Fetch HS codes from FBR API
      const hsCodes = await fbrClient.getHSCodes()
      
      // Filter if search term provided
      let filteredCodes = hsCodes
      if (search) {
        const searchLower = search.toLowerCase()
        filteredCodes = hsCodes.filter(code =>
          code.hS_CODE?.toLowerCase().includes(searchLower) ||
          code.description?.toLowerCase().includes(searchLower)
        )
      }
      
      // Limit results
      const limitedCodes = filteredCodes.slice(0, limit)
      
      console.log(`✅ Retrieved ${limitedCodes.length} HS codes from FBR API`)

      return NextResponse.json({
        success: true,
        data: limitedCodes,
        metadata: {
          count: limitedCodes.length,
          totalAvailable: hsCodes.length,
          search,
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      })

    } catch (fbrError) {
      console.error('FBR API Error:', fbrError)
      
      // Return mock data as fallback
      const mockHSCodes = [
        { hsCode: '1006.3090', description: 'Rice' },
        { hsCode: '2501.0010', description: 'Salt' },
        { hsCode: '8432.1010', description: 'Agricultural machinery' },
        { hsCode: '8703.2300', description: 'Motor vehicles' },
        { hsCode: '8517.1300', description: 'Mobile phones' },
        { hsCode: '6203.4300', description: "Men's jackets" },
        { hsCode: '6403.1900', description: 'Footwear' },
        { hsCode: '7308.9000', description: 'Steel structures' },
        { hsCode: '8418.1000', description: 'Refrigerators' },
        { hsCode: '8471.3000', description: 'Computers' }
      ]
      
      // Filter mock data if search term provided
      let filteredMockCodes = mockHSCodes
      if (search) {
        const searchLower = search.toLowerCase()
        filteredMockCodes = mockHSCodes.filter(code => 
          code.hsCode?.toLowerCase().includes(searchLower) ||
          code.description?.toLowerCase().includes(searchLower)
        )
      }
      
      console.log(`⚠️ Using mock HS codes: ${filteredMockCodes.length} results`)

      return NextResponse.json({
        success: true,
        data: filteredMockCodes,
        metadata: {
          count: filteredMockCodes.length,
          totalAvailable: mockHSCodes.length,
          search,
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          source: 'mock'
        }
      })
    }

  } catch (error) {
    console.error('❌ HS Codes API Error:', error)
    return createErrorResponse(
      'An unexpected error occurred while fetching HS codes',
      'UNEXPECTED_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}