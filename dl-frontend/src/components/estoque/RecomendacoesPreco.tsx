/**
 * 💰 RecomendacoesPreco - Componente de Recomendações de Preço
 * 
 * Exibe recomendações de precificação geradas pela IA
 * para produtos não vendidos há muito tempo.
 */

import { AlertTriangle, Brain, CheckCircle, Clock, DollarSign, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/config/api';

interface Recomendacao {
    produto_id: number;
    produto_nome: string;
    categoria: string;
    preco_atual: number;
    preco_sugerido: number;
    variacao_percentual: number;
    dias_sem_venda: number;
    nivel_urgencia: 'CRÍTICO' | 'ALTO' | 'MÉDIO';
    motivacao: string;
    estrategia: string;
    confianca: number;
}

interface RecomendacoesPrecoProps {
    diasLimite?: number;
    limit?: number;
    onAplicarRecomendacao?: (produtoId: number, novoPreco: number) => void;
}

export default function RecomendacoesPreco({
    diasLimite = 30,
    limit = 20,
    onAplicarRecomendacao
}: RecomendacoesPrecoProps) {
    const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
    const [loading, setLoading] = useState(false);
    const [aplicando, setAplicando] = useState<number | null>(null);

    const carregarRecomendacoes = async () => {
        try {
            setLoading(true);

            const data = await api.get(`/recomendacoes/preco?dias_limite=${diasLimite}&limit=${limit}`);

            if (data && typeof data === 'object' && 'data' in data && data.data && typeof data.data === 'object' && 'recomendacoes' in data.data) {
                setRecomendacoes(Array.isArray(data.data.recomendacoes) ? data.data.recomendacoes : []);
            }
        } catch (error) {
            console.error('Erro ao carregar recomendações:', error);
        } finally {
            setLoading(false);
        }
    };

    const aplicarRecomendacao = async (produtoId: number, novoPreco: number) => {
        try {
            setAplicando(produtoId);

            const data = await api.post('/recomendacoes/preco/aplicar', {
                produto_id: produtoId,
                novo_preco: novoPreco
            });

            if (data && typeof data === 'object') {
                // Chamar callback se fornecido
                onAplicarRecomendacao?.(produtoId, novoPreco);

                // Mostrar feedback
                alert('Preço aplicado com sucesso!');
            } else {
                const detail = (data && typeof data === 'object' && 'detail' in data) ? (data as any).detail : 'Erro desconhecido';
                alert(`Erro ao aplicar preço: ${detail}`);
            }
        } catch (error) {
            console.error('Erro ao aplicar recomendação:', error);
            alert('Erro ao aplicar recomendação');
        } finally {
            setAplicando(null);
        }
    };

    const getUrgenciaColor = (nivel: string) => {
        switch (nivel) {
            case 'CRÍTICO':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'ALTO':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'MÉDIO':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getUrgenciaIcon = (nivel: string) => {
        switch (nivel) {
            case 'CRÍTICO':
                return <AlertTriangle className="w-4 h-4" />;
            case 'ALTO':
                return <Clock className="w-4 h-4" />;
            case 'MÉDIO':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getVariacaoIcon = (variacao: number) => {
        if (variacao > 0) {
            return <TrendingUp className="w-4 h-4 text-green-600" />;
        } else if (variacao < 0) {
            return <TrendingDown className="w-4 h-4 text-red-600" />;
        }
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    };

    const getVariacaoColor = (variacao: number) => {
        if (variacao > 0) {
            return 'text-green-600 bg-green-50 border-green-200';
        } else if (variacao < 0) {
            return 'text-red-600 bg-red-50 border-red-200';
        }
        return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    useEffect(() => {
        carregarRecomendacoes();
    }, [diasLimite, limit]);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">💰 Recomendações de Preço</h3>
                        <p className="text-sm text-gray-600">
                            IA analisa produtos não vendidos há {diasLimite} dias
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={carregarRecomendacoes}
                        disabled={loading}
                        className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <Zap className="w-4 h-4" />
                        {loading ? 'Analisando...' : 'Atualizar'}
                    </button>
                </div>
            </div>

            {/* Lista de Recomendações */}
            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-600">IA analisando produtos...</p>
                    </div>
                ) : recomendacoes.length === 0 ? (
                    <div className="p-8 text-center">
                        <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Nenhuma recomendação encontrada</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Todos os produtos estão com preços adequados
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recomendacoes.map((recomendacao) => (
                            <div key={recomendacao.produto_id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    {/* Ícone de Urgência */}
                                    <div className="flex-shrink-0 mt-1">
                                        {getUrgenciaIcon(recomendacao.nivel_urgencia)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Header da Recomendação */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    {recomendacao.produto_nome}
                                                </h4>
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getUrgenciaColor(recomendacao.nivel_urgencia)}`}>
                                                    {recomendacao.nivel_urgencia}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">
                                                    {recomendacao.dias_sem_venda} dias sem venda
                                                </span>
                                            </div>
                                        </div>

                                        {/* Preços */}
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">Atual:</span>
                                                <span className="font-medium text-gray-900">
                                                    R$ {recomendacao.preco_atual.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">Sugerido:</span>
                                                <span className="font-medium text-green-600">
                                                    R$ {recomendacao.preco_sugerido.toFixed(2)}
                                                </span>
                                                {getVariacaoIcon(recomendacao.variacao_percentual)}
                                            </div>

                                            <div className={`px-2 py-1 rounded text-xs font-medium border ${getVariacaoColor(recomendacao.variacao_percentual)}`}>
                                                {recomendacao.variacao_percentual > 0 ? '+' : ''}{recomendacao.variacao_percentual.toFixed(1)}%
                                            </div>
                                        </div>

                                        {/* Motivação */}
                                        <div className="mb-3">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Motivo:</span> {recomendacao.motivacao}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium">Estratégia:</span> {recomendacao.estrategia}
                                            </p>
                                        </div>

                                        {/* Informações Adicionais */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>Categoria: {recomendacao.categoria}</span>
                                                <span>Confiança: {recomendacao.confianca}%</span>
                                            </div>

                                            <button
                                                onClick={() => aplicarRecomendacao(recomendacao.produto_id, recomendacao.preco_sugerido)}
                                                disabled={aplicando === recomendacao.produto_id}
                                                className="px-3 py-1 text-xs bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 rounded flex items-center gap-1"
                                            >
                                                {aplicando === recomendacao.produto_id ? (
                                                    <>
                                                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Aplicando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-3 h-3" />
                                                        Aplicar Preço
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {recomendacoes.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{recomendacoes.length} recomendação{recomendacoes.length !== 1 ? 's' : ''} da IA</span>
                        <span>Confiança média: {Math.round(recomendacoes.reduce((acc, r) => acc + r.confianca, 0) / recomendacoes.length)}%</span>
                    </div>
                </div>
            )}
        </div>
    );
} 