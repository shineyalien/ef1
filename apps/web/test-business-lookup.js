const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Looking for businesses...');
    
    // Try to get any business
    const businesses = await prisma.business.findMany({
      select: { 
        id: true, 
        companyName: true,
        ntnNumber: true
      },
      take: 5
    });
    
    if (businesses.length === 0) {
      console.log('No businesses found. Creating a test business...');
      
      // Create a test business
      const testBusiness = await prisma.business.create({
        data: {
          userId: 'test-user-id',
          companyName: 'Test Company for FBR Production',
          ntnNumber: '1234567',
          address: 'Test Address',
          province: 'Sindh',
          businessType: 'Manufacturer',
          sector: 'General',
          defaultScenario: 'SN001'
        }
      });
      
      console.log(`Created test business: ID=${testBusiness.id}, Name=${testBusiness.companyName}`);
      console.log(`Test URL: http://localhost:3000/api/test-fbr-production?businessId=${testBusiness.id}`);
    } else {
      console.log('Available businesses:');
      businesses.forEach(b => {
        console.log(`ID: ${b.id}, Name: ${b.companyName}, NTN: ${b.ntnNumber}`);
        console.log(`Test URL: http://localhost:3000/api/test-fbr-production?businessId=${b.id}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();