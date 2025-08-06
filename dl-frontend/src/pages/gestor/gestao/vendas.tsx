import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LayoutGestor from "@/components/layout/LayoutGestor";
import { BarChart3, Calendar, DollarSign, Download, Filter, LineChart, Package, PieChart, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Venda {
  id: string;
  data: string;
  valor: number;
  vendedor: string;
  canal: string;
  produtos: number;
  status: string;
  cliente: string;
  formaPagamento: string;
}

interface VendaMetricas {
  totalVendas: number;
  valorTotal: number;
  ticketMedio: number;
  vendasHoje: number;
  crescimento: number;
  vendedorTop: string;
  canalTop: string;
}

interface VendedorPerformance {
  nome: string;
  vendas: number;
  valor: number;
  ticketMedio: number;
  conversao: number;
}

export default function GestaoVendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [metricas, setMetricas] = useState<VendaMetricas>({
    totalVendas: 0,
    valorTotal: 0,
    ticketMedio: 0,
    vendasHoje: 0,
    crescimento: 0,
    vendedorTop: "",
    canalTop: ""
  });
  const [vendedores, setVendedores] = useState<VendedorPerformance[]>([]);
  const [periodo, setPeriodo] = useState("30");
  const [filtroCanal, setFiltroCanal] = useState("todos");
  const [filtroVendedor, setFiltroVendedor] = useState("todos");

  useEffect(() => {
    // Dados mockados para demonstração
    const vendasMock: Venda[] = [
      {
        id: "1",
        data: "2024-01-15",
        valor: 1250.00,
        vendedor: "João Silva",
        canal: "Balcão",
        produtos: 3,
        status: "Concluída",
        cliente: "Maria Santos",
        formaPagamento: "Cartão"
      },
      {
        id: "2",
        data: "2024-01-15",
        valor: 890.50,
        vendedor: "Maria Santos",
        canal: "Mercado Livre",
        produtos: 2,
        status: "Concluída",
        cliente: "Pedro Costa",
        formaPagamento: "PIX"
      },
      {
        id: "3",
        data: "2024-01-14",
        valor: 2100.00,
        vendedor: "Pedro Costa",
        canal: "WhatsApp",
        produtos: 5,
        status: "Concluída",
        cliente: "Ana Oliveira",
        formaPagamento: "Dinheiro"
      },
      {
        id: "4",
        data: "2024-01-14",
        valor: 750.00,
        vendedor: "Ana Oliveira",
        canal: "Balcão",
        produtos: 1,
        status: "Concluída",
        cliente: "Carlos Lima",
        formaPagamento: "Cartão"
      },
      {
        id: "5",
        data: "2024-01-13",
        valor: 1800.00,
        vendedor: "João Silva",
        canal: "Mercado Livre",
        produtos: 4,
        status: "Concluída",
        cliente: "Fernanda Silva",
        formaPagamento: "PIX"
      }
    ];

    const vendedoresMock: VendedorPerformance[] = [
      {
        nome: "João Silva",
        vendas: 25,
        valor: 45000,
        ticketMedio: 1800,
        conversao: 85
      },
      {
        nome: "Maria Santos",
        vendas: 18,
        valor: 32000,
        ticketMedio: 1778,
        conversao: 72
      },
      {
        nome: "Pedro Costa",
        vendas: 22,
        valor: 38000,
        ticketMedio: 1727,
        conversao: 78
      },
      {
        nome: "Ana Oliveira",
        vendas: 15,
        valor: 25000,
        ticketMedio: 1667,
        conversao: 65
      }
    ];

    setVendas(vendasMock);
    setVendedores(vendedoresMock);

    const metricasCalculadas = {
      totalVendas: vendasMock.length,
      valorTotal: vendasMock.reduce((acc, venda) => acc + venda.valor, 0),
      ticketMedio: vendasMock.reduce((acc, venda) => acc + venda.valor, 0) / vendasMock.length,
      vendasHoje: vendasMock.filter(v => v.data === "2024-01-15").length,
      crescimento: 12.5,
      vendedorTop: "João Silva",
      canalTop: "Balcão"
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

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case "Balcão": return <ShoppingCart className="w-5 h-5" />;
      case "Mercado Livre": return <Package className="w-5 h-5" />;
      case "WhatsApp": return <Users className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const exportarRelatorio = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "ID,Data,Valor,Vendedor,Canal,Produtos,Status,Cliente,FormaPagamento\n"
      + vendas.map(venda =>
        `${venda.id},${venda.data},${venda.valor},${venda.vendedor},${venda.canal},${venda.produtos},${venda.status},${venda.cliente},${venda.formaPagamento}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <DollarSign className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Gestão de Vendas</h1>
                  <p className="text-orange-100 opacity-90">Análise completa de vendas e performance</p>
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
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="15">Últimos 15 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
              </select>

              <select
                value={filtroCanal}
                onChange={(e) => setFiltroCanal(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="todos">Todos os canais</option>
                <option value="balcao">Balcão</option>
                <option value="mercadolivre">Mercado Livre</option>
                <option value="whatsapp">WhatsApp</option>
              </select>

              <select
                value={filtroVendedor}
                onChange={(e) => setFiltroVendedor(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="todos">Todos os vendedores</option>
                <option value="joao">João Silva</option>
                <option value="maria">Maria Santos</option>
                <option value="pedro">Pedro Costa</option>
                <option value="ana">Ana Oliveira</option>
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
                <div className="bg-orange-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(metricas.valorTotal)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(metricas.ticketMedio)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vendas Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{metricas.vendasHoje}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-600" />
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

          {/* Performance por Vendedor */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Performance por Vendedor</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vendedores.map((vendedor, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{vendedor.nome}</h4>
                        <p className="text-sm text-gray-600">{vendedor.vendas} vendas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatarMoeda(vendedor.valor)}</p>
                      <p className="text-xs text-green-600">{vendedor.conversao}% conversão</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Ticket Médio</span>
                      <span className="font-medium">{formatarMoeda(vendedor.ticketMedio)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(vendedor.valor / Math.max(...vendedores.map(v => v.valor))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendas por Canal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Tendência de Vendas</h3>
                <LineChart className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-4">
                {vendas.slice(0, 5).map((venda, index) => (
                  <div key={venda.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        {getCanalIcon(venda.canal)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{venda.cliente}</p>
                        <p className="text-xs text-gray-600">{venda.vendedor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatarMoeda(venda.valor)}</p>
                      <p className="text-xs text-gray-600">{new Date(venda.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Vendas Recentes */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Vendas Recentes</h3>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                Ver todas
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Vendedor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Canal</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Valor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Produtos</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.map((venda) => (
                    <tr key={venda.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(venda.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{venda.cliente}</td>
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