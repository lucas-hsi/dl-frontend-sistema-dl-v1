/**
 * 📊 AnaliseConcorrencia - Componente de Análise de Concorrência
 * 
 * Permite analisar concorrência em tempo real usando IA OpenManus
 * e Cloud Browser para capturar dados do Mercado Livre.
 */

import { AlertTriangle, CheckCircle, DollarSign, Search, Target, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface Concorrente {
    titulo: string;
    preco: number;
    vendedor: string;
    localizacao: string;
    link: string;
    site: string;
    score_qualidade: number;
}

interface Estatisticas {
    preco_medio: number;
    preco_minimo: number;
    preco_maximo: number;
    desvio_padrao: number;
    total_produtos: number;
    faixa_preco: string;
    variacao_percentual: number;
}

interface AnaliseIA {
    analise_precos?: {
        preco_medio_mercado: number;
        posicionamento_atual: string;
        preco_ideal_recomendado: number;
        justificativa_preco: string;
    };
    nivel_competicao?: string;
    recomendacao_estrategica?: string;
    insights?: {
        oportunidades: string[];
        riscos: string[];
        diferenciacao: string;
    };
    acoes_recomendadas?: {
        ajuste_preco: string;
        melhorias_anuncio: string[];
        estrategia_posicionamento: string;
    };
    score_confianca?: number;
}

interface AnaliseConcorrenciaProps {
    produtoAtual?: {
        nome: string;
        preco: number;
        categoria: string;
    };
    onAnaliseCompleta?: (analise: any) => void;
}

export default function AnaliseConcorrencia({ produtoAtual, onAnaliseCompleta }: AnaliseConcorrenciaProps) {
    const [termo, setTermo] = useState(produtoAtual?.nome || '');
    const [loading, setLoading] = useState(false);
    const [analise, setAnalise] = useState<any>(null);
    const [error, setError] = useState<string>('');

    const handleAnalisar = async () => {
        if (!termo.trim()) {
            setError('Digite um termo para análise');
            return;
        }

        setLoading(true);
        setError('');
        setAnalise(null);

        try {
            const response = await fetch('/api/ia/analisar-concorrencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    termo: termo.trim(),
                    site: 'mercadolivre',
                    produto_atual: produtoAtual
                }),
            });

            const data = await response.json();

            if (data.success) {
                setAnalise(data.analise);
                onAnaliseCompleta?.(data.analise);
            } else {
                setError('Erro na análise de concorrência');
            }
        } catch (err) {
            setError('Erro de conexão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const getRecomendacaoColor = (recomendacao: string) => {
        switch (recomendacao) {
            case 'ESCALAR':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'AJUSTAR':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'REPOSICIONAR':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getNivelCompeticaoColor = (nivel: string) => {
        switch (nivel) {
            case 'BAIXO':
                return 'text-green-600';
            case 'MODERADO':
                return 'text-yellow-600';
            case 'ALTO':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">📊 Análise de Concorrência</h3>
                    <p className="text-sm text-gray-600">Analise concorrentes em tempo real com IA</p>
                </div>
            </div>

            {/* Input de Busca */}
            <div className="mb-6">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={termo}
                            onChange={(e) => setTermo(e.target.value)}
                            placeholder="Ex: kit suspensão gol 1.6"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        />
                    </div>
                    <button
                        onClick={handleAnalisar}
                        disabled={loading || !termo.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Analisando...
                            </>
                        ) : (
                            <>
                                <Search className="w-4 h-4" />
                                Analisar
                            </>
                        )}
                    </button>
                </div>
                {error && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {error}
                    </p>
                )}
            </div>

            {/* Resultado da Análise */}
            {analise && (
                <div className="space-y-6">
                    {/* Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-600">Preço Médio</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-800">
                                R$ {analise.estatisticas?.preco_medio?.toFixed(2) || '0,00'}
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600">Concorrentes</span>
                            </div>
                            <div className="text-2xl font-bold text-green-800">
                                {analise.total_concorrentes || 0}
                            </div>
                        </div>

                        <div className="bg-yellow-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-600">Variação</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-800">
                                {analise.estatisticas?.variacao_percentual?.toFixed(1) || '0'}%
                            </div>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-600">Faixa</span>
                            </div>
                            <div className="text-lg font-bold text-purple-800">
                                {analise.estatisticas?.faixa_preco || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Análise da IA */}
                    {analise.analise_ia && (
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Análise Estratégica da IA
                            </h4>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recomendação */}
                                <div>
                                    <h5 className="font-semibold text-gray-700 mb-3">🎯 Recomendação Estratégica</h5>
                                    <div className={`inline-block px-4 py-2 rounded-lg border ${getRecomendacaoColor(analise.analise_ia.recomendacao_estrategica)}`}>
                                        <span className="font-medium">{analise.analise_ia.recomendacao_estrategica}</span>
                                    </div>
                                </div>

                                {/* Nível de Competição */}
                                <div>
                                    <h5 className="font-semibold text-gray-700 mb-3">⚔️ Nível de Competição</h5>
                                    <div className={`inline-block px-4 py-2 rounded-lg bg-gray-100 border ${getNivelCompeticaoColor(analise.analise_ia.nivel_competicao)}`}>
                                        <span className="font-medium">{analise.analise_ia.nivel_competicao}</span>
                                    </div>
                                </div>

                                {/* Preço Ideal */}
                                {analise.analise_ia.analise_precos && (
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-3">💰 Preço Ideal Recomendado</h5>
                                        <div className="text-2xl font-bold text-green-600">
                                            R$ {analise.analise_ia.analise_precos.preco_ideal_recomendado?.toFixed(2) || '0,00'}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {analise.analise_ia.analise_precos.justificativa_preco}
                                        </p>
                                    </div>
                                )}

                                {/* Score de Confiança */}
                                {analise.analise_ia.score_confianca && (
                                    <div>
                                        <h5 className="font-semibold text-gray-700 mb-3">🎯 Confiança da Análise</h5>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${analise.analise_ia.score_confianca}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-medium text-gray-700">
                                                {analise.analise_ia.score_confianca}%
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Insights */}
                            {analise.analise_ia.insights && (
                                <div className="mt-6">
                                    <h5 className="font-semibold text-gray-700 mb-3">💡 Insights Específicos</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-green-50 rounded-xl p-4">
                                            <h6 className="font-medium text-green-700 mb-2">🚀 Oportunidades</h6>
                                            <ul className="text-sm text-green-600 space-y-1">
                                                {analise.analise_ia.insights.oportunidades?.map((op: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-1">
                                                        <span className="text-green-500 mt-1">•</span>
                                                        {op}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-red-50 rounded-xl p-4">
                                            <h6 className="font-medium text-red-700 mb-2">⚠️ Riscos</h6>
                                            <ul className="text-sm text-red-600 space-y-1">
                                                {analise.analise_ia.insights.riscos?.map((risco: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-1">
                                                        <span className="text-red-500 mt-1">•</span>
                                                        {risco}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-blue-50 rounded-xl p-4">
                                            <h6 className="font-medium text-blue-700 mb-2">🎯 Diferenciação</h6>
                                            <p className="text-sm text-blue-600">
                                                {analise.analise_ia.insights.diferenciacao}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Ações Recomendadas */}
                            {analise.analise_ia.acoes_recomendadas && (
                                <div className="mt-6">
                                    <h5 className="font-semibold text-gray-700 mb-3">⚡ Ações Recomendadas</h5>
                                    <div className="space-y-3">
                                        {analise.analise_ia.acoes_recomendadas.ajuste_preco && (
                                            <div className="bg-yellow-50 rounded-xl p-4">
                                                <h6 className="font-medium text-yellow-700 mb-2">💰 Ajuste de Preço</h6>
                                                <p className="text-sm text-yellow-600">{analise.analise_ia.acoes_recomendadas.ajuste_preco}</p>
                                            </div>
                                        )}

                                        {analise.analise_ia.acoes_recomendadas.melhorias_anuncio && (
                                            <div className="bg-blue-50 rounded-xl p-4">
                                                <h6 className="font-medium text-blue-700 mb-2">📝 Melhorias no Anúncio</h6>
                                                <ul className="text-sm text-blue-600 space-y-1">
                                                    {analise.analise_ia.acoes_recomendadas.melhorias_anuncio.map((melhoria: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-1">
                                                            <span className="text-blue-500 mt-1">•</span>
                                                            {melhoria}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {analise.analise_ia.acoes_recomendadas.estrategia_posicionamento && (
                                            <div className="bg-purple-50 rounded-xl p-4">
                                                <h6 className="font-medium text-purple-700 mb-2">🎯 Estratégia de Posicionamento</h6>
                                                <p className="text-sm text-purple-600">{analise.analise_ia.acoes_recomendadas.estrategia_posicionamento}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Lista de Concorrentes */}
                    {analise.concorrentes && analise.concorrentes.length > 0 && (
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">📋 Concorrentes Encontrados</h4>
                            <div className="space-y-3">
                                {analise.concorrentes.slice(0, 5).map((concorrente: Concorrente, index: number) => (
                                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-800 mb-1">{concorrente.titulo}</h5>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>💰 R$ {concorrente.preco.toFixed(2)}</span>
                                                    <span>🏪 {concorrente.vendedor}</span>
                                                    <span>📍 {concorrente.localizacao}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 mb-1">Score</div>
                                                <div className="text-sm font-medium text-gray-700">{concorrente.score_qualidade}%</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 