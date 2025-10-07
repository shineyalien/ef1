import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestCustomers() {
  try {
    console.log('🔍 Looking for existing customers...')
    
    // Check if customers already exist
    const existingCustomers = await prisma.customer.findMany()
    console.log('Existing customers:', existingCustomers.length)
    
    if (existingCustomers.length === 0) {
      console.log('🔧 Creating test customers...')
      
      // Find the test business
      const business = await prisma.business.findFirst({
        where: {
          companyName: 'Easy Filer Demo Company'
        }
      })
      
      if (!business) {
        console.log('❌ Test business not found. Run test-db.js first.')
        return
      }
      
      // Create sample customers (using actual Customer model fields)
      const customers = [
        {
          id: 'customer-1',
          businessId: business.id,
          name: 'Sample Customer Ltd',
          email: 'customer@sample.com',
          phone: '+92-42-9876543',
          address: '456 Customer Street, Gulberg, Lahore, Punjab',
          ntnNumber: '1234567890123',
          registrationType: 'REGISTERED',
        },
        {
          id: 'customer-2',
          businessId: business.id,
          name: 'John Doe',
          phone: '+92-300-1234567',
          address: '789 Individual Lane, Model Town, Lahore, Punjab',
          registrationType: 'UNREGISTERED'
        }
      ]
      
      for (const customer of customers) {
        const created = await prisma.customer.create({
          data: customer
        })
        console.log(`✅ Created customer: ${created.name} (ID: ${created.id})`)
      }
      
      console.log('✅ Test customers created successfully!')
    } else {
      console.log('✅ Customers already exist, skipping creation.')
    }
    
  } catch (error) {
    console.error('❌ Error creating test customers:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestCustomers()