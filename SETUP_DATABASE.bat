@echo off
echo ========================================
echo   SETUP DATABASE - INSTALL DEPENDENCIES
echo ========================================
echo.
echo This will install PostgreSQL package
echo for database connection.
echo.
pause

cd /d "%~dp0"

echo [1/2] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed!
echo.

echo [2/2] Setup complete!
echo.
echo Next steps:
echo 1. Add PostgreSQL database in Railway dashboard
echo 2. Railway will automatically set DATABASE_URL
echo 3. Commit and push changes:
echo    git add .
echo    git commit -m "Add: PostgreSQL database"
echo    git push origin main
echo 4. Railway will auto-deploy with database!
echo.
echo See DATABASE_SETUP_GUIDE.md for detailed instructions.
echo.
pause





