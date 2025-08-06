import { Calendar, Clock, MapPin, Phone, Plus, Truck, Users, X } from 'lucide-react';
import { useState } from 'react';

interface EventoCalendario {
    id: number;
    titulo: string;
    data: string;
    tipo: 'entrega' | 'followup' | 'reuniao' | 'compromisso';
    hora: string;
    prioridade: 'alta' | 'media' | 'baixa';
    cliente?: string;
    endereco?: string;
    telefone?: string;
}

interface CalendarioDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    eventos: EventoCalendario[];
    vendedorId: number;
}

/**
 * Componente de drawer lateral para calendário de compromissos
 * Exibe eventos organizados por data e tipo
 */
export default function CalendarioDrawer({ isOpen, onClose, eventos, vendedorId }: CalendarioDrawerProps) {
    const [selectedEvent, setSelectedEvent] = useState<EventoCalendario | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const getEventColor = (tipo: string) => {
        switch (tipo) {
            case 'entrega':
                return 'bg-blue-500';
            case 'followup':
                return 'bg-green-500';
            case 'reuniao':
                return 'bg-purple-500';
            case 'compromisso':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getEventIcon = (tipo: string) => {
        switch (tipo) {
            case 'entrega':
                return <Truck className="w-4 h-4 text-white" />;
            case 'followup':
                return <Phone className="w-4 h-4 text-white" />;
            case 'reuniao':
                return <Users className="w-4 h-4 text-white" />;
            case 'compromisso':
                return <Calendar className="w-4 h-4 text-white" />;
            default:
                return <Clock className="w-4 h-4 text-white" />;
        }
    };

    const getPriorityColor = (prioridade: string) => {
        switch (prioridade) {
            case 'alta':
                return 'text-red-600';
            case 'media':
                return 'text-yellow-600';
            case 'baixa':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const eventosHoje = eventos.filter(evento => {
        const hoje = new Date().toDateString();
        const eventoData = new Date(evento.data).toDateString();
        return eventoData === hoje;
    });

    const eventosProximos = eventos.filter(evento => {
        const hoje = new Date();
        const eventoData = new Date(evento.data);
        const diffTime = eventoData.getTime() - hoje.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 7;
    });

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
            <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Calendário</h3>
                            <p className="text-sm text-gray-600">Seus compromissos</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Botão Adicionar */}
                <div className="p-6 border-b border-gray-200">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Compromisso
                    </button>
                </div>

                {/* Estatísticas */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{eventos.length}</div>
                            <div className="text-xs text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{eventosHoje.length}</div>
                            <div className="text-xs text-gray-600">Hoje</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{eventosProximos.length}</div>
                            <div className="text-xs text-gray-600">Próximos 7 dias</div>
                        </div>
                    </div>
                </div>

                {/* Lista de Eventos */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Eventos de Hoje */}
                    {eventosHoje.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Hoje
                            </h4>
                            <div className="space-y-3">
                                {eventosHoje.map((evento) => (
                                    <div
                                        key={evento.id}
                                        className="p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-all duration-200 cursor-pointer"
                                        onClick={() => setSelectedEvent(evento)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${getEventColor(evento.tipo)}`}>
                                                {getEventIcon(evento.tipo)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h5 className="font-medium text-sm text-gray-900">{evento.titulo}</h5>
                                                    <span className={`text-xs font-medium ${getPriorityColor(evento.prioridade)}`}>
                                                        {evento.prioridade}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 mb-2">{evento.hora}</p>
                                                {evento.cliente && (
                                                    <p className="text-xs text-gray-500">{evento.cliente}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Próximos Eventos */}
                    {eventosProximos.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Próximos Dias
                            </h4>
                            <div className="space-y-3">
                                {eventosProximos.map((evento) => (
                                    <div
                                        key={evento.id}
                                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                                        onClick={() => setSelectedEvent(evento)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${getEventColor(evento.tipo)}`}>
                                                {getEventIcon(evento.tipo)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h5 className="font-medium text-sm text-gray-900">{evento.titulo}</h5>
                                                    <span className={`text-xs font-medium ${getPriorityColor(evento.prioridade)}`}>
                                                        {evento.prioridade}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 mb-2">
                                                    {formatarData(evento.data)} • {evento.hora}
                                                </p>
                                                {evento.cliente && (
                                                    <p className="text-xs text-gray-500">{evento.cliente}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Estado Vazio */}
                    {eventos.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                Nenhum compromisso
                            </h4>
                            <p className="text-gray-600">
                                Adicione seus primeiros compromissos!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Detalhes */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Detalhes do Evento</h3>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${getEventColor(selectedEvent.tipo)}`}>
                                    {getEventIcon(selectedEvent.tipo)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedEvent.titulo}</h4>
                                    <p className="text-sm text-gray-600">{selectedEvent.tipo}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-gray-500">Data</div>
                                    <div className="font-medium">{formatarData(selectedEvent.data)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Hora</div>
                                    <div className="font-medium">{selectedEvent.hora}</div>
                                </div>
                            </div>

                            {selectedEvent.cliente && (
                                <div>
                                    <div className="text-xs text-gray-500">Cliente</div>
                                    <div className="font-medium">{selectedEvent.cliente}</div>
                                </div>
                            )}

                            {selectedEvent.endereco && (
                                <div>
                                    <div className="text-xs text-gray-500">Endereço</div>
                                    <div className="font-medium flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {selectedEvent.endereco}
                                    </div>
                                </div>
                            )}

                            {selectedEvent.telefone && (
                                <div>
                                    <div className="text-xs text-gray-500">Telefone</div>
                                    <div className="font-medium flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {selectedEvent.telefone}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={() => {
                                    // Ação de editar evento
                                    console.log('Editar evento:', selectedEvent.id);
                                    setSelectedEvent(null);
                                }}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 