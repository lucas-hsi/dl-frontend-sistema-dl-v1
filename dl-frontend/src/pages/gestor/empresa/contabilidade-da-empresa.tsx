"use client";

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LayoutGestor from '@/components/layout/LayoutGestor';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Building2,
    Calendar,
    Download,
    FileText,
    FileX,
    FileSpreadsheet,
    FileImage,
    Filter,
    Loader2,
    Plus,
    Receipt,
    Search,
    TrendingDown,
    TrendingUp,
    Upload,
    X,
    DollarSign,
    CreditCard,
    Calculator,
    Shield,
    CheckCircle,
    Clock,
    AlertTriangle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface LancamentoContabil {
    id: string;
    tipo: 'entrada' | 'saida';
    valor: number;
    data: string;
    canal: string;
    descricao: string;
    anexo?: string;
    imposto_gerado: number;
    status: 'pendente' | 'processado' | 'erro';
    categoria: string;
}

interface ResumoContabil {
    total_entradas: number;
    total_saidas: number;
    saldo: number;
    impostos_gerados: number;
    lancamentos_pendentes: number;
    lancamentos_processados: number;
}

const ContabilidadeDaEmpresa: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<ResumoContabil | null>(null);
    const [lancamentos, setLancamentos] = useState<LancamentoContabil[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [filtros, setFiltros] = useState({
        dataInicio: '',
        dataFim: '',
        tipo: 'todos',
        canal: 'todos',
        status: 'todos'
    });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);

            // FUTURO: Integração com API de NF-e (ex: PyTrustNFe)
            // FUTURO: Consulta de notas no SEFAZ (via certificado digital A1)
            // FUTURO: Integração com vendas do Balcão
            // FUTURO: Integração com vendas do Shopify
            // FUTURO: API de pagamento de impostos

            // Mock data para demonstração
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockResumo: ResumoContabil = {
                total_entradas: 125000.00,
                total_saidas: 85000.00,
                saldo: 40000.00,
                impostos_gerados: 18750.00,
                lancamentos_pendentes: 3,
                lancamentos_processados: 47
            };

            const mockLancamentos: LancamentoContabil[] = [
                {
                    id: '001',
                    tipo: 'entrada',
                    valor: 2500.00,
                    data: '2024-01-15',
                    canal: 'Balcão',
                    descricao: 'Venda de peças automotivas',
                    anexo: 'nfe-001.xml',
                    imposto_gerado: 375.00,
                    status: 'processado',
                    categoria: 'Vendas'
                },
                {
                    id: '002',
                    tipo: 'entrada',
                    valor: 1800.00,
                    data: '2024-01-14',
                    canal: 'Shopify',
                    descricao: 'Venda online - frete grátis',
                    anexo: 'nfe-002.xml',
                    imposto_gerado: 270.00,
                    status: 'processado',
                    categoria: 'Vendas Online'
                },
                {
                    id: '003',
                    tipo: 'saida',
                    valor: 5000.00,
                    data: '2024-01-13',
                    canal: 'Fornecedor',
                    descricao: 'Compra de estoque - peças importadas',
                    anexo: 'nfe-fornecedor-001.xml',
                    imposto_gerado: 750.00,
                    status: 'processado',
                    categoria: 'Compras'
                },
                {
                    id: '004',
                    tipo: 'entrada',
                    valor: 3200.00,
                    data: '2024-01-12',
                    canal: 'Mercado Livre',
                    descricao: 'Venda marketplace - frete pago',
                    imposto_gerado: 480.00,
                    status: 'pendente',
                    categoria: 'Marketplace'
                },
                {
                    id: '005',
                    tipo: 'saida',
                    valor: 1200.00,
                    data: '2024-01-11',
                    canal: 'Serviços',
                    descricao: 'Pagamento de impostos - ICMS',
                    imposto_gerado: 0,
                    status: 'processado',
                    categoria: 'Impostos'
                }
            ];

            setDados(mockResumo);
            setLancamentos(mockLancamentos);
        } catch (err) {
            setError('Erro ao carregar dados contábeis');
            console.error('Erro ao carregar dados:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const getTipoColor = (tipo: string) => {
        return tipo === 'entrada' 
            ? 'text-green-600 bg-green-100' 
            : 'text-red-600 bg-red-100';
    };

    const getTipoIcon = (tipo: string) => {
        return tipo === 'entrada' 
            ? <TrendingUp className="w-4 h-4" />
            : <TrendingDown className="w-4 h-4" />;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processado':
                return 'text-green-600 bg-green-100';
            case 'pendente':
                return 'text-yellow-600 bg-yellow-100';
            case 'erro':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processado':
                return <CheckCircle className="w-4 h-4" />;
            case 'pendente':
                return <Clock className="w-4 h-4" />;
            case 'erro':
                return <AlertTriangle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadFile(file);
        }
    };

    const handleUploadSubmit = async () => {
        if (!uploadFile) return;

        try {
            // FUTURO: Upload para servidor e processamento automático
            // FUTURO: Extração de dados de XML/PDF/Excel
            // FUTURO: Validação com SEFAZ
            
            console.log('Arquivo enviado:', uploadFile.name);
            setShowUploadModal(false);
            setUploadFile(null);
            
            // Recarregar dados após upload
            await carregarDados();
        } catch (error) {
            console.error('Erro no upload:', error);
        }
    };

    return (
        <ProtectedRoute>
            <LayoutGestor>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-6 shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-3 rounded-2xl">
                                    <FileText className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Contabilidade da Empresa</h1>
                                    <p className="text-blue-100">Gestão completa de entradas, saídas e impostos</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                                >
                                    <Upload className="w-4 h-4" />
                                    Anexar Documento
                                </button>
                                <div className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-white" />
                                    <span className="text-white text-sm">Última atualização: Hoje</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cards de Resumo */}
                    {dados && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
                        >
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Entradas</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatarValor(dados.total_entradas)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <TrendingDown className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Saídas</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatarValor(dados.total_saidas)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Saldo</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatarValor(dados.saldo)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Calculator className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Impostos Gerados</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatarValor(dados.impostos_gerados)}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Filtros */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-6 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                                <select
                                    value={filtros.tipo}
                                    onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="todos">Todos os Tipos</option>
                                    <option value="entrada">Entradas</option>
                                    <option value="saida">Saídas</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Canal</label>
                                <select
                                    value={filtros.canal}
                                    onChange={(e) => setFiltros({ ...filtros, canal: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="todos">Todos os Canais</option>
                                    <option value="Balcão">Balcão</option>
                                    <option value="Shopify">Shopify</option>
                                    <option value="Mercado Livre">Mercado Livre</option>
                                    <option value="Fornecedor">Fornecedor</option>
                                    <option value="Serviços">Serviços</option>
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
                                    <option value="processado">Processado</option>
                                    <option value="pendente">Pendente</option>
                                    <option value="erro">Erro</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={carregarDados}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Aplicar Filtros
                            </button>

                            <button
                                onClick={() => {
                                    setFiltros({
                                        dataInicio: '',
                                        dataFim: '',
                                        tipo: 'todos',
                                        canal: 'todos',
                                        status: 'todos'
                                    });
                                    carregarDados();
                                }}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    </motion.div>

                    {/* Loading */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center py-12"
                        >
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                <span className="text-gray-600">Carregando dados contábeis...</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Erro */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6"
                        >
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                                <div>
                                    <h3 className="text-lg font-semibold text-red-800">Erro ao carregar dados</h3>
                                    <p className="text-red-600">{error}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Tabela de Lançamentos */}
                    {lancamentos.length > 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Lançamentos Contábeis</h3>
                                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Exportar Excel
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Valor
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Data
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Canal
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Descrição
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Imposto Gerado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Anexo
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <AnimatePresence>
                                            {lancamentos.map((lancamento, index) => (
                                                <motion.tr
                                                    key={lancamento.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            {getTipoIcon(lancamento.tipo)}
                                                            <span className={`text-sm px-2 py-1 rounded-full ${getTipoColor(lancamento.tipo)}`}>
                                                                {lancamento.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`text-sm font-semibold ${lancamento.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {formatarValor(lancamento.valor)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-600">{formatarData(lancamento.data)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-600">{lancamento.canal}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-900">{lancamento.descricao}</span>
                                                            <p className="text-xs text-gray-500">{lancamento.categoria}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-600">{formatarValor(lancamento.imposto_gerado)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            {getStatusIcon(lancamento.status)}
                                                            <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(lancamento.status)}`}>
                                                                {lancamento.status === 'processado' ? 'Processado' : 
                                                                 lancamento.status === 'pendente' ? 'Pendente' : 'Erro'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {lancamento.anexo ? (
                                                            <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                                                                <Download className="w-4 h-4" />
                                                                <span className="text-sm">Baixar</span>
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">Sem anexo</span>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* Informações de Integração */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Integração Fiscal</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                Sistema preparado para integração completa com APIs fiscais e SEFAZ.
                            </p>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• API de NF-e (PyTrustNFe)</p>
                                <p>• Consulta SEFAZ (certificado A1)</p>
                                <p>• Vendas do Balcão (integração futura)</p>
                                <p>• Vendas do Shopify (integração futura)</p>
                                <p>• Escolha de emissão de NF-e</p>
                                <p>• API de pagamento de impostos</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Upload className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Upload de Documentos</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                Anexe documentos fiscais para processamento automático.
                            </p>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Arquivos XML (NF-e)</p>
                                <p>• PDFs de documentos</p>
                                <p>• Planilhas Excel</p>
                                <p>• Processamento automático</p>
                                <p>• Validação com SEFAZ</p>
                                <p>• Extração de dados</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Modal de Upload */}
                    {showUploadModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Anexar Documento</h3>
                                    <button
                                        onClick={() => {
                                            setShowUploadModal(false);
                                            setUploadFile(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Selecione o arquivo
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <input
                                                type="file"
                                                accept=".xml,.pdf,.xlsx,.xls"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="w-8 h-8 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {uploadFile ? uploadFile.name : 'Clique para selecionar arquivo'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        XML, PDF, Excel (máx. 10MB)
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {uploadFile && (
                                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-blue-800">{uploadFile.name}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleUploadSubmit}
                                            disabled={!uploadFile}
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Enviar
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowUploadModal(false);
                                                setUploadFile(null);
                                            }}
                                            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </LayoutGestor>
        </ProtectedRoute>
    );
};

export default ContabilidadeDaEmpresa; 