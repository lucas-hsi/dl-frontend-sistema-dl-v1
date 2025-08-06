from fastapi import APIRouter

router = APIRouter()

@router.get("/metricas", tags=["Dashboard"])
def get_dashboard_metrics():
    """ Retorna métricas principais para o dashboard do gestor. """
    # Retornando dados mockados com a estrutura que o frontend espera
    return {
        "faturamento": 125300.50,
        "total_clientes": 212,
        "vendas_hoje": 34,
        "taxa_conversao": 81.2,
        "satisfacao_cliente": 96.5,
        "eficiencia_ia": 91.3
    }

@router.get("/estatisticas", tags=["Dashboard"])
def get_dashboard_stats():
    """ Retorna estatísticas e dados para os gráficos do dashboard. """
    # Retornando dados mockados com a estrutura que o frontend espera
    return {
        "evolucao_semanal": [
            {"name": "Seg", "vendas": 10, "conversao": 60},
            {"name": "Ter", "vendas": 15, "conversao": 65},
            {"name": "Qua", "vendas": 12, "conversao": 70},
            {"name": "Qui", "vendas": 20, "conversao": 75},
            {"name": "Sex", "vendas": 25, "conversao": 80},
        ],
        "distribuicao_canais": [
            {"name": "WhatsApp", "value": 450, "color": "#25D366"},
            {"name": "Mercado Livre", "value": 320, "color": "#FFE600"},
            {"name": "Venda Direta", "value": 280, "color": "#3483FA"},
        ],
        "performance_produtos": [
            {"produto": "Capô Golf", "vendas": 55, "margem": 35},
            {"produto": "Farol Civic", "vendas": 42, "margem": 40},
            {"produto": "Parachoque Corolla", "vendas": 31, "margem": 30},
        ]
    }
