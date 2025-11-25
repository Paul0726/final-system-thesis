@echo off
echo ========================================
echo   RESTART DEVELOPMENT SERVER
echo ========================================
echo.
echo This will start the development server
echo for live editing.
echo.
echo Frontend: http://localhost:3001
echo Backend:  http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
pause

cd /d "%~dp0"

echo Starting development server...
echo.
call npm run dev












