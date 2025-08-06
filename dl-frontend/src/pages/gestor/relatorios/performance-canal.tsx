"use client";

import LayoutGestor from '@/components/layout/LayoutGestor';
import {
    AlertCircle,
    BarChart3,
    DollarSign,
    Download,
    Filter,
    RefreshCw,
    ShoppingCart,
    TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CanalPerformance {
    canal: string;
    vendas: number;
    receita: number;
    conversao: number;
    custo: number;
    roi: number;
    visitantes: number;
    cliques: number;
    ctr: number;
    cpc: number;
}

interface FiltrosRelatorio {
    dataInicio: string;
    dataFim: string;
    canal: string;
    vendedor: string;
}

const PerformanceCanal: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<CanalPerformance[]>([]);
    const [filtros, setFiltros] = useState<FiltrosRelatorio>({
        dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dataFim: new Date().toISOString().split('T')[0],
        canal: 'todos',
        vendedor: 'todos'
    });

    // Dados mockados
    const dadosMock: CanalPerformance[] = [
        {
            canal: 'Mercado Livre',
            vendas: 156,
            receita: 45230.50,
            conversao: 3.2,
            custo: 1250.00,
            roi: 3618.44,
            visitantes: 4875,
            cliques: 892,
            ctr: 18.3,
            cpc: 1.40
        },
        {
            canal: 'Shopify',
            vendas: 89,
            receita: 28950.75,
            conversao: 4.1,
            custo: 850.00,
            roi: 3405.97,
            visitantes: 2170,
            cliques: 456,
            ctr: 21.0,
            cpc: 1.86
        },
        {
            canal: 'Balcão',
            vendas: 234,
            receita: 67890.25,
            conversao: 8.5,
            custo: 0,
            roi: 0,
            visitantes: 2750,
            cliques: 0,
            ctr: 0,
            cpc: 0
        },
        {
            canal: 'Instagram',
            vendas: 67,
            receita: 18950.00,
            conversao: 2.8,
            custo: 650.00,
            roi: 2915.38,
            visitantes: 2390,
            cliques: 234,
            ctr: 9.8,
            cpc: 2.78
        }
    ];

    useEffect(() => {
        // Simular carregamento
        const timer = setTimeout(() => {
            setDados(dadosMock);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [filtros]);

    const aplicarFiltros = () => {
        setLoading(true);
        // Simular aplicação de filtros
        setTimeout(() => {
            setLoading(false);
        }, 800);
    };

    const exportarRelatorio = () => {
        // Simular exportação
        console.log('Exportando relatório...');
    };

    const calcularTotalReceita = () => {
        return dados.reduce((total, item) => total + item.receita, 0);
    };

    const calcularTotalVendas = () => {
        return dados.reduce((total, item) => total + item.vendas, 0);
    };

    const calcularMediaConversao = () => {
        const conversoes = dados.map(item => item.conversao).filter(c => c > 0);
        return conversoes.length > 0 ? conversoes.reduce((a, b) => a + b, 0) / conversoes.length : 0;
    };

    return (
        <LayoutGestor>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Performance por Canal</h1>
                                <p className="text-blue-100">Análise detalhada de performance por canal de venda</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={exportarRelatorio}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Exportar
                            </button>
                            <button
                                onClick={aplicarFiltros}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Atualizar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                            <input
                                type="date"
                                value={filtros.dataInicio}
                                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                            <input
                                type="date"
                                value={filtros.dataFim}
                                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Canal</label>
                            <select
                                value={filtros.canal}
                                onChange={(e) => setFiltros({ ...filtros, canal: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="todos">Todos os Canais</option>
                                <option value="mercado_livre">Mercado Livre</option>
                                <option value="shopify">Shopify</option>
                                <option value="balcao">Balcão</option>
                                <option value="instagram">Instagram</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Vendedor</label>
                            <select
                                value={filtros.vendedor}
                                onChange={(e) => setFiltros({ ...filtros, vendedor: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="todos">Todos os Vendedores</option>
                                <option value="joao">João Silva</option>
                                <option value="maria">Maria Santos</option>
                                <option value="carlos">Carlos Lima</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Métricas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                                <p className="text-2xl font-bold text-green-600">
                                    R$ {calcularTotalReceita().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Vendas Totais</p>
                                <p className="text-2xl font-bold text-blue-600">{calcularTotalVendas()}</p>
                            </div>
                            <ShoppingCart className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Conversão Média</p>
                                <p className="text-2xl font-bold text-purple-600">{calcularMediaConversao().toFixed(1)}%</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">ROI Médio</p>
                                <p className="text-2xl font-bold text-orange-600">2.847%</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando dados de performance...</p>
                    </div>
                )}

                {/* Tabela de Performance */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">Performance por Canal</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendas</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receita</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversão</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitantes</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliques</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dados.map((canal, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium text-blue-600">{canal.canal.charAt(0)}</span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{canal.canal}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{canal.vendas}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                R$ {canal.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${canal.conversao >= 4 ? 'bg-green-100 text-green-800' :
                                                        canal.conversao >= 2 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {canal.conversao}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{canal.visitantes.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{canal.cliques.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{canal.ctr}%</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {canal.cpc.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${canal.roi > 3000 ? 'bg-green-100 text-green-800' :
                                                        canal.roi > 2000 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {canal.roi > 0 ? `${canal.roi.toFixed(0)}%` : 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Estado Vazio */}
                {!loading && dados.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado encontrado</h3>
                        <p className="text-gray-600">Tente ajustar os filtros ou período de análise</p>
                    </div>
                )}
            </div>
        </LayoutGestor>
    );
};

export default PerformanceCanal; 