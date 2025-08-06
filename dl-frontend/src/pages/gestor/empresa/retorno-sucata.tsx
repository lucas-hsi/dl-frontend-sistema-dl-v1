import React, { useState, useEffect } from "react";
import { 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Eye, 
  Search,
  Filter,
  BarChart3,
  Truck,
  ShoppingCart,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import LayoutGestor from "@/components/layout/LayoutGestor";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface SucataRetorno {
  id: string;
  sku_mestre: string;
  identificador_veiculo: string;
  data_entrada: string;
  valor_pago: number;
  vendas_totais: number;
  pecas_vendidas: number;
  pecas_estoque: number;
  retorno_percentual: number;
  status: 'positivo' | 'neutro' | 'negativo';
  produtos_vinculados: Array<{
    sku: string;
    nome: string;
    valor_venda: number;
    data_venda?: string;
    canal: string;
  }>;
}

export default function RetornoSucata() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");

  // Dados mockados de sucatas com retorno
  const [sucatasRetorno] = useState<SucataRetorno[]>([
    {
      id: "1",
      sku_mestre: "SC-4B32-241025-0001",
      identificador_veiculo: "Honda Civic 2018 - ABC4B32",
      data_entrada: "2024-10-25",
      valor_pago: 2500,
      vendas_totais: 3920,
      pecas_vendidas: 17,
      pecas_estoque: 8,
      retorno_percentual: 56.8,
      status: 'positivo',
      produtos_vinculados: [
        { sku: "CV-001", nome: "Farol Direito", valor_venda: 350, data_venda: "2024-10-26", canal: "Mercado Livre" },
        { sku: "CV-002", nome: "Pastilha de Freio", valor_venda: 180, data_venda: "2024-10-27", canal: "Balcão" },
        { sku: "CV-003", nome: "Motor de Partida", valor_venda: 450, data_venda: "2024-10-28", canal: "Shopify" },
        // ... mais produtos
      ]
    },
    {
      id: "2", 
      sku_mestre: "SC-7Y89-241020-0002",
      identificador_veiculo: "Toyota Corolla 2016 - XYZ7Y89",
      data_entrada: "2024-10-20",
      valor_pago: 1800,
      vendas_totais: 2340,
      pecas_vendidas: 12,
      pecas_estoque: 15,
      retorno_percentual: 30.0,
      status: 'positivo',
      produtos_vinculados: [
        { sku: "TC-001", nome: "Parachoque Traseiro", valor_venda: 280, data_venda: "2024-10-21", canal: "Mercado Livre" },
        { sku: "TC-002", nome: "Espelho Retrovisor", valor_venda: 120, data_venda: "2024-10-22", canal: "Balcão" },
      ]
    },
    {
      id: "3",
      sku_mestre: "SC-9K45-241015-0003", 
      identificador_veiculo: "Volkswagen Golf 2015 - DEF9K45",
      data_entrada: "2024-10-15",
      valor_pago: 3200,
      vendas_totais: 2890,
      pecas_vendidas: 8,
      pecas_estoque: 22,
      retorno_percentual: -9.7,
      status: 'negativo',
      produtos_vinculados: [
        { sku: "VW-001", nome: "Airbag Motorista", valor_venda: 650, data_venda: "2024-10-16", canal: "Shopify" },
        { sku: "VW-002", nome: "Volante", valor_venda: 320, data_venda: "2024-10-18", canal: "Balcão" },
      ]
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Proteção de acesso
  if (loading || !mounted || !user || user.perfil !== "GESTOR") {
    return null;
  }

  // Filtrar sucatas
  const sucatasFiltradas = sucatasRetorno.filter(sucata => {
    const matchBusca = sucata.sku_mestre.toLowerCase().includes(busca.toLowerCase()) ||
                      sucata.identificador_veiculo.toLowerCase().includes(busca.toLowerCase());
    
    if (filtro === "todos") return matchBusca;
    if (filtro === "positivo") return matchBusca && sucata.status === 'positivo';
    if (filtro === "negativo") return matchBusca && sucata.status === 'negativo';
    
    return matchBusca;
  });

  // Calcular métricas gerais
  const metricas = {
    totalInvestido: sucatasRetorno.reduce((acc, s) => acc + s.valor_pago, 0),
    totalRecuperado: sucatasRetorno.reduce((acc, s) => acc + s.vendas_totais, 0),
    retornoMedio: sucatasRetorno.reduce((acc, s) => acc + s.retorno_percentual, 0) / sucatasRetorno.length,
    sucatasPositivas: sucatasRetorno.filter(s => s.status === 'positivo').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positivo': return 'text-green-600 bg-green-100';
      case 'negativo': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRetornoColor = (retorno: number) => {
    if (retorno > 0) return 'text-green-600';
    if (retorno < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <Receipt className="w-12 h-12" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Retorno por Sucata</h1>
                <p className="text-purple-100 opacity-90">Análise de rentabilidade e ROI dos desmanches</p>
              </div>
            </div>
          </div>

          {/* Métricas Gerais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8" />
                <span className="text-2xl font-bold">R$ {metricas.totalInvestido.toLocaleString('pt-BR')}</span>
              </div>
              <div className="space-y-1">
                <div className="text-blue-100 text-sm font-medium">Total Investido</div>
                <div className="text-white/80 text-xs">Soma de todas as sucatas</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8" />
                <span className="text-2xl font-bold">R$ {metricas.totalRecuperado.toLocaleString('pt-BR')}</span>
              </div>
              <div className="space-y-1">
                <div className="text-green-100 text-sm font-medium">Total Recuperado</div>
                <div className="text-white/80 text-xs">Vendas realizadas</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8" />
                <span className="text-2xl font-bold">{metricas.retornoMedio.toFixed(1)}%</span>
              </div>
              <div className="space-y-1">
                <div className="text-purple-100 text-sm font-medium">Retorno Médio</div>
                <div className="text-white/80 text-xs">ROI geral do negócio</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8" />
                <span className="text-2xl font-bold">{metricas.sucatasPositivas}/{sucatasRetorno.length}</span>
              </div>
              <div className="space-y-1">
                <div className="text-yellow-100 text-sm font-medium">Sucatas Positivas</div>
                <div className="text-white/80 text-xs">Com retorno positivo</div>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por SKU ou veículo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="todos">Todas as Sucatas</option>
                    <option value="positivo">Retorno Positivo</option>
                    <option value="negativo">Retorno Negativo</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Mostrando {sucatasFiltradas.length} de {sucatasRetorno.length} sucatas
              </div>
            </div>
          </div>

          {/* Tabela de Retorno */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Truck className="w-6 h-6 text-purple-500" />
                Análise Detalhada por Sucata
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Sucata</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Valor Pago</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Vendas Totais</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Retorno (%)</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Peças</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sucatasFiltradas.map((sucata) => (
                    <tr key={sucata.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-mono text-sm font-bold text-gray-800">
                            {sucata.sku_mestre}
                          </div>
                          <div className="text-xs text-gray-600">
                            {sucata.identificador_veiculo}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(sucata.data_entrada).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">
                          R$ {sucata.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">
                          R$ {sucata.vendas_totais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {sucata.retorno_percentual > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`font-bold ${getRetornoColor(sucata.retorno_percentual)}`}>
                            {sucata.retorno_percentual > 0 ? '+' : ''}{sucata.retorno_percentual.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <ShoppingCart className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 font-medium">{sucata.pecas_vendidas} vendidas</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-3 h-3 text-blue-500" />
                            <span className="text-blue-600 font-medium">{sucata.pecas_estoque} estoque</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sucata.status)}`}>
                          {sucata.status === 'positivo' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {sucata.status === 'positivo' ? 'Positivo' : 'Negativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium text-sm">
                          <Eye className="w-4 h-4" />
                          Detalhes
                        </button>
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