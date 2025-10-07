-- Easy Filer PostgreSQL Database Initialization
-- This script sets up the database with initial configuration

-- Create additional extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance (these will be created by Prisma migrations too)
-- These are just for initial setup optimization

-- Example: Create index for email lookups
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Example: Create index for business lookups
-- CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);

-- Example: Create index for invoice lookups
-- CREATE INDEX IF NOT EXISTS idx_invoices_business_id ON invoices(business_id);
-- CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Set default timezone
SET timezone = 'UTC';

-- Create a simple health check function
CREATE OR REPLACE FUNCTION health_check() 
RETURNS TABLE(status TEXT, timestamp TIMESTAMP) AS $$
BEGIN
    RETURN QUERY SELECT 'healthy'::TEXT, NOW()::TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Easy Filer database initialized successfully at %', NOW();
END $$;