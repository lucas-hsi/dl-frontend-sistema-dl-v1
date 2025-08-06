import LayoutAnuncios from "@/components/layout/LayoutAnuncios";
import { AnaliseConcorrencia, concorrenciaService } from "@/services/concorrenciaService";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    AlertTriangle,
    BarChart3,
    CheckCircle,
    DollarSign,
    Eye,
    Minus,
    Search,
    Target,
    TrendingDown,
    TrendingUp,
    Zap
} from "lucide-react";
import { useState } from "react";

interface Competidor {
    id: string;
    nome: string;
    preco: number;
    posicao: number;
    avaliacao: number;
    vendas: number;
    diferencial: string;
    status: 'acima' | 'abaixo' | 'igual';
}

export default function AnaliseConcorrenciaPage() {
    const [loading, setLoading] = useState(false);
    const [produto, setProduto] = useState("");
    const [analise, setAnalise] = useState<AnaliseConcorrencia | null>(null);
    const [filtroStatus, setFiltroStatus] = useState<'todos' | 'acima' | 'abaixo' | 'igual'>('todos');
    const [error, setError] = useState<string | null>(null);

    const handleAnalisar = async () => {
        if (!produto.trim()) return;

        setLoading(true);
        setError(null);
        setAnalise(null);

        try {
            // Chamada real para a API de análise de concorrência
            const response = await concorrenciaService.analisarConcorrencia(produto);

            // Converter resposta da API para formato do componente
            const analiseConvertida = concorrenciaService.converterParaFormatoComponente(response);

            setAnalise(analiseConvertida);
        } catch (error) {
            console.error("Erro ao analisar concorrência:", error);
            setError("Erro ao analisar concorrência. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'acima':
                return <TrendingUp className="w-4 h-4 text-green-600" />;
            case 'abaixo':
                return <TrendingDown className="w-4 h-4 text-red-600" />;
            case 'igual':
                return <Minus className="w-4 h-4 text-gray-600" />;
            default:
                return <Minus className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'acima':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'abaixo':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'igual':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const competidoresFiltrados = analise?.competidores.filter(comp => {
        if (filtroStatus === 'todos') return true;
        return comp.status === filtroStatus;
    }) || [];

    const metricas = [
        { icon: DollarSign, label: "Preço Médio", valor: analise ? `R$ ${analise.precoMedio.toFixed(2)}` : "R$ 0,00", cor: "text-green-500" },
        { icon: Target, label: "Preço Recomendado", valor: analise ? `R$ ${analise.precoRecomendado.toFixed(2)}` : "R$ 0,00", cor: "text-blue-500" },
        { icon: BarChart3, label: "Concorrentes", valor: analise ? analise.competidores.length.toString() : "0", cor: "text-purple-500" }
    ];

    return (
        <LayoutAnuncios>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Search className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Análise de Concorrência</h1>
                                <p className="text-blue-100">IA analisa preços e posicionamento dos concorrentes</p>
                            </div>
                        </div>

                        {/* Métricas */}
                        <div className="flex space-x-6">
                            {metricas.map((metrica, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <metrica.icon className={`w-6 h-6 ${metrica.cor} mx-auto mb-1`} />
                                    <div className="text-white font-semibold">{metrica.valor}</div>
                                    <div className="text-blue-100 text-sm">{metrica.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Área de Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-6"
                    >
                        <div className="flex items-center space-x-3 mb-4">
                            <Search className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Produto para Análise</h2>
                        </div>

                        <div className="flex space-x-4">
                            <input
                                type="text"
                                value={produto}
                                onChange={(e) => setProduto(e.target.value)}
                                placeholder="Digite o nome do produto para analisar..."
                                className="flex-1 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />

                            <button
                                onClick={handleAnalisar}
                                disabled={loading || !produto.trim()}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Analisando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        <span>Analisar Concorrência</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Mensagem de Erro */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-xl flex items-center space-x-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <span className="text-red-700">{error}</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Resultados */}
                    <AnimatePresence>
                        {analise && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Filtros */}
                                <div className="bg-white rounded-2xl shadow-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Filtrar Concorrentes</h3>
                                        <div className="flex space-x-2">
                                            {(['todos', 'acima', 'abaixo', 'igual'] as const).map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => setFiltroStatus(status)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filtroStatus === status
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        Mostrando {competidoresFiltrados.length} de {analise.competidores.length} concorrentes
                                    </div>
                                </div>

                                {/* Lista de Concorrentes */}
                                <div className="space-y-4">
                                    {competidoresFiltrados.map((competidor, index) => (
                                        <motion.div
                                            key={competidor.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white rounded-2xl shadow-xl p-6"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                                                        {competidor.posicao}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">{competidor.nome}</h4>
                                                        <p className="text-sm text-gray-600">{competidor.diferencial}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-gray-800">
                                                            R$ {competidor.preco.toFixed(2)}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {competidor.vendas} vendas
                                                        </div>
                                                    </div>

                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(competidor.status)}`}>
                                                        {getStatusIcon(competidor.status)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <Eye className="w-4 h-4" />
                                                    <span>Avaliação: {competidor.avaliacao}/5</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <BarChart3 className="w-4 h-4" />
                                                    <span>Posição: #{competidor.posicao}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Insights e Recomendações */}
                                {(analise.insights.length > 0 || analise.recomendacoes.length > 0) && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Insights */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-2xl shadow-xl p-6"
                                        >
                                            <div className="flex items-center space-x-3 mb-4">
                                                <AlertTriangle className="w-6 h-6 text-orange-600" />
                                                <h3 className="text-lg font-semibold text-gray-800">Insights da IA</h3>
                                            </div>

                                            <div className="space-y-3">
                                                {analise.insights.map((insight, index) => (
                                                    <div key={index} className="flex items-start space-x-3">
                                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                                        <p className="text-gray-700 text-sm">{insight}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Recomendações */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-2xl shadow-xl p-6"
                                        >
                                            <div className="flex items-center space-x-3 mb-4">
                                                <Target className="w-6 h-6 text-green-600" />
                                                <h3 className="text-lg font-semibold text-gray-800">Recomendações</h3>
                                            </div>

                                            <div className="space-y-3">
                                                {analise.recomendacoes.map((recomendacao, index) => (
                                                    <div key={index} className="flex items-start space-x-3">
                                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                        <p className="text-gray-700 text-sm">{recomendacao}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Dicas */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
                    >
                        <div className="flex items-center space-x-3 mb-4">
                            <Zap className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Dicas para Análise</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Use termos específicos do produto</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Analise preços e diferenciais</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Considere posicionamento no mercado</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Monitore concorrentes regularmente</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </LayoutAnuncios>
    );
} 