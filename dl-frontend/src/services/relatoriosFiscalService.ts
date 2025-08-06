// src/services/relatoriosFiscalService.ts
// Service para operações de relatórios fiscais e NF-e

import { API_CONFIG } from '@/config/api';

export interface NotaFiscal {
    id: string;
    data: string;
    valor: number;
    canal: string;
    status: string;
    cliente: string;
    cpf_cnpj: string;
    itens: number;
    forma_pagamento: string;
}

export interface NotaFiscalDetalhada {
    id: string;
    data: string;
    valor: number;
    canal: string;
    status: string;
    cliente: {
        nome: string;
        cpf_cnpj: string;
        email: string;
        telefone: string;
        endereco: {
            logradouro: string;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
        };
    };
    itens: Array<{
        codigo: string;
        descricao: string;
        quantidade: number;
        valor_unitario: number;
        valor_total: number;
    }>;
    forma_pagamento: string;
    observacoes: string;
    vendedor: string;
    data_emissao: string;
    chave_acesso: string;
}

export interface ResumoRelatorioFiscal {
    notas_fiscais: NotaFiscal[];
    total_registros: number;
    valor_total: number;
    status_autorizadas: number;
    status_emitidas: number;
    status_canceladas: number;
}

export interface FiltrosRelatorioFiscal {
    dataInicio?: string;
    dataFim?: string;
    canal?: string;
    status?: string;
    cliente?: string;
    valorMinimo?: number;
    valorMaximo?: number;
}

export class RelatoriosFiscalService {
    /**
     * Busca lista de notas fiscais eletrônicas
     * FUTURO: Integrar com módulo de vendas do Balcão (vendas_rapidas)
     * FUTURO: Cruzar com pedidos Shopify (webhook ou consulta manual)
     * FUTURO: Permitir escolha do usuário para emitir NF-e modelo 55
     */
    static async buscarNotasFiscais(filtros?: FiltrosRelatorioFiscal): Promise<ResumoRelatorioFiscal> {
        try {
            const params = new URLSearchParams();
            if (filtros?.dataInicio) params.append('data_inicio', filtros.dataInicio);
            if (filtros?.dataFim) params.append('data_fim', filtros.dataFim);
            if (filtros?.canal && filtros.canal !== 'todos') params.append('canal', filtros.canal);
            if (filtros?.status && filtros.status !== 'todos') params.append('status', filtros.status);
            if (filtros?.cliente) params.append('cliente', filtros.cliente);
            if (filtros?.valorMinimo) params.append('valor_minimo', filtros.valorMinimo.toString());
            if (filtros?.valorMaximo) params.append('valor_maximo', filtros.valorMaximo.toString());

            const response = await fetch(`${API_CONFIG.BASE_URL}/relatorios/nfe?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar notas fiscais: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar notas fiscais:', error);
            throw error;
        }
    }

    /**
     * Busca detalhes de uma nota fiscal específica
     */
    static async buscarNotaFiscalDetalhada(notaId: string): Promise<NotaFiscalDetalhada> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/relatorios/nfe/${notaId}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar detalhes da nota fiscal: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar detalhes da nota fiscal:', error);
            throw error;
        }
    }

    /**
     * Exporta relatório fiscal em CSV
     */
    static async exportarRelatorioCSV(filtros?: FiltrosRelatorioFiscal): Promise<Blob> {
        try {
            const params = new URLSearchParams();
            if (filtros?.dataInicio) params.append('data_inicio', filtros.dataInicio);
            if (filtros?.dataFim) params.append('data_fim', filtros.dataFim);
            if (filtros?.canal && filtros.canal !== 'todos') params.append('canal', filtros.canal);
            if (filtros?.status && filtros.status !== 'todos') params.append('status', filtros.status);

            const response = await fetch(`${API_CONFIG.BASE_URL}/relatorios/nfe/exportar-csv?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Erro ao exportar relatório: ${response.statusText}`);
            }

            return await response.blob();
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
            throw error;
        }
    }

    /**
     * Gera PDF de uma nota fiscal específica
     */
    static async gerarPDFNotaFiscal(notaId: string): Promise<Blob> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/relatorios/nfe/${notaId}/pdf`);

            if (!response.ok) {
                throw new Error(`Erro ao gerar PDF da nota fiscal: ${response.statusText}`);
            }

            return await response.blob();
        } catch (error) {
            console.error('Erro ao gerar PDF da nota fiscal:', error);
            throw error;
        }
    }

    /**
     * Verifica status do serviço de relatórios fiscais
     */
    static async verificarStatus(): Promise<any> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/relatorios/nfe/status`);

            if (!response.ok) {
                throw new Error(`Erro ao verificar status: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao verificar status do serviço fiscal:', error);
            throw error;
        }
    }
} 