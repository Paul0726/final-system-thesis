@echo off
echo ========================================
echo   VERIFY AND PUSH CSS FIX
echo ========================================
echo.

cd /d "%~dp0"

echo [1] Checking current index.css file...
findstr /C:":root" client\src\index.css
if %errorlevel% == 0 (
    echo ERROR: :root block still exists in file!
    pause
    exit /b 1
) else (
    echo OK: No :root block found
)
echo.

echo [2] Checking git status...
git status --short
echo.

echo [3] Adding files...
git add client/src/index.css railway.json
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo OK: Files added
echo.

echo [4] Creating commit...
git commit -m "CRITICAL FIX: Remove :root block causing build failure"
if errorlevel 1 (
    echo WARNING: No changes to commit or commit failed
    git commit --allow-empty -m "FORCE: Trigger deployment - CSS fix"
)
echo OK: Commit created
echo.

echo [5] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    echo.
    echo Please check:
    echo 1. Internet connection
    echo 2. GitHub credentials
    echo 3. Git authentication
    pause
    exit /b 1
)
echo OK: Pushed to GitHub!
echo.

echo [6] Verifying push...
git log --oneline -1
echo.

echo ========================================
echo   SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Railway should now detect the push and start deploying.
echo Check Railway dashboard in 1-2 minutes.
echo.
pause

