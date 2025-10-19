-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "IntegrationMode" AS ENUM ('LOCAL', 'SANDBOX', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "RegistrationType" AS ENUM ('REGISTERED', 'UNREGISTERED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SAVED', 'SUBMITTED', 'VALIDATED', 'PUBLISHED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "country" TEXT NOT NULL DEFAULT 'Pakistan',
    "phoneNumber" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "ntnNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "fbrSetupComplete" BOOLEAN NOT NULL DEFAULT false,
    "fbrSetupSkipped" BOOLEAN NOT NULL DEFAULT false,
    "integrationMode" "IntegrationMode" NOT NULL DEFAULT 'LOCAL',
    "sandboxValidated" BOOLEAN NOT NULL DEFAULT false,
    "sandboxToken" TEXT,
    "productionToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productionTokenAvailable" BOOLEAN NOT NULL DEFAULT false,
    "sellerCity" TEXT,
    "sellerContact" TEXT,
    "sellerEmail" TEXT,
    "posId" TEXT,
    "electronicSoftwareRegNo" TEXT,
    "fbrIntegratorLicenseNo" TEXT,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "ntnNumber" TEXT,
    "registrationType" "RegistrationType" NOT NULL DEFAULT 'UNREGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buyerType" TEXT,
    "buyerNTN" TEXT,
    "buyerCNIC" TEXT,
    "buyerPassport" TEXT,
    "buyerCity" TEXT,
    "buyerProvince" TEXT,
    "buyerContact" TEXT,
    "buyerEmail" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hsCode" TEXT NOT NULL,
    "unitOfMeasurement" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 18,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "fbrSaleType" TEXT,
    "serialNumber" TEXT,
    "hsCodeDescription" TEXT,
    "transactionType" TEXT,
    "transactionTypeDesc" TEXT,
    "rateId" TEXT,
    "rateDescription" TEXT,
    "sroNo" TEXT,
    "sroItemSerialNo" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerId" TEXT,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "mode" "IntegrationMode" NOT NULL DEFAULT 'LOCAL',
    "fbrSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "fbrValidated" BOOLEAN NOT NULL DEFAULT false,
    "submissionTimestamp" TIMESTAMP(3),
    "fbrInvoiceNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceSequence" INTEGER NOT NULL,
    "qrCode" TEXT,
    "qrCodeData" TEXT,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "documentType" TEXT NOT NULL DEFAULT 'Sale Invoice',
    "scenarioId" TEXT,
    "referenceInvoiceNo" TEXT,
    "paymentMode" TEXT NOT NULL DEFAULT '1',
    "taxPeriod" TEXT,
    "fbrResponse" JSONB,
    "fbrResponseData" TEXT,
    "fbrTimestamp" TIMESTAMP(3),
    "fbrTransactionId" TEXT,
    "fbrErrorCode" TEXT,
    "fbrErrorMessage" TEXT,
    "totalBillAmount" DOUBLE PRECISION,
    "totalQuantity" DOUBLE PRECISION,
    "totalDiscount" DOUBLE PRECISION DEFAULT 0,
    "totalSalesTax" DOUBLE PRECISION DEFAULT 0,
    "totalWithholdingTax" DOUBLE PRECISION DEFAULT 0,
    "totalExtraTax" DOUBLE PRECISION DEFAULT 0,
    "totalFurtherTax" DOUBLE PRECISION DEFAULT 0,
    "totalFED" DOUBLE PRECISION DEFAULT 0,
    "isOfflineInvoice" BOOLEAN NOT NULL DEFAULT false,
    "offlineCreatedAt" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT,
    "itemCode" TEXT,
    "description" TEXT NOT NULL,
    "hsCode" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitOfMeasurement" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "saleValue" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valueSalesExcludingST" DOUBLE PRECISION NOT NULL,
    "fbrSaleType" TEXT,
    "taxRate" DOUBLE PRECISION NOT NULL,
    "salesTaxApplicable" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxCharged" DOUBLE PRECISION,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "salesTaxWithheldAtSource" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extraTax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "furtherTax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fedPayable" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sroScheduleNo" TEXT,
    "sroItemSerialNo" TEXT,
    "salesTaxAct" TEXT NOT NULL DEFAULT 'SALES TAX ACT, 1990',
    "totalValue" DOUBLE PRECISION NOT NULL,
    "fixedNotifiedValueOrRetailPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saleType" TEXT NOT NULL DEFAULT 'Standard',

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_provinces" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_hs_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_hs_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_uom" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "hsCode" TEXT,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_uom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_document_types" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_scenarios" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "businessType" TEXT,
    "sector" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_payment_modes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_payment_modes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_sale_types" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "hsCode" TEXT,
    "scenarioId" TEXT,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_sale_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_tax_rates" (
    "id" TEXT NOT NULL,
    "hsCode" TEXT NOT NULL,
    "saleType" TEXT NOT NULL,
    "sellerProvince" TEXT NOT NULL,
    "buyerProvince" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_tax_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_sro_schedules" (
    "id" TEXT NOT NULL,
    "scheduleNo" TEXT NOT NULL,
    "scenarioId" TEXT,
    "hsCode" TEXT,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_sro_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_sro_items" (
    "id" TEXT NOT NULL,
    "itemSerialNo" TEXT NOT NULL,
    "sroScheduleNo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_sro_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fbr_cache_metadata" (
    "id" TEXT NOT NULL,
    "lookupType" TEXT NOT NULL,
    "lastSyncAt" TIMESTAMP(3) NOT NULL,
    "recordCount" INTEGER NOT NULL DEFAULT 0,
    "syncStatus" TEXT NOT NULL DEFAULT 'pending',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_cache_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_ntnNumber_key" ON "businesses"("ntnNumber");

-- CreateIndex
CREATE INDEX "invoices_businessId_status_idx" ON "invoices"("businessId", "status");

-- CreateIndex
CREATE INDEX "invoices_fbrInvoiceNumber_idx" ON "invoices"("fbrInvoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoice_items_invoiceId_idx" ON "invoice_items"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_provinces_code_key" ON "fbr_provinces"("code");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_hs_codes_code_key" ON "fbr_hs_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_uom_code_hsCode_key" ON "fbr_uom"("code", "hsCode");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_document_types_code_key" ON "fbr_document_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_scenarios_code_key" ON "fbr_scenarios"("code");

-- CreateIndex
CREATE INDEX "fbr_scenarios_businessType_sector_idx" ON "fbr_scenarios"("businessType", "sector");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_payment_modes_code_key" ON "fbr_payment_modes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_sale_types_code_hsCode_scenarioId_key" ON "fbr_sale_types"("code", "hsCode", "scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_tax_rates_hsCode_saleType_sellerProvince_buyerProvince__key" ON "fbr_tax_rates"("hsCode", "saleType", "sellerProvince", "buyerProvince", "scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_sro_schedules_scheduleNo_scenarioId_hsCode_key" ON "fbr_sro_schedules"("scheduleNo", "scenarioId", "hsCode");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_sro_items_itemSerialNo_sroScheduleNo_key" ON "fbr_sro_items"("itemSerialNo", "sroScheduleNo");

-- CreateIndex
CREATE UNIQUE INDEX "fbr_cache_metadata_lookupType_key" ON "fbr_cache_metadata"("lookupType");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
