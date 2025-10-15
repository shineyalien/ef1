-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "discount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "valueSalesExcludingST" DOUBLE PRECISION,
ADD COLUMN     "salesTaxApplicable" DOUBLE PRECISION,
ADD COLUMN     "salesTaxWithheldAtSource" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "extraTax" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "furtherTax" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "fedPayable" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "saleType" TEXT DEFAULT 'Standard',
ADD COLUMN     "sroScheduleNo" TEXT,
ADD COLUMN     "sroItemSerialNo" TEXT,
ADD COLUMN     "fixedNotifiedValueOrRetailPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "productId" TEXT;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;