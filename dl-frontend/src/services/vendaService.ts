// src/services/vendaService.ts
// Serviço para integração com vendas de balcão

import { API_CONFIG } from '@/config/api'; // [AJUSTE 2024] Centralização da base URL
import { ItemOrcamento } from '@/types/orcamento';
import { Cliente, Vendedor, VendaHistorico, FiltrosHistoricoVendas } from '@/types/venda';

export interface VendaCreate {
  cliente_id: number;
  vendedor_id: number;
  valor_total: number;
  itens: ItemOrcamento[];
  forma_pagamento: string;
}

export interface VendaResponse {
  id: number;
  cliente_id: number;
  vendedor_id: number;
  data_venda: string;
  valor_total: number;
  forma_pagamento: string;
  itens: ItemOrcamento[];
}

export interface RelatorioVendasBalcao {
  total_vendas: number;
  total_faturamento: number;
  ticket_medio: number;
  vendas: Array<{
    id: number;
    data_venda: string;
    cliente_id: number;
    vendedor_id: number;
    valor_total: number;
    forma_pagamento: string;
  }>;
}

export class VendaService {
  /**
   * Cria uma nova venda de balcão
   */
  static async criarVendaBalcao(venda: VendaCreate): Promise<VendaResponse> {
    try {
      // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
      const response = await fetch(`${API_CONFIG.BASE_URL}/vendas/balcao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venda),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro ao criar venda: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar venda de balcão:', error);
      throw error;
    }
  }

  /**
   * Busca relatório de vendas de balcão
   */
  static async buscarRelatorioVendasBalcao(
    dataInicio?: string,
    dataFim?: string,
    vendedorId?: number
  ): Promise<RelatorioVendasBalcao> {
    try {
      const params = new URLSearchParams();
      if (dataInicio) params.append('data_inicio', dataInicio);
      if (dataFim) params.append('data_fim', dataFim);
      if (vendedorId) params.append('vendedor_id', vendedorId.toString());
      // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
      const url = `${API_CONFIG.BASE_URL}/vendas/balcao/relatorio?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro ao buscar relatório: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar relatório de vendas:', error);
      throw error;
    }
  }

  static calcularValorTotal(itens: ItemOrcamento[]): number {
    return itens.reduce((total, item) => {
      return total + (item.quantidade * item.preco_unitario);
    }, 0);
  }

  static formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  static validarVenda(
    clienteId: number | null,
    itens: ItemOrcamento[],
    formaPagamento: string
  ): { valido: boolean; erro?: string } {
    if (!clienteId) {
      return { valido: false, erro: 'Cliente não selecionado' };
    }
    if (itens.length === 0) {
      return { valido: false, erro: 'Carrinho vazio' };
    }
    if (!formaPagamento) {
      return { valido: false, erro: 'Forma de pagamento não selecionada' };
    }
    return { valido: true };
  }
}

// [AJUSTE 2024] Funções auxiliares exportadas de forma consistente
export const buscarHistoricoVendas = async (filtros: FiltrosHistoricoVendas = {}): Promise<VendaHistorico[]> => {
  try {
    const params = new URLSearchParams();
    if (filtros.cliente_id) params.append('cliente_id', filtros.cliente_id.toString());
    if (filtros.vendedor_id) params.append('vendedor_id', filtros.vendedor_id.toString());
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    const queryString = params.toString();
    // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
    const url = `${API_CONFIG.BASE_URL}/vendas/historico${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar histórico de vendas: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar histórico de vendas:', error);
    throw error;
  }
};

export const buscarClientes = async (): Promise<Cliente[]> => {
  try {
    // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
    const url = `${API_CONFIG.BASE_URL}/vendas/clientes/`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar clientes: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

export const buscarVendedores = async (): Promise<Vendedor[]> => {
  try {
    // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
    const url = `${API_CONFIG.BASE_URL}/vendas/vendedores/`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar vendedores: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error);
    throw error;
  }
}; 