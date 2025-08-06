from fastapi import APIRouter

router = APIRouter()

@router.get("/resumo", tags=["Anuncios"])
def get_ads_summary():
    """ Retorna um resumo de performance para o painel de anúncios. """
    # Dados de exemplo para que a página de anúncios possa carregar.
    return {
        "investimento_total": 1500.75,
        "cliques": 3450,
        "conversoes": 89,
        "cpa": 16.86, # Custo por Aquisição
    }