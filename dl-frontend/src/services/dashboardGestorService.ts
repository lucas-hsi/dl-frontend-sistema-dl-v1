import { API_CONFIG } from '@/config/api';

export interface MetricasPrincipais {
  periodo: {
    inicio: string;
    fim: string;
    dias: number;
  };
  vendas: {
    total_vendas: number;
    valor_total: number;
    ticket_medio: number;
    crescimento_percentual: number;
    vendas_por_canal: Record<string, any>;
    vendas_por_vendedor: Record<string, any>;
  };
  estoque: {
    total_produtos: number;
    produtos_ativos: number;
    valor_total_estoque: number;
    produtos_baixo_estoque: number;
    categorias_principais: Array<{categoria: string; quantidade: number}>;
  };
  clientes: {
    total_clientes: number;
    clientes_ativos: number;
    novos_clientes: number;
    clientes_recorrentes: number;
  };
}

export interface SugestaoIA {
  tipo: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  acao: string;
  dados: any;
}

export interface Alerta {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  nivel: string;
  acao: string;
  dados: any;
  timestamp: string;
}

export interface AnaliseIA {
  pergunta: string;
  resposta: string;
  dados_suporte: any;
  acoes_sugeridas: Array<{acao: string; tipo: string}>;
  timestamp: string;
}

export interface FiltrosDashboard {
  periodo?: number;
  vendedor_id?: number;
  categoria?: string;
  canal?: string;
  data_inicio?: string;
  data_fim?: string;
}

class DashboardGestorService {
  // --- CORREÇÃO APLICADA AQUI ---
  // Adicionamos o prefixo /api/v1 que estava faltando.
  private baseURL = `${API_CONFIG.BASE_URL}/api/v1/dashboard-gestor`;

  private async request(endpoint: string, options: RequestInit = {}) {
    // Tentamos pegar o token do localStorage.
    // No Next.js, localStorage só existe no lado do cliente.
    const token = typeof window !== 'undefined' ? localStorage.getItem('dl.auth.token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        // Adiciona o token de autorização apenas se ele existir.
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      // Tenta extrair uma mensagem de erro mais detalhada do corpo da resposta.
      const errorBody = await response.json().catch(() => ({ detail: `Erro na requisição: ${response.status} ${response.statusText}` }));
      throw new Error(errorBody.detail || `Erro na requisição: ${response.status}`);
    }

    return response.json();
  }

  async obterMetricasPrincipais(periodoDias: number = 30): Promise<MetricasPrincipais> {
    return this.request(`/metricas-principais?periodo_dias=${periodoDias}`);
  }

  async obterSugestoesIA(): Promise<{sugestoes: SugestaoIA[]; timestamp: string}> {
    return this.request('/sugestoes-ia');
  }

  async obterAlertas(): Promise<{
    alertas: Alerta[];
    total_alertas: number;
    alertas_criticos: number;
    alertas_importantes: number;
    alertas_informativos: number;
  }> {
    return this.request('/alertas');
  }

  async analisePersonalizadaIA(pergunta: string, contexto?: any): Promise<AnaliseIA> {
    return this.request('/analise-personalizada', {
      method: 'POST',
      body: JSON.stringify({ pergunta, contexto }),
    });
  }

  async obterGraficoVendasCanal(periodoDias: number = 30): Promise<{
    periodo: {inicio: string; fim: string};
    dados: Record<string, any>;
    total_geral: number;
  }> {
    return this.request(`/grafico-vendas-canal?periodo_dias=${periodoDias}`);
  }

  async obterGraficoFaturamentoDiario(dias: number = 30): Promise<{
    periodo: {inicio: string; fim: string};
    dados: Array<{data: string; valor: number}>;
    total_periodo: number;
  }> {
    return this.request(`/grafico-faturamento-diario?dias=${dias}`);
  }

  async obterGraficoEstoqueCategoria(): Promise<{
    dados: Array<{categoria: string; quantidade: number; estoque_total: number; valor_total: number}>;
    total_produtos: number;
  }> {
    return this.request('/grafico-estoque-categoria');
  }

  async obterFiltrosDisponiveis(): Promise<{
    vendedores: Array<{id: number; nome: string; username: string; perfil: string}>;
    categorias: string[];
    canais: string[];
    periodos: Array<{label: string; value: number}>;
  }> {
    return this.request('/filtros-disponiveis');
  }

  async obterDadosFiltrados(filtros: FiltrosDashboard): Promise<{
    filtros_aplicados: FiltrosDashboard;
    dados: {
      vendas: Array<{
        id: number;
        data: string;
        valor: number;
        status: string;
        canal: string;
        vendedor_id: number;
      }>;
    };
    total_registros: number;
    resumo: {
      total_vendas: number;
      valor_total: number;
      ticket_medio: number;
    };
  }> {
    const params = new URLSearchParams();
    
    if (filtros.periodo) params.append('periodo_dias', filtros.periodo.toString());
    if (filtros.vendedor_id) params.append('vendedor_id', filtros.vendedor_id.toString());
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    if (filtros.canal) params.append('canal', filtros.canal);
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);

    return this.request(`/dados-filtrados?${params.toString()}`);
  }

  // Métodos auxiliares para formatação de dados
  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarPercentual(valor: number): string {
    return `${valor.toFixed(1)}%`;
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  obterCorNivelAlerta(nivel: string): string {
    switch (nivel) {
      case 'critico':
        return 'text-red-600 bg-red-100';
      case 'importante':
        return 'text-orange-600 bg-orange-100';
      case 'informativo':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  obterIconeNivelAlerta(nivel: string): string {
    switch (nivel) {
      case 'critico':
        return '🔴';
      case 'importante':
        return '🟡';
      case 'informativo':
        return '🔵';
      default:
        return '⚪';
    }
  }
}

export default new DashboardGestorService();
