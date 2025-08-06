import LayoutGestor from '@/components/layout/LayoutGestor';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Copy,
    Edit,
    Eye,
    FileText,
    Image,
    Layout,
    Loader2,
    Plus,
    Save,
    Trash2
} from 'lucide-react';
import { useState } from 'react';

interface Template {
    id: number;
    nome: string;
    categoria: string;
    descricao: string;
    ativo: boolean;
    elementos: string[];
    preview_url?: string;
}

export default function TemplatesPadraoPage() {
    const [templates, setTemplates] = useState<Template[]>([
        {
            id: 1,
            nome: 'Template Promocional',
            categoria: 'Promocional',
            descricao: 'Template com destaque para promoções e ofertas',
            ativo: true,
            elementos: ['Logo', 'Faixa Promocional', 'Preço Destacado', 'Call to Action']
        },
        {
            id: 2,
            nome: 'Template Profissional',
            categoria: 'Profissional',
            descricao: 'Template limpo e profissional para produtos premium',
            ativo: true,
            elementos: ['Logo', 'Informações Técnicas', 'Garantia', 'Contato']
        },
        {
            id: 3,
            nome: 'Template Frete Grátis',
            categoria: 'Comercial',
            descricao: 'Template focado em frete grátis e entrega rápida',
            ativo: false,
            elementos: ['Logo', 'Frete Grátis', 'Prazo Entrega', 'WhatsApp']
        }
    ]);

    const [showNovoTemplate, setShowNovoTemplate] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [novoTemplate, setNovoTemplate] = useState({
        nome: '',
        categoria: '',
        descricao: '',
        elementos: [] as string[]
    });

    const categorias = ['Promocional', 'Profissional', 'Comercial', 'Técnico', 'Personalizado'];
    const elementosDisponiveis = [
        'Logo', 'Faixa Promocional', 'Preço Destacado', 'Call to Action',
        'Informações Técnicas', 'Garantia', 'Contato', 'Frete Grátis',
        'Prazo Entrega', 'WhatsApp', 'Avaliações', 'Especificações'
    ];

    const handleSalvarTemplate = async () => {
        setLoading(true);
        setFeedback(null);

        try {
            // Simular salvamento
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (editingTemplate) {
                // Editar template existente
                setTemplates(prev => prev.map(template =>
                    template.id === editingTemplate.id
                        ? { ...template, ...novoTemplate }
                        : template
                ));
                setFeedback({ type: 'success', message: 'Template atualizado com sucesso!' });
            } else {
                // Criar novo template
                const novoTemplateCompleto: Template = {
                    id: Date.now(),
                    ...novoTemplate,
                    ativo: true
                };
                setTemplates(prev => [...prev, novoTemplateCompleto]);
                setFeedback({ type: 'success', message: 'Template criado com sucesso!' });
            }

            setShowNovoTemplate(false);
            setEditingTemplate(null);
            setNovoTemplate({
                nome: '',
                categoria: '',
                descricao: '',
                elementos: []
            });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao salvar template' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditarTemplate = (template: Template) => {
        setEditingTemplate(template);
        setNovoTemplate({
            nome: template.nome,
            categoria: template.categoria,
            descricao: template.descricao,
            elementos: template.elementos
        });
        setShowNovoTemplate(true);
    };

    const handleDeletarTemplate = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar este template?')) return;

        setLoading(true);
        setFeedback(null);

        try {
            // Simular exclusão
            await new Promise(resolve => setTimeout(resolve, 500));
            setTemplates(prev => prev.filter(template => template.id !== id));
            setFeedback({ type: 'success', message: 'Template deletado com sucesso!' });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao deletar template' });
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
            setTemplates(prev => prev.map(template =>
                template.id === id
                    ? { ...template, ativo: !template.ativo }
                    : template
            ));
            setFeedback({ type: 'success', message: 'Status atualizado com sucesso!' });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao atualizar status' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleElemento = (elemento: string) => {
        setNovoTemplate(prev => ({
            ...prev,
            elementos: prev.elementos.includes(elemento)
                ? prev.elementos.filter(e => e !== elemento)
                : [...prev.elementos, elemento]
        }));
    };

    const handleAplicarTemplate = async (id: number) => {
        setLoading(true);
        setFeedback(null);

        try {
            // Simular aplicação
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFeedback({ type: 'success', message: 'Template aplicado com sucesso!' });
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao aplicar template' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LayoutGestor>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Templates Padrão</h1>
                            <p className="text-blue-100">Gerencie templates padrão para anúncios e produtos</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-2xl p-3">
                                <Layout className="w-8 h-8 text-white" />
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
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Layout className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Templates Ativos</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {templates.filter(t => t.ativo).length}
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
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Templates</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {templates.length}
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
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Image className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Categorias</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {new Set(templates.map(t => t.categoria)).size}
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
                                    <Eye className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Elementos</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {elementosDisponiveis.length}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Templates List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Templates Disponíveis</h2>
                            <button
                                onClick={() => setShowNovoTemplate(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                            >
                                <Plus className="w-4 h-4" />
                                Novo Template
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <motion.div
                                    key={template.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-1">{template.nome}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{template.descricao}</p>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${template.ativo
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {template.categoria}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleAtivo(template.id)}
                                                disabled={loading}
                                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${template.ativo
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {template.ativo ? 'Ativo' : 'Inativo'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs text-gray-600 mb-2">Elementos:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {template.elementos.map((elemento, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                    {elemento}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAplicarTemplate(template.id)}
                                            disabled={loading || !template.ativo}
                                            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                                        >
                                            <Copy className="w-3 h-3" />
                                            Aplicar
                                        </button>

                                        <button
                                            onClick={() => handleEditarTemplate(template)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDeletarTemplate(template.id)}
                                            disabled={loading}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Modal Novo/Editar Template */}
                    {showNovoTemplate && (
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
                                    {editingTemplate ? 'Editar Template' : 'Novo Template'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Template</label>
                                        <input
                                            type="text"
                                            value={novoTemplate.nome}
                                            onChange={(e) => setNovoTemplate(prev => ({ ...prev, nome: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Ex: Template Promocional"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                        <select
                                            value={novoTemplate.categoria}
                                            onChange={(e) => setNovoTemplate(prev => ({ ...prev, categoria: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                                            value={novoTemplate.descricao}
                                            onChange={(e) => setNovoTemplate(prev => ({ ...prev, descricao: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            rows={3}
                                            placeholder="Descrição do template..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Elementos do Template</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {elementosDisponiveis.map((elemento) => (
                                                <label key={elemento} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={novoTemplate.elementos.includes(elemento)}
                                                        onChange={() => handleToggleElemento(elemento)}
                                                        className="rounded text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm">{elemento}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleSalvarTemplate}
                                        disabled={loading || !novoTemplate.nome || !novoTemplate.categoria || novoTemplate.elementos.length === 0}
                                        className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                                            setShowNovoTemplate(false);
                                            setEditingTemplate(null);
                                            setNovoTemplate({
                                                nome: '',
                                                categoria: '',
                                                descricao: '',
                                                elementos: []
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