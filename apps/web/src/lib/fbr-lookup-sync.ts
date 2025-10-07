/**
 * FBR PRAL Lookup Data Sync Service
 * Fetches real data from PRAL reference APIs and caches in database
 */

import { PRALAPIClient } from './fbr-pral-client'
import { prisma } from './database'

interface SyncResult {
  success: boolean
  synced: {
    provinces?: number
    hsCodes?: number
    uoms?: number
    documentTypes?: number
    transactionTypes?: number
  }
  errors: string[]
}

export class FBRLookupSyncService {
  private pralClient: PRALAPIClient
  
  constructor() {
    // These are public APIs, no token needed
    this.pralClient = new PRALAPIClient({
      environment: 'production',
      bearerToken: process.env.FBR_SANDBOX_TOKEN || 'public' // Public APIs don't need auth
    })
  }

  /**
   * Sync all FBR lookup data from PRAL APIs
   */
  async syncAll(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      synced: {},
      errors: []
    }

    try {
      // Sync provinces
      const provincesCount = await this.syncProvinces()
      result.synced.provinces = provincesCount
    } catch (error) {
      result.errors.push(`Provinces sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      result.success = false
    }

    try {
      // Sync HS Codes
      const hsCodesCount = await this.syncHSCodes()
      result.synced.hsCodes = hsCodesCount
    } catch (error) {
      result.errors.push(`HS Codes sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      result.success = false
    }

    try {
      // Sync Units of Measurement
      const uomsCount = await this.syncUOMs()
      result.synced.uoms = uomsCount
    } catch (error) {
      result.errors.push(`UOMs sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      result.success = false
    }

    try {
      // Sync Document Types
      const docTypesCount = await this.syncDocumentTypes()
      result.synced.documentTypes = docTypesCount
    } catch (error) {
      result.errors.push(`Document Types sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      result.success = false
    }

    return result
  }

  /**
   * Sync provinces from PRAL API
   */
  private async syncProvinces(): Promise<number> {
    console.log('📥 Syncing provinces from PRAL API...')
    
    // For now, use static data until real PRAL API is configured
    // TODO: Replace with actual PRAL API call when credentials are ready
    const mockProvinces = [
      { code: 'PUNJAB', name: 'Punjab', stateProvinceCode: 1 },
      { code: 'SINDH', name: 'Sindh', stateProvinceCode: 2 },
      { code: 'KPK', name: 'Khyber Pakhtunkhwa', stateProvinceCode: 3 },
      { code: 'BALOCHISTAN', name: 'Balochistan', stateProvinceCode: 4 },
      { code: 'GILGIT_BALTISTAN', name: 'Gilgit-Baltistan', stateProvinceCode: 5 },
      { code: 'AJK', name: 'Azad Jammu & Kashmir', stateProvinceCode: 6 },
      { code: 'ICT', name: 'Islamabad Capital Territory', stateProvinceCode: 7 }
    ]

    // TODO: Uncomment when PRAL API is ready
    // const provincesData = await this.pralClient.getLookupData('provinces')
    
    let count = 0
    for (const province of mockProvinces) {
      await prisma.fBRProvince.upsert({
        where: { code: province.code },
        update: {
          name: province.name,
          description: province.name,
          isActive: true
        },
        create: {
          code: province.code,
          name: province.name,
          description: province.name,
          isActive: true
        }
      })
      count++
    }

    console.log(`✅ Synced ${count} provinces`)
    return count
  }

  /**
   * Sync HS Codes from PRAL API
   */
  private async syncHSCodes(): Promise<number> {
    console.log('📥 Syncing HS Codes from PRAL API...')
    
    // Sample HS codes for now
    const mockHSCodes = [
      { code: '8523.4990', description: 'Software & Digital Services' },
      { code: '9801.0000', description: 'Professional Services' },
      { code: '2501.0010', description: 'Salt' },
      { code: '1006.3090', description: 'Rice' },
      { code: '8471.3000', description: 'Computer Equipment' },
      { code: '8517.1200', description: 'Mobile Phones' },
      { code: '8528.7200', description: 'Electronic Displays' },
      { code: '8443.3200', description: 'Printers' }
    ]

    // TODO: Uncomment when PRAL API is ready
    // const hsCodesData = await this.pralClient.getLookupData('itemdesccode')
    
    let count = 0
    for (const hsCode of mockHSCodes) {
      await prisma.fBRHSCode.upsert({
        where: { code: hsCode.code },
        update: {
          description: hsCode.description,
          isActive: true
        },
        create: {
          code: hsCode.code,
          description: hsCode.description,
          isActive: true
        }
      })
      count++
    }

    console.log(`✅ Synced ${count} HS codes`)
    return count
  }

  /**
   * Sync Units of Measurement from PRAL API
   */
  private async syncUOMs(): Promise<number> {
    console.log('📥 Syncing Units of Measurement from PRAL API...')
    
    const mockUOMs = [
      { code: 'EACH', description: 'Each' },
      { code: 'KG', description: 'Kilogram' },
      { code: 'LTR', description: 'Liter' },
      { code: 'MTR', description: 'Meter' },
      { code: 'SQM', description: 'Square Meter' },
      { code: 'PCS', description: 'Pieces' },
      { code: 'BOX', description: 'Box' },
      { code: 'SVC', description: 'Service' }
    ]

    // TODO: Uncomment when PRAL API is ready
    // const uomsData = await this.pralClient.getLookupData('uom')
    
    let count = 0
    for (const uom of mockUOMs) {
      await prisma.fBRUnitOfMeasurement.upsert({
        where: { code_hsCode: { code: uom.code, hsCode: '' } },
        update: {
          description: uom.description,
          isActive: true
        },
        create: {
          code: uom.code,
          hsCode: '',
          description: uom.description,
          isActive: true
        }
      })
      count++
    }

    console.log(`✅ Synced ${count} UOMs`)
    return count
  }

  /**
   * Sync Document Types from PRAL API
   */
  private async syncDocumentTypes(): Promise<number> {
    console.log('📥 Syncing Document Types from PRAL API...')
    
    const mockDocTypes = [
      { code: 'SALE_INVOICE', description: 'Sale Invoice' },
      { code: 'DEBIT_NOTE', description: 'Debit Note' },
      { code: 'CREDIT_NOTE', description: 'Credit Note' }
    ]

    // TODO: Uncomment when PRAL API is ready
    // const docTypesData = await this.pralClient.getLookupData('doctypecode')
    
    let count = 0
    for (const docType of mockDocTypes) {
      await prisma.fBRDocumentType.upsert({
        where: { code: docType.code },
        update: {
          description: docType.description,
          isActive: true
        },
        create: {
          code: docType.code,
          description: docType.description,
          isActive: true
        }
      })
      count++
    }

    console.log(`✅ Synced ${count} document types`)
    return count
  }

  /**
   * Get tax rate for specific parameters
   */
  async getTaxRate(date: string, transTypeId: number, provinceId: number): Promise<number> {
    try {
      // TODO: Replace with actual PRAL API call
      // const taxRates = await this.pralClient.getTaxRates({ date, transTypeId, originationSupplier: provinceId })
      
      // For now, return standard 18% rate
      return 18
    } catch (error) {
      console.error('Error fetching tax rate:', error)
      return 18 // Default to 18%
    }
  }
}

// Export singleton instance
export const fbrLookupSync = new FBRLookupSyncService()
