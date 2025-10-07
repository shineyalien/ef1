# Dashboard Quick Action Update

## Change Made

**Replaced "FBR Invoice" button with "View All Invoices" on Dashboard**

### What Changed

**Location**: Dashboard page (`/dashboard`) - Quick Actions section

**Before**:
```tsx
<Link href="/invoices/create">
  <Card className="...border-red-200 hover:border-red-300...">
    <div className="...bg-red-100...">
      <FileText className="...text-red-600" />
    </div>
    <h3>FBR Invoice</h3>
    <p>Tax compliant invoice</p>
  </Card>
</Link>
```

**After**:
```tsx
<Link href="/invoices">
  <Card className="...border-purple-200 hover:border-purple-300...">
    <div className="...bg-purple-100...">
      <FileText className="...text-purple-600" />
    </div>
    <h3>View All Invoices</h3>
    <p>Manage invoices</p>
  </Card>
</Link>
```

### Changes Summary

1. **Link Target**: Changed from `/invoices/create` → `/invoices`
2. **Card Style**: Changed from red theme → purple theme
   - Border: `border-red-200` → `border-purple-200`
   - Background: `bg-red-100` → `bg-purple-100`
   - Icon color: `text-red-600` → `text-purple-600`
3. **Title**: "FBR Invoice" → "View All Invoices"
4. **Description**: "Tax compliant invoice" → "Manage invoices"

### Current Quick Actions Layout

The dashboard now has these quick action cards:

1. **Create Invoice** (Blue)
   - Link: `/invoices/create`
   - Description: "FBR compliant invoicing"

2. **View All Invoices** (Purple) - ✨ NEW
   - Link: `/invoices`
   - Description: "Manage invoices"

3. **Add Customer** (Green)
   - Link: `/customers/new`
   - Description: "Register new customer"

4. **Add Product** (Orange)
   - Link: `/products/new`
   - Description: "Add new product"

5. **Bulk Operations** (Teal)
   - Link: `/bulk-operations`
   - Description: "Import & batch process"

### User Flow Improvement

**Before**: Two buttons leading to invoice creation
- "Create Invoice" → Create form
- "FBR Invoice" → Create form (duplicate)

**After**: Clear separation of actions
- "Create Invoice" → Create new invoice form
- "View All Invoices" → Invoice list/management page

### Benefits

✅ **Clearer Navigation**: Users can now quickly access the invoice list
✅ **No Duplication**: Removed duplicate invoice creation button
✅ **Better UX**: Logical flow between creating and viewing invoices
✅ **Visual Distinction**: Purple theme differentiates from blue "Create" button

---

## File Modified

**File**: `apps/web/src/app/dashboard\page.tsx`
- Changed link target from `/invoices/create` to `/invoices`
- Updated color theme from red to purple
- Changed button text and description
- Lines: 75-88

**Result**: Dashboard now has a clear "View All Invoices" button that takes users to the invoice management page.
