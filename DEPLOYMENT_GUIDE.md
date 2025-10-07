# Easy Filer v3 Deployment Guide

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Prerequisites](#prerequisites)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [FBR Integration Setup](#fbr-integration-setup)
7. [Application Deployment](#application-deployment)
8. [PWA Configuration](#pwa-configuration)
9. [Offline Sync Configuration](#offline-sync-configuration)
10. [Retry Mechanism Configuration](#retry-mechanism-configuration)
11. [PDF Generation Configuration](#pdf-generation-configuration)
12. [Product Search Optimization](#product-search-optimization)
13. [Error Handling Configuration](#error-handling-configuration)
14. [Monitoring and Maintenance](#monitoring-and-maintenance)
15. [Troubleshooting](#troubleshooting)
16. [Performance Optimization](#performance-optimization)
17. [Security Considerations](#security-considerations)
18. [Backup and Recovery](#backup-and-recovery)

## Overview

Easy Filer v3 is a comprehensive FBR-compliant invoicing solution for Pakistani businesses. This guide covers the complete deployment process, including configuration of all recent features such as FBR integration, retry mechanisms, offline synchronization, enhanced error handling, optimized product search, and PDF generation with customization options.

### Key Features

- **FBR Integration**: Complete integration with FBR PRAL API for invoice validation and submission
- **Retry Mechanism**: Intelligent retry system for failed FBR submissions with exponential backoff
- **Offline Synchronization**: Full offline support with automatic synchronization when online
- **Enhanced Error Handling**: Comprehensive error categorization and handling system
- **Product Search Optimization**: Optimized search functionality with indexing
- **PDF Generation**: Customizable PDF templates with FBR QR code integration
- **PWA Support**: Progressive Web App capabilities for mobile and desktop use

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Service       │    │   FBR PRAL      │    │   Redis Cache   │
│   Worker        │    │   API           │    │   (Optional)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Components

1. **Frontend (Next.js)**: React-based user interface with PWA capabilities
2. **Backend API (Next.js)**: RESTful API handling business logic
3. **Database (PostgreSQL)**: Primary data storage with optimized indexes
4. **FBR PRAL API**: External FBR integration for invoice validation and submission
5. **Service Worker**: Handles offline functionality and background sync
6. **Redis Cache**: Optional caching layer for improved performance

## Prerequisites

### System Requirements

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0
- **PostgreSQL**: >= 13.0
- **Redis**: >= 6.0 (optional, for caching)
- **Operating System**: Linux, macOS, or Windows

### Development Tools

- **Git**: Latest version
- **Docker**: Latest version (for containerized deployment)
- **Docker Compose**: Latest version (for multi-container deployment)

### FBR Requirements

- **FBR Sandbox Account**: For testing and validation
- **FBR Production Account**: For live invoice submission
- **Valid NTN Number**: Business tax registration number
- **Electronic Invoicing Software Registration**: From FBR portal

## Environment Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"
REDIS_URL="redis://localhost:6379"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-secret-key-here"

# FBR Integration
FBR_ENVIRONMENT="sandbox" # sandbox or production
FBR_SANDBOX_USERNAME="your-fbr-sandbox-username"
FBR_SANDBOX_PASSWORD="your-fbr-sandbox-password"
FBR_PRODUCTION_USERNAME="your-fbr-production-username"
FBR_PRODUCTION_PASSWORD="your-fbr-production-password"
FBR_BASE_URL="https://gw.fbr.gov.pk"

# FBR API Endpoints
FBR_POST_INVOICE_SANDBOX="/di_data/v1/di/postinvoicedata_sb"
FBR_POST_INVOICE_PRODUCTION="/di_data/v1/di/postinvoicedata"
FBR_VALIDATE_INVOICE_SANDBOX="/di_data/v1/di/validateinvoicedata_sb"
FBR_PROVINCES="/pdi/v1/provinces"
FBR_DOCUMENT_TYPES="/pdi/v1/doctypecode"
FBR_HS_CODES="/pdi/v1/itemdesccode"
FBR_SRO_ITEMS="/pdi/v1/sroitemcode"
FBR_TRANSACTION_TYPES="/pdi/v1/transtypecode"
FBR_UNITS_OF_MEASUREMENT="/pdi/v1/uom"
FBR_SRO_SCHEDULE="/pdi/v1/SroSchedule"
FBR_TAX_RATES="/pdi/v2/SaleTypeToRate"

# FBR Request Configuration
FBR_REQUEST_TIMEOUT="30000"
FBR_RETRY_ATTEMPTS="3"
FBR_RETRY_DELAY="1000"

# FBR Tax Configuration
FBR_STANDARD_TAX_RATE="18"
FBR_REDUCED_TAX_RATES="5,10,12,15"
FBR_WITHHOLDING_RATE_MANUFACTURING="1.0"
FBR_WITHHOLDING_THRESHOLD_MANUFACTURING="25000"
FBR_WITHHOLDING_RATE_TRADING="0.25"
FBR_WITHHOLDING_THRESHOLD_TRADING="50000"
FBR_WITHHOLDING_RATE_SERVICES="8.0"
FBR_WITHHOLDING_THRESHOLD_SERVICES="15000"
FBR_WITHHOLDING_RATE_IMPORT="5.5"
FBR_WITHHOLDING_THRESHOLD_IMPORT="100000"
FBR_WITHHOLDING_RATE_EXPORT="0.0"
FBR_WITHHOLDING_THRESHOLD_EXPORT="0"
FBR_WITHHOLDING_RATE_TELECOMMUNICATION="10.0"
FBR_WITHHOLDING_THRESHOLD_TELECOMMUNICATION="1000"
FBR_WITHHOLDING_RATE_BANKING="0.6"
FBR_WITHHOLDING_THRESHOLD_BANKING="5000"

# FBR Provincial Tax Rates
FBR_PUNJAB_EXTRA_TAX_RATE="0.0"
FBR_PUNJAB_PROVINCIAL_SALES_TAX="0.0"
FBR_SINDH_EXTRA_TAX_RATE="0.0"
FBR_SINDH_PROVINCIAL_SALES_TAX="0.0"
FBR_KPK_EXTRA_TAX_RATE="0.0"
FBR_KPK_PROVINCIAL_SALES_TAX="0.0"
FBR_BALOCHISTAN_EXTRA_TAX_RATE="0.0"
FBR_BALOCHISTAN_PROVINCIAL_SALES_TAX="0.0"
FBR_ISLAMABAD_EXTRA_TAX_RATE="0.0"
FBR_ISLAMABAD_PROVINCIAL_SALES_TAX="0.0"

# FBR Zero-rated and Exempt Items
FBR_ZERO_RATED_ITEMS="Rice,Wheat,Sugar,Edible Oil,Fertilizer,Pesticides,Agricultural Machinery,Export Items"
FBR_EXEMPT_ITEMS="Books,Newspapers,Educational Materials,Medicine,Medical Equipment,Charity Items"

# FBR QR Code Configuration
FBR_QR_SIZE="200"
FBR_QR_MARGIN="1"
FBR_QR_ERROR_CORRECTION="M"
FBR_QR_VALIDATION_STRICT="true"
FBR_QR_MIN_INVOICE_NUMBER_LENGTH="10"
FBR_QR_ALLOW_PARTIAL_FIELDS="false"

# FBR Invoice Number Configuration
FBR_INVOICE_ALLOW_UNKNOWN_FORMATS="false"
FBR_INVOICE_STRICT_VALIDATION="true"

# FBR Error Handling Configuration
FBR_ERROR_INCLUDE_STACK_TRACE="false"
FBR_ERROR_LOG_LEVEL="error"
FBR_RETRY_ENABLED="true"
FBR_RETRY_MAX_ATTEMPTS="3"
FBR_RETRY_BASE_DELAY="1000"
FBR_RETRY_MAX_DELAY="10000"
FBR_RETRY_BACKOFF_MULTIPLIER="2"

# FBR Scenario Configuration
FBR_SCENARIO_ALLOW_UNKNOWN="false"
FBR_SCENARIO_REQUIRED_FOR_SANDBOX="true"

# Retry Mechanism Configuration
RETRY_PROCESSING_TIMEOUT_MS="300000"
RETRY_MAX_RETRIES="3"
RETRY_INITIAL_DELAY_MS="5000"
RETRY_MAX_DELAY_MS="300000"
RETRY_BACKOFF_MULTIPLIER="2"

# Cron Job Configuration
CRON_SECRET="your-secure-cron-secret-key"

# File Upload Configuration
UPLOAD_DIR="/tmp/uploads"
AWS_S3_BUCKET="easyfiler-documents"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-email-password"
FROM_EMAIL="noreply@yourdomain.com"

# Application Configuration
NODE_ENV="production"
PORT="3000"
API_RATE_LIMIT="1000"
API_RATE_WINDOW="900000"

# Security Configuration
ENCRYPTION_KEY="your-32-char-encryption-key-here"
JWT_SECRET="your-jwt-secret-key-here"
SECURITY_HEADERS="true"

# Analytics Configuration (Optional)
GOOGLE_ANALYTICS_ID=""
VERCEL_ANALYTICS_ID=""
ENABLE_ANALYTICS="false"

# Monitoring Configuration (Optional)
SENTRY_DSN=""
SENTRY_AUTH_TOKEN=""
LOG_LEVEL="info"
ENABLE_SENTRY="false"
```

## Database Setup

### PostgreSQL Installation

1. Install PostgreSQL on your system:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # CentOS/RHEL
   sudo yum install postgresql-server postgresql-contrib
   
   # macOS
   brew install postgresql
   
   # Windows
   # Download and install from https://www.postgresql.org/download/windows/
   ```

2. Start PostgreSQL service:
   ```bash
   # Ubuntu/Debian
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   
   # CentOS/RHEL
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   
   # macOS
   brew services start postgresql
   
   # Windows
   # Start from Services or run as administrator
   ```

3. Create database and user:
   ```sql
   CREATE DATABASE easyfiler;
   CREATE USER easyfiler_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE easyfiler TO easyfiler_user;
   ```

### Database Migration

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

4. (Optional) Seed database with initial data:
   ```bash
   npm run db:seed
   ```

### Database Schema

The database schema includes the following key tables:

- **users**: User accounts and authentication
- **businesses**: Business information and FBR configuration
- **customers**: Customer information
- **products**: Product catalog with FBR compliance fields
- **invoices**: Invoice records with FBR submission status
- **invoice_items**: Invoice line items
- **fbr_provinces**: FBR province reference data
- **fbr_hs_codes**: FBR HS code reference data
- **fbr_uom**: FBR unit of measurement reference data
- **fbr_document_types**: FBR document type reference data
- **fbr_scenarios**: FBR scenario reference data
- **fbr_payment_modes**: FBR payment mode reference data
- **fbr_transaction_types**: FBR transaction type reference data
- **fbr_tax_rates**: FBR tax rate reference data
- **fbr_sro_schedules**: FBR SRO schedule reference data
- **fbr_sro_items**: FBR SRO item reference data
- **fbr_cache_metadata**: FBR cache metadata

### Database Indexes

The following indexes are optimized for performance:

- Retry mechanism indexes:
  - `invoices_retry_ready_idx`: For finding invoices ready for retry
  - `invoices_retry_processing_idx`: For managing retry processing locks
  - `invoices_retry_count_status_idx`: For retry count and status queries
  - `invoices_last_retry_at_idx`: For ordering by last retry time
  - `invoices_error_analysis_idx`: For error analysis

- Product search indexes:
  - `products_business_id_index`: For business-specific product searches
  - `products_name_index`: For product name searches
  - `products_hs_code_index`: For HS code searches
  - `products_category_index`: For product category searches
  - `products_composite_index`: For combined searches

## FBR Integration Setup

### FBR Account Setup

1. Register for an FBR sandbox account:
   - Visit the FBR PRAL portal: https://gw.fbr.gov.pk
   - Register for a sandbox account
   - Obtain sandbox credentials (username and password)

2. Register for production access:
   - Complete the production registration process
   - Obtain production credentials
   - Register your electronic invoicing software

### FBR Configuration

1. Set FBR environment variables:
   ```bash
   FBR_ENVIRONMENT="sandbox" # Set to "production" for live environment
   FBR_SANDBOX_USERNAME="your-sandbox-username"
   FBR_SANDBOX_PASSWORD="your-sandbox-password"
   FBR_PRODUCTION_USERNAME="your-production-username"
   FBR_PRODUCTION_PASSWORD="your-production-password"
   ```

2. Configure FBR API endpoints:
   ```bash
   FBR_BASE_URL="https://gw.fbr.gov.pk"
   FBR_POST_INVOICE_SANDBOX="/di_data/v1/di/postinvoicedata_sb"
   FBR_POST_INVOICE_PRODUCTION="/di_data/v1/di/postinvoicedata"
   FBR_VALIDATE_INVOICE_SANDBOX="/di_data/v1/di/validateinvoicedata_sb"
   ```

3. Configure tax rates and thresholds:
   ```bash
   FBR_STANDARD_TAX_RATE="18"
   FBR_REDUCED_TAX_RATES="5,10,12,15"
   FBR_WITHHOLDING_RATE_MANUFACTURING="1.0"
   FBR_WITHHOLDING_THRESHOLD_MANUFACTURING="25000"
   # ... other tax configurations
   ```

### FBR Token Management

The application includes a comprehensive token management system:

1. **Token Validation**: Automatic validation of FBR tokens
2. **Token Refresh**: Automatic refresh of expired tokens
3. **Token Caching**: Caching of valid tokens to reduce API calls
4. **Token Monitoring**: Monitoring of token usage and expiration

### FBR Scenarios Configuration

FBR scenarios define the tax calculation rules based on business type and transaction type:

1. **Default Scenarios**:
   - `GEN-001`: General - Registered to Registered
   - `GEN-002`: General - Registered to Unregistered
   - `GEN-003`: General - Export Sales

2. **Business Type Mappings**:
   - `Manufacturer`: MFG-001, MFG-002, MFG-003
   - `Service Provider`: SRV-001, SRV-002, SRV-003
   - `Distributor`: TRD-001, TRD-002

3. **Scenario Validation**:
   - Automatic validation of scenario applicability
   - Business type and sector filtering
   - Error handling for invalid scenarios

## Application Deployment

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/easy-filer-v3.git
   cd easy-filer-v3
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Production Deployment

#### Option 1: Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t easy-filer-v3 .
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

#### Option 2: Manual Deployment

1. Install dependencies:
   ```bash
   npm install --production
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

4. Start the application:
   ```bash
   npm run start
   ```

#### Option 3: Platform Deployment

##### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

##### Coolify Deployment

1. Set up Coolify server
2. Create a new application
3. Connect your Git repository
4. Configure environment variables
5. Deploy the application

### Environment-Specific Configuration

#### Development Environment

```bash
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:password@localhost:5432/easyfiler_dev"
FBR_ENVIRONMENT="sandbox"
LOG_LEVEL="debug"
```

#### Production Environment

```bash
NODE_ENV="production"
NEXTAUTH_URL="https://your-domain.com"
DATABASE_URL="postgresql://username:password@host:port/easyfiler_prod"
FBR_ENVIRONMENT="production"
LOG_LEVEL="info"
```

## PWA Configuration

### Service Worker Registration

The application includes a comprehensive service worker for offline functionality:

1. **Service Worker File**: `apps/web/public/sw.js`
2. **Registration**: Automatic registration in the main application
3. **Caching Strategy**: Network-first for API requests, cache-first for static assets

### PWA Manifest

The PWA manifest is configured in `apps/web/public/manifest.json`:

```json
{
  "name": "Easy Filer - Pakistani Invoicing",
  "short_name": "Easy Filer",
  "description": "FBR-compliant invoicing software for Pakistani businesses",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "en-US",
  "categories": ["business", "finance", "productivity"]
}
```

### Offline Capabilities

The application provides comprehensive offline capabilities:

1. **Offline Invoice Creation**: Create invoices without internet connection
2. **Offline Customer Management**: Manage customers offline
3. **Offline Product Search**: Search products offline
4. **Automatic Sync**: Automatically sync data when connection is restored
5. **Conflict Resolution**: Handle sync conflicts with user intervention

### Background Sync

The application supports background synchronization:

1. **Sync Queue**: Queued operations for offline changes
2. **Background Sync**: Automatic sync when connection is restored
3. **Retry Mechanism**: Intelligent retry for failed sync operations
4. **Conflict Detection**: Detection and resolution of sync conflicts

## Offline Sync Configuration

### Sync Service Configuration

The sync service is configured in `apps/web/src/lib/sync-service.ts`:

1. **Sync Queue Management**: Queue operations for offline changes
2. **Network Status Monitoring**: Monitor network status changes
3. **Automatic Sync Trigger**: Trigger sync when connection is restored
4. **Conflict Resolution**: Handle sync conflicts with user intervention

### IndexedDB Configuration

The application uses IndexedDB for offline storage:

1. **Database Name**: `EasyFilerDB`
2. **Version**: `1`
3. **Object Stores**:
   - `invoices`: Offline invoices
   - `customers`: Offline customers
   - `bulkOperations`: Offline bulk operations
   - `syncQueue`: Sync queue for offline changes

### Sync Status Monitoring

The application provides comprehensive sync status monitoring:

1. **Sync Status API**: `/api/sync/status` endpoint for sync status
2. **Sync Status Page**: `/sync-status` page for visual sync status
3. **Sync Notifications**: Notifications for sync events
4. **Sync Metrics**: Metrics for sync performance and success rate

## Retry Mechanism Configuration

### Retry Service Configuration

The retry service is configured in `apps/web/src/lib/retry-service.ts`:

1. **Error Categorization**: Categorize errors for intelligent retry
2. **Exponential Backoff**: Implement exponential backoff for retry delays
3. **Database Locking**: Prevent race conditions with database-level locking
4. **Retry Monitoring**: Monitor retry attempts and success rate

### Retry Configuration

Configure retry mechanism with environment variables:

```bash
# Retry Processing Configuration
RETRY_PROCESSING_TIMEOUT_MS="300000"
RETRY_MAX_RETRIES="3"
RETRY_INITIAL_DELAY_MS="5000"
RETRY_MAX_DELAY_MS="300000"
RETRY_BACKOFF_MULTIPLIER="2"

# Cron Job Configuration
CRON_SECRET="your-secure-cron-secret-key"
```

### Retry Monitoring

The application provides comprehensive retry monitoring:

1. **Retry Metrics API**: `/api/retry/metrics` endpoint for retry metrics
2. **Retry Monitoring Service**: `apps/web/src/lib/retry-monitoring.ts`
3. **Retry History**: Track retry history for each invoice
4. **Retry Performance**: Monitor retry performance and success rate

### Cron Job Setup

Set up a cron job to process failed retries:

1. **Cron Endpoint**: `/api/cron/retry-failed-invoices`
2. **Cron Secret**: Secure secret for cron endpoint authentication
3. **Cron Schedule**: Recommended schedule: `*/5 * * * *` (every 5 minutes)
4. **Cron Command**: `curl -X POST -H "X-Cron-Secret: your-secret" https://your-domain.com/api/cron/retry-failed-invoices`

## PDF Generation Configuration

### PDF Generator Configuration

The PDF generator is configured in `apps/web/src/lib/pdf-generator-enhanced.ts`:

1. **PDF Themes**: Support for multiple PDF themes (default, modern, classic)
2. **Business Customization**: Customizable business information and branding
3. **FBR QR Code**: Integration with FBR QR code generation
4. **PDF Templates**: Multiple PDF templates for different use cases

### PDF Theme Configuration

Configure PDF themes with business settings:

1. **Default Theme**: Standard theme with basic styling
2. **Modern Theme**: Modern theme with colored headers and card-style layout
3. **Classic Theme**: Classic theme with elegant styling and decorative elements

### PDF Customization Options

Customize PDF generation with business settings:

1. **Business Logo**: Upload and display business logo
2. **Business Colors**: Customize primary and secondary colors
3. **Invoice Prefix**: Set custom invoice number prefix
4. **Footer Text**: Add custom footer text
5. **Tax ID Label**: Customize tax ID label (NTN, GST, etc.)
6. **Default Currency**: Set default currency for invoices

### PDF Generation API

Generate PDFs with the PDF generation API:

1. **PDF Generation Endpoint**: `/api/invoices/[id]/pdf`
2. **PDF Theme Selection**: Select PDF theme with query parameter
3. **PDF Customization**: Customize PDF with business settings
4. **PDF Download**: Download generated PDF as file

## Product Search Optimization

### Product Search Configuration

The product search is optimized with database indexes:

1. **Product Name Index**: Index for product name searches
2. **HS Code Index**: Index for HS code searches
3. **Category Index**: Index for product category searches
4. **Composite Index**: Composite index for combined searches

### Product Search Performance

Optimize product search performance with:

1. **Database Indexes**: Optimized indexes for fast searching
2. **Search Caching**: Cache search results for improved performance
3. **Search Debouncing**: Debounce search input to reduce API calls
4. **Search Pagination**: Paginate search results for large datasets

### Product Search API

Search products with the product search API:

1. **Product Search Endpoint**: `/api/products/search`
2. **Search Parameters**: Query parameters for search filters
3. **Search Results**: Paginated search results with metadata
4. **Search Suggestions**: Search suggestions for autocomplete

## Error Handling Configuration

### Error Handling System

The error handling system is configured in `apps/web/src/lib/error-logger.ts`:

1. **Error Categorization**: Categorize errors for intelligent handling
2. **Error Logging**: Comprehensive error logging with context
3. **Error Notifications**: Notifications for critical errors
4. **Error Recovery**: Automatic error recovery where possible

### Error Configuration

Configure error handling with environment variables:

```bash
# Error Handling Configuration
FBR_ERROR_INCLUDE_STACK_TRACE="false"
FBR_ERROR_LOG_LEVEL="error"
LOG_LEVEL="info"
ENABLE_SENTRY="false"
SENTRY_DSN=""
```

### Error Monitoring

Monitor errors with the error monitoring system:

1. **Error Logging**: Comprehensive error logging with context
2. **Error Metrics**: Metrics for error frequency and types
3. **Error Notifications**: Notifications for critical errors
4. **Error Recovery**: Automatic error recovery where possible

## Monitoring and Maintenance

### Application Monitoring

Monitor application health and performance:

1. **Health Check Endpoint**: `/api/health` endpoint for health checks
2. **Metrics Endpoint**: `/api/metrics` endpoint for application metrics
3. **Performance Monitoring**: Monitor application performance
4. **Error Monitoring**: Monitor application errors

### Database Monitoring

Monitor database health and performance:

1. **Database Connection Health**: Monitor database connection health
2. **Query Performance**: Monitor database query performance
3. **Database Indexes**: Monitor database index usage
4. **Database Backups**: Monitor database backup status

### FBR Integration Monitoring

Monitor FBR integration health and performance:

1. **FBR API Health**: Monitor FBR API health and availability
2. **FBR Token Status**: Monitor FBR token status and expiration
3. **FBR Submission Status**: Monitor FBR submission status and success rate
4. **FBR Retry Status**: Monitor FBR retry status and performance

### Sync Monitoring

Monitor sync health and performance:

1. **Sync Status**: Monitor sync status and progress
2. **Sync Queue**: Monitor sync queue and processing
3. **Sync Conflicts**: Monitor sync conflicts and resolution
4. **Sync Performance**: Monitor sync performance and success rate

## Troubleshooting

### Common Issues

#### FBR Integration Issues

1. **FBR API Connection Errors**:
   - Check FBR API endpoint configuration
   - Verify FBR credentials are correct
   - Check network connectivity to FBR servers
   - Verify FBR API is available and not under maintenance

2. **FBR Token Expiration**:
   - Check FBR token status in application
   - Verify FBR token refresh mechanism is working
   - Check FBR token expiration time
   - Verify FBR token refresh configuration

3. **FBR Submission Failures**:
   - Check FBR submission error messages
   - Verify invoice data is FBR-compliant
   - Check FBR scenario configuration
   - Verify tax calculations are correct

#### Offline Sync Issues

1. **Sync Queue Not Processing**:
   - Check network connectivity
   - Verify service worker is active
   - Check sync queue status in application
   - Verify background sync is registered

2. **Sync Conflicts**:
   - Check sync conflict resolution mechanism
   - Verify sync conflict handling is working
   - Check sync conflict notifications
   - Verify sync conflict resolution options

3. **IndexedDB Issues**:
   - Check IndexedDB storage quota
   - Verify IndexedDB object stores are created
   - Check IndexedDB data integrity
   - Verify IndexedDB data migration

#### Retry Mechanism Issues

1. **Retry Not Processing**:
   - Check retry configuration
   - Verify retry cron job is running
   - Check retry processing locks
   - Verify retry eligibility criteria

2. **Retry Failures**:
   - Check retry error messages
   - Verify retry error categorization
   - Check retry backoff configuration
   - Verify retry monitoring is working

3. **Retry Performance Issues**:
   - Check retry database indexes
   - Verify retry query performance
   - Check retry processing timeout
   - Verify retry monitoring metrics

#### PDF Generation Issues

1. **PDF Not Generating**:
   - Check PDF generator configuration
   - Verify PDF theme selection
   - Check PDF data integrity
   - Verify PDF generation API is working

2. **PDF Formatting Issues**:
   - Check PDF theme configuration
   - Verify PDF custom settings
   - Check PDF template integrity
   - Verify PDF layout configuration

3. **QR Code Issues**:
   - Check QR code data integrity
   - Verify QR code generation is working
   - Check QR code validation
   - Verify QR code configuration

### Debugging Tools

#### Application Debugging

1. **Application Logs**: Check application logs for errors
2. **Browser Developer Tools**: Use browser developer tools for debugging
3. **Network Tab**: Monitor network requests and responses
4. **Console Tab**: Check console for errors and warnings

#### Database Debugging

1. **Database Logs**: Check database logs for errors
2. **Database Queries**: Monitor database queries and performance
3. **Database Indexes**: Check database index usage and performance
4. **Database Connections**: Monitor database connection health

#### FBR Integration Debugging

1. **FBR API Logs**: Check FBR API request and response logs
2. **FBR Token Status**: Monitor FBR token status and expiration
3. **FBR Submission Logs**: Check FBR submission logs for errors
4. **FBR Retry Logs**: Check FBR retry logs for performance issues

## Performance Optimization

### Application Performance

Optimize application performance with:

1. **Code Splitting**: Implement code splitting for faster initial load
2. **Lazy Loading**: Implement lazy loading for non-critical components
3. **Image Optimization**: Optimize images for faster loading
4. **Caching**: Implement caching for frequently accessed data

### Database Performance

Optimize database performance with:

1. **Database Indexes**: Add indexes for frequently queried fields
2. **Query Optimization**: Optimize database queries for better performance
3. **Connection Pooling**: Implement connection pooling for better scalability
4. **Database Caching**: Implement database query caching

### FBR Integration Performance

Optimize FBR integration performance with:

1. **FBR API Caching**: Cache FBR API responses for better performance
2. **FBR Token Caching**: Cache FBR tokens to reduce API calls
3. **FBR Data Preloading**: Preload FBR reference data for faster access
4. **FBR Batch Processing**: Implement batch processing for FBR submissions

## Security Considerations

### Application Security

Implement security best practices:

1. **Authentication**: Implement secure authentication with NextAuth
2. **Authorization**: Implement role-based access control
3. **Data Validation**: Validate all input data
4. **SQL Injection Prevention**: Use parameterized queries

### API Security

Secure API endpoints with:

1. **API Rate Limiting**: Implement rate limiting to prevent abuse
2. **API Authentication**: Implement secure API authentication
3. **CORS Configuration**: Configure CORS for secure cross-origin requests
4. **HTTPS Only**: Enforce HTTPS for all API requests

### FBR Integration Security

Secure FBR integration with:

1. **FBR Credential Security**: Securely store and encrypt FBR credentials
2. **FBR Token Security**: Securely store and encrypt FBR tokens
3. **FBR Data Validation**: Validate all FBR data
4. **FBR API Security**: Implement secure FBR API communication

## Backup and Recovery

### Database Backup

Implement database backup strategy:

1. **Regular Backups**: Schedule regular database backups
2. **Backup Verification**: Verify backup integrity regularly
3. **Backup Storage**: Store backups securely in multiple locations
4. **Backup Recovery**: Test backup recovery regularly

### Application Data Backup

Backup application data with:

1. **File Storage Backup**: Backup file storage regularly
2. **Configuration Backup**: Backup application configuration
3. **Environment Variables Backup**: Backup environment variables
4. **Backup Automation**: Automate backup process

### Disaster Recovery

Implement disaster recovery plan:

1. **Recovery Procedures**: Document recovery procedures
2. **Recovery Testing**: Test recovery procedures regularly
3. **Recovery Team**: Assign recovery team responsibilities
4. **Recovery Communication**: Plan recovery communication strategy

## Additional Resources

### Documentation

- [FBR PRAL API Documentation](https://gw.fbr.gov.pk)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://reactjs.org/docs)

### Support

- [Easy Filer Support](mailto:support@easyfiler.com)
- [FBR Support](mailto:support@fbr.gov.pk)
- [Community Forum](https://community.easyfiler.com)
- [Knowledge Base](https://kb.easyfiler.com)

### Updates

- [Release Notes](https://docs.easyfiler.com/releases)
- [Changelog](https://docs.easyfiler.com/changelog)
- [Roadmap](https://docs.easyfiler.com/roadmap)
- [Blog](https://blog.easyfiler.com)