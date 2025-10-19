-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_name_search_idx" ON "products"("businessId", "isActive", lower("name")) WHERE "isActive" = true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_description_search_idx" ON "products"("businessId", "isActive", lower("description")) WHERE "isActive" = true AND "description" IS NOT NULL;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_hs_code_search_idx" ON "products"("businessId", "isActive", "hsCode") WHERE "isActive" = true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_category_search_idx" ON "products"("businessId", "isActive", lower("category")) WHERE "isActive" = true AND "category" IS NOT NULL;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_serial_number_search_idx" ON "products"("businessId", "isActive", lower("serialNumber")) WHERE "isActive" = true AND "serialNumber" IS NOT NULL;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_price_range_idx" ON "products"("businessId", "isActive", "unitPrice") WHERE "isActive" = true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_sort_name_idx" ON "products"("businessId", "isActive", "name" ASC) WHERE "isActive" = true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_sort_price_idx" ON "products"("businessId", "isActive", "unitPrice" ASC) WHERE "isActive" = true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_sort_created_idx" ON "products"("businessId", "isActive", "createdAt" DESC) WHERE "isActive" = true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_sort_updated_idx" ON "products"("businessId", "isActive", "updatedAt" DESC) WHERE "isActive" = true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_business_active_idx" ON "products"("businessId", "isActive") WHERE "isActive" = true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_business_category_active_idx" ON "products"("businessId", lower("category"), "isActive") WHERE "isActive" = true AND "category" IS NOT NULL;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_business_hscode_active_idx" ON "products"("businessId", "hsCode", "isActive") WHERE "isActive" = true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_business_price_active_idx" ON "products"("businessId", "unitPrice", "isActive") WHERE "isActive" = true;