// Test script for PDF generation
// Run with: node test-pdf-generation.js

const { PrismaClient } = require('@prisma/client');

async function testPDFGeneration() {
  console.log('🧪 Testing PDF Generation...');
  
  try {
    // Test database connection
    const prisma = new PrismaClient();
    
    // Get a sample invoice
    const invoice = await prisma.invoice.findFirst({
      include: {
        business: true,
        customer: true,
        items: true
      }
    });
    
    if (!invoice) {
      console.log('❌ No invoices found in database. Please create an invoice first.');
      return;
    }
    
    console.log('✅ Found invoice:', invoice.invoiceNumber);
    console.log('📊 Invoice details:');
    console.log('  - Business:', invoice.business.companyName);
    console.log('  - Customer:', invoice.customer?.name || 'N/A');
    console.log('  - Items:', invoice.items.length);
    console.log('  - Total Amount:', invoice.totalAmount);
    
    // Test PDF generation API
    console.log('\n🔄 Testing PDF API...');
    
    const response = await fetch(`http://localhost:3000/api/invoices/${invoice.id}/pdf`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      }
    });
    
    if (response.ok) {
      console.log('✅ PDF API responded successfully');
      console.log('📄 Content-Type:', response.headers.get('content-type'));
      console.log('📏 Content-Length:', response.headers.get('content-length'));
      
      // Save PDF to file
      const buffer = await response.arrayBuffer();
      require('fs').writeFileSync('test-invoice.pdf', Buffer.from(buffer));
      console.log('💾 PDF saved as test-invoice.pdf');
    } else {
      console.log('❌ PDF API failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Check if running directly
if (require.main === module) {
  testPDFGeneration();
}

module.exports = { testPDFGeneration };