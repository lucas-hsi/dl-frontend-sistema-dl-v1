import { api } from '@/config/api';

export interface Competidor {
    id: string;
    nome: string;
    preco: number;
    posicao: number;
    avaliacao: number;
    vendas: number;
    diferencial: string;
    status: 'acima' | 'abaixo' | 'igual';
}

export interface AnaliseConcorrencia {
    produto: string;
    precoMedio: number;
    precoRecomendado: number;
    posicaoRecomendada: number;
    competidores: Competidor[];
    insights: string[];
    recomendacoes: string[];
}

export interface AnaliseConcorrenciaResponse {
    success: boolean;
    termo_busca: string;
    total_concorrentes: number;
    estatisticas: {
        preco_medio: number;
        preco_minimo: number;
        preco_maximo: number;
        desvio_padrao: number;
    };
    concorrentes: Array<{
        id: string;
        nome: string;
        preco: number;
        posicao: number;
        avaliacao: number;
        vendas: number;
        diferencial: string;
        status: 'acima' | 'abaixo' | 'igual';
    }>;
    analise_ia: {
        insights: string[];
        recomendacoes: string[];
        preco_recomendado: number;
        posicao_recomendada: number;
    };
    timestamp: string;
}

class ConcorrenciaService {
    /**
     * Analisa concorrência para um produto específico
     */
    async analisarConcorrencia(termo: string, site: string = 'mercadolivre'): Promise<AnaliseConcorrenciaResponse> {
        try {
            const response = await api.post('/concorrencia/analisar', {
                termo,
                site
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao analisar concorrência:', error);
            throw new Error('Erro ao analisar concorrência. Tente novamente.');
        }
    }

    /**
     * Busca dados de concorrência em tempo real
     */
    async buscarConcorrenciaTempoReal(termo: string): Promise<AnaliseConcorrenciaResponse> {
        try {
            const response = await api.post('/concorrencia/buscar-tempo-real', {
                termo
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar concorrência:', error);
            throw new Error('Erro ao buscar dados de concorrência. Tente novamente.');
        }
    }

    /**
     * Obtém histórico de análise de concorrência
     */
    async obterHistoricoConcorrencia(produtoId: number): Promise<AnaliseConcorrenciaResponse[]> {
        try {
            const response = await api.get(`/concorrencia/historico/${produtoId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter histórico de concorrência:', error);
            throw new Error('Erro ao obter histórico de concorrência.');
        }
    }

    /**
     * Gera relatório de concorrência
     */
    async gerarRelatorioConcorrencia(dataInicio: string, dataFim: string): Promise<any> {
        try {
            const response = await api.post('/concorrencia/relatorio', {
                data_inicio: dataInicio,
                data_fim: dataFim
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao gerar relatório de concorrência:', error);
            throw new Error('Erro ao gerar relatório de concorrência.');
        }
    }

    /**
     * Converte resposta da API para formato do componente
     */
    converterParaFormatoComponente(response: AnaliseConcorrenciaResponse): AnaliseConcorrencia {
        return {
            produto: response.termo_busca,
            precoMedio: response.estatisticas.preco_medio,
            precoRecomendado: response.analise_ia.preco_recomendado,
            posicaoRecomendada: response.analise_ia.posicao_recomendada,
            competidores: response.concorrentes,
            insights: response.analise_ia.insights,
            recomendacoes: response.analise_ia.recomendacoes
        };
    }
}

export const concorrenciaService = new ConcorrenciaService();