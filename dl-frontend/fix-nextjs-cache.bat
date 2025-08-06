@echo off
echo ========================================
echo CORRIGINDO CACHE DO NEXT.JS
echo ========================================
echo.

echo [1/4] Parando todos os processos Node.js...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul
timeout /t 3 >nul

echo [2/4] Removendo diretorios de cache...
if exist ".next" (
    rmdir /s /q ".next" 2>nul
    echo Cache .next removido
)

if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache" 2>nul
    echo Cache node_modules removido
)

if exist "node_modules\@next" (
    rmdir /s /q "node_modules\@next" 2>nul
    echo Cache @next removido
)

echo [3/4] Reinstalando Next.js...
npm install next@13.5.6 --save --force

echo [4/4] Iniciando servidor...
echo.
echo ========================================
echo INICIANDO SERVIDOR NA PORTA 3000
echo ========================================
npm run dev 