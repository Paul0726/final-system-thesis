@echo off
echo ========================================
echo   QUICK UPDATE - PUSH TO GITHUB
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed!
    pause
    exit /b 1
)

REM Change to project directory
cd /d "%~dp0"

echo [1/4] Adding all changes...
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] Files added!
echo.

echo [2/4] Enter commit message:
set /p commit_msg="Commit message: "

if "%commit_msg%"=="" (
    set commit_msg=Update: Quick changes
)

echo.
echo [3/4] Committing changes...
git commit -m "%commit_msg%"
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
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Railway will automatically redeploy your app!
echo Check your Railway dashboard for deployment status.
echo.
pause








