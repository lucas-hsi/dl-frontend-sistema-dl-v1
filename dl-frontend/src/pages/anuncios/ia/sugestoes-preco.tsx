import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutAnuncios from "@/components/layout/LayoutAnuncios";
import { useAuth } from "@/contexts/AuthContext";
import { ProdutoSugestao, recomendacoesService } from "@/services/recomendacoesService";
import {
  AlertCircle,
  AlertTriangle,
  Brain,
  CheckCircle,
  DollarSign,
  Edit,
  Eye,
  RefreshCw,
  Search,
  Target
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SugestoesPrecoPagina() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgencia, setFilterUrgencia] = useState<'todas' | 'alta' | 'media' | 'baixa'>('todas');
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sugestoes, setSugestoes] = useState<ProdutoSugestao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    carregarRecomendacoes();
  }, []);

  const carregarRecomendacoes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recomendacoesService.obterRecomendacoesPreco(30);
      const sugestoesConvertidas = recomendacoesService.converterParaFormatoComponente(response);
      setSugestoes(sugestoesConvertidas);
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
      setError('Erro ao carregar recomendações de preço. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgenciaIcon = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return <AlertTriangle className="w-4 h-4" />;
      case 'media': return <Target className="w-4 h-4" />;
      case 'baixa': return <CheckCircle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const handleAnalyzeAll = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await recomendacoesService.analisarTodosProdutos();
      const sugestoesConvertidas = recomendacoesService.converterParaFormatoComponente(response);
      setSugestoes(sugestoesConvertidas);
    } catch (error) {
      console.error('Erro ao analisar produtos:', error);
      setError('Erro ao analisar produtos. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyPrice = async (produtoId: string, novoPreco: number) => {
    try {
      await recomendacoesService.aplicarRecomendacaoPreco(parseInt(produtoId), novoPreco);
      // Recarregar recomendações após aplicar
      await carregarRecomendacoes();
    } catch (error) {
      console.error('Erro ao aplicar preço:', error);
      setError('Erro ao aplicar preço. Tente novamente.');
    }
  };

  const filteredSugestoes = sugestoes.filter(sugestao => {
    const matchesSearch = sugestao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sugestao.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgencia = filterUrgencia === 'todas' || sugestao.urgencia === filterUrgencia;
    const matchesCategoria = filterCategoria === 'todas' || sugestao.categoria === filterCategoria;

    return matchesSearch && matchesUrgencia && matchesCategoria;
  });

  const categorias = Array.from(new Set(sugestoes.map(s => s.categoria)));
  const totalSugestoes = sugestoes.length;
  const sugestoesAlta = sugestoes.filter(s => s.urgencia === 'alta').length;
  const sugestoesMedia = sugestoes.filter(s => s.urgencia === 'media').length;
  const sugestoesBaixa = sugestoes.filter(s => s.urgencia === 'baixa').length;

  if (!mounted) return null;

  return (
    <ProtectedRoute>
      <LayoutAnuncios>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Header Premium */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Sugestões de Preço</h1>
                  <p className="text-blue-100">IA analisa mercado e sugere ajustes de preço</p>
                </div>
              </div>

              {/* Métricas */}
              <div className="flex space-x-6">
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-1" />
                  <div className="text-white font-semibold">{totalSugestoes}</div>
                  <div className="text-blue-100 text-sm">Sugestões</div>
                </div>
                <div className="text-center">
                  <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                  <div className="text-white font-semibold">{sugestoesAlta}</div>
                  <div className="text-blue-100 text-sm">Alta Urgência</div>
                </div>
                <div className="text-center">
                  <Target className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <div className="text-white font-semibold">{sugestoesMedia}</div>
                  <div className="text-blue-100 text-sm">Média Urgência</div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto space-y-8">
            {/* Controles */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Busca */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filtros */}
                  <div className="flex gap-2">
                    <select
                      value={filterUrgencia}
                      onChange={(e) => setFilterUrgencia(e.target.value as any)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="todas">Todas Urgências</option>
                      <option value="alta">Alta Urgência</option>
                      <option value="media">Média Urgência</option>
                      <option value="baixa">Baixa Urgência</option>
                    </select>

                    <select
                      value={filterCategoria}
                      onChange={(e) => setFilterCategoria(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="todas">Todas Categorias</option>
                      {categorias.map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2">
                  <button
                    onClick={carregarRecomendacoes}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Carregando...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        <span>Atualizar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleAnalyzeAll}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Analisando...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        <span>Analisar Todos</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}
            </div>

            {/* Lista de Sugestões */}
            <div className="space-y-4">
              {filteredSugestoes.map((sugestao, index) => (
                <div
                  key={sugestao.id}
                  className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Informações do Produto */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {sugestao.nome}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              {sugestao.categoria}
                            </span>
                            <span className={`px-3 py-1 rounded-full border ${getUrgenciaColor(sugestao.urgencia)}`}>
                              {getUrgenciaIcon(sugestao.urgencia)}
                              <span className="ml-1 capitalize">{sugestao.urgencia}</span>
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800">
                            {sugestao.confianca_ia}%
                          </div>
                          <div className="text-sm text-gray-600">Confiança IA</div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">
                        {sugestao.motivo_sugestao}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Volume de Vendas:</span>
                          <div className="font-semibold">{sugestao.volume_vendas}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Último Ajuste:</span>
                          <div className="font-semibold">{sugestao.ultimo_ajuste}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Canal Referência:</span>
                          <div className="font-semibold">{sugestao.canal_referencia}</div>
                        </div>
                      </div>
                    </div>

                    {/* Preços */}
                    <div className="lg:w-80">
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Preço Atual:</span>
                          <span className="font-semibold text-gray-800">
                            R$ {sugestao.preco_atual.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Preço Mercado:</span>
                          <span className="font-semibold text-gray-800">
                            R$ {sugestao.preco_mercado.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Preço Sugerido:</span>
                          <span className="font-semibold text-blue-600">
                            R$ {sugestao.preco_sugerido.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Diferença:</span>
                          <span className={`font-semibold ${sugestao.diferenca_percentual > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}>
                            {sugestao.diferenca_percentual > 0 ? '+' : ''}
                            {sugestao.diferenca_percentual.toFixed(1)}%
                          </span>
                        </div>

                        <button
                          onClick={() => handleApplyPrice(sugestao.id, sugestao.preco_sugerido)}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                          data-qa="vendas-AplicarPreco"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Aplicar Preço</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredSugestoes.length === 0 && !isLoading && (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Nenhuma sugestão encontrada
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || filterUrgencia !== 'todas' || filterCategoria !== 'todas'
                      ? 'Tente ajustar os filtros de busca'
                      : 'Não há produtos que precisem de ajuste de preço no momento'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </LayoutAnuncios>
    </ProtectedRoute>
  );
} 