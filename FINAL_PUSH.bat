@echo off
echo ========================================
echo   FINAL PUSH TO GITHUB
echo ========================================
echo.

cd /d "C:\final system thesis"

echo [1] Committing staged files...
git commit -m "FIX: Remove mobile styles and broken :root block - PC only layout"
if errorlevel 1 (
    echo ERROR: Commit failed!
    git status
    pause
    exit /b 1
)
echo OK: Commit created
echo.

echo [2] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo Check your GitHub credentials
    pause
    exit /b 1
)
echo OK: Pushed to GitHub!
echo.

echo [3] Verifying...
git log --oneline -1
echo.
git status
echo.

echo ========================================
echo   SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Railway should now start deploying automatically.
echo Check Railway dashboard in 1-2 minutes.
echo.
pause

