import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutGestor from "@/components/layout/LayoutGestor";
import { BarChart3, DollarSign, Edit, Eye, Filter, Megaphone, Pause, Play, Plus, Target, Trash2, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Campanha {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  orcamento: number;
  gasto: number;
  alcance: number;
  conversoes: number;
  dataInicio: string;
  dataFim: string;
  descricao: string;
  canal: string;
}

interface CampanhaMetricas {
  totalCampanhas: number;
  campanhasAtivas: number;
  orcamentoTotal: number;
  gastoTotal: number;
  roiMedio: number;
}

export default function GestaoCampanhasPage() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [metricas, setMetricas] = useState<CampanhaMetricas>({
    totalCampanhas: 0,
    campanhasAtivas: 0,
    orcamentoTotal: 0,
    gastoTotal: 0,
    roiMedio: 0
  });
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [filtroCanal, setFiltroCanal] = useState("todos");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Dados mockados para demonstração
    const campanhasMock: Campanha[] = [
      {
        id: "1",
        nome: "Campanha Black Friday",
        tipo: "Promocional",
        status: "Ativa",
        orcamento: 5000,
        gasto: 3200,
        alcance: 15000,
        conversoes: 45,
        dataInicio: "2024-01-01",
        dataFim: "2024-01-31",
        descricao: "Campanha promocional para Black Friday",
        canal: "Mercado Livre"
      },
      {
        id: "2",
        nome: "Anúncios Google Ads",
        tipo: "Performance",
        status: "Ativa",
        orcamento: 3000,
        gasto: 1800,
        alcance: 8000,
        conversoes: 28,
        dataInicio: "2024-01-05",
        dataFim: "2024-02-05",
        descricao: "Campanha de performance no Google Ads",
        canal: "Google Ads"
      },
      {
        id: "3",
        nome: "Campanha Instagram",
        tipo: "Branding",
        status: "Pausada",
        orcamento: 2000,
        gasto: 1200,
        alcance: 12000,
        conversoes: 15,
        dataInicio: "2024-01-10",
        dataFim: "2024-01-25",
        descricao: "Campanha de branding no Instagram",
        canal: "Instagram"
      },
      {
        id: "4",
        nome: "Anúncios Facebook",
        tipo: "Conversão",
        status: "Finalizada",
        orcamento: 4000,
        gasto: 4000,
        alcance: 20000,
        conversoes: 60,
        dataInicio: "2023-12-01",
        dataFim: "2023-12-31",
        descricao: "Campanha de conversão no Facebook",
        canal: "Facebook"
      }
    ];

    setCampanhas(campanhasMock);

    const metricasCalculadas = {
      totalCampanhas: campanhasMock.length,
      campanhasAtivas: campanhasMock.filter(c => c.status === "Ativa").length,
      orcamentoTotal: campanhasMock.reduce((acc, c) => acc + c.orcamento, 0),
      gastoTotal: campanhasMock.reduce((acc, c) => acc + c.gasto, 0),
      roiMedio: campanhasMock.reduce((acc, c) => acc + (c.conversoes * 100 / c.alcance), 0) / campanhasMock.length
    };

    setMetricas(metricasCalculadas);
  }, []);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa": return "bg-green-100 text-green-800";
      case "Pausada": return "bg-yellow-100 text-yellow-800";
      case "Finalizada": return "bg-gray-100 text-gray-800";
      case "Rascunho": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Promocional": return <TrendingUp className="w-5 h-5" />;
      case "Performance": return <Target className="w-5 h-5" />;
      case "Branding": return <Users className="w-5 h-5" />;
      case "Conversão": return <DollarSign className="w-5 h-5" />;
      default: return <Megaphone className="w-5 h-5" />;
    }
  };

  const calcularROI = (campanha: Campanha) => {
    if (campanha.gasto === 0) return 0;
    return ((campanha.conversoes * 100) / campanha.alcance).toFixed(2);
  };

  const calcularProgresso = (campanha: Campanha) => {
    return (campanha.gasto / campanha.orcamento) * 100;
  };

  const toggleCampanha = (id: string) => {
    setCampanhas(prev => prev.map(c =>
      c.id === id
        ? { ...c, status: c.status === "Ativa" ? "Pausada" : "Ativa" }
        : c
    ));
  };

  const deletarCampanha = (id: string) => {
    setCampanhas(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Megaphone className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Gestão de Campanhas</h1>
                  <p className="text-purple-100 opacity-90">Crie e gerencie suas campanhas publicitárias</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Campanha
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="todas">Todas as campanhas</option>
                <option value="ativa">Campanhas ativas</option>
                <option value="pausada">Campanhas pausadas</option>
                <option value="finalizada">Campanhas finalizadas</option>
              </select>

              <select
                value={filtroCanal}
                onChange={(e) => setFiltroCanal(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="todos">Todos os canais</option>
                <option value="mercadolivre">Mercado Livre</option>
                <option value="googleads">Google Ads</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Campanhas</p>
                  <p className="text-2xl font-bold text-gray-900">{metricas.totalCampanhas}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Megaphone className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Campanhas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{metricas.campanhasAtivas}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Orçamento Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(metricas.orcamentoTotal)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gasto Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(metricas.gastoTotal)}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ROI Médio</p>
                  <p className="text-2xl font-bold text-green-600">{metricas.roiMedio.toFixed(2)}%</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Campanhas */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Campanhas</h3>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Ver todas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campanhas.map((campanha) => (
                <div key={campanha.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-xl">
                        {getTipoIcon(campanha.tipo)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{campanha.nome}</h4>
                        <p className="text-sm text-gray-600">{campanha.canal}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campanha.status)}`}>
                      {campanha.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{campanha.descricao}</p>

                  {/* Progresso do Orçamento */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Orçamento</span>
                      <span>{formatarMoeda(campanha.gasto)} / {formatarMoeda(campanha.orcamento)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${calcularProgresso(campanha)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Métricas da Campanha */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Alcance</p>
                      <p className="text-sm font-bold text-gray-900">{campanha.alcance.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Conversões</p>
                      <p className="text-sm font-bold text-gray-900">{campanha.conversoes}</p>
                    </div>
                  </div>

                  {/* ROI */}
                  <div className="mb-4 text-center">
                    <p className="text-xs text-gray-600">ROI</p>
                    <p className="text-sm font-bold text-green-600">{calcularROI(campanha)}%</p>
                  </div>

                  {/* Período */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{new Date(campanha.dataInicio).toLocaleDateString('pt-BR')}</span>
                    <span>{new Date(campanha.dataFim).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCampanha(campanha.id)}
                      className={`flex-1 text-sm py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${campanha.status === "Ativa"
                        ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                        : "bg-green-100 hover:bg-green-200 text-green-700"
                        }`}
                    >
                      {campanha.status === "Ativa" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {campanha.status === "Ativa" ? "Pausar" : "Ativar"}
                    </button>
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => deletarCampanha(campanha.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 text-sm py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de Performance */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Performance por Canal</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
              {campanhas.filter(c => c.status === "Ativa").map((campanha) => (
                <div key={campanha.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      {getTipoIcon(campanha.tipo)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{campanha.nome}</h4>
                      <p className="text-sm text-gray-600">{campanha.canal}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatarMoeda(campanha.gasto)}</p>
                    <p className="text-sm text-green-600">{calcularROI(campanha)}% ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 