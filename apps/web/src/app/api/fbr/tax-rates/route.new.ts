import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

// FBR PRAL API Configuration
const FBR_BASE_URL = process.env.FBR_API_BASE_URL || 'https://gw.fbr.gov.pk'

/**
 * Fetch tax rates from FBR PRAL API
 * Endpoint: /pdi/v2/SaleTypeToRate
 * Query params: date, transTypeId, originationSupplier (province ID)
 */
async function fetchTaxRatesFromFBR(
  bearerToken: string,
  date: string,
  transTypeId: number,
  provinceId: number
): Promise<any[]> {
  const endpoint = '/pdi/v2/SaleTypeToRate'
  const url = `${FBR_BASE_URL}${endpoint}?date=${date}&transTypeId=${transTypeId}&originationSupplier=${provinceId}`
  
  console.log(`📡 Fetching tax rates from FBR: ${url}`)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ FBR Tax Rate API Error (${response.status}):`, errorText)
      throw new Error(`FBR API Error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log(`✅ FBR Tax Rates Response:`, Array.isArray(data) ? `${data.length} rates` : 'N/A')
    
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(`❌ Failed to fetch tax rates from FBR:`, error)
    throw error
  }
}

/**
 * Cache tax rate data
 */
async function cacheTaxRate(data: {
  rateId: number
  rate: number
  description: string
  hsCode?: string
  transTypeId: number
  provinceId: number
  date: string
}) {
  try {
    await prisma.fBRTaxRate.upsert({
      where: {
        rateId_transTypeId_provinceId: {
          rateId: data.rateId,
          transTypeId: data.transTypeId,
          provinceId: data.provinceId
        }
      },
      update: {
        rate: data.rate,
        description: data.description,
        hsCode: data.hsCode,
        updatedAt: new Date()
      },
      create: {
        rateId: data.rateId,
        rate: data.rate,
        description: data.description,
        hsCode: data.hsCode,
        transTypeId: data.transTypeId,
        provinceId: data.provinceId,
        lastFetchDate: new Date(data.date)
      }
    })
    console.log(`✅ Cached tax rate: ${data.rate}% (Rate ID: ${data.rateId})`)
  } catch (error) {
    console.error(`❌ Failed to cache tax rate:`, error)
  }
}

/**
 * GET /api/fbr/tax-rates
 * Fetch all tax rates for given parameters
 */
export async function GET(request: NextRequest) {
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
        integrationMode: true,
        province: true
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Business profile not found' },
        { status: 404 }
      )
    }

    const bearerToken = business.integrationMode === 'production' 
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
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const transTypeId = parseInt(searchParams.get('transTypeId') || '1')
    const provinceId = parseInt(searchParams.get('provinceId') || '1')

    // Fetch tax rates from FBR
    const taxRates = await fetchTaxRatesFromFBR(bearerToken, date, transTypeId, provinceId)

    // Cache the results
    for (const rate of taxRates) {
      await cacheTaxRate({
        rateId: rate.ratE_ID || rate.rateId,
        rate: rate.ratE_VALUE || rate.rate || 18,
        description: rate.ratE_DESC || rate.description || 'Standard rate',
        transTypeId,
        provinceId,
        date
      })
    }

    return NextResponse.json({
      success: true,
      data: taxRates.map((rate: any) => ({
        rateId: rate.ratE_ID || rate.rateId,
        rate: rate.ratE_VALUE || rate.rate,
        description: rate.ratE_DESC || rate.description
      }))
    })

  } catch (error) {
    console.error('❌ FBR Tax Rates API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch tax rates',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/fbr/tax-rates
 * Calculate tax rate for a specific product
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

    const body = await request.json()
    const { date, transTypeId, provinceId, hsCode } = body

    console.log('🎯 Single Tax Rate Request:', {
      date,
      transTypeId,
      provinceId,
      hsCode
    })

    if (!date || !transTypeId || !provinceId) {
      return NextResponse.json(
        { error: 'Missing required parameters: date, transTypeId, provinceId' },
        { status: 400 }
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

    const bearerToken = business.integrationMode === 'production' 
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

    // Check cache first
    const cachedRate = await prisma.fBRTaxRate.findFirst({
      where: {
        transTypeId: parseInt(transTypeId),
        provinceId: parseInt(provinceId),
        hsCode: hsCode || null,
        lastFetchDate: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within last 24 hours
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    if (cachedRate) {
      console.log(`✅ Using cached tax rate: ${cachedRate.rate}%`)
      return NextResponse.json({
        success: true,
        rateId: cachedRate.rateId,
        rate: cachedRate.rate,
        rateDescription: cachedRate.description
      })
    }

    // Fetch from FBR if not cached
    const taxRates = await fetchTaxRatesFromFBR(
      bearerToken,
      date,
      parseInt(transTypeId),
      parseInt(provinceId)
    )

    if (taxRates.length === 0) {
      return NextResponse.json(
        { 
          error: 'No tax rates found',
          message: 'FBR returned no tax rates for the given parameters'
        },
        { status: 404 }
      )
    }

    // Use the first rate (usually the standard rate)
    const selectedRate = taxRates[0]
    const rateValue = selectedRate.ratE_VALUE || selectedRate.rate || 18

    // Cache the result
    await cacheTaxRate({
      rateId: selectedRate.ratE_ID || Math.floor(Math.random() * 10000),
      rate: rateValue,
      description: selectedRate.ratE_DESC || selectedRate.description || `${rateValue}% standard rate`,
      hsCode: hsCode || undefined,
      transTypeId: parseInt(transTypeId),
      provinceId: parseInt(provinceId),
      date
    })

    // Get transaction type description
    const transType = await prisma.fBRTransactionType.findUnique({
      where: { transTypeId: parseInt(transTypeId) }
    })

    console.log('✅ Single Tax Rate Response:', {
      rateId: selectedRate.ratE_ID,
      rate: rateValue,
      rateDescription: `${rateValue}% sales tax - ${transType?.transTypeDesc || 'Unknown'}`
    })

    return NextResponse.json({
      success: true,
      rateId: selectedRate.ratE_ID || 0,
      rate: rateValue,
      rateDescription: `${rateValue}% sales tax - ${transType?.transTypeDesc || 'Standard rate'}`
    })

  } catch (error) {
    console.error('❌ FBR Tax Rate Calculation Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to calculate tax rate',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
