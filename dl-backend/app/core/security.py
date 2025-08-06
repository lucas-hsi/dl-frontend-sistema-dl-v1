from datetime import datetime, timedelta
from typing import Any
import jwt
from fastapi import HTTPException
from app.core.config import settings

def create_access_token(data: dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail="Token inválido") from e


from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def canonical_role(raw: str) -> str:
    """Normaliza o role do usuário para um dos valores canônicos"""
    v = (raw or '').strip().upper()
    if v in ('GESTOR',): return 'GESTOR'
    if v in ('VENDEDOR',): return 'VENDEDOR'
    if v in ('ANUNCIOS', 'ANUNCIANTE', 'ANUNCIO', 'ADS'): return 'ANUNCIOS'
    return 'VENDEDOR'  # fallback seguro
