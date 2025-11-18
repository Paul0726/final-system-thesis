@echo off
echo ========================================
echo   FORCE DEPLOY TO RAILWAY
echo ========================================
echo.
echo This will create an empty commit to
echo force Railway to redeploy!
echo.

cd /d "%~dp0"

echo [1/4] Checking current status...
git status
echo.

echo [2/4] Creating empty commit to trigger deployment...
git commit --allow-empty -m "Force deploy: Trigger Railway redeployment - %date% %time%"
if errorlevel 1 (
    echo [ERROR] Failed to create commit
    pause
    exit /b 1
)
echo [OK] Empty commit created!
echo.

echo [3/4] Pushing to GitHub...
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
echo [OK] Pushed to GitHub!
echo.

echo [4/4] Verifying push...
git log --oneline -1
echo.

echo ========================================
echo   SUCCESS! Force deployment triggered!
echo ========================================
echo.
echo Railway should now start deploying!
echo.
echo Next steps:
echo 1. Go to: https://railway.app
echo 2. Click your project
echo 3. Check the "Deployments" tab
echo 4. You should see a NEW deployment starting
echo 5. Wait 2-5 minutes for it to complete
echo.
echo If deployment still doesn't start:
echo - Check Railway project settings
echo - Verify GitHub webhook is connected
echo - Try manual redeploy from Railway dashboard
echo.
pause

