import LayoutGestor from '@/components/layout/LayoutGestor';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Brain,
    CheckCircle,
    Cpu,
    Edit,
    Loader2,
    MessageSquare,
    Plus,
    Save,
    Settings,
    Sparkles,
    Target,
    Trash2,
    Zap
} from 'lucide-react';
import { useState } from 'react';

interface ConfiguracaoIA {
    id: number;
    nome: string;
    tipo: 'openai' | 'anthropic' | 'local' | 'custom';
    modelo: string;
    api_key?: string;
    temperatura: number;
    max_tokens: number;
    ativo: boolean;
    descricao: string;
    categoria: string;
}

export default function ConfiguracoesIAPage() {
    const [configuracoes, setConfiguracoes] = useState<ConfiguracaoIA[]>([
        {
            id: 1,
            nome: 'GPT-4 Anúncios',
            tipo: 'openai',
            modelo: 'gpt-4',
            temperatura: 0.7,
            max_tokens: 1000,
            ativo: true,
            descricao: 'IA para criação e otimização de anúncios',
            categoria: 'Marketing'
        },
        {
            id: 2,
            nome: 'Claude Atendimento',
            tipo: 'anthropic',
            modelo: 'claude-3-sonnet',
            temperatura: 0.5,
            max_tokens: 500,
            ativo: true,
            descricao: 'IA para atendimento ao cliente',
            categoria: 'Atendimento'
        },
        {
            id: 3,
            nome: 'Local Análise',
            tipo: 'local',
            modelo: 'llama-2-7b',
            temperatura: 0.3,
            max_tokens: 2000,
            ativo: false,
            descricao: 'IA local para análise de dados',
            categoria: 'Análise'
        }
    ]);

    const [showNovaConfig, setShowNovaConfig] = useState(false);
    const [editingConfig, setEditingConfig] = useState<ConfiguracaoIA | null>(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [novaConfig, setNovaConfig] = useState({
        nome: '',
        tipo: 'openai' as 'openai' | 'anthropic' | 'local' | 'custom',
        modelo: '',
        api_key: '',
        temperatura: 0.7,
        max_tokens: 1000,
        descricao: '',
        categoria: ''
    });

    const categorias = ['Marketing', 'Atendimento', 'Análise', 'Criação', 'Otimização'];
    const tipos = [
        { value: 'openai', label: 'OpenAI', icon: Brain },
        { value: 'anthropic', label: 'Anthropic', icon: Sparkles },
        { value: 'local', label: 'Local', icon: Cpu },
        { value: 'custom', label: 'Custom', icon: Settings }
    ];

    const modelosPorTipo = {
        openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
        local: ['llama-2-7b', 'llama-2-13b', 'mistral-7b'],
        custom: ['custom-model']
    };

    const handleSalvarConfig = async () => {
        setLoading(true);
        setFeedback(null);

        try {
            // Simular salvamento
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (editingConfig) {
                // Editar configuração existente
                setConfiguracoes(prev => prev.map(config =>
                    config.id === editingConfig.id
                        ? { ...config, ...novaConfig }
                        : config
                ));
                setFeedback({ type: 'success', message: 'Configuração atualizada com sucesso!' });
            } else {
                // Criar nova configuração
                const novaConfigCompleta: ConfiguracaoIA = {
                    id: Date.now(),
                    ...novaConfig,
                    ativo: true
                };
                setConfiguracoes(prev => [...prev, novaConfigCompleta]);
                setFeedback({ type: 'success', message: 'Configuração criada com sucesso!' });
            }

            setShowNovaConfig(false);
            setEditingConfig(null);
            setNovaConfig({
                nome: '',
                tipo: 'openai',
                modelo: '',
                api_key: '',
                temperatura: 0.7,
                max_tokens: 1000,
                descricao: '',
                categoria: ''
            });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao salvar configuração' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditarConfig = (config: ConfiguracaoIA) => {
        setEditingConfig(config);
        setNovaConfig({
            nome: config.nome,
            tipo: config.tipo,
            modelo: config.modelo,
            api_key: config.api_key || '',
            temperatura: config.temperatura,
            max_tokens: config.max_tokens,
            descricao: config.descricao,
            categoria: config.categoria
        });
        setShowNovaConfig(true);
    };

    const handleDeletarConfig = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar esta configuração?')) return;

        setLoading(true);
        setFeedback(null);

        try {
            // Simular exclusão
            await new Promise(resolve => setTimeout(resolve, 500));
            setConfiguracoes(prev => prev.filter(config => config.id !== id));
            setFeedback({ type: 'success', message: 'Configuração deletada com sucesso!' });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao deletar configuração' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAtivo = async (id: number) => {
        setLoading(true);
        setFeedback(null);

        try {
            // Simular toggle
            await new Promise(resolve => setTimeout(resolve, 300));
            setConfiguracoes(prev => prev.map(config =>
                config.id === id
                    ? { ...config, ativo: !config.ativo }
                    : config
            ));
            setFeedback({ type: 'success', message: 'Status atualizado com sucesso!' });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao atualizar status' });
        } finally {
            setLoading(false);
        }
    };

    const handleTestarConfig = async (id: number) => {
        setLoading(true);
        setFeedback(null);

        try {
            // Simular teste
            await new Promise(resolve => setTimeout(resolve, 2000));
            setFeedback({ type: 'success', message: 'Configuração testada com sucesso!' });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao testar configuração' });
        } finally {
            setLoading(false);
        }
    };

    const getTipoIcon = (tipo: string) => {
        const tipoConfig = tipos.find(t => t.value === tipo);
        return tipoConfig?.icon || Settings;
    };

    const getTipoLabel = (tipo: string) => {
        const tipoConfig = tipos.find(t => t.value === tipo);
        return tipoConfig?.label || 'Desconhecido';
    };

    return (
        <LayoutGestor>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 rounded-3xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Configurações de IA</h1>
                            <p className="text-blue-100">Gerencie modelos e configurações de inteligência artificial</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-2xl p-3">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Feedback Messages */}
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border ${feedback.type === 'success'
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'bg-red-50 border-red-200 text-red-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {feedback.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                {feedback.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                                <span className="font-medium">{feedback.message}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Configurações Ativas</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {configuracoes.filter(c => c.ativo).length}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Configurações</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {configuracoes.length}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Categorias</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {new Set(configuracoes.map(c => c.categoria)).size}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Modelos</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {new Set(configuracoes.map(c => c.modelo)).size}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Configurations List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Configurações de IA</h2>
                            <button
                                onClick={() => setShowNovaConfig(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                            >
                                <Plus className="w-4 h-4" />
                                Nova Configuração
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {configuracoes.map((config) => {
                                const TipoIcon = getTipoIcon(config.tipo);
                                return (
                                    <motion.div
                                        key={config.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-800 mb-1">{config.nome}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{config.descricao}</p>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.ativo
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {config.categoria}
                                                    </span>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                        {getTipoLabel(config.tipo)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleAtivo(config.id)}
                                                    disabled={loading}
                                                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${config.ativo
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {config.ativo ? 'Ativo' : 'Inativo'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4 space-y-2 text-sm text-gray-600">
                                            <div><strong>Modelo:</strong> {config.modelo}</div>
                                            <div><strong>Temperatura:</strong> {config.temperatura}</div>
                                            <div><strong>Max Tokens:</strong> {config.max_tokens}</div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleTestarConfig(config.id)}
                                                disabled={loading}
                                                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                                            >
                                                {loading ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Zap className="w-3 h-3" />
                                                )}
                                                {loading ? 'Testando...' : 'Testar'}
                                            </button>

                                            <button
                                                onClick={() => handleEditarConfig(config)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDeletarConfig(config.id)}
                                                disabled={loading}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Modal Nova/Editar Configuração */}
                    {showNovaConfig && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                            >
                                <h3 className="text-lg font-bold text-gray-800 mb-4">
                                    {editingConfig ? 'Editar Configuração' : 'Nova Configuração de IA'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Configuração</label>
                                        <input
                                            type="text"
                                            value={novaConfig.nome}
                                            onChange={(e) => setNovaConfig(prev => ({ ...prev, nome: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Ex: GPT-4 Anúncios"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                            <select
                                                value={novaConfig.tipo}
                                                onChange={(e) => {
                                                    setNovaConfig(prev => ({
                                                        ...prev,
                                                        tipo: e.target.value as any,
                                                        modelo: ''
                                                    }));
                                                }}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                {tipos.map(tipo => (
                                                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                            <select
                                                value={novaConfig.modelo}
                                                onChange={(e) => setNovaConfig(prev => ({ ...prev, modelo: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Selecione um modelo</option>
                                                {modelosPorTipo[novaConfig.tipo]?.map(modelo => (
                                                    <option key={modelo} value={modelo}>{modelo}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Temperatura</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="2"
                                                step="0.1"
                                                value={novaConfig.temperatura}
                                                onChange={(e) => setNovaConfig(prev => ({ ...prev, temperatura: parseFloat(e.target.value) }))}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>0.0</span>
                                                <span>{novaConfig.temperatura}</span>
                                                <span>2.0</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                                            <input
                                                type="number"
                                                value={novaConfig.max_tokens}
                                                onChange={(e) => setNovaConfig(prev => ({ ...prev, max_tokens: parseInt(e.target.value) || 1000 }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="1000"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                        <select
                                            value={novaConfig.categoria}
                                            onChange={(e) => setNovaConfig(prev => ({ ...prev, categoria: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            {categorias.map(categoria => (
                                                <option key={categoria} value={categoria}>{categoria}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                        <textarea
                                            value={novaConfig.descricao}
                                            onChange={(e) => setNovaConfig(prev => ({ ...prev, descricao: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            rows={3}
                                            placeholder="Descrição da configuração..."
                                        />
                                    </div>

                                    {novaConfig.tipo !== 'local' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                                            <input
                                                type="password"
                                                value={novaConfig.api_key}
                                                onChange={(e) => setNovaConfig(prev => ({ ...prev, api_key: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="sk-..."
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleSalvarConfig}
                                        disabled={loading || !novaConfig.nome || !novaConfig.modelo || !novaConfig.categoria}
                                        className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        {loading ? 'Salvando...' : 'Salvar'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowNovaConfig(false);
                                            setEditingConfig(null);
                                            setNovaConfig({
                                                nome: '',
                                                tipo: 'openai',
                                                modelo: '',
                                                api_key: '',
                                                temperatura: 0.7,
                                                max_tokens: 1000,
                                                descricao: '',
                                                categoria: ''
                                            });
                                        }}
                                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>
        </LayoutGestor>
    );
} 