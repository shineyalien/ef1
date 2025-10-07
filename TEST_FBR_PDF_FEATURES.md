// Test Utility: Populate Invoice with FBR Compliance Data
// Run this in Prisma Studio or via a test endpoint to see all FBR features in PDF

/**
 * This script demonstrates how to populate an invoice with FBR compliance data
 * to see all the new PDF features (logo, QR code, IRN, watermark, etc.)
 */

// Example: Update an existing invoice with FBR data
const updateInvoiceWithFBRData = async (prisma, invoiceId: string) => {
  
  // Step 1: Update business with logo and settings
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { business: true }
  })
  
  if (!invoice) {
    console.log('Invoice not found')
    return
  }
  
  // Update business with logo URL (use a sample logo or upload one)
  await prisma.business.update({
    where: { id: invoice.businessId },
    data: {
      logoUrl: 'https://via.placeholder.com/200x200.png?text=Company+Logo', // Replace with actual logo
      electronicSoftwareRegNo: 'ESR-2025-001234', // Sample registration number
      footerText: 'Thank you for your business! For support, contact us at support@yourcompany.com'
    }
  })
  
  // Step 2: Update invoice with FBR IRN and validation status
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      fbrInvoiceNumber: '7000007DI1747119701593', // Sample FBR IRN format
      fbrSubmitted: true,
      fbrValidated: true, // Set to true to see watermark
      submissionTimestamp: new Date(),
      fbrTimestamp: new Date().toISOString(),
      // QR code will be auto-generated from FBR IRN
    }
  })
  
  console.log('✅ Invoice updated with FBR compliance data!')
  console.log('Now download the PDF to see:')
  console.log('- Company logo in top-left corner')
  console.log('- QR code in top-right corner')
  console.log('- Prominent FBR IRN in green')
  console.log('- "FBR VALIDATED" watermark diagonally across page')
  console.log('- Custom footer text')
  console.log('- Electronic software registration number')
}

/**
 * Quick test via Prisma Studio:
 * 
 * 1. Open Prisma Studio: npx prisma studio
 * 2. Go to "Business" model
 * 3. Edit your business record:
 *    - logoUrl: Add a URL or Base64 image (e.g., https://via.placeholder.com/200x200.png)
 *    - electronicSoftwareRegNo: Add "ESR-2025-001234"
 *    - footerText: Add custom text
 * 
 * 4. Go to "Invoice" model
 * 5. Edit an invoice record:
 *    - fbrInvoiceNumber: Add "7000007DI1747119701593"
 *    - fbrSubmitted: Set to true
 *    - fbrValidated: Set to true
 *    - submissionTimestamp: Add current date
 * 
 * 6. Download PDF from Easy Filer UI
 * 7. You should now see all FBR compliance features!
 */

/**
 * Via SQL (alternative method):
 * 
 * -- Update business with logo and settings
 * UPDATE "Business"
 * SET 
 *   "logoUrl" = 'https://via.placeholder.com/200x200.png?text=Company+Logo',
 *   "electronicSoftwareRegNo" = 'ESR-2025-001234',
 *   "footerText" = 'Thank you for your business!'
 * WHERE "id" = 'your-business-id';
 * 
 * -- Update invoice with FBR data
 * UPDATE "Invoice"
 * SET 
 *   "fbrInvoiceNumber" = '7000007DI1747119701593',
 *   "fbrSubmitted" = true,
 *   "fbrValidated" = true,
 *   "submissionTimestamp" = NOW(),
 *   "fbrTimestamp" = NOW()
 * WHERE "id" = 'your-invoice-id';
 */

export default {
  updateInvoiceWithFBRData
}
