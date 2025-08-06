"use client";

import LayoutGestor from '@/components/layout/LayoutGestor';
import { AnuncioROI, FiltrosRelatorio, RelatoriosService } from '@/services/relatoriosService';
import {
    Activity,
    BarChart3,
    DollarSign,
    Download,
    Eye,
    Filter,
    RefreshCw,
    TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ROIPorAnuncio: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<AnuncioROI[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filtros, setFiltros] = useState<FiltrosRelatorio>({
        dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dataFim: new Date().toISOString().split('T')[0],
        canal: 'todos',
        status: 'todos'
    });

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);
            const dadosReais = await RelatoriosService.buscarROIAnuncio(filtros);
            setDados(dadosReais);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError('Erro ao carregar dados de ROI por anúncio. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const aplicarFiltros = () => {
        carregarDados();
    };

    const exportarRelatorio = async () => {
        try {
            await RelatoriosService.exportarRelatorio('roi-anuncio', filtros);
            // TODO: Implementar download do arquivo
            console.log('Relatório exportado com sucesso');
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
        }
    };

    const calcularTotalInvestimento = () => {
        return dados.reduce((total, item) => total + item.investimento_total, 0);
    };

    const calcularTotalReceita = () => {
        return dados.reduce((total, item) => total + item.receita_gerada, 0);
    };

    const calcularMediaROI = () => {
        if (dados.length === 0) return '0.0';
        const media = dados.reduce((total, item) => total + item.roi_percentual, 0) / dados.length;
        return media.toFixed(1);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'ativo':
                return 'text-green-600 bg-green-100';
            case 'pausado':
                return 'text-yellow-600 bg-yellow-100';
            case 'finalizado':
                return 'text-gray-600 bg-gray-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getROIColor = (roi: number) => {
        if (roi >= 300) return 'text-green-600';
        if (roi >= 200) return 'text-blue-600';
        if (roi >= 100) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (loading) {
        return (
            <LayoutGestor>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando dados de ROI por anúncio...</p>
                    </div>
                </div>
            </LayoutGestor>
        );
    }

    if (error) {
        return (
            <LayoutGestor>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                        <strong>Erro:</strong> {error}
                        <button
                            onClick={carregarDados}
                            className="ml-4 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </LayoutGestor>
        );
    }

    return (
        <LayoutGestor>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <Activity className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">ROI por Anúncio</h1>
                                <p className="text-blue-100">Análise de retorno sobre investimento por anúncio</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={aplicarFiltros}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Atualizar</span>
                            </button>
                            <button
                                onClick={exportarRelatorio}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
                            >
                                <Download className="h-4 w-4" />
                                <span>Exportar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Métricas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                                <p className="text-2xl font-bold text-green-600">
                                    R$ {calcularTotalReceita().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Investimento Total</p>
                                <p className="text-2xl font-bold text-red-600">
                                    R$ {calcularTotalInvestimento().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-xl">
                                <TrendingUp className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">ROI Médio</p>
                                <p className="text-2xl font-bold text-purple-600">{calcularMediaROI()}%</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <BarChart3 className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Campanhas Ativas</p>
                                <p className="text-2xl font-bold text-indigo-600">
                                    {dados.filter(item => item.status === 'ativo').length}
                                </p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-xl">
                                <Eye className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <Filter className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                            <input
                                type="date"
                                value={filtros.dataInicio}
                                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                            <input
                                type="date"
                                value={filtros.dataFim}
                                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Canal</label>
                            <select
                                value={filtros.canal}
                                onChange={(e) => setFiltros({ ...filtros, canal: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="todos">Todos os Canais</option>
                                <option value="mercado-livre">Mercado Livre</option>
                                <option value="shopify">Shopify</option>
                                <option value="instagram">Instagram</option>
                                <option value="facebook">Facebook</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={aplicarFiltros}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabela de Dados */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">ROI por Anúncio</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anúncio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investimento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receita</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliques</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversões</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custo/Conv.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dados.map((item) => (
                                    <tr key={item.anuncio_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.titulo}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.canal}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.produto}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {item.investimento_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {item.receita_gerada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`font-bold ${getROIColor(item.roi_percentual)}`}>
                                                {item.roi_percentual.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.cliques}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ctr}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {item.cpc}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.conversoes}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {item.cpa.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </LayoutGestor>
    );
};

export default ROIPorAnuncio; 