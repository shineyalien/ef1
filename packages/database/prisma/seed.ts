import { PrismaClient } from '../src/generated/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create system configurations for Pakistani FBR data
  const systemConfigs = [
    { key: 'default_tax_rate', value: '18' },
    { key: 'company_currency', value: 'PKR' },
    { key: 'fbr_api_version', value: 'v1' },
    { key: 'invoice_sequence_start', value: '1' }
  ]

  console.log('⚙️ Creating system configurations...')
  for (const config of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config
    })
  }

  // Create a sample admin user
  console.log('👤 Creating sample admin user...')
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@easyfiler.com' },
    update: {},
    create: {
      email: 'admin@easyfiler.com',
      firstName: 'Admin',
      lastName: 'User',
      password: '$2a$10$YourHashedPasswordHere', // In production, use proper hashing
      phone: '+92-300-1234567',
      subscriptionPlan: 'PROFESSIONAL'
    }
  })

  // Create a sample business for the admin user
  console.log('🏢 Creating sample business...')
  await prisma.business.upsert({
    where: { 
      ntnNumber: '1234567' 
    },
    update: {},
    create: {
      companyName: 'Easy Filer Demo Company',
      ntnNumber: '1234567',
      address: '123 Main Street, Lahore, Punjab',
      province: 'Punjab',
      city: 'Lahore',
      postalCode: '54000',
      businessType: 'IT Services',
      sector: 'Technology',
      phoneNumber: '+92-42-123-4567',
      email: 'contact@easyfiler.com',
      website: 'https://easyfiler.com',
      userId: adminUser.id,
      fbrSetupComplete: false,
      integrationMode: 'LOCAL'
    }
  })

  // Create sample customers
  console.log('👥 Creating sample customers...')
  const business = await prisma.business.findFirst({
    where: { ntnNumber: '1234567' }
  })

  if (business) {
    await prisma.customer.upsert({
      where: { 
        id: 'sample-customer-1'
      },
      update: {},
      create: {
        id: 'sample-customer-1',
        businessId: business.id,
        name: 'Sample Customer Ltd',
        email: 'customer@example.com',
        phone: '+92-21-987-6543',
        address: '456 Business Street, Karachi',
        city: 'Karachi',
        province: 'Sindh',
        postalCode: '75600',
        ntnNumber: '7654321',
        registrationType: 'REGISTERED'
      }
    })

    await prisma.customer.upsert({
      where: { 
        id: 'sample-customer-2'
      },
      update: {},
      create: {
        id: 'sample-customer-2',
        businessId: business.id,
        name: 'John Doe',
        phone: '+92-300-555-1234',
        address: '789 Residential Area, Islamabad',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        registrationType: 'UNREGISTERED'
      }
    })
  }

  console.log('✅ Database seeding completed successfully!')
  console.log('📊 Summary:')
  console.log(`   - ${systemConfigs.length} system configurations created`)
  console.log(`   - 1 admin user created (admin@easyfiler.com)`)
  console.log(`   - 1 sample business created`)
  console.log(`   - 2 sample customers created`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })