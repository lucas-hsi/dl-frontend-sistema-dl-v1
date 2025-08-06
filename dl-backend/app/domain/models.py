import uuid
from decimal import Decimal
from sqlmodel import Field, SQLModel


class Produto(SQLModel, table=True):
    """Modelo de domínio para Produto"""
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    sku: str = Field(unique=True, index=True, max_length=100)
    nome: str = Field(max_length=255)
    preco: Decimal = Field(max_digits=10, decimal_places=2)
    estoque: int = Field(default=0, ge=0) 