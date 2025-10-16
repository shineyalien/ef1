// Unified FBR JSON Generation Utility
// This utility provides a standardized way to generate FBR-compliant JSON for invoices

import { prisma } from './database'

// Helper function to map internal sale types to FBR format
function mapToFBRSaleType(saleType: string, taxRate: number): string {
  // Map internal sale types to FBR-compliant sale type descriptions
  switch (saleType) {
    case 'Standard':
      return 'Goods at standard rate (default)'
    case 'Reduced':
      return 'Goods at Reduced Rate'
    case 'Exempt':
      return 'Exempt Goods'
    case 'Zero':
      return 'Goods at zero-rate'
    case 'Zero-rated':
      return 'Goods at zero-rate'
    case 'Services':
      return 'Services rendered or provided'
    case 'FED':
      return 'Goods (FED in ST Mode)'
    case 'Steel':
      return 'Sale of Steel (Melted and Re-Rolled)'
    case 'Textile':
      return 'Cotton Spinners purchase from Cotton Ginners'
    case 'Telecom':
      return 'Telecommunication services rendered or provided'
    default:
      // Default based on tax rate
      if (taxRate === 0) return 'Goods at zero-rate'
      if (taxRate < 18) return 'Goods at Reduced Rate'
      return 'Goods at standard rate (default)'
  }
}

// Fetch seller data from business settings (client-side only)
async function fetchSellerData() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side - return default values
    return {
      ntnCnic: "1234567",
      businessName: "Your Business Name",
      province: "Sindh",
      address: "Your Address"
    }
  }
  
  try {
    const response = await fetch('/api/settings/business')
    if (response.ok) {
      const businessData = await response.json()
      if (businessData.business) {
        return {
          ntnCnic: businessData.business.ntnNumber || "1234567",
          businessName: businessData.business.companyName || "Your Business Name",
          province: businessData.business.province || "Sindh",
          address: businessData.business.address || "Your Address"
        }
      }
    }
  } catch (error) {
    console.error('Error fetching business data:', error)
  }
  
  // Return default values if fetch fails
  return {
    ntnCnic: "1234567",
    businessName: "Your Business Name",
    province: "Sindh",
    address: "Your Address"
  }
}

// Main function to convert invoice data to FBR format
export async function convertToFbrFormat(invoice: any, options: { useDbData?: boolean } = {}) {
  const { useDbData = true } = options
  
  let sellerData = {
    ntnCnic: "1234567", // Default fallback
    businessName: "Your Business Name", // Default fallback
    province: "Sindh", // Default fallback
    address: "Your Address" // Default fallback
  }
  
  // Fetch seller data from business settings
  if (useDbData) {
    try {
      sellerData = await fetchSellerData()
    } catch (error) {
      console.error('Error fetching seller data:', error)
    }
  }
  
  // Find customer data if provided
  const customer = invoice.customer
  
  // Use the FBR buyer fields from the invoice if available, otherwise use customer data
  const buyerNTNCNIC = invoice.fbrBuyerNTN || invoice.fbrBuyerCNIC || invoice.fbrBuyerPassport ||
                       customer?.ntnNumber || customer?.buyerNTN ||
                       customer?.buyerCNIC || customer?.buyerPassport || ""
  
  const buyerBusinessName = customer?.name || "Walk-in Customer"
  const buyerProvince = invoice.fbrBuyerProvince || customer?.province || customer?.buyerProvince || sellerData.province
  const buyerAddress = invoice.fbrBuyerAddress || customer?.address || "N/A"
  
  // Determine buyer registration type based on NTN/CNIC
  let buyerRegistrationType = "Unregistered"
  if (buyerNTNCNIC) {
    buyerRegistrationType = "Registered"
  }
  
  return {
    invoiceType: invoice.documentType || "Sale Invoice",
    invoiceDate: invoice.invoiceDate,
    sellerNTNCNIC: sellerData.ntnCnic,
    sellerBusinessName: sellerData.businessName,
    sellerProvince: sellerData.province,
    sellerAddress: sellerData.address,
    buyerNTNCNIC: buyerNTNCNIC,
    buyerBusinessName: buyerBusinessName,
    buyerProvince: buyerProvince,
    buyerAddress: buyerAddress,
    buyerRegistrationType,
    invoiceRefNo: invoice.invoiceRefNo || "",
    items: invoice.items.map((item: any) => ({
      hsCode: item.hsCode,
      productDescription: item.description,
      rate: `${item.taxRate}%`,
      uoM: item.unitOfMeasurement,
      quantity: parseFloat(item.quantity.toFixed(4)),
      totalValues: item.totalValue || 0,
      valueSalesExcludingST: item.valueSalesExcludingST,
      fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice || 0,
      salesTaxApplicable: item.salesTaxApplicable,
      salesTaxWithheldAtSource: item.salesTaxWithheldAtSource || 0,
      extraTax: item.extraTax || 0,
      furtherTax: item.furtherTax || 0,
      sroScheduleNo: item.sroScheduleNo || "",
      fedPayable: item.fedPayable || 0,
      discount: item.discount || 0,
      saleType: item.saleType === "Standard" ? "Goods at standard rate (default)" : 
                mapToFBRSaleType(item.saleType, item.taxRate),
      sroItemSerialNo: item.sroItemSerialNo || ""
    }))
  }
}

// API route version - fetches data from database
export async function generateFbrJsonFromDb(invoiceId: string) {
  try {
    // Fetch invoice with all related data from database
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId
      },
      include: {
        items: true,
        customer: true,
        business: true
      }
    })

    if (!invoice) {
      throw new Error('Invoice not found')
    }

    // Use seller data from business record
    const sellerData = {
      ntnCnic: invoice.business.ntnNumber,
      businessName: invoice.business.companyName,
      province: invoice.business.province,
      address: invoice.business.address
    }

    // Use the FBR buyer fields from the invoice if available, fallback to customer fields
    const buyerNTNCNIC = invoice.fbrBuyerNTN || invoice.fbrBuyerCNIC || invoice.fbrBuyerPassport ||
                         invoice.customer?.ntnNumber || invoice.customer?.buyerNTN ||
                         invoice.customer?.buyerCNIC || invoice.customer?.buyerPassport || undefined

    // Format invoice for FBR production API (camelCase)
    const fbrProductionJson = {
      invoiceType: invoice.documentType as 'Sale Invoice' | 'Debit Note',
      invoiceDate: invoice.invoiceDate.toISOString().split('T')[0] as string,
      
      // Seller information
      sellerNTNCNIC: sellerData.ntnCnic,
      sellerBusinessName: sellerData.businessName,
      sellerProvince: sellerData.province,
      sellerAddress: sellerData.address,
      
      // Buyer information - Use FBR buyer fields from invoice if available, fallback to customer fields
      buyerNTNCNIC: buyerNTNCNIC,
      buyerBusinessName: invoice.customer?.name || 'Walk-in Customer',
      buyerProvince: invoice.fbrBuyerProvince || invoice.customer?.buyerProvince || invoice.business.province,
      buyerAddress: invoice.fbrBuyerAddress || invoice.customer?.address || 'N/A',
      buyerRegistrationType: invoice.fbrBuyerType || (invoice.customer?.ntnNumber ? '1' : '2'),
      // Additional buyer fields for FBR compliance
      buyerCity: invoice.fbrBuyerCity || invoice.customer?.buyerCity || '',
      buyerContact: invoice.fbrBuyerContact || invoice.customer?.buyerContact || invoice.customer?.phone || '',
      buyerEmail: invoice.fbrBuyerEmail || invoice.customer?.buyerEmail || invoice.customer?.email || '',
      
      // Reference for debit notes
      invoiceRefNo: invoice.referenceInvoiceNo || undefined,
      scenarioId: invoice.scenarioId || undefined,
      
      // Line items (camelCase - FBR production compliant)
      items: invoice.items.map(item => ({
        hsCode: item.hsCode,
        productDescription: item.description,
        rate: `${item.taxRate}%`,
        uoM: item.unitOfMeasurement,
        quantity: item.quantity,
        totalValues: item.totalValue,
        valueSalesExcludingST: item.valueSalesExcludingST,
        fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice,
        salesTaxApplicable: item.salesTaxApplicable,
        salesTaxWithheldAtSource: item.salesTaxWithheldAtSource,
        extraTax: item.extraTax || 0,
        furtherTax: item.furtherTax || 0,
        fedPayable: item.fedPayable || 0,
        discount: item.discount || 0,
        saleType: item.fbrSaleType || mapToFBRSaleType(item.saleType, item.taxRate),
        sroScheduleNo: item.sroScheduleNo || undefined,
        sroItemSerialNo: item.sroItemSerialNo || undefined
      }))
    }

    return {
      success: true,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      fbrJson: fbrProductionJson,
      metadata: {
        generatedAt: new Date().toISOString(),
        environment: 'production', // This is the production format
        fieldNamingConvention: 'camelCase',
        complianceLevel: 'FBR Production v1.12'
      }
    }
  } catch (error: any) {
    console.error('Error generating FBR JSON:', error)
    throw new Error(error.message || 'Failed to generate FBR JSON')
  }
}