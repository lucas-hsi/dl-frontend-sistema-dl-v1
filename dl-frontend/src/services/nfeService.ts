import { api } from '@/config/api';

export interface EmitirNFERequest {
  id: string;
  cliente: {
    nome: string;
    cpf_cnpj: string;
    email?: string;
    telefone?: string;
    endereco?: {
      logradouro: string;
      numero: string;
      bairro: string;
      cidade: string;
      uf: string;
      cep: string;
    };
  };
  produtos: Array<{
    codigo: string;
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
  }>;
  valor_total: number;
  canal: string;
  mock?: boolean;
}

export interface NFeResponse {
  nfe_number: string;
  xml: string;
  pdf_url: string;
  status: string;
  error?: string;
}

export interface ConfigFiscalRequest {
  cnpj_emitente: string;
  inscricao_estadual: string;
  razao_social: string;
  nome_fantasia: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  telefone: string;
  email: string;
  ambiente: 'homologacao' | 'producao';
  certificado_path?: string;
  certificado_senha?: string;
}

export interface NFeEmissao {
  id: string;
  numero: string;
  chave: string;
  status: string;
  data_emissao: string;
  valor_total: number;
  cliente_nome: string;
  canal: string;
  xml_url?: string;
  pdf_url?: string;
}

export interface NFeEstatisticas {
  total_emitidas: number;
  total_canceladas: number;
  valor_total_emitido: number;
  mes_atual: {
    emitidas: number;
    valor: number;
  };
  ultimos_7_dias: {
    emitidas: number;
    valor: number;
  };
}

class NFeService {
  private baseUrl = '/nfe';

  // Emissão de NF-e
  async emitirNFe(data: EmitirNFERequest): Promise<NFeResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/emitir`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao emitir NF-e:', error);
      throw error;
    }
  }

  // Consultar status SEFAZ
  async consultarStatusSefaz(): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/status-sefaz`);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar status SEFAZ:', error);
      throw error;
    }
  }

  // Obter estatísticas
  async obterEstatisticas(): Promise<NFeEstatisticas> {
    try {
      const response = await api.get(`${this.baseUrl}/estatisticas`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  // Gestor - Configuração Fiscal
  async salvarConfigFiscal(config: ConfigFiscalRequest): Promise<any> {
    try {
      const response = await api.post('/gestor/fiscal/config', config);
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar configuração fiscal:', error);
      throw error;
    }
  }

  async obterConfigFiscal(): Promise<any> {
    try {
      const response = await api.get('/gestor/fiscal/config');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter configuração fiscal:', error);
      throw error;
    }
  }

  // Gestor - Listar NF-es
  async listarNFe(
    status?: string,
    dataInicio?: string,
    dataFim?: string,
    limite: number = 100,
    offset: number = 0
  ): Promise<NFeEmissao[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (dataInicio) params.append('data_inicio', dataInicio);
      if (dataFim) params.append('data_fim', dataFim);
      params.append('limite', limite.toString());
      params.append('offset', offset.toString());

      const response = await api.get(`/gestor/fiscal/nfe?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar NF-es:', error);
      throw error;
    }
  }

  // Gestor - Obter NF-e específica
  async obterNFe(nfeId: string): Promise<NFeEmissao> {
    try {
      const response = await api.get(`/gestor/fiscal/nfe/${nfeId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter NF-e:', error);
      throw error;
    }
  }

  // Gestor - Cancelar NF-e
  async cancelarNFe(nfeId: string, motivo: string): Promise<any> {
    try {
      const response = await api.post(`/gestor/fiscal/nfe/${nfeId}/cancelar`, {
        motivo
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar NF-e:', error);
      throw error;
    }
  }
}

export const nfeService = new NFeService(); 