@echo off
where npm >nul 2>nul || (
  echo No se encontro Node.js. Instala la version LTS desde https://nodejs.org y vuelve a intentar.
  pause
  exit /b
)
echo === Instalando librerias del backend ===
cd /d "%~dp0backend"
call npm install
echo.
echo === Instalando librerias del frontend ===
cd /d "%~dp0frontend"
call npm install
echo.
echo === Listo. Ahora abre iniciar.bat ===
pause
