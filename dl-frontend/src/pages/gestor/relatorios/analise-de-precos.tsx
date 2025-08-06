"use client";

import LayoutGestor from '@/components/layout/LayoutGestor';
import { AnalisePreco, FiltrosRelatorio, RelatoriosService } from '@/services/relatoriosService';
import {
    BarChart3,
    DollarSign,
    Download,
    Eye,
    Filter,
    RefreshCw,
    TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AnalisePrecos: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<AnalisePreco[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filtros, setFiltros] = useState<FiltrosRelatorio>({
        dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dataFim: new Date().toISOString().split('T')[0],
        categoria: 'todas'
    });

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);
            const dadosReais = await RelatoriosService.buscarAnalisePrecos(filtros);
            setDados(dadosReais);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError('Erro ao carregar dados de análise de preços. Tente novamente.');
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
            await RelatoriosService.exportarRelatorio('analise-precos', filtros);
            // TODO: Implementar download do arquivo
            console.log('Relatório exportado com sucesso');
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
        }
    };

    const calcularMediaDiferenca = () => {
        if (dados.length === 0) return '0.0';
        const media = dados.reduce((total, item) => total + item.diferenca_percentual, 0) / dados.length;
        return media.toFixed(1);
    };

    const calcularMediaMargem = () => {
        if (dados.length === 0) return '0.0';
        const media = dados.reduce((total, item) => total + item.margem_atual, 0) / dados.length;
        return media.toFixed(1);
    };

    const getPosicionamentoColor = (posicionamento: string) => {
        switch (posicionamento.toLowerCase()) {
            case 'agressivo':
                return 'text-green-600 bg-green-100';
            case 'competitivo':
                return 'text-blue-600 bg-blue-100';
            case 'acima da média':
                return 'text-orange-600 bg-orange-100';
            case 'premium':
                return 'text-purple-600 bg-purple-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getRecomendacaoColor = (recomendacao: string) => {
        if (recomendacao.includes('aumentar')) {
            return 'text-green-600 bg-green-100';
        } else if (recomendacao.includes('diminuir') || recomendacao.includes('redução')) {
            return 'text-red-600 bg-red-100';
        } else {
            return 'text-blue-600 bg-blue-100';
        }
    };

    if (loading) {
        return (
            <LayoutGestor>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando dados de análise de preços...</p>
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
                                <TrendingUp className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Análise de Preços</h1>
                                <p className="text-blue-100">Análise competitiva e otimização de preços</p>
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
                                <p className="text-sm font-medium text-gray-600">Diferença Média</p>
                                <p className={`text-2xl font-bold ${Number(calcularMediaDiferenca()) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {calcularMediaDiferenca()}%
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Margem Média</p>
                                <p className="text-2xl font-bold text-purple-600">{calcularMediaMargem()}%</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <BarChart3 className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Produtos Analisados</p>
                                <p className="text-2xl font-bold text-indigo-600">{dados.length}</p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-xl">
                                <Eye className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Competitivos</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {dados.filter(item => item.posicionamento === 'Competitivo').length}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <DollarSign className="h-6 w-6 text-green-600" />
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                            <select
                                value={filtros.categoria}
                                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="todas">Todas as Categorias</option>
                                <option value="sistema-freios">Sistema de Freios</option>
                                <option value="suspensao">Suspensão</option>
                                <option value="filtros">Filtros</option>
                                <option value="motor">Motor</option>
                                <option value="lubrificantes">Lubrificantes</option>
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
                        <h3 className="text-lg font-semibold text-gray-800">Análise de Preços</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Atual</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Médio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferença</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posicionamento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margem Atual</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margem Ótima</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recomendação</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dados.map((item) => (
                                    <tr key={item.produto_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.nome_produto}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {item.categoria}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {item.preco_atual.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {item.preco_medio_mercado.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.diferenca_percentual > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {item.diferenca_percentual > 0 ? '+' : ''}{item.diferenca_percentual}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPosicionamentoColor(item.posicionamento || "")}`}>
                                                {item.posicionamento}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.margem_atual > 35 ? 'bg-green-100 text-green-800' :
                                                item.margem_atual > 25 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.margem_atual}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.margem_otima}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`font-medium ${getRecomendacaoColor(item.recomendacao)}`}>
                                                {item.recomendacao}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(item.ultima_atualizacao).toLocaleDateString('pt-BR')}
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

export default AnalisePrecos; 