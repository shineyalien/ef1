#!/usr/bin/env pwsh

# Easy Filer - Invoice Creation System Test Script
# Date: October 4, 2025
# Purpose: Verify all components of the invoice creation system

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Easy Filer - Invoice Creation System Tests" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$testsPassed = 0
$testsFailed = 0

# Test 1: Check if invoice creation page exists
Write-Host "[TEST 1] Checking invoice creation page..." -ForegroundColor Yellow
$invoicePagePath = "C:\Work\Vibe Coding Apss\Easy Filer\apps\web\src\app\invoices\create\page.tsx"
if (Test-Path $invoicePagePath) {
    Write-Host "✅ Invoice creation page exists" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ Invoice creation page NOT found" -ForegroundColor Red
    $testsFailed++
}

# Test 2: Check if FBR lookup API exists
Write-Host "[TEST 2] Checking FBR lookup API..." -ForegroundColor Yellow
$fbrLookupPath = "C:\Work\Vibe Coding Apss\Easy Filer\apps\web\src\app\api\fbr\lookup\route.ts"
if (Test-Path $fbrLookupPath) {
    Write-Host "✅ FBR lookup API exists" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ FBR lookup API NOT found" -ForegroundColor Red
    $testsFailed++
}

# Test 3: Check if invoice submission API exists
Write-Host "[TEST 3] Checking invoice submission API..." -ForegroundColor Yellow
$invoiceSubmitPath = "C:\Work\Vibe Coding Apss\Easy Filer\apps\web\src\app\api\invoices\[id]\submit\route.ts"
if (Test-Path $invoiceSubmitPath) {
    Write-Host "✅ Invoice submission API exists" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ Invoice submission API NOT found" -ForegroundColor Red
    $testsFailed++
}

# Test 4: Check if customers API exists
Write-Host "[TEST 4] Checking customers API..." -ForegroundColor Yellow
$customersApiPath = "C:\Work\Vibe Coding Apss\Easy Filer\apps\web\src\app\api\customers\route.ts"
if (Test-Path $customersApiPath) {
    Write-Host "✅ Customers API exists" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ Customers API NOT found" -ForegroundColor Red
    $testsFailed++
}

# Test 5: Check if products API exists
Write-Host "[TEST 5] Checking products API..." -ForegroundColor Yellow
$productsApiPath = "C:\Work\Vibe Coding Apss\Easy Filer\apps\web\src\app\api\products\route.ts"
if (Test-Path $productsApiPath) {
    Write-Host "✅ Products API exists" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ Products API NOT found" -ForegroundColor Red
    $testsFailed++
}

# Test 6: Check TypeScript compilation
Write-Host "[TEST 6] Checking TypeScript compilation..." -ForegroundColor Yellow
Push-Location "C:\Work\Vibe Coding Apss\Easy Filer\apps\web"
$tscOutput = npx tsc --noEmit 2>&1
Pop-Location

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript compilation successful (no errors)" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ TypeScript compilation has errors" -ForegroundColor Red
    Write-Host $tscOutput -ForegroundColor Gray
    $testsFailed++
}

# Test 7: Check for critical data chaining function
Write-Host "[TEST 7] Checking for HS Code → UOM data chaining..." -ForegroundColor Yellow
$invoicePageContent = Get-Content $invoicePagePath -Raw
if ($invoicePageContent -match "fetchUOMsForHSCode") {
    Write-Host "✅ HS Code → UOM chaining function found" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ HS Code → UOM chaining function NOT found" -ForegroundColor Red
    $testsFailed++
}

# Test 8: Check for POST endpoint in FBR lookup
Write-Host "[TEST 8] Checking FBR lookup POST endpoint..." -ForegroundColor Yellow
$fbrLookupContent = Get-Content $fbrLookupPath -Raw
if ($fbrLookupContent -match "type === 'hsUom'") {
    Write-Host "✅ FBR lookup POST endpoint with hsUom support found" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ FBR lookup POST endpoint with hsUom NOT found" -ForegroundColor Red
    $testsFailed++
}

# Test 9: Check environment configuration
Write-Host "[TEST 9] Checking environment configuration..." -ForegroundColor Yellow
$envPath = "C:\Work\Vibe Coding Apss\Easy Filer\apps\web\.env.local"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match "FBR_API_BASE_URL") {
        Write-Host "✅ FBR API base URL configured" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "⚠️  FBR API base URL not configured (optional)" -ForegroundColor Yellow
        $testsPassed++
    }
} else {
    Write-Host "⚠️  .env.local not found (will use defaults)" -ForegroundColor Yellow
    $testsPassed++
}

# Test 10: Check implementation summary
Write-Host "[TEST 10] Checking implementation documentation..." -ForegroundColor Yellow
$summaryPath = "C:\Work\Vibe Coding Apss\Easy Filer\IMPLEMENTATION_SUMMARY.md"
if (Test-Path $summaryPath) {
    Write-Host "✅ Implementation summary exists" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ Implementation summary NOT found" -ForegroundColor Red
    $testsFailed++
}

# Summary
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED! System is ready for testing." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Start development server: npm run dev" -ForegroundColor White
    Write-Host "2. Navigate to: http://localhost:3000/invoices/create" -ForegroundColor White
    Write-Host "3. Test HS Code → UOM data chaining feature" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "⚠️  Some tests failed. Please review errors above." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
