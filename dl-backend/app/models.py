import uuid

from pydantic import EmailStr, Field
from sqlmodel import Field as SQLField, Relationship, SQLModel
from typing import TypeVar, Generic, Optional, Any

# Importando o modelo de Produto do domínio
from app.domain.models import Produto

# Schema Pydantic Obrigatório conforme Artigo 2 da Constituição
T = TypeVar('T')

class ApiResponse(SQLModel, Generic[T]):
    ok: bool = SQLField(..., description="True para sucesso, False para erro.")
    data: Optional[T] = SQLField(None, description="Payload em caso de sucesso.")
    error: Optional[str] = SQLField(None, description="Mensagem de erro em caso de falha.")
    meta: Optional[dict[str, Any]] = SQLField(None, description="Metadados como paginação.")


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = SQLField(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = SQLField(default=None, max_length=255)
    role: str | None = SQLField(default=None, max_length=50)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = SQLField(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = SQLField(max_length=255)
    password: str = SQLField(min_length=8, max_length=40)
    full_name: str | None = SQLField(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = SQLField(default=None, max_length=255)  # type: ignore
    password: str | None = SQLField(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = SQLField(default=None, max_length=255)
    email: EmailStr | None = SQLField(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = SQLField(min_length=8, max_length=40)
    new_password: str = SQLField(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = SQLField(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = SQLField(min_length=1, max_length=255)
    description: str | None = SQLField(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = SQLField(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = SQLField(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = SQLField(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Login response with user info
class LoginResponse(SQLModel):
    token: str
    user: dict

# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = SQLField(min_length=8, max_length=40)
