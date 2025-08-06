import { Calendar, Clock, MapPin, Phone, Truck, Users, Zap } from 'lucide-react';
import { useState } from 'react';

interface EventoCalendario {
    id: number;
    titulo: string;
    data: string;
    hora: string;
    tipo: 'entrega' | 'followup' | 'reuniao' | 'compromisso';
    cliente?: string;
    endereco?: string;
    telefone?: string;
    prioridade: 'alta' | 'media' | 'baixa';
    descricao?: string;
}

interface CalendarioLateralProps {
    eventos: EventoCalendario[];
    vendedorId: number;
}

export default function CalendarioLateral({ eventos, vendedorId }: CalendarioLateralProps) {
    const [selectedEvent, setSelectedEvent] = useState<EventoCalendario | null>(null);
    const [showModal, setShowModal] = useState(false);

    const getEventColor = (tipo: string) => {
        switch (tipo) {
            case 'entrega':
                return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
            case 'followup':
                return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
            case 'reuniao':
                return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
            case 'compromisso':
                return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
        }
    };

    const getEventIcon = (tipo: string) => {
        switch (tipo) {
            case 'entrega':
                return <Truck className="w-4 h-4" />;
            case 'followup':
                return <Phone className="w-4 h-4" />;
            case 'reuniao':
                return <Users className="w-4 h-4" />;
            case 'compromisso':
                return <Clock className="w-4 h-4" />;
            default:
                return <Calendar className="w-4 h-4" />;
        }
    };

    const getPriorityColor = (prioridade: string) => {
        switch (prioridade) {
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

    const formatarData = (data: string) => {
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
        });
    };

    const handleEventClick = (evento: EventoCalendario) => {
        setSelectedEvent(evento);
        setShowModal(true);
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
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            {/* Header do Calendário */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Calendário Inteligente</h3>
                        <p className="text-gray-600">Seus compromissos</p>
                    </div>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg">
                    <Zap className="w-4 h-4" />
                </button>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-700">Hoje</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{eventosHoje.length}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700">Esta Semana</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{eventosProximos.length}</p>
                </div>
            </div>

            {/* Eventos de Hoje */}
            {eventosHoje.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Hoje ({eventosHoje.length})
                    </h4>
                    <div className="space-y-3">
                        {eventosHoje.map((evento) => (
                            <div
                                key={evento.id}
                                onClick={() => handleEventClick(evento)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${getEventColor(evento.tipo)}`}
                            >
                                <div className="flex items-center gap-3">
                                    {getEventIcon(evento.tipo)}
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-medium text-sm truncate">{evento.titulo}</h5>
                                        <p className="text-xs opacity-75">{evento.hora}</p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(evento.prioridade)}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Próximos Eventos */}
            {eventosProximos.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Próximos ({eventosProximos.length})
                    </h4>
                    <div className="space-y-3">
                        {eventosProximos.slice(0, 5).map((evento) => (
                            <div
                                key={evento.id}
                                onClick={() => handleEventClick(evento)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${getEventColor(evento.tipo)}`}
                            >
                                <div className="flex items-center gap-3">
                                    {getEventIcon(evento.tipo)}
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-medium text-sm truncate">{evento.titulo}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs opacity-75">{formatarData(evento.data)}</span>
                                            <span className="text-xs opacity-75">•</span>
                                            <span className="text-xs opacity-75">{evento.hora}</span>
                                        </div>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(evento.prioridade)}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Estado Vazio */}
            {eventos.length === 0 && (
                <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Nenhum compromisso</p>
                    <p className="text-gray-500 text-sm">Seu dia está livre!</p>
                </div>
            )}

            {/* Modal de Detalhes */}
            {showModal && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Detalhes do Compromisso</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${getEventColor(selectedEvent.tipo).replace('hover:bg-', 'bg-')}`}>
                                    {getEventIcon(selectedEvent.tipo)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedEvent.titulo}</h4>
                                    <p className="text-sm text-gray-600">{selectedEvent.data} às {selectedEvent.hora}</p>
                                </div>
                            </div>

                            {selectedEvent.cliente && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">{selectedEvent.cliente}</span>
                                </div>
                            )}

                            {selectedEvent.endereco && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">{selectedEvent.endereco}</span>
                                </div>
                            )}

                            {selectedEvent.telefone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">{selectedEvent.telefone}</span>
                                </div>
                            )}

                            {selectedEvent.descricao && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-700">{selectedEvent.descricao}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-600">Prioridade:</span>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedEvent.prioridade)} text-white`}>
                                    {selectedEvent.prioridade}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                Editar
                            </button>
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 