# Easy Filer - FBR Compliant Invoicing Software

Modern invoicing software for Pakistani businesses with integrated FBR compliance and PRAL API integration.

## 🚀 Features

- **FBR Compliance**: Full compliance with SRO 69(I)/2025 requirements
- **PRAL Integration**: Direct integration with FBR's PRAL API
- **Multi-Tenant SaaS**: Support for multiple businesses under one account
- **Bulk Operations**: Import and process thousands of invoices via CSV/XLSX
- **Offline-First**: PWA design with offline capabilities
- **Real-time Sync**: Automatic synchronization with FBR systems
- **QR Code Generation**: FBR-compliant QR codes using IRN
- **Audit Trail**: Complete 6-year electronic storage compliance

## 🏗️ Architecture

- **Frontend**: Next.js 15 + TypeScript 5.6 + Tailwind CSS 3.4
- **Backend**: Node.js + Fastify + Prisma ORM 5.20
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Queue**: Bull/BullMQ for background jobs
- **Storage**: S3-compatible (MinIO for development)
- **Security**: 0 vulnerabilities (latest secure packages)

## 📦 Project Structure

```
easy-filer/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── api/                 # Fastify backend API
├── packages/
│   ├── database/            # Prisma schema and migrations
│   ├── ui/                  # Shared UI component library
│   ├── config/              # Shared configuration
│   └── types/               # TypeScript type definitions
├── libs/
│   ├── fbr-integration/     # FBR/PRAL API client
│   ├── tax-calculator/      # Pakistani tax computation
│   └── invoice-engine/      # Invoice generation & formatting
└── tools/
    ├── docker/              # Docker configurations
    └── scripts/             # Development scripts
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose

### 1. Clone and Setup

```bash
git clone <repository-url>
cd easy-filer
npm install
```

### 2. Start Development Environment

**Windows:**
```bash
scripts\start-dev.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

**Manual Setup:**
```bash
# Start infrastructure
docker-compose up -d

# Setup database
cd packages/database
npm run generate
npm run push
cd ../..

# Start development server
cd apps/web
npm run dev
```

### 3. Access Applications

- **Frontend**: http://localhost:3000
- **pgAdmin**: http://localhost:5050 (admin@easyfiler.com / admin)
- **Redis Commander**: http://localhost:8081
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin)

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### 1. Clone and Install

```bash
git clone <repository-url>
cd easy-filer
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Update environment variables in .env.local
# - Database connection strings
# - FBR API credentials
# - Authentication secrets
```

### 3. Start Infrastructure

```bash
# Start PostgreSQL, Redis, MinIO, and management tools
npm run docker:up

# Wait for services to be ready, then initialize database
npm run db:generate
npm run db:push
```

### 4. Development Server

```bash
# Start all applications in development mode
npm run dev

# Or start individual applications
cd apps/web && npm run dev     # Frontend on http://localhost:3000
cd apps/api && npm run dev     # Backend API on http://localhost:3001
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start all apps in development mode
npm run build            # Build all applications
npm run start            # Start production builds
npm run lint             # Lint all code
npm run type-check       # TypeScript type checking

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:migrate       # Run database migrations

# Infrastructure
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests
npm run test:fbr-integration  # Test FBR API integration
```

## 🔐 FBR Integration Setup

### 1. Sandbox Environment

1. Obtain PRAL sandbox credentials from FBR
2. Configure sandbox token in environment variables
3. Test invoice submission to sandbox endpoints
4. Complete scenario-based validation

### 2. Production Environment

1. Complete sandbox validation successfully
2. Generate production token via IRIS portal
3. Configure production credentials
4. Start submitting live invoices

### 3. API Endpoints

```typescript
// Sandbox endpoints
POST /di_data/v1/di/postinvoicedata_sb      // Submit to sandbox
POST /di_data/v1/di/validateinvoicedata_sb  // Validate in sandbox

// Production endpoints
POST /di_data/v1/di/postinvoicedata         // Submit to production

// Reference data (public APIs)
GET /pdi/v1/provinces                       // Get provinces
GET /pdi/v1/itemdesccode                    // Get HS codes
GET /pdi/v1/uom                             // Get units of measurement
GET /pdi/v2/SaleTypeToRate                  // Get tax rates
```

## 📊 Database Schema

Key entities:
- **Users**: User accounts and authentication
- **Businesses**: Multi-tenant business profiles
- **Customers**: Customer management
- **Invoices**: Invoice records with FBR integration status
- **InvoiceItems**: Line items with tax calculations
- **BulkInvoiceBatch**: Bulk operation tracking
- **AuditLog**: Complete audit trail

## 🎯 Business Workflow

### Invoice Creation
1. User creates invoice in Easy Filer
2. System validates data and calculates taxes
3. Invoice submitted to FBR via PRAL API
4. FBR returns IRN (Invoice Reference Number)
5. System generates QR code using IRN
6. Final PDF generated with FBR data

### Bulk Processing
1. Upload CSV/XLSX file with invoice data
2. System validates and parses all records
3. Batch submission to FBR sandbox for validation
4. After validation, submit to production
5. Track status and generate reports

## 🔒 Security & Compliance

- **Data Encryption**: All sensitive data encrypted at rest
- **6-Year Retention**: Automatic compliance with FBR requirements
- **Audit Trail**: Complete logging of all FBR interactions
- **Multi-Factor Authentication**: Secure user authentication
- **IP Whitelisting**: FBR-required IP address management

## 🚀 Deployment

### Production Deployment

```bash
# Build for production
npm run build

# Deploy to cloud provider
# Configure environment variables
# Set up SSL certificates
# Configure load balancer
```

### Docker Deployment

```bash
# Build Docker images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Documentation

- [FBR Compliance Guide](./docs/fbr-compliance/)
- [API Documentation](./docs/api/)
- [Development Guide](./docs/development/)
- [Deployment Guide](./docs/deployment/)

## 🆘 Support

- **Documentation**: [docs.easyfiler.com](https://docs.easyfiler.com)
- **Support Email**: support@easyfiler.com
- **FBR Help**: [FBR Digital Invoicing Portal](https://dicrm.pral.com.pk)

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built for Pakistani businesses** 🇵🇰 | **FBR SRO 69(I)/2025 Compliant** ✅