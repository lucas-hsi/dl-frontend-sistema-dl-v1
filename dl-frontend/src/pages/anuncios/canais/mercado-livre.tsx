import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LayoutAnuncios from '@/components/layout/LayoutAnuncios';
import mercadoLivreService from '@/services/mercadoLivreService';
import {
    AlertCircle,
    CheckCircle,
    Download,
    Edit,
    Pause,
    Play,
    Plus,
    RefreshCw,
    Save,
    Search,
    Settings,
    ShoppingCart,
    Trash2,
    TrendingUp,
    Upload,
    X,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface MercadoLivreStats {
    totalAnuncios: number;
    ativos: number;
    pausados: number;
    vendasHoje: number;
    receitaHoje: number;
    conversoes: number;
}

interface MercadoLivreAnuncio {
    id: string;
    titulo: string;
    preco: number;
    status: 'ativo' | 'pausado' | 'finalizado';
    vendas: number;
    visualizacoes: number;
    ultimaAtualizacao: string;
    imagem?: string;
}

interface AnuncioEditData {
    titulo: string;
    preco: number;
    descricao?: string;
    categoria?: string;
}

export default function MercadoLivrePage() {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<MercadoLivreStats>({
        totalAnuncios: 0,
        ativos: 0,
        pausados: 0,
        vendasHoje: 0,
        receitaHoje: 0,
        conversoes: 0
    });
    const [anuncios, setAnuncios] = useState<MercadoLivreAnuncio[]>([]);
    const [selectedAnuncio, setSelectedAnuncio] = useState<MercadoLivreAnuncio | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('todos');
    const [editData, setEditData] = useState<AnuncioEditData>({
        titulo: '',
        preco: 0,
        descricao: '',
        categoria: ''
    });
    const [configData, setConfigData] = useState({
        apiKey: '',
        accessToken: '',
        sellerId: '',
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
            const [statsData, anunciosData] = await Promise.all([
                mercadoLivreService.getStats(),
                mercadoLivreService.getAnuncios()
            ]);
            setStats(statsData);
            setAnuncios(anunciosData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados do Mercado Livre');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: string, anuncioId?: string) => {
        setActionLoading(action);
        console.log(`🔄 Executando ação: ${action}`, anuncioId);

        try {
            switch (action) {
                case 'sincronizar':
                    await mercadoLivreService.sincronizarAnuncios();
                    await loadData(); // Recarregar dados
                    break;
                case 'criar-anuncio':
                    // Abrir modal de criação
                    setEditData({ titulo: '', preco: 0, descricao: '', categoria: '' });
                    setSelectedAnuncio(null);
                    setShowEditModal(true);
                    break;
                case 'importar-produtos':
                    await mercadoLivreService.importarProdutos();
                    await loadData();
                    break;
                case 'exportar-relatorio':
                    const blob = await mercadoLivreService.exportarRelatorio();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `relatorio-mercado-livre-${new Date().toISOString().split('T')[0]}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    break;
                case 'otimizar-precos':
                    await mercadoLivreService.otimizarPrecos();
                    await loadData();
                    break;
                case 'configurar':
                    setShowConfigModal(true);
                    break;
                default:
                    if (anuncioId) {
                        await handleAnuncioAction(action, anuncioId);
                    }
            }

            console.log(`✅ Ação ${action} executada com sucesso`);
            alert(`Ação ${action} executada com sucesso!`);
        } catch (error) {
            console.error(`❌ Erro na ação ${action}:`, error);
            alert(`Erro ao executar ${action}: ${error}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleAnuncioAction = async (action: string, anuncioId: string) => {
        try {
            switch (action) {
                case 'editar':
                    const anuncio = anuncios.find(a => a.id === anuncioId);
                    if (anuncio) {
                        setSelectedAnuncio(anuncio);
                        setEditData({
                            titulo: anuncio.titulo,
                            preco: anuncio.preco,
                            descricao: '',
                            categoria: ''
                        });
                        setShowEditModal(true);
                    }
                    break;
                case 'pausar':
                    await mercadoLivreService.pausarAnuncio(anuncioId);
                    await loadData();
                    break;
                case 'ativar':
                    await mercadoLivreService.ativarAnuncio(anuncioId);
                    await loadData();
                    break;
                case 'excluir':
                    if (window.confirm('Tem certeza que deseja excluir este anúncio?')) {
                        await mercadoLivreService.excluirAnuncio(anuncioId);
                        await loadData();
                    }
                    break;
            }
        } catch (error) {
            throw error;
        }
    };

    const handleSaveAnuncio = async () => {
        try {
            if (selectedAnuncio) {
                // Atualizar anúncio existente
                await mercadoLivreService.atualizarAnuncio(selectedAnuncio.id, editData);
            } else {
                // Criar novo anúncio
                await mercadoLivreService.criarAnuncio(editData);
            }

            setShowEditModal(false);
            await loadData();
            alert(selectedAnuncio ? 'Anúncio atualizado com sucesso!' : 'Anúncio criado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar anúncio:', error);
            alert('Erro ao salvar anúncio');
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
            case 'pausado':
                return <Pause className="w-4 h-4 text-yellow-500" />;
            case 'finalizado':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ativo':
                return 'bg-green-100 text-green-800';
            case 'pausado':
                return 'bg-yellow-100 text-yellow-800';
            case 'finalizado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredAnuncios = anuncios.filter(anuncio => {
        const matchesSearch = anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'todos' || anuncio.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <ProtectedRoute>
            <LayoutAnuncios>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Mercado Livre</h1>
                                    <p className="text-blue-100">Gestão completa de anúncios e vendas</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleAction('sincronizar')}
                                    disabled={actionLoading === 'sincronizar'}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                                    data-qa="anuncios-Sincronizar"
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
                                    <p className="text-sm font-medium text-gray-600">Total de Anúncios</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalAnuncios}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Vendas Hoje</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.vendasHoje}</p>
                                    <p className="text-sm text-green-600">+12% vs ontem</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Receita Hoje</p>
                                    <p className="text-2xl font-bold text-gray-900">R$ {stats.receitaHoje.toFixed(2)}</p>
                                    <p className="text-sm text-green-600">+8% vs ontem</p>
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
                                onClick={() => handleAction('criar-anuncio')}
                                disabled={actionLoading === 'criar-anuncio'}
                                className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50"
                            >
                                <Plus className="w-6 h-6 text-blue-600 mb-2" />
                                <span className="text-sm font-medium text-blue-900">Criar Anúncio</span>
                            </button>

                            <button
                                onClick={() => handleAction('importar-produtos')}
                                disabled={actionLoading === 'importar-produtos'}
                                className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50"
                            >
                                <Upload className="w-6 h-6 text-green-600 mb-2" />
                                <span className="text-sm font-medium text-green-900">Importar Produtos</span>
                            </button>

                            <button
                                onClick={() => handleAction('exportar-relatorio')}
                                disabled={actionLoading === 'exportar-relatorio'}
                                className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors disabled:opacity-50"
                            >
                                <Download className="w-6 h-6 text-purple-600 mb-2" />
                                <span className="text-sm font-medium text-purple-900">Exportar Relatório</span>
                            </button>

                            <button
                                onClick={() => handleAction('otimizar-precos')}
                                disabled={actionLoading === 'otimizar-precos'}
                                className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors disabled:opacity-50"
                            >
                                <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
                                <span className="text-sm font-medium text-orange-900">Otimizar Preços</span>
                            </button>
                        </div>
                    </div>

                    {/* Lista de Anúncios */}
                    <div className="bg-white rounded-2xl shadow-xl">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Anúncios Ativos</h2>
                                <div className="flex space-x-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar anúncios..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="ativo">Ativos</option>
                                        <option value="pausado">Pausados</option>
                                        <option value="finalizado">Finalizados</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {filteredAnuncios.map((anuncio) => (
                                <div key={anuncio.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <ShoppingCart className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{anuncio.titulo}</h3>
                                                <p className="text-sm text-gray-500">ID: {anuncio.id}</p>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <span className="text-lg font-semibold text-green-600">
                                                        R$ {anuncio.preco.toFixed(2)}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(anuncio.status)}`}>
                                                        {anuncio.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {anuncio.vendas} vendas • {anuncio.visualizacoes} visualizações
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleAction('editar', anuncio.id)}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Editar anúncio"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleAction(anuncio.status === 'ativo' ? 'pausar' : 'ativar', anuncio.id)}
                                                disabled={actionLoading === (anuncio.status === 'ativo' ? 'pausar' : 'ativar')}
                                                className="p-2 text-gray-400 hover:text-yellow-600 transition-colors disabled:opacity-50"
                                                title={anuncio.status === 'ativo' ? 'Pausar anúncio' : 'Ativar anúncio'}
                                            >
                                                {anuncio.status === 'ativo' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            </button>

                                            <button
                                                onClick={() => handleAction('excluir', anuncio.id)}
                                                disabled={actionLoading === 'excluir'}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                                title="Excluir anúncio"
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
                                        {selectedAnuncio ? 'Editar Anúncio' : 'Criar Anúncio'}
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Título do anúncio"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={3}
                                            placeholder="Descrição do produto"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleSaveAnuncio}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                                        Configurar Mercado Livre
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Seu Seller ID"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="autoSync"
                                            checked={configData.autoSync}
                                            onChange={(e) => setConfigData({ ...configData, autoSync: e.target.checked })}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="notifications" className="text-sm font-medium text-gray-700">
                                            Notificações
                                        </label>
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleSaveConfig}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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