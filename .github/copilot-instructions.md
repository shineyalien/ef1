# Easy Filer - AI Coding Instructions

## Project Overview
Easy Filer is an invoicing software designed for Pakistani businesses with integrated FBR (Federal Board of Revenue) compliance. The software connects to Pakistan's tax system through PRAL APIs and provides seamless tax filing and invoice management.

## CTO TECHNICAL BRIEF - SRO 69(I)/2025 Compliance

### Executive Summary
Based on analysis of SRO 69(I)/2025 and competitor landscape (Splendid Accounts, DigitalManager), Easy Filer will be a modern, cloud-native invoicing solution with mandatory FBR digital invoicing compliance, positioning us as the next-generation alternative to legacy systems.

### Regulatory Compliance Requirements (SRO 69(I)/2025)

#### Mandatory Digital Invoice Components
- **Unique FBR Invoice Number**: Format XXXXXX-XXXXXXXX
- **QR Code**: 7x7MM dimensions, unique and verifiable
- **Electronic Software Registration Number**: Must be registered with FBR
- **FBR Digital Invoicing Logo**: Official logo display required
- **Real-time Transmission**: All invoices must transmit to FBR system in real-time
- **Offline Mode Support**: 24-hour upload window during internet/power failures

#### Integration Requirements
- **PRAL API Integration**: Direct integration with FBR's computerized system
- **Auto-fill Returns**: Annexure-I of sales tax returns auto-populated from digital invoices
- **Audit Trail**: 6-year electronic storage requirement
- **CCTV Integration**: Optional requirement for integrated persons
- **POS Integration**: Support for point-of-sale hardware integration

#### Technical Specifications
- **Invoice Format**: Must include 26 mandatory fields (NTN, STRN, tax rates, etc.)
- **Encryption**: Secure data transmission and storage
- **Error Handling**: Alert system for malpractice or system errors
- **Verification Portal**: Customer invoice verification through FBR website

## Architecture & Technology Stack

### Cloud-Native Architecture
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Fastify framework for high performance
- **Database**: PostgreSQL with Prisma ORM for robust data management
- **Cache**: Redis for session management and API caching
- **Queue**: Bull/BullMQ for background job processing (FBR submissions)
- **File Storage**: AWS S3 compatible storage for invoice PDFs and documents

### Offline-First Design
- **PWA Implementation**: Service workers for offline functionality
- **Local Storage**: IndexedDB for offline invoice creation
- **Sync Engine**: Automatic synchronization when connection restored
- **Conflict Resolution**: Merge strategies for offline conflicts

### FBR Integration Layer
```typescript
// Core FBR service structure
interface FBRInvoiceService {
  validateInvoice(invoice: Invoice): Promise<ValidationResult>
  submitInvoice(invoice: Invoice): Promise<FBRResponse>
  generateQRCode(invoiceData: InvoiceData): string
  getHSCodes(): Promise<HSCode[]>
  getTaxRates(province: Province, category: string): Promise<TaxRate[]>
  verifyNTN(ntn: string): Promise<BusinessInfo>
}
```

### Data Flow Dependencies (Chained API Calls)
1. **Business Registration** → NTN Validation → Business Type
2. **Product Selection** → HS Code → Tax Category → Tax Rate
3. **Location** → Province → Local Tax Rules → Tax Rate Calculation
4. **Invoice Creation** → Tax Calculation → QR Generation → FBR Submission

### QR Code & Invoice ID Workflow
```typescript
interface InvoiceSubmissionWorkflow {
  // Step 1: Local Invoice Creation
  localCreation: {
    generateLocalInvoiceNumber: string // Our internal tracking number
    calculateTaxes: boolean
    validateRequiredFields: boolean
    status: 'draft' | 'ready_for_submission'
  }
  
  // Step 2: FBR Submission (Sandbox/Production)
  fbrSubmission: {
    endpoint: '/postinvoicedata' | '/postinvoicedata_sb'
    submissionTimestamp: Date
    localInvoiceRef: string
  }
  
  // Step 3: FBR Response Processing
  fbrResponse: {
    fbrInvoiceNumber: string // Format: 7000007DI1747119701593 (IRN from FBR)
    fbrTimestamp: string // Official processing time
    validationStatus: 'success' | 'failed'
    
    // Update local invoice record with IRN
    updateLocalRecord: {
      fbrInvoiceNumber: string // Store the IRN received from FBR
      fbrSubmitted: true
      fbrValidated: boolean
      submissionConfirmed: true
    }
  }
  
  // Step 4: QR Code Generation (Using FBR IRN)
  qrCodeGeneration: {
    trigger: 'After successful FBR response with IRN'
    inputData: 'FBR Invoice Reference Number (IRN)'
    process: 'Generate QR code locally using IRN as core data'
    qrCodeContent: string // Generated QR code containing IRN
    timing: 'Immediately after receiving FBR IRN'
  }
  
  // Step 5: PDF Generation (Post-QR Generation)
  pdfGeneration: {
    includeElements: [
      'FBR Invoice Number (IRN)', // From FBR response
      'Locally-generated QR Code', // Generated using FBR IRN
      'FBR Digital Invoicing Logo',
      'All 26 mandatory fields',
      'Tax breakdown details'
    ]
    timing: 'After QR code generation using FBR IRN'
    watermark: 'FBR VALIDATED' // For confirmed submissions
  }
}
```

### Critical: QR Code Generation Workflow
**Important**: QR codes are generated by our software using the FBR-provided IRN. The workflow is:
- ✅ **Submit invoice to FBR** and wait for successful response
- ✅ **Receive IRN (Invoice Reference Number)** from FBR response
- ✅ **Generate QR code locally** using the FBR-provided IRN as core data
- ✅ **Associate QR code with invoice** permanently in our records
- ✅ **Include QR code in final PDF** with FBR IRN embedded
- ❌ **Never generate QR codes** before receiving FBR IRN
- ⚠️ **Sandbox mode**: Generate QR codes using sandbox IRNs for testing

### Key Components
- **Invoice Management**: Real-time FBR-compliant invoice generation with bulk operations
- **Bulk Processing**: CSV/XLSX import with batch validation and submission
- **Tax Calculator**: Dynamic tax calculation based on product/location
- **FBR Connector**: PRAL API integration with retry mechanisms and batch processing
- **Document Generator**: PDF generation with QR codes and FBR logos
- **Audit System**: Complete transaction logging for compliance with bulk operation tracking
- **User Management**: Multi-tenant architecture for business accounts
- **Error Management**: Comprehensive error handling with bulk operation status tracking

## Development Workflow

### Project Setup
```bash
# Frontend (Next.js)
npx create-next-app@latest easy-filer --typescript --tailwind --app
cd easy-filer && npm install

# Backend (Node.js + Fastify)
mkdir backend && cd backend
npm init -y && npm install fastify @fastify/cors prisma redis bull

# Database setup
npx prisma init
npx prisma migrate dev --name init
```

### Environment Configuration
```bash
# Development environment
cp .env.example .env.local
# Configure: DATABASE_URL, REDIS_URL, FBR_API_BASE, AWS_S3_BUCKET
```

### FBR Testing & Integration
```bash
# Use FBR test environment credentials
# Test PRAL API integration with sandbox
# Validate invoice formats using FBR test data
npm run test:fbr-integration
```

### Build & Deployment
```bash
# Development with hot reload
npm run dev

# Production build
npm run build
npm run start

# Docker deployment
docker-compose up -d
```

### Testing Strategy
```bash
# Unit tests for tax calculations
npm run test:unit

# Integration tests with mock FBR API
npm run test:integration

# E2E tests for invoice workflow
npm run test:e2e
```

## Coding Conventions

### Invoice Structure (SRO 69(I)/2025 Compliance)
- **26 Mandatory Fields**: NTN, STRN, invoice date, tax breakdown, HS codes, etc.
- **QR Code Generation**: 7x7MM standard with unique verification
- **FBR Logo Integration**: Official digital invoicing logo placement
- **Real-time Validation**: Validate all fields before FBR submission
- **Offline Mode Handling**: Queue invoices for 24-hour upload window

### API Integration Patterns
- **Async/Await**: All PRAL API calls with proper error handling
- **Retry Logic**: Exponential backoff for failed FBR submissions
- **Rate Limiting**: Respect FBR API limits with queue management
- **Circuit Breaker**: Prevent cascade failures during FBR downtime
- **Data Validation**: Strict validation before FBR transmission

### Security & Compliance
- **PRAL Credential Management**: Secure storage with encryption at rest
- **Audit Trail**: Complete logging of all FBR interactions
- **Data Retention**: 6-year electronic storage as per SRO requirements
- **Input Sanitization**: Prevent injection attacks on tax data
- **Session Management**: Secure user authentication with JWT

### Tax Calculation Engine
- **Province-based Rules**: Dynamic tax rates based on location
- **Product Category Mapping**: HS code to tax category resolution
- **Multi-rate Support**: Standard 17%, reduced rates, exempt items
- **Withholding Tax**: Source deduction calculations
- **Federal Excise Duty**: Additional tax calculations when applicable

## Key Dependencies & Technology Stack

### Core Framework
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript 5.0+
- **Backend**: Node.js 20+ with Fastify 4.x for high-performance APIs
- **Database**: PostgreSQL 15+ with Prisma ORM 5.0+
- **Cache/Queue**: Redis 7+ with Bull/BullMQ for job processing
- **File Storage**: AWS S3 compatible (MinIO for development)

### FBR Integration & Compliance
- **HTTP Client**: Axios with retry interceptors for PRAL API calls
- **PDF Generation**: Puppeteer + React-PDF for invoice documents
- **QR Code**: qrcode.js for FBR-compliant QR generation
- **Encryption**: Node.js crypto for sensitive data encryption
- **Validation**: Joi/Zod for strict data validation

### Frontend Technologies
- **UI Framework**: Tailwind CSS 3.4+ with Headless UI components
- **State Management**: Zustand for client state, React Query for server state
- **PWA**: Workbox for offline functionality and service workers
- **Forms**: React Hook Form with Zod validation
- **Charts**: Chart.js or Recharts for business analytics

### Backend Services
- **Authentication**: NextAuth.js with JWT and session management
- **File Upload**: Multer with S3 integration for document storage
- **Background Jobs**: Bull/BullMQ for FBR submission queue
- **API Documentation**: Swagger/OpenAPI 3.0 auto-generation
- **Monitoring**: Winston logging with structured JSON output

## Important Files & Directories
```
easy-filer/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── app/            # App router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/           # Client-side utilities
│   │   └── hooks/         # Custom React hooks
│   └── api/               # Fastify backend API
│       ├── routes/        # API route handlers
│       ├── services/      # Business logic services
│       ├── middleware/    # Authentication & validation
│       └── jobs/          # Background job processors
├── packages/
│   ├── database/          # Prisma schema and migrations
│   ├── ui/               # Shared UI component library
│   ├── config/           # Shared configuration
│   └── types/            # TypeScript type definitions
├── libs/
│   ├── fbr-integration/   # FBR/PRAL API client
│   │   ├── client.ts     # Main API client
│   │   ├── types.ts      # FBR data types
│   │   ├── validators.ts # NTN/STRN validation
│   │   └── qr-generator.ts # QR code generation
│   ├── tax-calculator/    # Pakistani tax computation
│   │   ├── rates.ts      # Tax rate configurations
│   │   ├── calculator.ts # Core calculation logic
│   │   └── provincial.ts # Province-specific rules
│   └── invoice-engine/    # Invoice generation & formatting
│       ├── templates/    # PDF invoice templates
│       ├── generator.ts  # Invoice creation logic
│       └── compliance.ts # FBR compliance validation
├── tools/
│   ├── docker/           # Docker configurations
│   ├── scripts/          # Development scripts
│   └── deployment/       # CI/CD configurations
└── docs/
    ├── api/              # API documentation
    ├── fbr-compliance/   # FBR regulation guides
    └── development/      # Development setup guides
```

## FBR Compliance & Integration Notes

### Third-party Software Model (User Manual Insights)
- **User-Provided Credentials**: Users input their own PRAL API credentials (Bearer tokens)
- **No Direct FBR Licensing**: Software acts as interface to user's FBR account
- **Compliance Responsibility**: Users responsible for their own FBR compliance
- **Integration Support**: Software provides tools and validation for compliance
- **PRAL vs Other LI**: Users can choose PRAL (free) or other Licensed Integrators (paid)

### Digital Invoice Business Process Flow (Based on User Manual v1.5)

### Easy Filer User Registration & Authentication

#### **User Registration System (Updated with Skip Option)**
```typescript
interface EasyFilerRegistration {
  // Step 1: Account Creation
  userAccount: {
    email: string // Primary login identifier
    password: string // Secure password with validation
    firstName: string
    lastName: string
    phoneNumber: string
    country: 'Pakistan' // Default for FBR compliance
  }
  
  // Step 2: Business Setup
  businessProfile: {
    companyName: string
    ntnNumber: string
    address: string
    province: string
    businessType: string
    sector: string
  }
  
  // Step 3: FBR Integration (Optional - Can Skip)
  fbrIntegration: {
    setupNow: boolean // User choice: setup now or skip
    
    // If setupNow = true
    sandboxToken?: string // User provides PRAL sandbox token
    environment: 'sandbox' | 'local' // Default to local if skipped
    testConnection?: boolean
    
    // If setupNow = false
    skipReason: 'Will setup later' | 'Testing software first' | 'No FBR account yet'
    reminderSet: boolean // Remind user to complete FBR setup
  }
  
  // Step 4: Software Preferences
  preferences: {
    defaultTaxRate: number // 18% default
    autoSave: boolean
    offlineMode: boolean
    reportingCurrency: 'PKR'
  }
}
```

#### **Multi-Tenant Data Architecture (Updated)**
```typescript
interface UserDataModel {
  // User account (shared across tenants)
  user: {
    id: string
    email: string
    passwordHash: string
    createdAt: Date
    lastLoginAt: Date
    isActive: boolean
    subscriptionPlan: 'free' | 'professional' | 'enterprise'
  }
  
  // Business profile (tenant-specific)
  business: {
    id: string
    userId: string // Foreign key
    companyName: string
    ntnNumber: string
    
    // FBR Integration Status
    fbrSetupComplete: boolean // Whether user completed FBR setup
    fbrSetupSkipped: boolean // Whether user chose to skip during onboarding
    
    // Token Management (Optional)
    sandboxToken?: string // Encrypted - Only if user provided
    productionToken?: string // Encrypted - Only after sandbox validation
    
    // Integration Status
    integrationMode: 'local' | 'sandbox' | 'production'
    sandboxValidated: boolean
    productionTokenAvailable: boolean
    
    settings: BusinessSettings
    createdAt: Date
  }
  
  // Invoice data (mode-aware)
  invoices: {
    id: string
    businessId: string // Tenant isolation
    mode: 'local' | 'sandbox' | 'production' // Track submission mode
    
    // Submission Status
    fbrSubmitted: boolean // Whether submitted to FBR
    fbrValidated: boolean // Whether FBR validated successfully
    submissionTimestamp?: Date // When submitted to FBR
    
    // Invoice Data
    customerData: CustomerInfo
    items: InvoiceItem[]
    taxCalculation: TaxBreakdown
    localInvoiceNumber: string // Our internal invoice number
    
    // FBR Response Data (populated after successful submission)
    fbrInvoiceNumber?: string // FBR-issued IRN (e.g., 7000007DI1747119701593)
    locallyGeneratedQRCode?: string // QR code generated using FBR IRN
    fbrTimestamp?: string // Official FBR processing timestamp
    fbrTransmissionId?: string // FBR internal transmission reference
    fbrAcknowledgmentNumber?: string // FBR acknowledgment reference
    
    // Complete FBR Response (for audit trail)
    fbrResponse?: PRALInvoiceResponse // Full FBR response object
    
    // Compliance & Audit
    encryptedData: string // 6-year retention requirement
    pdfGenerated: boolean // Whether final PDF with FBR data is generated
    pdfStoragePath?: string // S3 path to final PDF invoice
    createdAt: Date
    updatedAt: Date
  }
}
```

**Note**: Users can start using Easy Filer immediately for local invoicing, then add FBR integration when ready.

## Bulk Operations & Error Handling

### **Bulk Invoice Processing System**
```typescript
interface BulkOperations {
  // File Upload Support
  fileImport: {
    supportedFormats: ['CSV', 'XLSX', 'XLS']
    maxFileSize: '10MB'
    maxRecords: 1000 // Per batch
    templateDownload: boolean
    dataValidation: 'Real-time column mapping and validation'
  }
  
  // Bulk Validation Workflow
  bulkValidation: {
    step1: 'Upload and parse file'
    step2: 'Validate data format and required fields'
    step3: 'Submit batch to postinvoicedata_sb'
    step4: 'FBR validates submissions automatically'
    step5: 'Track validation responses from FBR'
  }
  
  // Bulk Sandbox Submission (This IS Validation)
  bulkSandboxSubmission: {
    purpose: 'Submitting to sandbox IS the validation process'
    step1: 'Submit invoices to postinvoicedata_sb'
    step2: 'FBR processes and validates each submission'
    step3: 'Track FBR validation responses'
    step4: 'Validation complete when FBR accepts submission'
  }
  
  // Bulk Production Submission
  bulkProductionSubmission: {
    prerequisite: 'Must complete sandbox validation'
    step1: 'Verify all invoices are sandbox-validated'
    step2: 'Submit batch to postinvoicedata (production)'
    step3: 'Track FBR responses and invoice numbers'
    step4: 'Generate final submission report'
  }
}
```

### **Error Handling Framework**
```typescript
interface ErrorHandlingSystem {
  // File Upload Errors
  fileUploadErrors: {
    invalidFormat: 'Unsupported file format. Please use CSV or XLSX.'
    fileTooLarge: 'File exceeds 10MB limit. Please split into smaller files.'
    emptyFile: 'File is empty. Please provide valid invoice data.'
    corruptedFile: 'File is corrupted or unreadable. Please re-export and try again.'
  }
  
  // Data Validation Errors
  dataValidationErrors: {
    missingRequiredFields: 'Required fields missing: [field names]'
    invalidNTN: 'Invalid NTN format in row [row number]'
    invalidHSCode: 'Invalid HS Code in row [row number]: [code]'
    invalidAmount: 'Invalid amount format in row [row number]'
    invalidDate: 'Invalid date format in row [row number]. Use YYYY-MM-DD.'
  }
  
  // Bulk Operation Errors
  bulkOperationErrors: {
    sandboxRequired: 'Cannot submit to production. Complete sandbox submission first.'
    sandboxNotValidated: 'Sandbox submissions not validated by FBR yet.'
    partialFailure: 'Some invoices failed. Check error report for details.'
    batchTooLarge: 'Batch size exceeds limit. Please split into smaller batches.'
    apiTimeout: 'FBR API timeout. Some invoices may need retry.'
  }
  
  // FBR Integration Errors
  fbrIntegrationErrors: {
    tokenExpired: 'PRAL token expired. Please update in settings.'
    connectionFailed: 'Cannot connect to FBR servers. Check internet connection.'
    sandboxNotComplete: 'Sandbox validation incomplete. Cannot access production.'
    rateLimit: 'API rate limit exceeded. Please wait before retrying.'
  }
}
```

### **Bulk Processing Data Models**
```typescript
interface BulkInvoiceBatch {
  batchId: string
  userId: string
  businessId: string
  fileName: string
  uploadedAt: Date
  
  // File Processing
  totalRecords: number
  validRecords: number
  invalidRecords: number
  processingStatus: 'uploading' | 'parsing' | 'validating' | 'complete' | 'failed'
  
  // Validation Status
  validationStatus: {
    pending: number
    validated: number
    failed: number
    validationErrors: ValidationError[]
  }
  
  // Submission Status
  submissionStatus: {
    sandbox: {
      pending: number
      submitted: number
      failed: number
    }
    production: {
      pending: number
      submitted: number
      failed: number
    }
  }
  
  // Individual Invoice Tracking
  invoices: BulkInvoiceItem[]
}

interface BulkInvoiceItem {
  rowNumber: number
  localId: string
  
  // Data Status
  dataValid: boolean
  validationErrors: string[]
  
  // Processing Status
  sandboxValidated: boolean
  sandboxSubmitted: boolean
  productionSubmitted: boolean
  
  // FBR Responses
  sandboxResponse?: PRALInvoiceResponse
  productionResponse?: PRALInvoiceResponse
  fbrInvoiceNumber?: string
  
  // Invoice Data
  invoiceData: PRALInvoiceRequest
  processedAt?: Date
}
```
```

#### Invoice Dashboard Features (User Experience)
```typescript
interface InvoiceDashboard {
  // Real-time Analytics
  analytics: {
    timeFormats: ['Daily', 'Monthly', 'Quarterly', 'Yearly']
    invoiceTypes: ['Sale Invoice', 'Debit Note']
    exportFormats: ['PDF']
  }
  
  // Search & Filter
  search: {
    timePeriod: DateRange
    invoiceType: InvoiceType
    exportToPDF: boolean
  }
  
  // Critical: Connection Loss Handling
  failureRecovery: {
    automaticRetry: false // Manual resubmission required
    reconciliation: 'Invoice Dashboard'
    resubmissionRequired: true
  }
}
```

#### Support System Integration (CRM)
```typescript
interface CRMSupport {
  portal: 'https://dicrm.pral.com.pk'
  loginOptions: {
    iris: 'IRIS Login' // For taxpayers using their own account
    diSupport: 'DI-Support' // For authorized technical persons
  }
  
  caseManagement: {
    priorityLevels: ['High', 'Normal', 'Low']
    queryTypes: ['Integration', 'Post Integration']
    attachmentLimit: '5MB PDF'
    accountLockout: '5 failed attempts'
  }
}
```

### Digital Invoice Standards (26 Mandatory Fields)
1. **Unique FBR Invoice Number** (XXXXXX-XXXXXXXX format)
2. **QR Code** (7x7MM, unique and verifiable)
3. **Electronic Software Registration Number**
4. **FBR Digital Invoicing Logo**
5. **Seller Registration Number (NTN/STRN)**
6. **Recipient Information** (Name, Address, Registration)
7. **Invoice Details** (Date, Tax Period, Description)
8. **Product Information** (Quantity, HS Code, Unit of Measurement)
9. **Tax Calculations** (Exclusive value, tax rate, tax amount)
10. **Special Taxes** (Withholding, Extra Tax, Federal Excise Duty)
11. **SRO References** (Applicable exemptions/reductions)

### Data Dependencies & API Chaining
```typescript
// Example of chained API calls for invoice creation
async function createCompliantInvoice(invoiceData: InvoiceInput) {
  // 1. Validate business registration
  const businessInfo = await fbrApi.verifyNTN(invoiceData.sellerNTN)
  
  // 2. Get product classification
  const hsCode = await fbrApi.getHSCode(invoiceData.productCategory)
  
  // 3. Determine tax rates based on location and product
  const taxRates = await fbrApi.getTaxRates(businessInfo.province, hsCode)
  
  // 4. Calculate taxes
  const taxCalculation = calculateTax(invoiceData, taxRates)
  
  // 5. Generate QR code
  const qrCode = generateFBRQRCode(invoiceData, taxCalculation)
  
  // 6. Submit to FBR system
  const fbrResponse = await fbrApi.submitInvoice({
    ...invoiceData,
    ...taxCalculation,
    qrCode
  })
  
  return fbrResponse
}
```

### PRAL API Integration Requirements (Based on Official Technical Documentation v1.12)

#### Authentication & Authorization
```typescript
interface PRALCredentials {
  bearerToken: string // 5-year validity token issued by PRAL
  environment: 'sandbox' | 'production'
}

// Authentication using Bearer token in Authorization header
const fbrClient = new FBRAPIClient({
  baseURL: 'https://gw.fbr.gov.pk',
  timeout: 30000,
  retries: 3,
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
})
```

#### Complete PRAL API Endpoint Reference
```typescript
// Base URL for all PRAL APIs
const PRAL_BASE_URL = 'https://gw.fbr.gov.pk'

// Main Digital Invoicing APIs (require Bearer token authentication)
const INVOICE_ENDPOINTS = {
  // Sandbox endpoints (for testing)
  postInvoiceSandbox: `${PRAL_BASE_URL}/di_data/v1/di/postinvoicedata_sb`,
  validateInvoiceSandbox: `${PRAL_BASE_URL}/di_data/v1/di/validateinvoicedata_sb`,
  
  // Production endpoints
  postInvoiceProduction: `${PRAL_BASE_URL}/di_data/v1/di/postinvoicedata`,
  validateInvoiceProduction: `${PRAL_BASE_URL}/di_data/v1/di/validateinvoicedata`
}

// Reference Data APIs (public, no authentication required)
const REFERENCE_ENDPOINTS = {
  provinces: `${PRAL_BASE_URL}/pdi/v1/provinces`,
  documentTypes: `${PRAL_BASE_URL}/pdi/v1/doctypecode`,
  hsCodes: `${PRAL_BASE_URL}/pdi/v1/itemdesccode`,
  sroItems: `${PRAL_BASE_URL}/pdi/v1/sroitemcode`,
  transactionTypes: `${PRAL_BASE_URL}/pdi/v1/transtypecode`,
  unitsOfMeasurement: `${PRAL_BASE_URL}/pdi/v1/uom`,
  sroSchedule: `${PRAL_BASE_URL}/pdi/v1/SroSchedule`, // Requires query params
  taxRates: `${PRAL_BASE_URL}/pdi/v2/SaleTypeToRate` // Requires query params
}

// Query parameter examples for dynamic endpoints
const QUERY_EXAMPLES = {
  sroSchedule: '?rate_id=413&date=04-Feb-2024&origination_supplier_csv=1',
  taxRates: '?date=24-Feb-2024&transTypeId=18&originationSupplier=1'
}
```

#### PRAL API Implementation Patterns
```typescript
class PRALAPIClient {
  private baseURL = 'https://gw.fbr.gov.pk'
  private bearerToken: string
  private environment: 'sandbox' | 'production'
  
  constructor(token: string, env: 'sandbox' | 'production' = 'production') {
    this.bearerToken = token
    this.environment = env
  }
  
  // Step 1: Validate invoice before submission (sandbox only)
  async validateInvoice(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    if (this.environment !== 'sandbox') {
      throw new Error('Validation only available in sandbox environment')
    }
    const endpoint = '/di_data/v1/di/validateinvoicedata_sb'
    return this.makeAuthenticatedRequest('POST', endpoint, invoice)
  }
  
  // Step 2: Submit invoice to sandbox for testing
  async postInvoiceSandbox(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    const endpoint = '/di_data/v1/di/postinvoicedata_sb'
    return this.makeAuthenticatedRequest('POST', endpoint, invoice)
  }
  
  // Step 3: Submit invoice to production (after sandbox success)
  async postInvoiceProduction(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    const endpoint = '/di_data/v1/di/postinvoicedata'
    return this.makeAuthenticatedRequest('POST', endpoint, invoice)
  }
  
  // Unified invoice submission with correct workflow
  async submitInvoice(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse> {
    if (this.environment === 'sandbox') {
      // Sandbox workflow: validation happens through actual posting
      // Optional: pre-validate for early error detection
      try {
        const validation = await this.validateInvoice(invoice)
        if (validation.validationResponse.statusCode !== "00") {
          throw new Error(`Pre-validation failed: ${validation.validationResponse.error}`)
        }
      } catch (error) {
        console.warn('Pre-validation failed, proceeding with direct submission:', error)
      }
      
      // The actual validation happens when posting to sandbox
      return this.postInvoiceSandbox(invoice)
    } else {
      // Production workflow: direct submission to live system
      return this.postInvoiceProduction(invoice)
    }
  }
  
  // Reference data (cached)
  async getProvinces(): Promise<ProvinceData[]> {
    return this.makePublicRequest('GET', '/pdi/v1/provinces')
  }
  
  async getHSCodes(): Promise<HSCodeData[]> {
    return this.makePublicRequest('GET', '/pdi/v1/itemdesccode')
  }
  
  async getTaxRates(date: string, transTypeId: number, provinceId: number): Promise<TaxRateData[]> {
    const query = `?date=${date}&transTypeId=${transTypeId}&originationSupplier=${provinceId}`
    return this.makePublicRequest('GET', `/pdi/v2/SaleTypeToRate${query}`)
  }
  
  private async makeAuthenticatedRequest(method: string, endpoint: string, data?: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    })
    
    if (!response.ok) {
      throw new Error(`PRAL API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }
  
  private async makePublicRequest(method: string, endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`, { method })
    
    if (!response.ok) {
      throw new Error(`PRAL API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }
}
```

#### Three-Endpoint Workflow Summary
```typescript
interface PRALWorkflow {
  // Development Phase
  development: {
    step1: 'Build FBR integration module'
    step2: 'Format data into JSON structure'
    step3: 'Handle API calls and responses'
    step4: 'Configure for sandbox environment'
  }
  
  // Sandbox Phase (Validation through Testing)
  sandbox: {
    purpose: 'Validation is achieved by posting test data'
    step1: 'validateinvoicedata_sb - Optional pre-validation check'
    step2: 'postinvoicedata_sb - Required scenario-based testing'
    mechanism: 'Posting in sandbox IS the validation process'
    requirement: 'Submit all required business scenarios successfully'
    completion: 'FBR system validates and marks as "validated"'
  }
  
  // Manual Production Token Generation
  productionTokenGeneration: {
    trigger: 'Sandbox validation complete'
    process: 'User must manually log into IRIS portal'
    action: 'Generate Production Token from IRIS interface'
    userResponsibility: 'Copy token and paste into Easy Filer'
  }
  
  // Production Phase (Live Operations)
  production: {
    step1: 'Configure software for production endpoint'
    step2: 'Update settings with production token'
    step3: 'postinvoicedata - Submit real invoices to live system'
    requirement: 'Must have manually generated Production Token'
  }
  
  // Key Understanding
  validation: {
    method: 'Posting test invoices to sandbox'
    notSeparateProcess: 'Cannot validate without sending test data'
    scenarioBased: 'Specific business scenarios must pass'
    realData: 'Actual JSON submissions to FBR test servers'
  }
}
```

#### Actual PRAL Invoice Data Structure
```typescript
interface PRALInvoiceRequest {
  // Required fields for all invoices
  invoiceType: 'Sale Invoice' | 'Debit Note'
  invoiceDate: string // Format: "YYYY-MM-DD"
  
  // Seller information (required)
  sellerNTNCNIC: string // 7 or 13 digit NTN/CNIC
  sellerBusinessName: string
  sellerProvince: string // From provinces API
  sellerAddress: string
  
  // Buyer information 
  buyerNTNCNIC?: string // Optional for unregistered buyers
  buyerBusinessName: string
  buyerProvince: string // From provinces API
  buyerAddress: string
  buyerRegistrationType: 'Registered' | 'Unregistered'
  
  // Reference and scenario
  invoiceRefNo?: string // Required only for debit notes (22/28 digits)
  scenarioId?: string // Required for sandbox only
  
  // Line items
  items: PRALInvoiceItem[]
}

interface PRALInvoiceItem {
  hsCode: string // From itemdesccode API
  productDescription: string
  rate: string // Percentage like "18%"
  uoM: string // From uom API
  quantity: number
  totalValues: number // Total including tax
  valueSalesExcludingST: number // Base amount
  fixedNotifiedValueOrRetailPrice: number
  salesTaxApplicable: number // Sales tax amount
  salesTaxWithheldAtSource: number // Withholding tax
  extraTax?: number // Optional
  furtherTax?: number // Optional
  sroScheduleNo?: string // Optional SRO reference
  fedPayable?: number // Federal excise duty
  discount?: number // Optional discount
  saleType: string // From tax rates API
  sroItemSerialNo?: string // Optional
}

interface PRALInvoiceResponse {
  // Core FBR Response Data
  invoiceNumber?: string // Format: 7000007DI1747119701593 (FBR-generated IRN)
  dated: string // FBR timestamp of processing
  
  // Validation Response Structure
  validationResponse: {
    statusCode: '00' | '01' // 00 = Valid/Success, 01 = Invalid/Failed
    status: 'Valid' | 'Invalid' | 'Success' | 'Failed'
    error?: string
    errorCode?: string
    
    // Item-level responses for multi-item invoices
    invoiceStatuses?: Array<{
      itemSNo: string
      statusCode: '00' | '01'
      status: 'Valid' | 'Invalid'
      invoiceNo?: string // Individual item invoice number from FBR
      errorCode?: string
      error?: string
    }>
  }
  
  // Additional FBR Metadata (if provided)
  transmissionId?: string // FBR internal transmission reference
  acknowledgmentNumber?: string // FBR acknowledgment reference
  fbrTimestamp?: string // Official FBR processing timestamp
  
  // HTTP Response Metadata
  httpStatusCode?: number // 200, 401, 500, etc.
  responseHeaders?: Record<string, string> // Any additional headers from FBR
}
```

#### Reference Data Structures
```typescript
interface ProvinceData {
  stateProvinceCode: number
  stateProvinceDesc: string // "PUNJAB", "SINDH", etc.
}

interface HSCodeData {
  hS_CODE: string // "8432.1010"
  description: string // Full HS code description
}

interface UOMData {
  uoM_ID: number
  description: string // "Square Metre", "KG", etc.
}

interface TaxRateData {
  ratE_ID: number
  ratE_DESC: string // "18% along with rupees 60 per kilogram"
  ratE_VALUE: number // 18
}
```

#### Invoice Data Structure (26 Mandatory Fields from SRO 69(I)/2025)
```typescript
interface FBRCompliantInvoice {
  // Basic invoice info (a-d from SRO)
  invoiceNumber: string           // Format: XXXXXX-DDMMYYHHMMSS-0001
  qrCode: string                 // 7x7MM QR code
  softwareRegistrationNumber: string // Electronic invoicing software reg no
  fbrDigitalInvoicingLogo: string    // Official FBR logo
  
  // Business entities (e-j from SRO)
  sellerName: string
  sellerAddress: string
  sellerRegistrationNumber: string   // NTN/STRN
  recipientName: string
  recipientAddress: string
  recipientRegistrationNumber?: string // Optional for general public
  
  // Invoice details (k-z from SRO)
  invoiceDate: string            // ISO date format
  taxPeriod: string              // Tax period identifier
  description: string
  quantity: number
  valueExclusiveOfTax: number
  salesTaxRate: number
  salesTaxAmount: number
  salesTaxWithheld?: number      // Withholding tax at source
  extraTax?: number              // Additional tax
  furtherTax?: number            // Further tax
  federalExciseDuty?: number     // FED in sales tax mode
  totalDiscount?: number
  invoiceReferenceNo?: string
  hsCode: string                 // Harmonized System code
  unitOfMeasurement: string      // Based on HS code
  sroSerialNumber?: string       // Applicable SRO references
}

#### QR Code Generation Service
```typescript
interface QRCodeGenerator {
  // Generate QR code using FBR-provided IRN
  generateQRCodeFromIRN(irn: string, invoiceData: {
    sellerNTN: string
    invoiceDate: string
    totalAmount: number
    buyerNTN?: string
  }): string
  
  // QR code content structure (based on FBR requirements)
  buildQRContent(irn: string, metadata: InvoiceMetadata): string
  
  // Validate QR code format
  validateQRCode(qrContent: string): boolean
}

// QR Code implementation example
function generateQRCodeFromIRN(irn: string, invoiceData: InvoiceMetadata): string {
  // Build QR content with FBR IRN as core data
  const qrContent = {
    invoiceNumber: irn, // FBR-provided Invoice Reference Number
    sellerNTN: invoiceData.sellerNTN,
    invoiceDate: invoiceData.invoiceDate,
    totalAmount: invoiceData.totalAmount,
    buyerNTN: invoiceData.buyerNTN || null,
    timestamp: new Date().toISOString()
  }
  
  // Generate actual QR code (7x7MM as per SRO requirements)
  return QRCode.toString(JSON.stringify(qrContent), {
    type: 'svg',
    width: 200, // Adjust for 7x7MM print size
    margin: 1
  })
}
```

interface InvoiceItem {
  description: string
  quantity: number
  hsCode: string                 // Harmonized System code
  unitOfMeasurement: string      // Based on HS code
  unitPrice: number
  totalValue: number
  applicableTaxRate: number
}
```

#### PRAL Integration Service (Based on Actual API v1.12)
```typescript
interface PRALIntegrationService {
  // Core invoice operations
  postInvoice(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse>
  validateInvoice(invoice: PRALInvoiceRequest): Promise<PRALInvoiceResponse>
  
  // Reference data fetching (cached for performance)
  getProvinces(): Promise<ProvinceData[]>
  getHSCodes(): Promise<HSCodeData[]>
  getUnitOfMeasurements(): Promise<UOMData[]>
  getTaxRates(date: string, transTypeId: number, provinceId: number): Promise<TaxRateData[]>
  getDocumentTypes(): Promise<{ docTypeId: number, docDescription: string }[]>
  getSROItems(): Promise<{ srO_ITEM_ID: number, srO_ITEM_DESC: string }[]>
  
  // Invoice number format handling
  parseInvoiceNumber(fbrInvoiceNumber: string): {
    ntnPart: string // First 7 digits
    timestamp: string // DDMMYYHHMMSS
    sequence: string // Last 4 digits
  }
  
  // Error handling and retry logic
  handleAPIError(error: any): PRALError
  retryWithBackoff<T>(operation: () => Promise<T>, maxRetries: number): Promise<T>
}

interface PRALError {
  statusCode: string // "00", "01", etc.
  errorCode?: string // "0046", "0052", etc.
  message: string
  field?: string // Which field caused the error
  itemIndex?: number // For item-specific errors
}

// HTTP Status Codes from PRAL API
enum PRALHttpStatus {
  OK = 200,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500
}
```

#### Data Flow with Actual PRAL APIs
```typescript
// Example implementation matching actual PRAL API structure
async function createFBRCompliantInvoice(invoiceData: InvoiceInput): Promise<PRALInvoiceResponse> {
  // 1. Get reference data (cache these)
  const provinces = await pralApi.getProvinces()
  const hsCodes = await pralApi.getHSCodes()
  const uoms = await pralApi.getUnitOfMeasurements()
  
  // 2. Build PRAL-compliant request
  const pralRequest: PRALInvoiceRequest = {
    invoiceType: "Sale Invoice",
    invoiceDate: invoiceData.date,
    sellerNTNCNIC: invoiceData.sellerNTN,
    sellerBusinessName: invoiceData.sellerName,
    sellerProvince: mapToProvinceName(invoiceData.sellerProvinceId, provinces),
    sellerAddress: invoiceData.sellerAddress,
    buyerNTNCNIC: invoiceData.buyerNTN || undefined,
    buyerBusinessName: invoiceData.buyerName,
    buyerProvince: mapToProvinceName(invoiceData.buyerProvinceId, provinces),
    buyerAddress: invoiceData.buyerAddress,
    buyerRegistrationType: invoiceData.buyerNTN ? "Registered" : "Unregistered",
    items: invoiceData.items.map(item => ({
      hsCode: item.hsCode,
      productDescription: item.description,
      rate: `${item.taxRate}%`,
      uoM: mapToUOMName(item.uomId, uoms),
      quantity: item.quantity,
      valueSalesExcludingST: item.baseAmount,
      salesTaxApplicable: item.taxAmount,
      totalValues: item.totalAmount,
      // ... other required fields
    }))
  }
  
  // 3. Validate first (optional but recommended)
  const validation = await pralApi.validateInvoice(pralRequest)
  if (validation.validationResponse.statusCode !== "00") {
    throw new Error(`Validation failed: ${validation.validationResponse.error}`)
  }
  
  // 4. Submit invoice
  const response = await pralApi.postInvoice(pralRequest)
  
  // 5. Handle response and update database
  if (response.validationResponse.statusCode === "00") {
    // Success - FBR has provided IRN, now generate QR code locally
    const fbrIRN = response.invoiceNumber // e.g., 7000007DI1747119701593
    
    // Generate QR code using the FBR-provided IRN
    const qrCodeContent = generateQRCodeFromIRN(fbrIRN, {
      sellerNTN: invoiceData.sellerNTN,
      invoiceDate: invoiceData.date,
      totalAmount: invoiceData.totalAmount
    })
    
    const invoiceUpdate = {
      fbrSubmitted: true,
      fbrValidated: true,
      submissionTimestamp: new Date(),
      fbrInvoiceNumber: fbrIRN,
      locallyGeneratedQRCode: qrCodeContent, // QR code generated using IRN
      fbrTimestamp: response.fbrTimestamp || response.dated,
      fbrTransmissionId: response.transmissionId,
      fbrAcknowledgmentNumber: response.acknowledgmentNumber,
      fbrResponse: response // Store complete response for audit
    }
    
    // Update invoice record in database
    await updateInvoiceWithFBRData(invoiceData.localId, invoiceUpdate)
    
    // Generate final PDF with FBR data and locally-generated QR code
    await generateFinalInvoicePDF({
      ...invoiceData,
      fbrInvoiceNumber: fbrIRN,
      qrCodeContent: qrCodeContent, // Use our generated QR code
      validationWatermark: 'FBR VALIDATED'
    })
    
    return response
  } else {
    // Error - handle validation errors
    throw new PRALError({
      statusCode: response.validationResponse.statusCode,
      errorCode: response.validationResponse.errorCode,
      message: response.validationResponse.error || "Unknown error"
    })
  }
}
```

## Business Requirements & User Journey (From User Manual Analysis)

### Critical Business Insights
- **No Automatic Retries**: PRAL system does not support automatic retries for failed uploads
- **Manual Resubmission Required**: Users must manually resubmit failed invoices
- **2-Hour IP Approval**: PRAL approves/rejects IP whitelisting within 2 working hours
- **Scenario-Based Testing**: Minimum 1 successful invoice per scenario required
- **Auto Token Generation**: Production token auto-generated after sandbox completion
- **Real-time Submission**: All production invoices submitted in real-time

### User Experience Requirements
```typescript
interface UserExperienceRequirements {
  // Onboarding Flow
  registration: {
    multiStepProcess: true
    ipWhitelistingMandatory: true
    sandboxTestingRequired: true
    scenarioBasedValidation: true
  }
  
  // Dashboard Features
  dashboard: {
    analyticsViews: ['Daily', 'Monthly', 'Quarterly', 'Yearly']
    invoiceTypes: ['Sale Invoice', 'Debit Note']
    searchAndFilter: true
    pdfExport: true
    realTimeGraphs: true
  }
  
  // Error Handling
  errorRecovery: {
    manualResubmission: true
    dashboardReconciliation: true
    noAutomaticRetry: true
    connectionLossHandling: true
  }
  
  // Support Integration
  support: {
    dedicatedCRM: 'https://dicrm.pral.com.pk'
    ticketSystem: true
    priorityLevels: 3
    attachmentSupport: true
  }
}
```

### Integration Requirements (Based on User Manual)
```typescript
interface IntegrationRequirements {
  // Environment Management
  environments: {
    sandbox: {
      scenarioTesting: true
      businessTypeAlignment: true
      sectorSpecificScenarios: true
      minimumTestsPerScenario: 1
    }
    production: {
      realTimeSubmission: true
      bearerTokenAuth: true
      connectionMonitoring: true
      failureHandling: true
    }
  }
  
  // Business Configuration
  businessSetup: {
    multipleBusinessNatures: true
    singleSectorSelection: true
    ipWhitelistingRequired: true
    technicalContactMandatory: true
  }
  
  // Compliance Features
  compliance: {
    scenarioBasedTesting: true
    sectorSpecificValidation: true
    realTimeTransmission: true
    manualFailureRecovery: true
  }
}
```
- **Competitors**: Tally, Odoo, and local Pakistani ERP solutions
- **Key Differentiator**: Simplified FBR integration without complex ERP overhead
- **Target Market**: Small to medium Pakistani businesses needing FBR compliance
- **Pricing Strategy**: One-time license or affordable monthly subscription

### Competitive Analysis
**Splendid Accounts**: Cloud-based accounting with FBR POS integration, 14-day free trial
- ✅ **Strengths**: Established user base, mobile apps, multi-currency support
- ❌ **Weaknesses**: Complex ERP interface, expensive for small businesses

**DigitalManager**: AI-driven ERP suite with dedicated FBR digital invoicing module
- ✅ **Strengths**: Industry-specific solutions, 20+ years experience, PRAL integration
- ❌ **Weaknesses**: Heavy ERP focus, complex setup, enterprise-oriented pricing

**Easy Filer Opportunity**: Focus solely on invoicing with seamless FBR compliance
- 🎯 **Market Gap**: Simple, affordable invoicing without full ERP complexity
- 🚀 **Differentiator**: Modern tech stack, offline-first design, user-friendly interface

---

*Note: This file will be continuously updated as the codebase evolves. Contributors should update relevant sections when adding new features or changing architecture.*