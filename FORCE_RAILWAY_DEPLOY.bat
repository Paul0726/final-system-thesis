@echo off
echo ========================================
echo   FORCING RAILWAY AUTO-DEPLOYMENT
echo ========================================
echo.

cd /d "%~dp0"

echo [STEP 1] Checking git status...
git status
echo.

echo [STEP 2] Creating deployment trigger file...
echo Deployment triggered at %date% %time% > RAILWAY_DEPLOY_NOW.txt
echo.

echo [STEP 3] Staging all changes...
git add -A
echo.

echo [STEP 4] Creating commit...
git commit -m "FORCE RAILWAY DEPLOY: UI Refactoring Complete - %date% %time%"
if errorlevel 1 (
    echo Creating empty commit instead...
    git commit --allow-empty -m "FORCE RAILWAY DEPLOY: Empty commit trigger - %date% %time%"
)
echo.

echo [STEP 5] Pushing to GitHub (main branch)...
git push origin main
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to push!
    echo Please check your git credentials and connection.
    pause
    exit /b 1
)
echo.

echo [STEP 6] Verifying push...
git log --oneline -1
echo.

echo ========================================
echo   DEPLOYMENT TRIGGERED!
echo ========================================
echo.
echo Railway should now detect the push and start deploying.
echo.
echo IMPORTANT: If Railway still doesn't auto-deploy:
echo.
echo 1. Go to https://railway.app
echo 2. Open your project
echo 3. Go to Settings tab
echo 4. Check "Source" section:
echo    - Repository should be: paul0726/final-system-thesis
echo    - Branch should be: main
echo    - Auto-deploy should be: ENABLED
echo.
echo 5. If auto-deploy is disabled, enable it
echo 6. If webhook is missing, reconnect GitHub
echo.
echo 7. Manual redeploy option:
echo    - Go to Deployments tab
echo    - Click "..." on latest deployment
echo    - Click "Redeploy"
echo.
pause

