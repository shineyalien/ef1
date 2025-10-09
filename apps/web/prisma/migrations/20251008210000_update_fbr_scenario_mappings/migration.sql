-- Update FBR scenario mappings with correct logic
-- This migration fixes the scenario mappings to ensure users only see scenarios applicable to their business type and sector

-- First, let's clear existing mappings to ensure clean state
DELETE FROM "fbr_business_scenario_mappings";

-- Now insert the correct mappings based on FBR guidelines
-- Manufacturer mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('mfg-all-other', 'Manufacturer', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-steel', 'Manufacturer', 'Steel', ARRAY['SN003', 'SN004', 'SN011'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-fmcg', 'Manufacturer', 'FMCG', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-textile', 'Manufacturer', 'Textile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN009', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-telecom', 'Manufacturer', 'Telecom', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN010', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-petroleum', 'Manufacturer', 'Petroleum', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN012', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-electricity', 'Manufacturer', 'Electricity Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN013', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-gas', 'Manufacturer', 'Gas Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN014', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-services', 'Manufacturer', 'Services', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-automobile', 'Manufacturer', 'Automobile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN020', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-cng', 'Manufacturer', 'CNG Stations', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN023', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-pharmaceuticals', 'Manufacturer', 'Pharmaceuticals', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mfg-wholesale', 'Manufacturer', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Importer mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('imp-all-other', 'Importer', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-steel', 'Importer', 'Steel', ARRAY['SN001', 'SN002', 'SN003', 'SN004', 'SN005', 'SN006', 'SN007', 'SN011', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-fmcg', 'Importer', 'FMCG', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-textile', 'Importer', 'Textile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN009', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-telecom', 'Importer', 'Telecom', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN010', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-petroleum', 'Importer', 'Petroleum', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN012', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-electricity', 'Importer', 'Electricity Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN013', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-gas', 'Importer', 'Gas Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN014', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-services', 'Importer', 'Services', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-automobile', 'Importer', 'Automobile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN020', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-cng', 'Importer', 'CNG Stations', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN023', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-pharmaceuticals', 'Importer', 'Pharmaceuticals', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('imp-wholesale', 'Importer', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Distributor mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('dist-all-other', 'Distributor', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-steel', 'Distributor', 'Steel', ARRAY['SN003', 'SN004', 'SN008', 'SN011', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-fmcg', 'Distributor', 'FMCG', ARRAY['SN008', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-textile', 'Distributor', 'Textile', ARRAY['SN008', 'SN009', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-telecom', 'Distributor', 'Telecom', ARRAY['SN008', 'SN010', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-petroleum', 'Distributor', 'Petroleum', ARRAY['SN008', 'SN012', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-electricity', 'Distributor', 'Electricity Distribution', ARRAY['SN008', 'SN013', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-gas', 'Distributor', 'Gas Distribution', ARRAY['SN008', 'SN014', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-services', 'Distributor', 'Services', ARRAY['SN018', 'SN019', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-automobile', 'Distributor', 'Automobile', ARRAY['SN008', 'SN020', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-cng', 'Distributor', 'CNG Stations', ARRAY['SN008', 'SN023', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-pharmaceuticals', 'Distributor', 'Pharmaceuticals', ARRAY['SN008', 'SN025', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dist-wholesale', 'Distributor', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN008', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Wholesaler mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('whl-all-other', 'Wholesaler', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-steel', 'Wholesaler', 'Steel', ARRAY['SN003', 'SN004', 'SN008', 'SN011', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-fmcg', 'Wholesaler', 'FMCG', ARRAY['SN008', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-textile', 'Wholesaler', 'Textile', ARRAY['SN008', 'SN009', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-telecom', 'Wholesaler', 'Telecom', ARRAY['SN008', 'SN010', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-petroleum', 'Wholesaler', 'Petroleum', ARRAY['SN008', 'SN012', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-electricity', 'Wholesaler', 'Electricity Distribution', ARRAY['SN008', 'SN013', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-gas', 'Wholesaler', 'Gas Distribution', ARRAY['SN008', 'SN014', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-services', 'Wholesaler', 'Services', ARRAY['SN018', 'SN019', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-automobile', 'Wholesaler', 'Automobile', ARRAY['SN008', 'SN020', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-cng', 'Wholesaler', 'CNG Stations', ARRAY['SN008', 'SN023', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-pharmaceuticals', 'Wholesaler', 'Pharmaceuticals', ARRAY['SN008', 'SN025', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('whl-wholesale', 'Wholesaler', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN008', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Exporter mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('exp-all-other', 'Exporter', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-steel', 'Exporter', 'Steel', ARRAY['SN001', 'SN002', 'SN003', 'SN004', 'SN005', 'SN006', 'SN007', 'SN011', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-fmcg', 'Exporter', 'FMCG', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-textile', 'Exporter', 'Textile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN009', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-telecom', 'Exporter', 'Telecom', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN010', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-petroleum', 'Exporter', 'Petroleum', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN012', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-electricity', 'Exporter', 'Electricity Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN013', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-gas', 'Exporter', 'Gas Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN014', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-services', 'Exporter', 'Services', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-automobile', 'Exporter', 'Automobile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN020', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-cng', 'Exporter', 'CNG Stations', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN023', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-pharmaceuticals', 'Exporter', 'Pharmaceuticals', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('exp-wholesale', 'Exporter', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Retailer mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('ret-all-other', 'Retailer', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-steel', 'Retailer', 'Steel', ARRAY['SN003', 'SN004', 'SN011'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-fmcg', 'Retailer', 'FMCG', ARRAY['SN008', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-textile', 'Retailer', 'Textile', ARRAY['SN008', 'SN009', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-telecom', 'Retailer', 'Telecom', ARRAY['SN008', 'SN010', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-petroleum', 'Retailer', 'Petroleum', ARRAY['SN008', 'SN012', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-electricity', 'Retailer', 'Electricity Distribution', ARRAY['SN008', 'SN013', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-gas', 'Retailer', 'Gas Distribution', ARRAY['SN008', 'SN014', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-services', 'Retailer', 'Services', ARRAY['SN018', 'SN019', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-automobile', 'Retailer', 'Automobile', ARRAY['SN008', 'SN020', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-cng', 'Retailer', 'CNG Stations', ARRAY['SN008', 'SN023', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-pharmaceuticals', 'Retailer', 'Pharmaceuticals', ARRAY['SN008', 'SN025', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ret-wholesale', 'Retailer', 'Wholesale / Retails', ARRAY['SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Service Provider mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('srv-all-other', 'Service Provider', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-steel', 'Service Provider', 'Steel', ARRAY['SN003', 'SN004', 'SN011', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-fmcg', 'Service Provider', 'FMCG', ARRAY['SN008', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-textile', 'Service Provider', 'Textile', ARRAY['SN008', 'SN009', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-telecom', 'Service Provider', 'Telecom', ARRAY['SN008', 'SN010', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-petroleum', 'Service Provider', 'Petroleum', ARRAY['SN008', 'SN012', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-electricity', 'Service Provider', 'Electricity Distribution', ARRAY['SN008', 'SN013', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-gas', 'Service Provider', 'Gas Distribution', ARRAY['SN008', 'SN014', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-services', 'Service Provider', 'Services', ARRAY['SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-automobile', 'Service Provider', 'Automobile', ARRAY['SN008', 'SN020', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-cng', 'Service Provider', 'CNG Stations', ARRAY['SN008', 'SN023', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-pharmaceuticals', 'Service Provider', 'Pharmaceuticals', ARRAY['SN008', 'SN025', 'SN018', 'SN019'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('srv-wholesale', 'Service Provider', 'Wholesale / Retails', ARRAY['SN008', 'SN018', 'SN019', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Other business type mappings
INSERT INTO "fbr_business_scenario_mappings" ("id", "businessType", "industrySector", "scenarioIds", "createdAt", "updatedAt") VALUES
('oth-all-other', 'Other', 'All Other Sectors', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-steel', 'Other', 'Steel', ARRAY['SN001', 'SN002', 'SN003', 'SN004', 'SN005', 'SN006', 'SN007', 'SN011', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-fmcg', 'Other', 'FMCG', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-textile', 'Other', 'Textile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN009', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-telecom', 'Other', 'Telecom', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN010', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-petroleum', 'Other', 'Petroleum', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN012', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-electricity', 'Other', 'Electricity Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN013', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-gas', 'Other', 'Gas Distribution', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN014', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-services', 'Other', 'Services', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-automobile', 'Other', 'Automobile', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN020', 'SN021', 'SN022', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-cng', 'Other', 'CNG Stations', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN023', 'SN024'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-pharmaceuticals', 'Other', 'Pharmaceuticals', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN025'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oth-wholesale', 'Other', 'Wholesale / Retails', ARRAY['SN001', 'SN002', 'SN005', 'SN006', 'SN007', 'SN008', 'SN015', 'SN016', 'SN017', 'SN021', 'SN022', 'SN024', 'SN026', 'SN027', 'SN028'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;