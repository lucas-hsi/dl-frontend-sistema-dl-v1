// src/services/orcamentoService.ts
// Serviço para operações com orçamentos

import { API_CONFIG } from '@/config/api';
import axios from 'axios';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Orcamento {
  id: number;
  numero_orcamento: string;
  cliente_id: number;
  cliente_nome: string;
  vendedor_id: number;
  vendedor_nome: string;
  status: 'pendente' | 'enviado' | 'aprovado' | 'rejeitado' | 'expirado' | 'convertido' | 'concluido';
  valor_total: number;
  valor_potencial: number;
  taxa_conversao: number;
  validade_orcamento: string;
  data_criacao: string;
  pdf_gerado: boolean;
  enviado_whatsapp: boolean;
  total_itens: number;
  observacoes?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  dias_restantes: number;
  frete_valor?: number;
  frete_transportadora?: string;
  frete_prazo_entrega?: number;
  frete_tipo?: string;
  frete_cep_destino?: string;
}

export interface OrcamentoCreate {
  cliente_id: number;
  observacoes?: string;
  marca_veiculo?: string;
  modelo_veiculo?: string;
  ano_veiculo?: string;
  placa_veiculo?: string;
  itens: OrcamentoItemCreate[];
}

export interface OrcamentoItemCreate {
  produto_id?: number;
  produto_avulso?: string;
  quantidade: number;
  valor_unitario: number;
  desconto_percentual?: number;
  desconto_valor?: number;
  observacoes?: string;
}

export interface OrcamentoUpdate {
  observacoes?: string;
  status?: string;
  itens?: OrcamentoItemCreate[];
}

export interface OrcamentoEnvio {
  metodo: 'whatsapp' | 'email';
  numero_whatsapp?: string;
  email?: string;
  mensagem_personalizada?: string;
}

export interface CalculoFreteRequest {
  cep_destino: string;
  valor_total: number;  // Agora obrigatório
  peso_total?: number;  // Peso total em kg
  dimensoes?: {        // Dimensões em cm
    comprimento: number;
    largura: number;
    altura: number;
  };
  produtos?: Array<{   // Lista de produtos para cálculo detalhado
    nome: string;
    quantidade: number;
    peso?: number;
    dimensoes?: {
      comprimento: number;
      largura: number;
      altura: number;
    };
  }>;
}

export interface OpcaoFrete {
  transportadora: string;
  servico: string;
  prazo: number;
  valor: number;
  codigo_servico: string;
}

export interface MetricasOrcamentos {
  totalOrcamentos: number;
  orcamentosPendentes: number;
  orcamentosAprovados: number;
  valorTotalPotencial: number;
  taxaConversaoGeral: number;
  orcamentosExpirados: number;
  valorConvertido: number;
  orcamentosPorStatus: Record<string, number>;
  valorMedioOrcamento: number;
  orcamentosUltimos30Dias: number;
}

export interface FiltroOrcamentos {
  status?: string;
  prioridade?: string;
  cliente_id?: number;
  vendedor_id?: number;
  data_inicio?: string;
  data_fim?: string;
  valor_min?: number;
  valor_max?: number;
  termo_busca?: string;
}

export interface RespostaFrete {
  sucesso: boolean;
  opcoes_frete: OpcaoFrete[];
  mensagem?: string;
  erro?: string;
}

export interface Metricas {
  totalOrcamentos: number;
  orcamentosPendentes: number;
  orcamentosAprovados: number;
  valorTotalPotencial: number;
  taxaConversaoGeral: number;
  orcamentosExpirados: number;
  valorConvertido: number;
}

export interface PDFResponse {
  sucesso: boolean;
  mensagem?: string;
  erro?: string;
  pdf_url?: string;
}

class OrcamentoService {
  private baseUrl = '/orcamentos';

  // ===== CRUD BÁSICO =====

  async criarOrcamento(dados: OrcamentoCreate, vendedor_id: number): Promise<Orcamento> {
    try {
      const response = await api.post(`${this.baseUrl}/`, dados, {
        params: { vendedor_id }
      });
      return response.data.orcamento;
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      throw error;
    }
  }

  async listarOrcamentos(filtros: FiltroOrcamentos = {}, skip = 0, limit = 50): Promise<Orcamento[]> {
    try {
      const params = { skip, limit, ...filtros };
      const response = await api.get(`${this.baseUrl}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar orçamentos:', error);
      throw error;
    }
  }

  async obterOrcamento(id: number): Promise<Orcamento> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter orçamento:', error);
      throw error;
    }
  }

  async atualizarOrcamento(id: number, dados: OrcamentoUpdate, vendedor_id: number): Promise<Orcamento> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, dados, {
        params: { vendedor_id }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      throw error;
    }
  }

  async deletarOrcamento(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      throw error;
    }
  }

  // ===== FUNCIONALIDADES AVANÇADAS =====

  async gerarPDFOrcamento(orcamentoId: number): Promise<PDFResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/${orcamentoId}/gerar-pdf`);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }

  async calcularFrete(orcamentoId: number, dadosFrete: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/${orcamentoId}/frete`, dadosFrete);
      return response.data;
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      throw error;
    }
  }

  async cotarFrete(dadosFrete: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/frete/cotar`, dadosFrete);
      return response.data;
    } catch (error) {
      console.error('Erro ao cotar frete:', error);
      throw error;
    }
  }

  async cotarFreteOrcamento(dados: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/frete/cotar-orcamento`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao cotar frete do orcamento:', error);
      throw error;
    }
  }

  async aplicarFrete(orcamentoId: number, opcaoFrete: any): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${orcamentoId}/frete`, opcaoFrete);
      return response.data;
    } catch (error) {
      console.error('Erro ao aplicar frete:', error);
      throw error;
    }
  }

  async downloadPDF(orcamentoId: number): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/${orcamentoId}/download-pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer download do PDF:', error);
      throw error;
    }
  }

  async mudarStatusOrcamento(dados: { orcamento_id: number; novo_status: string; observacoes?: string }): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${dados.orcamento_id}/status`, {
        novo_status: dados.novo_status,
        observacoes: dados.observacoes
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao mudar status do orçamento:', error);
      throw error;
    }
  }

  async reabrirOrcamento(dados: { orcamento_id: number; vendedor_id: number }): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/${dados.orcamento_id}/reabrir`, {
        vendedor_id: dados.vendedor_id
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao reabrir orçamento:', error);
      throw error;
    }
  }

  async enviarOrcamentoWhatsApp(dados: { orcamento_id: number; telefone: string; mensagem?: string }): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/${dados.orcamento_id}/enviar`, {
        metodo: 'whatsapp',
        numero_whatsapp: dados.telefone,
        mensagem_personalizada: dados.mensagem
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar orçamento por WhatsApp:', error);
      throw error;
    }
  }

  async enviarOrcamento(orcamento_id: number, dados: OrcamentoEnvio): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/${orcamento_id}/enviar`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      throw error;
    }
  }

  async aprovarOrcamento(orcamento_id: number, dados: { aprovador_id: number; observacoes?: string }): Promise<Orcamento> {
    try {
      const response = await api.post(`${this.baseUrl}/${orcamento_id}/aprovar`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao aprovar orçamento:', error);
      throw error;
    }
  }

  async converterEmVenda(orcamento_id: number, dados: { vendedor_id: number; observacoes?: string }): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${orcamento_id}/converter-venda`, dados);
    } catch (error) {
      console.error('Erro ao converter orçamento em venda:', error);
      throw error;
    }
  }

  // ===== ESTATÍSTICAS E MÉTRICAS =====

  async obterMetricas(data_inicio?: string, data_fim?: string): Promise<MetricasOrcamentos> {
    try {
      const params: any = {};
      if (data_inicio) params.data_inicio = data_inicio;
      if (data_fim) params.data_fim = data_fim;

      const response = await api.get(`${this.baseUrl}/estatisticas`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      throw error;
    }
  }

  async obterEstatisticas(): Promise<Metricas> {
    try {
      const response = await api.get('/orcamentos/estatisticas');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  async obterResumoDashboard(vendedor_id?: number): Promise<{
    orcamentos_por_status: Record<string, number>;
    valor_total_potencial: number;
    taxa_conversao: number;
    orcamentos_vencendo_em_7_dias: number;
  }> {
    try {
      const params: any = {};
      if (vendedor_id) params.vendedor_id = vendedor_id;

      const response = await api.get(`${this.baseUrl}/dashboard/resumo`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter resumo do dashboard:', error);
      throw error;
    }
  }

  // ===== UTILITÁRIOS =====

  async validarCEP(cep: string): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/validar-cep/${cep}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao validar CEP:', error);
      throw error;
    }
  }

  async validarCep(cep: string): Promise<any> {
    try {
      const response = await api.get(`/orcamentos/validar-cep/${cep}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao validar CEP:', error);
      throw error;
    }
  }

  async expirarOrcamentosVencidos(): Promise<{ orcamentos_expirados: number }> {
    try {
      const response = await api.post(`${this.baseUrl}/expirar-vencidos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao expirar orçamentos vencidos:', error);
      throw error;
    }
  }

  // Marcar orçamento como concluído
  async concluirOrcamento(orcamentoId: number, observacoes?: string): Promise<any> {
    try {
      const response = await api.post(`/orcamentos/${orcamentoId}/concluir`, {
        observacoes
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao concluir orçamento:', error);
      throw error;
    }
  }

  // Enviar orçamento via WhatsApp
  async enviarWhatsApp(orcamentoId: number, whatsapp: string, mensagem?: string): Promise<any> {
    try {
      const response = await api.post(`/orcamentos/${orcamentoId}/enviar`, {
        whatsapp,
        mensagem_personalizada: mensagem
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      throw error;
    }
  }

  // ===== MÉTODOS AUXILIARES =====

  formatarNumeroOrcamento(numero: string): string {
    return numero.replace('ORC-', '').replace(/-/g, '/');
  }

  calcularDiasRestantes(data_vencimento: string): number {
    const hoje = new Date();
    const vencimento = new Date(data_vencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getStatusColor(status: string): string {
    const cores = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      enviado: 'bg-blue-100 text-blue-800 border-blue-200',
      aprovado: 'bg-green-100 text-green-800 border-green-200',
      rejeitado: 'bg-red-100 text-red-800 border-red-200',
      expirado: 'bg-gray-100 text-gray-800 border-gray-200',
      convertido: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return cores[status as keyof typeof cores] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getPrioridadeColor(prioridade: string): string {
    const cores = {
      alta: 'bg-red-500',
      media: 'bg-yellow-500',
      baixa: 'bg-green-500'
    };
    return cores[prioridade as keyof typeof cores] || 'bg-gray-500';
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}

export const orcamentoService = new OrcamentoService();

export const salvarOrcamento = async (orcamento: any) => {
  // Use o método já existente da classe
  return orcamentoService.criarOrcamento(orcamento, orcamento.vendedor_id || 1);
};
