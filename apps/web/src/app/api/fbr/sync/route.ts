import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'
import { PRALAPIClient } from '@/lib/fbr-pral-client'

/**
 * API to sync FBR lookup data from PRAL to local database
 * GET /api/fbr/sync - Sync all FBR lookup data
 * POST /api/fbr/sync - Sync specific lookup type
 */

export async function GET(request: NextRequest) {
  try {
    // Get authenticated business to check FBR token
    const business = await getAuthenticatedBusiness()
    
    // Use sandbox token for now
    const token = business.sandboxToken || process.env.FBR_SANDBOX_TOKEN || ''
    
    if (!token) {
      return NextResponse.json({
        error: 'FBR token not configured',
        message: 'Please configure your FBR sandbox token in business settings'
      }, { status: 400 })
    }

    const pralClient = new PRALAPIClient({
      environment: 'sandbox',
      bearerToken: token
    })

    const results = {
      provinces: { success: false, count: 0, error: null },
      hsCodes: { success: false, count: 0, error: null },
      documentTypes: { success: false, count: 0, error: null },
      scenarios: { success: false, count: 0, error: null },
      paymentModes: { success: false, count: 0, error: null },
      uoms: { success: false, count: 0, error: null },
      saleTypes: { success: false, count: 0, error: null }
    }

    // 1. Sync Provinces
    try {
      const provincesData = await pralClient.getLookupData('provinces')
      if (provincesData.success && provincesData.data.length > 0) {
        await prisma.fBRProvince.deleteMany()
        await prisma.fBRProvince.createMany({
          data: provincesData.data.map((p: any) => ({
            code: p.stateProvinceCode?.toString() || p.code,
            name: p.stateProvinceDesc || p.name || p.description,
            description: p.stateProvinceDesc || p.description || p.name
          }))
        })
        results.provinces = { success: true, count: provincesData.data.length, error: null }
      }
    } catch (error: any) {
      results.provinces.error = error.message
      console.error('Province sync error:', error)
    }

    // 2. Sync HS Codes
    try {
      const hsCodesData = await pralClient.getLookupData('hscodes')
      if (hsCodesData.success && hsCodesData.data.length > 0) {
        await prisma.fBRHSCode.deleteMany()
        await prisma.fBRHSCode.createMany({
          data: hsCodesData.data.map((hs: any) => ({
            code: hs.hS_CODE || hs.code,
            description: hs.description || hs.hS_DESC || ''
          }))
        })
        results.hsCodes = { success: true, count: hsCodesData.data.length, error: null }
      }
    } catch (error: any) {
      results.hsCodes.error = error.message
      console.error('HS Code sync error:', error)
    }

    // 3. Sync Document Types
    try {
      const docTypesData = await pralClient.getLookupData('documentTypes')
      if (docTypesData.success && docTypesData.data.length > 0) {
        await prisma.fBRDocumentType.deleteMany()
        await prisma.fBRDocumentType.createMany({
          data: docTypesData.data.map((doc: any) => ({
            code: doc.docTypeId?.toString() || doc.code,
            description: doc.docDescription || doc.description
          }))
        })
        results.documentTypes = { success: true, count: docTypesData.data.length, error: null }
      }
    } catch (error: any) {
      results.documentTypes.error = error.message
      console.error('Document Types sync error:', error)
    }

    // 4. Sync Scenarios (Transaction Types)
    try {
      const scenariosData = await pralClient.getLookupData('transactionTypes')
      if (scenariosData.success && scenariosData.data.length > 0) {
        await prisma.fBRScenario.deleteMany()
        await prisma.fBRScenario.createMany({
          data: scenariosData.data.map((scenario: any) => ({
            code: scenario.transtypeID?.toString() || scenario.code,
            description: scenario.transTypeDesc || scenario.description
          }))
        })
        results.scenarios = { success: true, count: scenariosData.data.length, error: null }
      }
    } catch (error: any) {
      results.scenarios.error = error.message
      console.error('Scenarios sync error:', error)
    }

    // 5. Sync Units of Measurement
    try {
      const uomsData = await pralClient.getLookupData('uom')
      if (uomsData.success && uomsData.data.length > 0) {
        await prisma.fBRUnitOfMeasurement.deleteMany()
        await prisma.fBRUnitOfMeasurement.createMany({
          data: uomsData.data.map((uom: any) => ({
            code: uom.uoM_ID?.toString() || uom.code,
            description: uom.description || uom.uoM_DESC || ''
          }))
        })
        results.uoms = { success: true, count: uomsData.data.length, error: null }
      }
    } catch (error: any) {
      results.uoms.error = error.message
      console.error('UOM sync error:', error)
    }

    // 6. Sync Sale Types (using sample data for now)
    try {
      const saleTypesData = [
        { code: 'GSR', description: 'Goods at standard rate', rate: 18 },
        { code: 'GZR', description: 'Goods at zero rate', rate: 0 },
        { code: 'GER', description: 'Goods exempt from tax', rate: 0 },
        { code: 'GRR', description: 'Goods at reduced rate', rate: 10 },
        { code: 'SSR', description: 'Services at standard rate', rate: 18 },
        { code: 'SZR', description: 'Services at zero rate', rate: 0 },
        { code: 'SER', description: 'Services exempt from tax', rate: 0 }
      ]
      
      await prisma.fBRSaleType.deleteMany()
      await prisma.fBRSaleType.createMany({
        data: saleTypesData.map(st => ({
          code: st.code,
          description: st.description,
          taxRate: st.rate,
          hsCode: null,
          scenarioId: null
        }))
      })
      results.saleTypes = { success: true, count: saleTypesData.length, error: null }
    } catch (error: any) {
      results.saleTypes.error = error.message
      console.error('Sale Types sync error:', error)
    }

    // Update cache metadata
    await prisma.fBRCacheMetadata.upsert({
      where: { lookupType: 'all_fbr_data' },
      update: {
        lastSyncAt: new Date(),
        syncStatus: 'success',
        errorMessage: null
      },
      create: {
        lookupType: 'all_fbr_data',
        lastSyncAt: new Date(),
        syncStatus: 'success',
        recordCount: Object.values(results).reduce((sum, r) => sum + r.count, 0)
      }
    })

    const totalSuccess = Object.values(results).filter(r => r.success).length
    const totalCount = Object.values(results).reduce((sum, r) => sum + r.count, 0)

    return NextResponse.json({
      message: `Synced ${totalSuccess}/7 FBR lookup data types successfully`,
      totalRecords: totalCount,
      results,
      syncedAt: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('FBR sync error:', error)
    return NextResponse.json({
      error: 'Failed to sync FBR data',
      details: error.message
    }, { status: 500 })
  }
}

// POST endpoint to get already synced data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    let data: any[] = []

    switch (type) {
      case 'provinces':
        data = await prisma.fBRProvince.findMany({ where: { isActive: true } })
        break
      case 'hsCodes':
        data = await prisma.fBRHSCode.findMany({ where: { isActive: true } })
        break
      case 'documentTypes':
        data = await prisma.fBRDocumentType.findMany({ where: { isActive: true } })
        break
      case 'scenarios':
        data = await prisma.fBRScenario.findMany({ where: { isActive: true } })
        break
      case 'paymentModes':
        data = await prisma.fBRPaymentMode.findMany({ where: { isActive: true } })
        break
      case 'uoms':
        data = await prisma.fBRUnitOfMeasurement.findMany({ where: { isActive: true } })
        break
      case 'saleTypes':
        data = await prisma.fBRSaleType.findMany({ where: { isActive: true } })
        break
      case 'all':
        const [provinces, hsCodes, documentTypes, scenarios, paymentModes, uoms, saleTypes] = await Promise.all([
          prisma.fBRProvince.findMany({ where: { isActive: true } }),
          prisma.fBRHSCode.findMany({ where: { isActive: true } }),
          prisma.fBRDocumentType.findMany({ where: { isActive: true } }),
          prisma.fBRScenario.findMany({ where: { isActive: true } }),
          prisma.fBRPaymentMode.findMany({ where: { isActive: true } }),
          prisma.fBRUnitOfMeasurement.findMany({ where: { isActive: true } }),
          prisma.fBRSaleType.findMany({ where: { isActive: true } })
        ])
        
        return NextResponse.json({
          provinces,
          hsCodes,
          documentTypes,
          scenarios,
          paymentModes,
          uoms,
          saleTypes
        })
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ data })

  } catch (error: any) {
    console.error('FBR data fetch error:', error)
    return NextResponse.json({
      error: 'Failed to fetch FBR data',
      details: error.message
    }, { status: 500 })
  }
}
