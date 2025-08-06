import uuid
from decimal import Decimal
from typing import Optional
from sqlmodel import SQLModel
from pydantic import EmailStr


# Schemas de Autenticação
class LoginData(SQLModel):
    """Schema para dados de login"""
    email: EmailStr
    password: str


class Token(SQLModel):
    """Schema para token de acesso"""
    access_token: str
    token_type: str = "bearer"


class ResetPasswordData(SQLModel):
    """Schema para reset de senha"""
    token: str
    new_password: str


# Schemas de Usuário
class UserBase(SQLModel):
    """Schema base para Usuário"""
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False


class UserCreate(UserBase):
    """Schema para criação de Usuário"""
    password: str


class UserRead(UserBase):
    """Schema para leitura de Usuário"""
    id: uuid.UUID


class UserUpdate(SQLModel):
    """Schema para atualização de Usuário"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None


class PasswordUpdate(SQLModel):
    """Schema para atualização de senha"""
    current_password: str
    new_password: str


# Schemas de Item
class ItemBase(SQLModel):
    """Schema base para Item"""
    title: str
    description: Optional[str] = None


class ItemCreate(ItemBase):
    """Schema para criação de Item"""
    pass


class ItemRead(ItemBase):
    """Schema para leitura de Item"""
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemUpdate(SQLModel):
    """Schema para atualização de Item"""
    title: Optional[str] = None
    description: Optional[str] = None


# Schemas de Produto (mantidos do código existente)
class ProdutoBase(SQLModel):
    """Schema base para Produto"""
    sku: str
    nome: str
    preco: Decimal
    estoque: int = 0


class ProdutoCreate(ProdutoBase):
    """Schema para criação de Produto"""
    pass


class ProdutoUpdate(SQLModel):
    """Schema para atualização de Produto"""
    sku: str | None = None
    nome: str | None = None
    preco: Decimal | None = None
    estoque: int | None = None


class ProdutoRead(ProdutoBase):
    """Schema para leitura de Produto"""
    id: uuid.UUID


class ProdutosList(SQLModel):
    """Schema para lista de produtos"""
    data: list[ProdutoRead]
    count: int 