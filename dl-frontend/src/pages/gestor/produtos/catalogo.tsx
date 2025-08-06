import React, { useState, useEffect } from "react";
import { Package, Search, Filter, Plus, Edit, Trash2, Eye, RefreshCw, Download, Upload } from "lucide-react";
import LayoutGestor from "@/components/layout/LayoutGestor";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from 'react-hot-toast';
import { api } from '@/config/api';
import { EstoqueService } from '@/services/estoqueService';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  status: string;
  sku?: string;
  descricao?: string;
  marca?: string;
  imagem?: string;
  criado_em: string;
  atualizado_em: string;
}

export default function CatalogoProdutos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  const [showNovoProduto, setShowNovoProduto] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    categoria: "",
    preco: 0,
    estoque: 0,
    sku: "",
    descricao: "",
    marca: ""
  });

  const categorias = ["todos", "Freios", "Filtros", "Suspensão", "Motor", "Elétrica", "Carroceria", "Acessórios"];

  // Carregar produtos reais
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produtos/estoque');
      setProdutos(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo produto
  const handleCriarProduto = async () => {
    try {
      setLoadingActions(prev => ({ ...prev, criarProduto: true }));
      
      const response = await api.post('/produtos/estoque', novoProduto);
      
      toast.success('Produto criado com sucesso!');
      setShowNovoProduto(false);
      setNovoProduto({
        nome: "",
        categoria: "",
        preco: 0,
        estoque: 0,
        sku: "",
        descricao: "",
        marca: ""
      });
      await carregarProdutos();
      
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast.error('Erro ao criar produto');
    } finally {
      setLoadingActions(prev => ({ ...prev, criarProduto: false }));
    }
  };

  // Editar produto
  const handleEditarProduto = async (produtoId: number, dados: Partial<Produto>) => {
    try {
      setLoadingActions(prev => ({ ...prev, [`editar_${produtoId}`]: true }));
      
      await api.put(`/produtos/estoque/${produtoId}`, dados);
      
      toast.success('Produto atualizado com sucesso!');
      await carregarProdutos();
      
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      toast.error('Erro ao editar produto');
    } finally {
      setLoadingActions(prev => ({ ...prev, [`editar_${produtoId}`]: false }));
    }
  };

  // Deletar produto
  const handleDeletarProduto = async (produtoId: number) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
      setLoadingActions(prev => ({ ...prev, [`deletar_${produtoId}`]: true }));
      
      await api.delete(`/produtos/estoque/${produtoId}`);
      
      toast.success('Produto removido com sucesso!');
      await carregarProdutos();
      
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      toast.error('Erro ao remover produto');
    } finally {
      setLoadingActions(prev => ({ ...prev, [`deletar_${produtoId}`]: false }));
    }
  };

  // Importar produtos do ML
  const handleImportarML = async () => {
    try {
      setLoadingActions(prev => ({ ...prev, importarML: true }));
      
      const response = await api.post('/produtos/estoque/importar-ml');
      
      toast.success('Importação iniciada! Produtos serão carregados em breve.');
      await carregarProdutos();
      
    } catch (error) {
      console.error('Erro ao importar produtos:', error);
      toast.error('Erro ao importar produtos');
    } finally {
      setLoadingActions(prev => ({ ...prev, importarML: false }));
    }
  };

  // Exportar catálogo
  const handleExportarCatalogo = async () => {
    try {
      setLoadingActions(prev => ({ ...prev, exportar: true }));
      
      const response = await api.get('/produtos/estoque/exportar', {
        responseType: 'blob'
      });
      
      // Criar download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'catalogo-produtos.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Catálogo exportado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao exportar catálogo:', error);
      toast.error('Erro ao exportar catálogo');
    } finally {
      setLoadingActions(prev => ({ ...prev, exportar: false }));
    }
  };

  // Atualizar estoque
  const handleAtualizarEstoque = async (produtoId: number, novaQuantidade: number) => {
    try {
      setLoadingActions(prev => ({ ...prev, [`estoque_${produtoId}`]: true }));
      
      await api.put(`/produtos/estoque/${produtoId}/quantidade`, {
        quantidade: novaQuantidade
      });
      
      toast.success('Estoque atualizado com sucesso!');
      await carregarProdutos();
      
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      toast.error('Erro ao atualizar estoque');
    } finally {
      setLoadingActions(prev => ({ ...prev, [`estoque_${produtoId}`]: false }));
    }
  };

  // Visualizar produto
  const handleVisualizarProduto = async (produtoId: number) => {
    try {
      setLoadingActions(prev => ({ ...prev, [`visualizar_${produtoId}`]: true }));
      
      const response = await api.get(`/produtos/estoque/${produtoId}`);
      
      // Aqui você pode abrir um modal com os detalhes do produto
      console.log('Detalhes do produto:', response.data);
      
    } catch (error) {
      console.error('Erro ao visualizar produto:', error);
      toast.error('Erro ao carregar detalhes do produto');
    } finally {
      setLoadingActions(prev => ({ ...prev, [`visualizar_${produtoId}`]: false }));
    }
  };

  // Carregar produtos na montagem do componente
  useEffect(() => {
    carregarProdutos();
  }, []);

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || produto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800";
      case "Baixo Estoque": return "bg-yellow-100 text-yellow-800";
      case "Crítico": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Package className="w-12 h-12" />
                <div>
                  <h1 className="text-3xl font-bold mb-2">Catálogo de Produtos</h1>
                  <p className="text-green-100 opacity-90">Gerencie todo o seu estoque</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleImportarML}
                  disabled={loadingActions.importarML}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-medium transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Upload className="w-5 h-5" />
                  {loadingActions.importarML ? 'Importando...' : 'Importar ML'}
                </button>

                <button
                  onClick={handleExportarCatalogo}
                  disabled={loadingActions.exportar}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-medium transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  {loadingActions.exportar ? 'Exportando...' : 'Exportar'}
                </button>

                <button
                  onClick={() => setShowNovoProduto(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-medium transition-all shadow-lg flex items-center gap-2"
                  data-qa="produtos-Criar"
                >
                  <Plus className="w-5 h-5" />
                  Novo Produto
                </button>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              
              {/* Filtro por categoria */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white min-w-[200px]"
                >
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>
                      {categoria === "todos" ? "Todas as categorias" : categoria}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão de atualizar */}
              <button
                onClick={carregarProdutos}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                data-qa="produtos-Buscar"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Carregando...' : 'Atualizar'}
              </button>
            </div>
          </div>

          {/* Tabela de Produtos */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Produto</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Categoria</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Preço</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estoque</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProdutos.map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {produto.imagem && (
                            <img
                              src={produto.imagem}
                              alt={produto.nome}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{produto.nome}</div>
                            {produto.sku && (
                              <div className="text-sm text-gray-500">SKU: {produto.sku}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{produto.categoria}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        R$ {produto.preco.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{produto.estoque}</span>
                          <input
                            type="number"
                            defaultValue={produto.estoque}
                            onBlur={(e) => handleAtualizarEstoque(produto.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={loadingActions[`estoque_${produto.id}`]}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(produto.status)}`}>
                          {produto.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVisualizarProduto(produto.id)}
                            disabled={loadingActions[`visualizar_${produto.id}`]}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleEditarProduto(produto.id, {})}
                            disabled={loadingActions[`editar_${produto.id}`]}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Editar"
                            data-qa="produtos-Salvar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeletarProduto(produto.id)}
                            disabled={loadingActions[`deletar_${produto.id}`]}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Deletar"
                            data-qa="produtos-Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Novo Produto */}
          {showNovoProduto && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Novo Produto</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                    <input
                      type="text"
                      value={novoProduto.nome}
                      onChange={(e) => setNovoProduto(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Pastilha de Freio"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      value={novoProduto.categoria}
                      onChange={(e) => setNovoProduto(prev => ({ ...prev, categoria: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.filter(cat => cat !== 'todos').map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={novoProduto.preco}
                      onChange={(e) => setNovoProduto(prev => ({ ...prev, preco: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Inicial</label>
                    <input
                      type="number"
                      value={novoProduto.estoque}
                      onChange={(e) => setNovoProduto(prev => ({ ...prev, estoque: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      value={novoProduto.sku}
                      onChange={(e) => setNovoProduto(prev => ({ ...prev, sku: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Código do produto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <input
                      type="text"
                      value={novoProduto.marca}
                      onChange={(e) => setNovoProduto(prev => ({ ...prev, marca: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Bosch"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                      value={novoProduto.descricao}
                      onChange={(e) => setNovoProduto(prev => ({ ...prev, descricao: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                      placeholder="Descrição do produto"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={handleCriarProduto}
                    disabled={loadingActions.criarProduto}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loadingActions.criarProduto ? 'Criando...' : 'Criar Produto'}
                  </button>
                  <button
                    onClick={() => setShowNovoProduto(false)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 