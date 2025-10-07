import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuthSession } from '@/lib/auth-helpers'

const prisma = new PrismaClient()

// Mock tax rate calculation logic - replace with real FBR PRAL API calls later
const MOCK_TAX_RATES = {
  // Standard rates by province and sale type
  standard: {
    'PB': { 'GSR': 18, 'GZR': 0, 'GER': 0 }, // Punjab
    'SD': { 'GSR': 18, 'GZR': 0, 'GER': 0 }, // Sindh
    'KP': { 'GSR': 17, 'GZR': 0, 'GER': 0 }, // KP
    'BL': { 'GSR': 16, 'GZR': 0, 'GER': 0 }, // Balochistan
    'GB': { 'GSR': 16, 'GZR': 0, 'GER': 0 }, // Gilgit-Baltistan
    'AK': { 'GSR': 16, 'GZR': 0, 'GER': 0 }, // Azad Kashmir
    'ICT': { 'GSR': 18, 'GZR': 0, 'GER': 0 } // Islamabad
  },
  // Special rates for specific HS codes
  special: {
    '1006.3090': { // Rice
      'PB': { 'GSR': 17, 'GZR': 0, 'GER': 0 },
      'SD': { 'GSR': 17, 'GZR': 0, 'GER': 0 }
    },
    '2501.0010': { // Salt
      'PB': { 'GSR': 8, 'GZR': 0, 'GER': 0 },
      'SD': { 'GSR': 8, 'GZR': 0, 'GER': 0 }
    }
  }
}

async function calculateTaxRate(params: {
  hsCode: string
  saleType: string
  sellerProvince: string
  buyerProvince: string
  scenarioId: string
}): Promise<{ rate: number; description: string }> {
  
  const { hsCode, saleType, sellerProvince, buyerProvince, scenarioId } = params
  
  console.log('🧮 Calculating tax rate:', params)
  
  // Check for cached tax rate first
  const cachedRate = await prisma.fBRTaxRate.findUnique({
    where: {
      hsCode_saleType_sellerProvince_buyerProvince_scenarioId: {
        hsCode,
        saleType,
        sellerProvince,
        buyerProvince,
        scenarioId
      }
    }
  })
  
  if (cachedRate) {
    console.log('📋 Using cached tax rate:', cachedRate.rate)
    return {
      rate: cachedRate.rate,
      description: cachedRate.description
    }
  }
  
  // Calculate tax rate using mock logic
  let rate = 0
  let description = ''
  
  // Special scenario handling
  if (scenarioId === 'SN003') { // Export Sales
    rate = 0
    description = 'Export sales - Zero rated'
  } else if (scenarioId === 'SN004') { // Zero Rated Sales
    rate = 0
    description = 'Zero rated sales'
  } else {
    // Check for special HS code rates
    const specialRates = MOCK_TAX_RATES.special[hsCode as keyof typeof MOCK_TAX_RATES.special]
    const provinceRates = specialRates?.[sellerProvince as keyof typeof specialRates] || 
                         MOCK_TAX_RATES.standard[sellerProvince as keyof typeof MOCK_TAX_RATES.standard]
    
    if (provinceRates) {
      rate = provinceRates[saleType as keyof typeof provinceRates] || 18
      
      if (rate === 0) {
        description = saleType === 'GZR' ? 'Zero rated' : 'Exempt from tax'
      } else {
        description = `Standard rate ${rate}% - ${sellerProvince} province`
      }
    } else {
      // Default fallback
      rate = 18
      description = 'Standard rate 18% (default)'
    }
  }
  
  // Cache the calculated rate
  try {
    await prisma.fBRTaxRate.create({
      data: {
        hsCode,
        saleType,
        sellerProvince,
        buyerProvince,
        scenarioId,
        rate,
        description
      }
    })
    console.log('💾 Cached new tax rate:', rate)
  } catch (error) {
    console.warn('⚠️ Failed to cache tax rate:', error)
  }
  
  return { rate, description }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const hsCode = searchParams.get('hsCode')
    const saleType = searchParams.get('saleType')
    const sellerProvince = searchParams.get('sellerProvince')
    const buyerProvince = searchParams.get('buyerProvince')
    const scenarioId = searchParams.get('scenarioId')

    // Validate required parameters
    if (!hsCode || !saleType || !sellerProvince || !buyerProvince || !scenarioId) {
      return NextResponse.json({
        error: 'Missing required parameters',
        required: ['hsCode', 'saleType', 'sellerProvince', 'buyerProvince', 'scenarioId']
      }, { status: 400 })
    }

    console.log('🎯 Tax Rate Request:', { hsCode, saleType, sellerProvince, buyerProvince, scenarioId })

    const taxResult = await calculateTaxRate({
      hsCode,
      saleType,
      sellerProvince,
      buyerProvince,
      scenarioId
    })

    console.log('✅ Tax Rate Response:', taxResult)

    return NextResponse.json({
      success: true,
      data: {
        rate: taxResult.rate,
        description: taxResult.description,
        parameters: {
          hsCode,
          saleType,
          sellerProvince,
          buyerProvince,
          scenarioId
        }
      }
    })

  } catch (error) {
    console.error('❌ Tax Rate API Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Tax rate calculation for single item or bulk items
export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Support both single item and bulk item requests
    // Single item: { date, transTypeId, provinceId, hsCode }
    // Bulk items: { items, sellerProvince, buyerProvince, scenarioId }
    
    if (body.items && Array.isArray(body.items)) {
      // BULK TAX RATE CALCULATION
      const { items, sellerProvince, buyerProvince, scenarioId } = body

      if (!sellerProvince || !buyerProvince || !scenarioId) {
        return NextResponse.json({
          error: 'Invalid request body',
          required: ['items (array)', 'sellerProvince', 'buyerProvince', 'scenarioId']
        }, { status: 400 })
      }

      console.log('🎯 Bulk Tax Rate Request:', { itemsCount: items.length, sellerProvince, buyerProvince, scenarioId })

      const results = []

      for (const item of items) {
        if (!item.hsCode || !item.saleType) {
          results.push({
            item,
            error: 'Missing hsCode or saleType',
            rate: null,
            description: null
          })
          continue
        }

        try {
          const taxResult = await calculateTaxRate({
            hsCode: item.hsCode,
            saleType: item.saleType,
            sellerProvince,
            buyerProvince,
            scenarioId
          })

          results.push({
            item,
            rate: taxResult.rate,
            description: taxResult.description,
            error: null
          })
        } catch (error) {
          results.push({
            item,
            error: error instanceof Error ? error.message : 'Unknown error',
            rate: null,
            description: null
          })
        }
      }

      console.log('✅ Bulk Tax Rate Response:', { processedItems: results.length })

      return NextResponse.json({
        success: true,
        data: {
          results,
          summary: {
            totalItems: items.length,
            successfulCalculations: results.filter(r => r.rate !== null).length,
            failedCalculations: results.filter(r => r.error !== null).length
          }
        }
      })
      
    } else {
      // SINGLE ITEM TAX RATE CALCULATION (for product form)
      const { date, transTypeId, provinceId, hsCode } = body
      
      if (!transTypeId || !hsCode) {
        return NextResponse.json({
          error: 'Missing required parameters',
          required: ['transTypeId', 'hsCode']
        }, { status: 400 })
      }

      console.log('🎯 Single Tax Rate Request:', { date, transTypeId, provinceId, hsCode })

      // Map transaction type ID to sale type
      const transType = MOCK_FBR_DATA.transactionTypes.find(t => t.transTypeId === transTypeId)
      const saleType = transType?.transTypeId === 7 ? 'GZR' : 
                       transType?.transTypeId === 8 ? 'GER' : 'GSR'
      
      // Map province ID to province code
      const provinceMap: Record<number, string> = {
        1: 'PB', 2: 'SD', 3: 'KP', 4: 'BL', 5: 'GB', 6: 'AK', 7: 'ICT'
      }
      const provinceCode = provinceMap[provinceId] || 'PB'

      // Calculate tax rate
      const specialRates = MOCK_TAX_RATES.special[hsCode as keyof typeof MOCK_TAX_RATES.special]
      const provinceRates = specialRates?.[provinceCode as keyof typeof specialRates] || 
                           MOCK_TAX_RATES.standard[provinceCode as keyof typeof MOCK_TAX_RATES.standard]
      
      const rate = provinceRates?.[saleType as keyof typeof provinceRates] || 18
      
      // Generate rate ID (simulate FBR rate ID)
      const rateId = Math.floor(100 + Math.random() * 900)
      
      let rateDescription = ''
      if (rate === 0) {
        rateDescription = saleType === 'GZR' ? 'Zero rated supply' : 'Exempt from sales tax'
      } else {
        rateDescription = `${rate}% sales tax - ${transType?.transTypeDesc || 'Standard supply'}`
      }

      console.log('✅ Single Tax Rate Response:', { rateId, rate, rateDescription })

      return NextResponse.json({
        rateId,
        rateValue: rate,
        rateDescription,
        transactionType: transType?.transTypeDesc,
        provinceCode
      })
    }

  } catch (error) {
    console.error('❌ Tax Rate API Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Mock transaction types for tax rate mapping
const MOCK_FBR_DATA = {
  transactionTypes: [
    { transTypeId: 1, transTypeDesc: 'Supply of Goods' },
    { transTypeId: 2, transTypeDesc: 'Supply of Services' },
    { transTypeId: 3, transTypeDesc: 'Export of Goods' },
    { transTypeId: 4, transTypeDesc: 'Export of Services' },
    { transTypeId: 5, transTypeDesc: 'Import of Goods' },
    { transTypeId: 6, transTypeDesc: 'Import of Services' },
    { transTypeId: 7, transTypeDesc: 'Zero Rated Supply' },
    { transTypeId: 8, transTypeDesc: 'Exempt Supply' },
    { transTypeId: 9, transTypeDesc: 'Advance Payment' },
    { transTypeId: 10, transTypeDesc: 'Return/Credit Note' }
  ]
}