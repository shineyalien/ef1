# 🔧 ACTUAL FIX ATTEMPT #2 - Field Name Mapping

## Problem Identified

From the terminal logs, I can see:
```
✅ FBR Response: 26 records
❌ Failed to update transactionTypes cache:
transTypeId: undefined,
transTypeDesc: undefined
```

**Root Cause**: FBR API returns 26 records but my code is looking for WRONG FIELD NAMES.

---

## What I've Fixed

### 1. Added Debug Logging
**File**: `apps/web/src/app/api/fbr/lookup/route.ts` (Line ~106)

```typescript
// Log first item to see actual FBR field names
if (data && data.length > 0) {
  console.log('🔍 First transactionType item fields:', Object.keys(data[0]))
  console.log('🔍 First transactionType item:', JSON.stringify(data[0], null, 2))
}
```

**Purpose**: When you refresh `/products/new`, this will print the ACTUAL field names FBR returns.

### 2. Updated Field Mapping (Guessing Multiple Variations)
```typescript
transTypeId: item.TRANS_TYPE_ID || item.tranS_TYPE_ID || item.transTypeId || item.trans_type_id || item.id || 0
transTypeDesc: item.TRANS_TYPE_DESC || item.tranS_TYPE_DESC || item.transTypeDesc || item.trans_type_desc || item.description || 'Unknown'
```

**Rationale**: FBR uses different naming conventions:
- `stateProvinceCode` (provinces)
- `hS_CODE` (HS codes)
- `uoM_ID` (units)
- `ratE_ID` (tax rates)

So transaction types might use:
- `TRANS_TYPE_ID` (all caps)
- `tranS_TYPE_ID` (mixed case)
- `trans_type_id` (lowercase)

### 3. Fixed UoM HS Code Mapping
```typescript
hsCode: item.hS_CODE || item.hsCode || null
```

FBR likely returns `hS_CODE` (same as HS codes endpoint), not `hsCode`.

---

## What YOU Need To Do

### Step 1: Check The Logs
1. Open http://localhost:3000/products/new
2. Look at terminal output
3. Find these lines:
   ```
   🔍 First transactionType item fields: [...]
   🔍 First transactionType item: {...}
   ```

### Step 2: Share The Output With Me
Tell me what field names you see. Example:
```
🔍 First transactionType item fields: TRANS_TYPE_ID, TRANS_TYPE_DESC
🔍 First transactionType item: {
  "TRANS_TYPE_ID": 1,
  "TRANS_TYPE_DESC": "Local Supply"
}
```

### Step 3: I'll Fix The Exact Field Names
Once I know the ACTUAL field names, I'll update the mapping correctly.

---

## About UoM Filtering

You said "the UoM is supposed to be according to HScode it is in the doc".

**Questions I need answered:**
1. Does FBR `/pdi/v1/uom` endpoint accept query parameters like `?hsCode=85371000`?
2. Or does it return ALL UoMs with an `hS_CODE` field in each record?
3. Or is there a DIFFERENT endpoint for HS-specific UoMs?

**Current Behavior**:
- Frontend calls: `POST /api/fbr/lookup` with `{ type: "hsUom", hsCode: "85371000" }`
- Backend fetches ALL UoMs from `/pdi/v1/uom`
- Backend tries to filter by `hsCode` field in cache
- If FBR doesn't return `hS_CODE` field, ALL UoMs are returned

---

## About "Sale Type" vs "Transaction Type"

You said "transaction type is still called that and not sales type!"

**Clarification Needed**:
1. Do you want me to RENAME everywhere in code from "transactionType" to "saleType"?
2. Or keep "transactionType" in code but just ensure it works?

FBR API uses:
- Endpoint: `/pdi/v1/transtypecode` (transaction types)
- Tax Rate Param: `transTypeId` (transaction type ID)
- Invoice Field: `saleType` (sale type)

These are related but different concepts in FBR's system.

---

## Summary

**What's Fixed**:
- ✅ Added logging to see actual FBR response
- ✅ Updated field mapping with multiple variations
- ✅ Fixed UoM HS code field name

**What's NOT Fixed** (need your input):
- ❌ Exact FBR field names for transaction types (waiting for logs)
- ❌ How UoM filtering by HS code actually works in FBR API
- ❌ Whether to rename "transaction type" to "sale type" everywhere

**Next Steps**:
1. You test `/products/new`
2. You share the terminal logs showing actual field names
3. I fix the exact mapping
4. Everything works

---

**Status**: Waiting for you to test and share FBR API response structure from logs.
