# 🔧 Fix Plan: Sale Type & UoM Filtering

## Issues Identified

### 1. ❌ Wrong Terminology: "Transaction Type" vs "Sale Type"
**Problem**: Code uses "transactionType" but FBR API uses "saleType"
**Impact**: 
- Confusing variable names
- May not match FBR API expectations
- Tax rate calculations might fail

### 2. ❌ UoM Not Filtering by HS Code
**Problem**: When user selects HS code, UoM dropdown shows ALL units instead of HS-specific ones
**Root Cause**:
- POST endpoint expects cache to have HS code associations
- Cache sync doesn't store HS code relationships
- FBR UoM API doesn't provide HS code filtering directly

### 3. ❌ Sale Type Data Not Loading
**Problem**: Sale type dropdown is empty
**Root Cause**:
- Prisma Client doesn't have `fBRTransactionType` model (needs dev server restart)
- Cache operations are disabled
- Direct FBR API calls not working

---

## ✅ Fix Strategy

### Phase 1: Rename Transaction Type → Sale Type
**Files to Update**:
1. `/apps/web/src/app/products/new/page.tsx` - Product form
2. `/apps/web/src/app/api/fbr/lookup/route.ts` - API endpoint
3. Prisma schema - Model name
4. Database migration - Table rename

**Changes**:
- `transactionType` → `saleType`
- `transactionTypes` → `saleTypes`
- `transTypeId` → `saleTypeId`
- `transTypeDesc` → `saleTypeDesc`
- `fBRTransactionType` → `fBRSaleType`
- API endpoint: `?type=transactionTypes` → `?type=saleTypes`

### Phase 2: Fix UoM Filtering
**Approach**: Since FBR doesn't provide HS-specific UoM mapping, we need to:
1. Fetch ALL UoMs from FBR
2. Store generic UoMs in cache
3. Let frontend handle filtering (show all UoMs for any HS code)
4. OR: Implement custom mapping based on HS code patterns

**Decision**: Show all UoMs for now (FBR doesn't provide HS-specific UoM mapping)

### Phase 3: Fix Sale Type Loading
**Options**:
- **Option A**: Direct FBR API call (bypass cache until dev server restart)
- **Option B**: Restart dev server now and use cache
- **Option C**: Hybrid - try cache, fallback to direct API

**Chosen**: Option A (direct FBR API fallback)

---

## 📋 Implementation Steps

### Step 1: Update Prisma Schema
```prisma
// Rename model
model FBRSaleType {
  id            String   @id @default(cuid())
  saleTypeId    Int      @unique
  saleTypeDesc  String
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("fbr_sale_types")
}
```

### Step 2: Create Migration
```powershell
npx prisma migrate dev --name rename_transaction_type_to_sale_type
```

### Step 3: Update API Endpoints
- Change `?type=transactionTypes` to `?type=saleTypes`
- Update FBR_ENDPOINTS mapping
- Update cache sync logic

### Step 4: Update Product Form
- Change state variable names
- Update API calls
- Update dropdown labels

### Step 5: Test Data Flow
```
User selects HS Code
  ↓
1. HS Code selected → Store HS code + description
2. Fetch UoMs → Display all available UoMs
3. User selects Sale Type → Fetch tax rate
4. Tax rate returned → Auto-fill tax rate field
```

---

## 🎯 Expected Outcome

After fixes:
- ✅ Sale Type dropdown populated with FBR data
- ✅ UoM dropdown shows available units (all, not HS-filtered)
- ✅ Tax rate fetched correctly when Sale Type selected
- ✅ Consistent terminology across codebase
- ✅ Data chaining works end-to-end

---

## ⚠️ Breaking Changes

### Database
- Table renamed: `fbr_transaction_types` → `fbr_sale_types`
- Column renamed: `transTypeId` → `saleTypeId`, `transTypeDesc` → `saleTypeDesc`

### API
- Endpoint changed: `?type=transactionTypes` → `?type=saleTypes`

### Frontend
- State variable: `transactionType` → `saleType`
- Prop names in components updated

---

**Status**: Ready to implement
**Estimated Time**: 30 minutes
**Risk Level**: Medium (database migration + API changes)
