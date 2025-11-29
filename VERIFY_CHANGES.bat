@echo off
echo ========================================
echo   VERIFYING CHANGES WERE PUSHED
echo ========================================
echo.

cd /d "%~dp0"

echo [1] Checking git status...
git status
echo.

echo [2] Checking recent commits...
git log --oneline -5
echo.

echo [3] Checking if files are tracked...
git ls-files client/src/pages/*.css
echo.

echo [4] Checking remote status...
git remote -v
echo.

echo [5] Checking if local is ahead of remote...
git status -sb
echo.

echo ========================================
echo   IF LOCAL IS AHEAD, RUN:
echo   git push origin main
echo ========================================
echo.
pause

