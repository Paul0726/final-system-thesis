@echo off
echo ========================================
echo   DEPLOYING ALL FIXES
echo ========================================
echo.

echo Step 1: Adding all files...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "Fix: Alumni indicator, date format, survey options, mobile responsive, UI improvements"

echo.
echo Step 3: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   DEPLOYMENT INITIATED!
echo ========================================
echo.
echo Railway will automatically deploy your changes.
echo Check your Railway dashboard for deployment status.
echo.
pause

