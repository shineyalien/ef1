-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "defaultPaymentTerms" TEXT,
ADD COLUMN     "footerText" TEXT,
ADD COLUMN     "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
ADD COLUMN     "lastTokenValidation" TIMESTAMP(3),
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "productionTokenValidated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sandboxTokenValidated" BOOLEAN NOT NULL DEFAULT false;
