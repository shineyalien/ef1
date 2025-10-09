-- Drop and recreate FBR Scenarios table with all columns
DROP TABLE IF EXISTS "fbr_scenarios";
CREATE TABLE "fbr_scenarios" (
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "businessType" TEXT,
    "sector" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "registrationType" TEXT,
    "transactionType" TEXT,
    "taxRateApplicable" DOUBLE PRECISION,
    "specialConditions" TEXT[],
    "provinceRestrictions" TEXT[],
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "priority" INTEGER,
    "saleType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_scenarios_pkey" PRIMARY KEY ("code")
);

-- Drop and recreate FBR Business Scenario Mappings table
DROP TABLE IF EXISTS "fbr_business_scenario_mappings";
CREATE TABLE "fbr_business_scenario_mappings" (
    "id" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "industrySector" TEXT NOT NULL,
    "scenarioIds" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fbr_business_scenario_mappings_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "fbr_scenarios_code_key" ON "fbr_scenarios"("code");
CREATE UNIQUE INDEX "fbr_business_scenario_mappings_businessType_industrySector_key" ON "fbr_business_scenario_mappings"("businessType", "industrySector");