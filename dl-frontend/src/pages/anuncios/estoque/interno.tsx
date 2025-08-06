import LayoutAnuncios from "@/components/layout/LayoutAnuncios";
import { useAuth } from "@/contexts/AuthContext";
import { EstoqueService, ProdutoEstoque } from "@/services/estoqueService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EstoqueInternoPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoEstoque[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroEstoque, setFiltroEstoque] = useState("todos");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Carregar produtos do estoque
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setLoadingProdutos(true);
        setError(null);

        console.log('🔄 Carregando produtos do estoque interno...');
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

    if (mounted && !loading) {
      carregarProdutos();
    }
  }, [mounted, loading]);

  // Filtrar produtos
  useEffect(() => {
    let filtrados = produtos;

    // Filtro por busca
    if (busca.trim()) {
      filtrados = filtrados.filter(produto =>
        produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
        produto.sku.toLowerCase().includes(busca.toLowerCase()) ||
        produto.categoria?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtro por categoria
    if (filtroCategoria !== "todas") {
      filtrados = filtrados.filter(produto => produto.categoria === filtroCategoria);
    }

    // Filtro por estoque
    if (filtroEstoque === "disponivel") {
      filtrados = filtrados.filter(produto => produto.quantidade > 0);
    } else if (filtroEstoque === "sem_estoque") {
      filtrados = filtrados.filter(produto => produto.quantidade === 0);
    }

    setProdutosFiltrados(filtrados);
  }, [busca, filtroCategoria, filtroEstoque, produtos]);

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

  // Verificar se o usuário está autenticado como anuncios
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">🔒 Acesso Restrito</h1>
              <p className="text-gray-600 mb-6">
                Esta área é exclusiva para a equipe de anúncios. Faça login com suas credenciais.
              </p>

              <button
                onClick={() => router.push('/login')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir para Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCriarAnuncio = (produto: ProdutoEstoque) => {
    // Navegar para a página de criação de anúncio com o produto selecionado
    router.push(`/anuncios/criar-anuncio?produto=${produto.sku}`);
  };

  const getStatusColor = (quantidade: number) => {
    if (quantidade === 0) return 'text-red-600 bg-red-50';
    if (quantidade <= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (quantidade: number) => {
    if (quantidade === 0) return 'Sem Estoque';
    if (quantidade <= 5) return 'Estoque Baixo';
    return 'Disponível';
  };

  const categorias = Array.from(new Set(produtos.map(p => p.categoria).filter(Boolean)));

  return (
    <LayoutAnuncios>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">📦 Estoque Interno</h1>
              <p className="text-blue-100 opacity-90">
                Gerencie produtos para criação de anúncios
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{produtos.length}</div>
              <div className="text-sm text-blue-100">Total de Produtos</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filtro Categoria */}
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas as Categorias</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>

            {/* Filtro Estoque */}
            <select
              value={filtroEstoque}
              onChange={(e) => setFiltroEstoque(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              <option value="disponivel">Com Estoque</option>
              <option value="sem_estoque">Sem Estoque</option>
            </select>
          </div>

          {busca && (
            <div className="mt-3 text-sm text-gray-600">
              {produtosFiltrados.length} produto(s) encontrado(s) para "{busca}"
            </div>
          )}
        </div>

        {/* Loading */}
        {loadingProdutos && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando produtos do estoque...</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <h3 className="font-semibold mb-2">❌ Erro ao carregar produtos</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Lista de Produtos */}
        {!loadingProdutos && !error && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Produtos para Anúncios
              </h2>
              <div className="text-sm text-gray-500">
                {produtosFiltrados.length} de {produtos.length} produtos
              </div>
            </div>

            {produtosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros ou verificar o estoque.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {produtosFiltrados.map((produto) => (
                  <div
                    key={produto.id}
                    className="border rounded-xl p-4 hover:shadow-lg transition-all duration-200 group"
                  >
                    {/* Imagem do Produto */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center text-gray-400 ${produto.imagem ? 'hidden' : ''}`}>
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Informações do Produto */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
                        {produto.nome}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">SKU: {produto.sku}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(produto.quantidade)}`}>
                          {getStatusText(produto.quantidade)}
                        </span>
                      </div>

                      {produto.categoria && (
                        <p className="text-xs text-gray-500">
                          Categoria: {produto.categoria}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          R$ {produto.preco.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Estoque: {produto.quantidade}
                        </span>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleCriarAnuncio(produto)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Criar Anúncio
                        </button>

                        {produto.permalink && (
                          <a
                            href={produto.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Ver ML
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Estatísticas */}
        {!loadingProdutos && !error && produtos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total de Produtos</p>
                  <p className="text-2xl font-bold text-gray-800">{produtos.length}</p>
                </div>
                <div className="text-3xl">📦</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Disponíveis</p>
                  <p className="text-2xl font-bold text-green-600">
                    {produtos.filter(p => p.quantidade > 0).length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sem Estoque</p>
                  <p className="text-2xl font-bold text-red-600">
                    {produtos.filter(p => p.quantidade === 0).length}
                  </p>
                </div>
                <div className="text-3xl">❌</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Categorias</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {categorias.length}
                  </p>
                </div>
                <div className="text-3xl">🏷️</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutAnuncios>
  );
} 