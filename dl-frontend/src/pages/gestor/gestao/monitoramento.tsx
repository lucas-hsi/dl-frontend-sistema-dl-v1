import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutGestor from "@/components/layout/LayoutGestor";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    CheckCircle,
    Clock,
    Pause,
    Play,
    RefreshCw,
    Settings
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from '@/config/api';
import { getApiUrl } from '@/config/env';

interface Job {
    id: string;
    name: string;
    next_run: string | null;
    trigger: string;
}

interface Metrica {
    tipo: string;
    produtos_sync: number;
    erros: number;
    sucesso: boolean;
}

interface StatusAgendador {
    running: boolean;
    jobs: Job[];
    total_jobs: number;
}

interface MetricasAgendador {
    total_sincronizacoes: number;
    sucessos: number;
    falhas: number;
    taxa_sucesso: number;
    total_produtos_sync: number;
    total_erros: number;
    ultimas_metricas: Metrica[];
}

export default function MonitoramentoAgendador() {
    const [status, setStatus] = useState<StatusAgendador | null>(null);
    const [metricas, setMetricas] = useState<MetricasAgendador | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ [key: string]: { type: 'success' | 'error', text: string } }>({});

    // Função para obter a URL base da API - REMOVIDA: usar api.get() do cliente central

    useEffect(() => {
        carregarDados();
        // Atualizar dados a cada 30 segundos
        const interval = setInterval(carregarDados, 30000);
        return () => clearInterval(interval);
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);

            // Carregar status
            const statusData = await api.get('/agendador/status');
            setStatus((statusData && typeof statusData === 'object' && 'running' in statusData && 'jobs' in statusData && 'total_jobs' in statusData)
                ? statusData as StatusAgendador : null);

            // Carregar métricas
            const metricasData = await api.get('/agendador/metricas');
            setMetricas((metricasData && typeof metricasData === 'object'
                && 'total_sincronizacoes' in metricasData
                && 'sucessos' in metricasData
                && 'falhas' in metricasData
                && 'taxa_sucesso' in metricasData
                && 'total_produtos_sync' in metricasData
                && 'total_erros' in metricasData
                && 'ultimas_metricas' in metricasData)
                ? metricasData as MetricasAgendador : null);

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            showMessage('carregar_dados', 'error', 'Erro ao carregar dados do agendador');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (action: string, type: 'success' | 'error', text: string) => {
        setMessages(prev => ({ ...prev, [action]: { type, text } }));
        setTimeout(() => {
            setMessages(prev => {
                const newMessages = { ...prev };
                delete newMessages[action];
                return newMessages;
            });
        }, 5000);
    };

    const executarAcao = async (acao: string) => {
        try {
            setActionLoading(acao);
            const result = await api.post(`/agendador/${acao}`, {});
            showMessage(acao, 'success', (result && typeof result === 'object' && 'mensagem' in result) ? (result as any).mensagem : 'Ação executada com sucesso');
            await carregarDados(); // Recarregar dados
        } catch (error) {
            console.error(`Erro ao executar ${acao}:`, error);
            showMessage(acao, 'error', `Erro ao executar ${acao}`);
        } finally {
            setActionLoading(null);
        }
    };

    const formatarData = (dataString: string | null) => {
        if (!dataString) return 'Não agendado';
        return new Date(dataString).toLocaleString('pt-BR');
    };

    const getStatusColor = (running: boolean) => {
        return running ? 'bg-green-500' : 'bg-red-500';
    };

    const getStatusIcon = (running: boolean) => {
        return running ? CheckCircle : AlertTriangle;
    };

    const getJobStatusColor = (job: Job) => {
        if (!job.next_run) return 'bg-gray-100 text-gray-800';
        const nextRun = new Date(job.next_run);
        const now = new Date();
        const diffHours = (nextRun.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (diffHours < 1) return 'bg-green-100 text-green-800';
        if (diffHours < 24) return 'bg-yellow-100 text-yellow-800';
        return 'bg-blue-100 text-blue-800';
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <LayoutGestor>
                    <div className="w-full max-w-7xl mx-auto space-y-6">
                        <div className="flex items-center justify-center py-20">
                            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                            <span className="ml-2 text-gray-600">Carregando monitoramento...</span>
                        </div>
                    </div>
                </LayoutGestor>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <LayoutGestor>
                <div className="w-full max-w-7xl mx-auto space-y-6">
                    {/* Mensagens de feedback */}
                    {Object.entries(messages).map(([action, message]) => (
                        <div key={action} className={`rounded-xl p-4 ${message.type === 'success'
                            ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                            : 'bg-red-500/20 text-red-700 border border-red-500/30'
                            }`}>
                            <p className="font-medium">{message.text}</p>
                        </div>
                    ))}

                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Activity className="w-12 h-12" />
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold mb-1">Monitoramento do Sistema</h1>
                                    <p className="text-purple-100 opacity-90">Controle e monitoramento do agendador de sincronização</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">{status?.total_jobs || 0}</div>
                                <div className="text-purple-100 text-sm">jobs ativos</div>
                            </div>
                        </div>
                    </div>

                    {/* Status do Agendador */}
                    <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Status do Agendador</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => executarAcao('iniciar')}
                                    disabled={actionLoading === 'iniciar' || status?.running}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {actionLoading === 'iniciar' ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Play className="w-4 h-4" />
                                    )}
                                    Iniciar
                                </button>
                                <button
                                    onClick={() => executarAcao('parar')}
                                    disabled={actionLoading === 'parar' || !status?.running}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {actionLoading === 'parar' ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Pause className="w-4 h-4" />
                                    )}
                                    Parar
                                </button>
                                <button
                                    onClick={() => executarAcao('reiniciar')}
                                    disabled={actionLoading === 'reiniciar'}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {actionLoading === 'reiniciar' ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4" />
                                    )}
                                    Reiniciar
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-4 h-4 rounded-full ${getStatusColor(status?.running || false)}`}></div>
                                    <h3 className="font-semibold text-gray-800">Status</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {status?.running ? 'Ativo' : 'Inativo'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {status?.running ? 'Agendador funcionando' : 'Agendador parado'}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    <h3 className="font-semibold text-gray-800">Jobs Ativos</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {status?.total_jobs || 0}
                                </p>
                                <p className="text-sm text-gray-600">Jobs configurados</p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <BarChart3 className="w-5 h-5 text-green-500" />
                                    <h3 className="font-semibold text-gray-800">Taxa de Sucesso</h3>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {metricas?.taxa_sucesso ? `${metricas.taxa_sucesso.toFixed(1)}%` : 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {metricas?.total_sincronizacoes || 0} sincronizações
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Jobs Configurados */}
                    <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Jobs Configurados</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Job</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Próxima Execução</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Trigger</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {status?.jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Settings className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{job.name}</div>
                                                        <div className="text-sm text-gray-500">ID: {job.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-900">
                                                    {formatarData(job.next_run)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {job.trigger}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJobStatusColor(job)}`}>
                                                    {job.next_run ? 'Agendado' : 'Não agendado'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Métricas de Sincronização */}
                    {metricas && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Estatísticas Gerais</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total de Sincronizações</span>
                                        <span className="font-semibold">{metricas.total_sincronizacoes}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Sucessos</span>
                                        <span className="font-semibold text-green-600">{metricas.sucessos}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Falhas</span>
                                        <span className="font-semibold text-red-600">{metricas.falhas}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Taxa de Sucesso</span>
                                        <span className="font-semibold text-blue-600">{metricas.taxa_sucesso.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total de Produtos Sync</span>
                                        <span className="font-semibold">{metricas.total_produtos_sync}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total de Erros</span>
                                        <span className="font-semibold text-red-600">{metricas.total_erros}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Últimas Sincronizações</h2>
                                <div className="space-y-3">
                                    {metricas.ultimas_metricas.map((metrica, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {metrica.sucesso ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                                )}
                                                <div>
                                                    <div className="font-medium text-sm">{metrica.tipo}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {metrica.produtos_sync} produtos, {metrica.erros} erros
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${metrica.sucesso ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {metrica.sucesso ? 'Sucesso' : 'Falha'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ações Rápidas */}
                    <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Ações Rápidas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => window.open(`${getApiUrl()}/agendador/health`, '_blank')}
                                className="bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-3"
                            >
                                <Activity className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-semibold">Health Check</div>
                                    <div className="text-sm opacity-90">Verificar saúde do sistema</div>
                                </div>
                            </button>

                            <button
                                onClick={() => window.open(`${getApiUrl()}/agendador/metricas`, '_blank')}
                                className="bg-green-500 text-white p-4 rounded-xl hover:bg-green-600 transition-colors flex items-center gap-3"
                            >
                                <BarChart3 className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-semibold">Métricas Detalhadas</div>
                                    <div className="text-sm opacity-90">Ver métricas completas</div>
                                </div>
                            </button>

                            <button
                                onClick={() => window.open(`${getApiUrl()}/agendador/jobs`, '_blank')}
                                className="bg-purple-500 text-white p-4 rounded-xl hover:bg-purple-600 transition-colors flex items-center gap-3"
                            >
                                <Settings className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="font-semibold">Jobs Detalhados</div>
                                    <div className="text-sm opacity-90">Ver jobs completos</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </LayoutGestor>
        </ProtectedRoute>
    );
} 