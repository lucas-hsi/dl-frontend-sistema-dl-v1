from fastapi import APIRouter

router = APIRouter()

@router.get("/{vendedor_id}/resumo-dia", tags=["Vendedor"])
def get_daily_summary(vendedor_id: int):
    """ Retorna um resumo do dia para um vendedor específico. """
    # Dados de exemplo para que a página do vendedor possa carregar.
    return {
        "meta_diaria": 5000.00,
        "vendas_realizadas": 3850.50,
        "orcamentos_enviados": 12,
        "novos_clientes": 3,
    }