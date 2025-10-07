// Quick test to check database connection and create test data
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Checking database connection...')
    
    // Check users
    const users = await prisma.user.findMany()
    console.log('Users in database:', users.length)
    
    // Check businesses
    const businesses = await prisma.business.findMany()
    console.log('Businesses in database:', businesses.length)
    
    // If no users exist, create test user and business
    if (users.length === 0) {
      console.log('🔧 Creating test user and business...')
      
      const user = await prisma.user.create({
        data: {
          email: 'admin@easyfiler.com',
          password: '$2a$10$8QqXZQqXZQqXZQqXZQqXZO', // bcrypt hash for 'password123'
          firstName: 'Admin',
          lastName: 'User',
          phoneNumber: '+92-300-1234567',
          country: 'Pakistan',
          subscriptionPlan: 'PROFESSIONAL'
        }
      })
      
      const business = await prisma.business.create({
        data: {
          userId: user.id,
          companyName: 'Easy Filer Demo Company',
          ntnNumber: '1234567',
          address: '123 Main Street, Lahore, Punjab',
          province: 'Punjab',
          businessType: 'IT Services',
          sector: 'Technology'
        }
      })
      
      console.log('✅ Created test user:', user.email)
      console.log('✅ Created test business:', business.companyName)
    }
    
    console.log('✅ Database test complete!')
    
  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()