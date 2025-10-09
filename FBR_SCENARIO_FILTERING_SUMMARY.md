# FBR Scenario Filtering Implementation Summary

## Overview
We have successfully implemented a comprehensive FBR scenario filtering system that automatically filters scenarios based on a business's type and sector, as defined in the FBR technical documentation.

## Changes Made

### 1. Database Schema Updates
- Created a new migration file `20251008080000_add_fbr_scenario_mapping/migration.sql` that:
  - Adds a `saleType` field to the `FBRScenario` model
  - Creates a new `FBRBusinessScenarioMapping` model to map business types and sectors to applicable scenarios
  - Populates the mapping table with official FBR scenario mappings from the technical documentation

### 2. Scenario Data Updates
- Updated the FBR scenarios data with correct IDs (SN001-SN028) and descriptions
- Added the `saleType` field to each scenario, matching the official FBR technical documentation
- Ensured all scenarios are properly categorized by business type and sector

### 3. API Endpoint Updates
- Modified the `/api/fbr/scenarios` endpoint to:
  - Use the new business type to scenario mapping tables
  - Filter scenarios based on business type and sector
  - Fall back to direct scenario lookup if no mapping is found
  - Include the `saleType` field in scenario responses

### 4. Scenario Filtering Logic
- Implemented the `getScenariosByBusinessTypeAndSector` function in `fbr-scenarios.ts` that:
  - Retrieves scenarios from the database using the mapping tables
  - Applies additional filtering based on transaction type, registration type, and province
  - Falls back to in-memory scenarios if database lookup fails
  - Returns a default scenario for the business type and sector

### 5. Invoice Creation Page Updates
- Updated the invoice creation page to:
  - Load scenarios filtered by business type and sector
  - Use the default scenario from business settings
  - Provide better feedback when loading scenarios
  - Show the number of available scenarios

### 6. Business Settings Page Updates
- Enhanced the business settings page to:
  - Properly validate and save business type and sector
  - Show applicable scenarios based on selected business type and sector
  - Allow users to select a default scenario for their business
  - Provide detailed information about the selected scenario

## Benefits

1. **Automatic Scenario Filtering**: The system now automatically filters FBR scenarios based on a business's type and sector, ensuring users only see relevant scenarios.

2. **Compliance with FBR Guidelines**: All scenario mappings are based on the official FBR technical documentation, ensuring compliance.

3. **Improved User Experience**: Users no longer need to manually search through all scenarios to find the ones applicable to their business.

4. **Database-Driven Solution**: The scenario mappings are stored in the database, making them easy to update and maintain.

5. **Fallback Mechanisms**: The system includes robust fallback mechanisms to ensure it continues to work even if the database is unavailable.

## Next Steps

1. Run the database migration to apply the schema changes:
   ```bash
   npx prisma migrate deploy
   ```

2. Regenerate the Prisma client to include the new models:
   ```bash
   npx prisma generate
   ```

3. Test the scenario filtering functionality with different business types and sectors.

4. Consider adding a UI to allow administrators to update scenario mappings in the future.

## Technical Notes

- The scenario mapping tables use the official FBR business types and sectors from the technical documentation.
- Each scenario is mapped to one or more business type/sector combinations.
- The system includes all 28 official FBR scenarios (SN001-SN028).
- The `saleType` field in the scenario model matches the "FBR Sale Type" from the technical documentation.
- The mapping table includes a `scenarioIds` array field to store multiple scenario codes for each business type/sector combination.