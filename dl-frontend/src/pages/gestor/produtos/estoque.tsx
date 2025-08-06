import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutGestor from "@/components/layout/LayoutGestor";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  ExternalLink,
  Eye,
  Globe,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from '@/config/api';

interface Produto {
  id: string;
  sku: string;
  nome: string;
  categoria: string;
  marca: string;
  modelo_veiculo: string;
  ano_veiculo: string;
  preco: number;
  estoque: number;
  status: 'ativo' | 'inativo' | 'esgotado';
  origem: string;
  permalink?: string;
  imagem?: string;
  descricao?: string;
  criado_em: string;
  atualizado_em: string;
}

export default function EstoqueUnificado() {
  // Estados de filtros
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroEstoque, setFiltroEstoque] = useState("todos");
  const [filtroCanal, setFiltroCanal] = useState("todos");
  const [filtroData, setFiltroData] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  // Estados da interface
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [showVisualizarProduto, setShowVisualizarProduto] = useState(false);
  const [showEditarProduto, setShowEditarProduto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [produtoEdicao, setProdutoEdicao] = useState<Produto | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: { type: 'success' | 'error', text: string } }>({});

  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [produtosPorPagina] = useState(50);
  const [totalProdutos, setTotalProdutos] = useState(0);

  // Estados para opções dos filtros
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<string[]>([]);
  const [statusDisponiveis, setStatusDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    carregarProdutos();
  }, []);

  // Resetar paginação quando filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, filtroStatus, filtroEstoque, filtroCanal, filtroData, filtroCategoria]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);

      // Buscar TODOS os produtos sem limitação
      const produtosReais = await api.get('/produtos-estoque/?skip=0&limit=10000');

      const produtosConvertidos: Produto[] = Array.isArray(produtosReais)
        ? produtosReais.map((produto: any) => ({
            id: produto.id.toString(),
            sku: produto.sku,
            nome: produto.nome,
            categoria: produto.categoria || "Autopeças",
            marca: produto.marca || "Genérica",
            modelo_veiculo: produto.modelo_veiculo || "Genérico",
            ano_veiculo: produto.ano_veiculo || "Genérico",
            preco: produto.preco,
            estoque: produto.quantidade,
            status: produto.quantidade === 0 ? 'inativo' : (produto.status || "ativo"),
            origem: produto.origem || "manual",
            permalink: produto.permalink,
            imagem: produto.imagem || "/logo.svg",
            descricao: produto.descricao || produto.nome,
            criado_em: produto.criado_em,
            atualizado_em: produto.atualizado_em || produto.criado_em
          }))
        : [];

      setProdutos(produtosConvertidos);
      setTotalProdutos(produtosConvertidos.length);

      // Extrair opções dos filtros
      const categorias = Array.from(new Set(produtosConvertidos.map((p: Produto) => p.categoria).filter(Boolean))) as string[];
      const status = Array.from(new Set(produtosConvertidos.map((p: Produto) => p.status).filter(Boolean))) as string[];
      setCategoriasDisponiveis(categorias);
      setStatusDisponiveis(status);

    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      showMessage('carregar_produtos', 'error', 'Erro ao carregar produtos da API');
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (action: string, type: 'success' | 'error', text: string) => {
    setMessages(prev => ({ ...prev, [action]: { type, text } }));
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[action];
        return newMessages;
      });
    }, 5000);
  };

  // Filtrar produtos
  const produtosFiltrados = produtos.filter(produto => {
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.sku.toLowerCase().includes(busca.toLowerCase()) ||
      produto.marca.toLowerCase().includes(busca.toLowerCase());

    const matchStatus = filtroStatus === "todos" || produto.status === filtroStatus;
    const matchCategoria = filtroCategoria === "todas" || produto.categoria === filtroCategoria;

    let matchEstoque = true;
    if (filtroEstoque === "com_estoque") matchEstoque = produto.estoque > 0;
    if (filtroEstoque === "sem_estoque") matchEstoque = produto.estoque === 0;

    let matchCanal = true;
    if (filtroCanal === "mercado_livre") matchCanal = produto.origem === "mercado_livre";
    if (filtroCanal === "balcao") matchCanal = produto.origem === "manual";
    if (filtroCanal === "shopify") matchCanal = produto.origem === "shopify";
    if (filtroCanal === "avulso") matchCanal = produto.origem === "avulso";

    let matchData = true;
    if (filtroData !== "todos") {
      const dataProduto = new Date(produto.criado_em);
      const hoje = new Date();
      const diasDiff = Math.floor((hoje.getTime() - dataProduto.getTime()) / (1000 * 60 * 60 * 24));

      if (filtroData === "7_dias") matchData = diasDiff <= 7;
      if (filtroData === "15_dias") matchData = diasDiff <= 15;
      if (filtroData === "30_dias") matchData = diasDiff <= 30;
    }

    return matchBusca && matchStatus && matchEstoque && matchCanal && matchData && matchCategoria;
  });

  const handleSyncML = async () => {
    try {
      setSincronizando(true);
      const resultado = await api.post('/produtos-estoque/importar-ml', {});
      if (resultado && typeof resultado === 'object' && 'total_importados' in resultado && 'total_atualizados' in resultado) {
        showMessage('sync_ml', 'success',
          `Sincronização concluída! ${resultado.total_importados} importados, ${resultado.total_atualizados} atualizados.`);
      } else {
        showMessage('sync_ml', 'success', 'Sincronização concluída!');
      }
      await carregarProdutos();
    } catch (error) {
      console.error("Erro na sincronização:", error);
      showMessage('sync_ml', 'error', 'Erro na sincronização com Mercado Livre');
    } finally {
      setSincronizando(false);
    }
  };

  const handleVisualizarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setShowVisualizarProduto(true);
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEdicao({ ...produto });
    setShowEditarProduto(true);
  };

  const handleSalvarEdicao = async () => {
    if (!produtoEdicao) return;

    try {
      await api.put(`/produtos-estoque/${produtoEdicao.id}`, {
        nome: produtoEdicao.nome,
        preco: produtoEdicao.preco,
        quantidade: produtoEdicao.estoque,
        categoria: produtoEdicao.categoria,
        status: produtoEdicao.status
      });

      showMessage('salvar_edicao', 'success', 'Produto atualizado com sucesso!');
      setShowEditarProduto(false);
      setProdutoEdicao(null);
      await carregarProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      showMessage('salvar_edicao', 'error', 'Erro ao salvar produto');
    }
  };

  const handleExportarDados = () => {
    const csv = [
      ["SKU", "Nome", "Categoria", "Preço", "Estoque", "Status", "Origem"],
      ...produtosFiltrados.map(p => [
        p.sku, p.nome, p.categoria, p.preco, p.estoque, p.status, p.origem
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "estoque-unificado.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      case 'esgotado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstoqueColor = (estoque: number) => {
    if (estoque === 0) return 'bg-red-100 text-red-800';
    if (estoque <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getCanalIcon = (origem: string) => {
    switch (origem) {
      case 'mercado_livre':
        return <div className="w-4 h-4 bg-yellow-400 rounded-sm flex items-center justify-center">
          <span className="text-xs font-bold text-white">ML</span>
        </div>;
      case 'shopify':
        return <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
          <ShoppingCart className="w-2 h-2 text-white" />
        </div>;
      case 'manual':
        return <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
          <Globe className="w-2 h-2 text-white" />
        </div>;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-sm flex items-center justify-center">
          <Package className="w-2 h-2 text-white" />
        </div>;
    }
  };

  const totalPaginas = Math.ceil(totalProdutos / produtosPorPagina);

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginasFiltrados) {
      setPaginaAtual(paginaAtual + 1);
    }
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1);
    }
  };

  const limparFiltros = () => {
    setBusca("");
    setFiltroStatus("todos");
    setFiltroEstoque("todos");
    setFiltroCanal("todos");
    setFiltroData("todos");
    setFiltroCategoria("todas");
  };

  // Paginação baseada nos produtos filtrados
  const produtosPaginados = produtosFiltrados.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  const totalPaginasFiltrados = Math.ceil(produtosFiltrados.length / produtosPorPagina);

  const produtosAtivos = produtos.filter(p => p.status === 'ativo').length;
  const produtosInativos = produtos.filter(p => p.status === 'inativo').length;
  const produtosComEstoque = produtos.filter(p => p.estoque > 0).length;
  const produtosSemEstoque = produtos.filter(p => p.estoque === 0).length;

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Mensagens de feedback */}
          {Object.entries(messages).map(([action, message]) => (
            <div key={action} className={`rounded-xl p-4 ${message.type === 'success'
              ? 'bg-green-500/20 text-green-700 border border-green-500/30'
              : 'bg-red-500/20 text-red-700 border border-red-500/30'
              }`}>
              <p className="font-medium">{message.text}</p>
            </div>
          ))}

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Package className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Estoque Unificado</h1>
                  <p className="text-blue-100 opacity-90">Gestão centralizada de produtos e estoque</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{totalProdutos}</div>
                <div className="text-blue-100 text-sm">total de produtos</div>
              </div>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="text-2xl font-bold">{produtosAtivos}</div>
              <div className="text-green-100">Produtos Ativos</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
              <div className="text-2xl font-bold">{produtosInativos}</div>
              <div className="text-red-100">Produtos Inativos</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="text-2xl font-bold">{produtosComEstoque}</div>
              <div className="text-blue-100">Com Estoque</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
              <div className="text-2xl font-bold">{produtosSemEstoque}</div>
              <div className="text-yellow-100">Sem Estoque</div>
            </div>
          </div>

          {/* Barra de Ações */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => window.location.href = '/anuncios/ia/criar-anuncio'}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Novo Produto
                </button>

                <button
                  onClick={handleSyncML}
                  disabled={sincronizando}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {sincronizando ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                  {sincronizando ? 'Sincronizando...' : 'Sync ML'}
                </button>

                <button
                  onClick={handleExportarDados}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Exportar CSV
                </button>
              </div>

              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por SKU, nome, tags..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80"
                />
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="esgotado">Esgotado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estoque</label>
                <select
                  value={filtroEstoque}
                  onChange={(e) => setFiltroEstoque(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  <option value="com_estoque">Com Estoque</option>
                  <option value="sem_estoque">Sem Estoque</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canal</label>
                <select
                  value={filtroCanal}
                  onChange={(e) => setFiltroCanal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  <option value="mercado_livre">Mercado Livre</option>
                  <option value="balcao">Balcão</option>
                  <option value="shopify">Shopify</option>
                  <option value="avulso">Avulso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <select
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  <option value="7_dias">Últimos 7 dias</option>
                  <option value="15_dias">Últimos 15 dias</option>
                  <option value="30_dias">Últimos 30 dias</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todas">Todas</option>
                  {categoriasDisponiveis.map(categoria => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={limparFiltros}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Produtos */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Produto</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Categoria</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Preço</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estoque</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Canal</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                        <p className="mt-2 text-gray-600">Carregando produtos...</p>
                      </td>
                    </tr>
                  ) : produtosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center">
                        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Nenhum produto encontrado</p>
                        <p className="text-sm text-gray-500 mt-1">Tente ajustar os filtros</p>
                      </td>
                    </tr>
                  ) : (
                    produtosPaginados.map(produto => (
                      <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={produto.imagem}
                              alt={produto.nome}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <div className="font-medium text-gray-900 line-clamp-2">{produto.nome}</div>
                              <div className="text-sm text-gray-500">{produto.marca} {produto.modelo_veiculo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-gray-900">{produto.sku}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {produto.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">
                            R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstoqueColor(produto.estoque)}`}>
                            {produto.estoque} un
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(produto.status)}`}>
                            {produto.status === 'ativo' ? 'Ativo' : produto.status === 'inativo' ? 'Inativo' : 'Esgotado'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getCanalIcon(produto.origem)}
                            <span className="text-sm text-gray-600">
                              {produto.origem === 'mercado_livre' ? 'ML' :
                                produto.origem === 'manual' ? 'Balcão' :
                                  produto.origem === 'shopify' ? 'Shopify' : 'Avulso'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleVisualizarProduto(produto)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditarProduto(produto)}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {produto.permalink && (
                              <a
                                href={produto.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                                title="Ver no ML"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginação */}
          {totalPaginasFiltrados > 1 && (
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Mostrando {((paginaAtual - 1) * produtosPorPagina) + 1} a {Math.min(paginaAtual * produtosPorPagina, produtosFiltrados.length)} de {produtosFiltrados.length} produtos
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePaginaAnterior}
                    disabled={paginaAtual === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPaginasFiltrados) }, (_, i) => {
                      let pagina: number;
                      if (totalPaginasFiltrados <= 5) {
                        pagina = i + 1;
                      } else if (paginaAtual <= 3) {
                        pagina = i + 1;
                      } else if (paginaAtual >= totalPaginasFiltrados - 2) {
                        pagina = totalPaginasFiltrados - 4 + i;
                      } else {
                        pagina = paginaAtual - 2 + i;
                      }

                      return (
                        <button
                          key={pagina}
                          onClick={() => setPaginaAtual(pagina)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${pagina === paginaAtual
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {pagina}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleProximaPagina}
                    disabled={paginaAtual === totalPaginasFiltrados}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Visualização */}
        {showVisualizarProduto && produtoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Detalhes do Produto</h3>
                <button
                  onClick={() => setShowVisualizarProduto(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={produtoSelecionado.imagem}
                    alt={produtoSelecionado.nome}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{produtoSelecionado.nome}</h4>
                    <p className="text-gray-600">{produtoSelecionado.marca} {produtoSelecionado.modelo_veiculo}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SKU</label>
                      <p className="font-mono text-sm">{produtoSelecionado.sku}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoria</label>
                      <p className="text-sm">{produtoSelecionado.categoria}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preço</label>
                      <p className="text-lg font-bold text-green-600">
                        R$ {produtoSelecionado.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Estoque</label>
                      <p className="text-lg font-semibold">{produtoSelecionado.estoque} unidades</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="text-sm">{produtoSelecionado.status}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Origem</label>
                      <p className="text-sm">{produtoSelecionado.origem}</p>
                    </div>
                  </div>

                  {produtoSelecionado.permalink && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link do Anúncio</label>
                      <a
                        href={produtoSelecionado.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm break-all"
                      >
                        {produtoSelecionado.permalink}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {produtoSelecionado.descricao && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{produtoSelecionado.descricao}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de Edição */}
        {showEditarProduto && produtoEdicao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Editar Produto</h3>
                <button
                  onClick={() => setShowEditarProduto(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                    <input
                      type="text"
                      value={produtoEdicao.nome}
                      onChange={(e) => setProdutoEdicao(prev => prev ? { ...prev, nome: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={produtoEdicao.preco}
                        onChange={(e) => setProdutoEdicao(prev => prev ? { ...prev, preco: parseFloat(e.target.value) || 0 } : null)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                      <input
                        type="number"
                        value={produtoEdicao.estoque}
                        onChange={(e) => setProdutoEdicao(prev => prev ? { ...prev, estoque: parseInt(e.target.value) || 0 } : null)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      value={produtoEdicao.categoria}
                      onChange={(e) => setProdutoEdicao(prev => prev ? { ...prev, categoria: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Freios">Freios</option>
                      <option value="Suspensão">Suspensão</option>
                      <option value="Motor">Motor</option>
                      <option value="Elétrica">Elétrica</option>
                      <option value="Carroceria">Carroceria</option>
                      <option value="Iluminação">Iluminação</option>
                      <option value="Autopeças">Autopeças</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={produtoEdicao.status}
                      onChange={(e) => setProdutoEdicao(prev => prev ? { ...prev, status: e.target.value as 'ativo' | 'inativo' | 'esgotado' } : null)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="esgotado">Esgotado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <input
                      type="text"
                      value={produtoEdicao.marca}
                      onChange={(e) => setProdutoEdicao(prev => prev ? { ...prev, marca: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                    <input
                      type="text"
                      value={produtoEdicao.modelo_veiculo}
                      onChange={(e) => setProdutoEdicao(prev => prev ? { ...prev, modelo_veiculo: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={produtoEdicao.descricao || ''}
                  onChange={(e) => setProdutoEdicao(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSalvarEdicao}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Salvar Alterações
                </button>
                <button
                  onClick={() => setShowEditarProduto(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </LayoutGestor>
    </ProtectedRoute>
  );
} 