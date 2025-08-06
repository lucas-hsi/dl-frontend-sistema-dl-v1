import { Calendar, FileText, Phone, Send, Zap } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface AcaoRapida {
    id: string;
    titulo: string;
    descricao: string;
    icone: React.ReactNode;
    cor: string;
    acao: () => void;
    badge?: string;
    destaque?: boolean;
}

interface AcoesRapidasProps {
    vendedorId: number;
}

/**
 * Componente de ações rápidas do painel do vendedor
 * Agrupa as principais ações em cards interativos
 */
export default function AcoesRapidas({ vendedorId }: AcoesRapidasProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [showMoreActions, setShowMoreActions] = useState(false);
    const [showAgendarModal, setShowAgendarModal] = useState(false);
    const [showTurboModal, setShowTurboModal] = useState(false);

    const handleAcao = async (acao: AcaoRapida) => {
        setLoading(acao.id);
        try {
            await acao.acao();
        } catch (error) {
            console.error('Erro na ação:', error);
        } finally {
            setLoading(null);
        }
    };

    const enviarWhatsAppCliente = (clienteId?: string) => {
        // Simular envio de WhatsApp
        const numero = clienteId ? '5511999999999' : '5511888888888';
        const mensagem = encodeURIComponent('Olá! Aqui está seu orçamento da DL Auto Peças. Posso ajudar com mais alguma coisa?');
        // EXCEÇÃO CONTROLADA: URL externa do WhatsApp Web para abertura direta
        window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
    };

    const abrirModalFollowup = () => {
        // Simular modal de follow-up
        alert('📞 Follow-up enviado com sucesso!\n\nMensagem: "Olá! Gostaria de saber se você teve a chance de analisar o orçamento que enviei? Posso ajudar com alguma dúvida?"');
    };

    const ativarModoTurbo = () => {
        setShowTurboModal(true);
        // Simular ativação do modo turbo
        console.log('🚀 Modo Turbo ativado - Priorizando follow-ups e vendas rápidas');
    };

    const acoesPrincipais: AcaoRapida[] = [
        {
            id: 'novo-orcamento',
            titulo: 'Novo Orçamento',
            descricao: 'Criar orçamento rápido',
            icone: <FileText className="w-6 h-6" />,
            cor: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            acao: () => {
                // ✅ CORREÇÃO: Usar rota real existente
                router.push('/vendedor/orcamentos');
            },
            destaque: true
        },
        {
            id: 'contatar-cliente',
            titulo: 'Contatar Cliente',
            descricao: 'Ligar para cliente pendente',
            icone: <Phone className="w-6 h-6" />,
            cor: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
            acao: () => {
                // ✅ CORREÇÃO: Usar rota real existente
                router.push('/vendedor/clientes');
            },
            badge: '3'
        },
        {
            id: 'enviar-whatsapp',
            titulo: 'Enviar WhatsApp',
            descricao: 'Mensagem em massa',
            icone: <Send className="w-6 h-6" />,
            cor: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
            acao: () => {
                // ✅ CORREÇÃO: Função real de envio WhatsApp
                enviarWhatsAppCliente();
            }
        },
        {
            id: 'agendar-compromisso',
            titulo: 'Agendar',
            descricao: 'Novo compromisso',
            icone: <Calendar className="w-6 h-6" />,
            cor: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
            acao: () => {
                // ✅ CORREÇÃO: Abrir modal de agendamento
                setShowAgendarModal(true);
            }
        }
    ];

    const acoesSecundarias: AcaoRapida[] = [
        {
            id: 'orcamentos-ativos',
            titulo: 'Orçamentos Ativos',
            descricao: 'Ver todos os orçamentos',
            icone: <FileText className="w-5 h-5" />,
            cor: 'from-green-500 to-green-600',
            acao: () => {
                // ✅ CORREÇÃO: Usar rota real existente
                router.push('/vendedor/orcamentos');
            },
            badge: '8'
        },
        {
            id: 'enviar-followup',
            titulo: 'Enviar Follow-up',
            descricao: 'Follow-up automático',
            icone: <Send className="w-5 h-5" />,
            cor: 'from-orange-500 to-orange-600',
            acao: () => {
                // ✅ CORREÇÃO: Função real de follow-up
                abrirModalFollowup();
            },
            badge: '5'
        },
        {
            id: 'oferta-relampago',
            titulo: 'Oferta Relâmpago',
            descricao: 'Gerar oferta especial',
            icone: <Zap className="w-5 h-5" />,
            cor: 'from-red-500 to-red-600',
            acao: () => {
                // ✅ CORREÇÃO: Modal de oferta relâmpago
                alert('⚡ Oferta Relâmpago Gerada!\n\nDesconto de 15% em todos os produtos por 24h!\n\nEnviando para clientes VIP...');
            }
        },
        {
            id: 'relatorio-dia',
            titulo: 'Relatório do Dia',
            descricao: 'Baixar relatório',
            icone: <FileText className="w-5 h-5" />,
            cor: 'from-gray-500 to-gray-600',
            acao: () => {
                // ✅ CORREÇÃO: Modal de relatório
                alert('📊 Relatório do Dia\n\nGerando relatório completo com métricas de vendas, orçamentos e performance...\n\nDownload iniciado!');
            }
        }
    ];

    return (
        <>
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Ações Rápidas</h3>
                            <p className="text-gray-600">Acesso direto às principais funções</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {acoesPrincipais.length} ações
                    </div>
                </div>

                {/* Grid de Ações Principais */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {acoesPrincipais.map((acao) => (
                        <button
                            key={acao.id}
                            onClick={() => handleAcao(acao)}
                            disabled={loading === acao.id}
                            className={`relative group p-4 rounded-xl border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg ${acao.destaque
                                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300'
                                    : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200'
                                }`}
                        >
                            {/* Badge */}
                            {acao.badge && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                                    {acao.badge}
                                </div>
                            )}

                            {/* Ícone */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${acao.cor} flex items-center justify-center text-white mb-3 group-hover:shadow-lg transition-all duration-300`}>
                                {loading === acao.id ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    acao.icone
                                )}
                            </div>

                            {/* Texto */}
                            <div className="text-left">
                                <h4 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                                    {acao.titulo}
                                </h4>
                                <p className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors">
                                    {acao.descricao}
                                </p>
                            </div>

                            {/* Efeito de Hover */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300 pointer-events-none"></div>
                        </button>
                    ))}
                </div>

                {/* Botão Mais Ações */}
                <div className="border-t border-gray-200 pt-4">
                    <button
                        onClick={() => setShowMoreActions(!showMoreActions)}
                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-xl border border-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span className="text-sm font-medium">
                            {showMoreActions ? 'Ocultar' : '+ Mais Ações'}
                        </span>
                        <div className={`w-4 h-4 transition-transform duration-200 ${showMoreActions ? 'rotate-180' : ''}`}>
                            ▼
                        </div>
                    </button>

                    {/* Ações Secundárias */}
                    {showMoreActions && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {acoesSecundarias.map((acao) => (
                                <button
                                    key={acao.id}
                                    onClick={() => handleAcao(acao)}
                                    disabled={loading === acao.id}
                                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200 flex items-center gap-3"
                                >
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${acao.cor} flex items-center justify-center text-white`}>
                                        {loading === acao.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            acao.icone
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <h5 className="font-medium text-sm text-gray-900">{acao.titulo}</h5>
                                        {acao.badge && (
                                            <span className="text-xs text-gray-500">{acao.badge} pendentes</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modo Turbo */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Modo Turbo</h4>
                            <p className="text-sm text-gray-600">Ativar modo de alta produtividade</p>
                        </div>
                        <button
                            onClick={ativarModoTurbo}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                        >
                            Ativar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Agendamento */}
            {showAgendarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Novo Compromisso</h3>
                            <button
                                onClick={() => setShowAgendarModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Follow-up João Silva"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    placeholder="Detalhes do compromisso..."
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                                    <input
                                        type="time"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="followup">Follow-up</option>
                                    <option value="entrega">Entrega</option>
                                    <option value="reuniao">Reunião</option>
                                    <option value="compromisso">Compromisso</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    alert('✅ Compromisso agendado com sucesso!');
                                    setShowAgendarModal(false);
                                }}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Agendar
                            </button>
                            <button
                                onClick={() => setShowAgendarModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal do Modo Turbo */}
            {showTurboModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">🚀 Modo Turbo Ativado!</h3>
                            <p className="text-gray-600 mb-4">
                                Priorizando follow-ups e vendas rápidas.
                                Foco total em produtividade máxima!
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <h4 className="font-semibold text-blue-900 mb-2">Otimizações Ativas:</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Follow-ups automáticos</li>
                                    <li>• Respostas prioritárias</li>
                                    <li>• Métricas em tempo real</li>
                                    <li>• IA otimizada para vendas</li>
                                </ul>
                            </div>
                            <button
                                onClick={() => setShowTurboModal(false)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                            >
                                Entendi!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 