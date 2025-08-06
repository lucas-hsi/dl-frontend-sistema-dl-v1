"use client";

import LayoutGestor from '@/components/layout/LayoutGestor';
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    RefreshCw,
    Server,
    Shield,
    Wifi,
    XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface StatusSEFAZ {
    ambiente: string;
    status: string;
    ultima_verificacao: string;
    tempo_resposta: number;
    servicos: {
        autorizacao: boolean;
        consulta: boolean;
        cancelamento: boolean;
        inutilizacao: boolean;
    };
    detalhes: string;
}

interface StatusServico {
    nome: string;
    status: 'online' | 'offline' | 'warning';
    tempo_resposta: number;
    ultima_verificacao: string;
    detalhes: string;
}

const StatusSEFAZ: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [statusHomologacao, setStatusHomologacao] = useState<StatusSEFAZ | null>(null);
    const [statusProducao, setStatusProducao] = useState<StatusSEFAZ | null>(null);
    const [servicos, setServicos] = useState<StatusServico[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string>('');

    const carregarStatus = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/gestor/fiscal/status-sefaz');
            if (response.ok) {
                const data = await response.json();

                // Simular dados de status (em produção, viriam do backend)
                const mockData = {
                    homologacao: {
                        ambiente: 'Homologação',
                        status: 'online',
                        ultima_verificacao: new Date().toISOString(),
                        tempo_resposta: 245,
                        servicos: {
                            autorizacao: true,
                            consulta: true,
                            cancelamento: true,
                            inutilizacao: true
                        },
                        detalhes: 'Todos os serviços funcionando normalmente'
                    },
                    producao: {
                        ambiente: 'Produção',
                        status: 'online',
                        ultima_verificacao: new Date().toISOString(),
                        tempo_resposta: 189,
                        servicos: {
                            autorizacao: true,
                            consulta: true,
                            cancelamento: true,
                            inutilizacao: true
                        },
                        detalhes: 'Sistema operacional'
                    }
                };

                setStatusHomologacao(mockData.homologacao);
                setStatusProducao(mockData.producao);
                setLastUpdate(new Date().toLocaleString('pt-BR'));

                // Simular serviços individuais
                setServicos([
                    {
                        nome: 'Autorização NF-e',
                        status: 'online',
                        tempo_resposta: 245,
                        ultima_verificacao: new Date().toISOString(),
                        detalhes: 'Serviço funcionando normalmente'
                    },
                    {
                        nome: 'Consulta Protocolo',
                        status: 'online',
                        tempo_resposta: 189,
                        ultima_verificacao: new Date().toISOString(),
                        detalhes: 'Resposta rápida'
                    },
                    {
                        nome: 'Cancelamento NF-e',
                        status: 'online',
                        tempo_resposta: 312,
                        ultima_verificacao: new Date().toISOString(),
                        detalhes: 'Operacional'
                    },
                    {
                        nome: 'Inutilização',
                        status: 'online',
                        tempo_resposta: 278,
                        ultima_verificacao: new Date().toISOString(),
                        detalhes: 'Funcionando'
                    },
                    {
                        nome: 'Consulta Status',
                        status: 'online',
                        tempo_resposta: 156,
                        ultima_verificacao: new Date().toISOString(),
                        detalhes: 'Resposta imediata'
                    }
                ]);

            } else {
                setError('Erro ao carregar status SEFAZ');
            }
        } catch (error) {
            console.error('Erro ao carregar status:', error);
            setError('Erro ao carregar status SEFAZ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarStatus();

        // Atualizar a cada 5 minutos
        const interval = setInterval(carregarStatus, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'online':
                return 'text-green-600 bg-green-100';
            case 'offline':
                return 'text-red-600 bg-red-100';
            case 'warning':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'online':
                return <CheckCircle className="h-4 w-4" />;
            case 'offline':
                return <XCircle className="h-4 w-4" />;
            case 'warning':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getTempoRespostaColor = (tempo: number) => {
        if (tempo < 200) return 'text-green-600';
        if (tempo < 500) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (loading) {
        return (
            <LayoutGestor>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Verificando status SEFAZ...</p>
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
                                <h1 className="text-3xl font-bold text-white">Status SEFAZ</h1>
                                <p className="text-blue-100">Monitoramento dos serviços da SEFAZ</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-white text-sm">
                                <p>Última atualização:</p>
                                <p className="font-semibold">{lastUpdate}</p>
                            </div>
                            <button
                                onClick={carregarStatus}
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

                {/* Status dos Ambientes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Homologação */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <Wifi className="h-5 w-5 mr-2 text-blue-600" />
                                Ambiente de Homologação
                            </h2>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusHomologacao?.status || 'offline')}`}>
                                {getStatusIcon(statusHomologacao?.status || 'offline')}
                                <span className="ml-1">{statusHomologacao?.status || 'Offline'}</span>
                            </span>
                        </div>

                        {statusHomologacao && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Tempo de Resposta</p>
                                        <p className={`text-lg font-semibold ${getTempoRespostaColor(statusHomologacao.tempo_resposta)}`}>
                                            {statusHomologacao.tempo_resposta}ms
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Última Verificação</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {new Date(statusHomologacao.ultima_verificacao).toLocaleTimeString('pt-BR')}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Serviços</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className={`h-4 w-4 ${statusHomologacao.servicos.autorizacao ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className="text-sm">Autorização</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className={`h-4 w-4 ${statusHomologacao.servicos.consulta ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className="text-sm">Consulta</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className={`h-4 w-4 ${statusHomologacao.servicos.cancelamento ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className="text-sm">Cancelamento</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className={`h-4 w-4 ${statusHomologacao.servicos.inutilizacao ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className="text-sm">Inutilização</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">{statusHomologacao.detalhes}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Produção */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <Server className="h-5 w-5 mr-2 text-green-600" />
                                Ambiente de Produção
                            </h2>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusProducao?.status || 'offline')}`}>
                                {getStatusIcon(statusProducao?.status || 'offline')}
                                <span className="ml-1">{statusProducao?.status || 'Offline'}</span>
                            </span>
                        </div>

                        {statusProducao && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Tempo de Resposta</p>
                                        <p className={`text-lg font-semibold ${getTempoRespostaColor(statusProducao.tempo_resposta)}`}>
                                            {statusProducao.tempo_resposta}ms
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Última Verificação</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {new Date(statusProducao.ultima_verificacao).toLocaleTimeString('pt-BR')}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Serviços</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className={`h-4 w-4 ${statusProducao.servicos.autorizacao ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className="text-sm">Autorização</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className={`h-4 w-4 ${statusProducao.servicos.consulta ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className="text-sm">Consulta</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className={`h-4 w-4 ${statusProducao.servicos.cancelamento ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className="text-sm">Cancelamento</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className={`h-4 w-4 ${statusProducao.servicos.inutilizacao ? 'text-green-600' : 'text-red-600'}`} />
                                            <span className="text-sm">Inutilização</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-3">
                                    <p className="text-sm text-green-800">{statusProducao.detalhes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Serviços Individuais */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-purple-600" />
                        Status dos Serviços
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {servicos.map((servico, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-gray-900">{servico.nome}</h3>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(servico.status)}`}>
                                        {getStatusIcon(servico.status)}
                                        <span className="ml-1">{servico.status}</span>
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tempo de Resposta:</span>
                                        <span className={`font-medium ${getTempoRespostaColor(servico.tempo_resposta)}`}>
                                            {servico.tempo_resposta}ms
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Última Verificação:</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date(servico.ultima_verificacao).toLocaleTimeString('pt-BR')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        {servico.detalhes}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Informações Adicionais */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Sistema</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="font-medium text-blue-900 mb-2">Certificado Digital</h3>
                            <p className="text-sm text-blue-700">Válido até 31/12/2024</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <h3 className="font-medium text-green-900 mb-2">Contingência</h3>
                            <p className="text-sm text-green-700">Não ativo</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <h3 className="font-medium text-purple-900 mb-2">Última Sincronização</h3>
                            <p className="text-sm text-purple-700">Há 2 minutos</p>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutGestor>
    );
};

export default StatusSEFAZ;