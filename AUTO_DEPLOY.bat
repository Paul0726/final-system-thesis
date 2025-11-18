@echo off
echo ========================================
echo   AUTO DEPLOY TO RAILWAY
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Adding all changes...
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] Files added!
echo.

echo [2/3] Committing changes...
git commit -m "Auto deploy: System updates and optimizations"
if errorlevel 1 (
    echo [WARNING] No changes to commit or commit failed
    echo.
)
echo.

echo [3/3] Pushing to GitHub (Railway will auto-deploy)...
git push origin main
if errorlevel 1 (
    echo [ERROR] Failed to push to GitHub
    echo.
    echo Please check:
    echo 1. Internet connection
    echo 2. GitHub credentials
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
echo Check Railway dashboard for deployment status.
echo.
pause

