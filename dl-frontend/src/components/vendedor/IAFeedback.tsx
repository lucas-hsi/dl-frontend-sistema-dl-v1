import { Brain, Clock, Lightbulb, MessageSquare, Phone, Target, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface SugestaoIA {
    id: string;
    titulo: string;
    descricao: string;
    tipo: 'followup' | 'venda' | 'cliente' | 'performance' | 'oportunidade';
    prioridade: 'alta' | 'media' | 'baixa';
    acao: string;
    tempoEstimado: string;
    impacto: string;
    rota?: string;
    dados?: {
        orcamentosPerdidos?: number;
        clientesPendentes?: number;
        valorOportunidade?: number;
        tempoMedio?: number;
    };
}

interface IAFeedbackProps {
    vendedorId: number;
}

/**
 * Componente de feedback e sugestões da IA para o vendedor
 * Exibe recomendações inteligentes baseadas no comportamento
 */
export default function IAFeedback({ vendedorId }: IAFeedbackProps) {
    const router = useRouter();
    const [selectedSugestao, setSelectedSugestao] = useState<SugestaoIA | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const sugestoes: SugestaoIA[] = [
        {
            id: 'followup-urgente',
            titulo: 'Follow-up Urgente',
            descricao: 'Você perdeu 2 orçamentos ontem por falta de retorno. Que tal enviar um follow-up agora?',
            tipo: 'followup',
            prioridade: 'alta',
            acao: 'Enviar Follow-up',
            tempoEstimado: '5 min',
            impacto: 'Alto impacto',
            rota: '/vendedor/clientes', // ✅ CORREÇÃO: Usar rota real existente
            dados: {
                orcamentosPerdidos: 2,
                valorOportunidade: 3500
            }
        },
        {
            id: 'cliente-pendente',
            titulo: 'Cliente Pendente',
            descricao: 'João Silva aguarda retorno há 2h. É um cliente VIP com histórico de compras.',
            tipo: 'cliente',
            prioridade: 'alta',
            acao: 'Ligar Agora',
            tempoEstimado: '3 min',
            impacto: 'Alto impacto',
            rota: '/vendedor/clientes', // ✅ CORREÇÃO: Usar rota real existente
            dados: {
                clientesPendentes: 1,
                valorOportunidade: 2800
            }
        },
        {
            id: 'oportunidade-venda',
            titulo: 'Oportunidade de Venda',
            descricao: 'Maria Santos sempre compra em janeiro. Envie uma proposta personalizada.',
            tipo: 'oportunidade',
            prioridade: 'media',
            acao: 'Enviar Proposta',
            tempoEstimado: '10 min',
            impacto: 'Médio impacto',
            rota: '/vendedor/orcamentos', // ✅ CORREÇÃO: Usar rota real existente
            dados: {
                valorOportunidade: 4200
            }
        },
        {
            id: 'performance-melhorar',
            titulo: 'Melhorar Performance',
            descricao: 'Seu tempo médio de resposta aumentou 15%. Foque em respostas mais rápidas.',
            tipo: 'performance',
            prioridade: 'media',
            acao: 'Ver Métricas',
            tempoEstimado: '2 min',
            impacto: 'Médio impacto',
            rota: '/vendedor/historico', // ✅ CORREÇÃO: Usar rota real existente
            dados: {
                tempoMedio: 3.2
            }
        }
    ];

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'followup':
                return 'from-blue-500 to-blue-600';
            case 'venda':
                return 'from-green-500 to-green-600';
            case 'cliente':
                return 'from-purple-500 to-purple-600';
            case 'performance':
                return 'from-orange-500 to-orange-600';
            case 'oportunidade':
                return 'from-pink-500 to-pink-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'followup':
                return <MessageSquare className="w-6 h-6 text-white" />;
            case 'venda':
                return <TrendingUp className="w-6 h-6 text-white" />;
            case 'cliente':
                return <Phone className="w-6 h-6 text-white" />;
            case 'performance':
                return <Target className="w-6 h-6 text-white" />;
            case 'oportunidade':
                return <Lightbulb className="w-6 h-6 text-white" />;
            default:
                return <Brain className="w-6 h-6 text-white" />;
        }
    };

    const getPrioridadeColor = (prioridade: string) => {
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

    const handleAcao = async (sugestao: SugestaoIA) => {
        setLoading(true);
        try {
            console.log('Executando ação:', sugestao.acao);

            if (sugestao.rota) {
                // ✅ CORREÇÃO: Navegar para rotas reais existentes
                router.push(sugestao.rota);
            } else {
                // Fallback para ações sem rota específica
                console.log('Ação executada:', sugestao.acao);
                alert(`✅ ${sugestao.acao} executado com sucesso!\n\n${sugestao.descricao}`);
            }

            // Fechar modal após ação
            setShowModal(false);
            setSelectedSugestao(null);
        } catch (error) {
            console.error('Erro na ação:', error);
        } finally {
            setLoading(false);
        }
    };

    const sugestaoPrincipal = sugestoes[0]; // Primeira sugestão como principal

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">IA Direcionamento</h3>
                        <p className="text-gray-600">Sugestões inteligentes</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-600">IA Online</span>
                </div>
            </div>

            {/* Sugestão Principal */}
            {sugestaoPrincipal && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${getTipoColor(sugestaoPrincipal.tipo)}`}>
                            {getTipoIcon(sugestaoPrincipal.tipo)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{sugestaoPrincipal.titulo}</h4>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(sugestaoPrincipal.prioridade)} text-white`}>
                                    {sugestaoPrincipal.prioridade}
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{sugestaoPrincipal.descricao}</p>

                            {/* Dados da Sugestão */}
                            {sugestaoPrincipal.dados && (
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {sugestaoPrincipal.dados.orcamentosPerdidos && (
                                        <div className="bg-red-50 p-2 rounded-lg border border-red-200">
                                            <div className="text-xs text-red-600 font-medium">Orçamentos Perdidos</div>
                                            <div className="text-lg font-bold text-red-700">{sugestaoPrincipal.dados.orcamentosPerdidos}</div>
                                        </div>
                                    )}
                                    {sugestaoPrincipal.dados.valorOportunidade && (
                                        <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                                            <div className="text-xs text-green-600 font-medium">Valor Oportunidade</div>
                                            <div className="text-lg font-bold text-green-700">
                                                R$ {sugestaoPrincipal.dados.valorOportunidade.toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {sugestaoPrincipal.tempoEstimado}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Target className="w-3 h-3" />
                                        {sugestaoPrincipal.impacto}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAcao(sugestaoPrincipal)}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Executando...' : sugestaoPrincipal.acao}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Outras Sugestões */}
            <div className="space-y-3">
                {sugestoes.slice(1, 4).map((sugestao) => (
                    <div
                        key={sugestao.id}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                        onClick={() => handleAcao(sugestao)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${getTipoColor(sugestao.tipo)}`}>
                                {getTipoIcon(sugestao.tipo)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-sm text-gray-900">{sugestao.titulo}</h5>
                                    <div className={`w-2 h-2 rounded-full ${getPrioridadeColor(sugestao.prioridade)}`}></div>
                                </div>
                                <p className="text-xs text-gray-600">{sugestao.descricao}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500">{sugestao.tempoEstimado}</div>
                                <button className="text-xs font-medium text-purple-600 hover:text-purple-700">
                                    {sugestao.acao}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 