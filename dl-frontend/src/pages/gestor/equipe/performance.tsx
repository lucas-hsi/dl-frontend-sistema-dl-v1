import PermissionGuard from "@/components/auth/PermissionGuard";
import LayoutGestor from "@/components/layout/LayoutGestor";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    AlertCircle,
    BarChart3,
    CheckCircle,
    Download,
    PieChart,
    RefreshCw,
    TrendingUp,
    User,
    Users,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

interface PerformanceData {
    id: number;
    nome: string;
    cargo: string;
    vendas: number;
    valorVendas: number;
    anunciosAtivos: number;
    taxaConversao: number;
    visualizacoes: number;
    leads: number;
    periodo: string;
}

interface MetricasGerais {
    totalVendas: number;
    totalValor: number;
    totalAnuncios: number;
    mediaConversao: number;
    melhorVendedor: string;
    piorVendedor: string;
}

export default function PerformancePage() {
    const { user } = useAuth();
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
    const [metricasGerais, setMetricasGerais] = useState<MetricasGerais | null>(null);
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState("mes");
    const [viewMode, setViewMode] = useState<"individual" | "equipe">("individual");

    // Mock data
    useEffect(() => {
        setTimeout(() => {
            setPerformanceData([
                {
                    id: 1,
                    nome: "João Silva",
                    cargo: "Vendedor Senior",
                    vendas: 45,
                    valorVendas: 12500.00,
                    anunciosAtivos: 12,
                    taxaConversao: 8.5,
                    visualizacoes: 1250,
                    leads: 38,
                    periodo: "março/2024"
                },
                {
                    id: 2,
                    nome: "Maria Santos",
                    cargo: "Anunciante",
                    vendas: 32,
                    valorVendas: 8900.00,
                    anunciosAtivos: 8,
                    taxaConversao: 6.2,
                    visualizacoes: 890,
                    leads: 25,
                    periodo: "março/2024"
                },
                {
                    id: 3,
                    nome: "Pedro Costa",
                    cargo: "Vendedor",
                    vendas: 28,
                    valorVendas: 7200.00,
                    anunciosAtivos: 6,
                    taxaConversao: 5.8,
                    visualizacoes: 650,
                    leads: 22,
                    periodo: "março/2024"
                },
                {
                    id: 4,
                    nome: "Ana Oliveira",
                    cargo: "Anunciante",
                    vendas: 18,
                    valorVendas: 4800.00,
                    anunciosAtivos: 4,
                    taxaConversao: 4.1,
                    visualizacoes: 420,
                    leads: 15,
                    periodo: "março/2024"
                }
            ]);

            setMetricasGerais({
                totalVendas: 123,
                totalValor: 33400.00,
                totalAnuncios: 30,
                mediaConversao: 6.15,
                melhorVendedor: "João Silva",
                piorVendedor: "Ana Oliveira"
            });

            setLoading(false);
        }, 1000);
    }, []);

    const getPerformanceColor = (taxa: number) => {
        if (taxa >= 8) return 'text-green-600';
        if (taxa >= 6) return 'text-blue-600';
        if (taxa >= 4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getPerformanceIcon = (taxa: number) => {
        if (taxa >= 8) return <CheckCircle size={16} className="text-green-600" />;
        if (taxa >= 6) return <TrendingUp size={16} className="text-blue-600" />;
        if (taxa >= 4) return <AlertCircle size={16} className="text-yellow-600" />;
        return <XCircle size={16} className="text-red-600" />;
    };



    return (
        <PermissionGuard requiredRole="GESTOR">
            <LayoutGestor>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-xl p-6 mb-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">📊 Performance da Equipe</h1>
                                <p className="text-blue-100 opacity-90">Métricas e indicadores de desempenho da equipe</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/20 rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{metricasGerais?.totalVendas || 0}</div>
                                    <div className="text-blue-100 text-sm">Total Vendas</div>
                                </div>
                                <div className="bg-white/20 rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold text-white">R$ {(metricasGerais?.totalValor || 0).toLocaleString('pt-BR')}</div>
                                    <div className="text-blue-100 text-sm">Valor Total</div>
                                </div>
                                <div className="bg-white/20 rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{metricasGerais?.mediaConversao?.toFixed(1) || 0}%</div>
                                    <div className="text-blue-100 text-sm">Média Conversão</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-6 mb-6"
                    >
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode("individual")}
                                        className={`px-4 py-2 rounded-md transition-colors ${viewMode === "individual"
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                            }`}
                                    >
                                        <User size={16} className="inline mr-2" />
                                        Individual
                                    </button>
                                    <button
                                        onClick={() => setViewMode("equipe")}
                                        className={`px-4 py-2 rounded-md transition-colors ${viewMode === "equipe"
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                            }`}
                                    >
                                        <Users size={16} className="inline mr-2" />
                                        Equipe
                                    </button>
                                </div>
                                <select
                                    value={periodo}
                                    onChange={(e) => setPeriodo(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="semana">Última semana</option>
                                    <option value="mes">Último mês</option>
                                    <option value="trimestre">Último trimestre</option>
                                    <option value="ano">Último ano</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-200">
                                    <RefreshCw size={20} />
                                    Atualizar
                                </button>
                                <button className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-200">
                                    <Download size={20} />
                                    Exportar
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Performance Cards */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6"
                    >
                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-xl p-6">
                                    <div className="animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            performanceData.map((membro, index) => (
                                <motion.div
                                    key={membro.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <User size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{membro.nome}</h3>
                                                <p className="text-sm text-gray-500">{membro.cargo}</p>
                                            </div>
                                        </div>
                                        {getPerformanceIcon(membro.taxaConversao)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{membro.vendas}</div>
                                            <div className="text-sm text-gray-500">Vendas</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">R$ {membro.valorVendas.toLocaleString('pt-BR')}</div>
                                            <div className="text-sm text-gray-500">Valor</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Taxa de Conversão</span>
                                            <span className={`font-semibold ${getPerformanceColor(membro.taxaConversao)}`}>
                                                {membro.taxaConversao}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Anúncios Ativos</span>
                                            <span className="font-semibold text-gray-900">{membro.anunciosAtivos}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Visualizações</span>
                                            <span className="font-semibold text-gray-900">{membro.visualizacoes}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Leads</span>
                                            <span className="font-semibold text-gray-900">{membro.leads}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Período: {membro.periodo}</span>
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                Ver detalhes
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    {/* Gráficos e Métricas Adicionais */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {/* Gráfico de Performance */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Performance por Vendedor</h3>
                                <BarChart3 className="text-blue-600" size={20} />
                            </div>
                            <div className="space-y-4">
                                {performanceData.map((membro) => (
                                    <div key={membro.id} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{membro.nome}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                                    style={{ width: `${(membro.taxaConversao / 10) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{membro.taxaConversao}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Métricas Gerais */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Métricas Gerais</h3>
                                <PieChart className="text-green-600" size={20} />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Melhor Vendedor</span>
                                    <span className="font-semibold text-green-600">{metricasGerais?.melhorVendedor}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Precisa Melhorar</span>
                                    <span className="font-semibold text-red-600">{metricasGerais?.piorVendedor}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Anúncios</span>
                                    <span className="font-semibold text-gray-900">{metricasGerais?.totalAnuncios}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Média Conversão</span>
                                    <span className="font-semibold text-blue-600">{metricasGerais?.mediaConversao?.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </LayoutGestor>
        </PermissionGuard>
    );
} 