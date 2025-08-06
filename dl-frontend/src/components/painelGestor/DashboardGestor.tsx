import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, TrendingDown, DollarSign, Package, Users, 
  AlertTriangle, CheckCircle, Info, Filter, Search,
  MessageSquare, Brain, Target, Zap
} from "lucide-react";

// Cores para gráficos
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function DashboardGestor() {
  // Estados
  const [showIAChat, setShowIAChat] = useState(false);
  const [perguntaIA, setPerguntaIA] = useState("");
  const [loadingIA, setLoadingIA] = useState(false);

  // Dados mock para teste
  const metricas = {
    periodo: {
      inicio: "2025-07-01",
      fim: "2025-07-30",
      dias: 30
    },
    vendas: {
      total_vendas: 150,
      valor_total: 45000.00,
      ticket_medio: 300.00,
      crescimento_percentual: 12.5,
      vendas_por_canal: {
        "Shopify": { quantidade: 45, valor: 13500 },
        "Balcão": { quantidade: 80, valor: 24000 },
        "Mercado Livre": { quantidade: 25, valor: 7500 }
      },
      vendas_por_vendedor: {
        "Carlos Lima": { quantidade: 60, valor: 18000 },
        "Maria Silva": { quantidade: 45, valor: 13500 },
        "João Santos": { quantidade: 45, valor: 13500 }
      }
    },
    estoque: {
      total_produtos: 1250,
      produtos_ativos: 1180,
      valor_total_estoque: 125000.00,
      produtos_baixo_estoque: 15,
      categorias_principais: [
        { categoria: "Motor", quantidade: 300 },
        { categoria: "Freios", quantidade: 250 },
        { categoria: "Suspensão", quantidade: 200 }
      ]
    },
    clientes: {
      total_clientes: 850,
      clientes_ativos: 720,
      novos_clientes: 45,
      clientes_recorrentes: 675
    }
  };

  const sugestoes = [
    {
      tipo: "venda",
      titulo: "Capô Golf tem maior margem",
      descricao: "Produto com 35% de margem este mês",
      prioridade: "alta",
      acao: "Analisar preços similares",
      dados: { produto_id: 123, margem: 35 }
    },
    {
      tipo: "vendedor",
      titulo: "Carlos Lima abaixo da meta",
      descricao: "2 semanas consecutivas abaixo do esperado",
      prioridade: "media",
      acao: "Verificar dificuldades",
      dados: { vendedor_id: 1, semanas_abaixo: 2 }
    }
  ];

  const alertas = [
    {
      id: "1",
      tipo: "estoque",
      titulo: "Produtos parados",
      descricao: "15 produtos sem movimento há 30 dias",
      nivel: "medio",
      acao: "Revisar estratégia",
      dados: { produtos_parados: 15 },
      timestamp: "2025-01-27T10:00:00Z"
    },
    {
      id: "2",
      tipo: "preco",
      titulo: "IA recomenda mudança de preço",
      descricao: "Análise sugere ajuste em 8 produtos",
      nivel: "baixo",
      acao: "Revisar preços",
      dados: { produtos_afetados: 8 },
      timestamp: "2025-01-27T09:30:00Z"
    }
  ];

  // Preparar dados para gráficos
  const dadosVendasCanal = Object.entries(metricas.vendas.vendas_por_canal).map(([canal, dados]) => ({
    canal,
    vendas: dados.quantidade || 0,
    valor: dados.valor || 0
  }));

  const dadosEstoqueCategoria = metricas.estoque.categorias_principais.map((cat, index) => ({
    categoria: cat.categoria,
    quantidade: cat.quantidade,
    cor: COLORS[index % COLORS.length]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Header Premium */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🧠 Dashboard Premium
            </h1>
            <p className="text-blue-100 text-lg">
              Centro de controle inteligente da DL Auto Peças
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowIAChat(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200"
            >
              <Brain size={20} />
              Fale com a IA
            </button>
            
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200">
              <Filter size={20} />
              Filtrar
            </button>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <DollarSign size={24} />
              <div>
                <p className="text-sm opacity-80">Faturamento</p>
                <p className="text-2xl font-bold">
                  R$ {metricas.vendas.valor_total.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <Package size={24} />
              <div>
                <p className="text-sm opacity-80">Produtos</p>
                <p className="text-2xl font-bold">
                  {metricas.estoque.total_produtos.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <Users size={24} />
              <div>
                <p className="text-sm opacity-80">Clientes</p>
                <p className="text-2xl font-bold">
                  {metricas.clientes.total_clientes.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <TrendingUp size={24} />
              <div>
                <p className="text-sm opacity-80">Crescimento</p>
                <p className="text-2xl font-bold">
                  +{metricas.vendas.crescimento_percentual}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Sugestões da IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Brain className="text-purple-600" size={24} />
          Sugestões da IA
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sugestoes.map((sugestao, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain size={20} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {sugestao.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {sugestao.descricao}
                  </p>
                  <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                    {sugestao.acao} →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Vendas por Canal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendas por Canal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosVendasCanal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="canal" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="vendas" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Estoque por Categoria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estoque por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosEstoqueCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ categoria, quantidade }) => `${categoria}: ${quantidade}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {dadosEstoqueCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Alertas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <AlertTriangle className="text-orange-500" size={24} />
          Alertas Inteligentes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alertas.map((alerta, index) => (
            <motion.div
              key={alerta.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-6 shadow-xl border-l-4 ${
                alerta.nivel === 'alto' ? 'border-red-500' :
                alerta.nivel === 'medio' ? 'border-orange-500' : 'border-yellow-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  alerta.nivel === 'alto' ? 'bg-red-100' :
                  alerta.nivel === 'medio' ? 'bg-orange-100' : 'bg-yellow-100'
                }`}>
                  <AlertTriangle size={20} className={
                    alerta.nivel === 'alto' ? 'text-red-600' :
                    alerta.nivel === 'medio' ? 'text-orange-600' : 'text-yellow-600'
                  } />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {alerta.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {alerta.descricao}
                  </p>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    {alerta.acao} →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal IA Chat */}
      <AnimatePresence>
        {showIAChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowIAChat(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Fale com a IA</h3>
              <input
                type="text"
                value={perguntaIA}
                onChange={(e) => setPerguntaIA(e.target.value)}
                placeholder="Faça sua pergunta..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowIAChat(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Implementar lógica da IA
                    setShowIAChat(false);
                  }}
                  disabled={loadingIA}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingIA ? 'Processando...' : 'Enviar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 