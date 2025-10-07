import { NextRequest, NextResponse } from 'next/server'
import { InvoiceTransformer } from '@/lib/fbr'
import { prisma } from '@/lib/db'

// FBR Production JSON Sample for comparison
const FBR_PRODUCTION_SAMPLE = {
  "invoiceType": "Sale Invoice",
  "invoiceDate": "2025-04-21",
  "sellerNTNCNIC": "....7 or 13 digit of seller NTN/CNIC.....",
  "sellerBusinessName": "Company 8",
  "sellerProvince": "Sindh",
  "sellerAddress": "Karachi",
  "buyerNTNCNIC": "....7 or 13 digit of buyer NTN/CNIC.....",
  "buyerBusinessName": "FERTILIZER MANUFAC IRS NEW",
  "buyerProvince": "Sindh",
  "buyerAddress": "Karachi",
  "buyerRegistrationType": "Unregistered",
  "invoiceRefNo": "",
  "items": [
    {
      "hsCode": "0101.2100",
      "productDescription": "product Description",
      "rate": "18%",
      "uoM": "Numbers, pieces, units",
      "quantity": 1.0000,
      "totalValues": 0.00,
      "valueSalesExcludingST": 1000.00,
      "fixedNotifiedValueOrRetailPrice": 0.00,
      "salesTaxApplicable": 180.00,
      "salesTaxWithheldAtSource": 0.00,
      "extraTax": 0.00,
      "furtherTax": 120.00,
      "sroScheduleNo": "SRO123",
      "fedPayable": 0.00,
      "discount": 0.00,
      "saleType": "Goods at standard rate (default)",
      "sroItemSerialNo": ""
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const businessId = searchParams.get('businessId')
    
    if (!businessId) {
      return NextResponse.json({
        error: 'Business ID is required',
        usage: 'GET /api/test-fbr-production?businessId=your-business-id'
      }, { status: 400 })
    }

    // Get business data
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        customers: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        products: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        invoices: {
          take: 1,
          include: { items: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!business) {
      return NextResponse.json({
        error: 'Business not found',
        businessId
      }, { status: 404 })
    }

    // Create test invoice data matching FBR production sample
    const testInvoice = {
      invoiceDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      customer: business.customers[0] || {
        name: 'FERTILIZER MANUFAC IRS NEW',
        ntnNumber: '1234567890123',
        province: 'Sindh',
        address: 'Karachi',
        registrationType: 'Unregistered'
      },
      items: [
        {
          hsCode: '0101.2100',
          description: 'product Description',
          taxRate: 18,
          unitOfMeasurement: 'Numbers, pieces, units',
          quantity: 1.0000,
          unitPrice: 1000.00,
          taxAmount: 180.00,
          totalValue: 1180.00,
          salesTaxWithheldAtSource: 0.00,
          extraTax: 0.00,
          furtherTax: 120.00,
          fedPayable: 0.00,
          discount: 0.00,
          saleType: 'Goods at standard rate (default)',
          sroScheduleNo: 'SRO123',
          sroItemSerialNo: '',
          fixedNotifiedValueOrRetailPrice: 0.00
        }
      ]
    }

    // Transform to FBR format
    const fbrInvoice = InvoiceTransformer.transformToPRALFormat(testInvoice, business)

    // Validate against production requirements
    const validationResults = {
      structure: validateStructure(fbrInvoice),
      fields: validateFields(fbrInvoice),
      dataTypes: validateDataTypes(fbrInvoice),
      requiredFields: validateRequiredFields(fbrInvoice),
      fieldFormats: validateFieldFormats(fbrInvoice)
    }

    // Check overall compliance
    const isCompliant = Object.values(validationResults).every(result => result.valid)

    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        name: business.companyName,
        ntn: business.ntnNumber,
        province: business.province,
        defaultScenario: (business as any).defaultScenario || 'SN001'
      },
      testInvoice: {
        invoiceDate: testInvoice.invoiceDate,
        customerName: testInvoice.customer.name,
        itemCount: testInvoice.items.length
      },
      fbrProductionFormat: fbrInvoice,
      fbrProductionSample: FBR_PRODUCTION_SAMPLE,
      validationResults,
      compliance: {
        isCompliant,
        summary: isCompliant 
          ? '✅ Fully compliant with FBR production JSON requirements'
          : '❌ Not compliant - see validation results for details'
      },
      recommendations: generateRecommendations(validationResults)
    })

  } catch (error) {
    console.error('FBR Production Test Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function validateStructure(invoice: any): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  
  // Check top-level structure
  if (!invoice.items || !Array.isArray(invoice.items)) {
    issues.push('Missing or invalid items array')
  }
  
  if (invoice.items && invoice.items.length === 0) {
    issues.push('Items array cannot be empty')
  }
  
  // Check item structure
  if (invoice.items && invoice.items.length > 0) {
    const item = invoice.items[0]
    const requiredItemFields = [
      'hsCode', 'productDescription', 'rate', 'uoM', 'quantity',
      'totalValues', 'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice',
      'salesTaxApplicable', 'salesTaxWithheldAtSource', 'saleType'
    ]
    
    requiredItemFields.forEach(field => {
      if (!(field in item)) {
        issues.push(`Missing required item field: ${field}`)
      }
    })
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}

function validateFields(invoice: any): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  
  // Check field naming conventions (should be camelCase)
  const expectedFields = [
    'invoiceType', 'invoiceDate', 'sellerNTNCNIC', 'sellerBusinessName',
    'sellerProvince', 'sellerAddress', 'buyerNTNCNIC', 'buyerBusinessName',
    'buyerProvince', 'buyerAddress', 'buyerRegistrationType', 'invoiceRefNo'
  ]
  
  expectedFields.forEach(field => {
    if (!(field in invoice)) {
      issues.push(`Missing required field: ${field}`)
    }
  })
  
  // Check item field naming
  if (invoice.items && invoice.items.length > 0) {
    const item = invoice.items[0]
    
    // FBR expects "uoM" not "uom"
    if ('uom' in item && !('uoM' in item)) {
      issues.push('Item field should be "uoM" not "uom"')
    }
    
    // Check for proper sale type format
    if (item.saleType && !item.saleType.includes('Goods at')) {
      issues.push(`Sale type should be descriptive like "Goods at standard rate (default)", got: "${item.saleType}"`)
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}

function validateDataTypes(invoice: any): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  
  // Check string fields
  const stringFields = [
    'invoiceType', 'invoiceDate', 'sellerNTNCNIC', 'sellerBusinessName',
    'sellerProvince', 'sellerAddress', 'buyerBusinessName', 'buyerProvince',
    'buyerAddress', 'buyerRegistrationType'
  ]
  
  stringFields.forEach(field => {
    if (invoice[field] && typeof invoice[field] !== 'string') {
      issues.push(`${field} should be string, got ${typeof invoice[field]}`)
    }
  })
  
  // Check item data types
  if (invoice.items && invoice.items.length > 0) {
    const item = invoice.items[0]
    
    if (typeof item.quantity !== 'number') {
      issues.push(`Item quantity should be number, got ${typeof item.quantity}`)
    }
    
    if (typeof item.totalValues !== 'number') {
      issues.push(`Item totalValues should be number, got ${typeof item.totalValues}`)
    }
    
    if (typeof item.valueSalesExcludingST !== 'number') {
      issues.push(`Item valueSalesExcludingST should be number, got ${typeof item.valueSalesExcludingST}`)
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}

function validateRequiredFields(invoice: any): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  
  // Required top-level fields
  const requiredFields = [
    'invoiceType', 'invoiceDate', 'sellerNTNCNIC', 'sellerBusinessName',
    'sellerProvince', 'sellerAddress', 'buyerBusinessName', 'buyerProvince',
    'buyerAddress', 'buyerRegistrationType', 'items'
  ]
  
  requiredFields.forEach(field => {
    if (!invoice[field]) {
      issues.push(`Required field missing: ${field}`)
    }
  })
  
  // Required item fields
  if (invoice.items && invoice.items.length > 0) {
    const item = invoice.items[0]
    const requiredItemFields = [
      'hsCode', 'productDescription', 'rate', 'uoM', 'quantity',
      'totalValues', 'valueSalesExcludingST', 'salesTaxApplicable',
      'salesTaxWithheldAtSource', 'saleType'
    ]
    
    requiredItemFields.forEach(field => {
      if (item[field] === undefined || item[field] === null) {
        issues.push(`Required item field missing: ${field}`)
      }
    })
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}

function validateFieldFormats(invoice: any): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  
  // Date format validation (YYYY-MM-DD)
  if (invoice.invoiceDate && !/^\d{4}-\d{2}-\d{2}$/.test(invoice.invoiceDate)) {
    issues.push(`Invoice date should be YYYY-MM-DD format, got: ${invoice.invoiceDate}`)
  }
  
  // Rate format validation (should include %)
  if (invoice.items && invoice.items.length > 0) {
    const item = invoice.items[0]
    if (item.rate && !/^\d+%$/.test(item.rate)) {
      issues.push(`Rate should be percentage format like "18%", got: ${item.rate}`)
    }
    
    // Quantity format validation (should be formatable to 4 decimal places)
    if (item.quantity && typeof item.quantity === 'number') {
      const quantityStr = item.quantity.toFixed(4) // Format to 4 decimal places for comparison
      // Check if the quantity is a valid number that can be formatted to 4 decimal places
      if (isNaN(item.quantity) || !isFinite(item.quantity)) {
        issues.push(`Quantity should be a valid number, got: ${item.quantity}`)
      }
    }
    
    // HS Code format validation
    // HS Code format validation (FBR format: XXXX.XX.XX or XXXX.XXXX)
    if (item.hsCode && !/^\d{4}\.\d{2}\.\d{2}$/.test(item.hsCode) && !/^\d{4}\.\d{4}$/.test(item.hsCode)) {
      issues.push(`HS Code should be format "XXXX.XX.XX" or "XXXX.XXXX", got: ${item.hsCode}`)
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}

function generateRecommendations(validationResults: any): string[] {
  const recommendations: string[] = []
  
  Object.entries(validationResults).forEach(([category, result]: [string, any]) => {
    if (!result.valid && result.issues.length > 0) {
      recommendations.push(`${category}: ${result.issues.join(', ')}`)
    }
  })
  
  if (recommendations.length === 0) {
    recommendations.push('✅ All validation checks passed - ready for production')
  }
  
  return recommendations
}