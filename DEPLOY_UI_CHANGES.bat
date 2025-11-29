@echo off
echo ========================================
echo   DEPLOYING UI CHANGES TO RAILWAY
echo ========================================
echo.

cd /d "%~dp0"

echo [STEP 1/5] Checking git status...
git status
echo.

echo [STEP 2/5] Adding ALL files (including CSS)...
git add -A
echo Files added!
echo.

echo [STEP 3/5] Creating commit with all UI changes...
git commit -m "DEPLOY: Complete UI refactoring - Modern responsive design - %date% %time%"
if errorlevel 1 (
    echo No new changes, creating empty commit to force deploy...
    git commit --allow-empty -m "FORCE DEPLOY: UI refactoring - %date% %time%"
)
echo Commit created!
echo.

echo [STEP 4/5] Pushing to GitHub (main branch)...
git push origin main
if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERROR: Failed to push!
    echo ========================================
    echo.
    echo Please check:
    echo 1. Internet connection
    echo 2. Git credentials
    echo 3. GitHub access
    echo.
    pause
    exit /b 1
)
echo Push successful!
echo.

echo [STEP 5/5] Creating version file to force rebuild...
echo UI_VERSION=%date% %time% > UI_VERSION.txt
git add UI_VERSION.txt
git commit -m "Version bump: Force Railway rebuild"
git push origin main
echo.

echo ========================================
echo   SUCCESS! ALL CHANGES PUSHED
echo ========================================
echo.
echo What to do next:
echo.
echo 1. Go to Railway dashboard:
echo    https://railway.app
echo.
echo 2. Check Deployments tab:
echo    - Should see NEW deployment starting
echo    - Wait 2-5 minutes for build
echo.
echo 3. After deployment completes:
echo    - Hard refresh browser: Ctrl + Shift + R
echo    - Or clear cache: Ctrl + Shift + Delete
echo    - Or try incognito window
echo.
echo 4. If still no changes:
echo    - Check Railway build logs for errors
echo    - Verify branch is "main"
echo    - Try manual redeploy in Railway
echo.
pause

