from pydantic import BaseModel, Field
from typing import TypeVar, Generic, Optional, Any

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    ok: bool = Field(..., description="True para sucesso, False para erro.")
    data: Optional[T] = Field(None, description="Payload em caso de sucesso.")
    error: Optional[str] = Field(None, description="Mensagem de erro em caso de falha.")
    meta: Optional[dict[str, Any]] = Field(None, description="Metadados como paginação.")
