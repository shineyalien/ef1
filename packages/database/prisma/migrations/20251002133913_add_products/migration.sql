-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "IntegrationMode" AS ENUM ('LOCAL', 'SANDBOX', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "RegistrationType" AS ENUM ('REGISTERED', 'UNREGISTERED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'PENDING', 'SUBMITTED', 'VALIDATED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('UPLOADING', 'PARSING', 'VALIDATING', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('PENDING', 'VALIDATED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "subscriptionEnd" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "ntnNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT,
    "postalCode" TEXT,
    "businessType" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "fbrSetupComplete" BOOLEAN NOT NULL DEFAULT false,
    "fbrSetupSkipped" BOOLEAN NOT NULL DEFAULT false,
    "integrationMode" "IntegrationMode" NOT NULL DEFAULT 'LOCAL',
    "sandboxValidated" BOOLEAN NOT NULL DEFAULT false,
    "productionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "sandboxToken" TEXT,
    "productionToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "city" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "ntnNumber" TEXT,
    "registrationType" "RegistrationType" NOT NULL DEFAULT 'UNREGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerId" TEXT,
    "localInvoiceNumber" TEXT NOT NULL,
    "invoiceSequence" INTEGER NOT NULL,
    "invoiceDate" TEXT NOT NULL,
    "dueDate" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "mode" "IntegrationMode" NOT NULL DEFAULT 'LOCAL',
    "fbrSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "fbrValidated" BOOLEAN NOT NULL DEFAULT false,
    "submissionTimestamp" TIMESTAMP(3),
    "fbrInvoiceNumber" TEXT,
    "locallyGeneratedQRCode" TEXT,
    "fbrTimestamp" TEXT,
    "fbrTransmissionId" TEXT,
    "fbrAcknowledgmentNumber" TEXT,
    "fbrResponse" JSONB,
    "pdfGenerated" BOOLEAN NOT NULL DEFAULT false,
    "pdfStoragePath" TEXT,
    "encryptedData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hsCode" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "exemptionSRO" TEXT,
    "unitOfMeasurement" TEXT NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hsCode" TEXT NOT NULL,
    "unitOfMeasurement" TEXT NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "taxRate" INTEGER NOT NULL DEFAULT 18,
    "category" TEXT,
    "sku" TEXT,
    "stock" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bulk_invoice_batches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "totalRecords" INTEGER NOT NULL,
    "validRecords" INTEGER NOT NULL,
    "invalidRecords" INTEGER NOT NULL,
    "processingStatus" "ProcessingStatus" NOT NULL DEFAULT 'UPLOADING',
    "validationStatus" "ValidationStatus" NOT NULL DEFAULT 'PENDING',
    "validationErrors" JSONB,
    "processingErrors" JSONB,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "bulk_invoice_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bulk_invoice_items" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "localId" TEXT NOT NULL,
    "dataValid" BOOLEAN NOT NULL DEFAULT false,
    "sandboxValidated" BOOLEAN NOT NULL DEFAULT false,
    "sandboxSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "productionSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "validationErrors" JSONB,
    "sandboxResponse" JSONB,
    "productionResponse" JSONB,
    "fbrInvoiceNumber" TEXT,
    "invoiceData" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "bulk_invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "businessId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_ntnNumber_key" ON "businesses"("ntnNumber");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_businessId_invoiceSequence_key" ON "invoices"("businessId", "invoiceSequence");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_invoice_items" ADD CONSTRAINT "bulk_invoice_items_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "bulk_invoice_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
