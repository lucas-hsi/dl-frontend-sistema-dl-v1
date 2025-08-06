"use client";

import LayoutGestor from '@/components/layout/LayoutGestor';
import {
    ArrowRight,
    BarChart3,
    Calendar,
    DollarSign,
    Download,
    Eye,
    Filter,
    Package,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const RelatoriosIndex: React.FC = () => {
    const relatorios = [
        {
            id: 'performance-canal',
            titulo: 'Performance por Canal',
            descricao: 'Análise detalhada de performance por canal de venda',
            icone: BarChart3,
            cor: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            href: '/gestor/relatorios/performance-canal',
            metricas: ['Receita por Canal', 'Conversão', 'ROI', 'CTR']
        },
        {
            id: 'produtos-top-vendas',
            titulo: 'Produtos Top Vendas',
            descricao: 'Ranking dos produtos mais vendidos por período',
            icone: Package,
            cor: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            href: '/gestor/relatorios/produtos-top-vendas',
            metricas: ['Ranking de Produtos', 'Margem de Lucro', 'Crescimento', 'Estoque']
        },
        {
            id: 'analise-precos',
            titulo: 'Análise de Preços',
            descricao: 'Comparação com mercado e recomendações de preços',
            icone: DollarSign,
            cor: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            href: '/gestor/relatorios/analise-precos',
            metricas: ['Preço vs Mercado', 'Recomendações', 'Margem Ótima', 'Concorrentes']
        },
        {
            id: 'roi-anuncio',
            titulo: 'ROI por Anúncio',
            descricao: 'Análise de retorno sobre investimento em anúncios',
            icone: TrendingUp,
            cor: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            href: '/gestor/relatorios/roi-anuncio',
            metricas: ['ROI por Anúncio', 'Investimento', 'Receita Gerada', 'CPA']
        }
    ];

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
                                <h1 className="text-3xl font-bold text-white">Relatórios & Analytics</h1>
                                <p className="text-blue-100">Análises estratégicas e insights de negócio</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-white" />
                                <span className="text-white text-sm">Última atualização: Hoje</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards de Relatórios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatorios.map((relatorio) => {
                        const IconComponent = relatorio.icone;
                        return (
                            <Link
                                key={relatorio.id}
                                href={relatorio.href}
                                className="group"
                            >
                                <div className={`bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 group-hover:scale-105 ${relatorio.bgColor}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-r ${relatorio.cor}`}>
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {relatorio.titulo}
                                    </h3>

                                    <p className="text-gray-600 mb-4">
                                        {relatorio.descricao}
                                    </p>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Eye className="w-4 h-4" />
                                            <span>Visualizar relatório completo</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {relatorio.metricas.map((metrica, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                >
                                                    {metrica}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Informações Adicionais */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Filter className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Filtros Avançados</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Todos os relatórios possuem filtros por período, canal, categoria e outros parâmetros para análise detalhada.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Download className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Exportação</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Exporte relatórios em CSV ou Excel para análise externa e compartilhamento com a equipe.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Dados em Tempo Real</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Dados atualizados automaticamente com informações do sistema e integrações externas.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">
                        Precisa de Relatórios Personalizados?
                    </h3>
                    <p className="text-indigo-100 mb-4">
                        Entre em contato com nossa equipe para criar relatórios específicos para suas necessidades.
                    </p>
                    <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                        Solicitar Relatório Personalizado
                    </button>
                </div>
            </div>
        </LayoutGestor>
    );
};

export default RelatoriosIndex; 