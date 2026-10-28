@echo off
title Play Field - Tournament Operating System
echo ======================================================================
echo           PLAY FIELD - Tournament Management & Live Broadcast Desk
echo ======================================================================
echo.

:: 1. Verify Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this machine.
    echo Please install Node.js (LTS version) from: https://nodejs.org/
    echo.
    pause
    exit /b
)

:: 2. Auto-install dependencies if missing
if not exist "node_modules\" (
    echo [1/2] Installing dependencies for first-time launch...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b
    )
) else (
    echo [1/2] Dependencies found.
)

:: 3. Launch application
echo [2/2] Launching Play Field web app...
echo Opening http://localhost:5173 in your default browser...
start http://localhost:5173/

call npm run dev
pause
