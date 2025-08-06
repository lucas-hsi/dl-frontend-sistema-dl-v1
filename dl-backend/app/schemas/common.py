from pydantic import BaseModel, Field
from typing import TypeVar, Generic, Optional

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    """Schema padrão para todas as respostas da API."""
    ok: bool = Field(..., description="Indica se a requisição foi bem-sucedida.")
    data: Optional[T] = Field(None, description="O payload de dados em caso de sucesso.")
    error: Optional[str] = Field(None, description="Uma mensagem de erro descritiva em caso de falha.")

    class Config:
        from_attributes = True 