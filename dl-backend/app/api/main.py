from fastapi import APIRouter

# Garantindo que TODOS os módulos de rotas sejam importados
from app.api.routes import (
    items, login, private, users, produtos, 
    utils, dashboard, vendedor, anuncios
)
from app.core.config import settings

api_router = APIRouter()

# --- CONEXÕES FINAIS E VERIFICADAS ---

# Rotas de autenticação
api_router.include_router(login.router, prefix="/login", tags=["Login"])

# Rotas de usuários
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Rotas de produtos
api_router.include_router(produtos.router, prefix="/produtos-estoque", tags=["Produtos"])

# Rotas do Dashboard do Gestor
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])

# Rotas do Vendedor
api_router.include_router(vendedor.router, prefix="/vendedor", tags=["Vendedor"])

# Rotas de Anúncios
api_router.include_router(anuncios.router, prefix="/anuncios", tags=["Anuncios"])

# Rotas de utilitários e exemplos
api_router.include_router(utils.router, prefix="/utils", tags=["Utils"])
api_router.include_router(items.router, prefix="/items", tags=["Items"])

# Rotas privadas
if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router, prefix="/private", tags=["Private"])
