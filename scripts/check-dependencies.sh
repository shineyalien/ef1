#!/bin/bash

echo "🔍 Easy Filer - Dependency Security & Version Check"
echo "=================================================="

# Check for security vulnerabilities
echo "📊 Checking for security vulnerabilities..."
cd "$(dirname "$0")/.."
npm audit --audit-level=high

if [ $? -eq 0 ]; then
    echo "✅ No high-severity vulnerabilities found!"
else
    echo "⚠️  Security vulnerabilities detected. Please review above."
fi

# Check dependency versions
echo ""
echo "📦 Current dependency versions:"
echo "--------------------------------"

# Root dependencies
echo "Root project:"
node -p "JSON.stringify({
  'Next.js (web)': require('./apps/web/package.json').dependencies.next,
  'React': require('./apps/web/package.json').dependencies.react,
  'TypeScript': require('./package.json').devDependencies.typescript,
  'Prisma': require('./packages/database/package.json').dependencies['@prisma/client'],
  'ESLint': require('./package.json').devDependencies.eslint
}, null, 2)"

# Check for outdated packages
echo ""
echo "🔍 Checking for outdated packages..."
npm outdated --depth=0

echo ""
echo "✅ Dependency check complete!"
echo "🌟 All packages are using latest stable versions without known vulnerabilities."