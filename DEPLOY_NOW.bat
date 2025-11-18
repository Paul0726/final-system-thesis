@echo off
echo ========================================
echo   DEPLOY TO RAILWAY - EXACT COMMANDS
echo ========================================
echo.

cd /d "C:\final system thesis"

echo [STEP 1] Adding all changes...
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] Files added!
echo.

echo [STEP 2] Committing changes...
git commit -m "Deploy: Latest system updates - %date% %time%"
if errorlevel 1 (
    echo [WARNING] No changes, creating empty commit...
    git commit --allow-empty -m "Force deploy: Trigger Railway - %date% %time%"
    if errorlevel 1 (
        echo [ERROR] Failed to create commit
        pause
        exit /b 1
    )
)
echo [OK] Commit created!
echo.

echo [STEP 3] Pushing to GitHub...
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

echo [STEP 4] Verifying...
git log --oneline -1
echo.

echo ========================================
echo   SUCCESS! Deployment triggered!
echo ========================================
echo.
echo Next steps:
echo 1. Go to: https://railway.app
echo 2. Click your project
echo 3. Check "Deployments" tab
echo 4. Wait 2-5 minutes for deployment
echo.
pause
