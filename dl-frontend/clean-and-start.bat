@echo off
echo ========================================
echo LIMPEZA E INICIALIZACAO DO NEXT.JS
echo ========================================

echo.
echo 1. Parando processos Node.js...
taskkill /f /im node.exe >nul 2>&1

echo.
echo 2. Removendo pasta .next...
if exist ".next" rmdir /s /q .next

echo.
echo 3. Limpando cache do npm...
npm cache clean --force

echo.
echo 4. Removendo node_modules...
if exist "node_modules" rmdir /s /q node_modules

echo.
echo 5. Reinstalando dependencias...
npm install

echo.
echo 6. Iniciando servidor de desenvolvimento...
npm run dev

echo.
echo ========================================
echo SERVIDOR INICIADO!
echo ========================================
echo.
echo Acesse: http://localhost:3000
echo.
pause 