import { api } from '@/config/api';
import { configuracaoService } from '@/services/configuracaoService';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  MessageSquare,
  Package,
  RefreshCw,
  ShoppingCart,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import LayoutGestor from '../../components/layout/LayoutGestor';

// --- CORREÇÃO DE TIPAGEM ---
// Definimos um tipo explícito para as mensagens do chat,
// permitindo que 'type' seja 'ai' ou 'user'. Isso resolve os erros de TypeScript.
type ChatMessage = {
  id: number;
  type: 'ai' | 'user';
  message: string;
  timestamp: string;
};

export default function DashboardGestorPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessage, setChatMessage] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('vendas');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    faturamento: 0,
    produtos: 0,
    clientes: 0,
    vendasHoje: 0,
    taxaConversao: 0,
    satisfacaoCliente: 0,
    eficienciaIA: 0
  });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [barData, setBarData] = useState([]);
  
  // Usamos o novo tipo ChatMessage para o estado do histórico do chat.
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 1, type: 'ai', message: 'Olá! Sou sua IA assistente. Como posso ajudar hoje?', timestamp: '09:30' }
  ]);

  // Carregar dados reais do dashboard
  const carregarDadosDashboard = async () => {
    try {
      setLoading(true);

      // --- CORREÇÃO DO ENDEREÇO DA API ---
      // O endereço foi ajustado para corresponder EXATAMENTE à rota do backend.
      const [metricas, estatisticas, produtos] = await Promise.all([
        api.get('/dashboard/metricas'),
        api.get('/dashboard/estatisticas'),
        api.get('/produtos-estoque/estatisticas') // Corrigido: /produtos/estoque -> /produtos-estoque
      ]);

      setDashboardData({
        faturamento: metricas.data.faturamento || 0,
        produtos: produtos.data.total_produtos || 0,
        clientes: metricas.data.total_clientes || 0,
        vendasHoje: metricas.data.vendas_hoje || 0,
        taxaConversao: metricas.data.taxa_conversao || 0,
        satisfacaoCliente: metricas.data.satisfacao_cliente || 0,
        eficienciaIA: metricas.data.eficiencia_ia || 0
      });

      // Carregar dados dos gráficos
      setChartData(estatisticas.data.evolucao_semanal || []);
      setPieData(estatisticas.data.distribuicao_canais || []);
      setBarData(estatisticas.data.performance_produtos || []);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Ativar modo turbo (otimização de performance)
  const ativarModoTurbo = async () => {
    try {
      setLoading(true);
      await configuracaoService.ativarModoTurbo();
      toast.success('Modo Turbo ativado! Performance otimizada.');
    } catch (error) {
      console.error('Erro ao ativar modo turbo:', error);
      toast.error('Erro ao ativar modo turbo');
    } finally {
      setLoading(false);
    }
  };

  // Definir meta de vendas
  const definirMeta = async () => {
    try {
      const meta = prompt('Digite a meta de vendas (R$):');
      if (!meta) return;

      setLoading(true);
      await configuracaoService.definirMetaVendas(parseFloat(meta));
      toast.success('Meta definida com sucesso!');
      await carregarDadosDashboard(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao definir meta:', error);
      toast.error('Erro ao definir meta');
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensagem para IA
  const sendMessage = async () => {
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: chatHistory.length + 1,
      type: 'user',
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([...chatHistory, newMessage]);
    setChatMessage('');

    try {
      // Chamada real para IA
      const response = await api.post('/ia/chat', {
        message: chatMessage,
        context: 'dashboard_gestor'
      });

      const aiResponse: ChatMessage = {
        id: chatHistory.length + 2,
        type: 'ai',
        message: response.data.response,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem para IA:', error);
      toast.error('Erro ao processar mensagem');
    }
  };

  // Analisar preços de produtos
  const analisarPrecos = async (produtoId?: number) => {
    try {
      setLoading(true);
      const response = await api.post('/ia/analisar-precos', {
        produto_id: produtoId,
        contexto: 'dashboard'
      });

      toast.success('Análise de preços concluída!');
      await carregarDadosDashboard();
    } catch (error) {
      console.error('Erro ao analisar preços:', error);
      toast.error('Erro ao analisar preços');
    } finally {
      setLoading(false);
    }
  };

  // Verificar dificuldades do vendedor
  const verificarDificuldades = async (vendedorId: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/vendedores/${vendedorId}/performance`);

      toast.success('Análise de performance concluída!');
      // Aqui você pode abrir um modal com os detalhes
    } catch (error) {
      console.error('Erro ao verificar dificuldades:', error);
      toast.error('Erro ao analisar performance');
    } finally {
      setLoading(false);
    }
  };

  // Revisar estratégia de produtos parados
  const revisarEstrategia = async () => {
    try {
      setLoading(true);
      const response = await api.post('/ia/revisar-estrategia', {
        tipo: 'produtos_parados'
      });

      toast.success('Estratégia revisada!');
      await carregarDadosDashboard();
    } catch (error) {
      console.error('Erro ao revisar estratégia:', error);
      toast.error('Erro ao revisar estratégia');
    } finally {
      setLoading(false);
    }
  };

  // Revisar preços sugeridos pela IA
  const revisarPrecos = async () => {
    try {
      setLoading(true);
      const response = await api.post('/ia/revisar-precos', {
        aplicar_sugestoes: false
      });

      toast.success('Preços revisados!');
      await carregarDadosDashboard();
    } catch (error) {
      console.error('Erro ao revisar preços:', error);
      toast.error('Erro ao revisar preços');
    } finally {
      setLoading(false);
    }
  };

  // Atender novo lead
  const atenderLead = async (leadId: number) => {
    try {
      setLoading(true);
      const response = await api.post(`/leads/${leadId}/atender`);

      toast.success('Lead atendido com sucesso!');
      await carregarDadosDashboard();
    } catch (error) {
      console.error('Erro ao atender lead:', error);
      toast.error('Erro ao atender lead');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na montagem do componente
  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai', label: 'IA Inteligente', icon: Brain },
    { id: 'alerts', label: 'Alertas', icon: AlertTriangle }
  ];

  const periods = [
    { id: '7d', label: '7 dias', icon: Calendar },
    { id: '30d', label: '30 dias', icon: Calendar },
    { id: '90d', label: '90 dias', icon: Calendar },
  ];

  const metrics = [
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'faturamento', label: 'Faturamento', icon: DollarSign },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'conversao', label: 'Conversão', icon: TrendingUp },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <LayoutGestor>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        {/* Header Premium */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                🧠 Dashboard Premium
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white">IA Ativa</span>
                </div>
              </h1>
              <p className="text-blue-100 text-lg">
                Centro de controle inteligente da DL Auto Peças
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={carregarDadosDashboard}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                data-qa="gestor-RefreshCards"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Atualizando...' : 'Atualizar'}
              </button>

              <button
                onClick={ativarModoTurbo}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
              >
                <Zap className="w-5 h-5" />
                {loading ? 'Ativando...' : 'Modo Turbo'}
              </button>

              <button
                onClick={definirMeta}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
              >
                <Target className="w-5 h-5" />
                {loading ? 'Definindo...' : 'Definir Meta'}
              </button>
            </div>
          </div>

          {/* Métricas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Faturamento</p>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : `R$ ${dashboardData.faturamento.toLocaleString('pt-BR')}`}
                  </p>
                  <p className="text-xs text-green-300 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12.5%
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Produtos</p>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : dashboardData.produtos.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-blue-300 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +8.2%
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Clientes</p>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : dashboardData.clientes.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-purple-300 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +15.3%
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Vendas Hoje</p>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : dashboardData.vendasHoje}
                  </p>
                  <p className="text-xs text-orange-300 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +22.1%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Gráfico Interativo com Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Análise Comparativa
              </h2>
              <p className="text-gray-600">Visualize tendências e compare métricas em tempo real</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Filtro de Período */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                {periods.map((period) => {
                  const Icon = period.icon;
                  return (
                    <button
                      key={period.id}
                      onClick={() => setSelectedPeriod(period.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${selectedPeriod === period.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {period.label}
                    </button>
                  );
                })}
              </div>

              {/* Filtro de Métrica */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <button
                      key={metric.id}
                      onClick={() => setSelectedMetric(metric.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${selectedMetric === metric.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {metric.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gráfico de Linha Principal */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolução Semanal</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversao"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Pizza - Canais */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição por Canal</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Barras - Produtos */}
          <div className="mt-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance por Produto</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="produto" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="margem" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sistema de Abas */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-2xl p-1 shadow-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 font-medium ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Sugestões da IA */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  Sugestões da IA
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <Star className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Capô Golf tem maior margem
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Produto com 35% de margem este mês. Recomendo aumentar estoque.
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 text-sm font-medium">+35% margem</span>
                          <button
                            onClick={() => analisarPrecos(1)}
                            disabled={loading}
                            className="text-purple-600 text-sm font-medium hover:text-purple-700 disabled:opacity-50"
                          >
                            {loading ? 'Analisando...' : 'Analisar preços →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Carlos Lima abaixo da meta
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          2 semanas consecutivas abaixo do esperado
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 text-sm font-medium">-18% performance</span>
                          <button
                            onClick={() => verificarDificuldades(1)}
                            disabled={loading}
                            className="text-blue-600 text-sm font-medium hover:text-blue-700 disabled:opacity-50"
                          >
                            {loading ? 'Verificando...' : 'Verificar dificuldades →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Gráfico de Performance */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Performance em Tempo Real
                </h2>

                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {loading ? '...' : `${dashboardData.taxaConversao}%`}
                      </div>
                      <div className="text-sm text-gray-600">Taxa de Conversão</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${dashboardData.taxaConversao}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {loading ? '...' : `${dashboardData.satisfacaoCliente}%`}
                      </div>
                      <div className="text-sm text-gray-600">Satisfação Cliente</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${dashboardData.satisfacaoCliente}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {loading ? '...' : `${dashboardData.eficienciaIA}%`}
                      </div>
                      <div className="text-sm text-gray-600">Eficiência IA</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${dashboardData.eficienciaIA}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Análise de Vendas */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Análise de Vendas</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Mercado Livre</span>
                      <span className="font-bold text-green-600">+45%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Vendas Diretas</span>
                      <span className="font-bold text-blue-600">+28%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">WhatsApp</span>
                      <span className="font-bold text-purple-600">+62%</span>
                    </div>
                  </div>
                </div>

                {/* Produtos Top */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Produtos Top</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Capô Golf</span>
                      <span className="font-bold text-green-600">R$ 12.500</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Parachoque Civic</span>
                      <span className="font-bold text-blue-600">R$ 8.900</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Farol Corolla</span>
                      <span className="font-bold text-purple-600">R$ 6.200</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Chat com IA */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Brain className="w-6 h-6" />
                    Chat Inteligente
                  </h3>
                  <p className="text-blue-100 text-sm">Pergunte qualquer coisa sobre seus dados</p>
                </div>

                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {chatHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Digite sua pergunta..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Alertas Inteligentes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-orange-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Produtos parados
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        15 produtos sem movimento há 30 dias
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600 text-sm font-medium">Prioridade Alta</span>
                        <button
                          onClick={revisarEstrategia}
                          disabled={loading}
                          className="text-blue-600 text-sm font-medium hover:text-blue-700 disabled:opacity-50"
                        >
                          {loading ? 'Revisando...' : 'Revisar estratégia →'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-yellow-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        IA recomenda mudança de preço
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Análise sugere ajuste em 8 produtos
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-600 text-sm font-medium">Prioridade Média</span>
                        <button
                          onClick={revisarPrecos}
                          disabled={loading}
                          className="text-blue-600 text-sm font-medium hover:text-blue-700 disabled:opacity-50"
                        >
                          {loading ? 'Revisando...' : 'Revisar preços →'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-green-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Meta mensal atingida
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Faturamento 15% acima do esperado
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm font-medium">Sucesso</span>
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                          Ver detalhes →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-blue-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Novo lead qualificado
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Cliente interessado em peças Golf
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-sm font-medium">Oportunidade</span>
                        <button
                          onClick={() => atenderLead(1)}
                          disabled={loading}
                          className="text-blue-600 text-sm font-medium hover:text-blue-700 disabled:opacity-50"
                        >
                          {loading ? 'Atendendo...' : 'Atender →'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGestor>
  );
}
