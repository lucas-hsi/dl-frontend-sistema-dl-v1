# HTTP Smoke Test Working - Dados Corretos - 2025-08-04T22:27:02
BASE_URL = http://127.0.0.1:8000

## Health
- GET http://127.0.0.1:8000/__health -> 200
  body: {"status":"ok"}
- GET http://127.0.0.1:8000/api/v1/utils/health-check -> 200
  body: {"ok":true,"data":"API is running smoothly!","error":null}

## Login com usuario existente (form-data)
- POST http://127.0.0.1:8000/api/v1/auth/login -> 500
  body: 
- Falha no login (codigo=500)

## /api/v1/me (com token)
- pulado (sem token)

## /api/v1/produtos-estoque/ (com token)
- GET http://127.0.0.1:8000/api/v1/produtos-estoque/?page=1&size=5 -> 401
  body: 

## Rotas de usuarios (com token)
- GET http://127.0.0.1:8000/api/v1/ -> 401
  body: 

## Rotas de items (com token)
- GET http://127.0.0.1:8000/api/v1/items/items/ -> 401
  body: 

## Rotas de autenticacao
- POST http://127.0.0.1:8000/api/v1/login/access-token -> 500
  body: 
- POST http://127.0.0.1:8000/api/v1/login/test-token -> 401
  body: 

## Rotas esperadas do corredor (checagem de presenca)
- POST http://127.0.0.1:8000/orcamentos/draft -> 404
  body: 
- POST http://127.0.0.1:8000/clientes/draft -> 404
  body: 
Se retornarem 404 ou 405, confirmamos gap a implementar.

## Resumo dos Status Codes
- 200: Sucesso
- 401: Nao autorizado (sem token)
- 404: Rota nao encontrada
- 422: Dados invalidos
- 500: Erro interno do servidor

Concluido.
