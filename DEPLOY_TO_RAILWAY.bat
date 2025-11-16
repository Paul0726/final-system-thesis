@echo off
echo ========================================
echo   DEPLOY TO RAILWAY - PUSH CHANGES
echo ========================================
echo.
echo This will commit and push all changes
echo to GitHub, then Railway will auto-deploy!
echo.
pause

cd /d "%~dp0"

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed or not in PATH!
    echo.
    echo Please run this in Command Prompt (not PowerShell)
    echo Or make sure Git is installed and in your PATH
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking git status...
git status
echo.

echo [2/4] Adding all changes...
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] Files added!
echo.

echo [3/4] Committing changes...
git commit -m "Update: Enhanced UI with modern design, CRUD operations, search/filter, and statistics dashboard"
if errorlevel 1 (
    echo [WARNING] No changes to commit or commit failed
    echo.
)
echo.

echo [4/4] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo [ERROR] Failed to push to GitHub
    echo.
    echo Please check:
    echo 1. Internet connection
    echo 2. GitHub credentials
    echo 3. Remote repository URL
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
echo Next steps:
echo 1. Go to: https://railway.app
echo 2. Click your project
echo 3. Check the "Deployments" tab
echo 4. Wait for deployment to complete (2-5 minutes)
echo 5. Visit your website URL to see the changes!
echo.
echo Your website will be updated automatically!
echo.
pause




