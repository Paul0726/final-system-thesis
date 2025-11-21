@echo off
echo ========================================
echo   CHECKING IF GIT IS INSTALLED
echo ========================================
echo.

git --version >nul 2>&1
if errorlevel 1 (
    echo [X] Git is NOT installed!
    echo.
    echo Please install Git first:
    echo.
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download Git for Windows
    echo 3. Run the installer
    echo 4. Follow the installation wizard
    echo 5. Restart your computer
    echo 6. Run this script again
    echo.
    echo For detailed instructions, see: INSTALL_GIT.md
    echo.
    echo Opening download page in browser...
    start https://git-scm.com/download/win
    pause
    exit /b 1
) else (
    echo [OK] Git is installed!
    echo.
    git --version
    echo.
    echo You can now proceed with repository setup!
    echo Run: setup_repo.bat
    echo.
    pause
)










