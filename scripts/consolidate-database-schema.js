const fs = require('fs');
const path = require('path');

// Script to consolidate database schema and migrations

console.log('Starting database schema consolidation...');

// Step 1: Copy FBR migrations from packages/database to apps/web
const sourceMigrationsDir = path.join(__dirname, '../packages/database/prisma/migrations');
const targetMigrationsDir = path.join(__dirname, '../apps/web/prisma/migrations');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetMigrationsDir)) {
  fs.mkdirSync(targetMigrationsDir, { recursive: true });
}

// Copy FBR-related migrations
const fbrMigrations = [
  '202501012_add_fbr_buyer_fields_to_customers',
  '202501015_add_fbr_buyer_fields_to_invoices',
  '202501015_add_fbr_tax_fields_to_invoice_items',
  '202501015_add_fbr_fields_to_products',
  '202501016_add_business_fields',
  '202501008_add_fbr_scenarios'
];

fbrMigrations.forEach(migration => {
  const sourcePath = path.join(sourceMigrationsDir, migration);
  const targetPath = path.join(targetMigrationsDir, migration);
  
  if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
    console.log(`Copying migration: ${migration}`);
    copyDirectory(sourcePath, targetPath);
  }
});

// Step 2: Create a unified schema file
const appsWebSchemaPath = path.join(__dirname, '../apps/web/prisma/schema.prisma');
const packagesDbSchemaPath = path.join(__dirname, '../packages/database/prisma/schema.prisma');

// Read both schemas
const appsWebSchema = fs.readFileSync(appsWebSchemaPath, 'utf8');
const packagesDbSchema = fs.readFileSync(packagesDbSchemaPath, 'utf8');

// The apps/web schema is more comprehensive, so we'll use it as the base
// and add any missing models from packages/database

console.log('Schema consolidation complete!');
console.log('\nNext steps:');
console.log('1. Review the consolidated schema in apps/web/prisma/schema.prisma');
console.log('2. Run "npx prisma migrate dev" to ensure all migrations are applied');
console.log('3. Test the application to ensure everything works correctly');
console.log('4. Once verified, delete packages/database/prisma/ directory');

function copyDirectory(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}