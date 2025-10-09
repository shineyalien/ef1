# FBR Scenario Mapping Fix Summary

## Problem Statement
The FBR scenario filtering system was not correctly filtering scenarios based on business type and sector. Users were seeing all 28 scenarios regardless of their business type and sector, instead of only the scenarios applicable to their specific business combination.

## Root Cause
The issue was in the database mappings for FBR scenarios. The `fbr_business_scenario_mappings` table contained incorrect mappings that didn't properly filter scenarios based on business type and sector.

## Solution Implemented

### 1. Created New Migration
- File: `apps/web/prisma/migrations/20251008210000_update_fbr_scenario_mappings/migration.sql`
- This migration clears existing mappings and inserts the correct mappings based on FBR guidelines
- Each business type and sector combination now has a specific set of applicable scenarios

### 2. Updated API Endpoint
- File: `apps/web/src/app/api/fbr/scenarios/route.ts`
- Added verification logic to check specific scenario combinations
- Enhanced logging to track which scenarios are returned for each business type and sector
- Added validation for the two key combinations mentioned in the task:
  - Manufacturer + All Other Sectors should return: SN001, SN002, SN005, SN006, SN007, SN015, SN016, SN017, SN021, SN022, SN024
  - Manufacturer + Steel should return: SN003, SN004, SN011

### 3. Created Test Script
- File: `test-fbr-scenario-mappings.js`
- Comprehensive test script that verifies all business type and sector combinations
- Compares actual mappings with expected mappings
- Provides detailed output for any mismatches

## Key Changes

### Manufacturer Mappings
- **All Other Sectors**: SN001, SN002, SN005, SN006, SN007, SN015, SN016, SN017, SN021, SN022, SN024
- **Steel**: SN003, SN004, SN011
- **FMCG**: SN001, SN002, SN005, SN006, SN007, SN008, SN015, SN016, SN017, SN021, SN022, SN024
- **Textile**: SN001, SN002, SN005, SN006, SN007, SN009, SN015, SN016, SN017, SN021, SN022, SN024
- And so on for all sectors...

### Other Business Types
- Similar specific mappings for Importer, Distributor, Wholesaler, Exporter, Retailer, Service Provider, and Other
- Each business type has a specific set of scenarios for each sector

## How to Test

### 1. Run the Migration
```bash
cd apps/web
npx prisma migrate dev
```

### 2. Run the Test Script
```bash
node test-fbr-scenario-mappings.js
```

### 3. Test via API
```bash
# Test Manufacturer + All Other Sectors
curl "http://localhost:3000/api/fbr/scenarios?businessType=Manufacturer&sector=All Other Sectors"

# Test Manufacturer + Steel
curl "http://localhost:3000/api/fbr/scenarios?businessType=Manufacturer&sector=Steel"
```

### 4. Verify in the UI
1. Go to the business settings page
2. Select Manufacturer as business type
3. Select All Other Sectors as sector
4. Verify that only the expected scenarios are shown in the FBR scenario dropdown
5. Change sector to Steel and verify that only SN003, SN004, SN011 are shown

## Expected Results

### Manufacturer + All Other Sectors
Should return exactly these 11 scenarios:
- SN001: Goods at standard rate to registered buyers
- SN002: Goods at standard rate to unregistered buyers
- SN005: Reduced rate sale
- SN006: Exempt goods sale
- SN007: Zero rated sale
- SN015: Sale of mobile phones
- SN016: Processing / Conversion of Goods
- SN017: Sale of Goods where FED is charged in ST mode
- SN021: Sale of Cement /Concrete Block
- SN022: Sale of Potassium Chlorate
- SN024: Goods sold that are listed in SRO 297(1)/2023

### Manufacturer + Steel
Should return exactly these 3 scenarios:
- SN003: Sale of Steel (Melted and Re-Rolled)
- SN004: Sale by Ship Breakers
- SN011: Toll Manufacturing sale by Steel sector

## Troubleshooting

If the scenarios are still not filtering correctly:

1. Check if the migration was applied successfully:
   ```bash
   npx prisma migrate status
   ```

2. Verify the database contents:
   ```bash
   node test-scenario-filtering.js
   ```

3. Check the API logs for detailed information about the filtering process

4. Ensure the database is properly seeded with the scenario data

## Future Enhancements

1. Add an admin interface to manage FBR scenarios and mappings
2. Implement automated synchronization with FBR documentation updates
3. Add more detailed logging for debugging scenario filtering issues
4. Create a UI component to visualize scenario mappings