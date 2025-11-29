@echo off
echo ========================================
echo   DEPLOYING MODERN DESIGN CHANGES
echo ========================================
echo.

cd /d "C:\final system thesis"

echo [1/4] Checking git status...
git status --short
echo.

echo [2/4] Staging all changes...
git add -A
if errorlevel 1 (
    echo ERROR: Failed to stage files
    pause
    exit /b 1
)
echo OK: Files staged
echo.

echo [3/4] Creating commit...
git commit -m "Modernize UI: Enhanced design with glassmorphism and modern effects"
if errorlevel 1 (
    echo No changes to commit, creating empty commit...
    git commit --allow-empty -m "Force deploy: Modern design updates"
    if errorlevel 1 (
        echo ERROR: Failed to create commit
        pause
        exit /b 1
    )
)
echo OK: Commit created
echo.

echo [4/4] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ERROR: Failed to push to GitHub!
    echo.
    echo Please check:
    echo 1. Internet connection
    echo 2. GitHub credentials
    echo 3. Git authentication
    echo.
    pause
    exit /b 1
)
echo OK: Pushed to GitHub!
echo.

echo [VERIFY] Latest commit...
git log --oneline -1
echo.

echo ========================================
echo   SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Railway should now start deploying automatically.
echo Check Railway dashboard in 1-2 minutes.
echo.
echo If deployment doesn't start:
echo 1. Go to: https://railway.app
echo 2. Click your project
echo 3. Go to "Deployments" tab
echo 4. Click "Redeploy" button manually
echo.
pause

