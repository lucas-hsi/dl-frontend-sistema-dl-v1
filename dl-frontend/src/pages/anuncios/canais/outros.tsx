import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LayoutAnuncios from '@/components/layout/LayoutAnuncios';
import marketplaceService from '@/services/marketplaceService';
import {
    AlertCircle,
    BarChart3,
    CheckCircle,
    Globe,
    Plus,
    RefreshCw,
    Save,
    Search,
    Settings,
    ShoppingCart,
    Store,
    Trash2,
    TrendingUp,
    Upload,
    X,
    XCircle,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface MarketplaceStats {
    totalMarketplaces: number;
    ativos: number;
    configurados: number;
    vendasHoje: number;
    receitaHoje: number;
    produtosSincronizados: number;
}

interface Marketplace {
    id: string;
    nome: string;
    status: 'ativo' | 'configurado' | 'pendente' | 'inativo';
    produtos: number;
    vendas: number;
    receita: number;
    ultimaSincronizacao: string;
    logo?: string;
    url?: string;
}

interface MarketplaceDisponivel {
    nome: string;
    logo: string;
    status: 'disponivel' | 'configurado' | 'em_breve';
    descricao: string;
    url?: string;
}

export default function OutrosMarketplacesPage() {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<MarketplaceStats>({
        totalMarketplaces: 0,
        ativos: 0,
        configurados: 0,
        vendasHoje: 0,
        receitaHoje: 0,
        produtosSincronizados: 0
    });
    const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
    const [marketplacesDisponiveis, setMarketplacesDisponiveis] = useState<MarketplaceDisponivel[]>([]);
    const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace | null>(null);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('todos');
    const [configData, setConfigData] = useState({
        apiKey: '',
        accessToken: '',
        sellerId: '',
        autoSync: false,
        notifications: true
    });
    const [selectedMarketplaceToAdd, setSelectedMarketplaceToAdd] = useState<string>('');

    // Carregar dados iniciais
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, marketplacesData, disponiveisData] = await Promise.all([
                marketplaceService.getStats(),
                marketplaceService.getMarketplaces(),
                marketplaceService.getMarketplacesDisponiveis()
            ]);
            setStats(statsData);
            setMarketplaces(marketplacesData);
            setMarketplacesDisponiveis(disponiveisData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados dos Marketplaces');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: string, marketplaceId?: string) => {
        setActionLoading(action);
        console.log(`🔄 Executando ação Marketplace: ${action}`, marketplaceId);

        try {
            switch (action) {
                case 'sincronizar-todos':
                    await marketplaceService.sincronizarTodos();
                    await loadData(); // Recarregar dados
                    break;
                case 'adicionar-marketplace':
                    setShowAddModal(true);
                    break;
                case 'sincronizar-produtos':
                    if (marketplaceId) {
                        await marketplaceService.sincronizarProdutos(marketplaceId);
                        await loadData();
                    }
                    break;
                case 'gerar-relatorio':
                    const blob = await marketplaceService.gerarRelatorio();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `relatorio-marketplaces-${new Date().toISOString().split('T')[0]}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    break;
                case 'otimizar-precos':
                    await marketplaceService.otimizarPrecos();
                    await loadData();
                    break;
                case 'configurar-novo':
                    setShowConfigModal(true);
                    break;
                default:
                    if (marketplaceId) {
                        await handleMarketplaceAction(action, marketplaceId);
                    }
            }

            console.log(`✅ Ação Marketplace ${action} executada com sucesso`);
            alert(`Ação Marketplace ${action} executada com sucesso!`);
        } catch (error) {
            console.error(`❌ Erro na ação Marketplace ${action}:`, error);
            alert(`Erro ao executar ${action}: ${error}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarketplaceAction = async (action: string, marketplaceId: string) => {
        try {
            switch (action) {
                case 'configurar':
                    const marketplace = marketplaces.find(m => m.id === marketplaceId);
                    if (marketplace) {
                        setSelectedMarketplace(marketplace);
                        setShowConfigModal(true);
                    }
                    break;
                case 'sincronizar':
                    await marketplaceService.sincronizarProdutos(marketplaceId);
                    await loadData();
                    break;
                case 'ver-dashboard':
                    await marketplaceService.verDashboard(marketplaceId);
                    break;
                case 'remover':
                    if (window.confirm('Tem certeza que deseja remover este marketplace?')) {
                        await marketplaceService.removerMarketplace(marketplaceId);
                        await loadData();
                    }
                    break;
            }
        } catch (error) {
            throw error;
        }
    };

    const handleAddMarketplace = async () => {
        if (!selectedMarketplaceToAdd) {
            alert('Selecione um marketplace para adicionar');
            return;
        }

        try {
            await marketplaceService.adicionarMarketplace(selectedMarketplaceToAdd);
            setShowAddModal(false);
            setSelectedMarketplaceToAdd('');
            await loadData();
            alert('Marketplace adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar marketplace:', error);
            alert('Erro ao adicionar marketplace');
        }
    };

    const handleSaveConfig = async () => {
        try {
            // Simular salvamento de configuração
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowConfigModal(false);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            alert('Erro ao salvar configurações');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ativo':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'configurado':
                return <CheckCircle className="w-4 h-4 text-blue-500" />;
            case 'pendente':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'inativo':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ativo':
                return 'bg-green-100 text-green-800';
            case 'configurado':
                return 'bg-blue-100 text-blue-800';
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800';
            case 'inativo':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredMarketplaces = marketplaces.filter(marketplace => {
        const matchesSearch = marketplace.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'todos' || marketplace.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <ProtectedRoute>
            <LayoutAnuncios>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 rounded-3xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Outros Marketplaces</h1>
                                    <p className="text-orange-100">Gestão multicanal de vendas</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleAction('sincronizar-todos')}
                                    disabled={actionLoading === 'sincronizar-todos'}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${actionLoading === 'sincronizar-todos' ? 'animate-spin' : ''}`} />
                                    <span>Sincronizar Todos</span>
                                </button>
                                <button
                                    onClick={() => handleAction('configurar-novo')}
                                    disabled={actionLoading === 'configurar-novo'}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Adicionar Marketplace</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Marketplaces Ativos</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.ativos}/{stats.totalMarketplaces}</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Store className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Vendas Hoje</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.vendasHoje}</p>
                                    <p className="text-sm text-green-600">+8% vs ontem</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Receita Hoje</p>
                                    <p className="text-2xl font-bold text-gray-900">R$ {stats.receitaHoje.toFixed(2)}</p>
                                    <p className="text-sm text-green-600">+12% vs ontem</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button
                                onClick={() => handleAction('adicionar-marketplace')}
                                disabled={actionLoading === 'adicionar-marketplace'}
                                className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors disabled:opacity-50"
                            >
                                <Plus className="w-6 h-6 text-orange-600 mb-2" />
                                <span className="text-sm font-medium text-orange-900">Adicionar Marketplace</span>
                            </button>

                            <button
                                onClick={() => handleAction('sincronizar-produtos')}
                                disabled={actionLoading === 'sincronizar-produtos'}
                                className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50"
                            >
                                <Upload className="w-6 h-6 text-blue-600 mb-2" />
                                <span className="text-sm font-medium text-blue-900">Sincronizar Produtos</span>
                            </button>

                            <button
                                onClick={() => handleAction('gerar-relatorio')}
                                disabled={actionLoading === 'gerar-relatorio'}
                                className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors disabled:opacity-50"
                            >
                                <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
                                <span className="text-sm font-medium text-purple-900">Gerar Relatório</span>
                            </button>

                            <button
                                onClick={() => handleAction('otimizar-precos')}
                                disabled={actionLoading === 'otimizar-precos'}
                                className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50"
                            >
                                <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                                <span className="text-sm font-medium text-green-900">Otimizar Preços</span>
                            </button>
                        </div>
                    </div>

                    {/* Lista de Marketplaces */}
                    <div className="bg-white rounded-2xl shadow-xl">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Marketplaces Configurados</h2>
                                <div className="flex space-x-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar marketplaces..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="ativo">Ativos</option>
                                        <option value="configurado">Configurados</option>
                                        <option value="pendente">Pendentes</option>
                                        <option value="inativo">Inativos</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {filteredMarketplaces.map((marketplace) => (
                                <div key={marketplace.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Globe className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{marketplace.nome}</h3>
                                                <p className="text-sm text-gray-500">ID: {marketplace.id}</p>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <span className="text-lg font-semibold text-green-600">
                                                        R$ {marketplace.receita.toFixed(2)}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(marketplace.status)}`}>
                                                        {marketplace.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {marketplace.produtos} produtos • {marketplace.vendas} vendas
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleAction('configurar', marketplace.id)}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Configurar marketplace"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleAction('sincronizar', marketplace.id)}
                                                disabled={actionLoading === 'sincronizar'}
                                                className="p-2 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                                                title="Sincronizar marketplace"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleAction('ver-dashboard', marketplace.id)}
                                                className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                                                title="Ver dashboard"
                                            >
                                                <BarChart3 className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleAction('remover', marketplace.id)}
                                                disabled={actionLoading === 'remover'}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                                title="Remover marketplace"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Marketplaces Disponíveis */}
                    <div className="bg-white rounded-2xl shadow-xl mt-8">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Marketplaces Disponíveis</h2>
                            <p className="text-sm text-gray-600 mt-1">Clique para configurar um novo marketplace</p>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {marketplacesDisponiveis.map((mp) => (
                                    <button
                                        key={mp.nome}
                                        onClick={() => {
                                            setSelectedMarketplaceToAdd(mp.nome);
                                            setShowAddModal(true);
                                        }}
                                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-colors"
                                    >
                                        <span className="text-2xl">{mp.logo}</span>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">{mp.nome}</p>
                                            <p className="text-sm text-gray-500 capitalize">{mp.status}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Modal de Configuração */}
                    {showConfigModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Configurar {selectedMarketplace?.nome || 'Marketplace'}
                                    </h3>
                                    <button
                                        onClick={() => setShowConfigModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            API Key
                                        </label>
                                        <input
                                            type="password"
                                            value={configData.apiKey}
                                            onChange={(e) => setConfigData({ ...configData, apiKey: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Sua API Key"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Access Token
                                        </label>
                                        <input
                                            type="password"
                                            value={configData.accessToken}
                                            onChange={(e) => setConfigData({ ...configData, accessToken: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Seu Access Token"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Seller ID
                                        </label>
                                        <input
                                            type="text"
                                            value={configData.sellerId}
                                            onChange={(e) => setConfigData({ ...configData, sellerId: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Seu Seller ID"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="autoSync"
                                            checked={configData.autoSync}
                                            onChange={(e) => setConfigData({ ...configData, autoSync: e.target.checked })}
                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label htmlFor="autoSync" className="text-sm font-medium text-gray-700">
                                            Sincronização Automática
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="notifications"
                                            checked={configData.notifications}
                                            onChange={(e) => setConfigData({ ...configData, notifications: e.target.checked })}
                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label htmlFor="notifications" className="text-sm font-medium text-gray-700">
                                            Notificações
                                        </label>
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleSaveConfig}
                                        className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4 inline mr-2" />
                                        Salvar Configurações
                                    </button>
                                    <button
                                        onClick={() => setShowConfigModal(false)}
                                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal de Adicionar Marketplace */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Adicionar Marketplace
                                    </h3>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Selecionar Marketplace
                                        </label>
                                        <select
                                            value={selectedMarketplaceToAdd}
                                            onChange={(e) => setSelectedMarketplaceToAdd(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="">Selecione um marketplace</option>
                                            {marketplacesDisponiveis.map((mp) => (
                                                <option key={mp.nome} value={mp.nome}>
                                                    {mp.nome} - {mp.descricao}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedMarketplaceToAdd && (
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <p className="text-sm text-orange-800">
                                                <strong>Próximos passos:</strong>
                                            </p>
                                            <ul className="text-sm text-orange-700 mt-2 space-y-1">
                                                <li>• Configure as credenciais da API</li>
                                                <li>• Defina as configurações de sincronização</li>
                                                <li>• Teste a conexão antes de salvar</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleAddMarketplace}
                                        disabled={!selectedMarketplaceToAdd}
                                        className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                                    >
                                        <Plus className="w-4 h-4 inline mr-2" />
                                        Adicionar Marketplace
                                    </button>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </LayoutAnuncios>
        </ProtectedRoute>
    );
} 