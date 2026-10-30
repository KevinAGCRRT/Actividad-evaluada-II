@echo off
REM Abre dos ventanas: primero el backend (puerto 3001) y luego el frontend (puerto 5173)
start "Backend" /D "%~dp0backend" cmd /k npm run dev
timeout /t 2 >nul
start "Frontend" /D "%~dp0frontend" cmd /k npm run dev
timeout /t 5 >nul
start http://localhost:5173
