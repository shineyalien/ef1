# Implementation Plan: FBR Compliance Enhancements

## Overview
Systematic implementation of FBR compliance improvements for Easy Filer invoice and product forms.

---

## STEP 1: Scenario ID - Optional Field for Production ✅

### Changes Required:
1. Make Scenario ID optional in invoice form
2. Add empty/blank option in dropdown
3. Update validation to allow empty value for production

### Implementation:
- File: `apps/web/src/app/invoices/create/page.tsx`
- Change: Add blank option to scenario dropdown
- Validation: Make scenarioId optional in production mode

---

## STEP 2: Scenario ID Business Logic & Database Population

### FBR Scenario Structure (From Technical Docs):
Scenarios are based on business type and sector combinations.

### Database Schema:
```prisma
model FBRScenario {
  id              String   @id @default(cuid())
  code            String   @unique      // e.g., "SN001"
  description     String                // e.g., "Registered to Registered"
  businessType    String?               // Manufacturer, Trader, Service Provider
  sector          String?               // Steel, Textile, Electronics, etc.
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### FBR Scenarios to Add:
Based on FBR documentation, common scenarios include:
1. **SN001** - Registered to Registered
2. **SN002** - Registered to Unregistered
3. **SN003** - Import
4. **SN004** - Export
5. **SN005** - Zero Rated
6. **SN006** - Exempt
7. **SN007** - Special Sector (Steel)
8. **SN008** - Special Sector (Textile)
... (more based on FBR docs)

### API Endpoint Enhancement:
- File: `apps/web/src/app/api/fbr/scenarios/route.ts` (NEW)
- Functionality: Filter scenarios by businessType and sector

---

## STEP 3: Product Form Enhancements

### 3a. Category Field Changes ✅
- Remove dropdown
- Add optional text input field
- Allow free-form category entry

### 3b. Product Serial Number ✅
- Add internal serial number field
- Auto-generate or manual entry
- Format: PRD-YYYY-XXXX

### 3c. FBR Compliance Section

#### 3c.1: HS Code Live Search ✅
- Endpoint: `/api/fbr/lookup?type=hsCodes&search={query}`
- Real-time search as user types
- Show description with code
- Format: `8471.3000 - Automatic data processing machines`

#### 3c.2: HS Code → UOM Chaining ✅
- Already implemented
- When HS Code selected, fetch valid UOMs
- Auto-populate UOM dropdown with FBR-approved values

#### 3c.3: Transaction Type Chaining
- Endpoint: `/pdi/v1/transtypecode`
- Chained with: HS Code, Date, Province
- Returns: Rate ID and Rate Description
- Tax Rate endpoint: `/pdi/v2/SaleTypeToRate?date={date}&transTypeId={id}&originationSupplier={province}`

**Data Chain Flow**:
```
HS Code + Date + Province
  ↓
Transaction Types (transtypecode API)
  ↓
Select Transaction Type → Get transTypeId
  ↓
Tax Rates API (SaleTypeToRate) → Get Rate ID + Rate Description
  ↓
Display in dropdown (if multiple options)
```

#### 3c.4: HS Code Description ✅
- Show full description below HS Code input
- Fetch from `/pdi/v1/itemdesccode`
- Display format: "Description: {full_description}"

#### 3c.5: FBR SRO No. Chaining
- Endpoint: `/pdi/v1/SroSchedule?rate_id={rate_id}&date={date}&origination_supplier_csv={province}`
- Chained with: Rate ID, Date, Province
- Returns: SRO Schedule Number and details

**Data Chain Flow**:
```
Rate ID (from Tax Rates) + Date + Province
  ↓
SRO Schedule API
  ↓
Get SRO No. and details
```

#### 3c.6: SRO Item Serial No. Chaining
- Endpoint: `/pdi/v1/sroitemcode`
- Chained with: SRO No.
- Returns: SRO Item Serial Numbers

**Data Chain Flow**:
```
SRO No. (from SRO Schedule)
  ↓
SRO Item Code API
  ↓
Get SRO Item Serial Numbers
  ↓
Display in dropdown
```

---

## Complete FBR Data Chain Visualization

```
Product Creation Flow:
┌─────────────────────────────────────────────────────┐
│ 1. Enter HS Code (e.g., 8471.3000)                 │
│    ↓ Triggers                                       │
│    • HS Code Description fetch                      │
│    • UOM list fetch (already implemented)           │
│    • Enable Transaction Type selection              │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 2. Select Province (from business or manual)        │
│    + Enter Date (current date default)              │
│    ↓ Enables                                        │
│    • Transaction Type API call                      │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 3. Fetch Transaction Types                          │
│    API: /pdi/v1/transtypecode                       │
│    Display: Dropdown of transaction types           │
│    User: Selects one → Get transTypeId              │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 4. Fetch Tax Rates                                  │
│    API: /pdi/v2/SaleTypeToRate                      │
│    Params: date, transTypeId, originationSupplier   │
│    Returns: Rate ID + Rate Description              │
│    Display: Dropdown (if multiple)                  │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 5. Fetch SRO Schedule (Optional)                    │
│    API: /pdi/v1/SroSchedule                         │
│    Params: rate_id, date, origination_supplier_csv  │
│    Returns: SRO No. and details                     │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 6. Fetch SRO Item Serial No. (Optional)             │
│    API: /pdi/v1/sroitemcode                         │
│    Based on: SRO No. from previous step             │
│    Returns: SRO Item Serial Numbers                 │
│    Display: Dropdown                                │
└─────────────────────────────────────────────────────┘
```

---

## Files to Create/Modify

### New API Routes:
1. `apps/web/src/app/api/fbr/scenarios/route.ts` - Scenario filtering
2. `apps/web/src/app/api/fbr/transaction-types/route.ts` - Transaction types
3. `apps/web/src/app/api/fbr/tax-rates/route.ts` - Tax rate calculations
4. `apps/web/src/app/api/fbr/sro-schedule/route.ts` - SRO schedule lookup
5. `apps/web/src/app/api/fbr/sro-items/route.ts` - SRO item codes

### Modified Files:
1. `apps/web/prisma/schema.prisma` - Add fields to Product model
2. `apps/web/src/app/invoices/create/page.tsx` - Make scenarioId optional
3. `apps/web/src/app/products/create/page.tsx` - Add all FBR fields
4. `apps/web/src/app/api/fbr/lookup/route.ts` - Enhance with search

### Database Migrations:
1. Add scenarios with business type and sector mapping
2. Add transaction type reference data
3. Update Product model with new fields

---

## Implementation Sequence

### Phase 1: Database & Schema (Priority 1)
1. Update Prisma schema for Product model
2. Create scenario seed data
3. Run migrations

### Phase 2: API Routes (Priority 2)
4. Create FBR scenario API endpoint
5. Create transaction type API endpoint
6. Create tax rate API endpoint
7. Create SRO schedule API endpoint
8. Create SRO item API endpoint
9. Enhance lookup API with search

### Phase 3: Invoice Form (Priority 3)
10. Make scenarioId optional
11. Add blank option to dropdown

### Phase 4: Product Form (Priority 4)
12. Remove category dropdown, add text input
13. Add product serial number
14. Add HS Code live search
15. Add HS Code description display
16. Add transaction type field with chaining
17. Add rate ID and rate description fields
18. Add SRO No. field with chaining
19. Add SRO Item Serial No. field with chaining

---

## Testing Checklist

- [ ] Scenario ID can be left blank in production
- [ ] Scenarios filter by business type and sector
- [ ] Product category is optional text input
- [ ] Product serial number generates correctly
- [ ] HS Code search works in real-time
- [ ] HS Code description displays
- [ ] UOM filters by HS Code (existing feature)
- [ ] Transaction types fetch correctly
- [ ] Tax rates calculate based on transaction type
- [ ] SRO schedule fetches based on rate ID
- [ ] SRO item codes fetch based on SRO No.
- [ ] All chained fields update correctly
- [ ] Form validation doesn't break

---

## Notes

- All FBR APIs are public (no authentication required for reference data)
- Data chaining dependencies must be respected (can't fetch SRO without Rate ID)
- Some fields are optional (SRO fields only for certain scenarios)
- Cache FBR reference data to reduce API calls
- Show loading indicators during API calls
- Handle API failures gracefully with error messages
