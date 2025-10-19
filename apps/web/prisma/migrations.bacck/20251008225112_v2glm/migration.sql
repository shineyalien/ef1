-- DropIndex
DROP INDEX "fbr_business_scenario_mappings_business_type_idx";

-- DropIndex
DROP INDEX "fbr_business_scenario_mappings_industry_sector_idx";

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "defaultCurrency" TEXT NOT NULL DEFAULT 'PKR',
ADD COLUMN     "defaultScenario" TEXT,
ADD COLUMN     "invoiceTemplate" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "primaryColor" TEXT,
ADD COLUMN     "secondaryColor" TEXT,
ADD COLUMN     "taxIdLabel" TEXT;

-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "fbrRateDesc" TEXT,
ADD COLUMN     "fbrRateId" TEXT,
ADD COLUMN     "fbrTransactionTypeDesc" TEXT,
ADD COLUMN     "fbrTransactionTypeId" TEXT;

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "fbrBuyerAddress" TEXT,
ADD COLUMN     "fbrBuyerCNIC" TEXT,
ADD COLUMN     "fbrBuyerCity" TEXT,
ADD COLUMN     "fbrBuyerContact" TEXT,
ADD COLUMN     "fbrBuyerEmail" TEXT,
ADD COLUMN     "fbrBuyerNTN" TEXT,
ADD COLUMN     "fbrBuyerPassport" TEXT,
ADD COLUMN     "fbrBuyerProvince" TEXT,
ADD COLUMN     "fbrBuyerType" TEXT;

-- CreateIndex
CREATE INDEX "fbr_business_scenario_mappings_businessType_industrySector_idx" ON "fbr_business_scenario_mappings"("businessType", "industrySector");

-- CreateIndex
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'invoices'
        AND indexname = 'invoices_retry_ready_idx'
    ) THEN
        CREATE INDEX "invoices_retry_ready_idx" ON "invoices"("status", "retryEnabled", "fbrSubmitted", "fbrValidated", "nextRetryAt");
    END IF;
END $$;

-- CreateIndex
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'invoices'
        AND indexname = 'invoices_retry_processing_idx'
    ) THEN
        CREATE INDEX "invoices_retry_processing_idx" ON "invoices"("retryProcessing", "retryProcessingSince");
    END IF;
END $$;

-- CreateIndex
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'invoices'
        AND indexname = 'invoices_retry_count_status_idx'
    ) THEN
        CREATE INDEX "invoices_retry_count_status_idx" ON "invoices"("retryCount", "maxRetries", "status");
    END IF;
END $$;

-- CreateIndex
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'invoices'
        AND indexname = 'invoices_last_retry_at_idx'
    ) THEN
        CREATE INDEX "invoices_last_retry_at_idx" ON "invoices"("lastRetryAt");
    END IF;
END $$;

-- CreateIndex
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'invoices'
        AND indexname = 'invoices_error_analysis_idx'
    ) THEN
        CREATE INDEX "invoices_error_analysis_idx" ON "invoices"("fbrErrorCode", "fbrErrorMessage", "status");
    END IF;
END $$;

-- RenameIndex
ALTER INDEX "fbr_business_scenario_mappings_is_active_idx" RENAME TO "fbr_business_scenario_mappings_isActive_idx";
