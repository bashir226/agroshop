@echo off
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
start /B node server.js
timeout /t 2 /nobreak >nul
echo Server restarted
