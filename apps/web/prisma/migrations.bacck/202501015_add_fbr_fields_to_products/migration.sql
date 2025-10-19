-- AlterTable
ALTER TABLE "products" ADD COLUMN     "serialNumber" TEXT,
ADD COLUMN     "transactionType" TEXT,
ADD COLUMN     "transactionTypeDesc" TEXT,
ADD COLUMN     "rateId" TEXT,
ADD COLUMN     "rateDescription" TEXT,
ADD COLUMN     "sroScheduleNo" TEXT,
ADD COLUMN     "sroItemSerialNo" TEXT;