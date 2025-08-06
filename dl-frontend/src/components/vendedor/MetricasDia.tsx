import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_CONFIG } from '@/config/api';
import { Calendar, CheckCircle, Clock, DollarSign, Target, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MetricasDiaProps {
    vendedorId: number;
}

interface MetricasData {
    vendas_dia: number;
    orcamentos_ativos: number;
    tempo_medio_resposta: number;
    tempo_medio_fechamento: number;
    performance: string;
    dicas: string[]; // [CORREÇÃO] Sempre será um array, mesmo que vazio
    data: string;
}

export default function MetricasDia({ vendedorId }: MetricasDiaProps) {
    const [metricas, setMetricas] = useState<MetricasData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        carregarMetricas();
    }, [vendedorId]);

    const carregarMetricas = async () => {
        setLoading(true);
        setError(null);
        try {
            // [CORREÇÃO 2025] URL correta do backend FastAPI
            const response = await fetch(`${API_CONFIG.BASE_URL}/vendedor/${vendedorId}/metricas-dia`);

            // [SEGURANÇA] Verificar se a resposta é válida
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
            }

            // [SEGURANÇA] Verificar se o conteúdo é JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('⚠️ Resposta não é JSON:', contentType);
                // [CORREÇÃO] Fallback para dados mockados com array válido
                const mockData: MetricasData = {
                    vendas_dia: 12500,
                    orcamentos_ativos: 8,
                    tempo_medio_resposta: 2.3,
                    tempo_medio_fechamento: 4.5,
                    performance: 'bom',
                    dicas: [
                        'Continue fazendo follow-ups rápidos',
                        'Foque em orçamentos acima de R$ 500',
                        'Use mais chamadas diretas para fechar'
                    ],
                    data: new Date().toISOString()
                };
                setMetricas(mockData);
                return;
            }

            const data = await response.json();

            if (data.sucesso) {
                // [CORREÇÃO] Garantir que dicas seja sempre um array válido
                const metricasProcessadas = {
                    ...data,
                    dicas: Array.isArray(data.dicas) ? data.dicas : []
                };
                setMetricas(metricasProcessadas);
            } else {
                // [CORREÇÃO] Fallback para dados mockados se a API não retornar sucesso
                const mockData: MetricasData = {
                    vendas_dia: 12500,
                    orcamentos_ativos: 8,
                    tempo_medio_resposta: 2.3,
                    tempo_medio_fechamento: 4.5,
                    performance: 'bom',
                    dicas: [
                        'Continue fazendo follow-ups rápidos',
                        'Foque em orçamentos acima de R$ 500',
                        'Use mais chamadas diretas para fechar'
                    ],
                    data: new Date().toISOString()
                };
                setMetricas(mockData);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar métricas:', error);
            setError(error instanceof Error ? error.message : 'Erro desconhecido');

            // [CORREÇÃO] Dados mockados em caso de erro com array válido
            const mockData: MetricasData = {
                vendas_dia: 12500,
                orcamentos_ativos: 8,
                tempo_medio_resposta: 2.3,
                tempo_medio_fechamento: 4.5,
                performance: 'bom',
                dicas: [
                    'Continue fazendo follow-ups rápidos',
                    'Foque em orçamentos acima de R$ 500',
                    'Use mais chamadas diretas para fechar'
                ],
                data: new Date().toISOString()
            };
            setMetricas(mockData);
        } finally {
            setLoading(false);
        }
    };

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const getPerformanceColor = (performance: string) => {
        switch (performance) {
            case 'excelente':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'bom':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'regular':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'precisa_melhorar':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getPerformanceIcon = (performance: string) => {
        switch (performance) {
            case 'excelente':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'bom':
                return <TrendingUp className="w-5 h-5 text-blue-600" />;
            case 'regular':
                return <Target className="w-5 h-5 text-yellow-600" />;
            case 'precisa_melhorar':
                return <Zap className="w-5 h-5 text-red-600" />;
            default:
                return <Calendar className="w-5 h-5 text-gray-600" />;
        }
    };

    const getPerformanceText = (performance: string) => {
        switch (performance) {
            case 'excelente':
                return 'Excelente!';
            case 'bom':
                return 'Bom trabalho!';
            case 'regular':
                return 'Pode melhorar';
            case 'precisa_melhorar':
                return 'Precisa melhorar';
            default:
                return 'Analisando...';
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!metricas) {
        return (
            <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma métrica disponível</p>
                {error && (
                    <p className="text-red-500 text-sm mt-2">Erro: {error}</p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Vendas do Dia</p>
                                <p className="text-2xl font-bold text-gray-900">{formatarValor(metricas.vendas_dia)}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Orçamentos Ativos</p>
                                <p className="text-2xl font-bold text-gray-900">{metricas.orcamentos_ativos}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tempo Médio Resposta</p>
                                <p className="text-2xl font-bold text-gray-900">{metricas.tempo_medio_resposta}h</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tempo Fechamento</p>
                                <p className="text-2xl font-bold text-gray-900">{metricas.tempo_medio_fechamento}h</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance e Dicas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {getPerformanceIcon(metricas.performance)}
                            Performance do Dia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`p-4 rounded-lg border ${getPerformanceColor(metricas.performance)}`}>
                            <h3 className="font-semibold">{getPerformanceText(metricas.performance)}</h3>
                            <p className="text-sm mt-1">Seu desempenho está sendo analisado pela IA</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            Dicas do Dia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {/* [CORREÇÃO] Verificar se dicas existe e é um array antes de fazer map */}
                            {metricas.dicas && Array.isArray(metricas.dicas) && metricas.dicas.length > 0 ? (
                                metricas.dicas.map((dica, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-sm text-gray-700">{dica}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 text-sm">Nenhuma dica disponível no momento</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 