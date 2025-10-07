#!/bin/bash

# Easy Filer - Quick Start Script
echo "🚀 Starting Easy Filer Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL, Redis, MinIO)..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Generate Prisma client if needed
echo "🔧 Setting up database..."
cd packages/database
if [ ! -d "src/generated" ]; then
    npm run generate
fi

# Push database schema
npm run push

cd ../..

# Start development server
echo "🌟 Starting development server..."
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 pgAdmin will be available at: http://localhost:5050 (admin@easyfiler.com / admin)"
echo "💾 Redis Commander will be available at: http://localhost:8081"
echo "📁 MinIO Console will be available at: http://localhost:9001 (minioadmin / minioadmin)"

cd apps/web
npm run dev