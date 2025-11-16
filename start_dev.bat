@echo off
echo ========================================
echo   STARTING DEVELOPMENT SERVER
echo   (Live Editing Mode)
echo ========================================
echo.
echo This will start both frontend and backend
echo with hot reload enabled.
echo.
echo Frontend: http://localhost:3001
echo Backend:  http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
pause

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    cd ..
    echo.
)

echo Starting development server...
echo.
call npm run dev




