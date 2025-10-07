-- CreateTable
CREATE TABLE "fbr_transaction_types" (
    "id" TEXT NOT NULL,
    "transTypeId" INTEGER NOT NULL,
    "transTypeDesc" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_transaction_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fbr_transaction_types_transTypeId_key" ON "fbr_transaction_types"("transTypeId");
