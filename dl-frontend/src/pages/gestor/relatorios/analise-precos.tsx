"use client";

import LayoutGestor from '@/components/layout/LayoutGestor';
import {
    AlertCircle,
    BarChart3,
    DollarSign,
    Download,
    Filter,
    Package,
    RefreshCw,
    Target,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AnalisePreco {
    produto_id: number;
    nome_produto: string;
    categoria: string;
    preco_atual: number;
    preco_medio_mercado: number;
    preco_minimo_mercado: number;
    preco_maximo_mercado: number;
    diferenca_percentual: number;
    posicao_ranking: number;
    margem_atual: number;
    margem_otima: number;
    recomendacao: 'aumentar' | 'manter' | 'diminuir';
    ultima_atualizacao: string;
    concorrentes_analisados: number;
}

interface FiltrosRelatorio {
    dataInicio: string;
    dataFim: string;
    categoria: string;
    margem_minima: number;
    margem_maxima: number;
}

const AnalisePrecos: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<AnalisePreco[]>([]);
    const [filtros, setFiltros] = useState<FiltrosRelatorio>({
        dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dataFim: new Date().toISOString().split('T')[0],
        categoria: 'todas',
        margem_minima: 0,
        margem_maxima: 100
    });

    // Dados mockados
    const dadosMock: AnalisePreco[] = [
        {
            produto_id: 1,
            nome_produto: 'Pastilha de Freio Bosch',
            categoria: 'Sistema de Freios',
            preco_atual: 88.50,
            preco_medio_mercado: 92.30,
            preco_minimo_mercado: 75.00,
            preco_maximo_mercado: 120.00,
            diferenca_percentual: -4.1,
            posicao_ranking: 3,
            margem_atual: 35.2,
            margem_otima: 38.5,
            recomendacao: 'aumentar',
            ultima_atualizacao: '2024-01-15',
            concorrentes_analisados: 12
        },
        {
            produto_id: 2,
            nome_produto: 'Amortecedor Dianteiro Honda Civic',
            categoria: 'Suspensão',
            preco_atual: 175.00,
            preco_medio_mercado: 168.50,
            preco_minimo_mercado: 145.00,
            preco_maximo_mercado: 195.00,
            diferenca_percentual: 3.9,
            posicao_ranking: 7,
            margem_atual: 28.7,
            margem_otima: 32.0,
            recomendacao: 'manter',
            ultima_atualizacao: '2024-01-14',
            concorrentes_analisados: 8
        },
        {
            produto_id: 3,
            nome_produto: 'Filtro de Ar Motor',
            categoria: 'Filtros',
            preco_atual: 28.90,
            preco_medio_mercado: 32.15,
            preco_minimo_mercado: 25.00,
            preco_maximo_mercado: 45.00,
            diferenca_percentual: -10.1,
            posicao_ranking: 2,
            margem_atual: 42.1,
            margem_otima: 45.0,
            recomendacao: 'aumentar',
            ultima_atualizacao: '2024-01-13',
            concorrentes_analisados: 15
        },
        {
            produto_id: 4,
            nome_produto: 'Correia Dentada',
            categoria: 'Motor',
            preco_atual: 137.00,
            preco_medio_mercado: 142.80,
            preco_minimo_mercado: 120.00,
            preco_maximo_mercado: 165.00,
            diferenca_percentual: -4.1,
            posicao_ranking: 4,
            margem_atual: 31.5,
            margem_otima: 35.0,
            recomendacao: 'aumentar',
            ultima_atualizacao: '2024-01-12',
            concorrentes_analisados: 10
        },
        {
            produto_id: 5,
            nome_produto: 'Bateria Automotiva 60Ah',
            categoria: 'Elétrica',
            preco_atual: 278.00,
            preco_medio_mercado: 285.50,
            preco_minimo_mercado: 250.00,
            preco_maximo_mercado: 320.00,
            diferenca_percentual: -2.6,
            posicao_ranking: 5,
            margem_atual: 25.8,
            margem_otima: 28.0,
            recomendacao: 'aumentar',
            ultima_atualizacao: '2024-01-11',
            concorrentes_analisados: 6
        },
        {
            produto_id: 6,
            nome_produto: 'Óleo de Motor 5W30',
            categoria: 'Lubrificantes',
            preco_atual: 33.50,
            preco_medio_mercado: 30.25,
            preco_minimo_mercado: 28.00,
            preco_maximo_mercado: 38.00,
            diferenca_percentual: 10.7,
            posicao_ranking: 8,
            margem_atual: 38.9,
            margem_otima: 35.0,
            recomendacao: 'diminuir',
            ultima_atualizacao: '2024-01-10',
            concorrentes_analisados: 20
        },
        {
            produto_id: 7,
            nome_produto: 'Farol Dianteiro Honda Civic',
            categoria: 'Iluminação',
            preco_atual: 193.90,
            preco_medio_mercado: 188.75,
            preco_minimo_mercado: 165.00,
            preco_maximo_mercado: 220.00,
            diferenca_percentual: 2.7,
            posicao_ranking: 6,
            margem_atual: 33.2,
            margem_otima: 35.0,
            recomendacao: 'manter',
            ultima_atualizacao: '2024-01-09',
            concorrentes_analisados: 9
        },
        {
            produto_id: 8,
            nome_produto: 'Rolamento Roda Dianteira',
            categoria: 'Suspensão',
            preco_atual: 43.50,
            preco_medio_mercado: 45.80,
            preco_minimo_mercado: 38.00,
            preco_maximo_mercado: 55.00,
            diferenca_percentual: -5.0,
            posicao_ranking: 3,
            margem_atual: 29.8,
            margem_otima: 32.0,
            recomendacao: 'aumentar',
            ultima_atualizacao: '2024-01-08',
            concorrentes_analisados: 11
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
        console.log('Exportando análise de preços...');
    };

    const calcularMediaPreco = () => {
        return dados.reduce((total, item) => total + item.preco_atual, 0) / dados.length;
    };

    const calcularMediaDiferenca = () => {
        return dados.reduce((total, item) => total + item.diferenca_percentual, 0) / dados.length;
    };

    const calcularMediaMargem = () => {
        return dados.reduce((total, item) => total + item.margem_atual, 0) / dados.length;
    };

    const getRecomendacaoIcon = (recomendacao: string) => {
        switch (recomendacao) {
            case 'aumentar':
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'diminuir':
                return <TrendingDown className="w-4 h-4 text-red-500" />;
            default:
                return <Target className="w-4 h-4 text-blue-500" />;
        }
    };

    const getRecomendacaoColor = (recomendacao: string) => {
        switch (recomendacao) {
            case 'aumentar':
                return 'bg-green-100 text-green-800';
            case 'diminuir':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <LayoutGestor>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Análise de Preços</h1>
                                <p className="text-blue-100">Comparação com mercado e recomendações de preços</p>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                            <select
                                value={filtros.categoria}
                                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="todas">Todas as Categorias</option>
                                <option value="sistema_freios">Sistema de Freios</option>
                                <option value="suspensao">Suspensão</option>
                                <option value="filtros">Filtros</option>
                                <option value="motor">Motor</option>
                                <option value="eletrica">Elétrica</option>
                                <option value="lubrificantes">Lubrificantes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Margem Mínima (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={filtros.margem_minima}
                                onChange={(e) => setFiltros({ ...filtros, margem_minima: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Margem Máxima (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={filtros.margem_maxima}
                                onChange={(e) => setFiltros({ ...filtros, margem_maxima: Number(e.target.value) })}
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
                                <p className="text-sm font-medium text-gray-600">Preço Médio</p>
                                <p className="text-2xl font-bold text-green-600">
                                    R$ {calcularMediaPreco().toFixed(2)}
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Diferença Média</p>
                                <p className={`text-2xl font-bold ${calcularMediaDiferenca() > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                    {calcularMediaDiferenca().toFixed(1)}%
                                </p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Margem Média</p>
                                <p className="text-2xl font-bold text-purple-600">{calcularMediaMargem().toFixed(1)}%</p>
                            </div>
                            <Target className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Produtos Analisados</p>
                                <p className="text-2xl font-bold text-orange-600">{dados.length}</p>
                            </div>
                            <Package className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando análise de preços...</p>
                    </div>
                )}

                {/* Tabela de Análise */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">Análise de Preços por Produto</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Atual</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Médio Mercado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferença</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ranking</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margem Atual</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margem Ótima</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recomendação</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concorrentes</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dados.map((produto, index) => (
                                        <tr key={produto.produto_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{produto.nome_produto}</div>
                                                        <div className="text-sm text-gray-500">ID: {produto.produto_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    {produto.categoria}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                R$ {produto.preco_atual.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                R$ {produto.preco_medio_mercado.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${produto.diferenca_percentual > 0 ? 'bg-green-100 text-green-800' :
                                                        produto.diferenca_percentual < 0 ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {produto.diferenca_percentual > 0 ? '+' : ''}{produto.diferenca_percentual.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                #{produto.posicao_ranking}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${produto.margem_atual >= 40 ? 'bg-green-100 text-green-800' :
                                                        produto.margem_atual >= 30 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {produto.margem_atual}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {produto.margem_otima}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRecomendacaoColor(produto.recomendacao)}`}>
                                                    {getRecomendacaoIcon(produto.recomendacao)}
                                                    <span className="ml-1 capitalize">{produto.recomendacao}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {produto.concorrentes_analisados}
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                        <p className="text-gray-600">Tente ajustar os filtros ou período de análise</p>
                    </div>
                )}
            </div>
        </LayoutGestor>
    );
};

export default AnalisePrecos; 