/*
  Warnings:

  - You are about to drop the `fbr_sale_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "fbr_sale_types";

-- CreateTable
CREATE TABLE "fbr_sale_type_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "hsCode" TEXT,
    "scenarioId" TEXT,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_sale_type_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fbr_sale_type_codes_code_hsCode_scenarioId_key" ON "fbr_sale_type_codes"("code", "hsCode", "scenarioId");
