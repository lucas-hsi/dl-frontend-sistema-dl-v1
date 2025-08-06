import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LayoutAnuncios from '@/components/layout/LayoutAnuncios';
import shopifyService from '@/services/shopifyService';
import {
    AlertCircle,
    CheckCircle,
    CreditCard,
    Edit,
    Globe,
    Package,
    Pause,
    Play,
    Plus,
    RefreshCw,
    Save,
    Search,
    Settings,
    ShoppingBag,
    Trash2,
    Upload,
    Users,
    X,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ShopifyStats {
    totalProdutos: number;
    ativos: number;
    rascunhos: number;
    vendasHoje: number;
    receitaHoje: number;
    clientesNovos: number;
}

interface ShopifyProduto {
    id: string;
    titulo: string;
    preco: number;
    status: 'ativo' | 'rascunho' | 'arquivado';
    vendas: number;
    estoque: number;
    ultimaAtualizacao: string;
    imagem?: string;
    categoria: string;
}

interface ProdutoEditData {
    titulo: string;
    preco: number;
    estoque: number;
    categoria: string;
    descricao?: string;
}

export default function ShopifyPage() {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<ShopifyStats>({
        totalProdutos: 0,
        ativos: 0,
        rascunhos: 0,
        vendasHoje: 0,
        receitaHoje: 0,
        clientesNovos: 0
    });
    const [produtos, setProdutos] = useState<ShopifyProduto[]>([]);
    const [selectedProduto, setSelectedProduto] = useState<ShopifyProduto | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('todos');
    const [editData, setEditData] = useState<ProdutoEditData>({
        titulo: '',
        preco: 0,
        estoque: 0,
        categoria: '',
        descricao: ''
    });
    const [configData, setConfigData] = useState({
        shopDomain: '',
        accessToken: '',
        apiVersion: '2024-01',
        webhookUrl: '',
        autoSync: false,
        notifications: true
    });

    // Carregar dados iniciais
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, produtosData] = await Promise.all([
                shopifyService.getStats(),
                shopifyService.getProdutos()
            ]);
            setStats(statsData);
            setProdutos(produtosData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados do Shopify');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: string, produtoId?: string) => {
        setActionLoading(action);
        console.log(`🔄 Executando ação Shopify: ${action}`, produtoId);

        try {
            switch (action) {
                case 'sincronizar':
                    await shopifyService.sincronizarProdutos();
                    await loadData(); // Recarregar dados
                    break;
                case 'criar-produto':
                    // Abrir modal de criação
                    setEditData({ titulo: '', preco: 0, estoque: 0, categoria: '', descricao: '' });
                    setSelectedProduto(null);
                    setShowEditModal(true);
                    break;
                case 'importar-catalogo':
                    await shopifyService.importarCatalogo();
                    await loadData();
                    break;
                case 'gerenciar-clientes':
                    await shopifyService.gerenciarClientes();
                    break;
                case 'configurar-pagamentos':
                    await shopifyService.configurarPagamentos();
                    break;
                case 'configurar':
                    setShowConfigModal(true);
                    break;
                default:
                    if (produtoId) {
                        await handleProdutoAction(action, produtoId);
                    }
            }

            console.log(`✅ Ação Shopify ${action} executada com sucesso`);
            alert(`Ação Shopify ${action} executada com sucesso!`);
        } catch (error) {
            console.error(`❌ Erro na ação Shopify ${action}:`, error);
            alert(`Erro ao executar ${action}: ${error}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleProdutoAction = async (action: string, produtoId: string) => {
        try {
            switch (action) {
                case 'editar':
                    const produto = produtos.find(p => p.id === produtoId);
                    if (produto) {
                        setSelectedProduto(produto);
                        setEditData({
                            titulo: produto.titulo,
                            preco: produto.preco,
                            estoque: produto.estoque,
                            categoria: produto.categoria,
                            descricao: ''
                        });
                        setShowEditModal(true);
                    }
                    break;
                case 'publicar':
                    await shopifyService.publicarProduto(produtoId);
                    await loadData();
                    break;
                case 'pausar':
                    await shopifyService.pausarProduto(produtoId);
                    await loadData();
                    break;
                case 'excluir':
                    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                        await shopifyService.excluirProduto(produtoId);
                        await loadData();
                    }
                    break;
            }
        } catch (error) {
            throw error;
        }
    };

    const handleSaveProduto = async () => {
        try {
            if (selectedProduto) {
                // Atualizar produto existente
                await shopifyService.atualizarProduto(selectedProduto.id, editData);
            } else {
                // Criar novo produto
                await shopifyService.criarProduto(editData);
            }

            setShowEditModal(false);
            await loadData();
            alert(selectedProduto ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto');
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
            case 'rascunho':
                return <Pause className="w-4 h-4 text-yellow-500" />;
            case 'arquivado':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ativo':
                return 'bg-green-100 text-green-800';
            case 'rascunho':
                return 'bg-yellow-100 text-yellow-800';
            case 'arquivado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredProdutos = produtos.filter(produto => {
        const matchesSearch = produto.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'todos' || produto.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <ProtectedRoute>
            <LayoutAnuncios>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 via-blue-600 to-indigo-700 rounded-3xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Shopify</h1>
                                    <p className="text-blue-100">E-commerce profissional e integrado</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleAction('sincronizar')}
                                    disabled={actionLoading === 'sincronizar'}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${actionLoading === 'sincronizar' ? 'animate-spin' : ''}`} />
                                    <span>Sincronizar</span>
                                </button>
                                <button
                                    onClick={() => handleAction('configurar')}
                                    disabled={actionLoading === 'configurar'}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Configurar</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalProdutos}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Vendas Hoje</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.vendasHoje}</p>
                                    <p className="text-sm text-green-600">+15% vs ontem</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Receita Hoje</p>
                                    <p className="text-2xl font-bold text-gray-900">R$ {stats.receitaHoje.toFixed(2)}</p>
                                    <p className="text-sm text-green-600">+22% vs ontem</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button
                                onClick={() => handleAction('criar-produto')}
                                disabled={actionLoading === 'criar-produto'}
                                className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50"
                            >
                                <Plus className="w-6 h-6 text-green-600 mb-2" />
                                <span className="text-sm font-medium text-green-900">Criar Produto</span>
                            </button>

                            <button
                                onClick={() => handleAction('importar-catalogo')}
                                disabled={actionLoading === 'importar-catalogo'}
                                className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50"
                            >
                                <Upload className="w-6 h-6 text-blue-600 mb-2" />
                                <span className="text-sm font-medium text-blue-900">Importar Catálogo</span>
                            </button>

                            <button
                                onClick={() => handleAction('gerenciar-clientes')}
                                disabled={actionLoading === 'gerenciar-clientes'}
                                className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors disabled:opacity-50"
                            >
                                <Users className="w-6 h-6 text-purple-600 mb-2" />
                                <span className="text-sm font-medium text-purple-900">Gerenciar Clientes</span>
                            </button>

                            <button
                                onClick={() => handleAction('configurar-pagamentos')}
                                disabled={actionLoading === 'configurar-pagamentos'}
                                className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors disabled:opacity-50"
                            >
                                <CreditCard className="w-6 h-6 text-orange-600 mb-2" />
                                <span className="text-sm font-medium text-orange-900">Configurar Pagamentos</span>
                            </button>
                        </div>
                    </div>

                    {/* Lista de Produtos */}
                    <div className="bg-white rounded-2xl shadow-xl">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Produtos do Catálogo</h2>
                                <div className="flex space-x-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar produtos..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="ativo">Ativos</option>
                                        <option value="rascunho">Rascunhos</option>
                                        <option value="arquivado">Arquivados</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {filteredProdutos.map((produto) => (
                                <div key={produto.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{produto.titulo}</h3>
                                                <p className="text-sm text-gray-500">ID: {produto.id} • {produto.categoria}</p>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <span className="text-lg font-semibold text-green-600">
                                                        R$ {produto.preco.toFixed(2)}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(produto.status)}`}>
                                                        {produto.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {produto.vendas} vendas • {produto.estoque} em estoque
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleAction('editar', produto.id)}
                                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                                title="Editar produto"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleAction(produto.status === 'ativo' ? 'pausar' : 'publicar', produto.id)}
                                                disabled={actionLoading === (produto.status === 'ativo' ? 'pausar' : 'publicar')}
                                                className="p-2 text-gray-400 hover:text-yellow-600 transition-colors disabled:opacity-50"
                                                title={produto.status === 'ativo' ? 'Pausar produto' : 'Publicar produto'}
                                            >
                                                {produto.status === 'ativo' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            </button>

                                            <button
                                                onClick={() => handleAction('excluir', produto.id)}
                                                disabled={actionLoading === 'excluir'}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                                title="Excluir produto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal de Edição */}
                    {showEditModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {selectedProduto ? 'Editar Produto' : 'Criar Produto'}
                                    </h3>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.titulo}
                                            onChange={(e) => setEditData({ ...editData, titulo: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Título do produto"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Preço
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editData.preco}
                                            onChange={(e) => setEditData({ ...editData, preco: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Estoque
                                        </label>
                                        <input
                                            type="number"
                                            value={editData.estoque}
                                            onChange={(e) => setEditData({ ...editData, estoque: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Categoria
                                        </label>
                                        <input
                                            type="text"
                                            value={editData.categoria}
                                            onChange={(e) => setEditData({ ...editData, categoria: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Categoria"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descrição
                                        </label>
                                        <textarea
                                            value={editData.descricao}
                                            onChange={(e) => setEditData({ ...editData, descricao: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            rows={3}
                                            placeholder="Descrição do produto"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleSaveProduto}
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4 inline mr-2" />
                                        Salvar
                                    </button>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal de Configuração */}
                    {showConfigModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Configurar Shopify
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
                                            Shop Domain
                                        </label>
                                        <input
                                            type="text"
                                            value={configData.shopDomain}
                                            onChange={(e) => setConfigData({ ...configData, shopDomain: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="sua-loja.myshopify.com"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Seu Access Token"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            API Version
                                        </label>
                                        <input
                                            type="text"
                                            value={configData.apiVersion}
                                            onChange={(e) => setConfigData({ ...configData, apiVersion: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="2024-01"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Webhook URL
                                        </label>
                                        <input
                                            type="text"
                                            value={configData.webhookUrl}
                                            onChange={(e) => setConfigData({ ...configData, webhookUrl: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="https://seu-dominio.com/webhook"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="autoSync"
                                            checked={configData.autoSync}
                                            onChange={(e) => setConfigData({ ...configData, autoSync: e.target.checked })}
                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <label htmlFor="notifications" className="text-sm font-medium text-gray-700">
                                            Notificações
                                        </label>
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleSaveConfig}
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
                </div>
            </LayoutAnuncios>
        </ProtectedRoute>
    );
} 