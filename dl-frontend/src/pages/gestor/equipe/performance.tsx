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
import { useEffect, useMemo, useState } from "react";
import { anunciantesService, Advertiser } from "@/services/anunciantesService";
import Link from "next/link";

interface PerformanceData {
    id: number | string;
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
    const [exportando, setExportando] = useState(false);

    // Drawer Detalhes
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [membroSelecionado, setMembroSelecionado] = useState<PerformanceData | null>(null);
    const [detalhesLoading, setDetalhesLoading] = useState(false);
    const [detalhes, setDetalhes] = useState<{
        vendas: number;
        valorVendas: number;
        taxaConversao: number;
        anunciosAtivos: number;
        visualizacoes: number;
        leads: number;
        periodo: string;
    } | null>(null);

    const mapPeriodo = (p: string): "hoje" | "7d" | "15d" | "mes" => {
        if (p === "semana") return "7d";
        if (p === "trimestre") return "15d";
        if (p === "mes") return "mes";
        if (p === "ano") return "mes";
        return "mes";
    };

    const carregarDados = async () => {
        try {
            setLoading(true);
            const lista = await anunciantesService.list({ page: 1, page_size: 20, sort: "-created_at" });
            const advs: Advertiser[] = lista.data || [];
            const kpisList = await Promise.all(
                advs.map(async (a) => {
                    try {
                        const k = await anunciantesService.kpis(a.id, mapPeriodo(periodo));
                        return { a, k } as const;
                    } catch {
                        return { a, k: null as any } as const;
                    }
                })
            );

            const perf: PerformanceData[] = kpisList.map(({ a, k }) => ({
                id: a.id,
                nome: a.nome_publico || (typeof a.id === 'string' ? a.id.slice(0, 8) : String(a.id)),
                cargo: "Anunciante",
                vendas: k?.vendas_atribuidas ?? 0,
                valorVendas: 0,
                anunciosAtivos: k?.anuncios_ativos ?? 0,
                taxaConversao: k?.ctr ?? 0,
                visualizacoes: 0,
                leads: 0,
                periodo: k ? `${new Date(k.periodo_inicio).toLocaleDateString('pt-BR')} - ${new Date(k.periodo_fim).toLocaleDateString('pt-BR')}` : "",
            }));

            setPerformanceData(perf);

            const totalVendas = perf.reduce((acc, p) => acc + (p.vendas || 0), 0);
            const totalValor = perf.reduce((acc, p) => acc + (p.valorVendas || 0), 0);
            const totalAnuncios = perf.reduce((acc, p) => acc + (p.anunciosAtivos || 0), 0);
            const mediaConversao = perf.length ? (perf.reduce((acc, p) => acc + (p.taxaConversao || 0), 0) / perf.length) : 0;
            const melhor = perf.slice().sort((a, b) => (b.taxaConversao || 0) - (a.taxaConversao || 0))[0]?.nome || "";
            const pior = perf.slice().sort((a, b) => (a.taxaConversao || 0) - (b.taxaConversao || 0))[0]?.nome || "";

            setMetricasGerais({
                totalVendas,
                totalValor,
                totalAnuncios,
                mediaConversao,
                melhorVendedor: melhor,
                piorVendedor: pior,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [periodo]);

    const periodoLabel = useMemo(() => {
        if (periodo === "semana") return "Última semana";
        if (periodo === "trimestre") return "Último trimestre";
        if (periodo === "ano") return "Último ano";
        return "Último mês";
    }, [periodo]);

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
                                <button
                                    onClick={carregarDados}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-200"
                                >
                                    <RefreshCw size={20} />
                                    Atualizar
                                </button>
                                <button
                                    onClick={async () => {
                                        if (exportando) return;
                                        try {
                                            setExportando(true);
                                            // Import dinâmico para evitar SSR issues
                                            const jsPDF = (await import("jspdf")).default;
                                            const doc = new jsPDF({ unit: "pt", format: "a4" });

                                            const margin = 32;
                                            let y = margin;

                                            doc.setFont("helvetica", "bold");
                                            doc.setFontSize(16);
                                            doc.text("Performance da Equipe", margin, y);
                                            y += 18;
                                            doc.setFont("helvetica", "normal");
                                            doc.setFontSize(11);
                                            doc.text(`Período: ${periodoLabel}`, margin, y);
                                            y += 20;

                                            // Métricas gerais
                                            const gerais = [
                                                `Total Vendas: ${metricasGerais?.totalVendas ?? 0}`,
                                                `Valor Total: R$ ${(metricasGerais?.totalValor ?? 0).toLocaleString("pt-BR")}`,
                                                `Média Conversão: ${(metricasGerais?.mediaConversao ?? 0).toFixed(1)}%`,
                                                `Total Anúncios: ${metricasGerais?.totalAnuncios ?? 0}`,
                                            ];
                                            gerais.forEach((t) => {
                                                doc.text(t, margin, y);
                                                y += 14;
                                            });

                                            y += 6;
                                            // Cabeçalho da tabela
                                            doc.setFont("helvetica", "bold");
                                            doc.text("Nome", margin, y);
                                            doc.text("Vendas", margin + 220, y);
                                            doc.text("Valor", margin + 290, y);
                                            doc.text("Conversão", margin + 380, y);
                                            doc.text("Anúncios", margin + 470, y);
                                            doc.text("Vis.", margin + 550, y);
                                            doc.text("Leads", margin + 590, y);
                                            y += 10;
                                            doc.setLineWidth(0.5);
                                            doc.line(margin, y, 595 - margin, y);
                                            y += 14;
                                            doc.setFont("helvetica", "normal");

                                            // Linhas
                                            performanceData.forEach((m) => {
                                                if (y > 800) {
                                                    doc.addPage();
                                                    y = margin;
                                                }
                                                doc.text(String(m.nome ?? "-"), margin, y, { maxWidth: 200 });
                                                doc.text(String(m.vendas ?? 0), margin + 220, y);
                                                doc.text(`R$ ${Number(m.valorVendas ?? 0).toLocaleString("pt-BR")}`, margin + 290, y);
                                                doc.text(`${Number(m.taxaConversao ?? 0)}%`, margin + 380, y);
                                                doc.text(String(m.anunciosAtivos ?? 0), margin + 470, y);
                                                doc.text(String(m.visualizacoes ?? 0), margin + 550, y);
                                                doc.text(String(m.leads ?? 0), margin + 590, y);
                                                y += 16;
                                            });

                                            doc.save("performance-equipe.pdf");
                                        } catch (err) {
                                            // Evitar qualquer warning na UI
                                            // console.error("Erro ao exportar PDF", err);
                                        } finally {
                                            setExportando(false);
                                        }
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                                    disabled={exportando}
                                >
                                    <Download size={20} />
                                    {exportando ? "Exportando..." : "Exportar"}
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
                                            <button
                                                onClick={async () => {
                                                    setMembroSelecionado(membro);
                                                    setDrawerOpen(true);
                                                    setDetalhes(null);
                                                    setDetalhesLoading(true);
                                                    try {
                                                        // Último mês por padrão
                                                        const k = await anunciantesService.kpis(String(membro.id), "mes");
                                                        setDetalhes({
                                                            vendas: k?.vendas_atribuidas ?? membro.vendas ?? 0,
                                                            valorVendas: 0,
                                                            taxaConversao: k?.ctr ?? membro.taxaConversao ?? 0,
                                                            anunciosAtivos: k?.anuncios_ativos ?? membro.anunciosAtivos ?? 0,
                                                            visualizacoes: 0,
                                                            leads: 0,
                                                            periodo: k ? `${new Date(k.periodo_inicio).toLocaleDateString('pt-BR')} - ${new Date(k.periodo_fim).toLocaleDateString('pt-BR')}` : membro.periodo,
                                                        });
                                                    } catch (_err) {
                                                        setDetalhes({
                                                            vendas: membro.vendas ?? 0,
                                                            valorVendas: membro.valorVendas ?? 0,
                                                            taxaConversao: membro.taxaConversao ?? 0,
                                                            anunciosAtivos: membro.anunciosAtivos ?? 0,
                                                            visualizacoes: membro.visualizacoes ?? 0,
                                                            leads: membro.leads ?? 0,
                                                            periodo: membro.periodo ?? "",
                                                        });
                                                    } finally {
                                                        setDetalhesLoading(false);
                                                    }
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
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
                {/* Drawer Lateral - Detalhes do Membro */}
                {drawerOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
                            onClick={() => setDrawerOpen(false)}
                            aria-label="Fechar drawer"
                        />
                        {/* Drawer */}
                        <div className="relative ml-auto w-full max-w-xl h-full bg-white shadow-xl animate-slide-in-right overflow-y-auto">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                                onClick={() => setDrawerOpen(false)}
                                aria-label="Fechar"
                            >
                                ×
                            </button>
                            <div className="p-6 pt-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <User size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{membroSelecionado?.nome}</h2>
                                        <p className="text-sm text-gray-500">{membroSelecionado?.cargo}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 mb-4">Período: {detalhes?.periodo || "Último mês"}</div>

                                {detalhesLoading ? (
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-200 rounded" />
                                        <div className="h-4 bg-gray-200 rounded" />
                                        <div className="h-4 bg-gray-200 rounded" />
                                        <div className="h-4 bg-gray-200 rounded" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-xs text-gray-500">Vendas</div>
                                            <div className="text-2xl font-bold text-blue-600">{detalhes?.vendas ?? 0}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-xs text-gray-500">Valor</div>
                                            <div className="text-2xl font-bold text-green-600">R$ {(detalhes?.valorVendas ?? 0).toLocaleString('pt-BR')}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-xs text-gray-500">Taxa de Conversão</div>
                                            <div className="text-2xl font-bold text-gray-900">{(detalhes?.taxaConversao ?? 0)}%</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-xs text-gray-500">Anúncios Ativos</div>
                                            <div className="text-2xl font-bold text-gray-900">{detalhes?.anunciosAtivos ?? 0}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-xs text-gray-500">Visualizações</div>
                                            <div className="text-2xl font-bold text-gray-900">{detalhes?.visualizacoes ?? 0}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-xs text-gray-500">Leads</div>
                                            <div className="text-2xl font-bold text-gray-900">{detalhes?.leads ?? 0}</div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end">
                                    <Link href="/gestor/gestao/vendas" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        ver relatório completo →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </LayoutGestor>
        </PermissionGuard>
    );
} 