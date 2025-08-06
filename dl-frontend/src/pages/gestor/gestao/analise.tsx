import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutGestor from "@/components/layout/LayoutGestor";
import { BarChart3, DollarSign, Download, Filter, Package, PieChart, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface VendaData {
  id: string;
  data: string;
  valor: number;
  vendedor: string;
  canal: string;
  produtos: number;
  status: string;
}

interface Metricas {
  totalVendas: number;
  valorTotal: number;
  ticketMedio: number;
  clientesAtivos: number;
  crescimento: number;
}

export default function AnaliseVendas() {
  const [periodo, setPeriodo] = useState("30");
  const [vendedor, setVendedor] = useState("todos");
  const [canal, setCanal] = useState("todos");
  const [dadosVendas, setDadosVendas] = useState<VendaData[]>([]);
  const [metricas, setMetricas] = useState<Metricas>({
    totalVendas: 0,
    valorTotal: 0,
    ticketMedio: 0,
    clientesAtivos: 0,
    crescimento: 0
  });

  // Dados mockados para demonstração
  useEffect(() => {
    const dadosMock: VendaData[] = [
      { id: "1", data: "2024-01-15", valor: 1250.00, vendedor: "João Silva", canal: "Balcão", produtos: 3, status: "Concluída" },
      { id: "2", data: "2024-01-14", valor: 890.50, vendedor: "Maria Santos", canal: "Mercado Livre", produtos: 2, status: "Concluída" },
      { id: "3", data: "2024-01-13", valor: 2100.00, vendedor: "Pedro Costa", canal: "WhatsApp", produtos: 5, status: "Concluída" },
      { id: "4", data: "2024-01-12", valor: 750.00, vendedor: "Ana Oliveira", canal: "Balcão", produtos: 1, status: "Concluída" },
      { id: "5", data: "2024-01-11", valor: 1800.00, vendedor: "João Silva", canal: "Mercado Livre", produtos: 4, status: "Concluída" },
    ];

    setDadosVendas(dadosMock);

    const metricasCalculadas = {
      totalVendas: dadosMock.length,
      valorTotal: dadosMock.reduce((acc, venda) => acc + venda.valor, 0),
      ticketMedio: dadosMock.reduce((acc, venda) => acc + venda.valor, 0) / dadosMock.length,
      clientesAtivos: 45,
      crescimento: 12.5
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
      case "Concluída": return "bg-green-100 text-green-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      case "Cancelada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const exportarRelatorio = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "ID,Data,Valor,Vendedor,Canal,Produtos,Status\n"
      + dadosVendas.map(venda =>
        `${venda.id},${venda.data},${venda.valor},${venda.vendedor},${venda.canal},${venda.produtos},${venda.status}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analise_vendas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Análise de Vendas</h1>
                  <p className="text-green-100 opacity-90">Relatórios detalhados de performance</p>
                </div>
              </div>
              <button
                onClick={exportarRelatorio}
                className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar
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
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="15">Últimos 15 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
              </select>

              <select
                value={vendedor}
                onChange={(e) => setVendedor(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos os vendedores</option>
                <option value="joao">João Silva</option>
                <option value="maria">Maria Santos</option>
                <option value="pedro">Pedro Costa</option>
                <option value="ana">Ana Oliveira</option>
              </select>

              <select
                value={canal}
                onChange={(e) => setCanal(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos os canais</option>
                <option value="balcao">Balcão</option>
                <option value="mercadolivre">Mercado Livre</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="shopify">Shopify</option>
              </select>
            </div>
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">{metricas.totalVendas}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(metricas.valorTotal)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(metricas.ticketMedio)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{metricas.clientesAtivos}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Crescimento</p>
                  <p className="text-2xl font-bold text-green-600">+{metricas.crescimento}%</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos e Análises */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Vendas por Canal */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Vendas por Canal</h3>
                <PieChart className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Balcão</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">40%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Mercado Livre</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">35%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">WhatsApp</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">25%</span>
                </div>
              </div>
            </div>

            {/* Gráfico de Performance por Vendedor */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Performance por Vendedor</h3>
                <BarChart3 className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">João Silva</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Maria Santos</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pedro Costa</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Vendas Recentes */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Vendas Recentes</h3>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                Ver todas
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Vendedor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Canal</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Valor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Produtos</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosVendas.map((venda) => (
                    <tr key={venda.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(venda.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{venda.vendedor}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{venda.canal}</td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-900">
                        {formatarMoeda(venda.valor)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{venda.produtos}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(venda.status)}`}>
                          {venda.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 