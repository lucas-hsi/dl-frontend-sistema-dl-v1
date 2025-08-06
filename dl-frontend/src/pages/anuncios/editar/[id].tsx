import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutAnuncios from "@/components/layout/LayoutAnuncios";
import { useAuth } from "@/contexts/AuthContext";
import { produtoEstoqueService, ProdutoEstoque } from "@/services/produtoEstoqueService";

// Interface estendida para produtos com campos adicionais
interface ProdutoEstoqueExtendido extends ProdutoEstoque {
    status?: string;
    origem?: string;
    permalink?: string;
    mlb_id?: string;
    sku?: string;
}
import { ArrowLeft, Save, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditarProduto() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { id } = router.query;

    const [produto, setProduto] = useState<ProdutoEstoqueExtendido | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form data
    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        preco: 0,
        quantidade: 1,
        categoria: "",
        status: "ativo"
    });

    useEffect(() => {
        if (id && typeof id === 'string') {
            carregarProduto(parseInt(id));
        }
    }, [id]);

    const carregarProduto = async (produtoId: number) => {
        try {
            setLoading(true);
            const data = await produtoEstoqueService.getById(produtoId);
            setProduto(data as ProdutoEstoqueExtendido);
            setFormData({
                nome: data.nome,
                descricao: data.descricao || "",
                preco: data.preco,
                quantidade: data.quantidade,
                categoria: data.categoria || "",
                status: (data as any).status
            });
        } catch (error: any) {
            console.error('Erro ao carregar produto:', error);
            setError("Erro ao carregar dados do produto");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!produto) return;

        try {
            setSaving(true);
            setError(null);

            const updateData: Partial<ProdutoEstoque> = {
                nome: formData.nome,
                descricao: formData.descricao || undefined,
                preco: formData.preco,
                quantidade: formData.quantidade,
                categoria: formData.categoria || undefined
            };

            await produtoEstoqueService.update(produto.id, updateData);

            setSuccess("Produto atualizado com sucesso!");
            setTimeout(() => {
                router.push('/anuncios/estoque/interno');
            }, 2000);

        } catch (error: any) {
            console.error('Erro ao atualizar produto:', error);
            setError("Erro ao atualizar produto");
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <LayoutAnuncios>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Carregando produto...</p>
                        </div>
                    </div>
                </LayoutAnuncios>
            </ProtectedRoute>
        );
    }

    if (!produto) {
        return (
            <ProtectedRoute>
                <LayoutAnuncios>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Produto não encontrado</h2>
                            <p className="text-gray-600 mb-4">O produto que você está procurando não existe.</p>
                            <button
                                onClick={() => router.push('/anuncios/estoque/interno')}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                Voltar ao estoque
                            </button>
                        </div>
                    </div>
                </LayoutAnuncios>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <LayoutAnuncios>
                <div className="max-w-4xl mx-auto p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/anuncios/estoque/interno')}
                                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Editar Produto</h1>
                                <p className="text-gray-600">Atualize as informações do produto</p>
                            </div>
                        </div>
                    </div>

                    {/* Alertas */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-green-800">{success}</p>
                        </div>
                    )}

                    {/* Formulário */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informações básicas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Produto *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => handleInputChange('nome', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                        placeholder="Nome do produto"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoria
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.categoria}
                                        onChange={(e) => handleInputChange('categoria', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                        placeholder="Categoria"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preço *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.preco}
                                            onChange={(e) => handleInputChange('preco', parseFloat(e.target.value) || 0)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                            placeholder="0,00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantidade em Estoque *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.quantidade}
                                        onChange={(e) => handleInputChange('quantidade', parseInt(e.target.value) || 0)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Descrição */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    value={formData.descricao}
                                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="Descrição detalhada do produto..."
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                >
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                    <option value="vendido">Vendido</option>
                                </select>
                            </div>

                            {/* Informações do ML */}
                            {produto.origem === 'mercado_livre' && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Informações do Mercado Livre</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">MLB ID:</span>
                                            <span className="ml-2 font-mono">{produto.mlb_id}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">SKU:</span>
                                            <span className="ml-2 font-mono">{produto.sku}</span>
                                        </div>
                                        {produto.permalink && (
                                            <div className="md:col-span-2">
                                                <span className="text-gray-600">Link do anúncio:</span>
                                                <a
                                                    href={produto.permalink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2 text-yellow-600 hover:text-yellow-800 underline"
                                                >
                                                    Ver no Mercado Livre
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Botões */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => router.push('/anuncios/estoque/interno')}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </LayoutAnuncios>
        </ProtectedRoute>
    );
} 