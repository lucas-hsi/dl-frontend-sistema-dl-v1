/**
 * 🧠 NotificacoesIA - Componente de Notificações da IA
 * 
 * Exibe notificações de ações executadas pela IA
 * no painel de estoque.
 */

import { AlertTriangle, Bell, Brain, CheckCircle, Info, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/config/api';

interface Notificacao {
    id: number;
    tipo: string;
    titulo: string;
    mensagem: string;
    nivel: 'info' | 'warning' | 'success' | 'error';
    produto_id?: number;
    produto_nome?: string;
    mlb_id?: string;
    data_criacao: string;
    lida: boolean;
    executada_por: string;
}

interface NotificacoesIAProps {
    limit?: number;
    autoRefresh?: boolean;
    onNotificacaoClick?: (notificacao: Notificacao) => void;
}

export default function NotificacoesIA({
    limit = 10,
    autoRefresh = true,
    onNotificacaoClick
}: NotificacoesIAProps) {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [loading, setLoading] = useState(false);
    const [contador, setContador] = useState({ nao_lidas: 0, hoje: 0 });
    const [showAll, setShowAll] = useState(false);

    const carregarNotificacoes = async () => {
        try {
            setLoading(true);

            const data = await api.get(`/sincronizacao/notificacoes?limit=${limit}&nao_lidas=${!showAll}`);

            if (data && typeof data === 'object' && 'notificacoes' in data && Array.isArray(data.notificacoes)) {
                setNotificacoes(data.notificacoes);
            }
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        } finally {
            setLoading(false);
        }
    };

    const carregarContador = async () => {
        try {
            const data = await api.get('/sincronizacao/notificacoes/contador');

            if (data && typeof data === 'object' && 'contador' in data && typeof data.contador === 'object' && data.contador !== null) {
                setContador(data.contador as { nao_lidas: number; hoje: number });
            }
        } catch (error) {
            console.error('Erro ao carregar contador:', error);
        }
    };

    const marcarComoLida = async (notificacaoId: number) => {
        try {
            const response = await api.put(`/sincronizacao/notificacoes/${notificacaoId}/marcar-lida`, {});

            if (response && typeof response === 'object') {
                // Atualizar estado local
                setNotificacoes(prev =>
                    prev.map(n =>
                        n.id === notificacaoId ? { ...n, lida: true } : n
                    )
                );

                // Recarregar contador
                carregarContador();
            }
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
        }
    };

    const deletarNotificacao = async (notificacaoId: number) => {
        try {
            const response = await api.delete(`/sincronizacao/notificacoes/${notificacaoId}`);

            if (response && typeof response === 'object') {
                // Remover da lista local
                setNotificacoes(prev => prev.filter(n => n.id !== notificacaoId));

                // Recarregar contador
                carregarContador();
            }
        } catch (error) {
            console.error('Erro ao deletar notificação:', error);
        }
    };

    const getNivelIcon = (nivel: string) => {
        switch (nivel) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
            case 'error':
                return <X className="w-4 h-4 text-red-600" />;
            default:
                return <Info className="w-4 h-4 text-blue-600" />;
        }
    };

    const getNivelColor = (nivel: string) => {
        switch (nivel) {
            case 'success':
                return 'border-green-200 bg-green-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-blue-200 bg-blue-50';
        }
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        carregarNotificacoes();
        carregarContador();

        if (autoRefresh) {
            const interval = setInterval(() => {
                carregarContador();
            }, 30000); // 30 segundos

            return () => clearInterval(interval);
        }
    }, [showAll]);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">🧠 Notificações da IA</h3>
                        <p className="text-sm text-gray-600">
                            {contador.nao_lidas} não lidas • {contador.hoje} hoje
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        {showAll ? 'Apenas não lidas' : 'Ver todas'}
                    </button>

                    <button
                        onClick={carregarNotificacoes}
                        disabled={loading}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Zap className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Lista de Notificações */}
            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="p-4 text-center">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Carregando...</p>
                    </div>
                ) : notificacoes.length === 0 ? (
                    <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Nenhuma notificação</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notificacoes.map((notificacao) => (
                            <div
                                key={notificacao.id}
                                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notificacao.lida ? 'bg-blue-50' : ''
                                    }`}
                                onClick={() => onNotificacaoClick?.(notificacao)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        {getNivelIcon(notificacao.nivel)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {notificacao.titulo}
                                            </h4>
                                            {!notificacao.lida && (
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-600 mb-2">
                                            {notificacao.mensagem}
                                        </p>

                                        {notificacao.produto_nome && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                <span>Produto: {notificacao.produto_nome}</span>
                                                {notificacao.mlb_id && (
                                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                                        {notificacao.mlb_id}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                {formatarData(notificacao.data_criacao)}
                                            </span>

                                            <div className="flex items-center gap-1">
                                                {!notificacao.lida && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            marcarComoLida(notificacao.id);
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                                        title="Marcar como lida"
                                                    >
                                                        <CheckCircle className="w-3 h-3" />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deletarNotificacao(notificacao.id);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Deletar"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notificacoes.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Executado por: {notificacoes[0]?.executada_por || 'IA'}</span>
                        <span>{notificacoes.length} notificação{notificacoes.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            )}
        </div>
    );
} 