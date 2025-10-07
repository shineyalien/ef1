-- Add indexes for product search performance
-- These indexes will significantly improve search performance on large product catalogs

-- Index for product name searches (case-insensitive)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_name_search_idx" ON "products" (
  "businessId",
  "isActive",
  LOWER("name")
) WHERE "isActive" = true;

-- Index for product description searches (case-insensitive)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_description_search_idx" ON "products" (
  "businessId",
  "isActive",
  LOWER("description")
) WHERE "isActive" = true AND "description" IS NOT NULL;

-- Index for HS Code searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_hs_code_search_idx" ON "products" (
  "businessId",
  "isActive",
  "hsCode"
) WHERE "isActive" = true;

-- Index for category searches (case-insensitive)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_category_search_idx" ON "products" (
  "businessId",
  "isActive",
  LOWER("category")
) WHERE "isActive" = true AND "category" IS NOT NULL;

-- Index for serial number searches (case-insensitive)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_serial_number_search_idx" ON "products" (
  "businessId",
  "isActive",
  LOWER("serialNumber")
) WHERE "isActive" = true AND "serialNumber" IS NOT NULL;

-- Composite index for price range searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_price_range_idx" ON "products" (
  "businessId",
  "isActive",
  "unitPrice"
) WHERE "isActive" = true;

-- Composite index for sorting by name
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_sort_name_idx" ON "products" (
  "businessId",
  "isActive",
  "name" ASC
) WHERE "isActive" = true;

-- Composite index for sorting by price
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_sort_price_idx" ON "products" (
  "businessId",
  "isActive",
  "unitPrice" ASC
) WHERE "isActive" = true;

-- Composite index for sorting by creation date
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_sort_created_idx" ON "products" (
  "businessId",
  "isActive",
  "createdAt" DESC
) WHERE "isActive" = true;

-- Composite index for sorting by update date
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_sort_updated_idx" ON "products" (
  "businessId",
  "isActive",
  "updatedAt" DESC
) WHERE "isActive" = true;

-- Full-text search index for PostgreSQL (if available)
-- This provides better search performance for natural language searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_fulltext_search_idx" ON "products" 
USING GIN (
  to_tsvector('english', COALESCE("name", '') || ' ' || COALESCE("description", '') || ' ' || COALESCE("category", '') || ' ' || COALESCE("hsCode", ''))
) WHERE "isActive" = true;

-- Composite index for business and active status (most common query pattern)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_business_active_idx" ON "products" (
  "businessId",
  "isActive"
) WHERE "isActive" = true;

-- Index for product searches with category filter
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_business_category_active_idx" ON "products" (
  "businessId",
  LOWER("category"),
  "isActive"
) WHERE "isActive" = true AND "category" IS NOT NULL;

-- Index for product searches with HS Code filter
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_business_hscode_active_idx" ON "products" (
  "businessId",
  "hsCode",
  "isActive"
) WHERE "isActive" = true;

-- Index for product searches with price range filter
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_business_price_active_idx" ON "products" (
  "businessId",
  "unitPrice",
  "isActive"
) WHERE "isActive" = true;