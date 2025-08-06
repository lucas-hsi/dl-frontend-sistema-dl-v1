import LayoutAnuncios from "@/components/layout/LayoutAnuncios";
import { useAuth } from "@/contexts/AuthContext";
import { iaService } from "@/services/iaService";
import { Loading, CardSkeleton } from "@/components/ui/loading";
import { ErrorState, NetworkErrorState } from "@/components/ui/error-state";
import { useLoadingState } from "@/hooks/useSubmitLock";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart,
  BarChart3,
  Bot,
  Brain,
  CheckCircle,
  Clock,
  Database,
  DollarSign,
  Globe,
  Image as ImageIcon,
  Lightbulb,
  Package,
  Plus,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AnunciosDashboard() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [key: string]: { type: 'success' | 'error', text: string } }>({});
  const [iaStatus, setIaStatus] = useState<any>(null);
  const [iaInsights, setIaInsights] = useState<any[]>([]);
  
  // Usar o novo hook de loading state
  const { loading: loadingIA, error: iaError, executeWithRetry, retry } = useLoadingState();

  // Dados para gráfico de postagens
  const dadosPostagens = [
    { dia: 'Seg', postagens: 12, ia: 8 },
    { dia: 'Ter', postagens: 18, ia: 12 },
    { dia: 'Qua', postagens: 15, ia: 10 },
    { dia: 'Qui', postagens: 22, ia: 16 },
    { dia: 'Sex', postagens: 25, ia: 18 },
    { dia: 'Sáb', postagens: 8, ia: 5 },
    { dia: 'Dom', postagens: 5, ia: 3 },
  ];

  // Dados para gráfico de barras - performance por canal
  const dadosPerformance = [
    { canal: 'Mercado Livre', vendas: 28500, crescimento: 15, produtos: 847 },
    { canal: 'Shopify', vendas: 12300, crescimento: 28, produtos: 234 },
    { canal: 'Site Próprio', vendas: 8900, crescimento: 8, produtos: 166 },
  ];

  useEffect(() => {
    setMounted(true);
    // NEUTRALIZE AS CHAMADAS DE API AQUI
    // loadIAStatus();

    // Capturar informações do localStorage para debug
    if (typeof window !== 'undefined') {
      const debug = {
        perfil_autenticado: localStorage.getItem('perfil_autenticado'),
        user_data: localStorage.getItem('user'),
        auth_token: localStorage.getItem('auth_token'),
        url: window.location.href,
      };
      setDebugInfo(debug);
      console.log('🔍 Debug Info Anúncios:', debug);
    }
    
    console.log("Busca de dados do dashboard de anúncios desativada temporariamente para estabilização.");
  }, []);

  const loadIAStatus = async () => {
    // NEUTRALIZE AS CHAMADAS DE API AQUI
    console.log("Função loadIAStatus desativada temporariamente para estabilização.");
    
    // Simular dados mock para evitar erros
    setIaStatus({ success: false, message: "IA desativada para estabilização" });
    setIaInsights([]);
    
    // await executeWithRetry(async () => {
    //   const status = await iaService.getStatus();
    //   setIaStatus(status);

    //   if (status.success) {
    //     // Carregar insights da IA para anúncios
    //     const dadosMock = {
    //       anuncios: [
    //         { titulo: "Amortecedor Honda Civic", performance: 85 },
    //         { titulo: "Pastilha de Freio Bosch", performance: 92 },
    //         { titulo: "Filtro de Ar Mahle", performance: 78 }
    //       ],
    //       produtos: 1247,
    //       canais: 3
    //     };

    //     const analise = await iaService.analisarDados(dadosMock, "Janeiro 2025");

    //     // ✅ CORREÇÃO: Garantir que insights seja sempre um array antes de filtrar
    //     const insightsArray = Array.isArray(analise?.insights) ? analise.insights : [];

    //     // Filtrar insights relevantes para anúncios
    //     const insightsAnuncios = insightsArray.filter(insight =>
    //       insight.type === 'recomendacao' || insight.type === 'alerta'
    //     );

    //     setIaInsights(insightsAnuncios.slice(0, 4));
    //   }
    // });
  };

  // Função para mostrar mensagens
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

  // Função para gerenciar loading
  const setActionLoading = (action: string, loading: boolean) => {
    setLoadingActions(prev => ({ ...prev, [action]: loading }));
  };

  // Criar anúncio com IA
  const handleCriarAnuncioIA = async () => {
    try {
      setActionLoading('criar_anuncio', true);

      // Verificar se a IA está disponível
      if (!iaStatus?.success) {
        showMessage('criar_anuncio', 'error', 'IA não disponível. Tente novamente.');
        return;
      }

      // Redirecionar para página de criação
      window.location.href = '/anuncios/ia/criar-anuncio';
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      showMessage('criar_anuncio', 'error', 'Erro ao criar anúncio');
    } finally {
      setActionLoading('criar_anuncio', false);
    }
  };

  // Otimizar anúncios com IA
  const handleOtimizarAnuncios = async () => {
    try {
      setActionLoading('otimizar_anuncios', true);

      if (!iaStatus?.success) {
        showMessage('otimizar_anuncios', 'error', 'IA não disponível para otimização');
        return;
      }

      // Simular otimização de anúncios
      await new Promise(resolve => setTimeout(resolve, 2000));
      showMessage('otimizar_anuncios', 'success', '15 anúncios otimizados com sucesso!');
    } catch (error) {
      console.error('Erro na otimização:', error);
      showMessage('otimizar_anuncios', 'error', 'Erro na otimização de anúncios');
    } finally {
      setActionLoading('otimizar_anuncios', false);
    }
  };

  // Banco de Imagens
  const handleBancoImagens = () => {
    window.location.href = '/anuncios/ferramentas/banco-imagens';
  };

  // Painel de Sugestões da IA
  const handlePainelSugestoes = () => {
    window.location.href = '/anuncios/ia/analise-concorrencia';
  };

  // Se não montou ainda, mostra loading
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  // Função para forçar login como equipe de anúncios (para debug)
  const forceAnunciosLogin = () => {
    const anunciosUser = {
      id: 3,
      nome: "Equipe Anúncios",
      username: "anuncios",
      email: "anuncios@dl.com",
      perfil: "anuncios"
    };

    localStorage.setItem('perfil_autenticado', 'anuncios');
    localStorage.setItem('user', JSON.stringify(anunciosUser));
    localStorage.setItem('auth_token', 'fake-token-anuncios');

    window.location.reload();
  };

  const kpis = [
    {
      icon: Package,
      title: "Produtos Ativos",
      value: "1.247",
      desc: "156 sincronizados hoje",
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-100",
      tendencia: "+12%",
      tendenciaCor: "text-green-400"
    },
    {
      icon: Bot,
      title: "Anúncios com IA",
      value: "89",
      desc: "+23% este mês",
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-100",
      tendencia: "+23%",
      tendenciaCor: "text-green-400"
    },
    {
      icon: ShoppingCart,
      title: "Canais Ativos",
      value: "3",
      desc: "ML, Shopify, Site",
      color: "from-green-500 to-green-600",
      textColor: "text-green-100",
      tendencia: "+0%",
      tendenciaCor: "text-gray-400"
    },
    {
      icon: TrendingUp,
      title: "Performance Geral",
      value: "+34%",
      desc: "ROI médio dos anúncios",
      color: "from-yellow-500 to-orange-600",
      textColor: "text-yellow-100",
      tendencia: "+8%",
      tendenciaCor: "text-green-400"
    },
  ];

  const insightsIA = [
    {
      icon: AlertTriangle,
      text: "15 produtos precisam de descrição otimizada",
      type: "warning",
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      timestamp: "2 min atrás",
      confianca: 85
    },
    {
      icon: Bot,
      text: "IA sugere +10% no preço de 8 produtos",
      type: "info",
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      timestamp: "5 min atrás",
      confianca: 92
    },
    {
      icon: CheckCircle,
      text: "23 imagens processadas com remoção de fundo",
      type: "success",
      color: "bg-green-500/20 text-green-300 border-green-500/30",
      timestamp: "8 min atrás",
      confianca: 100
    },
    {
      icon: Sparkles,
      text: "Novo modelo detectado: análise de concorrência disponível",
      type: "info",
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      timestamp: "12 min atrás",
      confianca: 78
    },
  ];

  const ultimasAtividades = [
    { icon: RefreshCw, titulo: "Sincronização ML", descricao: "156 produtos atualizados", tempo: "5 min atrás", status: "success" },
    { icon: Bot, titulo: "IA criou anúncio", descricao: "Pastilha de freio Civic 2020", tempo: "12 min atrás", status: "success" },
    { icon: ImageIcon, titulo: "Imagem processada", descricao: "Fundo removido - Amortecedor", tempo: "18 min atrás", status: "success" },
    { icon: DollarSign, titulo: "Preço atualizado", descricao: "5 produtos com nova precificação", tempo: "25 min atrás", status: "info" },
    { icon: Globe, titulo: "Publicado no Shopify", descricao: "Filtro de ar Honda Fit", tempo: "32 min atrás", status: "success" },
  ];

  const nomeUsuario = user?.nome || "Equipe Anúncios";

  return (
    <ProtectedRoute allowedRoles={['ANUNCIANTE', 'ANUNCIOS']}>
      <LayoutAnuncios>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Debug Card - só aparece se não há usuário logado ou perfil errado */}
          {(!user || user.perfil !== 'ANUNCIANTE') && (
            <div className="bg-yellow-500 text-white rounded-2xl p-4 mb-4">
              <h3 className="font-bold mb-2">🔍 DEBUG MODE - ANÚNCIOS</h3>
              <div className="text-sm space-y-1 mb-4">
                <p>• User: {user ? JSON.stringify(user) : 'null'}</p>
                <p>• Loading: {loading.toString()}</p>
                <p>• Perfil localStorage: {debugInfo.perfil_autenticado || 'null'}</p>
                <p>• User localStorage: {debugInfo.user_data || 'null'}</p>
              </div>
              <button
                onClick={forceAnunciosLogin}
                className="bg-white text-yellow-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
              >
                🚀 Forçar Login como Equipe Anúncios
              </button>
            </div>
          )}

          {/* Mensagens de feedback */}
          {Object.entries(messages).map(([action, message]) => (
            <div key={action} className={`rounded-xl p-4 ${message.type === 'success'
              ? 'bg-green-500/20 text-green-700 border border-green-500/30'
              : 'bg-red-500/20 text-red-700 border border-red-500/30'
              }`}>
              <p className="font-medium">{message.text}</p>
            </div>
          ))}

          {/* Mensagem de Boas-vindas */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Central de Anúncios & IA 🚀</h1>
                <p className="text-yellow-100 opacity-90">Gerenciamento inteligente de estoque e publicações</p>
                {iaStatus && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${iaStatus.success ? 'bg-green-300' : 'bg-red-300'}`}></div>
                    <span className="text-xs opacity-75">
                      IA: {iaStatus.success ? 'Online' : 'Offline'}
                    </span>
                  </div>
                )}
              </div>
              <div className="hidden md:block text-6xl opacity-20">🤖</div>
            </div>
          </div>

          {/* Cards de KPIs com Indicadores de Tendência */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => {
              const IconComponent = kpi.icon;
              return (
                <div key={idx} className={`bg-gradient-to-br ${kpi.color} rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer group`}>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <div className="text-right">
                      <span className="text-2xl font-bold">{kpi.value}</span>
                      <div className="flex items-center gap-1 mt-1">
                        {kpi.tendencia.startsWith('+') ? (
                          <ArrowUp className="w-3 h-3 text-green-300" />
                        ) : kpi.tendencia.startsWith('-') ? (
                          <ArrowDown className="w-3 h-3 text-red-300" />
                        ) : null}
                        <span className={`text-xs font-medium ${kpi.tendenciaCor}`}>
                          {kpi.tendencia}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className={`${kpi.textColor} text-sm font-medium`}>{kpi.title}</div>
                    <div className="text-white/80 text-xs">{kpi.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ações Rápidas Reorganizadas - Apenas 4 botões */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Ações Rápidas
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleCriarAnuncioIA}
                  disabled={loadingActions.criar_anuncio || !iaStatus?.success}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 px-4 font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-qa="anuncios-CriarAnuncio"
                >
                  {loadingActions.criar_anuncio ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {loadingActions.criar_anuncio ? 'Carregando...' : 'Criar Anúncio com IA'}
                </button>

                <button
                  onClick={handleBancoImagens}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl py-3 px-4 font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  Banco de Imagens
                </button>

                <button
                  onClick={handleOtimizarAnuncios}
                  disabled={loadingActions.otimizar_anuncios || !iaStatus?.success}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl py-3 px-4 font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-qa="anuncios-GerarIA"
                >
                  {loadingActions.otimizar_anuncios ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  {loadingActions.otimizar_anuncios ? 'Otimizando...' : 'Otimizar com IA'}
                </button>

                <button
                  onClick={handlePainelSugestoes}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl py-3 px-4 font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Painel de Sugestões da IA
                </button>
              </div>
            </div>

            {/* Gráfico de Postagens de Anúncios */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Postagens de Anúncios (Últimos 7 dias)
              </h3>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <svg className="w-full h-full p-4" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="postagensGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  {/* Linha de postagens totais */}
                  <path d="M 40 160 Q 80 140 120 120 T 200 90 T 280 70 T 360 50"
                    stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 40 160 Q 80 140 120 120 T 200 90 T 280 70 T 360 50 L 360 200 L 40 200 Z"
                    fill="url(#postagensGradient)" />

                  {/* Linha de postagens com IA */}
                  <path d="M 40 170 Q 80 150 120 130 T 200 100 T 280 80 T 360 60"
                    stroke="#8b5cf6" strokeWidth="3" fill="none" strokeLinecap="round" />

                  {/* Pontos de dados */}
                  <circle cx="80" cy="140" r="4" fill="#3b82f6" />
                  <circle cx="160" cy="90" r="4" fill="#3b82f6" />
                  <circle cx="240" cy="70" r="4" fill="#3b82f6" />
                  <circle cx="320" cy="50" r="4" fill="#3b82f6" />

                  <circle cx="80" cy="150" r="4" fill="#8b5cf6" />
                  <circle cx="160" cy="100" r="4" fill="#8b5cf6" />
                  <circle cx="240" cy="80" r="4" fill="#8b5cf6" />
                  <circle cx="320" cy="60" r="4" fill="#8b5cf6" />
                </svg>
                <div className="absolute bottom-4 left-4 text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs">Total</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-xs">Com IA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insights de IA Ativos */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Insights de IA Ativos
              </h3>

              {/* Estados de UI padronizados */}
              {loadingIA ? (
                <div className="space-y-3">
                  <CardSkeleton cards={3} />
                </div>
              ) : iaError ? (
                <ErrorState
                  title="Erro ao carregar insights"
                  message={iaError}
                  onRetry={retry}
                  retryText="Tentar Novamente"
                />
              ) : insightsIA.length > 0 ? (
                <div className="space-y-3">
                  {insightsIA.map((insight, idx) => (
                    <div key={idx} className={`border rounded-xl p-3 ${insight.color} hover:scale-105 transition-transform cursor-pointer`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <insight.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{insight.text}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-75">{insight.timestamp}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">Confiança:</span>
                              <div className="w-16 bg-white/20 rounded-full h-1">
                                <div
                                  className={`h-1 rounded-full ${insight.confianca >= 90 ? 'bg-green-400' :
                                    insight.confianca >= 70 ? 'bg-yellow-400' :
                                      'bg-red-400'
                                    }`}
                                  style={{ width: `${insight.confianca}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{insight.confianca}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Nenhum insight disponível
                  </p>
                </div>
              )}
            </div>

            {/* Performance por Canal - Gráfico de Barras */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-green-500" />
                Performance por Canal
              </h3>
              <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-4">
                <div className="flex items-end justify-between h-full gap-4">
                  {dadosPerformance.map((canal, idx) => {
                    const maxVendas = Math.max(...dadosPerformance.map(d => d.vendas));
                    const altura = (canal.vendas / maxVendas) * 100;
                    const cores = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];

                    return (
                      <div key={idx} className="flex flex-col items-center flex-1">
                        <div className="text-xs text-gray-600 mb-2 text-center">{canal.canal}</div>
                        <div className="relative flex-1 w-full flex items-end">
                          <div
                            className={`w-full ${cores[idx]} rounded-t-lg transition-all hover:scale-105`}
                            style={{ height: `${altura}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2 text-center">
                          R$ {(canal.vendas / 1000).toFixed(0)}k
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {dadosPerformance.map((canal, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                      <span className="text-sm font-medium">{canal.canal}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">R$ {canal.vendas.toLocaleString('pt-BR')}</div>
                      <div className={`text-xs ${canal.crescimento > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {canal.crescimento > 0 ? '+' : ''}{canal.crescimento}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Últimas Atividades */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              Últimas Atividades
            </h3>
            <div className="space-y-3">
              {ultimasAtividades.map((atividade, idx) => {
                const AtividadeIcon = atividade.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${atividade.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                      <AtividadeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm">{atividade.titulo}</h4>
                      <p className="text-gray-600 text-xs truncate">{atividade.descricao}</p>
                      <p className="text-gray-400 text-xs mt-1">{atividade.tempo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </LayoutAnuncios>
    </ProtectedRoute>
  );
} 