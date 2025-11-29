@echo off
echo ========================================
echo   FORCE FRESH DEPLOYMENT
echo   (Clears cache, forces rebuild)
echo ========================================
echo.

cd /d "%~dp0"

echo [1] Adding cache-busting file...
echo %date% %time% > .cache-bust
echo Build timestamp: %date% %time% > BUILD_VERSION.txt
git add .cache-bust BUILD_VERSION.txt

echo.
echo [2] Committing with timestamp...
git commit -m "FORCE FRESH DEPLOY: Clear cache - %date% %time%"

echo.
echo [3] Pushing to GitHub...
git push origin main

echo.
echo [4] Verifying push...
git log --oneline -1
echo.

echo ========================================
echo   DEPLOYMENT TRIGGERED!
echo ========================================
echo.
echo IMPORTANT: After Railway deploys:
echo.
echo 1. Hard refresh your browser:
echo    - Windows: Ctrl + Shift + R
echo    - Mac: Cmd + Shift + R
echo.
echo 2. Or clear browser cache:
echo    - Chrome: Ctrl + Shift + Delete
echo    - Select "Cached images and files"
echo    - Click "Clear data"
echo.
echo 3. Check Railway build logs:
echo    - Make sure build completed successfully
echo    - Check for any CSS errors
echo.
pause

