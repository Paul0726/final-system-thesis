@echo off
echo ========================================
echo   DEPLOYING TO RAILWAY
echo ========================================
echo.

echo Step 1: Adding all files...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "Add new features: Alumni popup, Gmail OTP login, Ratings & Feedback, Enhanced Admin page"

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
