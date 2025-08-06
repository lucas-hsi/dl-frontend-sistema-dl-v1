"use client";

import LayoutGestor from '@/components/layout/LayoutGestor';
import {
    AlertCircle,
    CheckCircle,
    Download,
    Eye,
    FileText,
    RefreshCw,
    Search,
    XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Venda {
    id: number;
    numero_venda: string;
    data_venda: string;
    cliente_nome: string;
    cliente_cpf_cnpj: string;
    valor_total: number;
    status: string;
    canal: string;
}

interface NFe {
    id: number;
    numero: string;
    chave_acesso: string;
    status: string;
    data_emissao: string;
    valor_total: number;
    cliente_nome: string;
    protocolo: string;
    justificativa_cancelamento?: string;
}

const EmitirNFe: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [nfes, setNfes] = useState<NFe[]>([]);
    const [selectedVenda, setSelectedVenda] = useState<number | null>(null);
    const [emitting, setEmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const carregarVendas = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/vendas?status=finalizada&sem_nfe=true');
            if (response.ok) {
                const data = await response.json();
                setVendas(data);
            }
        } catch (error) {
            console.error('Erro ao carregar vendas:', error);
        } finally {
            setLoading(false);
        }
    };

    const carregarNFes = async () => {
        try {
            const response = await fetch('/api/gestor/fiscal/nfe');
            if (response.ok) {
                const data = await response.json();
                setNfes(data);
            }
        } catch (error) {
            console.error('Erro ao carregar NF-es:', error);
        }
    };

    useEffect(() => {
        carregarVendas();
        carregarNFes();
    }, []);

    const emitirNFe = async (vendaId: number) => {
        try {
            setEmitting(true);
            setError(null);
            setSuccess(null);

            const response = await fetch('/api/gestor/fiscal/nfe/emitir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    venda_id: vendaId,
                    config_fiscal_id: 1 // TODO: Permitir seleção da configuração
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(`NF-e emitida com sucesso! Número: ${data.numero}`);
                carregarVendas(); // Recarregar vendas
                carregarNFes(); // Recarregar NF-es
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Erro ao emitir NF-e');
            }
        } catch (error) {
            console.error('Erro ao emitir NF-e:', error);
            setError('Erro ao emitir NF-e. Tente novamente.');
        } finally {
            setEmitting(false);
        }
    };

    const cancelarNFe = async (nfeId: number, justificativa: string) => {
        try {
            const response = await fetch(`/api/gestor/fiscal/nfe/${nfeId}/cancelar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ justificativa }),
            });

            if (response.ok) {
                setSuccess('NF-e cancelada com sucesso!');
                carregarNFes();
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Erro ao cancelar NF-e');
            }
        } catch (error) {
            console.error('Erro ao cancelar NF-e:', error);
            setError('Erro ao cancelar NF-e. Tente novamente.');
        }
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

    const vendasFiltradas = vendas.filter(venda =>
        venda.numero_venda.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venda.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <LayoutGestor>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando vendas...</p>
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
                                <h1 className="text-3xl font-bold text-white">Emitir NF-e</h1>
                                <p className="text-blue-100">Emissão de notas fiscais eletrônicas</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => { carregarVendas(); carregarNFes(); }}
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

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <strong>Sucesso:</strong> {success}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Vendas Pendentes */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-600" />
                            Vendas Pendentes de NF-e
                        </h2>

                        {/* Busca */}
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar por número da venda ou cliente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Lista de Vendas */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {vendasFiltradas.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>Nenhuma venda pendente de NF-e</p>
                                </div>
                            ) : (
                                vendasFiltradas.map((venda) => (
                                    <div key={venda.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800">
                                                    Venda #{venda.numero_venda}
                                                </h3>
                                                <p className="text-sm text-gray-600">{venda.cliente_nome}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(venda.data_venda).toLocaleDateString('pt-BR')} •
                                                    R$ {venda.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => emitirNFe(venda.id)}
                                                disabled={emitting}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                                            >
                                                {emitting ? 'Emitindo...' : 'Emitir NF-e'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* NF-es Emitidas */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-green-600" />
                            NF-es Emitidas
                        </h2>

                        {/* Lista de NF-es */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {nfes.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>Nenhuma NF-e emitida</p>
                                </div>
                            ) : (
                                nfes.map((nfe) => (
                                    <div key={nfe.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="font-semibold text-gray-800">
                                                        NF-e #{nfe.numero}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(nfe.status)}`}>
                                                        {getStatusIcon(nfe.status)}
                                                        <span className="ml-1">{nfe.status}</span>
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{nfe.cliente_nome}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(nfe.data_emissao).toLocaleDateString('pt-BR')} •
                                                    R$ {nfe.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                                {nfe.protocolo && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Protocolo: {nfe.protocolo}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    // EXCEÇÃO CONTROLADA: download de PDF precisa de URL direta para evitar interferência de interceptors
                                                    onClick={() => window.open(`/api/gestor/fiscal/nfe/${nfe.id}/pdf`, '_blank')}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                </button>
                                                <button
                                                    // EXCEÇÃO CONTROLADA: download de arquivo precisa de URL direta para evitar interferência de interceptors
                                                    onClick={() => window.open(`/api/gestor/fiscal/nfe/${nfe.id}/download`, '_blank')}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    <Download className="h-3 w-3" />
                                                </button>
                                                {nfe.status === 'AUTORIZADA' && (
                                                    <button
                                                        onClick={() => {
                                                            const justificativa = prompt('Justificativa para cancelamento:');
                                                            if (justificativa) {
                                                                cancelarNFe(nfe.id, justificativa);
                                                            }
                                                        }}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        <XCircle className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutGestor>
    );
};

export default EmitirNFe;