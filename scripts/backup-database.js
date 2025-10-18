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
  timestamp: new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19),
  isWindows: os.platform() === 'win32'
};

console.log('Starting database backup...');

// Create backups directory if it doesn't exist
if (!fs.existsSync(config.backupDir)) {
  fs.mkdirSync(config.backupDir, { recursive: true });
  console.log(`Created backups directory: ${config.backupDir}`);
}

// Generate backup filename
const backupFileName = `easyfiler-backup-${config.timestamp}.sql`;
const backupFilePath = path.join(config.backupDir, backupFileName);

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
  
  // Create the backup
  console.log(`Creating backup: ${backupFileName}`);
  const command = `docker exec ${config.containerName} pg_dump -U ${config.username} -d ${config.databaseName} > "${backupFilePath}"`;
  execSync(command, { stdio: 'inherit' });
  
  // Verify backup was created
  const stats = fs.statSync(backupFilePath);
  console.log(`✅ Backup created successfully!`);
  console.log(`📁 Location: ${backupFilePath}`);
  console.log(`📊 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  
  // Create a compressed version
  console.log('Creating compressed backup...');
  const compressedFileName = `${backupFileName}.gz`;
  const compressedFilePath = path.join(config.backupDir, compressedFileName);
  
  // Use Windows-compatible compression if on Windows
  if (config.isWindows) {
    // On Windows, we need to use a different approach for compression
    execSync(`powershell -Command "Compress-Archive -Path '${backupFilePath}' -DestinationPath '${compressedFilePath.replace('.gz', '.zip')}' -Force"`, { stdio: 'inherit' });
    // Update the compressed file path to match the zip extension
    const zipFilePath = `${compressedFilePath.replace('.gz', '.zip')}`;
    const compressedStats = fs.statSync(zipFilePath);
    console.log(`✅ Compressed backup created!`);
    console.log(`📁 Location: ${zipFilePath}`);
    console.log(`📊 Size: ${(compressedStats.size / 1024 / 1024).toFixed(2)} MB`);
  } else {
    execSync(`gzip -c "${backupFilePath}" > "${compressedFilePath}"`, { stdio: 'inherit' });
    const compressedStats = fs.statSync(compressedFilePath);
    console.log(`✅ Compressed backup created!`);
    console.log(`📁 Location: ${compressedFilePath}`);
    console.log(`📊 Size: ${(compressedStats.size / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // Clean up old backups (keep last 5)
  console.log('Cleaning up old backups...');
  const files = fs.readdirSync(config.backupDir)
    .filter(file => file.startsWith('easyfiler-backup-') && (file.endsWith('.sql.gz') || file.endsWith('.zip')))
    .sort()
    .reverse();
  
  if (files.length > 5) {
    const filesToDelete = files.slice(5);
    filesToDelete.forEach(file => {
      const filePath = path.join(config.backupDir, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted old backup: ${file}`);
    });
  }
  
  console.log('\n🎉 Backup process completed successfully!');
  console.log('\nTo restore this backup on another machine:');
  console.log('1. Copy the backup file to the new machine');
  console.log('2. Start the PostgreSQL container');
  
  if (config.isWindows) {
    console.log(`3. Run: powershell -Command "Expand-Archive -Path '${compressedFileName.replace('.gz', '.zip')}' -DestinationPath './temp' -Force" && type "./temp/${backupFileName}" | docker exec -i ${config.containerName} psql -U ${config.username} -d ${config.databaseName}"`);
  } else {
    console.log(`3. Run: gunzip -c "${compressedFileName}" | docker exec -i ${config.containerName} psql -U ${config.username} -d ${config.databaseName}"`);
  }
  
} catch (error) {
  console.error('❌ Backup failed:', error.message);
  process.exit(1);
}