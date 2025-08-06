import LayoutGestor from '@/components/layout/LayoutGestor';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    DollarSign,
    Edit,
    Loader2,
    Percent,
    Plus,
    Save,
    Settings,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';

interface RegraPrecificacao {
    id: number;
    nome: string;
    tipo: 'percentual' | 'valor_fixo' | 'multiplicador';
    valor: number;
    categoria: string;
    ativo: boolean;
    descricao?: string;
}

export default function RegrasPrecificacaoPage() {
    const [regras, setRegras] = useState<RegraPrecificacao[]>([
        {
            id: 1,
            nome: 'Margem Padrão',
            tipo: 'percentual',
            valor: 25,
            categoria: 'Geral',
            ativo: true,
            descricao: 'Margem padrão de 25% sobre o custo'
        },
        {
            id: 2,
            nome: 'Frete Incluso',
            tipo: 'valor_fixo',
            valor: 15,
            categoria: 'Frete',
            ativo: true,
            descricao: 'Adiciona R$ 15,00 para frete'
        },
        {
            id: 3,
            nome: 'Desconto por Volume',
            tipo: 'percentual',
            valor: -10,
            categoria: 'Promocional',
            ativo: true,
            descricao: 'Desconto de 10% para compras acima de R$ 100'
        }
    ]);

    const [showNovaRegra, setShowNovaRegra] = useState(false);
    const [editingRegra, setEditingRegra] = useState<RegraPrecificacao | null>(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [novaRegra, setNovaRegra] = useState({
        nome: '',
        tipo: 'percentual' as 'percentual' | 'valor_fixo' | 'multiplicador',
        valor: 0,
        categoria: '',
        descricao: ''
    });

    const handleSalvarRegra = async () => {
        setLoading(true);
        setFeedback(null);

        try {
            // Simular salvamento
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (editingRegra) {
                // Editar regra existente
                setRegras(prev => prev.map(regra =>
                    regra.id === editingRegra.id
                        ? { ...regra, ...novaRegra }
                        : regra
                ));
                setFeedback({ type: 'success', message: 'Regra atualizada com sucesso!' });
            } else {
                // Criar nova regra
                const novaRegraCompleta: RegraPrecificacao = {
                    id: Date.now(),
                    ...novaRegra,
                    ativo: true
                };
                setRegras(prev => [...prev, novaRegraCompleta]);
                setFeedback({ type: 'success', message: 'Regra criada com sucesso!' });
            }

            setShowNovaRegra(false);
            setEditingRegra(null);
            setNovaRegra({
                nome: '',
                tipo: 'percentual',
                valor: 0,
                categoria: '',
                descricao: ''
            });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao salvar regra' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditarRegra = (regra: RegraPrecificacao) => {
        setEditingRegra(regra);
        setNovaRegra({
            nome: regra.nome,
            tipo: regra.tipo,
            valor: regra.valor,
            categoria: regra.categoria,
            descricao: regra.descricao || ''
        });
        setShowNovaRegra(true);
    };

    const handleDeletarRegra = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar esta regra?')) return;

        setLoading(true);
        setFeedback(null);

        try {
            // Simular exclusão
            await new Promise(resolve => setTimeout(resolve, 500));
            setRegras(prev => prev.filter(regra => regra.id !== id));
            setFeedback({ type: 'success', message: 'Regra deletada com sucesso!' });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao deletar regra' });
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
            setRegras(prev => prev.map(regra =>
                regra.id === id
                    ? { ...regra, ativo: !regra.ativo }
                    : regra
            ));
            setFeedback({ type: 'success', message: 'Status atualizado com sucesso!' });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao atualizar status' });
        } finally {
            setLoading(false);
        }
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'percentual':
                return Percent;
            case 'valor_fixo':
                return DollarSign;
            case 'multiplicador':
                return TrendingUp;
            default:
                return Settings;
        }
    };

    const getTipoLabel = (tipo: string) => {
        switch (tipo) {
            case 'percentual':
                return 'Percentual';
            case 'valor_fixo':
                return 'Valor Fixo';
            case 'multiplicador':
                return 'Multiplicador';
            default:
                return 'Desconhecido';
        }
    };

    const getValorFormatado = (regra: RegraPrecificacao) => {
        switch (regra.tipo) {
            case 'percentual':
                return `${regra.valor > 0 ? '+' : ''}${regra.valor}%`;
            case 'valor_fixo':
                return `R$ ${regra.valor.toFixed(2)}`;
            case 'multiplicador':
                return `× ${regra.valor}`;
            default:
                return regra.valor.toString();
        }
    };

    return (
        <LayoutGestor>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 rounded-3xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Regras de Precificação</h1>
                            <p className="text-blue-100">Configure regras automáticas para precificação de produtos</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-2xl p-3">
                                <DollarSign className="w-8 h-8 text-white" />
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
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Regras Ativas</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {regras.filter(r => r.ativo).length}
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
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Percent className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Percentuais</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {regras.filter(r => r.tipo === 'percentual').length}
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
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Valores Fixos</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {regras.filter(r => r.tipo === 'valor_fixo').length}
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
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Categorias</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {new Set(regras.map(r => r.categoria)).size}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Rules List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Regras de Precificação</h2>
                            <button
                                onClick={() => setShowNovaRegra(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                            >
                                <Plus className="w-4 h-4" />
                                Nova Regra
                            </button>
                        </div>

                        <div className="space-y-4">
                            {regras.map((regra) => {
                                const TipoIcon = getTipoIcon(regra.tipo);
                                return (
                                    <motion.div
                                        key={regra.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${regra.ativo ? 'bg-green-100' : 'bg-gray-100'
                                                }`}>
                                                <TipoIcon className={`w-5 h-5 ${regra.ativo ? 'text-green-600' : 'text-gray-400'
                                                    }`} />
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-gray-800">{regra.nome}</h3>
                                                <p className="text-sm text-gray-600">{regra.descricao}</p>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                        {getTipoLabel(regra.tipo)}
                                                    </span>
                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                        {regra.categoria}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${regra.valor > 0
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {getValorFormatado(regra)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleAtivo(regra.id)}
                                                disabled={loading}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${regra.ativo
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {regra.ativo ? 'Ativo' : 'Inativo'}
                                            </button>

                                            <button
                                                onClick={() => handleEditarRegra(regra)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDeletarRegra(regra.id)}
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

                    {/* Modal Nova/Editar Regra */}
                    {showNovaRegra && (
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
                                <h3 className="text-lg font-bold text-gray-800 mb-4">
                                    {editingRegra ? 'Editar Regra' : 'Nova Regra de Precificação'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Regra</label>
                                        <input
                                            type="text"
                                            value={novaRegra.nome}
                                            onChange={(e) => setNovaRegra(prev => ({ ...prev, nome: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Ex: Margem Padrão"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                        <select
                                            value={novaRegra.tipo}
                                            onChange={(e) => setNovaRegra(prev => ({ ...prev, tipo: e.target.value as any }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        >
                                            <option value="percentual">Percentual (%)</option>
                                            <option value="valor_fixo">Valor Fixo (R$)</option>
                                            <option value="multiplicador">Multiplicador (×)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={novaRegra.valor}
                                            onChange={(e) => setNovaRegra(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                        <input
                                            type="text"
                                            value={novaRegra.categoria}
                                            onChange={(e) => setNovaRegra(prev => ({ ...prev, categoria: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Ex: Geral, Frete, Promocional"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                        <textarea
                                            value={novaRegra.descricao}
                                            onChange={(e) => setNovaRegra(prev => ({ ...prev, descricao: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            rows={3}
                                            placeholder="Descrição da regra..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleSalvarRegra}
                                        disabled={loading || !novaRegra.nome || !novaRegra.categoria}
                                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                                            setShowNovaRegra(false);
                                            setEditingRegra(null);
                                            setNovaRegra({
                                                nome: '',
                                                tipo: 'percentual',
                                                valor: 0,
                                                categoria: '',
                                                descricao: ''
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