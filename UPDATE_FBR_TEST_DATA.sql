-- Update Invoice with FBR Test Data
-- Replace 'cmge0tc1l005ond5hyujk8lae' with your actual invoice ID if different

UPDATE "Invoice"
SET 
  "fbrInvoiceNumber" = '7000007DI1747119701593',
  "fbrSubmitted" = true,
  "fbrValidated" = true,
  "submissionTimestamp" = NOW()
WHERE "id" = 'cmge0tc1l005ond5hyujk8lae';

-- Update Business with FBR Optional Fields
-- This will add the electronic software registration number and footer text

UPDATE "Business"
SET 
  "electronicSoftwareRegNo" = 'ESR-2025-001234',
  "footerText" = 'Thank you for your business! For queries, contact support@test3business.com | Powered by Easy Filer'
WHERE "companyName" = 'Test3 Test Business';

-- Verify the updates
SELECT 
  "id",
  "invoiceNumber",
  "fbrInvoiceNumber",
  "fbrSubmitted",
  "fbrValidated",
  "submissionTimestamp"
FROM "Invoice"
WHERE "id" = 'cmge0tc1l005ond5hyujk8lae';

SELECT 
  "id",
  "companyName",
  "logoUrl",
  "electronicSoftwareRegNo",
  "footerText"
FROM "Business"
WHERE "companyName" = 'Test3 Test Business';
