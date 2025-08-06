import LayoutVendedor from "@/components/layout/LayoutVendedor";
import { useAuth } from "@/contexts/AuthContext";
import { EstoqueService, ProdutoEstoque } from "@/services/estoqueService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EstoqueVendedorPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoEstoque[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Carregar produtos do estoque
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setLoadingProdutos(true);
        setError(null);

        console.log('🔄 Carregando produtos do estoque...');
        // ✅ CORREÇÃO: Usando o método correto do EstoqueService
        const produtosData = await EstoqueService.listarProdutos();
        setProdutos(produtosData);
        setProdutosFiltrados(produtosData);

        console.log('✅ Produtos carregados:', produtosData.length);
      } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        setError(error instanceof Error ? error.message : 'Erro ao carregar produtos');
      } finally {
        setLoadingProdutos(false);
      }
    };

    if (mounted && !loading && isAuthenticated) {
      carregarProdutos();
    }
  }, [mounted, loading, isAuthenticated]);

  // Filtrar produtos por busca
  useEffect(() => {
    if (!busca.trim()) {
      setProdutosFiltrados(produtos);
      return;
    }

    const filtrados = produtos.filter(produto =>
      produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.sku.toLowerCase().includes(busca.toLowerCase()) ||
      produto.categoria?.toLowerCase().includes(busca.toLowerCase())
    );
    setProdutosFiltrados(filtrados);
  }, [busca, produtos]);

  // Se não montou ainda, mostra loading
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando...</p>
        </div>
      </div>
    );
  }

  // Se está carregando, mostra loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  // Verificar se o usuário está autenticado - VERSÃO CORRIGIDA
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">🔒 Acesso Restrito</h1>
              <p className="text-gray-600 mb-6">
                Esta área é exclusiva para vendedores. Faça login com suas credenciais de vendedor.
              </p>

              <button
                onClick={() => router.push('/login')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fazer Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleProdutoClick = (produto: ProdutoEstoque) => {
    // Navegar para a página de venda rápida com o produto selecionado
    router.push(`/vendedor/venda-rapida?produto=${produto.id}`);
  };

  const getStatusColor = (quantidade: number) => {
    if (quantidade === 0) return 'text-red-600 bg-red-50';
    if (quantidade <= 5) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (quantidade: number) => {
    if (quantidade === 0) return 'Esgotado';
    if (quantidade <= 5) return 'Baixo Estoque';
    return 'Disponível';
  };

  return (
    <LayoutVendedor>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header Premium */}
        <div className="px-6 pt-6">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">📦 Estoque Centralizado</h1>
                <p className="text-blue-100">
                  {produtos.length} produtos disponíveis • Sistema unificado
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{produtos.length}</div>
                <div className="text-blue-100 text-sm">Produtos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="px-6 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar por SKU, nome ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white rounded-2xl shadow-lg border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="px-6 pb-6">
          {loadingProdutos ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando produtos...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <div className="text-red-600 text-2xl mb-2">❌</div>
              <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar produtos</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {produtosFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-gray-600 font-semibold mb-2">
                    {busca ? 'Nenhum produto encontrado' : 'Nenhum produto no estoque'}
                  </h3>
                  <p className="text-gray-500">
                    {busca ? 'Tente ajustar os termos de busca' : 'Entre em contato com o gestor'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {produtosFiltrados.map((produto) => (
                    <div
                      key={produto.id}
                      onClick={() => handleProdutoClick(produto)}
                      className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                            {produto.nome}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">SKU: {produto.sku}</p>
                          {produto.categoria && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                              {produto.categoria}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            R$ {produto.preco.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(produto.quantidade)}`}>
                            {getStatusText(produto.quantidade)}
                          </span>
                          <span className="text-sm text-gray-600">
                            Qtd: {produto.quantidade}
                          </span>
                        </div>
                        <div className="text-blue-600 text-sm font-medium">
                          Ver detalhes →
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </LayoutVendedor>
  );
} 