@echo off
echo ========================================
echo   FIX: WALANG NAGBAGO SA DEPLOYMENT
echo ========================================
echo.

cd /d "%~dp0"

echo [STEP 1] Verifying changes are committed...
git status
echo.

echo [STEP 2] Checking if changes are pushed...
git log --oneline -3
echo.

echo [STEP 3] Creating cache-busting commit...
echo %date% %time% > CACHE_BUST.txt
git add CACHE_BUST.txt
git commit -m "CACHE BUST: Force fresh build - %date% %time%"

echo.
echo [STEP 4] Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   IMPORTANT: AFTER RAILWAY DEPLOYS
echo ========================================
echo.
echo 1. HARD REFRESH BROWSER:
echo    - Press: Ctrl + Shift + R (Windows)
echo    - Or: Cmd + Shift + R (Mac)
echo.
echo 2. CLEAR BROWSER CACHE:
echo    - Chrome: Ctrl + Shift + Delete
echo    - Select "Cached images and files"
echo    - Click "Clear data"
echo.
echo 3. CHECK RAILWAY BUILD LOGS:
echo    - Go to Railway dashboard
echo    - Click latest deployment
echo    - Check build logs for errors
echo    - Make sure build completed successfully
echo.
echo 4. TRY INCOGNITO/PRIVATE WINDOW:
echo    - Open new incognito window
echo    - Visit your site
echo    - This bypasses cache
echo.
echo 5. CHECK RAILWAY SETTINGS:
echo    - Make sure deploying from: main branch
echo    - Make sure build command is correct
echo    - Check if build is using cache
echo.
pause

