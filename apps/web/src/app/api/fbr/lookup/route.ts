import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

// FBR PRAL API Configuration
const FBR_BASE_URL = process.env.FBR_API_BASE_URL || 'https://gw.fbr.gov.pk'
const FBR_SANDBOX_URL = process.env.FBR_SANDBOX_BASE_URL || 'https://gw.fbr.gov.pk'

// FBR API Endpoints
const FBR_ENDPOINTS = {
  provinces: '/pdi/v1/provinces',
  documentTypes: '/pdi/v1/doctypecode',
  hsCodes: '/pdi/v1/itemdesccode',
  sroItems: '/pdi/v1/sroitemcode',
  transactionTypes: '/pdi/v1/transtypecode',
  uom: '/pdi/v1/uom',
  hsUom: '/pdi/v2/HS_UOM', // HS code specific UoM endpoint
  sroSchedule: '/pdi/v1/SroSchedule',
  taxRates: '/pdi/v2/SaleTypeToRate'
}

/**
 * Fetch data from FBR PRAL API with Bearer Token authentication
 */
async function fetchFromFBR(endpoint: string, bearerToken: string, queryParams?: Record<string, string>): Promise<any> {
  const baseUrl = FBR_BASE_URL
  let url = `${baseUrl}${endpoint}`
  
  if (queryParams) {
    const params = new URLSearchParams(queryParams)
    url += `?${params.toString()}`
  }
  
  console.log(`📡 Fetching from FBR: ${endpoint}`)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Disable caching for fresh data
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ FBR API Error (${response.status}):`, errorText)
      throw new Error(`FBR API Error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log(`✅ FBR Response: ${Array.isArray(data) ? data.length : 'N/A'} records`)
    
    return data
  } catch (error) {
    console.error(`❌ Failed to fetch from FBR:`, error)
    throw error
  }
}

/**
 * Cache management functions
 */
async function updateCache(lookupType: string, data: any[]) {
  try {
    // Clear existing cache data
    switch (lookupType) {
      case 'provinces':
        await prisma.fBRProvince.deleteMany()
        await prisma.fBRProvince.createMany({
          data: data.map(item => ({
            code: item.stateProvinceCode?.toString() || item.code,
            name: item.stateProvinceDesc || item.name,
            description: item.stateProvinceDesc || item.description || item.name
          }))
        })
        break
      
      case 'hscodes':
        await prisma.fBRHSCode.deleteMany()
        await prisma.fBRHSCode.createMany({
          data: data.map(item => ({
            code: item.hS_CODE || item.code,
            description: item.description
          }))
        })
        break
      
      case 'documentTypes':
        await prisma.fBRDocumentType.deleteMany()
        await prisma.fBRDocumentType.createMany({
          data: data.map(item => ({
            code: item.docTypeId?.toString() || item.code,
            description: item.docDescription || item.description
          }))
        })
        break
      
      case 'transactionTypes':
        // Store FBR transaction types in cache
        // FBR returns: transactioN_TYPE_ID and transactioN_DESC (weird casing!)
        await prisma.fBRTransactionType.deleteMany()
        await prisma.fBRTransactionType.createMany({
          data: data.map(item => ({
            transTypeId: item.transactioN_TYPE_ID || 0,
            transTypeDesc: item.transactioN_DESC || 'Unknown'
          }))
        })
        break
      
      case 'uom':
        await prisma.fBRUnitOfMeasurement.deleteMany()
        await prisma.fBRUnitOfMeasurement.createMany({
          data: data.map(item => ({
            code: item.uoM_ID?.toString() || item.code || '0',
            description: item.description || 'Unknown',
            // FBR may return hS_CODE or hsCode field
            hsCode: item.hS_CODE || item.hsCode || null
          }))
        })
        break
    }

    // Update cache metadata
    await prisma.fBRCacheMetadata.upsert({
      where: { lookupType },
      update: {
        lastSyncAt: new Date(),
        recordCount: data.length,
        syncStatus: 'success',
        errorMessage: null
      },
      create: {
        lookupType,
        lastSyncAt: new Date(),
        recordCount: data.length,
        syncStatus: 'success'
      }
    })

    console.log(`✅ Updated ${lookupType} cache with ${data.length} records`)
  } catch (error) {
    console.error(`❌ Failed to update ${lookupType} cache:`, error)
    
    // Update cache metadata with error
    await prisma.fBRCacheMetadata.upsert({
      where: { lookupType },
      update: {
        syncStatus: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      },
      create: {
        lookupType,
        lastSyncAt: new Date(),
        recordCount: 0,
        syncStatus: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}

async function getCachedData(lookupType: string, filter?: any) {
  try {
    switch (lookupType) {
      case 'provinces':
        return await prisma.fBRProvince.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' }
        })
      
      case 'hscodes':
        return await prisma.fBRHSCode.findMany({
          where: { isActive: true },
          orderBy: { code: 'asc' }
        })
      
      case 'documentTypes':
        return await prisma.fBRDocumentType.findMany({
          where: { isActive: true },
          orderBy: { description: 'asc' }
        })
      
      case 'transactionTypes':
        return await prisma.fBRTransactionType.findMany({
          where: { isActive: true },
          orderBy: { transTypeId: 'asc' }
        })
      
      case 'uom':
        if (filter?.hsCode) {
          return await prisma.fBRUnitOfMeasurement.findMany({
            where: { 
              isActive: true,
              OR: [
                { hsCode: filter.hsCode },
                { hsCode: null } // Include generic UOMs
              ]
            },
            orderBy: { description: 'asc' }
          })
        }
        return await prisma.fBRUnitOfMeasurement.findMany({
          where: { isActive: true },
          orderBy: { description: 'asc' }
        })
      
      default:
        return []
    }
  } catch (error) {
    console.error(`❌ Failed to get cached data for ${lookupType}:`, error)
    return []
  }
}

/**
 * Check if cache is stale (older than 24 hours)
 */
async function isCacheStale(lookupType: string): Promise<boolean> {
  try {
    const metadata = await prisma.fBRCacheMetadata.findUnique({
      where: { lookupType }
    })
    
    if (!metadata || metadata.syncStatus === 'failed') {
      return true // No cache or failed sync, needs refresh
    }
    
    const hoursSinceSync = (Date.now() - metadata.lastSyncAt.getTime()) / (1000 * 60 * 60)
    return hoursSinceSync > 24 // Refresh if older than 24 hours
  } catch (error) {
    console.error(`❌ Error checking cache staleness:`, error)
    return true
  }
}

/**
 * Map lookup type to FBR endpoint key
 */
function mapLookupTypeToEndpoint(lookupType: string): keyof typeof FBR_ENDPOINTS | null {
  const mapping: Record<string, keyof typeof FBR_ENDPOINTS> = {
    'provinces': 'provinces',
    'hscodes': 'hsCodes',
    'hsCodes': 'hsCodes',
    'documentTypes': 'documentTypes',
    'transactionTypes': 'transactionTypes',
    'uom': 'uom',
    'sroItems': 'sroItems',
    'sroSchedule': 'sroSchedule',
    'taxRates': 'taxRates'
  }
  return mapping[lookupType] || null
}

/**
 * Sync FBR data to local cache
 */
async function syncFBRData(lookupType: string, bearerToken: string) {
  try {
    console.log(`🔄 Syncing ${lookupType} from FBR...`)
    
    const endpointKey = mapLookupTypeToEndpoint(lookupType)
    if (!endpointKey) {
      throw new Error(`Unknown lookup type: ${lookupType}`)
    }
    
    const endpoint = FBR_ENDPOINTS[endpointKey]
    const data = await fetchFromFBR(endpoint, bearerToken)
    
    // DEBUG: Log actual FBR response structure
    if (lookupType === 'transactionTypes' && data && data.length > 0) {
      console.log(`🔍 FBR Transaction Type Sample:`, JSON.stringify(data[0], null, 2))
    }
    
    await updateCache(lookupType, Array.isArray(data) ? data : [data])
    
    console.log(`✅ Successfully synced ${lookupType}`)
  } catch (error) {
    console.error(`❌ Failed to sync ${lookupType}:`, error)
    throw error
  }
}

/**
 * GET /api/fbr/lookup
 * Fetch FBR lookup data with caching
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's business profile to retrieve FBR token
    const business = await prisma.business.findFirst({
      where: { 
        user: { 
          email: session.user.email 
        } 
      },
      select: {
        sandboxToken: true,
        productionToken: true,
        integrationMode: true
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Business profile not found' },
        { status: 404 }
      )
    }

    // Determine which token to use based on integration mode
    const bearerToken = business.integrationMode === 'PRODUCTION' 
      ? business.productionToken 
      : business.sandboxToken

    if (!bearerToken) {
      return NextResponse.json(
        { 
          error: 'FBR token not configured',
          message: 'Please configure your FBR Bearer Token in business settings'
        },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const query = searchParams.get('query')
    const hsCode = searchParams.get('hsCode')

    // Handle HS Code search
    if (type === 'hsCodeSearch' && query) {
      // Check if cache needs refresh
      if (await isCacheStale('hscodes')) {
        await syncFBRData('hscodes', bearerToken)
      }

      const cachedHSCodes = await getCachedData('hscodes')
      const searchResults = cachedHSCodes.filter((hscode: any) => 
        hscode.code.toLowerCase().includes(query.toLowerCase()) ||
        hscode.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)

      return NextResponse.json({ 
        success: true,
        data: searchResults.map((h: any) => ({
          hS_CODE: h.code,
          description: h.description
        }))
      })
    }

    // Handle transaction types
    if (type === 'transactionTypes') {
      if (await isCacheStale('transactionTypes')) {
        await syncFBRData('transactionTypes', bearerToken)
      }

      const data = await getCachedData('transactionTypes')
      return NextResponse.json({ 
        success: true,
        data 
      })
    }

    // Handle all other lookup types
    if (type) {
      // Check if cache needs refresh
      if (await isCacheStale(type)) {
        await syncFBRData(type, bearerToken)
      }

      let data = await getCachedData(type, { hsCode })
      
      // Transform data to match expected format
      if (type === 'provinces') {
        data = data.map((p: any) => ({
          stateProvinceCode: parseInt(p.code) || 0,
          stateProvinceDesc: p.name
        }))
      } else if (type === 'hscodes') {
        data = data.map((h: any) => ({
          hS_CODE: h.code,
          description: h.description
        }))
      } else if (type === 'uom') {
        data = data.map((u: any) => ({
          uoM_ID: parseInt(u.code) || 0,
          description: u.description
        }))
      } else if (type === 'documentTypes') {
        data = data.map((d: any) => ({
          docTypeId: parseInt(d.code) || 0,
          docDescription: d.description
        }))
      }

      return NextResponse.json({ 
        success: true,
        data 
      })
    }

    return NextResponse.json(
      { error: 'Missing required parameter: type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ FBR Lookup API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch FBR data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/fbr/lookup
 * Fetch UOMs for a specific HS Code with chaining
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's business profile to retrieve FBR token
    const business = await prisma.business.findFirst({
      where: { 
        user: { 
          email: session.user.email 
        } 
      },
      select: {
        sandboxToken: true,
        productionToken: true,
        integrationMode: true
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Business profile not found' },
        { status: 404 }
      )
    }

    const bearerToken = business.integrationMode === 'PRODUCTION' 
      ? business.productionToken 
      : business.sandboxToken

    if (!bearerToken) {
      return NextResponse.json(
        { 
          error: 'FBR token not configured',
          message: 'Please configure your FBR Bearer Token in business settings'
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { hsCode } = body

    if (!hsCode) {
      return NextResponse.json(
        { error: 'HS Code is required' },
        { status: 400 }
      )
    }

    // Fetch UoMs directly from FBR HS_UOM endpoint with HS code parameter
    console.log(`📡 Fetching UoMs for HS Code: ${hsCode}`)
    const uomEndpoint = `/pdi/v2/HS_UOM?hs_code=${hsCode}&annexure_id=3`
    
    try {
      const uomData = await fetchFromFBR(uomEndpoint, bearerToken)
      
      return NextResponse.json({
        success: true,
        data: Array.isArray(uomData) ? uomData.map((u: any) => ({
          uoM_ID: u.uoM_ID || u.uom_id || parseInt(u.code) || 0,
          description: u.description || u.uoM_DESC || 'Unknown'
        })) : []
      })
    } catch (error) {
      console.error(`❌ Failed to fetch UoMs for HS Code ${hsCode}:`, error)
      return NextResponse.json({
        success: true,
        data: [] // Return empty array instead of error to prevent UI breaking
      })
    }

  } catch (error) {
    console.error('❌ FBR Lookup POST Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch UOM data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
