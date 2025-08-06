@echo off
echo ========================================
echo    DL SISTEMA - Inicializador
echo ========================================
echo.

echo [1/3] Iniciando Backend...
cd dl-backend
start "Backend DL Sistema" cmd /k "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
cd ..

echo [2/3] Aguardando Backend inicializar...
timeout /t 3 /nobreak > nul

echo [3/3] Iniciando Frontend...
cd dl-frontend
start "Frontend DL Sistema" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo    Sistema iniciado com sucesso!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3001
echo.
echo Pressione qualquer tecla para abrir o sistema...
pause > nul

start http://localhost:3001

echo Sistema aberto no navegador!
echo.
echo Para parar os serviços, feche as janelas do terminal.
pause 