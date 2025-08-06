import { Bell, CheckCircle, Info, Phone, Truck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Notificacao {
    id: number;
    type: 'success' | 'urgent' | 'info' | 'warning';
    title: string;
    message: string;
    time: string;
    read: boolean;
    action?: string;
    url?: string;
}

interface DrawerNotificacoesProps {
    isOpen: boolean;
    onClose: () => void;
    vendedorId: number;
}

/**
 * Componente de drawer lateral para notificações em tempo real
 * Exibe notificações com tipos, horários e ações
 */
export default function DrawerNotificacoes({ isOpen, onClose, vendedorId }: DrawerNotificacoesProps) {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadNotificacoes();
        }
    }, [isOpen, vendedorId]);

    const loadNotificacoes = async () => {
        setLoading(true);
        try {
            // Simular carregamento de notificações
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockNotificacoes: Notificacao[] = [
                {
                    id: 1,
                    type: 'success',
                    title: 'Venda Realizada',
                    message: 'Orçamento #1234 foi fechado com sucesso!',
                    time: '2 min atrás',
                    read: false,
                    action: 'Ver detalhes',
                    url: '/vendedor/orcamentos'
                },
                {
                    id: 2,
                    type: 'urgent',
                    title: 'Cliente Aguardando',
                    message: 'João Silva aguarda retorno há 2h',
                    time: '15 min atrás',
                    read: false,
                    action: 'Ligar agora',
                    url: '/vendedor/clientes'
                },
                {
                    id: 3,
                    type: 'info',
                    title: 'Novo Lead',
                    message: 'Maria Santos entrou em contato via WhatsApp',
                    time: '1h atrás',
                    read: true
                },
                {
                    id: 4,
                    type: 'warning',
                    title: 'Frete Atrasado',
                    message: 'Entrega #5678 está com atraso',
                    time: '3h atrás',
                    read: true
                }
            ];

            setNotificacoes(mockNotificacoes);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        } finally {
            setLoading(false);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'urgent':
                return <Phone className="w-5 h-5 text-red-600" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-600" />;
            case 'warning':
                return <Truck className="w-5 h-5 text-orange-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'urgent':
                return 'bg-red-50 border-red-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            case 'warning':
                return 'bg-orange-50 border-orange-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getPriorityColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'text-green-600';
            case 'urgent':
                return 'text-red-600';
            case 'info':
                return 'text-blue-600';
            case 'warning':
                return 'text-orange-600';
            default:
                return 'text-gray-600';
        }
    };

    const handleMarkAsRead = (notificacaoId: number) => {
        setNotificacoes(prev =>
            prev.map(n =>
                n.id === notificacaoId ? { ...n, read: true } : n
            )
        );
    };

    const handleAction = (notificacao: Notificacao) => {
        if (notificacao.url) {
            window.open(notificacao.url, '_blank');
        }
        handleMarkAsRead(notificacao.id);
    };

    const unreadCount = notificacoes.filter(n => !n.read).length;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                            <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Notificações</h3>
                            <p className="text-sm text-gray-600">{unreadCount} não lidas</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Estatísticas */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{notificacoes.length}</div>
                            <div className="text-xs text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
                            <div className="text-xs text-gray-600">Não lidas</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {notificacoes.filter(n => n.type === 'success').length}
                            </div>
                            <div className="text-xs text-gray-600">Sucessos</div>
                        </div>
                    </div>
                </div>

                {/* Lista de Notificações */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : notificacoes.length > 0 ? (
                        <div className="space-y-4">
                            {notificacoes.map((notificacao) => (
                                <div
                                    key={notificacao.id}
                                    className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${notificacao.read
                                            ? 'opacity-60'
                                            : 'bg-white shadow-sm'
                                        } ${getNotificationColor(notificacao.type)}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            {getNotificationIcon(notificacao.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`font-semibold text-sm ${getPriorityColor(notificacao.type)}`}>
                                                    {notificacao.title}
                                                </h4>
                                                <span className="text-xs text-gray-500">
                                                    {notificacao.time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-3">
                                                {notificacao.message}
                                            </p>
                                            {notificacao.action && (
                                                <button
                                                    onClick={() => handleAction(notificacao)}
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    {notificacao.action}
                                                </button>
                                            )}
                                        </div>
                                        {!notificacao.read && (
                                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                Nenhuma notificação
                            </h4>
                            <p className="text-gray-600">
                                Você está em dia com todas as notificações!
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={() => {
                            setNotificacoes(prev => prev.map(n => ({ ...n, read: true })));
                        }}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                        Marcar todas como lidas
                    </button>
                </div>
            </div>
        </>
    );
} 