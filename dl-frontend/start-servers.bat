@echo off
echo ========================================
echo    INICIANDO SERVIDORES CRM DL
echo ========================================
echo.

echo [1/2] Iniciando Backend (FastAPI)...
start "Backend FastAPI" cmd /k "cd ..\backend && uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo [2/2] Iniciando Frontend (Next.js)...
start "Frontend Next.js" cmd /k "npm run dev"

echo.
echo ========================================
echo    SERVIDORES INICIADOS!
echo ========================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Pressione qualquer tecla para fechar...
pause > nul 