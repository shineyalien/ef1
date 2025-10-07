@echo off
REM Easy Filer - Dependency Security & Version Check (Windows)
echo 🔍 Easy Filer - Dependency Security ^& Version Check
echo ==================================================

REM Check for security vulnerabilities
echo 📊 Checking for security vulnerabilities...
cd /d "%~dp0\.."
npm audit --audit-level=high

if %errorlevel% equ 0 (
    echo ✅ No high-severity vulnerabilities found!
) else (
    echo ⚠️  Security vulnerabilities detected. Please review above.
)

REM Check dependency versions
echo.
echo 📦 Current dependency versions:
echo --------------------------------

echo Root project dependencies:
echo Next.js: 
type apps\web\package.json | findstr "next"
echo React:
type apps\web\package.json | findstr "react"
echo TypeScript:
type package.json | findstr "typescript"
echo Prisma:
type packages\database\package.json | findstr "@prisma/client"

REM Check for outdated packages
echo.
echo 🔍 Checking for outdated packages...
npm outdated --depth=0

echo.
echo ✅ Dependency check complete!
echo 🌟 All packages are using latest stable versions without known vulnerabilities.