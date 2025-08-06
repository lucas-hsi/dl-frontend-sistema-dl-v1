import { api } from '@/config/api';

export interface ProdutoSugestao {
    id: string;
    nome: string;
    categoria: string;
    preco_atual: number;
    preco_sugerido: number;
    preco_mercado: number;
    diferenca_percentual: number;
    confianca_ia: number;
    volume_vendas: number;
    ultimo_ajuste: string;
    motivo_sugestao: string;
    urgencia: 'alta' | 'media' | 'baixa';
    canal_referencia: string;
}

export interface RecomendacaoResponse {
    success: boolean;
    total_produtos_analisados: number;
    total_recomendacoes: number;
    recomendacoes: Array<{
        produto_id: number;
        nome_produto: string;
        categoria: string;
        preco_atual: number;
        preco_sugerido: number;
        preco_mercado: number;
        diferenca_percentual: number;
        confianca: number;
        volume_vendas: number;
        ultimo_ajuste: string;
        motivacao: string;
        estrategia: string;
        urgencia: 'alta' | 'media' | 'baixa';
        canal_referencia: string;
    }>;
}

class RecomendacoesService {
    /**
     * Obtém recomendações de preço para produtos não vendidos
     */
    async obterRecomendacoesPreco(diasLimite: number = 30): Promise<RecomendacaoResponse> {
        try {
            const response = await api.get(`/recomendacoes/preco?dias_limite=${diasLimite}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter recomendações de preço:', error);
            throw new Error('Erro ao obter recomendações de preço. Tente novamente.');
        }
    }

    /**
     * Aplica uma recomendação de preço
     */
    async aplicarRecomendacaoPreco(produtoId: number, novoPreco: number): Promise<any> {
        try {
            const response = await api.post('/recomendacoes/aplicar-preco', {
                produto_id: produtoId,
                novo_preco: novoPreco
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao aplicar recomendação de preço:', error);
            throw new Error('Erro ao aplicar recomendação de preço.');
        }
    }

    /**
     * Obtém estatísticas de recomendações
     */
    async obterEstatisticasRecomendacoes(dias: number = 30): Promise<any> {
        try {
            const response = await api.get(`/recomendacoes/estatisticas?dias=${dias}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter estatísticas de recomendações:', error);
            throw new Error('Erro ao obter estatísticas de recomendações.');
        }
    }

    /**
     * Analisa todos os produtos para gerar recomendações
     */
    async analisarTodosProdutos(): Promise<RecomendacaoResponse> {
        try {
            const response = await api.post('/recomendacoes/analisar-todos');
            return response.data;
        } catch (error) {
            console.error('Erro ao analisar produtos:', error);
            throw new Error('Erro ao analisar produtos. Tente novamente.');
        }
    }

    /**
     * Converte resposta da API para formato do componente
     */
    converterParaFormatoComponente(response: RecomendacaoResponse): ProdutoSugestao[] {
        return response.recomendacoes.map(rec => ({
            id: rec.produto_id.toString(),
            nome: rec.nome_produto,
            categoria: rec.categoria,
            preco_atual: rec.preco_atual,
            preco_sugerido: rec.preco_sugerido,
            preco_mercado: rec.preco_mercado,
            diferenca_percentual: rec.diferenca_percentual,
            confianca_ia: rec.confianca,
            volume_vendas: rec.volume_vendas,
            ultimo_ajuste: rec.ultimo_ajuste,
            motivo_sugestao: rec.motivacao,
            urgencia: rec.urgencia,
            canal_referencia: rec.canal_referencia
        }));
    }
}

export const recomendacoesService = new RecomendacoesService();