-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "retryProcessing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "retryProcessingSince" TIMESTAMP(3);