# PDF Generation Troubleshooting Guide

## Issue: "Failed to generate PDF" Error

If you're encountering the "Failed to generate PDF" error when trying to download invoices, follow this troubleshooting guide.

## 🔍 **Common Causes & Solutions**

### 1. **Missing Dependencies**
**Problem**: Required PDF generation libraries are not installed.

**Solution**:
```bash
cd apps/web
npm install @react-pdf/renderer
npm install react
```

### 2. **Database Connection Issues**
**Problem**: The PDF API cannot connect to the database to fetch invoice data.

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart if needed
docker-compose restart postgres

# Check database connection
cd apps/web
npm run test-db
```

### 3. **Authentication Issues**
**Problem**: User is not properly authenticated when accessing the PDF API.

**Solution**:
- Ensure you're logged in to the application
- Check if your session is still valid
- Try logging out and logging back in

### 4. **Invoice Data Issues**
**Problem**: Invoice data is incomplete or malformed.

**Solution**:
- Ensure the invoice has all required fields
- Check that customer information is complete
- Verify that line items have valid data

## 🛠️ **Testing PDF Generation**

### Method 1: Browser Console Test
1. Open the browser developer tools (F12)
2. Go to the invoices page
3. Click the PDF button
4. Check the Console tab for error messages
5. Check the Network tab for the API request status

### Method 2: Direct API Test
```bash
# Test the PDF API directly
curl -X GET "http://localhost:3000/api/invoices/[INVOICE_ID]/pdf" \
  -H "Cookie: [YOUR_SESSION_COOKIE]" \
  --output test.pdf
```

### Method 3: Test Script
```bash
cd apps/web
node test-pdf-generation.js
```

## 🔧 **Debugging Steps**

### Step 1: Check Server Logs
```bash
# Check Next.js development server logs
npm run dev

# Look for errors in the console output
```

### Step 2: Verify Database Schema
```bash
# Check if all required tables exist
cd apps/web
npx prisma db pull
npx prisma generate
```

### Step 3: Test Individual Components
```bash
# Test database connection
node test-db.js

# Test FBR integration
node test-fbr-api.js
```

## 📋 **PDF Template Options**

The system now includes multiple PDF templates:

### 1. **Simple Template** (Recommended)
- **File**: `apps/web/src/lib/pdf-generator-simple.tsx`
- **Features**: Clean, reliable, FBR-compliant
- **Usage**: Currently active and working

### 2. **Professional Template** (Advanced)
- **File**: `apps/web/src/lib/pdf-generator-v2.tsx`
- **Features**: Enhanced design, more comprehensive
- **Status**: Available but may need additional configuration

### 3. **Original Template** (Legacy)
- **File**: `apps/web/src/lib/pdf-generator.tsx`
- **Features**: Basic functionality
- **Status**: Fallback option

## 🔄 **Switching PDF Templates**

### To use the Professional Template:
```typescript
// In apps/web/src/app/api/invoices/[id]/pdf/route.ts
import { generateProfessionalInvoicePDFBlob } from '@/lib/pdf-generator-v2'
const pdfBlob = await generateProfessionalInvoicePDFBlob(invoiceData)
```

### To use the Simple Template (Current):
```typescript
// In apps/web/src/app/api/invoices/[id]/pdf/route.ts
import { generateSimpleInvoicePDFBlob } from '@/lib/pdf-generator-simple'
const pdfBlob = await generateSimpleInvoicePDFBlob(invoiceData)
```

## 🚨 **Error Messages & Solutions**

### "Failed to generate PDF"
**Cause**: General PDF generation failure
**Solution**: Check server logs, verify dependencies

### "Invoice not found"
**Cause**: Invoice ID doesn't exist or user doesn't have access
**Solution**: Verify invoice exists and user is authenticated

### "Unauthorized"
**Cause**: User is not logged in or doesn't have permission
**Solution**: Log in and ensure user has access to the invoice

### "Internal server error"
**Cause**: Server-side error during PDF generation
**Solution**: Check server logs for detailed error information

## 📊 **Performance Considerations**

### PDF Generation Time
- Simple template: ~1-2 seconds
- Professional template: ~2-3 seconds
- Large invoices (>50 items): May take longer

### Memory Usage
- PDF generation uses server memory
- Large invoices may require more memory
- Consider implementing pagination for very large invoices

## 🔒 **Security Notes**

### PDF Access Control
- Only authenticated users can generate PDFs
- Users can only access their own invoices
- PDF URLs are not publicly accessible

### Data Privacy
- Invoice data is processed server-side
- No sensitive data is exposed to client
- PDFs are generated on-demand

## 📞 **Getting Help**

### Check Logs First
Always check the server logs first for detailed error information.

### Common Debugging Commands
```bash
# Check all services
docker-compose ps

# Restart services
docker-compose restart

# Check database
docker-compose exec postgres psql -U postgres -d easyfiler_dev

# View logs
docker-compose logs -f web
```

### Report Issues
When reporting PDF generation issues, include:
1. Browser console errors
2. Server logs
3. Network request details
4. Invoice ID that failed
5. Steps to reproduce

## ✅ **Verification Checklist**

Before reporting an issue, verify:

- [ ] User is logged in
- [ ] Invoice exists in database
- [ ] Invoice has valid data
- [ ] Database is accessible
- [ ] All dependencies are installed
- [ ] Server is running without errors
- [ ] No browser console errors
- [ ] Network request is successful

## 🎯 **Quick Fix Script**

If you're still having issues, try this quick fix:

```bash
# 1. Clean and reinstall dependencies
cd apps/web
rm -rf node_modules package-lock.json
npm install

# 2. Regenerate Prisma client
npx prisma generate

# 3. Restart development server
npm run dev

# 4. Test with a simple invoice
# Create a new invoice with minimal data
# Try generating PDF for that invoice
```

This should resolve most PDF generation issues. If problems persist, check the server logs for specific error messages.