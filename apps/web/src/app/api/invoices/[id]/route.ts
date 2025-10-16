import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

// GET /api/invoices/[id] - Get a specific invoice
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        customer: true,
        business: true
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Verify the invoice belongs to the user's business
    const business = await prisma.business.findFirst({
      where: { 
        id: invoice.businessId,
        user: { email: session.user.email }
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/invoices/[id] - Update an existing invoice
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const body = await request.json()
    
    // Get the existing invoice
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { business: true }
    })

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Verify ownership
    const business = await prisma.business.findFirst({
      where: { 
        id: existingInvoice.businessId,
        user: { email: session.user.email }
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if invoice can be edited
    if (existingInvoice.status === 'PUBLISHED') {
      return NextResponse.json({ 
        error: 'Cannot edit published invoices' 
      }, { status: 400 })
    }

    // Validate required fields
    if (!body.customerId) {
      return NextResponse.json({ error: 'Customer is required' }, { status: 400 })
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Invoice must have at least one item' }, { status: 400 })
    }

    // Delete existing items and create new ones
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id }
    })

    // Update invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        customerId: body.customerId,
        invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        documentType: body.documentType,
        paymentMode: body.paymentMode,
        scenarioId: body.scenarioId || null,
        taxPeriod: body.taxPeriod,
        referenceInvoiceNo: body.invoiceRefNo || null,
        subtotal: body.subtotal || 0,
        taxAmount: body.taxAmount || 0,
        totalAmount: body.totalAmount || 0,
        totalWithholdingTax: body.totalWithholdingTax || 0,
        totalExtraTax: body.totalExtraTax || 0,
        totalFurtherTax: body.totalFurtherTax || 0,
        totalFED: body.totalFED || 0,
        status: body.status || existingInvoice.status,
        // Include FBR Buyer Information fields
        fbrBuyerNTN: body.fbrBuyerNTN || '',
        fbrBuyerCNIC: body.fbrBuyerCNIC || '',
        fbrBuyerPassport: body.fbrBuyerPassport || '',
        fbrBuyerType: body.fbrBuyerType || '',
        fbrBuyerCity: body.fbrBuyerCity || '',
        fbrBuyerProvince: body.fbrBuyerProvince || '',
        fbrBuyerAddress: body.fbrBuyerAddress || '',
        fbrBuyerContact: body.fbrBuyerContact || '',
        fbrBuyerEmail: body.fbrBuyerEmail || '',
        items: {
          create: body.items.map((item: any) => ({
            description: item.description,
            hsCode: item.hsCode,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unitOfMeasurement: item.unitOfMeasurement || 'Each',
            taxRate: item.taxRate || 18,
            discount: item.discount || 0,
            valueSalesExcludingST: item.valueSalesExcludingST || 0,
            salesTaxApplicable: item.salesTaxApplicable || 0,
            salesTaxWithheldAtSource: item.salesTaxWithheldAtSource || 0,
            extraTax: item.extraTax || 0,
            furtherTax: item.furtherTax || 0,
            fedPayable: item.fedPayable || 0,
            totalValue: item.totalValue || 0,
            saleType: item.saleType || 'Standard',
            sroScheduleNo: item.sroScheduleNo || null,
            sroItemSerialNo: item.sroItemSerialNo || null,
            fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice || 0,
            taxAmount: item.salesTaxApplicable || 0,
            saleValue: item.unitPrice
          }))
        }
      },
      include: {
        items: true,
        customer: true
      }
    })

    return NextResponse.json({ 
      invoice: updatedInvoice,
      message: 'Invoice updated successfully' 
    })
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/invoices/[id] - Delete an invoice
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { business: true }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Verify ownership
    const business = await prisma.business.findFirst({
      where: { 
        id: invoice.businessId,
        user: { email: session.user.email }
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if invoice can be deleted
    // Only DRAFT and SAVED invoices can be deleted
    const deletableStatuses = ['DRAFT', 'SAVED', 'FAILED']
    
    if (!deletableStatuses.includes(invoice.status)) {
      return NextResponse.json({ 
        error: `Cannot delete invoice with status: ${invoice.status}`,
        message: 'Only draft, saved, or failed invoices can be deleted. Submitted, validated, or published invoices cannot be deleted.',
        status: invoice.status
      }, { status: 403 })
    }

    // Additional check: prevent deletion if FBR submitted or validated
    if (invoice.fbrSubmitted || invoice.fbrValidated) {
      return NextResponse.json({ 
        error: 'Cannot delete FBR-submitted invoice',
        message: 'This invoice has been submitted to FBR and cannot be deleted.',
        fbrSubmitted: invoice.fbrSubmitted,
        fbrValidated: invoice.fbrValidated
      }, { status: 403 })
    }

    // Delete the invoice (cascade will delete items)
    await prisma.invoice.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Invoice deleted successfully',
      deletedInvoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status
      }
    })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
