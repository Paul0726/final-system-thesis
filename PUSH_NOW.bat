@echo off
echo ========================================
echo   PUSHING CSS FIX TO GITHUB
echo ========================================
echo.

cd /d "C:\final system thesis"

echo Checking file...
findstr /C:":root" client\src\index.css >nul
if %errorlevel% == 0 (
    echo ERROR: :root still exists!
    pause
    exit /b 1
)

echo File is correct - no :root block
echo.

echo Adding file...
git add client/src/index.css
if errorlevel 1 (
    echo ERROR: Failed to add
    pause
    exit /b 1
)

echo Committing...
git commit -m "FIX: Remove :root block - fix build"
if errorlevel 1 (
    echo Creating empty commit...
    git commit --allow-empty -m "FORCE: Trigger deploy"
)

echo Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo Check your GitHub credentials
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Pushed to GitHub
echo ========================================
echo.
echo Railway should now deploy automatically.
echo Check Railway dashboard in 1-2 minutes.
echo.
pause

