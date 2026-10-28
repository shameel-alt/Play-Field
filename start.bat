@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Play Field - Tournament Operating System

:: Ensure working directory is the script's exact folder
cd /d "%~dp0"

echo ======================================================================
echo           PLAY FIELD - Tournament Management and Live Broadcast Desk
echo ======================================================================
echo Current Directory: "%~dp0"
echo.

:: Detect if running from inside Windows Zip preview without extracting
echo "%~dp0" | findstr /i "AppData\\Local\\Temp" >nul
if not errorlevel 1 goto WarnZip

:: 1. Verify Node.js
where node >nul 2>&1
if errorlevel 1 goto NoNode

:: 2. Verify NPM
where npm >nul 2>&1
if errorlevel 1 goto NoNpm

echo [OK] Node.js is detected.
echo.

:: 3. Check node_modules
if exist "%~dp0node_modules\" goto StartServer

echo [1/2] Installing dependencies for first-time launch...
echo Please wait a minute while packages are installed...
echo.
call npm install
if errorlevel 1 goto InstallFailed

:StartServer
echo.
echo [2/2] Launching Play Field web server...
echo Opening http://localhost:5173/ in your browser...
echo.
start "" "http://localhost:5173/"
call npm run dev
goto Done

:WarnZip
echo [ERROR] You are running start.bat directly from inside the ZIP file!
echo.
echo Windows opens zip files like folders, but applications cannot run from inside them.
echo.
echo HOW TO FIX:
echo  1. Close this window.
echo  2. Right-click the downloaded .zip file.
echo  3. Click "Extract All..." and extract it to your Desktop or Documents.
echo  4. Open the extracted folder and double-click start.bat again.
echo.
goto EndFail

:NoNode
echo [ERROR] Node.js is NOT installed (or not in your PATH) on this PC.
echo.
echo Play Field requires Node.js to run locally.
echo.
echo HOW TO FIX:
echo  1. Download and install Node.js LTS from: https://nodejs.org/
echo  2. After installation completes, double-click start.bat again.
echo.
echo Alternatively, you can run the whole app directly in your browser without installing anything:
echo   https://stackblitz.com/github/shameel-alt/Play-Field
echo.
goto EndFail

:NoNpm
echo [ERROR] npm was not found. Please install or reinstall Node.js from https://nodejs.org/
echo.
goto EndFail

:InstallFailed
echo [ERROR] "npm install" failed.
echo Please verify your internet connection.
echo.
goto EndFail

:Done
echo.
echo Server stopped.
goto End

:EndFail
echo.
echo Press any key to exit...

:End
pause
