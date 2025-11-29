@echo off
echo ========================================
echo   COMMITTING AND PUSHING ALL CHANGES
echo ========================================
echo.

cd /d "C:\final system thesis"

echo [1/5] Checking git status...
git status --short
echo.

echo [2/5] Staging all CSS files and changes...
git add client/src/index.css
git add client/src/pages/*.css
git add .railway-trigger
git add railway.json
if errorlevel 1 (
    echo ERROR: Failed to stage files
    pause
    exit /b 1
)
echo OK: Files staged
echo.

echo [3/5] Checking staged files...
git status --short
echo.

echo [4/5] Creating commit...
git commit -m "FIX: Remove mobile styles and broken :root block - PC only layout"
if errorlevel 1 (
    echo WARNING: Commit failed or no changes
    git status
    pause
    exit /b 1
)
echo OK: Commit created
echo.

echo [5/5] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ERROR: Failed to push to GitHub!
    echo.
    echo Possible issues:
    echo 1. Internet connection
    echo 2. GitHub authentication required
    echo 3. Permission issues
    echo.
    pause
    exit /b 1
)
echo OK: Pushed to GitHub!
echo.

echo [VERIFY] Checking latest commit...
git log --oneline -1
echo.

echo ========================================
echo   SUCCESS! All changes pushed!
echo ========================================
echo.
echo Railway should now detect the push and start deploying.
echo Check Railway dashboard in 1-2 minutes.
echo.
echo Next steps:
echo 1. Go to: https://railway.app
echo 2. Check your project
echo 3. Look for new deployment in "Deployments" tab
echo.
pause

