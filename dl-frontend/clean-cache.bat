@echo off
echo ========================================
echo LIMPANDO CACHE DO NEXT.JS
echo ========================================
echo.

echo [1/3] Parando processos Node.js...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo [2/3] Removendo cache do Next.js...
if exist ".next" (
    rmdir /s /q ".next" 2>nul
    echo Cache .next removido
) else (
    echo Cache .next nao encontrado
)

if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache" 2>nul
    echo Cache node_modules removido
) else (
    echo Cache node_modules nao encontrado
)

echo [3/3] Limpeza concluida!
echo.
echo ========================================
echo CACHE LIMPO - PRONTO PARA USAR
echo ========================================
pause 