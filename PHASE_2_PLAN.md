# Phase 2 Implementation Plan

## Overview
**Goal**: Complete essential business features and settings management

**Duration**: Estimated 2-3 weeks

**Priority**: Critical features that users need for daily operations

---

## 🎯 Phase 2 Objectives

### Primary Goals
1. ✅ Complete Settings Management (FBR + Business + Profile)
2. ✅ Invoice Deletion (with proper constraints)
3. ✅ Error Recovery & Retry Mechanisms
4. ✅ Bulk Operations (CSV import & batch submission)

### Secondary Goals
1. Email delivery for invoices
2. Enhanced analytics dashboard
3. Customer portal basics
4. Payment tracking

---

## 📋 Phase 2 Task Breakdown

### **Task 1: FBR Settings Page** 🔴 CRITICAL
**Priority**: Highest - Users need to manage tokens

**File**: `apps/web/src/app/settings/fbr/page.tsx`

**Features to Implement:**
1. **Token Management**
   - Display current tokens (masked)
   - Add/update sandbox token
   - Add/update production token
   - Token validation (test connection)
   - Token expiry tracking

2. **Environment Switching**
   - Current mode indicator (LOCAL/SANDBOX/PRODUCTION)
   - Switch between modes with validation
   - Warning before switching to production

3. **Connection Testing**
   - Test sandbox connection
   - Test production connection
   - Display FBR API status

4. **Submission History**
   - Total submissions (sandbox vs production)
   - Success rate
   - Last submission timestamp
   - Failed submissions count

**UI Components:**
```tsx
<Card>
  <CardHeader>FBR Integration Status</CardHeader>
  <CardContent>
    <div>Mode: {integrationMode}</div>
    <div>Sandbox Token: {maskedToken}</div>
    <Button>Test Connection</Button>
    <Button>Switch to Production</Button>
  </CardContent>
</Card>
```

**Database Updates Needed:**
- `Business.sandboxTokenValidated` (Boolean)
- `Business.productionTokenValidated` (Boolean)
- `Business.lastTokenValidation` (DateTime)

**Time Estimate**: 2-3 hours

---

### **Task 2: Business Settings Page** 🟡 IMPORTANT
**Priority**: High - Branding and customization

**File**: `apps/web/src/app/settings/business/page.tsx`

**Features to Implement:**
1. **Company Information**
   - Edit company name, NTN, address
   - Province selection
   - Business type and sector
   - Contact details

2. **Logo Upload**
   - Upload company logo
   - Preview before save
   - Store in S3 or local storage
   - Use in PDF invoices

3. **Invoice Customization**
   - Invoice number prefix
   - Default tax rates
   - Default payment terms
   - Invoice footer text

4. **Email Configuration**
   - SMTP settings for email delivery
   - From email address
   - Email templates

**UI Components:**
```tsx
<Card>
  <CardHeader>Company Logo</CardHeader>
  <CardContent>
    <input type="file" accept="image/*" />
    <img src={logoPreview} />
    <Button>Upload Logo</Button>
  </CardContent>
</Card>
```

**Database Updates Needed:**
- `Business.logoUrl` (String)
- `Business.invoicePrefix` (String)
- `Business.defaultPaymentTerms` (String)
- `Business.footerText` (String)

**Time Estimate**: 3-4 hours

---

### **Task 3: Profile Settings Page** ✅ EXISTS (Enhancement)
**Priority**: Medium - Already functional, needs minor updates

**File**: `apps/web/src/app/settings/profile/page.tsx`

**Current Status**: Basic profile editing exists

**Enhancements Needed:**
1. Password change functionality
2. Two-factor authentication (optional)
3. Session management
4. Activity log

**Time Estimate**: 1-2 hours

---

### **Task 4: Invoice Deletion** 🟡 IMPORTANT
**Priority**: High - Users need to clean up drafts

**Implementation:**
1. **Soft Delete** (recommended for audit trail)
   - Add `deletedAt` field to Invoice schema
   - Filter out deleted invoices in queries
   - Admin can restore if needed

2. **Constraints**
   - ✅ Can delete: DRAFT status only
   - ❌ Cannot delete: SUBMITTED, VALIDATED, PUBLISHED
   - ❌ Cannot delete: FBR submitted invoices

**Files to Update:**
- `apps/web/src/app/api/invoices/[id]/route.ts` - Add DELETE endpoint
- `apps/web/src/app/invoices/[id]/page.tsx` - Add delete button
- `prisma/schema.prisma` - Add `deletedAt DateTime?` to Invoice

**UI Flow:**
```tsx
{invoice.status === 'DRAFT' && !invoice.fbrSubmitted && (
  <Button 
    variant="destructive" 
    onClick={handleDelete}
  >
    Delete Draft
  </Button>
)}
```

**Time Estimate**: 1-2 hours

---

### **Task 5: Error Recovery & Retry** 🟡 IMPORTANT
**Priority**: High - Handle failed FBR submissions

**Features:**
1. **Failed Submissions Dashboard**
   - List all failed FBR submissions
   - Display error messages
   - Filter by error type

2. **Retry Mechanism**
   - Retry single invoice
   - Bulk retry all failed
   - Edit invoice before retry

3. **Error Log**
   - Store FBR error responses
   - Track retry attempts
   - Success after retry

**Database Updates:**
```prisma
model SubmissionError {
  id          String   @id @default(cuid())
  invoiceId   String
  errorCode   String
  errorMessage String
  retryCount  Int      @default(0)
  resolvedAt  DateTime?
  createdAt   DateTime @default(now())
  
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])
}
```

**Time Estimate**: 3-4 hours

---

### **Task 6: Bulk Operations** 🟢 NICE-TO-HAVE
**Priority**: Medium - Advanced feature

**Features:**
1. **CSV/XLSX Import**
   - Download template
   - Upload file
   - Validate data
   - Show errors

2. **Batch Processing**
   - Create multiple invoices
   - Validate all
   - Submit to sandbox in bulk
   - Track progress

3. **Export**
   - Export invoices to CSV
   - Export FBR responses
   - Generate reports

**Files to Create:**
- `apps/web/src/app/bulk-operations/page.tsx` - Main page
- `apps/web/src/lib/csv-parser.ts` - CSV parsing
- `apps/web/src/app/api/bulk/import/route.ts` - Import API
- `apps/web/src/app/api/bulk/submit/route.ts` - Batch submit API

**Time Estimate**: 4-6 hours

---

### **Task 7: Email Delivery** 🟢 NICE-TO-HAVE
**Priority**: Low - Advanced feature

**Features:**
1. Send invoice PDF to customer email
2. Email templates
3. Delivery tracking
4. Automatic sending after FBR submission

**Libraries:**
- `nodemailer` for SMTP
- `@sendgrid/mail` for SendGrid
- `mjml` for email templates

**Time Estimate**: 3-4 hours

---

## 🗓️ Implementation Timeline

### Week 1 (Critical Features)
- **Day 1-2**: FBR Settings Page (Task 1)
- **Day 3-4**: Business Settings Page (Task 2)
- **Day 5**: Invoice Deletion (Task 4)

### Week 2 (Important Features)
- **Day 1-2**: Error Recovery & Retry (Task 5)
- **Day 3-4**: Bulk Operations (Task 6)
- **Day 5**: Testing & Bug Fixes

### Week 3 (Nice-to-Have)
- **Day 1-2**: Email Delivery (Task 7)
- **Day 3-4**: Enhanced Analytics
- **Day 5**: Final Testing & Documentation

---

## 📦 Dependencies to Install

```bash
# For file uploads
npm install multer @types/multer

# For CSV parsing
npm install papaparse @types/papaparse

# For Excel files
npm install xlsx

# For email (optional)
npm install nodemailer @types/nodemailer

# For image processing
npm install sharp
```

---

## 🗃️ Database Migrations Needed

### Migration 1: Settings Enhancements
```sql
-- Add to Business table
ALTER TABLE "Business" ADD COLUMN "logoUrl" TEXT;
ALTER TABLE "Business" ADD COLUMN "invoicePrefix" TEXT DEFAULT 'INV';
ALTER TABLE "Business" ADD COLUMN "defaultPaymentTerms" TEXT;
ALTER TABLE "Business" ADD COLUMN "footerText" TEXT;
ALTER TABLE "Business" ADD COLUMN "sandboxTokenValidated" BOOLEAN DEFAULT false;
ALTER TABLE "Business" ADD COLUMN "productionTokenValidated" BOOLEAN DEFAULT false;
ALTER TABLE "Business" ADD COLUMN "lastTokenValidation" TIMESTAMP;
```

### Migration 2: Soft Delete
```sql
-- Add to Invoice table
ALTER TABLE "Invoice" ADD COLUMN "deletedAt" TIMESTAMP;
```

### Migration 3: Error Tracking
```sql
-- Create SubmissionError table
CREATE TABLE "SubmissionError" (
  "id" TEXT PRIMARY KEY,
  "invoiceId" TEXT NOT NULL,
  "errorCode" TEXT NOT NULL,
  "errorMessage" TEXT NOT NULL,
  "retryCount" INTEGER DEFAULT 0,
  "resolvedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id")
);
```

---

## ✅ Acceptance Criteria

### Task 1: FBR Settings ✅
- [ ] Users can add/update sandbox token
- [ ] Users can add/update production token
- [ ] Token validation works (test connection)
- [ ] Environment switching works
- [ ] Submission stats display correctly

### Task 2: Business Settings ✅
- [ ] Users can upload logo
- [ ] Logo appears in PDFs
- [ ] Invoice customization saves
- [ ] Company info updates

### Task 3: Profile Settings ✅
- [ ] Password change works
- [ ] Profile updates save
- [ ] Activity log displays

### Task 4: Invoice Deletion ✅
- [ ] Delete button shows for drafts only
- [ ] Delete confirmation modal appears
- [ ] Soft delete works
- [ ] Cannot delete submitted invoices

### Task 5: Error Recovery ✅
- [ ] Failed submissions display
- [ ] Retry single invoice works
- [ ] Bulk retry works
- [ ] Error logs saved

### Task 6: Bulk Operations ✅
- [ ] CSV template downloads
- [ ] File upload works
- [ ] Validation shows errors
- [ ] Batch processing completes

---

## 🎯 Success Metrics

**Code Quality:**
- All features covered by tests
- TypeScript strict mode enabled
- Error handling on all API calls
- Loading states for async operations

**User Experience:**
- Intuitive UI for settings
- Clear error messages
- Success confirmations
- Help tooltips where needed

**Performance:**
- Bulk operations handle 100+ invoices
- File uploads complete within 5 seconds
- API responses under 1 second

---

## 🚀 Let's Start!

**Recommended Order:**
1. **Start with Task 1** (FBR Settings) - Most critical
2. **Then Task 2** (Business Settings) - High impact
3. **Then Task 4** (Invoice Deletion) - Quick win
4. **Then Task 5** (Error Recovery) - Important safety net
5. **Finally Tasks 6-7** (Nice-to-have features)

---

**Ready to start with Task 1: FBR Settings Page?**

Let me know and I'll begin implementation! 🚀
