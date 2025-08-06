from fastapi import APIRouter, Depends, status, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from app.core.security import create_access_token
from app.api.deps import get_db
from app.schemas.common import ApiResponse
from app.core.config import settings

router = APIRouter()

# Modelo de entrada para o login - ADICIONADO CAMPO 'profile'
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    profile: str # Frontend vai enviar 'gestor', 'vendedor', etc.

@router.post("/auth/login", response_model=ApiResponse[dict])
def auth_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Endpoint de login que valida o usuário E o perfil selecionado.
    """
    
    # --- LÓGICA DE SIMULAÇÃO (MOCK) COM VALIDAÇÃO DE PERFIL ---
    
    # Simulando um banco de dados de usuários com perfis fixos
    mock_users_db = {
        "gestor@dl.com": {"password": "123", "role": "GESTOR", "name": "Gestor Principal"},
        "vendedor@dl.com": {"password": "123", "role": "VENDEDOR", "name": "Vendedor Padrão"},
        "anuncios@dl.com": {"password": "123", "role": "ANUNCIOS", "name": "Analista de Anúncios"}
    }

    user_email = payload.email.lower()
    user_profile_request = payload.profile.upper() # Perfil que o usuário TENTOU acessar

    # 1. Verifica se o usuário existe
    if user_email not in mock_users_db:
        raise HTTPException(status_code=400, detail="Credenciais inválidas")

    user_from_db = mock_users_db[user_email]
    
    # 2. Verifica se o perfil que o usuário tentou acessar é o mesmo que ele tem no "banco de dados"
    if user_from_db["role"] != user_profile_request:
        raise HTTPException(
            status_code=403, # 403 Forbidden
            detail=f"Acesso negado. Você não tem permissão para o perfil de {payload.profile.capitalize()}."
        )

    # 3. Se tudo estiver certo, retorna sucesso com os dados corretos
    return ApiResponse(
        ok=True,
        data={
            "access_token": "fake-jwt-token-for-" + user_from_db["role"].lower(),
            "token_type": "bearer",
            "user": {
                "id": "00000000-0000-0000-0000-000000000000",
                "email": user_email,
                "role": user_from_db["role"],
                "name": user_from_db["name"],
                "full_name": user_from_db["name"]
            }
        }
    )

@router.post("/login/access-token")
def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user_role = "VENDEDOR"
    if "gestor" in form_data.username.lower():
        user_role = "GESTOR"

    return {
        "access_token": "fake-jwt-token-for-" + user_role.lower(),
        "token_type": "bearer"
    }
