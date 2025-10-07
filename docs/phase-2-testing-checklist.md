# Phase 2 Testing Checklist

**Testing Date**: January 6, 2025  
**Tester**: _________________  
**Environment**: Development (localhost:3000)

---

## Pre-Testing Setup

- [x] Dev server running at http://localhost:3000
- [ ] Logged into the application
- [ ] Have test business setup
- [ ] Have test invoices created

---

## Test 1: FBR Settings (/settings/fbr)

### Test Cases

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 1.1 | Navigate to FBR Settings | Page loads successfully | ⬜ Pass ⬜ Fail | |
| 1.2 | Enter sandbox token | Token field accepts input | ⬜ Pass ⬜ Fail | |
| 1.3 | Toggle show/hide password | Token visibility toggles | ⬜ Pass ⬜ Fail | |
| 1.4 | Click "Test Connection" | Shows validation result | ⬜ Pass ⬜ Fail | |
| 1.5 | View FBR Statistics | Shows 7 metrics correctly | ⬜ Pass ⬜ Fail | |
| 1.6 | Try to add production token | Shows sandbox requirement warning | ⬜ Pass ⬜ Fail | |
| 1.7 | Save settings | Success message appears | ⬜ Pass ⬜ Fail | |

**Overall Status**: ⬜ Pass ⬜ Fail  
**Issues Found**: _____________________________

---

## Test 2: Business Settings (/settings/business)

### Test Cases

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 2.1 | Navigate to Business Settings | Page loads successfully | ⬜ Pass ⬜ Fail | |
| 2.2 | Upload company logo (valid file) | Logo preview appears | ⬜ Pass ⬜ Fail | |
| 2.3 | Upload invalid file (>2MB) | Error message shown | ⬜ Pass ⬜ Fail | |
| 2.4 | Set invoice prefix | Prefix saved correctly | ⬜ Pass ⬜ Fail | |
| 2.5 | Add payment terms | Terms saved correctly | ⬜ Pass ⬜ Fail | |
| 2.6 | Add footer text | Footer saved correctly | ⬜ Pass ⬜ Fail | |
| 2.7 | Choose primary color | Color picker works | ⬜ Pass ⬜ Fail | |
| 2.8 | Choose secondary color | Color picker works | ⬜ Pass ⬜ Fail | |
| 2.9 | Save all changes | Success message appears | ⬜ Pass ⬜ Fail | |
| 2.10 | Reload page | Settings persist | ⬜ Pass ⬜ Fail | |

**Overall Status**: ⬜ Pass ⬜ Fail  
**Issues Found**: _____________________________

---

## Test 3: Profile Settings (/settings/profile)

### Test Cases

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 3.1 | Navigate to Profile Settings | Page loads successfully | ⬜ Pass ⬜ Fail | |
| 3.2 | Toggle Email Notifications | Switch changes & auto-saves | ⬜ Pass ⬜ Fail | |
| 3.3 | Toggle Invoice Notifications | Switch changes & auto-saves | ⬜ Pass ⬜ Fail | |
| 3.4 | Toggle FBR Notifications | Switch changes & auto-saves | ⬜ Pass ⬜ Fail | |
| 3.5 | Toggle Marketing Emails | Switch changes & auto-saves | ⬜ Pass ⬜ Fail | |
| 3.6 | See "Auto-saved" indicator | Green indicator appears | ⬜ Pass ⬜ Fail | |
| 3.7 | Click Security Settings link | Security page loads | ⬜ Pass ⬜ Fail | |

### Password Change Tests

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 3.8 | Enter weak password | Validation error shown | ⬜ Pass ⬜ Fail | |
| 3.9 | Enter strong password | Passes validation | ⬜ Pass ⬜ Fail | |
| 3.10 | Mismatched passwords | Error shown | ⬜ Pass ⬜ Fail | |
| 3.11 | Wrong current password | Error shown | ⬜ Pass ⬜ Fail | |
| 3.12 | Correct password change | Success message appears | ⬜ Pass ⬜ Fail | |
| 3.13 | Login with new password | Login successful | ⬜ Pass ⬜ Fail | |

**Overall Status**: ⬜ Pass ⬜ Fail  
**Issues Found**: _____________________________

---

## Test 4: Invoice Deletion

### Test Cases

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 4.1 | Navigate to Invoices page | Page loads with invoice list | ⬜ Pass ⬜ Fail | |
| 4.2 | Find DRAFT invoice | Delete button visible | ⬜ Pass ⬜ Fail | |
| 4.3 | Click Delete button | Confirmation dialog appears | ⬜ Pass ⬜ Fail | |
| 4.4 | Click Cancel | Dialog closes, no deletion | ⬜ Pass ⬜ Fail | |
| 4.5 | Click Delete in dialog | Invoice deleted | ⬜ Pass ⬜ Fail | |
| 4.6 | Check invoice list | Invoice removed from list | ⬜ Pass ⬜ Fail | |
| 4.7 | Try delete SUBMITTED invoice | Delete button not visible | ⬜ Pass ⬜ Fail | |
| 4.8 | Try delete VALIDATED invoice | Delete button not visible | ⬜ Pass ⬜ Fail | |
| 4.9 | View invoice detail page | Delete button in failed invoices | ⬜ Pass ⬜ Fail | |

**Overall Status**: ⬜ Pass ⬜ Fail  
**Issues Found**: _____________________________

---

## Test 5: Error Recovery & Retry

### Test Cases

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 5.1 | Navigate to Invoices page | "Failed Invoices" button visible | ⬜ Pass ⬜ Fail | |
| 5.2 | Click "Failed Invoices" | Failed invoices page loads | ⬜ Pass ⬜ Fail | |
| 5.3 | View statistics | Shows Total/Eligible/Max Retries | ⬜ Pass ⬜ Fail | |
| 5.4 | View failed invoice card | Shows error message & status | ⬜ Pass ⬜ Fail | |
| 5.5 | Click "Retry Now" | Shows loading spinner | ⬜ Pass ⬜ Fail | |
| 5.6 | Wait for retry result | Success/error alert appears | ⬜ Pass ⬜ Fail | |
| 5.7 | Successful retry | Invoice removed from failed list | ⬜ Pass ⬜ Fail | |
| 5.8 | Failed retry | Retry count increments | ⬜ Pass ⬜ Fail | |
| 5.9 | Click Settings dropdown | Menu appears with options | ⬜ Pass ⬜ Fail | |
| 5.10 | Reset retry count | Count resets to 0 | ⬜ Pass ⬜ Fail | |
| 5.11 | Disable retry | Status changes to "Disabled" | ⬜ Pass ⬜ Fail | |
| 5.12 | Max retries reached | "Max Retries Reached" status | ⬜ Pass ⬜ Fail | |

**Overall Status**: ⬜ Pass ⬜ Fail  
**Issues Found**: _____________________________

---

## Test 6: Retry API Endpoints (Optional - Advanced)

### Test Cases

| # | Test Case | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 6.1 | GET /api/invoices/[id]/retry | Returns retry status | ⬜ Pass ⬜ Fail | |
| 6.2 | POST /api/invoices/[id]/retry | Triggers manual retry | ⬜ Pass ⬜ Fail | |
| 6.3 | PUT /api/invoices/[id]/retry (reset) | Resets retry count | ⬜ Pass ⬜ Fail | |
| 6.4 | PUT /api/invoices/[id]/retry (disable) | Disables retry | ⬜ Pass ⬜ Fail | |

**Testing Tool**: Postman, Thunder Client, or browser DevTools  
**Overall Status**: ⬜ Pass ⬜ Fail  
**Issues Found**: _____________________________

---

## Cross-Browser Testing (Optional)

| Browser | Version | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | Overall |
|---------|---------|--------|--------|--------|--------|--------|---------|
| Chrome  |         | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Firefox |         | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Edge    |         | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Safari  |         | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## Mobile Responsiveness (Optional)

| Device | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | Overall |
|--------|--------|--------|--------|--------|--------|---------|
| iPhone |  ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Android |  ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Tablet |  ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## Known Issues

### Issue 1: PDF Generation Error ✅ FIXED
**Status**: ✅ **FIXED** (October 6, 2025)  
**Description**: React component error in PDF generation  
**File**: `apps/web/src/app/api/invoices/[id]/pdf/route.tsx`  
**Error**: Minified React error #31  
**Impact**: Medium - PDF download not working  
**Priority**: High  
**Fix Applied**: Yes - Changed from `renderToStream()` to `pdf().toBlob()` pattern  
**Documentation**: See `docs/bugfix-pdf-generation.md` for details  
**Testing Required**: ⚠️ Manual testing needed to confirm fix works

### Issue 2: [Add if found]
**Status**: ⬜  
**Description**: _____________________________  
**Impact**: _____________________________  
**Priority**: _____________________________  

---

## Summary

**Total Tests**: 63  
**Tests Passed**: _____ / 63  
**Tests Failed**: _____ / 63  
**Success Rate**: _____ %

**Critical Issues**: _____  
**Major Issues**: _____  
**Minor Issues**: _____

**Overall Assessment**: ⬜ Ready for Production ⬜ Needs Fixes

---

## Tester Notes

_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

---

## Next Steps

- [ ] Fix identified issues
- [ ] Re-test failed cases
- [ ] Update documentation
- [ ] Prepare for deployment
- [ ] Schedule user acceptance testing

**Signed**: _________________  
**Date**: _________________
