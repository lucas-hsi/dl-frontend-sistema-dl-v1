"use client";

import LayoutGestor from '@/components/layout/LayoutGestor';
import {
    AlertCircle,
    DollarSign,
    Download,
    Filter,
    Package,
    RefreshCw,
    ShoppingCart,
    TrendingUp,
    Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AnuncioROI {
    anuncio_id: number;
    titulo: string;
    canal: string;
    produto: string;
    investimento_total: number;
    receita_gerada: number;
    roi_percentual: number;
    lucro_absoluto: number;
    visualizacoes: number;
    cliques: number;
    conversoes: number;
    ctr: number;
    cpc: number;
    cpa: number;
    data_inicio: string;
    data_fim: string;
    status: 'ativo' | 'pausado' | 'finalizado';
    ranking_roi: number;
}

interface FiltrosRelatorio {
    dataInicio: string;
    dataFim: string;
    canal: string;
    status: string;
    roi_minimo: number;
}

const ROIAnuncio: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<AnuncioROI[]>([]);
    const [filtros, setFiltros] = useState<FiltrosRelatorio>({
        dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dataFim: new Date().toISOString().split('T')[0],
        canal: 'todos',
        status: 'todos',
        roi_minimo: 0
    });

    // Dados mockados
    const dadosMock: AnuncioROI[] = [
        {
            anuncio_id: 1,
            titulo: 'Pastilha de Freio Bosch - Qualidade Premium',
            canal: 'Mercado Livre',
            produto: 'Pastilha de Freio Bosch',
            investimento_total: 1250.00,
            receita_gerada: 45230.50,
            roi_percentual: 3618.44,
            lucro_absoluto: 43980.50,
            visualizacoes: 4875,
            cliques: 892,
            conversoes: 156,
            ctr: 18.3,
            cpc: 1.40,
            cpa: 8.01,
            data_inicio: '2024-01-01',
            data_fim: '2024-01-31',
            status: 'ativo',
            ranking_roi: 1
        },
        {
            anuncio_id: 2,
            titulo: 'Amortecedor Honda Civic - Garantia 1 Ano',
            canal: 'Shopify',
            produto: 'Amortecedor Dianteiro Honda Civic',
            investimento_total: 850.00,
            receita_gerada: 28950.75,
            roi_percentual: 3405.97,
            lucro_absoluto: 28100.75,
            visualizacoes: 2170,
            cliques: 456,
            conversoes: 89,
            ctr: 21.0,
            cpc: 1.86,
            cpa: 9.55,
            data_inicio: '2024-01-05',
            data_fim: '2024-01-31',
            status: 'ativo',
            ranking_roi: 2
        },
        {
            anuncio_id: 3,
            titulo: 'Filtro de Ar Motor - Compatível Universal',
            canal: 'Instagram',
            produto: 'Filtro de Ar Motor',
            investimento_total: 650.00,
            receita_gerada: 18950.00,
            roi_percentual: 2915.38,
            lucro_absoluto: 18300.00,
            visualizacoes: 2390,
            cliques: 234,
            conversoes: 67,
            ctr: 9.8,
            cpc: 2.78,
            cpa: 9.70,
            data_inicio: '2024-01-10',
            data_fim: '2024-01-31',
            status: 'ativo',
            ranking_roi: 3
        },
        {
            anuncio_id: 4,
            titulo: 'Correia Dentada - Kit Completo',
            canal: 'Mercado Livre',
            produto: 'Correia Dentada',
            investimento_total: 1200.00,
            receita_gerada: 12340.25,
            roi_percentual: 928.35,
            lucro_absoluto: 11140.25,
            visualizacoes: 1850,
            cliques: 320,
            conversoes: 45,
            ctr: 17.3,
            cpc: 3.75,
            cpa: 26.67,
            data_inicio: '2024-01-15',
            data_fim: '2024-01-31',
            status: 'ativo',
            ranking_roi: 4
        },
        {
            anuncio_id: 5,
            titulo: 'Bateria Automotiva 60Ah - Entrega Rápida',
            canal: 'Shopify',
            produto: 'Bateria Automotiva 60Ah',
            investimento_total: 950.00,
            receita_gerada: 18950.00,
            roi_percentual: 1894.74,
            lucro_absoluto: 18000.00,
            visualizacoes: 1650,
            cliques: 280,
            conversoes: 34,
            ctr: 17.0,
            cpc: 3.39,
            cpa: 27.94,
            data_inicio: '2024-01-12',
            data_fim: '2024-01-31',
            status: 'pausado',
            ranking_roi: 5
        },
        {
            anuncio_id: 6,
            titulo: 'Óleo de Motor 5W30 - Sintético Premium',
            canal: 'Mercado Livre',
            produto: 'Óleo de Motor 5W30',
            investimento_total: 800.00,
            receita_gerada: 15680.00,
            roi_percentual: 1860.00,
            lucro_absoluto: 14880.00,
            visualizacoes: 3200,
            cliques: 640,
            conversoes: 234,
            ctr: 20.0,
            cpc: 1.25,
            cpa: 3.42,
            data_inicio: '2024-01-08',
            data_fim: '2024-01-31',
            status: 'ativo',
            ranking_roi: 6
        },
        {
            anuncio_id: 7,
            titulo: 'Farol Honda Civic - Original',
            canal: 'Instagram',
            produto: 'Farol Dianteiro Honda Civic',
            investimento_total: 750.00,
            receita_gerada: 8920.75,
            roi_percentual: 1089.43,
            lucro_absoluto: 8170.75,
            visualizacoes: 1200,
            cliques: 180,
            conversoes: 23,
            ctr: 15.0,
            cpc: 4.17,
            cpa: 32.61,
            data_inicio: '2024-01-20',
            data_fim: '2024-01-31',
            status: 'ativo',
            ranking_roi: 7
        },
        {
            anuncio_id: 8,
            titulo: 'Rolamento Roda - Qualidade Garantida',
            canal: 'Shopify',
            produto: 'Rolamento Roda Dianteira',
            investimento_total: 600.00,
            receita_gerada: 6780.50,
            roi_percentual: 1030.08,
            lucro_absoluto: 6180.50,
            visualizacoes: 980,
            cliques: 156,
            conversoes: 78,
            ctr: 15.9,
            cpc: 3.85,
            cpa: 7.69,
            data_inicio: '2024-01-18',
            data_fim: '2024-01-31',
            status: 'finalizado',
            ranking_roi: 8
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
        console.log('Exportando relatório de ROI...');
    };

    const calcularTotalInvestimento = () => {
        return dados.reduce((total, item) => total + item.investimento_total, 0);
    };

    const calcularTotalReceita = () => {
        return dados.reduce((total, item) => total + item.receita_gerada, 0);
    };

    const calcularROIMedio = () => {
        return dados.reduce((total, item) => total + item.roi_percentual, 0) / dados.length;
    };

    const calcularTotalLucro = () => {
        return dados.reduce((total, item) => total + item.lucro_absoluto, 0);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ativo':
                return 'bg-green-100 text-green-800';
            case 'pausado':
                return 'bg-yellow-100 text-yellow-800';
            case 'finalizado':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getROIColor = (roi: number) => {
        if (roi >= 2000) return 'bg-green-100 text-green-800';
        if (roi >= 1000) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <LayoutGestor>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">ROI por Anúncio</h1>
                                <p className="text-blue-100">Análise de retorno sobre investimento em anúncios</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                                <option value="instagram">Instagram</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filtros.status}
                                onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="todos">Todos os Status</option>
                                <option value="ativo">Ativo</option>
                                <option value="pausado">Pausado</option>
                                <option value="finalizado">Finalizado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ROI Mínimo (%)</label>
                            <input
                                type="number"
                                min="0"
                                value={filtros.roi_minimo}
                                onChange={(e) => setFiltros({ ...filtros, roi_minimo: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Métricas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Investimento Total</p>
                                <p className="text-2xl font-bold text-red-600">
                                    R$ {calcularTotalInvestimento().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                                <p className="text-2xl font-bold text-green-600">
                                    R$ {calcularTotalReceita().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <ShoppingCart className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">ROI Médio</p>
                                <p className="text-2xl font-bold text-purple-600">{calcularROIMedio().toFixed(0)}%</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Lucro Total</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    R$ {calcularTotalLucro().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <Zap className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando análise de ROI...</p>
                    </div>
                )}

                {/* Tabela de ROI */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">Análise de ROI por Anúncio</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ranking</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anúncio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investimento</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receita</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visualizações</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversões</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPA</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dados.map((anuncio, index) => (
                                        <tr key={anuncio.anuncio_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium text-blue-600">#{anuncio.ranking_roi}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{anuncio.titulo}</div>
                                                        <div className="text-sm text-gray-500">{anuncio.produto}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${anuncio.canal === 'Mercado Livre' ? 'bg-yellow-100 text-yellow-800' :
                                                        anuncio.canal === 'Shopify' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {anuncio.canal}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                R$ {anuncio.investimento_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                R$ {anuncio.receita_gerada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getROIColor(anuncio.roi_percentual)}`}>
                                                    {anuncio.roi_percentual.toFixed(0)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                R$ {anuncio.lucro_absoluto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {anuncio.visualizacoes.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {anuncio.conversoes}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                R$ {anuncio.cpa.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(anuncio.status)}`}>
                                                    {anuncio.status}
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum anúncio encontrado</h3>
                        <p className="text-gray-600">Tente ajustar os filtros ou período de análise</p>
                    </div>
                )}
            </div>
        </LayoutGestor>
    );
};

export default ROIAnuncio; 