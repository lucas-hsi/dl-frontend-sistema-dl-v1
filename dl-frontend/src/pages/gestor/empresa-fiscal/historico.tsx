"use client";

import LayoutGestor from '@/components/layout/LayoutGestor';
import {
    AlertCircle,
    CheckCircle,
    Download,
    Eye,
    FileText,
    Filter,
    RefreshCw,
    Search,
    TrendingUp,
    XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface NFe {
    id: number;
    numero: string;
    chave_acesso: string;
    status: string;
    data_emissao: string;
    data_autorizacao?: string;
    valor_total: number;
    cliente_nome: string;
    cliente_cpf_cnpj: string;
    protocolo: string;
    justificativa_cancelamento?: string;
    ambiente: string;
    serie: string;
}

const HistoricoNFes: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [nfes, setNfes] = useState<NFe[]>([]);
    const [filtros, setFiltros] = useState({
        status: 'todos',
        dataInicio: '',
        dataFim: '',
        cliente: '',
        ambiente: 'todos'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    const carregarNFes = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filtros.status !== 'todos') params.append('status', filtros.status);
            if (filtros.dataInicio) params.append('data_inicio', filtros.dataInicio);
            if (filtros.dataFim) params.append('data_fim', filtros.dataFim);
            if (filtros.cliente) params.append('cliente', filtros.cliente);
            if (filtros.ambiente !== 'todos') params.append('ambiente', filtros.ambiente);

            const response = await fetch(`/api/gestor/fiscal/nfe?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setNfes(data);
            } else {
                setError('Erro ao carregar histórico de NF-es');
            }
        } catch (error) {
            console.error('Erro ao carregar NF-es:', error);
            setError('Erro ao carregar histórico de NF-es');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarNFes();
    }, [filtros]);

    const aplicarFiltros = () => {
        carregarNFes();
    };

    const limparFiltros = () => {
        setFiltros({
            status: 'todos',
            dataInicio: '',
            dataFim: '',
            cliente: '',
            ambiente: 'todos'
        });
        setSearchTerm('');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'autorizada':
                return 'text-green-600 bg-green-100';
            case 'pendente':
                return 'text-yellow-600 bg-yellow-100';
            case 'cancelada':
                return 'text-red-600 bg-red-100';
            case 'erro':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'autorizada':
                return <CheckCircle className="h-4 w-4" />;
            case 'pendente':
                return <RefreshCw className="h-4 w-4" />;
            case 'cancelada':
            case 'erro':
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getAmbienteColor = (ambiente: string) => {
        return ambiente === 'producao'
            ? 'text-red-600 bg-red-100'
            : 'text-blue-600 bg-blue-100';
    };

    const nfesFiltradas = nfes.filter(nfe =>
        nfe.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nfe.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nfe.chave_acesso.includes(searchTerm)
    );

    const calcularEstatisticas = () => {
        const total = nfes.length;
        const autorizadas = nfes.filter(n => n.status.toLowerCase() === 'autorizada').length;
        const canceladas = nfes.filter(n => n.status.toLowerCase() === 'cancelada').length;
        const pendentes = nfes.filter(n => n.status.toLowerCase() === 'pendente').length;
        const valorTotal = nfes.reduce((sum, n) => sum + n.valor_total, 0);

        return { total, autorizadas, canceladas, pendentes, valorTotal };
    };

    const stats = calcularEstatisticas();

    if (loading) {
        return (
            <LayoutGestor>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando histórico de NF-es...</p>
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
                                <FileText className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Histórico de NF-es</h1>
                                <p className="text-blue-100">Consulta e gerenciamento de notas fiscais</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={carregarNFes}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Atualizar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Alertas */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <strong>Erro:</strong> {error}
                        </div>
                    </div>
                )}

                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-xl">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Autorizadas</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.autorizadas}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center">
                            <div className="bg-yellow-100 p-3 rounded-xl">
                                <RefreshCw className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendentes}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-3 rounded-xl">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.canceladas}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Filter className="h-5 w-5 mr-2 text-blue-600" />
                        Filtros
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filtros.status}
                                onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="todos">Todos</option>
                                <option value="autorizada">Autorizada</option>
                                <option value="pendente">Pendente</option>
                                <option value="cancelada">Cancelada</option>
                                <option value="erro">Erro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                            <input
                                type="date"
                                value={filtros.dataInicio}
                                onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                            <input
                                type="date"
                                value={filtros.dataFim}
                                onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                            <input
                                type="text"
                                value={filtros.cliente}
                                onChange={(e) => setFiltros(prev => ({ ...prev, cliente: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nome do cliente"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ambiente</label>
                            <select
                                value={filtros.ambiente}
                                onChange={(e) => setFiltros(prev => ({ ...prev, ambiente: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="todos">Todos</option>
                                <option value="homologacao">Homologação</option>
                                <option value="producao">Produção</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            onClick={limparFiltros}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Limpar Filtros
                        </button>
                        <button
                            onClick={aplicarFiltros}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                </div>

                {/* Busca */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Buscar por número, cliente ou chave de acesso..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Lista de NF-es */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        NF-e
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data Emissão
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ambiente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {nfesFiltradas.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>Nenhuma NF-e encontrada</p>
                                        </td>
                                    </tr>
                                ) : (
                                    nfesFiltradas.map((nfe) => (
                                        <tr key={nfe.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{nfe.numero}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Série {nfe.serie}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {nfe.cliente_nome}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {nfe.cliente_cpf_cnpj}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(nfe.data_emissao).toLocaleDateString('pt-BR')}
                                                </div>
                                                {nfe.data_autorizacao && (
                                                    <div className="text-sm text-gray-500">
                                                        Aut: {new Date(nfe.data_autorizacao).toLocaleDateString('pt-BR')}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    R$ {nfe.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(nfe.status)}`}>
                                                    {getStatusIcon(nfe.status)}
                                                    <span className="ml-1">{nfe.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAmbienteColor(nfe.ambiente)}`}>
                                                    {nfe.ambiente}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        // EXCEÇÃO CONTROLADA: download de PDF precisa de URL direta para evitar interferência de interceptors
                                                        onClick={() => window.open(`/api/gestor/fiscal/nfe/${nfe.id}/pdf`, '_blank')}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Visualizar PDF"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        // EXCEÇÃO CONTROLADA: download de arquivo precisa de URL direta para evitar interferência de interceptors
                                                        onClick={() => window.open(`/api/gestor/fiscal/nfe/${nfe.id}/download`, '_blank')}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Download XML"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </LayoutGestor>
    );
};

export default HistoricoNFes;