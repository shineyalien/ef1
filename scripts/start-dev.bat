@echo off
REM Easy Filer - Quick Start Script for Windows
echo 🚀 Starting Easy Filer Development Environment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 20+ and try again.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Install dependencies if not already installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Start Docker services
echo 🐳 Starting Docker services PostgreSQL, Redis, MinIO...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Generate Prisma client if needed
echo 🔧 Setting up database...
cd packages\database
if not exist "src\generated" (
    npm run generate
)

REM Push database schema
npm run push

cd ..\..

REM Start development server
echo 🌟 Starting development server...
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔧 pgAdmin will be available at: http://localhost:5050 admin@easyfiler.com / admin
echo 💾 Redis Commander will be available at: http://localhost:8081
echo 📁 MinIO Console will be available at: http://localhost:9001 minioadmin / minioadmin

cd apps\web
npm run dev