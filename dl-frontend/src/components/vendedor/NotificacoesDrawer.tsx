import { Bell, CheckCircle, Clock, Info, Phone, Truck, Users, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Notificacao {
    id: number;
    type: 'success' | 'warning' | 'info' | 'urgent' | 'venda' | 'lead' | 'atraso';
    title: string;
    message: string;
    time: string;
    read: boolean;
    action?: string;
    actionUrl?: string;
    icon?: React.ReactNode;
    priority: 'alta' | 'media' | 'baixa';
}

interface NotificacoesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    vendedorId: number;
}

export default function NotificacoesDrawer({ isOpen, onClose, vendedorId }: NotificacoesDrawerProps) {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadNotificacoes();
        }
    }, [isOpen]);

    const loadNotificacoes = async () => {
        setLoading(true);
        try {
            // Simular dados de notificações em tempo real
            const mockNotificacoes: Notificacao[] = [
                {
                    id: 1,
                    type: 'venda',
                    title: 'Venda Realizada',
                    message: 'Orçamento #1234 foi fechado com sucesso!',
                    time: '2 min atrás',
                    read: false,
                    action: 'Ver detalhes',
                    actionUrl: '/vendedor/orcamentos/1234',
                    priority: 'alta'
                },
                {
                    id: 2,
                    type: 'urgent',
                    title: 'Cliente Aguardando',
                    message: 'João Silva aguarda retorno há 2h',
                    time: '15 min atrás',
                    read: false,
                    action: 'Ligar agora',
                    actionUrl: '/vendedor/clientes/ligar',
                    priority: 'alta'
                },
                {
                    id: 3,
                    type: 'lead',
                    title: 'Novo Lead',
                    message: 'Maria Santos entrou em contato via WhatsApp',
                    time: '1h atrás',
                    read: true,
                    action: 'Ver perfil',
                    actionUrl: '/vendedor/clientes/maria',
                    priority: 'media'
                },
                {
                    id: 4,
                    type: 'atraso',
                    title: 'Frete Atrasado',
                    message: 'Entrega #5678 está com atraso de 2h',
                    time: '3h atrás',
                    read: true,
                    action: 'Rastrear',
                    actionUrl: '/vendedor/entregas/5678',
                    priority: 'alta'
                },
                {
                    id: 5,
                    type: 'success',
                    title: 'Meta Atingida',
                    message: 'Você atingiu 85% da meta semanal!',
                    time: '4h atrás',
                    read: true,
                    action: 'Ver relatório',
                    actionUrl: '/vendedor/relatorios',
                    priority: 'baixa'
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
            case 'venda':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'lead':
                return <Users className="w-5 h-5 text-blue-600" />;
            case 'urgent':
                return <Phone className="w-5 h-5 text-red-600" />;
            case 'atraso':
                return <Truck className="w-5 h-5 text-orange-600" />;
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning':
                return <Zap className="w-5 h-5 text-yellow-600" />;
            default:
                return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'venda':
                return 'bg-green-50 border-green-200 hover:bg-green-100';
            case 'lead':
                return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
            case 'urgent':
                return 'bg-red-50 border-red-200 hover:bg-red-100';
            case 'atraso':
                return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
            case 'success':
                return 'bg-green-50 border-green-200 hover:bg-green-100';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
            default:
                return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'alta':
                return 'bg-red-500';
            case 'media':
                return 'bg-yellow-500';
            case 'baixa':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const handleMarkAsRead = (id: number) => {
        setNotificacoes(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const handleAction = (notificacao: Notificacao) => {
        if (notificacao.actionUrl) {
            window.location.href = notificacao.actionUrl;
        }
        handleMarkAsRead(notificacao.id);
    };

    const unreadCount = notificacoes.filter(n => !n.read).length;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Bell className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Notificações</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Estatísticas */}
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 px-3 py-1 rounded-full">
                            <span className="text-sm font-medium">
                                {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => setNotificacoes(prev => prev.map(n => ({ ...n, read: true })))}
                                className="text-xs underline hover:no-underline"
                            >
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 overflow-y-auto h-full">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : notificacoes.length > 0 ? (
                        <div className="space-y-3">
                            {notificacoes.map((notificacao) => (
                                <div
                                    key={notificacao.id}
                                    className={`p-4 rounded-xl border transition-all duration-200 ${getNotificationColor(notificacao.type)} ${!notificacao.read ? 'ring-2 ring-blue-200' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notificacao.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className={`font-semibold text-sm ${!notificacao.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {notificacao.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notificacao.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Clock className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            {notificacao.time}
                                                        </span>
                                                        {!notificacao.read && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                        )}
                                                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(notificacao.priority)}`}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {notificacao.action && (
                                                        <button
                                                            onClick={() => handleAction(notificacao)}
                                                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                                        >
                                                            {notificacao.action}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma notificação</h3>
                            <p className="text-gray-500">Você está em dia!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 