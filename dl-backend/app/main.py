import os
import logging
import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")

ROOT_PATH = os.getenv("ROOT_PATH", "")


def custom_generate_unique_id(route: APIRoute) -> str:
    # Garante que a tag exista antes de acessá-la para evitar erros
    if route.tags and route.tags[0]:
        return f"{route.tags[0]}-{route.name}"
    return route.name


# Sentry apenas fora do ambiente local
if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=os.getenv("APP_VERSION", "0.1.0"),
    description="API do DL_SISTEMA",
    root_path=ROOT_PATH,
    generate_unique_id_function=custom_generate_unique_id,
)

# ---- Configuração do CORS ----
cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
if settings.BACKEND_CORS_ORIGINS:
    cors_origins.extend([o.strip() for o in settings.BACKEND_CORS_ORIGINS.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Rota de Verificação de Saúde ----
@app.get("/__health", tags=["internal"])
def health():
    """Rota de verificação de saúde da API."""
    return {"status": "ok"}


# ---- Inclusão de Todas as Rotas da API ----
# Esta linha regista todas as suas rotas de login, produtos, dashboard, etc.
app.include_router(api_router, prefix=settings.API_V1_STR)


# --- ROTA DE DEBUG TEMPORÁRIA ---
# Esta rota especial irá listar todas as rotas que o FastAPI conhece.
@app.get("/debug-routes", include_in_schema=False)
def get_all_routes():
    """
    Endpoint de debug para listar todas as rotas registadas na aplicação.
    """
    routes = []
    for route in app.routes:
        # Apenas para rotas de API, ignorando coisas internas do FastAPI
        if hasattr(route, "path"):
            routes.append({
                "path": route.path,
                "name": route.name if hasattr(route, "name") else "N/A",
                "methods": list(route.methods) if hasattr(route, "methods") else [],
            })
    return routes
