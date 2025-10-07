# Invoice View & Edit Page Fixes

## Issues Fixed

### Issue 1: "Cannot read properties of undefined (reading 'toLocaleString')"
**Location**: Invoice Detail Page (`/invoices/[id]`)

**Problem**: 
- API returns `{ invoice: {...} }` but code expected invoice data directly
- Invoice object missing calculated fields (`subtotal`, `taxAmount`, `totalWithholdingTax`)
- Trying to call `.toLocaleString()` on undefined values

**Root Cause**:
```typescript
// API Response Structure
{
  invoice: {
    id: "...",
    items: [...],
    totalAmount: 5000,
    // Missing: subtotal, taxAmount, totalWithholdingTax
  }
}

// Code expected:
invoice.subtotal.toLocaleString() // ❌ subtotal is undefined
```

**Solution**:
1. Extract invoice from nested response structure
2. Calculate missing totals from items if not present
3. Add safe fallbacks with `|| 0` for all numeric values

```typescript
const data = await response.json()

// Handle nested response structure
const invoiceData = data.invoice || data

// Calculate totals if not present
if (!invoiceData.subtotal && invoiceData.items) {
  const subtotal = invoiceData.items.reduce((sum: number, item: any) => 
    sum + (item.valueSalesExcludingST || 0), 0
  )
  const taxAmount = invoiceData.items.reduce((sum: number, item: any) => 
    sum + (item.salesTaxApplicable || 0), 0
  )
  const totalWithholdingTax = invoiceData.items.reduce((sum: number, item: any) => 
    sum + (item.salesTaxWithheldAtSource || 0), 0
  )
  
  invoiceData.subtotal = subtotal
  invoiceData.taxAmount = taxAmount
  invoiceData.totalWithholdingTax = totalWithholdingTax
}

setInvoice(invoiceData)
```

**Safe Rendering**:
```typescript
// BEFORE (crashes if undefined):
<span>PKR {invoice.subtotal.toLocaleString()}</span>

// AFTER (safe fallback):
<span>PKR {(invoice.subtotal || 0).toLocaleString()}</span>
```

---

### Issue 2: Edit Invoice Page Shows Blank Fields
**Location**: Invoice Edit Page (`/invoices/[id]/edit`)

**Problem**:
- Same nested response structure issue
- Form fields weren't populating because `data` wasn't the actual invoice object

**Root Cause**:
```typescript
const data = await response.json()
setInvoice(data) // This is { invoice: {...} }, not the invoice itself

// Then trying to access:
setCustomerId(data.customerId) // ❌ undefined (should be data.invoice.customerId)
```

**Solution**:
```typescript
const responseData = await response.json()

// Handle nested response structure
const data = responseData.invoice || responseData
setInvoice(data)

// Now form fields populate correctly
setCustomerId(data.customerId || '')
setDocumentType(data.documentType || 'Sale Invoice')
setInvoiceDate(data.invoiceDate ? new Date(data.invoiceDate).toISOString().split('T')[0] : '')
setItems(data.items || [])
// ... etc
```

---

## Files Modified

### 1. `apps/web/src/app/invoices/[id]/page.tsx`
**Changes**:
- Extract invoice from nested response: `data.invoice || data`
- Calculate missing totals from items array
- Add safe fallbacks for all numeric displays: `(value || 0)`

**Lines Changed**: 23-39, 242-257

### 2. `apps/web/src/app/invoices/[id]/edit/page.tsx`
**Changes**:
- Extract invoice from nested response: `responseData.invoice || responseData`
- Form fields now populate correctly on load

**Lines Changed**: 91-94

---

## Testing Checklist

### Invoice Detail Page
- [ ] Click "View" on any invoice from list
- [ ] Page loads without errors
- [ ] Invoice number and details display correctly
- [ ] Customer information shows
- [ ] Line items table displays all products
- [ ] **Totals section shows:**
  - [ ] Subtotal (excl. tax)
  - [ ] Sales Tax
  - [ ] Withholding Tax (if applicable)
  - [ ] Total Amount
- [ ] All amounts format correctly with PKR prefix
- [ ] No console errors

### Invoice Edit Page
- [ ] Click "Edit" on any invoice from list
- [ ] Page loads without errors
- [ ] **Form fields are pre-populated:**
  - [ ] Customer dropdown shows selected customer
  - [ ] Document Type selected
  - [ ] Invoice Date filled
  - [ ] Payment Mode selected
  - [ ] Tax Period filled
  - [ ] All line items show in table with data
  - [ ] Notes (if any) displayed
- [ ] Can make changes to any field
- [ ] Save button works
- [ ] No console errors

---

## API Response Structure (Documentation)

### GET /api/invoices/[id]

**Current Response**:
```json
{
  "invoice": {
    "id": "cm5...",
    "invoiceNumber": "INV-001",
    "businessId": "cm5...",
    "customerId": "cm5...",
    "documentType": "Sale Invoice",
    "invoiceDate": "2025-01-13T00:00:00.000Z",
    "paymentMode": "Cash",
    "totalAmount": 5900,
    "taxAmount": 900,
    "status": "DRAFT",
    "mode": "LOCAL",
    "items": [
      {
        "id": "cm5...",
        "description": "Product Name",
        "quantity": 1,
        "unitPrice": 5000,
        "valueSalesExcludingST": 5000,
        "salesTaxApplicable": 900,
        "salesTaxWithheldAtSource": 0,
        "totalValue": 5900
      }
    ],
    "customer": {
      "id": "cm5...",
      "name": "Customer Name",
      "buyerNTN": "1234567"
    },
    "business": {
      "id": "cm5...",
      "companyName": "My Business"
    }
  }
}
```

**Note**: Response wraps invoice in `{ invoice: {...} }` structure, not direct invoice object.

---

## Summary

Both pages now correctly handle the nested API response structure and calculate/display all required fields safely. The edit page properly loads existing invoice data into form fields, and the detail page displays all totals without crashing.

**Result**: ✅ View Invoice works properly ✅ Edit Invoice loads existing data
