# HTTP Smoke Test - Credenciais Corrigidas - 2025-08-04T22:22:38
BASE_URL = http://127.0.0.1:8000

## Health
- GET http://127.0.0.1:8000/__health -> 200
  body: {"status":"ok"}
- GET http://127.0.0.1:8000/api/v1/utils/health-check -> 200
  body: {"ok":true,"data":"API is running smoothly!","error":null}

## Login com credenciais corretas
- POST http://127.0.0.1:8000/api/v1/auth/login -> 422
  body: 
- Falha no login (codigo=422). Tentando criar usuario...

## Tentativa de criar usuario se login falhou
- POST http://127.0.0.1:8000/api/v1/auth/signup -> 404
  body: 

## /api/v1/me
- pulado (sem token)

## /api/v1/produtos-estoque/
- GET http://127.0.0.1:8000/api/v1/produtos-estoque/?page=1&size=5 -> 401
  body: 

## Rotas esperadas do corredor (checagem de presenca)
- POST http://127.0.0.1:8000/orcamentos/draft -> 404
  body: 
- POST http://127.0.0.1:8000/clientes/draft -> 404
  body: 
Se retornarem 404 ou 405, confirmamos gap a implementar.

## Rotas adicionais para teste
- GET http://127.0.0.1:8000/api/v1/users/ -> 401
  body: 
- GET http://127.0.0.1:8000/api/v1/auth/me -> 404
  body: 

Concluido.
