import { API_CONFIG } from '@/config/api';

// Interfaces
export interface LeadQualificado {
  conversa_id: number;
  numero_whatsapp: string;
  nome_cliente?: string;
  qualificacao: 'urgente' | 'interessado' | 'consulta' | 'follow_up';
  score_lead: number;
  peca_interesse?: string;
  modelo_veiculo?: string;
  cidade?: string;
  tempo_espera: number;
  prioridade: 'alta' | 'media' | 'baixa';
  valor_estimado?: number;
  criado_em: string;
  tags?: string[];
  vendedor_id?: number;
}

export interface Conversa {
  id: number;
  numero_whatsapp: string;
  nome_cliente?: string;
  status: 'ativa' | 'pausada' | 'finalizada' | 'aguardando' | 'em_atendimento';
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
  valor_estimado?: number;
  mensagens: Mensagem[];
}

export interface Mensagem {
  id: number;
  conversa_id: number;
  tipo: 'cliente' | 'vendedor' | 'ia' | 'sistema';
  conteudo: string;
  timestamp: string;
  dados_extras?: any;
  status?: 'enviada' | 'entregue' | 'lida';
}

export interface AtendimentoStatus {
  conversa_id: number;
  status: string;
  vendedor_id?: number;
  mensagem: string;
}

export interface Metricas {
  totalLeads: number;
  leadsUrgentes: number;
  conversasAtivas: number;
  scoreMedio: number;
  tempoMedioEspera: number;
  conversionRate: number;
  valorTotalPotencial: number;
}

// Serviço de Atendimento
export class AtendimentoService {
  // Listar leads na fila de atendimento
  static async listarLeads(): Promise<LeadQualificado[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/atendimentos/leads`);
      if (!response.ok) {
        throw new Error(`Erro ao listar leads: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao listar leads:', error);
      // Retornar dados mock em caso de erro
      return this.getLeadsMock();
    }
  }

  // Listar conversas ativas
  static async listarConversasAtivas(): Promise<Conversa[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/atendimentos/conversas`);
      if (!response.ok) {
        throw new Error(`Erro ao listar conversas: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao listar conversas:', error);
      return this.getConversasMock();
    }
  }

  // Assumir atendimento
  static async assumirAtendimento(conversaId: number, vendedorId: number): Promise<AtendimentoStatus> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/atendimentos/assumir/${conversaId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendedor_id: vendedorId })
      });
      if (!response.ok) {
        throw new Error(`Erro ao assumir atendimento: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao assumir atendimento:', error);
      throw error;
    }
  }

  // Enviar mensagem
  static async enviarMensagem(conversaId: number, mensagem: string): Promise<Mensagem> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/atendimentos/mensagem/${conversaId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem })
      });
      if (!response.ok) {
        throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  // Finalizar atendimento
  static async finalizarAtendimento(conversaId: number): Promise<AtendimentoStatus> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/atendimentos/finalizar/${conversaId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Erro ao finalizar atendimento: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
      throw error;
    }
  }

  // Obter conversa completa
  static async obterConversa(conversaId: number): Promise<Conversa> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/atendimentos/conversa/${conversaId}`);
      if (!response.ok) {
        throw new Error(`Erro ao obter conversa: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter conversa:', error);
      throw error;
    }
  }

  // Obter métricas
  static async obterMetricas(): Promise<Metricas> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/atendimentos/metricas`);
      if (!response.ok) {
        throw new Error(`Erro ao obter métricas: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      return this.getMetricasMock();
    }
  }

  // Dados mock para desenvolvimento
  static getLeadsMock(): LeadQualificado[] {
    return [
      {
        conversa_id: 1,
        numero_whatsapp: '(11) 99999-9999',
        nome_cliente: 'João Silva',
        qualificacao: 'urgente',
        score_lead: 9,
        peca_interesse: 'Freio dianteiro',
        modelo_veiculo: 'Honda Civic 2020',
        cidade: 'São Paulo',
        tempo_espera: 5,
        prioridade: 'alta',
        valor_estimado: 450,
        criado_em: '2024-01-15T10:30:00Z',
        tags: ['Cliente Fiel', 'Oficina']
      },
      {
        conversa_id: 2,
        numero_whatsapp: '(11) 88888-8888',
        nome_cliente: 'Maria Santos',
        qualificacao: 'interessado',
        score_lead: 7,
        peca_interesse: 'Amortecedor',
        modelo_veiculo: 'Toyota Corolla 2019',
        cidade: 'São Paulo',
        tempo_espera: 12,
        prioridade: 'media',
        valor_estimado: 680,
        criado_em: '2024-01-15T10:25:00Z',
        tags: ['Primeira Compra']
      },
      {
        conversa_id: 3,
        numero_whatsapp: '(11) 77777-7777',
        nome_cliente: 'Carlos Oliveira',
        qualificacao: 'follow_up',
        score_lead: 8,
        peca_interesse: 'Kit embreagem',
        modelo_veiculo: 'Volkswagen Golf 2021',
        cidade: 'Santo André',
        tempo_espera: 3,
        prioridade: 'alta',
        valor_estimado: 1200,
        criado_em: '2024-01-15T10:20:00Z',
        tags: ['Follow-up', 'Alto Valor']
      },
      {
        conversa_id: 4,
        numero_whatsapp: '(11) 66666-6666',
        nome_cliente: 'Ana Costa',
        qualificacao: 'consulta',
        score_lead: 5,
        peca_interesse: 'Pneu dianteiro',
        modelo_veiculo: 'Fiat Palio 2018',
        cidade: 'São Paulo',
        tempo_espera: 8,
        prioridade: 'baixa',
        valor_estimado: 320,
        criado_em: '2024-01-15T10:15:00Z',
        tags: ['Consulta']
      }
    ];
  }

  static getConversasMock(): Conversa[] {
    return [
      {
        id: 5,
        numero_whatsapp: '(11) 55555-5555',
        nome_cliente: 'Pedro Santos',
        status: 'em_atendimento',
        qualificacao: 'interessado',
        score_lead: 8,
        peca_interesse: 'Farol dianteiro',
        modelo_veiculo: 'Honda Civic 2019',
        ano_veiculo: '2019',
        cidade: 'São Paulo',
        vendedor_id: 1,
        ultima_mensagem: 'Gostaria de saber o preço do farol',
        ultima_atualizacao: '2024-01-15T10:35:00Z',
        criado_em: '2024-01-15T10:00:00Z',
        valor_estimado: 450,
        mensagens: [
          {
            id: 1,
            conversa_id: 5,
            tipo: 'cliente',
            conteudo: 'Olá, gostaria de saber o preço do farol para Civic 2019',
            timestamp: '2024-01-15T10:00:00Z',
            status: 'lida'
          },
          {
            id: 2,
            conversa_id: 5,
            tipo: 'ia',
            conteudo: 'Olá Pedro! 👋 Vou verificar o preço do farol para o seu Honda Civic 2019.',
            timestamp: '2024-01-15T10:01:00Z',
            status: 'lida'
          },
          {
            id: 3,
            conversa_id: 5,
            tipo: 'cliente',
            conteudo: 'Perfeito! Preciso do farol direito.',
            timestamp: '2024-01-15T10:02:00Z',
            status: 'lida'
          }
        ]
      }
    ];
  }

  static getMetricasMock(): Metricas {
    return {
      totalLeads: 5,
      leadsUrgentes: 2,
      conversasAtivas: 1,
      scoreMedio: 7,
      tempoMedioEspera: 7,
      conversionRate: 67,
      valorTotalPotencial: 3100
    };
  }
} 