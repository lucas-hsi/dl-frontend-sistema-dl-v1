// src/types/orcamento.ts

/**
 * Interface para um item de orçamento
 */
export interface ItemOrcamento {
  id_produto_tiny: string;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
}

/**
 * Interface para o payload de envio de orçamento
 */
export interface OrcamentoPayload {
  cliente_id: number;
  vendedor_id: number;
  valor_total: number;
  itens: ItemOrcamento[];
}

/**
 * Interface para a resposta da API de orçamento
 */
export interface OrcamentoResponse {
  id: number;
  cliente_id: number;
  vendedor_id: number;
  valor_total: number;
  itens: ItemOrcamento[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface para cliente
 */
export interface Cliente {
  id?: string;
  nome: string;
  email?: string;
  telefone?: string;
}

/**
 * Interface para produto
 */
export interface Produto {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

/**
 * Enum para status de orçamento
 */
export enum StatusOrcamento {
  PENDENTE = 'pendente',
  NEGOCIANDO = 'negociando',
  APROVADO = 'aprovado',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado'
}

/**
 * Interface para orçamento com status
 */
export interface OrcamentoComStatus extends OrcamentoResponse {
  status: StatusOrcamento;
  observacoes?: string;
  data_aprovacao?: string;
  data_conclusao?: string;
  cliente?: Cliente;
  vendedor?: {
    id: number;
    nome: string;
  };
}

/**
 * Interface para filtros de orçamento
 */
export interface FiltroOrcamento {
  status?: StatusOrcamento;
  cliente_id?: number;
  data_inicio?: string;
  data_fim?: string;
}

/**
 * Interface para resposta de lista de orçamentos
 */
export interface ListaOrcamentosResponse {
  orcamentos: OrcamentoComStatus[];
  total: number;
  pagina: number;
  por_pagina: number;
}

/**
 * Interface para mudança de status
 */
export interface MudancaStatusPayload {
  orcamento_id: number;
  novo_status: StatusOrcamento;
  observacoes?: string;
}

/**
 * Interface para reabrir orçamento
 */
export interface ReabrirOrcamentoPayload {
  orcamento_id: number;
  vendedor_id: number;
}

/**
 * Interface para resposta de PDF
 */
export interface PDFResponse {
  pdf_url: string;
  filename: string;
  size: number;
}

/**
 * Interface para envio de WhatsApp
 */
export interface WhatsAppPayload {
  orcamento_id: number;
  telefone: string;
  mensagem?: string;
}

/**
 * Interface para resposta de WhatsApp
 */
export interface WhatsAppResponse {
  success: boolean;
  message: string;
  message_id?: string;
}

/**
 * Interface para estatísticas de orçamentos
 */
export interface EstatisticasOrcamentos {
  total: number;
  por_status: {
    [key in StatusOrcamento]: number;
  };
  valor_total: number;
  valor_medio: number;
  periodo: {
    inicio: string;
    fim: string;
  };
} 