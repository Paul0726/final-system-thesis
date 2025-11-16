@echo off
echo ========================================
echo   QUICK START - BSIT TRACER GRADUATE
echo ========================================
echo.
echo This will install dependencies and
echo start the development server.
echo.
pause

cd /d "%~dp0"

echo [1/3] Installing client dependencies...
cd client
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [2/3] Installing root dependencies...
call npm install
if errorlevel 1 (
    echo [WARNING] Some dependencies may not be installed
)

echo.
echo [3/3] Starting development server...
echo.
echo Frontend: http://localhost:3001
echo Backend:  http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
pause

call npm run dev





