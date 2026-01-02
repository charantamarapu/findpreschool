@echo off
REM FindPreschool.org - Complete Startup Script for Windows
REM Run this script from the project root directory in Command Prompt

echo.
echo ================================================
echo FindPreschool.org - Complete Setup [Windows]
echo ================================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    exit /b 1
)
echo [OK] Node.js found

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed or not in PATH
    exit /b 1
)
echo [OK] npm found

where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] MySQL is not installed or not in PATH
    exit /b 1
)
echo [OK] MySQL found

echo.
echo ================================================
echo Step 1: Setting up Backend
echo ================================================

cd server

if not exist ".env" (
    echo Creating .env from template...
    copy .env.example .env
    echo [OK] .env created - Please edit with your credentials
    echo.
    echo Edit server\.env and set:
    echo   - DB_PASSWORD: Your MySQL password
    echo   - GOOGLE_MAPS_API_KEY: Your Google Maps API key
    echo.
    echo [ERROR] Please configure .env before continuing
    cd ..
    exit /b 1
)

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install backend dependencies
        cd ..
        exit /b 1
    )
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)

cd ..

echo.
echo ================================================
echo Step 2: Setting up Database
echo ================================================

echo Note: Make sure MySQL is running
echo You may need to enter your MySQL password...

REM Import database schema
mysql -u root -p < database.sql
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to import database schema
    echo Try running manually:
    echo   mysql -u root -p ^< database.sql
    exit /b 1
)
echo [OK] Database schema imported

echo.
echo ================================================
echo Step 3: Setting up Frontend
echo ================================================

cd client

if not exist "index.html" (
    echo [ERROR] index.html not found
    cd ..
    exit /b 1
)

echo Updating Google Maps API key in index.html...
echo Make sure to replace YOUR_GOOGLE_MAPS_API_KEY in index.html

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install frontend dependencies
        cd ..
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

cd ..

echo.
echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo Your FindPreschool.org is ready to run!
echo.
echo To start the application:
echo.
echo Command Prompt 1 - Backend:
echo   cd server
echo   npm run dev
echo   Server will run on: http://localhost:5000
echo.
echo Command Prompt 2 - Frontend:
echo   cd client
echo   npm run dev
echo   Frontend will run on: http://localhost:5173
echo.
echo Then open your browser: http://localhost:5173
echo.
echo ================================================
echo Need help?
echo ================================================
echo - Read: QUICKSTART.md (5-minute setup)
echo - Read: README.md (complete documentation)
echo - Test APIs: API_TESTING_GUIDE.md
echo.
pause
