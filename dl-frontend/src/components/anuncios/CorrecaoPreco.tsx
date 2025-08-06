/**
 * 🔧 CorrecaoPreco - Componente de Correção Automática de Preço
 * 
 * Permite corrigir preços de anúncios com 1 clique baseado
 * na sugestão da IA.
 */

import { AlertTriangle, CheckCircle, DollarSign, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

interface CorrecaoPrecoProps {
    anuncioId: number;
    precoAtual: number;
    precoSugerido?: number;
    acaoIA?: string;
    desvioPercentual?: number;
    onCorrecaoSucesso?: (resultado: any) => void;
    onCorrecaoErro?: (erro: string) => void;
}

export default function CorrecaoPreco({
    anuncioId,
    precoAtual,
    precoSugerido,
    acaoIA,
    desvioPercentual,
    onCorrecaoSucesso,
    onCorrecaoErro
}: CorrecaoPrecoProps) {
    const [loading, setLoading] = useState(false);
    const [corrigido, setCorrigido] = useState(false);

    // Verificar se deve mostrar o botão
    const deveMostrarBotao = () => {
        if (!precoSugerido || !acaoIA) return false;

        // Mostrar apenas para AJUSTAR ou REPOSICIONAR
        if (!['AJUSTAR', 'REPOSICIONAR'].includes(acaoIA)) return false;

        // Mostrar apenas se há desvio significativo
        if (!desvioPercentual || Math.abs(desvioPercentual) < 10) return false;

        return true;
    };

    const handleCorrigirPreco = async () => {
        if (!precoSugerido) return;

        try {
            setLoading(true);

            const response = await fetch(`/api/anuncios/${anuncioId}/corrigir-preco`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    novo_preco: precoSugerido
                }),
            });

            const data = await response.json();

            if (data.success) {
                setCorrigido(true);
                onCorrecaoSucesso?.(data);
            } else {
                onCorrecaoErro?.(data.message || 'Erro na correção');
            }
        } catch (error) {
            console.error('Erro ao corrigir preço:', error);
            onCorrecaoErro?.('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    const getVariacaoPreco = () => {
        if (!precoSugerido) return 0;
        return ((precoSugerido - precoAtual) / precoAtual) * 100;
    };

    const getStatusColor = () => {
        const variacao = getVariacaoPreco();
        if (variacao > 0) return 'text-green-600';
        if (variacao < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getStatusIcon = () => {
        const variacao = getVariacaoPreco();
        if (variacao > 0) return <TrendingUp className="w-4 h-4" />;
        if (variacao < 0) return <TrendingDown className="w-4 h-4" />;
        return <DollarSign className="w-4 h-4" />;
    };

    if (!deveMostrarBotao()) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">🔧 Correção com IA</h4>
                        <p className="text-sm text-gray-600">
                            {acaoIA === 'AJUSTAR' ? 'Ajuste recomendado' : 'Reposicionamento necessário'}
                        </p>
                    </div>
                </div>

                {corrigido ? (
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Corrigido via IA</span>
                    </div>
                ) : (
                    <button
                        onClick={handleCorrigirPreco}
                        disabled={loading}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2 font-medium"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Corrigindo...
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4" />
                                Corrigir com 1 clique
                            </>
                        )}
                    </button>
                )}
            </div>

            {precoSugerido && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 border">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Preço Atual</span>
                        </div>
                        <p className="text-lg font-bold text-gray-800">
                            R$ {precoAtual.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border">
                        <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon()}
                            <span className="text-sm text-gray-600">Preço Sugerido</span>
                        </div>
                        <p className={`text-lg font-bold ${getStatusColor()}`}>
                            R$ {precoSugerido.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Variação</span>
                        </div>
                        <p className={`text-lg font-bold ${getStatusColor()}`}>
                            {getVariacaoPreco() > 0 ? '+' : ''}{getVariacaoPreco().toFixed(1)}%
                        </p>
                    </div>
                </div>
            )}

            {desvioPercentual && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                            Produto {Math.abs(desvioPercentual).toFixed(1)}% {desvioPercentual > 0 ? 'acima' : 'abaixo'} da média do mercado
                        </span>
                    </div>
                </div>
            )}

            {corrigido && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">
                            Preço corrigido automaticamente via IA. Registrado no histórico.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
} 