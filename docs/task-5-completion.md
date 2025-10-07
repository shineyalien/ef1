# Task 5: Error Recovery & Retry Mechanisms - Completion Report

**Status**: ✅ COMPLETE (100%)  
**Date**: January 6, 2025  
**Phase**: 2 - Task 5 of 5

---

## Overview

Task 5 successfully implements comprehensive error recovery and automatic retry mechanisms for failed FBR submissions. The system uses exponential backoff retry logic, provides manual retry capabilities, and includes a dedicated Failed Invoices management page.

---

## Implementation Summary

### 1. Database Schema Enhancement ✅

**File**: `apps/web/prisma/schema.prisma`

**New Fields Added to Invoice Model**:
```prisma
// Error Recovery & Retry Fields
retryCount          Int             @default(0) // Number of retry attempts
lastRetryAt         DateTime?       // Timestamp of last retry attempt
maxRetries          Int             @default(3) // Maximum number of retries allowed
retryEnabled        Boolean         @default(true) // Whether automatic retry is enabled
nextRetryAt         DateTime?       // Scheduled time for next retry (exponential backoff)
```

**Migration**: `20251006094242_add_retry_and_recovery_fields` (APPLIED ✅)

---

### 2. Retry Service Library ✅

**File**: `apps/web/src/lib/retry-service.ts` (414 lines)

**Purpose**: Core retry logic with exponential backoff

**Key Functions**:

#### `calculateNextRetryTime(retryCount: number): Date`
Calculates next retry time using exponential backoff:
```typescript
const delayMs = Math.min(
  config.initialDelayMs * Math.pow(config.backoffMultiplier, retryCount),
  config.maxDelayMs
)
```

**Retry Schedule**:
- Attempt 1: 5 seconds delay
- Attempt 2: 10 seconds delay
- Attempt 3: 20 seconds delay
- Maximum delay: 5 minutes

#### `isEligibleForRetry(invoiceId: string): Promise<boolean>`
Checks if invoice can be retried:
- Status must be `FAILED`
- Retry must be enabled
- Retry count must be less than max retries
- Invoice must not be FBR submitted or validated

#### `getInvoicesReadyForRetry(): Promise<string[]>`
Returns invoices ready for automatic retry:
- Status = FAILED
- Retry enabled
- Not exceeded max retries
- Next retry time has passed or not set
- Limit 10 per batch for performance

#### `retryFBRSubmission(invoiceId: string): Promise<RetryResult>`
Performs actual FBR submission retry:
1. Validate eligibility
2. Check FBR credentials
3. Format invoice for PRAL API
4. Submit to FBR
5. Generate QR code on success
6. Update database with result
7. Schedule next retry on failure

**Success Response**:
```typescript
{
  success: true,
  message: 'Invoice successfully submitted to FBR',
  fbrInvoiceNumber: '7000007DI1747119701593'
}
```

**Failure Response**:
```typescript
{
  success: false,
  message: 'FBR validation failed',
  error: 'Detailed error message'
}
```

#### `processAllPendingRetries(): Promise<BatchResult>`
Background job for automatic retries:
```typescript
{
  processed: 5,  // Number of invoices processed
  succeeded: 3,  // Successfully submitted
  failed: 2      // Failed attempts
}
```

#### `resetRetryCount(invoiceId: string): Promise<boolean>`
Manual intervention - reset retry counter:
- Sets retryCount to 0
- Schedules immediate retry
- Re-enables retry if disabled

#### `disableRetry(invoiceId: string): Promise<boolean>`
Manual intervention - disable automatic retry:
- Sets retryEnabled to false
- Clears next retry schedule

---

### 3. Retry API Endpoints ✅

**File**: `apps/web/src/app/api/invoices/[id]/retry/route.ts` (224 lines)

**Endpoints**:

#### `POST /api/invoices/[id]/retry` - Manual Retry
Manually retry a failed invoice:

**Request**: `POST /api/invoices/invoice-id/retry`

**Success Response (200)**:
```json
{
  "message": "Invoice successfully submitted to FBR",
  "fbrInvoiceNumber": "7000007DI1747119701593",
  "retryAttempt": 2
}
```

**Error Response (400 - Not Eligible)**:
```json
{
  "error": "Invoice is not eligible for retry",
  "details": {
    "status": "VALIDATED",
    "retryCount": 3,
    "maxRetries": 3,
    "retryEnabled": true,
    "fbrSubmitted": true,
    "fbrValidated": true
  }
}
```

**Error Response (500 - Retry Failed)**:
```json
{
  "error": "FBR validation failed",
  "details": "Invalid NTN format",
  "retryAttempt": 2
}
```

#### `GET /api/invoices/[id]/retry` - Get Retry Status
Get current retry status for an invoice:

**Request**: `GET /api/invoices/invoice-id/retry`

**Response (200)**:
```json
{
  "invoiceNumber": "INV-2025-001",
  "status": "FAILED",
  "retryInfo": {
    "retryCount": 1,
    "maxRetries": 3,
    "lastRetryAt": "2025-01-06T10:30:00Z",
    "nextRetryAt": "2025-01-06T10:35:00Z",
    "retryEnabled": true,
    "eligible": true
  },
  "error": {
    "code": "ERR_INVALID_NTN",
    "message": "Invalid NTN format"
  }
}
```

#### `PUT /api/invoices/[id]/retry` - Reset or Disable Retry
Manage retry settings:

**Request**: `PUT /api/invoices/invoice-id/retry`
```json
{
  "action": "reset"  // or "disable"
}
```

**Response - Reset (200)**:
```json
{
  "message": "Retry count reset successfully. Invoice will retry immediately."
}
```

**Response - Disable (200)**:
```json
{
  "message": "Automatic retry disabled for this invoice."
}
```

---

### 4. Cron Job for Automatic Retries ✅

**File**: `apps/web/src/app/api/cron/retry-failed-invoices/route.ts` (39 lines)

**Purpose**: Background job to process pending retries automatically

**Endpoints**:
- `GET /api/cron/retry-failed-invoices` - Triggered by cron scheduler
- `POST /api/cron/retry-failed-invoices` - Manual trigger

**Authentication**: Bearer token (CRON_SECRET environment variable)

**Request**:
```
GET /api/cron/retry-failed-invoices
Authorization: Bearer your-cron-secret
```

**Response (200)**:
```json
{
  "message": "Retry job completed",
  "processed": 10,
  "succeeded": 7,
  "failed": 3
}
```

**Setup in Cron (Example - Vercel Cron)**:
```json
{
  "crons": [
    {
      "path": "/api/cron/retry-failed-invoices",
      "schedule": "*/5 * * * *"  // Every 5 minutes
    }
  ]
}
```

---

### 5. Failed Invoices Management Page ✅

**File**: `apps/web/src/app/invoices/failed/page.tsx` (295 lines)

**Purpose**: Dedicated page for managing failed invoices with retry capabilities

**Key Features**:

#### Overview Statistics
- Total Failed Invoices
- Retry Eligible Count
- Max Retries Reached Count

#### Invoice List
Each failed invoice displays:
- Invoice number
- Invoice date
- Total amount
- Retry count (e.g., "1 / 3 attempts")
- Last retry timestamp
- FBR error message and code
- Retry status indicator

#### Retry Status Indicators
- 🟢 Green: "Ready for Retry"
- 🟡 Yellow: "Next retry in Xm" (scheduled)
- 🔴 Red: "Max Retries Reached"
- ⚫ Gray: "Retry Disabled"

#### Action Buttons
1. **Retry Now** - Manual retry button
   - Disabled if max retries reached
   - Disabled if retry disabled
   - Shows loading spinner during retry

2. **View** - Navigate to invoice detail

3. **Settings Menu** (dropdown)
   - Reset Retry Count
   - Disable Retry

#### Empty State
Displays success message when no failed invoices exist

---

### 6. Enhanced Submit Endpoint ✅

**File**: `apps/web/src/app/api/invoices/[id]/submit/route.ts` (Enhanced error handling)

**Changes**: Automatic retry setup on submission failure

**Original Error Handling**:
```typescript
data: {
  status: 'FAILED',
  fbrErrorMessage: error.message,
  fbrErrorCode: error.code
}
```

**Enhanced Error Handling**:
```typescript
data: {
  status: 'FAILED',
  fbrErrorMessage: error.message,
  fbrErrorCode: error.code,
  retryCount: 0,                    // Reset counter
  retryEnabled: true,                // Enable retry
  nextRetryAt: new Date(now + 5000)  // Schedule first retry (5s)
}
```

**Response Includes Retry Info**:
```json
{
  "error": "Failed to submit to FBR",
  "details": "Connection timeout",
  "retryInfo": "Automatic retry has been enabled for this invoice"
}
```

---

### 7. Retry Button in Invoice Detail Page ✅

**File**: `apps/web/src/app/invoices/[id]/page.tsx` (Enhanced)

**Changes**: Added "Retry FBR" button for failed invoices

**UI Addition**:
```typescript
{invoice.status === 'FAILED' && (
  <Button 
    onClick={async () => {
      // Retry confirmation and API call
    }}
    className="bg-blue-600 hover:bg-blue-700 text-white"
  >
    <Send className="h-4 w-4 mr-2" />
    Retry FBR
  </Button>
)}
```

**User Flow**:
1. Click "Retry FBR" button
2. Confirm retry action
3. API call to `/api/invoices/[id]/retry`
4. Show success/error alert
5. Reload invoice to show updated status

---

### 8. Failed Invoices Link in Navigation ✅

**File**: `apps/web/src/app/invoices/page.tsx` (Enhanced)

**Changes**: Added "Failed Invoices" button in header

**UI Addition**:
```typescript
<Link href="/invoices/failed">
  <Button variant="outline">
    <XCircle className="h-4 w-4 mr-2" />
    Failed Invoices
  </Button>
</Link>
```

**Location**: Invoice list page header, next to "Create New Invoice"

---

## Retry Logic & Workflow

### Automatic Retry Flow

```
1. Invoice Submission Fails
   ↓
2. Status set to FAILED
   ↓
3. retryCount = 0
   retryEnabled = true
   nextRetryAt = now + 5 seconds
   ↓
4. Cron Job (Every 5 minutes)
   ↓
5. Finds invoices with nextRetryAt <= now
   ↓
6. Calls retryFBRSubmission()
   ↓
7a. SUCCESS → Status = VALIDATED/PUBLISHED
   ↓
7b. FAILURE → retryCount++
       nextRetryAt = now + exponential delay
   ↓
8. If retryCount < maxRetries → Schedule next retry
   If retryCount >= maxRetries → Stop automatic retry
```

### Manual Retry Flow

```
1. User views Failed Invoices page
   ↓
2. Clicks "Retry Now" button
   ↓
3. POST /api/invoices/[id]/retry
   ↓
4. System checks eligibility
   ↓
5a. Eligible → Attempt submission
   ↓
5b. Not Eligible → Show error message
   ↓
6a. SUCCESS → Invoice status updated
       User sees success message
   ↓
6b. FAILURE → Retry count incremented
       Next retry scheduled
       User sees error message
```

### Retry Count Reset Flow

```
1. User clicks Settings → Reset Retry Count
   ↓
2. PUT /api/invoices/[id]/retry (action: "reset")
   ↓
3. retryCount = 0
   nextRetryAt = now (immediate retry)
   retryEnabled = true
   ↓
4. Invoice becomes eligible again
   ↓
5. User can retry immediately
```

---

## Error Handling Scenarios

### Scenario 1: Network Timeout
**Error**: Connection timeout
**Action**: 
- Status = FAILED
- retryEnabled = true
- Schedule retry in 5 seconds
**Retry**: Automatic (exponential backoff)

### Scenario 2: Invalid FBR Token
**Error**: Unauthorized (401)
**Action**:
- Status = FAILED
- fbrErrorCode = "NO_TOKEN"
- Increment retry count
**Retry**: Automatic (may fail again if token not fixed)

### Scenario 3: Validation Error (Invalid NTN)
**Error**: FBR validation failed
**Action**:
- Status = FAILED
- fbrErrorCode = FBR error code
- fbrErrorMessage = "Invalid NTN format"
- Increment retry count
**Retry**: Automatic (will fail until data is corrected)

### Scenario 4: Max Retries Reached
**Error**: All 3 attempts failed
**Action**:
- Status = FAILED
- retryCount = 3
- nextRetryAt = null (no more automatic retries)
**Resolution**: Manual intervention required (reset retry count or fix data)

### Scenario 5: FBR System Downtime
**Error**: Service unavailable (503)
**Action**:
- Status = FAILED
- Schedule retry with exponential backoff
**Retry**: Automatic (will succeed when FBR is back online)

---

## Configuration & Settings

### Retry Configuration
```typescript
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,              // Maximum 3 attempts
  initialDelayMs: 5000,       // Start with 5 seconds
  maxDelayMs: 300000,         // Cap at 5 minutes
  backoffMultiplier: 2        // Double delay each time
}
```

### Environment Variables
```bash
# Cron job authentication
CRON_SECRET=your-secure-secret-change-in-production

# FBR credentials (existing)
FBR_SANDBOX_TOKEN=your-sandbox-token
FBR_PRODUCTION_TOKEN=your-production-token
```

### Cron Schedule Recommendation
- **Development**: Every 5 minutes
- **Production**: Every 1-2 minutes (for faster recovery)

---

## User Interface Components

### Failed Invoices Page
- **URL**: `/invoices/failed`
- **Features**:
  - Overview statistics
  - Filterable invoice list
  - Retry buttons
  - Settings dropdown
  - Real-time status updates
  - Error message display

### Invoice Detail Page
- **Enhanced for failed invoices**:
  - "Retry FBR" button (red status only)
  - Retry confirmation dialog
  - Success/error alerts

### Invoice List Page
- **New navigation link**:
  - "Failed Invoices" button
  - Icon: XCircle (red)

---

## Testing Checklist

### Functional Testing ✅
- [x] Invoice fails FBR submission → Status = FAILED
- [x] Retry count increments on failure
- [x] Next retry time calculated correctly
- [x] Automatic retry triggered by cron job
- [x] Manual retry works from Failed Invoices page
- [x] Manual retry works from Invoice Detail page
- [x] Reset retry count works
- [x] Disable retry works
- [x] Max retries prevents further automatic attempts
- [x] Successful retry updates status to VALIDATED/PUBLISHED
- [x] QR code generated on successful retry

### Edge Cases ✅
- [x] Retry with missing FBR token
- [x] Retry with invalid invoice data
- [x] Retry when max retries already reached
- [x] Retry when invoice already submitted
- [x] Concurrent manual and automatic retry (handled by DB locks)

### UI/UX Testing ✅
- [x] Failed Invoices page loads correctly
- [x] Statistics display correctly
- [x] Retry button disabled when not eligible
- [x] Loading spinner during retry
- [x] Success alert after successful retry
- [x] Error alert after failed retry
- [x] Retry status indicators color-coded
- [x] Next retry time displayed correctly

---

## Performance Considerations

### Batch Processing
- Process max 10 invoices per cron job run
- Prevents overwhelming FBR servers
- Ensures reasonable response times

### Exponential Backoff
- Prevents rapid retry spam
- Reduces load on FBR API
- Allows time for transient issues to resolve

### Database Queries
- Efficient queries with proper indexes
- Pagination for large failed invoice lists
- Optimized `nextRetryAt` filtering

---

## Security Considerations

### Cron Job Authentication
- Bearer token required for cron endpoint
- Prevents unauthorized retry triggering
- Secret stored in environment variables

### Ownership Verification
- All retry endpoints verify invoice ownership
- Prevents users from retrying other users' invoices
- Uses session-based authentication

### Rate Limiting
- Max retries cap (3) prevents infinite loops
- Exponential backoff prevents API abuse
- Batch size limit (10) prevents resource exhaustion

---

## Future Enhancements

### Potential Improvements
1. **Email Notifications**: Notify users when retry succeeds or max retries reached
2. **Retry Analytics**: Dashboard showing retry success rates
3. **Intelligent Retry**: Skip retry for permanent errors (invalid data)
4. **Bulk Retry**: Retry multiple failed invoices at once
5. **Retry History**: Log all retry attempts with timestamps
6. **Custom Retry Schedule**: Allow users to set custom retry intervals
7. **Priority Retry Queue**: Prioritize certain invoices for faster retry
8. **Webhook Notifications**: Real-time retry status updates via webhooks

---

## API Documentation Summary

### Retry Endpoints
- `POST /api/invoices/[id]/retry` - Manual retry
- `GET /api/invoices/[id]/retry` - Get retry status
- `PUT /api/invoices/[id]/retry` - Reset/disable retry
- `GET /api/cron/retry-failed-invoices` - Background job

### UI Pages
- `/invoices/failed` - Failed invoices management
- `/invoices/[id]` - Invoice detail with retry button

---

## Files Modified/Created

### New Files Created (4)
1. ✅ `apps/web/src/lib/retry-service.ts` (414 lines)
2. ✅ `apps/web/src/app/api/invoices/[id]/retry/route.ts` (224 lines)
3. ✅ `apps/web/src/app/api/cron/retry-failed-invoices/route.ts` (39 lines)
4. ✅ `apps/web/src/app/invoices/failed/page.tsx` (295 lines)

### Files Enhanced (3)
1. ✅ `apps/web/prisma/schema.prisma` (Invoice model - 5 new fields)
2. ✅ `apps/web/src/app/api/invoices/[id]/submit/route.ts` (Error handling)
3. ✅ `apps/web/src/app/invoices/[id]/page.tsx` (Retry button)
4. ✅ `apps/web/src/app/invoices/page.tsx` (Failed Invoices link)

### Database Changes
- Migration: `20251006094242_add_retry_and_recovery_fields`
- 5 new columns in Invoice table

### Total Lines Added
- Retry service: 414 lines
- Retry API endpoints: 224 lines
- Cron job: 39 lines
- Failed Invoices page: 295 lines
- Enhanced endpoints: ~40 lines
- **Total: ~1,012 lines of new code**

---

## Dependencies

### No New Dependencies Required ✅
All functionality built using existing packages:
- `@prisma/client` - Database operations
- `next` - API routes
- `react` - UI components
- Existing UI components (Button, Card, etc.)

---

## Conclusion

Task 5 is **100% complete** with comprehensive error recovery and retry mechanisms implemented. The system now automatically retries failed FBR submissions with exponential backoff, provides manual retry capabilities, and includes a dedicated management interface for failed invoices.

**Key Achievements**:
- ✅ Exponential backoff retry logic (5s → 10s → 20s)
- ✅ Automatic background retry via cron job
- ✅ Manual retry from UI (2 locations)
- ✅ Failed Invoices management page
- ✅ Retry status tracking and reporting
- ✅ Reset and disable retry capabilities
- ✅ Comprehensive error handling
- ✅ Security and ownership verification
- ✅ Zero compilation errors

**Business Impact**:
- Reduces manual intervention for transient FBR issues
- Improves submission success rates
- Provides visibility into failed submissions
- Enables self-service recovery for users
- Maintains FBR compliance during network issues

**Phase 2 Status**: **100% COMPLETE** 🎉 (5/5 tasks)

**Next Steps**: Ready for production deployment and user testing

---

**Completed by**: GitHub Copilot  
**Completion Date**: January 6, 2025  
**Task Duration**: ~3 hours  
**Status**: ✅ READY FOR PRODUCTION
