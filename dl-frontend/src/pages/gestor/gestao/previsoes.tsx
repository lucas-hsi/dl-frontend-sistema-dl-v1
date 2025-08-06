import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Brain, 
  Calendar, 
  DollarSign, 
  Package, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Zap
} from "lucide-react";
import LayoutGestor from "@/components/layout/LayoutGestor";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function PrevisoesPagina() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('30_dias');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted || !user || user.perfil !== "GESTOR") {
    return null;
  }

  // Mock de dados de previsões
  const previsoes = {
    vendas_proximos_30_dias: {
      valor: 45800,
      crescimento: 12.5,
      confianca: 87
    },
    produtos_alta_demanda: [
      { produto: "Pastilhas de Freio", previsao: 15, atual: 8 },
      { produto: "Faróis", previsao: 12, atual: 5 },
      { produto: "Parachoques", previsao: 8, atual: 3 }
    ],
    sazonalidade: {
      pico_vendas: "Dezembro 2024",
      baixa_vendas: "Fevereiro 2025",
      tendencia: "crescente"
    },
    recomendacoes_ia: [
      {
        tipo: "estoque",
        titulo: "Reabastecer Pastilhas Honda",
        descricao: "IA prevê alta demanda nos próximos 15 dias",
        prioridade: "alta"
      },
      {
        tipo: "preco",
        titulo: "Ajustar preço Farol Civic",
        descricao: "Concorrência reduziu preços em 8%",
        prioridade: "media"
      },
      {
        tipo: "marketing",
        titulo: "Campanha Black Friday",
        descricao: "Histórico mostra 40% aumento em novembro",
        prioridade: "alta"
      }
    ]
  };

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
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Previsões com IA</h1>
                  <p className="text-purple-100 opacity-90">Inteligência artificial para previsão de vendas e demanda</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{previsoes.vendas_proximos_30_dias.confianca}%</div>
                <div className="text-purple-100 text-sm">confiança IA</div>
              </div>
            </div>
          </div>

          {/* Filtros de Período */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <Calendar className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-bold text-gray-800">Período de Análise</h3>
              <div className="flex gap-2 ml-auto">
                {[
                  { key: '30_dias', label: '30 dias' },
                  { key: '90_dias', label: '90 dias' },
                  { key: '6_meses', label: '6 meses' },
                  { key: '1_ano', label: '1 ano' }
                ].map(period => (
                  <button
                    key={period.key}
                    onClick={() => setTimeRange(period.key)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      timeRange === period.key 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Previsão de Vendas */}
            <div className="lg:col-span-2 space-y-6">
              {/* KPIs de Previsão */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Vendas Previstas</p>
                      <p className="text-2xl font-bold text-green-600">
                        R$ {previsoes.vendas_proximos_30_dias.valor.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +{previsoes.vendas_proximos_30_dias.crescimento}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Confiança IA</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {previsoes.vendas_proximos_30_dias.confianca}%
                      </p>
                      <p className="text-sm text-blue-500">Alta precisão</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tendência</p>
                      <p className="text-2xl font-bold text-purple-600 capitalize">
                        {previsoes.sazonalidade.tendencia}
                      </p>
                      <p className="text-sm text-purple-500">vs mês anterior</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico de Previsão */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <LineChart className="w-6 h-6 text-blue-500" />
                  Projeção de Vendas - Próximos 30 Dias
                </h3>
                
                <div className="space-y-4">
                  {/* Mock de gráfico com barras */}
                  <div className="grid grid-cols-7 gap-2 h-40">
                    {Array.from({ length: 7 }, (_, i) => {
                      const height = Math.random() * 80 + 20;
                      return (
                        <div key={i} className="flex flex-col justify-end items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-lg"
                            style={{ height: `${height}%` }}
                          ></div>
                          <p className="text-xs text-gray-500 mt-2">
                            Sem {i + 1}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
                    <span>Base histórica: 6 meses</span>
                    <span>Algoritmo: Machine Learning + Sazonalidade</span>
                    <span>Atualização: Tempo real</span>
                  </div>
                </div>
              </div>

              {/* Produtos em Alta Demanda */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-green-500" />
                  Produtos em Alta Demanda Prevista
                </h3>
                
                <div className="space-y-4">
                  {previsoes.produtos_alta_demanda.map((produto, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-medium text-gray-800">{produto.produto}</p>
                        <p className="text-sm text-gray-600">Estoque atual: {produto.atual} unidades</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">+{produto.previsao}</p>
                        <p className="text-sm text-gray-500">unidades previstas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar com Recomendações */}
            <div className="space-y-6">
              {/* Sazonalidade */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Análise Sazonal
                </h4>
                
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm font-medium text-green-800">Pico de Vendas</p>
                    <p className="text-xs text-green-600">{previsoes.sazonalidade.pico_vendas}</p>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm font-medium text-red-800">Baixa Demanda</p>
                    <p className="text-xs text-red-600">{previsoes.sazonalidade.baixa_vendas}</p>
                  </div>
                </div>
              </div>

              {/* Recomendações da IA */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Recomendações IA
                </h4>
                
                <div className="space-y-3">
                  {previsoes.recomendacoes_ia.map((rec, index) => {
                    const getPriorityColor = (prioridade: string) => {
                      switch (prioridade) {
                        case 'alta': return 'border-red-200 bg-red-50';
                        case 'media': return 'border-yellow-200 bg-yellow-50';
                        default: return 'border-blue-200 bg-blue-50';
                      }
                    };

                    const getPriorityIcon = (prioridade: string) => {
                      switch (prioridade) {
                        case 'alta': return AlertTriangle;
                        case 'media': return CheckCircle;
                        default: return Target;
                      }
                    };

                    const Icon = getPriorityIcon(rec.prioridade);

                    return (
                      <div key={index} className={`p-3 rounded-xl border ${getPriorityColor(rec.prioridade)}`}>
                        <div className="flex items-start gap-2">
                          <Icon className="w-4 h-4 mt-0.5 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{rec.titulo}</p>
                            <p className="text-xs text-gray-600 mt-1">{rec.descricao}</p>
                            <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                              rec.prioridade === 'alta' ? 'bg-red-100 text-red-700' :
                              rec.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {rec.prioridade === 'alta' ? 'Urgente' : 
                               rec.prioridade === 'media' ? 'Moderada' : 'Baixa'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Métricas de Precisão */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Precisão do Modelo
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Vendas (30d)</span>
                    <span className="font-bold text-gray-800">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Demanda (60d)</span>
                    <span className="font-bold text-gray-800">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sazonalidade</span>
                    <span className="font-bold text-gray-800">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 