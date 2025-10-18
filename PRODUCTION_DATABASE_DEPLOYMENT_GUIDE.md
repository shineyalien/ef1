# Production Database Deployment Guide

This guide provides step-by-step instructions for deploying the Easy Filer v3 application database to production using Docker, ensuring all schema and migration issues are resolved.

## Overview

The application has been updated to consolidate duplicate schema files and migrations. The following changes have been made:

1. **Consolidated Schema**: Using `apps/web/prisma/schema.prisma` as the single source of truth
2. **Unified Migrations**: All migrations are now in `apps/web/prisma/migrations/`
3. **Removed Duplicates**: Eliminated redundant fields and inconsistent naming
4. **Docker Integration**: Optimized for Docker-based deployment with docker-compose

## Pre-Deployment Checklist

### 1. Docker Environment Setup

- [ ] Docker and Docker Compose are installed on the production server
- [ ] Sufficient disk space is available for Docker volumes
- [ ] Docker daemon is running with appropriate resource limits

### 2. Database Configuration

- [ ] Production PostgreSQL database is ready (via Docker)
- [ ] Database URL is configured in environment variables
- [ ] Database user has necessary permissions (CREATE, ALTER, INSERT, UPDATE, DELETE, SELECT)
- [ ] SSL connection is enabled for security (if required)
- [ ] Connection pool size is configured for production load

### 3. Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Required for production
NODE_ENV="production"
POSTGRES_PASSWORD="your_secure_password"  # Used by docker-compose.prod.yml
DATABASE_URL="postgresql://postgres:your_secure_password@postgres:5432/easyfiler"

# Application Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your_nextauth_secret"

# FBR Integration
FBR_SANDBOX_USERNAME="your_fbr_sandbox_username"
FBR_SANDBOX_PASSWORD="your_fbr_sandbox_password"
FBR_PRODUCTION_USERNAME="your_fbr_production_username"
FBR_PRODUCTION_PASSWORD="your_fbr_production_password"

# Optional but recommended
DATABASE_POOL_SIZE="20"
DATABASE_CONNECTION_TIMEOUT="30"
```

### 4. Backup Strategy

- [ ] Create a full backup of the production database
- [ ] Test backup restoration process
- [ ] Set up automated daily backups using Docker volumes

## Deployment Steps

### Step 1: Prepare the Docker Environment

1. Create the production environment file:
```bash
cp .env.example .env.production
# Edit .env.production with your production values
```

2. Build the Docker image:
```bash
docker build -t easyfiler-prod .
```

### Step 2: Deploy Database Schema with Docker

1. Start the PostgreSQL container first:
```bash
docker-compose -f docker-compose.prod.yml up -d postgres
```

2. Wait for PostgreSQL to be ready:
```bash
docker-compose -f docker-compose.prod.yml logs -f postgres
# Wait until you see "database system is ready to accept connections"
```

3. Run migrations inside the application container:
```bash
# Create a temporary container to run migrations
docker run --rm \
  --network easy-filer-network \
  -e DATABASE_URL="postgresql://postgres:${POSTGRES_PASSWORD:-postgres}@postgres:5432/easyfiler" \
  -v $(pwd)/apps/web/prisma:/app/prisma \
  easyfiler-prod \
  npx prisma migrate deploy
```

4. Generate Prisma client:
```bash
docker run --rm \
  --network easy-filer-network \
  -e DATABASE_URL="postgresql://postgres:${POSTGRES_PASSWORD:-postgres}@postgres:5432/easyfiler" \
  -v $(pwd)/apps/web/prisma:/app/prisma \
  easyfiler-prod \
  npx prisma generate
```

### Step 3: Start the Full Application Stack

1. Start all services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

2. Check that all services are running:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Step 4: Verify Deployment

1. Check application logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

2. Connect to the database to verify tables:
```bash
# Connect to PostgreSQL container
docker exec -it easy-filer-db psql -U postgres -d easyfiler

# Inside PostgreSQL, verify tables
\dt
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

3. Check foreign key constraints:
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public';
```

## Post-Deployment Monitoring

### 1. Performance Monitoring

- Monitor database connection pool usage
- Track slow queries
- Monitor index usage

### 2. Error Monitoring

- Set up alerts for database connection errors
- Monitor migration failures
- Track foreign key constraint violations

### 3. Regular Maintenance

- Schedule regular VACUUM and ANALYZE operations
- Review and optimize slow queries
- Monitor table sizes and growth

## Troubleshooting

### Common Issues

1. **Migration Conflicts**
   - Error: `Migration already applied`
   - Solution: Check migration status and reset if needed

2. **Connection Pool Exhaustion**
   - Error: `Connection pool is full`
   - Solution: Increase pool size or optimize queries

3. **Foreign Key Constraint Violations**
   - Error: `Foreign key constraint violation`
   - Solution: Check data integrity before migrations

### Recovery Procedures

1. **Rollback Migration**
```bash
npx prisma migrate reset --force
```

2. **Restore from Backup**
```bash
psql -h host -U username -d database < backup.sql
```

## Security Considerations

1. **Database Security**
   - Use strong passwords
   - Limit database user permissions
   - Enable SSL connections
   - Regularly update PostgreSQL

2. **Application Security**
   - Never expose database credentials in code
   - Use environment variables for secrets
   - Implement connection pooling
   - Log database access

## Performance Optimization

1. **Indexing Strategy**
   - Add indexes on frequently queried columns
   - Monitor index usage
   - Remove unused indexes

2. **Query Optimization**
   - Use EXPLAIN ANALYZE for slow queries
   - Optimize JOIN operations
   - Implement pagination for large datasets

3. **Connection Management**
   - Use connection pooling
   - Set appropriate timeout values
   - Monitor connection leaks

## Migration History

The following migrations have been applied in order:

1. `202501008_add_fbr_scenarios` - FBR scenario management
2. `202501012_add_fbr_buyer_fields_to_customers` - Customer FBR fields
3. `202501015_add_fbr_buyer_fields_to_invoices` - Invoice FBR fields
4. `202501015_add_fbr_tax_fields_to_invoice_items` - Invoice item tax fields
5. `202501015_add_fbr_fields_to_products` - Product FBR fields
6. `202501016_add_business_fields` - Business customization fields
7. `20251004221927_add_fbr_compliance_fields_and_scenario_filtering` - FBR compliance
8. `20251005091504_add_fbr_transaction_type` - FBR transaction types
9. `20251005101419_rename_sale_types_and_add_transaction_types` - Sale type updates
10. `20251005232813_add_business_customization_fields` - Business customization
11. `20251006090152_add_notification_preferences` - User notifications
12. `20251006094204_add_retry_fields` - Retry mechanism
13. `20251006094242_add_retry_and_recovery_fields` - Retry recovery
14. `20251007195100_add_retry_processing_status` - Retry status
15. `20251007195700_add_retry_indexes` - Performance indexes
16. `20251007212000_add_product_search_indexes` - Search optimization
17. `20251008080000_add_fbr_scenario_mapping` - Scenario mapping
18. `20251008210000_update_fbr_scenario_mappings` - Mapping updates
19. `20251008225112_v2glm` - Latest updates

## Support

For deployment issues:
1. Check the application logs
2. Review PostgreSQL logs
3. Verify environment variables
4. Test database connectivity

## Additional Resources

- [Prisma Production Deployment](https://www.prisma.io/docs/guides/deployment/deploying-to-production)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [Database Security Best Practices](https://owasp.org/www-project-cheat-sheets/cheatsheets/Database_Security_Cheat_Sheet.html)