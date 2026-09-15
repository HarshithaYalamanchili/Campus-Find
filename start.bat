@echo off
title CampusFind - Full Stack Application
echo ================================================================
echo        CampusFind - College Lost & Found Platform
echo ================================================================
echo.
echo Starting unified full-stack server on http://localhost:5000...
echo.

cd /d %~dp0backend
if not exist node_modules (
    echo Installing backend dependencies (first-time only)...
    call npm install
)

start http://localhost:5000
npm start
pause
