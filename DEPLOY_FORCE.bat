@echo off
cls
echo ========================================
echo   FORCE DEPLOY TO RAILWAY
echo ========================================
echo.
echo This will FORCE a new deployment!
echo.

cd /d "C:\final system thesis"

echo [1/5] Checking git status...
git status
echo.

echo [2/5] Adding ALL changes...
git add -A
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] All files added!
echo.

echo [3/5] Creating commit with timestamp...
set TIMESTAMP=%date% %time%
git commit -m "FORCE DEPLOY: System update - %TIMESTAMP%"
if errorlevel 1 (
    echo [WARNING] No changes, creating empty commit...
    git commit --allow-empty -m "FORCE DEPLOY: Empty commit to trigger Railway - %TIMESTAMP%"
    if errorlevel 1 (
        echo [ERROR] Failed to create commit
        pause
        exit /b 1
    )
)
echo [OK] Commit created!
echo.

echo [4/5] Pushing to GitHub (this will trigger Railway)...
git push origin main
if errorlevel 1 (
    echo [ERROR] Failed to push to GitHub
    echo.
    echo Please check:
    echo 1. Internet connection
    echo 2. GitHub credentials
    echo 3. Git remote URL
    echo.
    pause
    exit /b 1
)
echo [OK] Pushed to GitHub successfully!
echo.

echo [5/5] Verifying push...
git log --oneline -1
echo.

echo ========================================
echo   SUCCESS! Deployment triggered!
echo ========================================
echo.
echo Latest commit: 
git log --oneline -1
echo.
echo Next steps:
echo 1. Go to: https://railway.app
echo 2. Click your project
echo 3. Check "Deployments" tab
echo 4. Look for the commit message above
echo 5. Wait 2-5 minutes for deployment
echo.
echo If you don't see a new deployment:
echo - Check Railway Settings ^> Source
echo - Verify GitHub connection
echo - Try manual redeploy in Railway dashboard
echo.
pause

