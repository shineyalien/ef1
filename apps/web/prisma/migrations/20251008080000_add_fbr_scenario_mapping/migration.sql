-- Add saleType field to FBRScenario table
ALTER TABLE "fbr_scenarios" ADD COLUMN "saleType" TEXT;

-- Create business type to scenario mapping table
CREATE TABLE "fbr_business_scenario_mappings" (
    "id" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "industrySector" TEXT NOT NULL,
    "scenarioIds" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "fbr_business_scenario_mappings_pkey" PRIMARY KEY ("id")
);

-- Create indexes for the mapping table
CREATE INDEX "fbr_business_scenario_mappings_business_type_idx" ON "fbr_business_scenario_mappings"("businessType");
CREATE INDEX "fbr_business_scenario_mappings_industry_sector_idx" ON "fbr_business_scenario_mappings"("industrySector");
CREATE INDEX "fbr_business_scenario_mappings_is_active_idx" ON "fbr_business_scenario_mappings"("isActive");

-- Insert seed data for all 28 scenarios
INSERT INTO "fbr_scenarios" ("id", "code", "description", "saleType", "isActive", "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'SN001', 'Goods at standard rate to registered buyers', 'Goods at Standard Rate (default)', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN002', 'Goods at standard rate to unregistered buyers', 'Goods at Standard Rate (default)', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN003', 'Sale of Steel (Melted and Re-Rolled)', 'Steel Melting and re-rolling', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN004', 'Sale by Ship Breakers', 'Ship breaking', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN005', 'Reduced rate sale', 'Goods at Reduced Rate', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN006', 'Exempt goods sale', 'Exempt Goods', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN007', 'Zero rated sale', 'Goods at zero-rate', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN008', 'Sale of 3rd schedule goods', '3rd Schedule Goods', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN009', 'Cotton Spinners purchase from Cotton Ginners (Textile Sector)', 'Cotton Ginners', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN010', 'Telecom services rendered or provided', 'Telecommunication services', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN011', 'Toll Manufacturing sale by Steel sector', 'Toll Manufacturing', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN012', 'Sale of Petroleum products', 'Petroleum Products', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN013', 'Electricity Supply to Retailers', 'Electricity Supply to Retailers', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN014', 'Sale of Gas to CNG stations', 'Gas to CNG stations', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN015', 'Sale of mobile phones', 'Mobile Phones', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN016', 'Processing / Conversion of Goods', 'Processing/ Conversion of Goods', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN017', 'Sale of Goods where FED is charged in ST mode', 'Goods (FED in ST Mode)', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN018', 'Services rendered or provided where FED is charged in ST mode', 'Services (FED in ST Mode)', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN019', 'Services rendered or provided', 'Services', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN020', 'Sale of Electric Vehicles', 'Electric Vehicle', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN021', 'Sale of Cement /Concrete Block', 'Cement /Concrete Block', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN022', 'Sale of Potassium Chlorate', 'Potassium Chlorate', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN023', 'Sale of CNG', 'CNG Sales', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN024', 'Goods sold that are listed in SRO 297(1)/2023', 'Goods as per SRO.297(|)/2023', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN025', 'Drugs sold at fixed ST rate under serial 81 of Eighth Schedule Table 1', 'Non-Adjustable Supplies', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN026', 'Sale to End Consumer by retailers', 'Goods at Standard Rate (default)', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN027', 'Sale to End Consumer by retailers', '3rd Schedule Goods', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'SN028', 'Sale to End Consumer by retailers', 'Goods at Reduced Rate', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO UPDATE SET
    "description" = EXCLUDED."description",
    "saleType" = EXCLUDED."saleType",
    "updatedAt" = CURRENT_TIMESTAMP;

-- Insert seed data for business type to scenario mappings
-- Manufacturer mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('mfg-all-other', 'Manufacturer', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-steel', 'Manufacturer', 'Steel', ARRAY['SN003', 'SN004', 'SN011'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-fmcg', 'Manufacturer', 'FMCG', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-textile', 'Manufacturer', 'Textile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN009'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-telecom', 'Manufacturer', 'Telecom', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN010'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-petroleum', 'Manufacturer', 'Petroleum', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN012'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-electricity', 'Manufacturer', 'Electricity Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN013'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-gas', 'Manufacturer', 'Gas Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN014'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-services', 'Manufacturer', 'Services', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-automobile', 'Manufacturer', 'Automobile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN020'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-cng', 'Manufacturer', 'CNG Stations', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN023'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-pharmaceuticals', 'Manufacturer', 'Pharmaceuticals', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-wholesale', 'Manufacturer', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT DO NOTHING;

-- Importer mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('imp-all-other', 'Importer', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-steel', 'Importer', 'Steel', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN003', 'SN004', 'SN011'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-fmcg', 'Importer', 'FMCG', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-textile', 'Importer', 'Textile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN009'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-telecom', 'Importer', 'Telecom', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN010'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-petroleum', 'Importer', 'Petroleum', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN012'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-electricity', 'Importer', 'Electricity Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN013'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-gas', 'Importer', 'Gas Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN014'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-services', 'Importer', 'Services', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-automobile', 'Importer', 'Automobile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN020'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-cng', 'Importer', 'CNG Stations', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN023'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-pharmaceuticals', 'Importer', 'Pharmaceuticals', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-wholesale', 'Importer', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT DO NOTHING;

-- Distributor mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('dist-all-other', 'Distributor', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-steel', 'Distributor', 'Steel', ARRAY['SN003', 'SN004', 'SN011', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-fmcg', 'Distributor', 'FMCG', ARRAY['SN008', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-textile', 'Distributor', 'Textile', ARRAY['SN009', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-telecom', 'Distributor', 'Telecom', ARRAY['SN010', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-petroleum', 'Distributor', 'Petroleum', ARRAY['SN012', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-electricity', 'Distributor', 'Electricity Distribution', ARRAY['SN013', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-gas', 'Distributor', 'Gas Distribution', ARRAY['SN014', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-services', 'Distributor', 'Services', ARRAY['SN018', 'SN019', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-automobile', 'Distributor', 'Automobile', ARRAY['SN020', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-cng', 'Distributor', 'CNG Stations', ARRAY['SN023', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-pharmaceuticals', 'Distributor', 'Pharmaceuticals', ARRAY['SN025', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-wholesale', 'Distributor', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT DO NOTHING;

-- Wholesaler mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('whl-all-other', 'Wholesaler', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-steel', 'Wholesaler', 'Steel', ARRAY['SN003', 'SN004', 'SN011', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-fmcg', 'Wholesaler', 'FMCG', ARRAY['SN008', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-textile', 'Wholesaler', 'Textile', ARRAY['SN009', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-telecom', 'Wholesaler', 'Telecom', ARRAY['SN010', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-petroleum', 'Wholesaler', 'Petroleum', ARRAY['SN012', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-electricity', 'Wholesaler', 'Electricity Distribution', ARRAY['SN013', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-gas', 'Wholesaler', 'Gas Distribution', ARRAY['SN014', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-services', 'Wholesaler', 'Services', ARRAY['SN018', 'SN019', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-automobile', 'Wholesaler', 'Automobile', ARRAY['SN020', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-cng', 'Wholesaler', 'CNG Stations', ARRAY['SN023', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-pharmaceuticals', 'Wholesaler', 'Pharmaceuticals', ARRAY['SN025', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-wholesale', 'Wholesaler', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT DO NOTHING;

-- Exporter mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('exp-all-other', 'Exporter', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-steel', 'Exporter', 'Steel', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN003', 'SN004', 'SN011'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-fmcg', 'Exporter', 'FMCG', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-textile', 'Exporter', 'Textile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN009'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-telecom', 'Exporter', 'Telecom', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN010'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-petroleum', 'Exporter', 'Petroleum', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN012'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-electricity', 'Exporter', 'Electricity Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN013'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-gas', 'Exporter', 'Gas Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN014'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-services', 'Exporter', 'Services', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-automobile', 'Exporter', 'Automobile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN020'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-cng', 'Exporter', 'CNG Stations', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN023'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-pharmaceuticals', 'Exporter', 'Pharmaceuticals', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-wholesale', 'Exporter', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT DO NOTHING;

-- Retailer mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('ret-all-other', 'Retailer', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-steel', 'Retailer', 'Steel', ARRAY['SN003', 'SN004', 'SN011'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-fmcg', 'Retailer', 'FMCG', ARRAY['SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-textile', 'Retailer', 'Textile', ARRAY['SN009', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-telecom', 'Retailer', 'Telecom', ARRAY['SN010', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-petroleum', 'Retailer', 'Petroleum', ARRAY['SN012', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-electricity', 'Retailer', 'Electricity Distribution', ARRAY['SN013', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-gas', 'Retailer', 'Gas Distribution', ARRAY['SN014', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-services', 'Retailer', 'Services', ARRAY['SN018', 'SN019', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-automobile', 'Retailer', 'Automobile', ARRAY['SN020', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-cng', 'Retailer', 'CNG Stations', ARRAY['SN023', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-pharmaceuticals', 'Retailer', 'Pharmaceuticals', ARRAY['SN025', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-wholesale', 'Retailer', 'Wholesale / Retails', ARRAY['SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT DO NOTHING;

-- Service Provider mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('srv-all-other', 'Service Provider', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-steel', 'Service Provider', 'Steel', ARRAY['SN003', 'SN004', 'SN011', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-fmcg', 'Service Provider', 'FMCG', ARRAY['SN008', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-textile', 'Service Provider', 'Textile', ARRAY['SN009', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-telecom', 'Service Provider', 'Telecom', ARRAY['SN010', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-petroleum', 'Service Provider', 'Petroleum', ARRAY['SN012', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-electricity', 'Service Provider', 'Electricity Distribution', ARRAY['SN013', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-gas', 'Service Provider', 'Gas Distribution', ARRAY['SN014', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-services', 'Service Provider', 'Services', ARRAY['SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-automobile', 'Service Provider', 'Automobile', ARRAY['SN020', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-cng', 'Service Provider', 'CNG Stations', ARRAY['SN023', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-pharmaceuticals', 'Service Provider', 'Pharmaceuticals', ARRAY['SN025', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-wholesale', 'Service Provider', 'Wholesale / Retails', ARRAY['SN026', 'SN027', 'SN028', 'SN008', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT DO NOTHING;

-- Other business type mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('oth-all-other', 'Other', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-steel', 'Other', 'Steel', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN003', 'SN004', 'SN011'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-fmcg', 'Other', 'FMCG', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-textile', 'Other', 'Textile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN009'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-telecom', 'Other', 'Telecom', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN010'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-petroleum', 'Other', 'Petroleum', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN012'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-electricity', 'Other', 'Electricity Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN013'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-gas', 'Other', 'Gas Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN014'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-services', 'Other', 'Services', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-automobile', 'Other', 'Automobile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN020'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-cng', 'Other', 'CNG Stations', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN023'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-pharmaceuticals', 'Other', 'Pharmaceuticals', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-wholesale', 'Other', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028', 'SN008'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT DO NOTHING;