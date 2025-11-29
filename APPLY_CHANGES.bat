@echo off
echo ========================================
echo   APPLYING BEHANCE UI CHANGES
echo ========================================
echo.

cd /d "%~dp0"

echo [1] Adding all changes...
git add -A
echo.

echo [2] Committing changes...
git commit -m "Behance UI redesign: Modern clean design - %date% %time%"
if errorlevel 1 (
    echo Creating empty commit...
    git commit --allow-empty -m "Force deploy: Behance UI - %date% %time%"
)
echo.

echo [3] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to push!
    pause
    exit /b 1
)
echo.

echo ========================================
echo   SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Railway will auto-deploy in 2-5 minutes.
echo.
pause

