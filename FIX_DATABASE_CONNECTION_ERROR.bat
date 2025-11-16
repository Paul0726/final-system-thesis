@echo off
echo ========================================
echo   FIX: Database Connection Error
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Adding changes...
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    echo Please run this in Command Prompt (not PowerShell)
    pause
    exit /b 1
)
echo [OK] Files added!
echo.

echo [2/3] Committing changes...
git commit -m "Fix: Add retry mechanism for database connection initialization"
if errorlevel 1 (
    echo [WARNING] No changes to commit or commit failed
    echo.
)
echo.

echo [3/3] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo [ERROR] Failed to push to GitHub
    echo.
    echo Please check:
    echo 1. Internet connection
    echo 2. GitHub credentials
    echo 3. Run this in Command Prompt (not PowerShell)
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Railway will automatically redeploy your app!
echo.
echo What was fixed:
echo - Added retry mechanism for database connection
echo - Added delay to wait for database to be ready
echo - Better error handling
echo.
echo Next steps:
echo 1. Go to: https://railway.app
echo 2. Click your project
echo 3. Check the "Deploy Logs" tab
echo 4. Wait for deployment to complete (2-5 minutes)
echo 5. Check if error is gone!
echo.
echo Note: Database connection will retry automatically
echo if it fails on startup.
echo.
pause





