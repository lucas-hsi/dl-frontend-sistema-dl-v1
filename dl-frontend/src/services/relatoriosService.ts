// src/services/relatoriosService.ts
// Service para operações de relatórios e analytics

import { API_CONFIG } from '@/config/api';

export interface FiltrosRelatorio {
    dataInicio: string;
    dataFim: string;
    canal?: string;
    categoria?: string;
    vendedor?: string;
    status?: string;
    limite?: number;
    margem_minima?: number;
    margem_maxima?: number;
    roi_minimo?: number;
}

export interface CanalPerformance {
    canal: string;
    vendas: number;
    receita: number;
    conversao: number;
    custo: number;
    roi: number;
    visitantes: number;
    cliques: number;
    ctr: number;
    cpc: number;
    ticket_medio: number;
}

export interface AnalisePreco {
    produto_id: number;
    nome_produto: string;
    categoria: string;
    preco_atual: number;
    preco_medio_mercado: number;
    preco_minimo_mercado: number;
    preco_maximo_mercado: number;
    diferenca_percentual: number;
    posicao_ranking: number;
    margem_atual: number;
    margem_otima: number;
    recomendacao: 'aumentar' | 'manter' | 'diminuir';
    ultima_atualizacao: string;
    concorrentes_analisados: number;
    estoque_atual: number;
    posicionamento?: string;
}

export interface AnuncioROI {
    anuncio_id: number;
    titulo: string;
    canal: string;
    produto: string;
    investimento_total: number;
    receita_gerada: number;
    roi_percentual: number;
    lucro_absoluto: number;
    visualizacoes: number;
    cliques: number;
    conversoes: number;
    ctr: number;
    cpc: number;
    cpa: number;
    data_inicio: string;
    data_fim: string;
    status: 'ativo' | 'pausado' | 'finalizado';
    ranking_roi: number;
}

export class RelatoriosService {
    /**
     * Busca performance por canal
     */
    static async buscarPerformanceCanal(filtros: FiltrosRelatorio): Promise<CanalPerformance[]> {
        try {
            const params = new URLSearchParams();
            if (filtros.dataInicio) params.append('data_inicio', filtros.dataInicio);
            if (filtros.dataFim) params.append('data_fim', filtros.dataFim);
            if (filtros.canal && filtros.canal !== 'todos') params.append('canal', filtros.canal);
            if (filtros.vendedor && filtros.vendedor !== 'todos') params.append('vendedor', filtros.vendedor);

            const response = await fetch(`${API_CONFIG.BASE_URL}/relatorios/performance-canal?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar performance por canal: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar performance por canal:', error);
            throw error;
        }
    }

    /**
     * Busca análise de preços
     */
    static async buscarAnalisePrecos(filtros: FiltrosRelatorio): Promise<AnalisePreco[]> {
        try {
            const params = new URLSearchParams();
            if (filtros.dataInicio) params.append('data_inicio', filtros.dataInicio);
            if (filtros.dataFim) params.append('data_fim', filtros.dataFim);
            if (filtros.categoria && filtros.categoria !== 'todas') params.append('categoria', filtros.categoria);
            if (filtros.margem_minima !== undefined) params.append('margem_minima', filtros.margem_minima.toString());
            if (filtros.margem_maxima !== undefined) params.append('margem_maxima', filtros.margem_maxima.toString());

            const response = await fetch(`${API_CONFIG.BASE_URL}/relatorios/analise-precos?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar análise de preços: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar análise de preços:', error);
            throw error;
        }
    }

    /**
     * Busca ROI por anúncio
     */
    static async buscarROIAnuncio(filtros: FiltrosRelatorio): Promise<AnuncioROI[]> {
        try {
            const params = new URLSearchParams();
            if (filtros.dataInicio) params.append('data_inicio', filtros.dataInicio);
            if (filtros.dataFim) params.append('data_fim', filtros.dataFim);
            if (filtros.canal && filtros.canal !== 'todos') params.append('canal', filtros.canal);
            if (filtros.status && filtros.status !== 'todos') params.append('status', filtros.status);
            if (filtros.roi_minimo !== undefined) params.append('roi_minimo', filtros.roi_minimo.toString());

            const response = await fetch(`${API_CONFIG.BASE_URL}/relatorios/roi-anuncio?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar ROI por anúncio: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar ROI por anúncio:', error);
            throw error;
        }
    }

    /**
     * Exporta relatório
     */
    static async exportarRelatorio(tipo: string, filtros: FiltrosRelatorio): Promise<any> {
        try {
            const params = new URLSearchParams();
            Object.entries(filtros).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });

            const response = await fetch(`${API_CONFIG.BASE_URL}/relatorios/${tipo}/exportar?${params.toString()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao exportar relatório: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
            throw error;
        }
    }

    /**
     * Verifica status dos relatórios
     */
    static async verificarStatus(): Promise<any> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/relatorios/status`);

            if (!response.ok) {
                throw new Error(`Erro ao verificar status: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao verificar status dos relatórios:', error);
            throw error;
        }
    }
} 