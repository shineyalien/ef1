# ✅ CORRECT UNDERSTANDING - Sale Type vs Transaction Type

## The ACTUAL FBR Workflow

### Step 1: Get Transaction Types
**Endpoint**: `/pdi/v1/transtypecode`
**Purpose**: Get list of transaction types (Local Supply, Export, Import, etc.)
**Returns**: 
```json
[
  { "TRANS_TYPE_ID": 18, "TRANS_TYPE_DESC": "Local Supply" },
  { "TRANS_TYPE_ID": 19, "TRANS_TYPE_DESC": "Export" }
]
```

### Step 2: Get Tax Rates (which include Sale Types)
**Endpoint**: `/pdi/v2/SaleTypeToRate?date=2025-10-05&transTypeId=18&originationSupplier=1`
**Purpose**: Get tax rates for a specific transaction type
**Returns**:
```json
[
  {
    "ratE_ID": 413,
    "ratE_DESC": "18% Standard Rate",
    "ratE_VALUE": 18,
    "saleType": "GSR",  // THIS IS THE SALE TYPE!
    "hsCode": "85371000",
    ...
  }
]
```

### Step 3: Use Sale Type in Invoice
When submitting invoice to FBR:
```json
{
  "items": [
    {
      "hsCode": "85371000",
      "saleType": "GSR",  // From Step 2
      "rate": "18%",
      ...
    }
  ]
}
```

---

## What This Means For Our Code

### Current WRONG Approach:
- ❌ Looking for "sale types" as a separate dropdown
- ❌ Treating transaction type and sale type as same thing
- ❌ Trying to cache "sale types" separately

### CORRECT Approach:
- ✅ Show "Transaction Types" dropdown (from `/pdi/v1/transtypecode`)
- ✅ When user selects HS code + transaction type → fetch tax rate from `/pdi/v2/SaleTypeToRate`
- ✅ Tax rate API returns the sale type automatically
- ✅ Store sale type with the product/invoice item

---

## What Needs To Be Fixed

### 1. Keep Transaction Type Model
**File**: `prisma/schema.prisma`
**Action**: Keep `FBRTransactionType` model (it's correct!)

### 2. Fix Product Form
**File**: `apps/web/src/app/products/new/page.tsx`
**Current**:
```typescript
transactionType: '', // NEW: FBR transaction type
```
**Should Be**:
```typescript
transactionTypeId: '', // FBR transaction type ID (e.g., 18)
saleType: '', // Auto-filled from tax rate API (e.g., "GSR")
```

### 3. Fix Tax Rate API Call
**File**: Product form `fetchTaxRate()` function
**Current Flow**:
1. User selects HS code
2. User selects transaction type
3. Fetch tax rate → Get `saleType` from response
4. Auto-fill both `taxRate` and `saleType`

### 4. Update Lookup API
**File**: `apps/web/src/app/api/fbr/lookup/route.ts`
**Action**: Keep transaction types endpoint as-is, just fix field mapping

---

## The Confusion

I was confused because:
- `/pdi/v1/transtypecode` endpoint name suggests "transaction types"
- But invoice uses `saleType` field
- I thought they were two separate dropdowns

**Reality**:
- **Transaction Type** = User selection (Local Supply, Export, etc.)
- **Sale Type** = Tax classification code returned by FBR (GSR, GZR, GER)
- Sale type is NOT user-selectable, it's determined by FBR based on transaction type + HS code

---

## Action Plan

1. ✅ Fix `/pdi/v1/transtypecode` field mapping (get actual field names)
2. ✅ Update product form to have both `transactionTypeId` and `saleType`
3. ✅ Make tax rate API return `saleType` in response
4. ✅ Auto-fill `saleType` when tax rate is fetched
5. ✅ Remove any "sale type dropdown" from UI

---

**Status**: NOW I understand correctly. Let me fix it properly.
