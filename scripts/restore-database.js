const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Configuration
const config = {
  // Update these values based on your docker-compose.yml
  containerName: 'easyfiler-postgres',
  databaseName: 'easyfiler_dev',
  username: 'postgres',
  backupDir: path.join(__dirname, '../backups'),
  isWindows: os.platform() === 'win32'
};

// Get backup file from command line arguments
const backupFile = process.argv[2];

if (!backupFile) {
  console.error('❌ Please provide a backup file path');
  console.log('Usage: node restore-database.js <backup-file>');
  console.log('Example: node restore-database.js backups/easyfiler-backup-2023-10-18T11-30-00.sql.gz');
  process.exit(1);
}

const backupFilePath = path.resolve(backupFile);

// Check if backup file exists
if (!fs.existsSync(backupFilePath)) {
  console.error(`❌ Backup file not found: ${backupFilePath}`);
  process.exit(1);
}

console.log('Starting database restore...');
console.log(`📁 Backup file: ${backupFilePath}`);

try {
  // Check if the container is running
  console.log('Checking if PostgreSQL container is running...');
  
  // Use Windows-compatible command if on Windows
  if (config.isWindows) {
    const checkCommand = `docker ps | findstr ${config.containerName}`;
    execSync(checkCommand, { stdio: 'inherit' });
  } else {
    const checkCommand = `docker ps | grep ${config.containerName}`;
    execSync(checkCommand, { stdio: 'inherit' });
  }
  
  // Determine if the backup is compressed
  const isCompressed = backupFilePath.endsWith('.gz');
  const isZipped = backupFilePath.endsWith('.zip');
  
  if (isCompressed) {
    console.log('📦 Restoring from compressed backup...');
    const command = `gunzip -c "${backupFilePath}" | docker exec -i ${config.containerName} psql -U ${config.username} -d ${config.databaseName}`;
    execSync(command, { stdio: 'inherit' });
  } else if (isZipped && config.isWindows) {
    console.log('📦 Restoring from ZIP backup (Windows)...');
    // Create temp directory for extraction
    const tempDir = path.join(config.backupDir, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Extract the ZIP file
    const extractCommand = `powershell -Command "Expand-Archive -Path '${backupFilePath}' -DestinationPath '${tempDir}' -Force"`;
    execSync(extractCommand, { stdio: 'inherit' });
    
    // Find the SQL file in the temp directory
    const sqlFiles = fs.readdirSync(tempDir).filter(file => file.endsWith('.sql'));
    if (sqlFiles.length === 0) {
      throw new Error('No SQL file found in the ZIP archive');
    }
    
    const sqlFilePath = path.join(tempDir, sqlFiles[0]);
    
    // Restore from the extracted SQL file
    const restoreCommand = `type "${sqlFilePath}" | docker exec -i ${config.containerName} psql -U ${config.username} -d ${config.databaseName}`;
    execSync(restoreCommand, { stdio: 'inherit' });
    
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  } else {
    console.log('📄 Restoring from SQL backup...');
    const command = config.isWindows
      ? `type "${backupFilePath}" | docker exec -i ${config.containerName} psql -U ${config.username} -d ${config.databaseName}`
      : `docker exec -i ${config.containerName} psql -U ${config.username} -d ${config.databaseName} < "${backupFilePath}"`;
    execSync(command, { stdio: 'inherit' });
  }
  
  console.log('✅ Database restored successfully!');
  
  // Verify the restore
  console.log('Verifying database restore...');
  const verifyCommand = `docker exec ${config.containerName} psql -U ${config.username} -d ${config.databaseName} -c "SELECT COUNT(*) FROM \"_prisma_migrations\";"`;
  const result = execSync(verifyCommand, { encoding: 'utf8' });
  console.log(`📊 Prisma migrations count: ${result.trim()}`);
  
  console.log('\n🎉 Restore process completed successfully!');
  
} catch (error) {
  console.error('❌ Restore failed:', error.message);
  
  // Provide troubleshooting tips
  console.log('\nTroubleshooting tips:');
  console.log('1. Ensure the PostgreSQL container is running');
  console.log('2. Check that the database name is correct');
  console.log('3. Verify the backup file is not corrupted');
  console.log('4. Make sure you have sufficient disk space');
  
  process.exit(1);
}