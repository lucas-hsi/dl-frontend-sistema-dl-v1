import axios from 'axios';
import { API_CONFIG } from '@/config/api';

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

// Interfaces
export interface WhatsAppMessage {
  numero: string;
  mensagem: string;
  nome_cliente?: string;
}

export interface WhatsAppResponse {
  numero: string;
  mensagem: string;
  tipo: string;
}

export interface LeadQualificado {
  conversa_id: number;
  numero_whatsapp: string;
  nome_cliente?: string;
  qualificacao: string;
  score_lead: number;
  peca_interesse?: string;
  modelo_veiculo?: string;
  cidade?: string;
  tempo_espera: number;
  criado_em: string;
}

export interface AtendimentoStatus {
  conversa_id: number;
  status: string;
  vendedor_id?: number;
  mensagem: string;
}

export interface Conversa {
  id: number;
  numero_whatsapp: string;
  nome_cliente?: string;
  status: string;
  qualificacao?: string;
  score_lead: number;
  peca_interesse?: string;
  modelo_veiculo?: string;
  ano_veiculo?: string;
  cidade?: string;
  vendedor_id?: number;
  ultima_mensagem?: string;
  ultima_atualizacao: string;
  criado_em: string;
  mensagens: Mensagem[];
}

export interface Mensagem {
  id: number;
  conversa_id: number;
  tipo: string;
  conteudo: string;
  timestamp: string;
  dados_extras?: any;
}

class WhatsAppService {
  private baseUrl = '/whatsapp';

  // Receber mensagem do WhatsApp
  async receberMensagem(mensagem: WhatsAppMessage): Promise<WhatsAppResponse> {
    const response = await api.post(`${this.baseUrl}/receber-mensagem/`, mensagem);
    return response.data;
  }

  // Listar fila de atendimento
  async listarFilaAtendimento(): Promise<LeadQualificado[]> {
    const response = await api.get(`${this.baseUrl}/fila-atendimento/`);
    return response.data;
  }

  // Assumir atendimento
  async assumirAtendimento(conversa_id: number, vendedor_id: number): Promise<AtendimentoStatus> {
    const response = await api.post(`${this.baseUrl}/assumir-atendimento/`, {
      conversa_id,
      vendedor_id
    });
    return response.data;
  }

  // Enviar mensagem como vendedor
  async enviarMensagemVendedor(conversa_id: number, vendedor_id: number, mensagem: string): Promise<WhatsAppResponse> {
    const response = await api.post(`${this.baseUrl}/enviar-mensagem/`, {
      conversa_id,
      vendedor_id,
      mensagem
    });
    return response.data;
  }

  // Finalizar atendimento
  async finalizarAtendimento(conversa_id: number): Promise<AtendimentoStatus> {
    const response = await api.post(`${this.baseUrl}/finalizar-atendimento/`, {
      conversa_id
    });
    return response.data;
  }

  // Listar conversas de um vendedor
  async listarConversasVendedor(vendedor_id: number): Promise<Conversa[]> {
    const response = await api.get(`${this.baseUrl}/conversas-vendedor/${vendedor_id}/`);
    return response.data;
  }

  // Obter conversa completa
  async obterConversaCompleta(conversa_id: number): Promise<Conversa> {
    const response = await api.get(`${this.baseUrl}/conversa/${conversa_id}/`);
    return response.data;
  }

  // Verificar status do sistema
  async verificarStatus(): Promise<any> {
    const response = await api.get(`${this.baseUrl}/status/`);
    return response.data;
  }
}

export const whatsappService = new WhatsAppService(); 