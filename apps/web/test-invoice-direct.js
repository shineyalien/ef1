// Simple test to create an invoice directly using the database
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestInvoice() {
  console.log('🧪 Creating test invoice directly in database...')
  
  try {
    // Get the test business
    const business = await prisma.business.findFirst({
      where: {
        companyName: 'Easy Filer Demo Company'
      }
    })
    
    if (!business) {
      console.log('❌ No business found')
      return
    }
    
    console.log(`✅ Found business: ${business.companyName}`)
    
    // Get a test customer
    const customer = await prisma.customer.findFirst({
      where: {
        businessId: business.id
      }
    })
    
    console.log(`✅ Found customer: ${customer?.name || 'No customer'}`)
    
    // Calculate next invoice number based on count
    const invoiceCount = await prisma.invoice.count({
      where: { businessId: business.id }
    })
    const nextNumber = invoiceCount + 1
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(nextNumber).padStart(3, '0')}`
    
    console.log(`📋 Creating invoice: ${invoiceNumber}`)
    
    // Create test invoice directly
    const newInvoice = await prisma.invoice.create({
      data: {
        businessId: business.id,
        customerId: customer?.id || null,
        invoiceNumber: invoiceNumber,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 1000,
        taxAmount: 180,
        totalAmount: 1180,
        status: 'DRAFT',
        mode: 'LOCAL',
        items: {
          create: [
            {
              description: 'Test Product 1',
              hsCode: '8523.4990',
              quantity: 2,
              unitPrice: 500,
              unitOfMeasurement: 'Piece',
              taxRate: 18,
              totalValue: 1000, // Base amount without tax
              taxAmount: 180, // Tax amount for this item
            }
          ]
        }
      },
      include: {
        items: true,
        customer: true
      }
    })

    console.log('✅ Invoice created successfully!')
    console.log('📋 Invoice ID:', newInvoice.id)
    console.log('📋 Invoice Number:', newInvoice.invoiceNumber)
    console.log('📋 Total Amount:', newInvoice.totalAmount)
    console.log('📋 Items:', newInvoice.items.length)
    
  } catch (error) {
    console.error('❌ Error creating invoice:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestInvoice()