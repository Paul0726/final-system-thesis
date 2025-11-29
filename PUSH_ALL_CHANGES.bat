@echo off
echo ========================================
echo   PUSHING ALL CHANGES TO GITHUB
echo ========================================
echo.

cd /d "%~dp0"

echo [1] Checking for uncommitted changes...
git status --short
echo.

echo [2] Adding ALL changes...
git add -A
echo.

echo [3] Creating commit...
git commit -m "PUSH ALL: Complete UI refactoring - %date% %time%"
if errorlevel 1 (
    echo No changes to commit, creating empty commit...
    git commit --allow-empty -m "Force deploy: UI changes - %date% %time%"
)
echo.

echo [4] Pushing to GitHub (main branch)...
git push origin main
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to push!
    echo.
    echo Possible issues:
    echo - No internet connection
    echo - Git credentials not set
    echo - Remote repository changed
    echo.
    pause
    exit /b 1
)
echo.

echo [5] Verifying push...
git log --oneline -1
echo.

echo ========================================
echo   SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Next steps:
echo 1. Go to Railway dashboard
echo 2. Check if new deployment started
echo 3. Wait 2-5 minutes for build
echo 4. Hard refresh browser (Ctrl + Shift + R)
echo.
pause

