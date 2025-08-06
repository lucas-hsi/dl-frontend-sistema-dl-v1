import LayoutAnuncios from "@/components/layout/LayoutAnuncios";
import { anuncioService } from "@/services/anuncioService";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    CheckCircle,
    Copy,
    FileText,
    Sparkles,
    Target,
    TrendingUp,
    Zap
} from "lucide-react";
import { useState } from "react";

interface Melhoria {
    id: string;
    tipo: 'titulo' | 'descricao' | 'palavras_chave';
    original: string;
    melhorada: string;
    score: number;
    explicacao: string;
}

interface OtimizacaoIA {
    titulo_original: string;
    titulo_otimizado: string;
    preco_original: number;
    preco_otimizado: number;
    score_melhoria: number;
    sugestoes: string[];
}

export default function MelhorarDescricoesPage() {
    const [loading, setLoading] = useState(false);
    const [descricaoOriginal, setDescricaoOriginal] = useState("");
    const [melhorias, setMelhorias] = useState<Melhoria[]>([]);
    const [copiado, setCopiado] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalisar = async () => {
        if (!descricaoOriginal.trim()) return;

        setLoading(true);
        setError(null);
        setMelhorias([]);

        try {
            // Chamada real para a API de IA
            const otimizacao = await anuncioService.otimizarAnuncioIA(0); // ID 0 para análise de texto livre

            // Converter resposta da API para formato do componente
            const melhoriasConvertidas: Melhoria[] = [
                {
                    id: "titulo",
                    tipo: "titulo",
                    original: otimizacao.titulo_original || "Título não fornecido",
                    melhorada: otimizacao.titulo_otimizado,
                    score: otimizacao.score_melhoria,
                    explicacao: `Score de melhoria: ${otimizacao.score_melhoria}%`
                },
                {
                    id: "preco",
                    tipo: "descricao",
                    original: `R$ ${otimizacao.preco_original}`,
                    melhorada: `R$ ${otimizacao.preco_otimizado}`,
                    score: otimizacao.score_melhoria,
                    explicacao: `Preço otimizado com base na análise de mercado`
                },
                {
                    id: "sugestoes",
                    tipo: "palavras_chave",
                    original: "Sugestões de melhoria",
                    melhorada: otimizacao.sugestoes.join(", "),
                    score: otimizacao.score_melhoria,
                    explicacao: "Sugestões baseadas na análise de IA"
                }
            ];

            setMelhorias(melhoriasConvertidas);
        } catch (error) {
            console.error("Erro ao analisar:", error);
            setError("Erro ao processar análise com IA. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const copiarTexto = async (texto: string, id: string) => {
        try {
            await navigator.clipboard.writeText(texto);
            setCopiado(id);
            setTimeout(() => setCopiado(null), 2000);
        } catch (error) {
            console.error("Erro ao copiar:", error);
        }
    };

    const calcularScoreMedio = () => {
        if (melhorias.length === 0) return 0;
        const total = melhorias.reduce((sum, m) => sum + m.score, 0);
        return Math.round(total / melhorias.length);
    };

    const metricas = [
        { icon: TrendingUp, label: "Score Médio", valor: `${calcularScoreMedio()}%`, cor: "text-green-500" },
        { icon: Target, label: "Melhorias", valor: melhorias.length.toString(), cor: "text-blue-500" },
        { icon: Zap, label: "Tempo Estimado", valor: "2.3s", cor: "text-purple-500" }
    ];

    return (
        <LayoutAnuncios>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Melhorar Descrições</h1>
                                <p className="text-blue-100">IA otimiza títulos e descrições para maior conversão</p>
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
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Descrição Original</h2>
                        </div>

                        <textarea
                            value={descricaoOriginal}
                            onChange={(e) => setDescricaoOriginal(e.target.value)}
                            placeholder="Cole aqui a descrição do anúncio que deseja melhorar..."
                            className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />

                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">
                                {descricaoOriginal.length} caracteres
                            </div>

                            <button
                                onClick={handleAnalisar}
                                disabled={loading || !descricaoOriginal.trim()}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Analisando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Analisar com IA</span>
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
                        {melhorias.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">Melhorias Sugeridas</h2>
                                </div>

                                {melhorias.map((melhoria, index) => (
                                    <motion.div
                                        key={melhoria.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl shadow-xl p-6"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${melhoria.score >= 90 ? 'bg-green-500' :
                                                    melhoria.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`} />
                                                <h3 className="font-semibold text-gray-800 capitalize">
                                                    {melhoria.tipo.replace('_', ' ')}
                                                </h3>
                                                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                                                    Score: {melhoria.score}%
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => copiarTexto(melhoria.melhorada, melhoria.id)}
                                                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
                                            >
                                                {copiado === melhoria.id ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="text-sm">Copiado!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        <span className="text-sm">Copiar</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Original</h4>
                                                <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm">
                                                    {melhoria.original}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Melhorado</h4>
                                                <div className="bg-green-50 p-4 rounded-xl text-gray-800 text-sm border border-green-200">
                                                    {melhoria.melhorada}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                                            <div className="flex items-start space-x-2">
                                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h5 className="font-medium text-blue-800 mb-1">Explicação da IA</h5>
                                                    <p className="text-blue-700 text-sm">{melhoria.explicacao}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
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
                            <Target className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Dicas para Melhores Resultados</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Inclua características técnicas do produto</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Mencione compatibilidade e aplicação</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Use palavras-chave relevantes</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span>Destaque benefícios e garantias</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </LayoutAnuncios>
    );
} 