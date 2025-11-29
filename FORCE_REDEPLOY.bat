@echo off
echo ========================================
echo FORCING RAILWAY REDEPLOYMENT
echo ========================================
echo.

echo [1/4] Checking git status...
git status

echo.
echo [2/4] Updating trigger file...
echo %date% %time% > .railway-trigger

echo.
echo [3/4] Staging and committing...
git add .railway-trigger
git commit -m "Trigger Railway redeploy - UI refactoring complete - %date% %time%"

echo.
echo [4/4] Pushing to origin main...
git push origin main

echo.
echo ========================================
echo DEPLOYMENT TRIGGERED!
echo ========================================
echo.
echo Check your Railway dashboard for deployment status.
echo Changes should be live within a few minutes.
echo.
pause

