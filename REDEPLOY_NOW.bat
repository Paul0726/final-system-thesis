@echo off
echo ========================================
echo   RAILWAY REDEPLOY - SIMPLE VERSION
echo ========================================
echo.

cd /d "%~dp0"

echo [1] Creating deployment trigger...
echo %date% %time% > DEPLOY_NOW.txt
git add DEPLOY_NOW.txt

echo.
echo [2] Committing changes...
git commit -m "Redeploy: UI updates - %date% %time%"
if errorlevel 1 (
    echo Creating empty commit...
    git commit --allow-empty -m "Redeploy trigger - %date% %time%"
)

echo.
echo [3] Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   DONE! Check Railway dashboard now.
echo ========================================
echo.
pause

