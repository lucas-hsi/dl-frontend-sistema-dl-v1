from sqlmodel import SQLModel
from decimal import Decimal
import uuid

class ProdutoBase(SQLModel):
    sku: str | None = None
    nome: str
    preco: Decimal | None = 0.0
    estoque: int = 0

class ProdutoRead(ProdutoBase):
    id: uuid.UUID

class ProdutosPublic(SQLModel):
    data: list[ProdutoRead]
    count: int 