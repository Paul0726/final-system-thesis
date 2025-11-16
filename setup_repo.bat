@echo off
echo ========================================
echo   THESIS SYSTEM - GIT SETUP SCRIPT
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart this script
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed!
echo.

REM Initialize git repository
echo [1/5] Initializing git repository...
git init
if errorlevel 1 (
    echo [ERROR] Failed to initialize git repository
    pause
    exit /b 1
)
echo [OK] Git repository initialized!
echo.

REM Add all files
echo [2/5] Adding all files...
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] Files added!
echo.

REM Create commit
echo [3/5] Creating commit...
git commit -m "Initial commit: Thesis System"
if errorlevel 1 (
    echo [ERROR] Failed to create commit
    echo Note: If you see "nothing to commit", files are already committed
    pause
    exit /b 1
)
echo [OK] Commit created!
echo.

REM Rename branch to main
echo [4/5] Setting branch to main...
git branch -M main
echo [OK] Branch set to main!
echo.

echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Go to: https://github.com/new
echo 2. Create a new repository (name: final-system-thesis)
echo 3. DO NOT check "Initialize with README"
echo 4. Copy the repository URL
echo 5. Run this command (replace YOUR_USERNAME and REPO_NAME):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
echo    git push -u origin main
echo.
echo For detailed instructions, see: STEP_BY_STEP_GUIDE.md
echo.
pause





