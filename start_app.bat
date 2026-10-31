@echo off
title Student Health Passport Launcher
echo ========================================================
echo   Launching Student Health Passport in your Web Browser...
echo ========================================================

:: Check for Google Chrome
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%~dp0index.html"
    exit
)

:: Check for Microsoft Edge
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "%~dp0index.html"
    exit
)

:: Check for Mozilla Firefox
if exist "C:\Program Files\Mozilla Firefox\firefox.exe" (
    start "" "C:\Program Files\Mozilla Firefox\firefox.exe" "%~dp0index.html"
    exit
)

:: Fallback
start "" "%~dp0index.html"
exit
