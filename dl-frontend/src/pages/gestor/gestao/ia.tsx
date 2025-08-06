import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutGestor from "@/components/layout/LayoutGestor";
import { IAAnalysis, IARecommendation, iaService } from "@/services/iaService";
import { Activity, AlertCircle, BarChart3, Brain, Lightbulb, RefreshCw, Target, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function IADashboard() {
  const [analysis, setAnalysis] = useState<IAAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [iaStatus, setIaStatus] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadIAData();
  }, []);

  const loadIAData = async () => {
    setLoading(true);
    try {
      // Verificar status da IA
      const status = await iaService.getStatus();
      setIaStatus(status);

      // Carregar análise inteligente
      const dadosMock = {
        vendas: [
          { categoria: "Suspensão", valor: 15000 },
          { categoria: "Freios", valor: 12000 },
          { categoria: "Motor", valor: 8000 }
        ],
        produtos: 150,
        clientes: 45
      };

      const analise = await iaService.analisarDados(dadosMock, "Janeiro 2025");
      setAnalysis(analise);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar dados da IA:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarRecomendacao = async (recomendacao: IARecommendation) => {
    try {
      console.log('Aplicando recomendação:', recomendacao.title);
      // Aqui seria implementada a lógica para aplicar a recomendação
      alert(`Recomendação aplicada: ${recomendacao.title}`);
    } catch (error) {
      console.error('Erro ao aplicar recomendação:', error);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'alto': return 'text-red-600';
      case 'medio': return 'text-yellow-600';
      case 'baixo': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <LayoutGestor>
          <div className="w-full max-w-7xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-4">
                <Brain className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">IA Dashboard</h1>
                  <p className="text-purple-100 opacity-90">Carregando insights inteligentes...</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
                <span className="ml-3 text-gray-600">Conectando com a IA...</span>
              </div>
            </div>
          </div>
        </LayoutGestor>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Brain className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">IA Dashboard</h1>
                  <p className="text-purple-100 opacity-90">
                    Insights inteligentes para decisões estratégicas
                    {lastUpdate && (
                      <span className="block text-sm opacity-75">
                        Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={loadIAData}
                className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
            </div>
          </div>

          {/* Status da IA */}
          {iaStatus && (
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${iaStatus.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    Status da IA: {iaStatus.success ? 'Online' : 'Offline'}
                  </span>
                </div>
                {iaStatus.modules && (
                  <span className="text-sm text-gray-500">
                    {iaStatus.modules.length} módulos disponíveis
                  </span>
                )}
              </div>
            </div>
          )}

          {/* KPIs da IA */}
          {analysis && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold">+{analysis?.crescimento ?? 0}%</span>
                </div>
                <div className="space-y-1">
                  <div className="text-white text-sm font-medium">Previsão de Vendas</div>
                  <div className="text-white/80 text-xs">Próximos 30 dias</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold">
                    {Array.isArray(analysis?.produtosTop) && analysis.produtosTop.length > 0
                      ? analysis.produtosTop[0]
                      : "Nenhum produto em alta"}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-white text-sm font-medium">Produtos em Alta</div>
                  <div className="text-white/80 text-xs">Demanda crescendo</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <AlertCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold">5 itens</span>
                </div>
                <div className="space-y-1">
                  <div className="text-white text-sm font-medium">Estoque Crítico</div>
                  <div className="text-white/80 text-xs">Reposição sugerida</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold">312%</span>
                </div>
                <div className="space-y-1">
                  <div className="text-white text-sm font-medium">ROI Campanhas</div>
                  <div className="text-white/80 text-xs">Mercado Livre em alta</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recomendações da IA */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Recomendações Inteligentes
                {analysis && (
                  <span className="text-sm text-gray-500">
                    ({Array.isArray(analysis?.recomendacoes) ? analysis.recomendacoes.length : 0} sugestões)
                  </span>
                )}
              </h3>

              {analysis ? (
                Array.isArray(analysis?.recomendacoes) ? (
                  <div className="space-y-4">
                    {analysis.recomendacoes.map((rec, idx) => (
                      <div key={rec.id} className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${rec.type === "preco" ? "bg-blue-100 text-blue-800" :
                            rec.type === "estoque" ? "bg-green-100 text-green-800" :
                              rec.type === "marketing" ? "bg-purple-100 text-purple-800" :
                                "bg-orange-100 text-orange-800"
                            }`}>
                            {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                          </span>
                          <span className={`text-xs font-medium ${getImpactColor(rec.impact)}`}>
                            Impacto {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">{rec.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{rec.reason}</p>

                        {rec.estimatedValue && (
                          <div className="mb-3 p-2 bg-green-50 rounded-lg">
                            <span className="text-xs text-green-600 font-medium">
                              Valor estimado: {formatarMoeda(rec.estimatedValue)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Confiança:</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getConfidenceColor(rec.confidence)}`}
                                style={{ width: `${rec.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{rec.confidence}%</span>
                          </div>
                          <button
                            onClick={() => aplicarRecomendacao(rec)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                          >
                            Aplicar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma recomendação encontrada.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Carregando recomendações...</p>
                </div>
              )}
            </div>

            {/* Insights da IA */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Insights Inteligentes
              </h3>

              {analysis ? (
                Array.isArray(analysis?.insights) ? (
                  <div className="space-y-4">
                    {analysis.insights.map((insight, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${insight.type === "previsao" ? "bg-blue-100 text-blue-800" :
                            insight.type === "recomendacao" ? "bg-green-100 text-green-800" :
                              insight.type === "alerta" ? "bg-red-100 text-red-800" :
                                "bg-purple-100 text-purple-800"
                            }`}>
                            {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                          </span>
                          <span className={`text-xs font-medium ${getImpactColor(insight.impact)}`}>
                            Impacto {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">{insight.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{insight.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Confiança:</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getConfidenceColor(insight.confidence)}`}
                                style={{ width: `${insight.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{insight.confidence}%</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{insight.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum insight disponível.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Carregando insights...</p>
                </div>
              )}
            </div>
          </div>

          {/* Métricas da IA */}
          {analysis && (
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Métricas da IA</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{analysis?.vendas ?? 0}</div>
                  <div className="text-sm text-gray-600">Total de Vendas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+{analysis?.crescimento ?? 0}%</div>
                  <div className="text-sm text-gray-600">Crescimento</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis?.vendedorTop ?? "N/A"}</div>
                  <div className="text-sm text-gray-600">Vendedor Top</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 