import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    BarChart3,
    Calendar,
    CheckCircle,
    DollarSign,
    Download,
    FileText,
    Filter,
    Search,
    Settings,
    TrendingUp,
    XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ConfigFiscalRequest, NFeEmissao, NFeEstatisticas, nfeService } from '../../../services/nfeService';

interface TabProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ id, label, icon, active, onClick }) => (
    <motion.button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${active
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        {icon}
        {label}
    </motion.button>
);

export default function GestaoFiscalNFE() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [estatisticas, setEstatisticas] = useState<NFeEstatisticas | null>(null);
    const [nfes, setNfes] = useState<NFeEmissao[]>([]);
    const [configFiscal, setConfigFiscal] = useState<ConfigFiscalRequest | null>(null);
    const [statusSefaz, setStatusSefaz] = useState<any>(null);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
        { id: 'emissao', label: 'Emissão', icon: <FileText size={20} /> },
        { id: 'historico', label: 'Histórico', icon: <Calendar size={20} /> },
        { id: 'config', label: 'Configuração', icon: <Settings size={20} /> },
        { id: 'status', label: 'Status SEFAZ', icon: <AlertCircle size={20} /> }
    ];

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const [estats, nfesList, config, status] = await Promise.all([
                nfeService.obterEstatisticas(),
                nfeService.listarNFe(),
                nfeService.obterConfigFiscal(),
                nfeService.consultarStatusSefaz()
            ]);

            setEstatisticas(estats);
            setNfes(nfesList);
            setConfigFiscal(config);
            setStatusSefaz(status);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'emitida':
            case 'autorizada':
                return 'text-green-600 bg-green-100';
            case 'cancelada':
                return 'text-red-600 bg-red-100';
            case 'pendente':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'emitida':
            case 'autorizada':
                return <CheckCircle size={16} />;
            case 'cancelada':
                return <XCircle size={16} />;
            case 'pendente':
                return <AlertCircle size={16} />;
            default:
                return <AlertCircle size={16} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <motion.div
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl mx-4 mt-4 p-6 text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Gestão Fiscal - NF-e</h1>
                        <p className="text-blue-100">Controle completo de notas fiscais eletrônicas</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {estatisticas && (
                            <div className="text-right">
                                <div className="text-2xl font-bold">{estatisticas.total_emitidas}</div>
                                <div className="text-blue-100 text-sm">NF-es Emitidas</div>
                            </div>
                        )}
                        {estatisticas && (
                            <div className="text-right">
                                <div className="text-2xl font-bold">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estatisticas.valor_total_emitido)}
                                </div>
                                <div className="text-blue-100 text-sm">Valor Total</div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="mx-4 mt-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.id}
                            id={tab.id}
                            label={tab.label}
                            icon={tab.icon}
                            active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="mx-4 mt-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'dashboard' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Métricas */}
                                <motion.div
                                    className="bg-white rounded-2xl shadow-xl p-6"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm">NF-es Emitidas</p>
                                            <p className="text-3xl font-bold text-blue-600">
                                                {estatisticas?.total_emitidas || 0}
                                            </p>
                                        </div>
                                        <div className="bg-blue-100 p-3 rounded-xl">
                                            <FileText className="text-blue-600" size={24} />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="bg-white rounded-2xl shadow-xl p-6"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm">Valor Total</p>
                                            <p className="text-3xl font-bold text-green-600">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estatisticas?.valor_total_emitido || 0)}
                                            </p>
                                        </div>
                                        <div className="bg-green-100 p-3 rounded-xl">
                                            <DollarSign className="text-green-600" size={24} />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="bg-white rounded-2xl shadow-xl p-6"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm">Mês Atual</p>
                                            <p className="text-3xl font-bold text-purple-600">
                                                {estatisticas?.mes_atual.emitidas || 0}
                                            </p>
                                        </div>
                                        <div className="bg-purple-100 p-3 rounded-xl">
                                            <Calendar className="text-purple-600" size={24} />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="bg-white rounded-2xl shadow-xl p-6"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm">Últimos 7 dias</p>
                                            <p className="text-3xl font-bold text-orange-600">
                                                {estatisticas?.ultimos_7_dias.emitidas || 0}
                                            </p>
                                        </div>
                                        <div className="bg-orange-100 p-3 rounded-xl">
                                            <TrendingUp className="text-orange-600" size={24} />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {activeTab === 'historico' && (
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Histórico de NF-es</h2>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Buscar NF-e..."
                                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                            <Filter size={20} />
                                            Filtros
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Número</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nfes.map((nfe) => (
                                                <motion.tr
                                                    key={nfe.id}
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <td className="py-3 px-4 font-medium">{nfe.numero}</td>
                                                    <td className="py-3 px-4">{nfe.cliente_nome}</td>
                                                    <td className="py-3 px-4 text-gray-600">
                                                        {new Date(nfe.data_emissao).toLocaleDateString('pt-BR')}
                                                    </td>
                                                    <td className="py-3 px-4 font-medium">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(nfe.valor_total)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(nfe.status)}`}>
                                                            {getStatusIcon(nfe.status)}
                                                            {nfe.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex gap-2">
                                                            <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                                                                <Download size={16} />
                                                            </button>
                                                            <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
                                                                <FileText size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'config' && (
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuração Fiscal</h2>
                                {configFiscal ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Dados do Emitente</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                                                    <input
                                                        type="text"
                                                        value={configFiscal.cnpj_emitente}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                                                    <input
                                                        type="text"
                                                        value={configFiscal.razao_social}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Inscrição Estadual</label>
                                                    <input
                                                        type="text"
                                                        value={configFiscal.inscricao_estadual}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Ambiente</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ambiente</label>
                                                    <select
                                                        value={configFiscal.ambiente}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="homologacao">Homologação</option>
                                                        <option value="producao">Produção</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={configFiscal.email}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                                    <input
                                                        type="text"
                                                        value={configFiscal.telefone}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Configuração fiscal não encontrada</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'status' && (
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Status SEFAZ</h2>
                                {statusSefaz ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-semibold text-green-800 mb-2">Status do Serviço</h3>
                                            <p className="text-green-700">{statusSefaz.status || 'Disponível'}</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Última Verificação</h3>
                                            <p className="text-blue-700">
                                                {statusSefaz.ultima_verificacao ? new Date(statusSefaz.ultima_verificacao).toLocaleString('pt-BR') : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Status SEFAZ não disponível</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
} 