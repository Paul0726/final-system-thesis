@echo off
echo ========================================
echo   CHECKING IF CHANGES ARE IN COMMIT
echo ========================================
echo.

cd /d "%~dp0"

echo [1] Latest commit:
git log --oneline -1
echo.

echo [2] Checking if index.css has modern refactor:
git show HEAD:client/src/index.css | findstr /i "MODERN UI SYSTEM"
if errorlevel 1 (
    echo [WARNING] Modern UI changes NOT found in latest commit!
    echo.
    echo Need to commit and push changes first.
) else (
    echo [OK] Modern UI changes found in commit!
)
echo.

echo [3] Checking if LandingPage.css is updated:
git show HEAD:client/src/pages/LandingPage.css | findstr /i "Modern & Responsive"
if errorlevel 1 (
    echo [WARNING] LandingPage.css changes NOT found!
) else (
    echo [OK] LandingPage.css is updated!
)
echo.

echo [4] Files changed in latest commit:
git show --name-only --pretty=format: HEAD | findstr /i "\.css"
echo.

echo ========================================
echo   SUMMARY
echo ========================================
echo.
echo If changes are NOT in commit:
echo 1. Run: DEPLOY_UI_CHANGES.bat
echo 2. Wait for Railway to redeploy
echo 3. Hard refresh browser (Ctrl + Shift + R)
echo.
pause

