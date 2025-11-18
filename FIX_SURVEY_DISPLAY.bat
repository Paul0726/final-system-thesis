@echo off
echo ========================================
echo   FIXING SURVEY DISPLAY ISSUE
echo ========================================
echo.
echo Fixed: Field name mismatches in Admin and Dashboard
echo.

cd /d "%~dp0"

echo [1/3] Adding changes...
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] Files added!
echo.

echo [2/3] Committing fix...
git commit -m "Fix: Update Admin and Dashboard to use correct survey field names"
if errorlevel 1 (
    echo [WARNING] No changes to commit
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
echo   SUCCESS! Fix pushed to GitHub
echo ========================================
echo.
echo Railway will automatically redeploy!
echo Check your Railway dashboard for deployment status.
echo.
echo After deployment, survey results should now appear
echo in Dashboard and Admin pages!
echo.
pause







