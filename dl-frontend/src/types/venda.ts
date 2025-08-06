// src/types/venda.ts



/**
 * Interface para cliente
 */
export interface Cliente {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
}

/**
 * Interface para vendedor
 */
export interface Vendedor {
  id: number;
  nome: string;
  email?: string;
}



/**
 * Interface para item de venda no histórico
 */
export interface VendaItemHistorico {
  id: number;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
}

/**
 * Interface para venda no histórico
 */
export interface VendaHistorico {
  id: number;
  data_venda: string;
  valor_total: number;
  forma_pagamento: string;
  cliente_nome: string;
  vendedor_nome: string;
  itens: VendaItemHistorico[];
}

/**
 * Interface para filtros do histórico de vendas
 */
export interface FiltrosHistoricoVendas {
  cliente_id?: number;
  vendedor_id?: number;
  data_inicio?: string;
  data_fim?: string;
} 