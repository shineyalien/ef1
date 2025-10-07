# Submit to FBR Button Restoration

## Change Made

**Restored "Submit to FBR" button to Invoice List Page**

### What Was Done
- Added back the "Submit to FBR" button on the invoice list page (`/invoices`)
- Only removed it from the invoice create/form page (as originally requested)

### Button Details

**Location**: Invoice list page - action buttons for each invoice

**Condition**: Only shows if invoice has NOT been submitted to FBR
```tsx
{!invoice.fbrSubmitted && (
  <Button 
    size="sm"
    onClick={() => handleSubmitToFBR(invoice.id)}
    className="bg-blue-600 hover:bg-blue-700 text-white"
  >
    <Send className="h-4 w-4 mr-1" />
    Submit to FBR
  </Button>
)}
```

**Features**:
- Blue button with Send icon
- Only visible for invoices that haven't been submitted
- Calls `handleSubmitToFBR()` function
- Opens FBR submission modal

### Current State

**Invoice Create/Form Page** (`/invoices/create`):
- ❌ Submit to FBR button REMOVED (as requested)
- ✅ Only has "Save Draft" button

**Invoice List Page** (`/invoices`):
- ✅ Submit to FBR button RESTORED
- Shows for each non-submitted invoice
- Works with existing FBR submission modal

### Button Order on Invoice List
1. **View** - Opens invoice detail page
2. **Edit** - Opens edit page (only for drafts)
3. **View JSON** - Shows FBR data format
4. **Submit to FBR** - Submits to FBR (only for non-submitted invoices)

---

## Clarification

**Original Request**: "Remove the submit to fbr button so there are no accidental presses"
- ✅ Context: Remove from invoice CREATE page (to prevent accidental submissions while filling form)
- ❌ Misunderstood: Incorrectly removed from BOTH pages

**Corrected**: 
- ✅ Invoice create page: Button removed (safer UX while creating)
- ✅ Invoice list page: Button restored (needed for submitting saved invoices)

---

## File Modified

**File**: `apps/web/src/app/invoices/page.tsx`
- Added `Send` icon to imports
- Restored "Submit to FBR" button with conditional rendering
- Button only shows if `!invoice.fbrSubmitted`

**Result**: Users can now submit saved invoices to FBR from the list page, but won't accidentally submit while creating a new invoice.
