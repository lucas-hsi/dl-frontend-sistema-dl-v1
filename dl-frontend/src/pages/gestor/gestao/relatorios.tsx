import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutGestor from "@/components/layout/LayoutGestor";
import { BarChart3, Calendar, DollarSign, Download, Eye, FileText, Filter, LineChart, Package, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Relatorio {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  ultimaGeracao: string;
  tamanho: string;
  status: string;
}

interface RelatorioVendas {
  periodo: string;
  vendas: number;
  valor: number;
  crescimento: number;
  vendedorTop: string;
  canalTop: string;
}

export default function GestaoRelatoriosPage() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<string>("");
  const [periodo, setPeriodo] = useState("30");
  const [dadosVendas, setDadosVendas] = useState<RelatorioVendas[]>([]);

  useEffect(() => {
    // Dados mockados para demonstração
    const relatoriosMock: Relatorio[] = [
      {
        id: "1",
        nome: "Relatório de Vendas Mensal",
        tipo: "Vendas",
        descricao: "Análise completa de vendas do mês",
        ultimaGeracao: "2024-01-15",
        tamanho: "2.3 MB",
        status: "Disponível"
      },
      {
        id: "2",
        nome: "Relatório de Performance",
        tipo: "Performance",
        descricao: "Métricas de performance da equipe",
        ultimaGeracao: "2024-01-14",
        tamanho: "1.8 MB",
        status: "Disponível"
      },
      {
        id: "3",
        nome: "Relatório de Estoque",
        tipo: "Estoque",
        descricao: "Situação atual do estoque",
        ultimaGeracao: "2024-01-13",
        tamanho: "3.1 MB",
        status: "Disponível"
      },
      {
        id: "4",
        nome: "Relatório de Clientes",
        tipo: "Clientes",
        descricao: "Análise de clientes e fidelização",
        ultimaGeracao: "2024-01-12",
        tamanho: "1.5 MB",
        status: "Disponível"
      }
    ];

    const vendasMock: RelatorioVendas[] = [
      { periodo: "Jan 2024", vendas: 150, valor: 45000, crescimento: 12.5, vendedorTop: "João Silva", canalTop: "Balcão" },
      { periodo: "Dez 2023", vendas: 135, valor: 40000, crescimento: 8.2, vendedorTop: "Maria Santos", canalTop: "Mercado Livre" },
      { periodo: "Nov 2023", vendas: 125, valor: 37000, crescimento: 15.3, vendedorTop: "Pedro Costa", canalTop: "WhatsApp" }
    ];

    setRelatorios(relatoriosMock);
    setDadosVendas(vendasMock);
  }, []);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível": return "bg-green-100 text-green-800";
      case "Processando": return "bg-yellow-100 text-yellow-800";
      case "Erro": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Vendas": return <TrendingUp className="w-5 h-5" />;
      case "Performance": return <Users className="w-5 h-5" />;
      case "Estoque": return <Package className="w-5 h-5" />;
      case "Clientes": return <Users className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const gerarRelatorio = (id: string) => {
    // Simulação de geração de relatório
    console.log(`Gerando relatório ${id}`);
    // Aqui seria feita a chamada para a API
  };

  const baixarRelatorio = (id: string) => {
    // Simulação de download
    console.log(`Baixando relatório ${id}`);
    // Aqui seria feita a chamada para a API
  };

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Relatórios e Métricas</h1>
                  <p className="text-blue-100 opacity-90">Geração e visualização de relatórios</p>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl flex items-center gap-2">
                <Download className="w-4 h-4" />
                Gerar Novo
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
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="15">Últimos 15 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
              </select>

              <select
                value={relatorioSelecionado}
                onChange={(e) => setRelatorioSelecionado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                <option value="vendas">Vendas</option>
                <option value="performance">Performance</option>
                <option value="estoque">Estoque</option>
                <option value="clientes">Clientes</option>
              </select>
            </div>
          </div>

          {/* Métricas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Relatórios Disponíveis</p>
                  <p className="text-2xl font-bold text-gray-900">{relatorios.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">{dadosVendas.reduce((acc, item) => acc + item.vendas, 0)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatarMoeda(dadosVendas.reduce((acc, item) => acc + item.valor, 0))}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Crescimento Médio</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{(dadosVendas.reduce((acc, item) => acc + item.crescimento, 0) / dadosVendas.length).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Relatórios */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Relatórios Disponíveis</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ver todos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatorios.map((relatorio) => (
                <div key={relatorio.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-xl">
                        {getTipoIcon(relatorio.tipo)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{relatorio.nome}</h4>
                        <p className="text-sm text-gray-600">{relatorio.tipo}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(relatorio.status)}`}>
                      {relatorio.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{relatorio.descricao}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Última geração: {new Date(relatorio.ultimaGeracao).toLocaleDateString('pt-BR')}</span>
                    <span>{relatorio.tamanho}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => baixarRelatorio(relatorio.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Baixar
                    </button>
                    <button
                      onClick={() => gerarRelatorio(relatorio.id)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de Tendências */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Tendência de Vendas</h3>
              <LineChart className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
              {dadosVendas.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.periodo}</h4>
                      <p className="text-sm text-gray-600">{item.vendas} vendas</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatarMoeda(item.valor)}</p>
                    <p className={`text-sm ${item.crescimento > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.crescimento > 0 ? '+' : ''}{item.crescimento}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Ações Rápidas</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-green-100 hover:bg-green-200 p-4 rounded-xl text-left transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-bold text-gray-900">Relatório de Vendas</h4>
                    <p className="text-sm text-gray-600">Gerar relatório completo</p>
                  </div>
                </div>
              </button>

              <button className="bg-blue-100 hover:bg-blue-200 p-4 rounded-xl text-left transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-bold text-gray-900">Relatório de Performance</h4>
                    <p className="text-sm text-gray-600">Métricas da equipe</p>
                  </div>
                </div>
              </button>

              <button className="bg-purple-100 hover:bg-purple-200 p-4 rounded-xl text-left transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-purple-600" />
                  <div>
                    <h4 className="font-bold text-gray-900">Relatório de Estoque</h4>
                    <p className="text-sm text-gray-600">Situação do estoque</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 