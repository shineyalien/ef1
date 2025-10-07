import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testInvoiceCreation() {
  console.log('🧪 Testing invoice creation API...')
  
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
    
    if (!customer) {
      console.log('❌ No customer found')
      return
    }
    
    console.log(`✅ Found customer: ${customer.name}`)
    
    // Create test invoice data
    const testInvoiceData = {
      customerId: customer.id,
      invoiceDate: '2025-01-02',
      dueDate: '2025-02-01',
      description: 'Test invoice for API validation',
      subtotal: 1000,
      taxAmount: 180,
      totalAmount: 1180,
      status: 'DRAFT',
      mode: 'LOCAL',
      items: [
        {
          description: 'Test Product 1',
          hsCode: '8523.4990',
          quantity: 2,
          unitPrice: 500,
          unitOfMeasurement: 'Piece',
          taxRate: 18
        }
      ]
    }
    
    console.log('🔧 Creating test invoice...')
    
    // Test the invoice creation by calling the API endpoint
    const response = await fetch('http://localhost:3000/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This won't work without proper auth, but let's see the error
      },
      body: JSON.stringify(testInvoiceData)
    })
    
    const result = await response.text()
    console.log('📄 API Response:', response.status, result)
    
    if (response.ok) {
      console.log('✅ Invoice API test passed!')
    } else {
      console.log('❌ Invoice API test failed')
    }
    
  } catch (error) {
    console.error('❌ Error during invoice test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testInvoiceCreation()