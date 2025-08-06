import PermissionGuard from "@/components/auth/PermissionGuard";

import LayoutGestor from "@/components/layout/LayoutGestor";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import {
    BarChart3,
    Calendar,
    MoreVertical,
    Search,
    ShoppingCart,
    TrendingUp,
    User,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

interface Anuncio {
    id: number;
    titulo: string;
    sku: string;
    canal: 'MERCADO_LIVRE' | 'SHOPIFY' | 'SITE_PROPRIO';
    criador: string;
    status: 'PUBLICADO' | 'RASCUNHO' | 'PAUSADO' | 'SINCRONIZANDO';
    preco: number;
    dataCriacao: string;
    visualizacoes: number;
    vendas: number;
}

export default function AnunciosPage() {
    const { user } = useAuth();
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCanal, setFilterCanal] = useState<string>("");
    const [filterCriador, setFilterCriador] = useState<string>("");
    const [filterPeriodo, setFilterPeriodo] = useState<string>("30");

    // Mock data
    useEffect(() => {
        setTimeout(() => {
            setAnuncios([
                {
                    id: 1,
                    titulo: "Amortecedor Dianteiro Honda Civic 2018",
                    sku: "AMT-HONDA-CIVIC-2018",
                    canal: "MERCADO_LIVRE",
                    criador: "Maria Santos",
                    status: "PUBLICADO",
                    preco: 450.00,
                    dataCriacao: "2024-01-15",
                    visualizacoes: 1250,
                    vendas: 8
                },
                {
                    id: 2,
                    titulo: "Freio de Mão Toyota Corolla 2020",
                    sku: "FRE-TOYOTA-COROLLA-2020",
                    canal: "SHOPIFY",
                    criador: "João Silva",
                    status: "PUBLICADO",
                    preco: 320.00,
                    dataCriacao: "2024-02-20",
                    visualizacoes: 890,
                    vendas: 5
                },
                {
                    id: 3,
                    titulo: "Bateria Automotiva 60Ah",
                    sku: "BAT-60AH-UNIVERSAL",
                    canal: "SITE_PROPRIO",
                    criador: "Pedro Costa",
                    status: "SINCRONIZANDO",
                    preco: 280.00,
                    dataCriacao: "2024-03-10",
                    visualizacoes: 0,
                    vendas: 0
                },
                {
                    id: 4,
                    titulo: "Filtro de Ar Motor 1.0",
                    sku: "FIL-AR-MOTOR-1.0",
                    canal: "MERCADO_LIVRE",
                    criador: "Maria Santos",
                    status: "RASCUNHO",
                    preco: 45.00,
                    dataCriacao: "2024-03-25",
                    visualizacoes: 0,
                    vendas: 0
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredAnuncios = anuncios.filter(anuncio => {
        const matchesSearch = anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            anuncio.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCanal = !filterCanal || anuncio.canal === filterCanal;
        const matchesCriador = !filterCriador || anuncio.criador === filterCriador;
        return matchesSearch && matchesCanal && matchesCriador;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PUBLICADO': return 'bg-green-100 text-green-800 border-green-200';
            case 'RASCUNHO': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'PAUSADO': return 'bg-red-100 text-red-800 border-red-200';
            case 'SINCRONIZANDO': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getCanalColor = (canal: string) => {
        switch (canal) {
            case 'MERCADO_LIVRE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'SHOPIFY': return 'bg-green-100 text-green-800 border-green-200';
            case 'SITE_PROPRIO': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getCanalLabel = (canal: string) => {
        switch (canal) {
            case 'MERCADO_LIVRE': return 'Mercado Livre';
            case 'SHOPIFY': return 'Shopify';
            case 'SITE_PROPRIO': return 'Site Próprio';
            default: return canal;
        }
    };

    const totalCriadosMes = anuncios.filter(a => {
        const dataCriacao = new Date(a.dataCriacao);
        const hoje = new Date();
        const diffTime = Math.abs(hoje.getTime() - dataCriacao.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= parseInt(filterPeriodo);
    }).length;

    const totalPublicados = anuncios.filter(a => a.status === 'PUBLICADO').length;

    return (
        <PermissionGuard requiredRole="ANUNCIANTE" fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h1>
                    <p className="text-gray-600 mb-6">
                        Esta página é destinada apenas para ANUNCIANTES e GESTORES.
                    </p>
                </div>
            </div>
        }>
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
                                <h1 className="text-3xl font-bold text-white mb-2">📢 Gestão de Anúncios</h1>
                                <p className="text-blue-100 opacity-90">Monitore e gerencie anúncios da equipe</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/20 rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{anuncios.length}</div>
                                    <div className="text-blue-100 text-sm">Total</div>
                                </div>
                                <div className="bg-white/20 rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{totalPublicados}</div>
                                    <div className="text-blue-100 text-sm">Publicados</div>
                                </div>
                                <div className="bg-white/20 rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{totalCriadosMes}</div>
                                    <div className="text-blue-100 text-sm">Últimos {filterPeriodo} dias</div>
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
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Buscar anúncios por título ou SKU..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <select
                                    value={filterCanal}
                                    onChange={(e) => setFilterCanal(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Todos os canais</option>
                                    <option value="MERCADO_LIVRE">Mercado Livre</option>
                                    <option value="SHOPIFY">Shopify</option>
                                    <option value="SITE_PROPRIO">Site Próprio</option>
                                </select>
                                <select
                                    value={filterCriador}
                                    onChange={(e) => setFilterCriador(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Todos os criadores</option>
                                    <option value="Maria Santos">Maria Santos</option>
                                    <option value="João Silva">João Silva</option>
                                    <option value="Pedro Costa">Pedro Costa</option>
                                </select>
                                <select
                                    value={filterPeriodo}
                                    onChange={(e) => setFilterPeriodo(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="7">Últimos 7 dias</option>
                                    <option value="30">Últimos 30 dias</option>
                                    <option value="90">Últimos 90 dias</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Anuncios List */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Carregando anúncios...</p>
                            </div>
                        ) : filteredAnuncios.length === 0 ? (
                            <div className="p-8 text-center">
                                <ShoppingCart className="mx-auto text-gray-400" size={48} />
                                <p className="mt-4 text-gray-600">Nenhum anúncio encontrado</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Anúncio</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Criador</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Canal</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Performance</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <AnimatePresence>
                                            {filteredAnuncios.map((anuncio, index) => (
                                                <motion.tr
                                                    key={anuncio.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium text-gray-900">{anuncio.titulo}</div>
                                                            <div className="text-sm text-gray-500">SKU: {anuncio.sku}</div>
                                                            <div className="text-sm font-medium text-green-600">
                                                                R$ {anuncio.preco.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <User size={16} className="text-gray-400" />
                                                            <span className="text-sm text-gray-900">{anuncio.criador}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCanalColor(anuncio.canal)}`}>
                                                            {getCanalLabel(anuncio.canal)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(anuncio.status)}`}>
                                                            {anuncio.status === 'SINCRONIZANDO' && <Zap size={12} className="mr-1 animate-pulse" />}
                                                            {anuncio.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm">
                                                            <div className="flex items-center gap-1 text-gray-600">
                                                                <BarChart3 size={14} />
                                                                {anuncio.visualizacoes} visualizações
                                                            </div>
                                                            <div className="flex items-center gap-1 text-green-600">
                                                                <TrendingUp size={14} />
                                                                {anuncio.vendas} vendas
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                                <Calendar size={16} />
                                                            </button>
                                                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Ver detalhes">
                                                                <BarChart3 size={16} />
                                                            </button>
                                                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                                <MoreVertical size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </div>
            </LayoutGestor>
    
        </PermissionGuard>
    );
} 