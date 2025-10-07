import { NextRequest, NextResponse } from 'next/server'
import { PRALAPIClient } from '@/lib/fbr-pral-client'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'

/**
 * FBR API Testing Endpoint
 * Tests all PRAL API endpoints to verify integration
 */
export async function POST(request: NextRequest) {
  try {
    const business = await getAuthenticatedBusiness()
    
    // Get Bearer token from business
    const token = business.integrationMode === 'PRODUCTION' 
      ? business.productionToken 
      : business.sandboxToken

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No FBR token configured. Please add your token in Settings → FBR.'
      }, { status: 400 })
    }

    const body = await request.json()
    const { endpoint, params } = body

    const pralClient = new PRALAPIClient({
      environment: business.integrationMode === 'PRODUCTION' ? 'production' : 'sandbox',
      bearerToken: token
    })

    let result: any

    switch (endpoint) {
      // Public lookup endpoints (no authentication required)
      case 'provinces':
        result = await pralClient.getLookupData('provinces')
        break

      case 'documentTypes':
        result = await pralClient.getLookupData('documentTypes')
        break

      case 'hsCodes':
        result = await pralClient.getLookupData('hsCodes')
        break

      case 'sroItems':
        result = await pralClient.getLookupData('sroItems')
        break

      case 'transactionTypes':
        result = await pralClient.getLookupData('transactionTypes')
        break

      case 'uom':
        result = await pralClient.getLookupData('uom')
        break

      // Parameterized endpoints
      case 'taxRates':
        if (!params?.date || !params?.transTypeId || !params?.originationSupplier) {
          return NextResponse.json({
            success: false,
            error: 'Missing required parameters: date, transTypeId, originationSupplier'
          }, { status: 400 })
        }
        result = await pralClient.getTaxRates(params)
        break

      case 'sroSchedule':
        if (!params?.rateId || !params?.date || !params?.originationSupplier) {
          return NextResponse.json({
            success: false,
            error: 'Missing required parameters: rateId, date, originationSupplier'
          }, { status: 400 })
        }
        result = await pralClient.getSROSchedule(params)
        break

      case 'hsCodeWithUOM':
        if (!params?.hsCode || !params?.annexureId) {
          return NextResponse.json({
            success: false,
            error: 'Missing required parameters: hsCode, annexureId'
          }, { status: 400 })
        }
        result = await pralClient.getHSCodeWithUOM(params)
        break

      case 'sroItem':
        if (!params?.date || !params?.sroId) {
          return NextResponse.json({
            success: false,
            error: 'Missing required parameters: date, sroId'
          }, { status: 400 })
        }
        result = await pralClient.getSROItem(params)
        break

      case 'statl':
        if (!params?.regno || !params?.date) {
          return NextResponse.json({
            success: false,
            error: 'Missing required parameters: regno, date'
          }, { status: 400 })
        }
        result = await pralClient.checkSTATL(params)
        break

      case 'registrationType':
        if (!params?.registrationNo) {
          return NextResponse.json({
            success: false,
            error: 'Missing required parameter: registrationNo'
          }, { status: 400 })
        }
        result = await pralClient.getRegistrationType(params.registrationNo)
        break

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown endpoint: ${endpoint}`
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      endpoint,
      params,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('FBR API Test Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to test FBR API',
      details: error.toString()
    }, { status: 500 })
  }
}

/**
 * GET endpoint to list available test endpoints
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'FBR API Test Endpoint',
    availableEndpoints: {
      lookup: [
        'provinces',
        'documentTypes',
        'hsCodes',
        'sroItems',
        'transactionTypes',
        'uom'
      ],
      parameterized: [
        {
          name: 'taxRates',
          params: { date: 'DD-MMM-YYYY', transTypeId: 'number', originationSupplier: 'number' },
          example: { date: '24-Feb-2024', transTypeId: 18, originationSupplier: 1 }
        },
        {
          name: 'sroSchedule',
          params: { rateId: 'number', date: 'DD-MMM-YYYY', originationSupplier: 'number' },
          example: { rateId: 413, date: '04-Feb-2024', originationSupplier: 1 }
        },
        {
          name: 'hsCodeWithUOM',
          params: { hsCode: 'string', annexureId: 'number' },
          example: { hsCode: '5904.9000', annexureId: 3 }
        },
        {
          name: 'sroItem',
          params: { date: 'YYYY-MM-DD', sroId: 'number' },
          example: { date: '2025-03-25', sroId: 389 }
        },
        {
          name: 'statl',
          params: { regno: 'string', date: 'YYYY-MM-DD' },
          example: { regno: '0788762', date: '2025-05-18' }
        },
        {
          name: 'registrationType',
          params: { registrationNo: 'string' },
          example: { registrationNo: '0788762' }
        }
      ]
    },
    usage: {
      method: 'POST',
      body: {
        endpoint: 'provinces | documentTypes | taxRates | ...',
        params: { /* required parameters based on endpoint */ }
      }
    }
  })
}
