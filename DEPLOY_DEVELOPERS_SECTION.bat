@echo off
echo ========================================
echo   DEPLOYING DEVELOPERS SECTION
echo ========================================
echo.

echo Step 1: Adding all files...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "Add developers section to landing page with all team members"

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
echo The developers section has been added to the landing page!
echo.
pause

