/**
 * 🚨 AlertasConcorrencia - Componente de Alertas de Concorrência
 * 
 * Exibe alertas de produtos com preços fora da faixa ideal
 * e permite reanálise individual.
 */

import { AlertTriangle, Clock, DollarSign, Eye, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AlertaConcorrencia {
    id: number;
    produto_id: number;
    produto_nome: string;
    produto_categoria: string;
    preco_atual: number;
    preco_medio_concorrencia: number;
    desvio_percentual: number;
    nivel_concorrencia: string;
    acao_recomendada: string;
    motivo_alerta: string;
    data_analisada: string;
    score_confianca: number;
}

interface AlertasConcorrenciaProps {
    onReanalisar?: (produtoId: number) => void;
    onVerDetalhes?: (produtoId: number) => void;
}

export default function AlertasConcorrencia({ onReanalisar, onVerDetalhes }: AlertasConcorrenciaProps) {
    const [alertas, setAlertas] = useState<AlertaConcorrencia[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);

    useEffect(() => {
        carregarAlertas();
    }, []);

    const carregarAlertas = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/concorrencia/historico/alertas-recentes?dias=7&limit=20');
            const data = await response.json();

            if (data.success) {
                setAlertas(data.alertas);
            } else {
                setError('Erro ao carregar alertas');
            }
        } catch (err) {
            setError('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    const handleReanalisar = async (produtoId: number) => {
        try {
            setLoading(true);

            const response = await fetch('/api/concorrencia/analisar-produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ produto_id: produtoId }),
            });

            const data = await response.json();

            if (data.success) {
                // Recarregar alertas após reanálise
                await carregarAlertas();
                onReanalisar?.(produtoId);
            } else {
                setError('Erro na reanálise');
            }
        } catch (err) {
            setError('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (desvio: number) => {
        if (Math.abs(desvio) <= 10) return 'text-green-600 bg-green-50 border-green-200';
        if (Math.abs(desvio) <= 25) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getStatusIcon = (desvio: number) => {
        if (Math.abs(desvio) <= 10) return '🟢';
        if (Math.abs(desvio) <= 25) return '🟡';
        return '🔴';
    };

    const getAcaoColor = (acao: string) => {
        switch (acao) {
            case 'ESCALAR':
                return 'text-green-600 bg-green-50';
            case 'AJUSTAR':
                return 'text-yellow-600 bg-yellow-50';
            case 'REPOSICIONAR':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const alertasFiltrados = showOnlyAlerts
        ? alertas.filter(a => Math.abs(a.desvio_percentual) > 25)
        : alertas;

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">🚨 Alertas de Concorrência</h3>
                        <p className="text-sm text-gray-600">Produtos com preços fora da faixa ideal</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={showOnlyAlerts}
                            onChange={(e) => setShowOnlyAlerts(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <span className="text-gray-600">Apenas críticos</span>
                    </label>

                    <button
                        onClick={carregarAlertas}
                        disabled={loading}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 flex items-center gap-1"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Carregando alertas...</p>
                </div>
            )}

            {/* Alertas */}
            {!loading && alertasFiltrados.length > 0 ? (
                <div className="space-y-4">
                    {alertasFiltrados.map((alerta) => (
                        <div
                            key={alerta.id}
                            className={`border rounded-xl p-4 ${getStatusColor(alerta.desvio_percentual)}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">{getStatusIcon(alerta.desvio_percentual)}</span>
                                        <h4 className="font-semibold text-gray-800">{alerta.produto_nome}</h4>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                            {alerta.produto_categoria}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Preço Atual</p>
                                                <p className="font-semibold">R$ {alerta.preco_atual.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Média Mercado</p>
                                                <p className="font-semibold">R$ {alerta.preco_medio_concorrencia.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {alerta.desvio_percentual > 0 ? (
                                                <TrendingUp className="w-4 h-4 text-red-500" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-green-500" />
                                            )}
                                            <div>
                                                <p className="text-sm text-gray-600">Desvio</p>
                                                <p className={`font-semibold ${alerta.desvio_percentual > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {alerta.desvio_percentual > 0 ? '+' : ''}{alerta.desvio_percentual.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getAcaoColor(alerta.acao_recomendada)}`}>
                                            {alerta.acao_recomendada}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-gray-500">Confiança:</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-1">
                                                <div
                                                    className="bg-green-500 h-1 rounded-full"
                                                    style={{ width: `${alerta.score_confianca}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium">{alerta.score_confianca}%</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700 mb-2">{alerta.motivo_alerta}</p>

                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>Analisado em {formatarData(alerta.data_analisada)}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                    <button
                                        onClick={() => handleReanalisar(alerta.produto_id)}
                                        disabled={loading}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center gap-1"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        Reanalisar
                                    </button>

                                    <button
                                        onClick={() => onVerDetalhes?.(alerta.produto_id)}
                                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                        Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : !loading ? (
                <div className="text-center py-8">
                    <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                        {showOnlyAlerts ? 'Nenhum alerta crítico encontrado' : 'Nenhum alerta encontrado'}
                    </p>
                </div>
            ) : null}

            {/* Estatísticas */}
            {alertas.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{alertas.length}</div>
                            <div className="text-xs text-gray-600">Total de Alertas</div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {alertas.filter(a => Math.abs(a.desvio_percentual) > 25).length}
                            </div>
                            <div className="text-xs text-gray-600">Críticos</div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {alertas.filter(a => Math.abs(a.desvio_percentual) <= 25 && Math.abs(a.desvio_percentual) > 10).length}
                            </div>
                            <div className="text-xs text-gray-600">Atenção</div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {alertas.filter(a => Math.abs(a.desvio_percentual) <= 10).length}
                            </div>
                            <div className="text-xs text-gray-600">Ideais</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 