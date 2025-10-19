-- Create indexes for retry-related fields to improve performance

-- Index for finding invoices ready for retry
CREATE INDEX "invoices_retry_ready_idx" ON "invoices" (
  "status", 
  "retryEnabled", 
  "fbrSubmitted", 
  "fbrValidated", 
  "nextRetryAt"
) WHERE "status" = 'FAILED' AND "retryEnabled" = true;

-- Index for retry processing lock management
CREATE INDEX "invoices_retry_processing_idx" ON "invoices" (
  "retryProcessing", 
  "retryProcessingSince"
) WHERE "retryProcessing" = true;

-- Composite index for retry count and status
CREATE INDEX "invoices_retry_count_status_idx" ON "invoices" (
  "retryCount", 
  "maxRetries", 
  "status"
) WHERE "status" = 'FAILED';

-- Index for last retry timestamp (for ordering)
CREATE INDEX "invoices_last_retry_at_idx" ON "invoices" ("lastRetryAt") 
WHERE "lastRetryAt" IS NOT NULL;

-- Index for error analysis
CREATE INDEX "invoices_error_analysis_idx" ON "invoices" (
  "fbrErrorCode", 
  "fbrErrorMessage", 
  "status"
) WHERE "fbrErrorCode" IS NOT NULL;