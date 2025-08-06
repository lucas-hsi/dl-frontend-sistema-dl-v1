from fastapi import APIRouter, Depends
from sqlmodel import func, select

# Importamos as dependências de segurança
from app.api import deps
from app.api.deps import SessionDep
from app.domain.models import Produto
from app.schemas.common import ApiResponse
from app.schemas.produto import ProdutosPublic

router = APIRouter()

@router.get(
    "/",
    response_model=ApiResponse[ProdutosPublic],
    summary="Listar produtos do estoque com paginação",
    tags=["Produtos"]
)
def read_produtos(
    session: SessionDep,
    # --- CORREÇÃO APLICADA AQUI ---
    # Esta linha exige que o usuário esteja logado para acessar a rota.
    current_user: deps.CurrentUser,
    # -----------------------------
    skip: int = 0,
    limit: int = 100
) -> ApiResponse[ProdutosPublic]:
    """
    Recupera uma lista paginada de produtos do estoque.
    Requer autenticação.
    """
    # TODO: Reverter para implementação real
    from decimal import Decimal
    import uuid
    
    mock_produtos = [
        {
            "id": uuid.uuid4(),
            "sku": "SKU001",
            "nome": "Produto 1",
            "preco": Decimal("100.00"),
            "estoque": 10
        },
        {
            "id": uuid.uuid4(),
            "sku": "SKU002", 
            "nome": "Produto 2",
            "preco": Decimal("200.00"),
            "estoque": 15
        },
    ]
    
    paginated_data = ProdutosPublic(data=mock_produtos, count=len(mock_produtos))
    
    return ApiResponse(ok=True, data=paginated_data)

@router.get("/estatisticas", tags=["Produtos"])
def get_product_stock_stats():
    """ Retorna estatísticas de estoque para o dashboard. """
    return {"total_produtos": 1480}
