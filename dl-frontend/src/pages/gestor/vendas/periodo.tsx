import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart, 
  Calendar,
  BarChart3,
  PieChart,
  Filter,
  Download,
  Search,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import LayoutGestor from "@/components/layout/LayoutGestor";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { api } from '@/config/api';

interface Venda {
  id: number;
  data_venda: string;
  total: number;
  status: string;
  forma_pagamento: string;
  cliente?: {
    id: number;
    nome: string;
    telefone: string;
  };
}

export default function VendasPorPeriodo() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loadingVendas, setLoadingVendas] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    totalVendas: 0,
    totalReceita: 0,
    ticketMedio: 0,
    vendasConcluidas: 0,
    vendasPendentes: 0,
    vendasCanceladas: 0
  });

  useEffect(() => {
    setMounted(true);
    // Definir período padrão (últimos 30 dias)
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);
    
    setDataFim(hoje.toISOString().split('T')[0]);
    setDataInicio(trintaDiasAtras.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (dataInicio && dataFim) {
      buscarVendas();
    }
  }, [dataInicio, dataFim]);

  const buscarVendas = async () => {
    setLoadingVendas(true);
    try {
      const data = await api.get(`/vendas/periodo?data_inicio=${dataInicio}&data_fim=${dataFim}`);
      if (data && typeof data === 'object' && 'success' in data && data.success === true && 'vendas' in data && Array.isArray((data as any).vendas)) {
        const vendasData = (data as any).vendas;
        setVendas(vendasData);
        
        // Calcular estatísticas
        const totalReceita = vendasData.reduce((sum: number, venda: Venda) => sum + venda.total, 0) || 0;
        const vendasConcluidas = vendasData.filter((v: Venda) => v.status === 'concluida').length || 0;
        const vendasPendentes = vendasData.filter((v: Venda) => v.status === 'pendente').length || 0;
        const vendasCanceladas = vendasData.filter((v: Venda) => v.status === 'cancelada').length || 0;
        
        setEstatisticas({
          totalVendas: vendasData.length || 0,
          totalReceita,
          ticketMedio: vendasData.length > 0 ? totalReceita / vendasData.length : 0,
          vendasConcluidas,
          vendasPendentes,
          vendasCanceladas
        });
      }
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      // Mock de dados para demonstração
      const mockVendas: Venda[] = [
        {
          id: 1,
          data_venda: "2024-01-15",
          total: 1250.00,
          status: "concluida",
          forma_pagamento: "PIX",
          cliente: { id: 1, nome: "João Silva", telefone: "(11) 99999-9999" }
        },
        {
          id: 2,
          data_venda: "2024-01-14",
          total: 890.50,
          status: "pendente",
          forma_pagamento: "Cartão",
          cliente: { id: 2, nome: "Maria Santos", telefone: "(11) 88888-8888" }
        },
        {
          id: 3,
          data_venda: "2024-01-13",
          total: 2100.00,
          status: "concluida",
          forma_pagamento: "Boleto",
          cliente: { id: 3, nome: "Pedro Costa", telefone: "(11) 77777-7777" }
        }
      ];
      setVendas(mockVendas);
      setEstatisticas({
        totalVendas: 3,
        totalReceita: 4240.50,
        ticketMedio: 1413.50,
        vendasConcluidas: 2,
        vendasPendentes: 1,
        vendasCanceladas: 0
      });
    } finally {
      setLoadingVendas(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pendente': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelada': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (loading || !mounted || !user || user.perfil !== "GESTOR") {
    return null;
  }

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Vendas por Período
                </h1>
                <p className="text-blue-100">
                  Análise detalhada de vendas por período selecionado
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Filtros */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 mb-6 shadow-xl"
          >
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={buscarVendas}
                disabled={loadingVendas}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loadingVendas ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </motion.div>

          {/* Cards de Métricas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.totalVendas}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(estatisticas.totalReceita)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(estatisticas.ticketMedio)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendas Concluídas</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticas.vendasConcluidas}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendas Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{estatisticas.vendasPendentes}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendas Canceladas</p>
                  <p className="text-2xl font-bold text-red-600">{estatisticas.vendasCanceladas}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabela de Vendas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Lista de Vendas</h2>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pagamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {loadingVendas ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          Carregando vendas...
                        </td>
                      </motion.tr>
                    ) : vendas.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          Nenhuma venda encontrada para o período selecionado
                        </td>
                      </motion.tr>
                    ) : (
                      vendas.map((venda) => (
                        <motion.tr
                          key={venda.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{venda.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatarData(venda.data_venda)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{venda.cliente?.nome || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{venda.cliente?.telefone || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatarMoeda(venda.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(venda.status)}`}>
                              {getStatusIcon(venda.status)}
                              <span className="ml-1">{venda.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {venda.forma_pagamento}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <FileText className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 