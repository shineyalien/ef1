# Missing saleValue Field Fix

## Problem
Prisma error when saving invoice:
```
Argument `saleValue` is missing.
```

## Root Cause

### Schema Requirement
In `schema.prisma` (InvoiceItem model, line 241):
```prisma
model InvoiceItem {
  ...
  unitPrice Float  // Price per unit (excl. tax)
  saleValue Float  // Same as unitPrice but explicit for FBR ← REQUIRED
  ...
}
```

### API Missing Field
The API was creating invoice items without the `saleValue` field:
```typescript
return {
  productId: item.productId || null,
  description: item.productName || item.description || 'Product',
  hsCode: item.hsCode,
  quantity: item.quantity,
  unitPrice: item.unitPrice,
  // ❌ saleValue: missing!
  unitOfMeasurement: item.unitOfMeasurement || 'Each',
  ...
}
```

## Why saleValue Exists

The `saleValue` field is required for **FBR (Federal Board of Revenue) compliance**. 

While it's typically the same as `unitPrice`, having it as a separate field:
1. **Explicitly documents** the sale value for tax purposes
2. **Matches FBR API requirements** which expect a `saleValue` field
3. **Allows flexibility** for cases where sale value might differ from unit price (promotions, bulk discounts, etc.)
4. **Audit compliance** - Clear separation of pricing vs. taxable value

## The Fix

### File: `apps/web/src/app/api/invoices/route.ts` (Line 203)

**Added:**
```typescript
return {
  productId: item.productId || null,
  description: item.productName || item.description || 'Product',
  hsCode: item.hsCode,
  quantity: item.quantity,
  unitPrice: item.unitPrice,
  saleValue: item.unitPrice, // ✅ Required field - same as unitPrice for FBR compliance
  unitOfMeasurement: item.unitOfMeasurement || 'Each',
  ...
}
```

## How It Works

For most cases:
```
unitPrice = 100
saleValue = 100  (same value)

Total before tax = quantity × saleValue
Tax = Total before tax × taxRate
```

For special cases (future):
```
unitPrice = 100 (original price)
saleValue = 80  (promotional price)

Total before tax = quantity × saleValue  ← Tax calculated on actual sale value
```

## Expected Behavior After Fix

### Successful Save
```javascript
💾 Saving invoice with payload: {
  "items": [
    {
      "unitPrice": 100,
      "saleValue": 100,  // ✅ Now included
      ...
    }
  ]
}

✅ Created invoice in database: {
  items: [{
    unitPrice: 100,
    saleValue: 100,
    ...
  }]
}

✅ Invoice saved successfully!
```

## Complete Required Fields for InvoiceItem

Based on schema analysis, all required fields are now provided:

| Field | Provided? | Source |
|-------|-----------|--------|
| description | ✅ | item.description |
| hsCode | ✅ | item.hsCode |
| quantity | ✅ | item.quantity |
| unitOfMeasurement | ✅ | item.unitOfMeasurement |
| unitPrice | ✅ | item.unitPrice |
| **saleValue** | ✅ | **item.unitPrice (newly added)** |
| valueSalesExcludingST | ✅ | calculated (subtotal) |
| taxRate | ✅ | item.taxRate |
| taxAmount | ✅ | calculated (taxAmount) |
| totalValue | ✅ | calculated (subtotal + taxAmount) |
| fixedNotifiedValueOrRetailPrice | ✅ | item.fixedNotifiedValueOrRetailPrice |
| saleType | ✅ | item.saleType |

### Fields with Defaults (auto-provided by Prisma)
- `discount` → @default(0)
- `salesTaxApplicable` → @default(0)
- `salesTaxWithheldAtSource` → @default(0)
- `extraTax` → @default(0)
- `furtherTax` → @default(0)
- `fedPayable` → @default(0)
- `salesTaxAct` → @default("SALES TAX ACT, 1990")
- `saleType` → @default("Standard")

## Test It Now

Try saving the invoice again. It should work! The complete flow:

```
1. Fill invoice form with product
2. Click "Save Invoice"
3. Frontend validates ✅
4. API receives data ✅
5. API creates invoice with:
   - invoiceSequence ✅ (previous fix)
   - saleValue ✅ (this fix)
6. Database accepts ✅
7. Success message! ✅
```

## Summary of Recent Fixes

### Fix 1: Product Selection State Clearing
- **Issue:** Fields clearing after 1 second
- **Cause:** State race condition from `updateItem` in `fetchUOMsForHSCode`
- **Fix:** Removed `updateItem` call, made UOM fetch non-blocking

### Fix 2: Invoice Validation Errors
- **Issue:** Generic "Internal server error"
- **Cause:** Missing frontend validation
- **Fix:** Added detailed item-by-item validation with specific error messages

### Fix 3: Missing invoiceSequence
- **Issue:** `Argument 'invoiceSequence' is missing`
- **Cause:** Calculated but not passed to Prisma
- **Fix:** Added `invoiceSequence: nextSequence` to invoice create

### Fix 4: Missing saleValue (Current)
- **Issue:** `Argument 'saleValue' is missing`
- **Cause:** Required field for FBR compliance not provided
- **Fix:** Added `saleValue: item.unitPrice` to invoice item create

## All Systems Go! 🚀

With these fixes, your invoice system should now:
- ✅ Select products without fields clearing
- ✅ Show clear validation error messages
- ✅ Generate sequential invoice numbers
- ✅ Include all required FBR fields
- ✅ Save successfully to database
- ✅ Ready for FBR submission workflow

**Time to Test:** Try creating and saving a complete invoice now! 🎉
