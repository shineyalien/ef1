import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestProducts() {
  console.log('🔍 Looking for test business...')
  
  // Find the test business we created
  const business = await prisma.business.findFirst({
    where: {
      companyName: 'Easy Filer Demo Company'
    }
  })
  
  if (!business) {
    console.log('❌ Test business not found. Run test-db.js first.')
    return
  }
  
  console.log(`✅ Found business: ${business.companyName} (ID: ${business.id})`)
  
  // Create some test products
  const products = [
    {
      name: 'Office Supplies',
      description: 'General office supplies including pens, papers, etc.',
      hsCode: '4817.1000',
      unitOfMeasurement: 'Pieces',
      unitPrice: 50.00,
      taxRate: 18,
      category: 'Stationery',
      businessId: business.id
    },
    {
      name: 'Computer Software License',
      description: 'Annual software license for business operations',
      hsCode: '8523.4900',
      unitOfMeasurement: 'License',
      unitPrice: 15000.00,
      taxRate: 18,
      category: 'Software',
      businessId: business.id
    },
    {
      name: 'Professional Services',
      description: 'Consulting and professional advisory services',
      hsCode: '8301.1000',
      unitOfMeasurement: 'Hours',
      unitPrice: 2500.00,
      taxRate: 18,
      category: 'Services',
      businessId: business.id
    }
  ]
  
  console.log('🔧 Creating test products...')
  
  for (const product of products) {
    const created = await prisma.product.create({
      data: product
    })
    console.log(`✅ Created product: ${created.name} (ID: ${created.id})`)
  }
  
  // Verify products were created
  const productCount = await prisma.product.count({
    where: {
      businessId: business.id,
      isActive: true
    }
  })
  
  console.log(`✅ Total active products for business: ${productCount}`)
  console.log('✅ Test products created successfully!')
}

createTestProducts()
  .catch((error) => {
    console.error('❌ Error creating test products:', error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })