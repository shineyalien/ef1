# Migration from Mock Data to Real FBR APIs - Implementation Plan

## Overview
This document outlines the complete migration from mock FBR data to real PRAL API integration.

## Current Status
✅ **Environment Variable Updated**: `ENABLE_MOCK_FBR=false`
✅ **Lookup Route**: Updated to fetch from real FBR APIs (with Bearer Token auth)
⚠️ **Tax Rates Route**: Needs Prisma schema update before implementation
⚠️ **Database Schema**: Current schema designed for mock data structure

## Required Changes

### 1. Database Schema Updates

The current Prisma schema needs to be updated to match FBR PRAL API response structures:

#### Current Issues:
- `FBRTaxRate` model uses composite keys (hsCode, saleType, sellerProvince, buyerProvince, scenarioId)
- FBR API returns tax rates with `ratE_ID`, `ratE_VALUE`, `ratE_DESC`
- Missing `FBRTransactionType` model for transaction types

#### Required Schema Changes:

```prisma
// Update FBRTaxRate to match FBR API structure
model FBRTaxRate {
  id              String   @id @default(cuid())
  rateId          Int      // FBR rate ID (ratE_ID from API)
  rate            Float    // Tax rate percentage (ratE_VALUE from API)
  description     String   // Rate description (ratE_DESC from API)
  hsCode          String?  // Optional HS Code filter
  transTypeId     Int      // Transaction Type ID
  provinceId      Int      // Province ID (originationSupplier)
  lastFetchDate   DateTime // When this rate was fetched from FBR
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([rateId, transTypeId, provinceId])
  @@index([hsCode])
  @@index([transTypeId, provinceId])
  @@map("fbr_tax_rates")
}

// Add FBRTransactionType model
model FBRTransactionType {
  id            String   @id @default(cuid())
  transTypeId   Int      @unique // FBR transaction type ID
  transTypeDesc String   // Transaction type description
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("fbr_transaction_types")
}
```

### 2. User Configuration Requirements

**CRITICAL**: Users must provide their own FBR Bearer Tokens

#### Token Setup Flow:
1. User registers in Easy Filer
2. User sets up business profile
3. User obtains Bearer Token from FBR IRIS portal (separate process)
4. User enters Bearer Token in Easy Filer settings
5. Easy Filer validates token by calling FBR API
6. Data fetching begins using user's token

#### Settings Page Updates Needed:
- Add "FBR Bearer Token" input field
- Add "Test Connection" button to validate token
- Show token expiry warning (5-year validity)
- Add instructions link to FBR IRIS portal
- Store token encrypted in database

### 3. API Route Changes

#### ✅ `/api/fbr/lookup` (COMPLETED)
- Fetches from FBR PRAL endpoints with Bearer Token
- Caches results in local database
- Supports: provinces, hsCodes, uom, documentTypes, transactionTypes
- 24-hour cache staleness check

#### ⚠️ `/api/fbr/tax-rates` (NEEDS SCHEMA UPDATE)
- Fetches from `/pdi/v2/SaleTypeToRate`
- Query params: date, transTypeId, originationSupplier (province ID)
- Caches tax rates with FBR `ratE_ID` as primary identifier
- Returns calculated rates based on transaction type and province

#### `/api/fbr/scenarios` (NO CHANGES NEEDED)
- Already uses database seeding approach
- Scenarios are static reference data
- No real-time FBR API for scenarios

### 4. Data Flow Changes

#### Before (Mock Data):
```
User Request → API Route → Mock Data Array → Response
```

#### After (Real FBR APIs):
```
User Request → API Route → Check User's Bearer Token → 
Check Cache (24h) → If Stale: Fetch from FBR → Update Cache → Response
```

### 5. Implementation Steps

#### Step 1: Create Database Migration (HIGH PRIORITY)
```bash
cd apps/web
npx prisma migrate dev --name update_fbr_tax_rate_schema
```

This will:
- Update `FBRTaxRate` model
- Add `FBRTransactionType` model
- Clear existing tax rate cache (breaking change)

#### Step 2: Replace Tax Rates Route
```bash
# Backup old route
Copy-Item src/app/api/fbr/tax-rates/route.ts src/app/api/fbr/tax-rates/route.ts.backup

# Replace with new route
Move-Item -Force src/app/api/fbr/tax-rates/route.new.ts src/app/api/fbr/tax-rates/route.ts
```

#### Step 3: Update Settings Page
Add FBR token management to `/settings/fbr`:
- Input field for Sandbox Bearer Token
- Input field for Production Bearer Token
- Test connection button
- Token expiry tracker
- Integration mode selector (sandbox/production)

#### Step 4: Seed Transaction Types
Create script to fetch and seed transaction types from FBR:
```typescript
// scripts/seed-transaction-types.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const FBR_BASE_URL = 'https://gw.fbr.gov.pk'

async function seedTransactionTypes(bearerToken: string) {
  const response = await fetch(`${FBR_BASE_URL}/pdi/v1/transtypecode`, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Accept': 'application/json'
    }
  })
  
  const data = await response.json()
  
  for (const tt of data) {
    await prisma.fBRTransactionType.upsert({
      where: { transTypeId: tt.transTypeId },
      update: { transTypeDesc: tt.transTypeDesc },
      create: {
        transTypeId: tt.transTypeId,
        transTypeDesc: tt.transTypeDesc
      }
    })
  }
  
  console.log(`✅ Seeded ${data.length} transaction types`)
}
```

### 6. Testing Strategy

#### Phase 1: Sandbox Testing
1. User configures Sandbox Bearer Token
2. Test fetching provinces, HS codes, UOMs
3. Test tax rate calculations
4. Verify data caching works
5. Test cache invalidation (24-hour rule)

#### Phase 2: Production Readiness
1. User completes sandbox validation
2. User generates Production Bearer Token from IRIS
3. Switch integration mode to Production
4. Test real invoice submissions

### 7. Error Handling

#### Token-Related Errors:
- **401 Unauthorized**: Token invalid or expired → Prompt user to update token
- **403 Forbidden**: Token doesn't have required permissions → Show error message
- **429 Rate Limit**: Too many requests → Implement exponential backoff

#### API Errors:
- **500 FBR Server Error**: Log error, use cached data if available
- **Network Timeout**: Retry with exponential backoff (3 attempts)
- **Invalid Response**: Log for debugging, show user-friendly error

### 8. Performance Considerations

#### Caching Strategy:
- **HS Codes**: Cache for 7 days (rarely changes)
- **Provinces**: Cache for 30 days (static data)
- **UOMs**: Cache for 7 days
- **Tax Rates**: Cache for 24 hours (may change with new SROs)
- **Transaction Types**: Cache for 30 days

#### Optimization:
- Use Redis for hot cache (frequent lookups)
- Database for persistent cache
- Background jobs to refresh stale cache proactively

### 9. Migration Checklist

- [x] Update `.env.local` to disable mock data
- [x] Create new lookup route with FBR integration
- [x] Backup old lookup route
- [x] Replace lookup route file
- [ ] Update Prisma schema for FBRTaxRate
- [ ] Create database migration
- [ ] Update tax-rates route
- [ ] Add FBRTransactionType model
- [ ] Create settings page for Bearer Token management
- [ ] Add token validation endpoint
- [ ] Create transaction types seeding script
- [ ] Update documentation
- [ ] Test complete flow with real FBR token

## Next Immediate Actions

### Action 1: Update Prisma Schema
File: `apps/web/prisma/schema.prisma`

Replace the current `FBRTaxRate` model and add `FBRTransactionType` model.

### Action 2: Run Migration
```bash
cd apps/web
npx prisma migrate dev --name update_fbr_models_for_real_api
npx prisma generate
```

### Action 3: Replace Tax Rates Route
Once schema is updated, replace the tax-rates route file.

### Action 4: Restart Development Server
```bash
npm run dev
```

## User Impact

### Before Migration:
- ✅ Works immediately with mock data
- ✅ No setup required
- ❌ Limited to 38 HS codes
- ❌ Not FBR-compliant for production

### After Migration:
- ⚠️ Requires FBR Bearer Token setup
- ✅ Access to complete FBR database (10,000+ HS codes)
- ✅ Real-time tax rates from FBR
- ✅ FBR-compliant for production submissions
- ✅ Automatic updates when FBR changes rates

## Additional Notes

1. **Bearer Token Security**: Tokens are encrypted at rest in the database
2. **Token Rotation**: Users must manually update tokens when they expire (5-year validity)
3. **Offline Mode**: Cached data allows limited offline functionality
4. **FBR Downtime**: System gracefully degrades to cached data when FBR APIs are unavailable

