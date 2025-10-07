import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

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

// GET /api/invoices/[id]/fbr-json - Generate FBR production JSON for an invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const invoiceId = params.id

    // Fetch invoice with all related data
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        business: {
          user: {
            email: session.user.email
          }
        }
      },
      include: {
        items: true,
        customer: true,
        business: true
      }
    })

    if (!invoice) {
      return NextResponse.json({ 
        error: 'Invoice not found' 
      }, { status: 404 })
    }

    // Format invoice for FBR production API (camelCase)
    const fbrProductionJson = {
      invoiceType: invoice.documentType as 'Sale Invoice' | 'Debit Note',
      invoiceDate: invoice.invoiceDate.toISOString().split('T')[0] as string,
      
      // Seller information
      sellerNTNCNIC: invoice.business.ntnNumber,
      sellerBusinessName: invoice.business.companyName,
      sellerProvince: invoice.business.province,
      sellerAddress: invoice.business.address,
      
      // Buyer information
      buyerNTNCNIC: invoice.customer?.ntnNumber || invoice.customer?.buyerNTN || invoice.customer?.buyerCNIC || invoice.customer?.buyerPassport || undefined,
      buyerBusinessName: invoice.customer?.name || 'Walk-in Customer',
      buyerProvince: invoice.customer?.buyerProvince || invoice.business.province,
      buyerAddress: invoice.customer?.address || 'N/A',
      buyerRegistrationType: invoice.customer?.ntnNumber ? 'Registered' as const : 'Unregistered' as const,
      
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

    return NextResponse.json({
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
    })

  } catch (error: any) {
    console.error('Error generating FBR JSON:', error)
    return NextResponse.json({
      error: 'Failed to generate FBR JSON',
      details: error.message
    }, { status: 500 })
  }
}