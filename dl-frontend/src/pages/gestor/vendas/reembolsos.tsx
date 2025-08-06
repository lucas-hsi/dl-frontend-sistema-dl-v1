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
  AlertCircle,
  RefreshCw,
  CreditCard,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import LayoutGestor from "@/components/layout/LayoutGestor";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { api } from '@/config/api';

interface Reembolso {
  id: number;
  data_solicitacao: string;
  data_processamento?: string;
  valor: number;
  status: string;
  motivo: string;
  venda_id: number;
  cliente?: {
    id: number;
    nome: string;
    telefone: string;
  };
  forma_pagamento: string;
  observacoes?: string;
}

export default function Reembolsos() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [reembolsos, setReembolsos] = useState<Reembolso[]>([]);
  const [loadingReembolsos, setLoadingReembolsos] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [estatisticas, setEstatisticas] = useState({
    totalReembolsos: 0,
    valorTotal: 0,
    reembolsosAprovados: 0,
    reembolsosPendentes: 0,
    reembolsosRejeitados: 0,
    valorMedio: 0
  });

  useEffect(() => {
    setMounted(true);
    buscarReembolsos();
  }, []);

  useEffect(() => {
    if (reembolsos.length > 0) {
      calcularEstatisticas();
    }
  }, [reembolsos, filtroStatus]);

  const buscarReembolsos = async () => {
    setLoadingReembolsos(true);
    try {
      const data = await api.get('/reembolsos');
      if (data && typeof data === 'object' && 'success' in data && data.success === true && 'reembolsos' in data && Array.isArray((data as any).reembolsos)) {
        setReembolsos((data as any).reembolsos);
      }
    } catch (error) {
      console.error('Erro ao buscar reembolsos:', error);
      // Mock de dados para demonstração
      const mockReembolsos: Reembolso[] = [
        {
          id: 1,
          data_solicitacao: "2024-01-15",
          data_processamento: "2024-01-16",
          valor: 1250.00,
          status: "aprovado",
          motivo: "Produto com defeito",
          venda_id: 1001,
          cliente: { id: 1, nome: "João Silva", telefone: "(11) 99999-9999" },
          forma_pagamento: "PIX",
          observacoes: "Cliente solicitou troca do produto"
        },
        {
          id: 2,
          data_solicitacao: "2024-01-14",
          valor: 890.50,
          status: "pendente",
          motivo: "Arrependimento da compra",
          venda_id: 1002,
          cliente: { id: 2, nome: "Maria Santos", telefone: "(11) 88888-8888" },
          forma_pagamento: "Cartão",
          observacoes: "Aguardando análise do gestor"
        },
        {
          id: 3,
          data_solicitacao: "2024-01-13",
          data_processamento: "2024-01-14",
          valor: 2100.00,
          status: "rejeitado",
          motivo: "Produto já utilizado",
          venda_id: 1003,
          cliente: { id: 3, nome: "Pedro Costa", telefone: "(11) 77777-7777" },
          forma_pagamento: "Boleto",
          observacoes: "Produto apresentava sinais de uso"
        },
        {
          id: 4,
          data_solicitacao: "2024-01-12",
          data_processamento: "2024-01-13",
          valor: 450.00,
          status: "aprovado",
          motivo: "Erro no pedido",
          venda_id: 1004,
          cliente: { id: 4, nome: "Ana Oliveira", telefone: "(11) 66666-6666" },
          forma_pagamento: "PIX",
          observacoes: "Produto enviado incorretamente"
        }
      ];
      setReembolsos(mockReembolsos);
    } finally {
      setLoadingReembolsos(false);
    }
  };

  const calcularEstatisticas = () => {
    const reembolsosFiltrados = filtroStatus === "todos" 
      ? reembolsos 
      : reembolsos.filter(r => r.status === filtroStatus);

    const totalReembolsos = reembolsosFiltrados.length;
    const valorTotal = reembolsosFiltrados.reduce((sum, r) => sum + r.valor, 0);
    const reembolsosAprovados = reembolsosFiltrados.filter(r => r.status === 'aprovado').length;
    const reembolsosPendentes = reembolsosFiltrados.filter(r => r.status === 'pendente').length;
    const reembolsosRejeitados = reembolsosFiltrados.filter(r => r.status === 'rejeitado').length;
    const valorMedio = totalReembolsos > 0 ? valorTotal / totalReembolsos : 0;

    setEstatisticas({
      totalReembolsos,
      valorTotal,
      reembolsosAprovados,
      reembolsosPendentes,
      reembolsosRejeitados,
      valorMedio
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pendente': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejeitado': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'pendente': return 'Pendente';
      case 'rejeitado': return 'Rejeitado';
      default: return status;
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

  const reembolsosFiltrados = filtroStatus === "todos" 
    ? reembolsos 
    : reembolsos.filter(r => r.status === filtroStatus);

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
                  Gestão de Reembolsos
                </h1>
                <p className="text-blue-100">
                  Controle e acompanhamento de solicitações de reembolso
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <RefreshCw className="w-8 h-8 text-white" />
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
                  Status
                </label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="pendente">Pendentes</option>
                  <option value="aprovado">Aprovados</option>
                  <option value="rejeitado">Rejeitados</option>
                </select>
              </div>
              <button
                onClick={buscarReembolsos}
                disabled={loadingReembolsos}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loadingReembolsos ? 'Atualizando...' : 'Atualizar'}
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
                  <p className="text-sm font-medium text-gray-600">Total de Reembolsos</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.totalReembolsos}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(estatisticas.valorTotal)}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <ArrowLeft className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(estatisticas.valorMedio)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovados</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticas.reembolsosAprovados}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{estatisticas.reembolsosPendentes}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                  <p className="text-2xl font-bold text-red-600">{estatisticas.reembolsosRejeitados}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabela de Reembolsos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Lista de Reembolsos</h2>
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
                      Data Solicitação
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
                      Motivo
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
                    {loadingReembolsos ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                          Carregando reembolsos...
                        </td>
                      </motion.tr>
                    ) : reembolsosFiltrados.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                          Nenhum reembolso encontrado
                        </td>
                      </motion.tr>
                    ) : (
                      reembolsosFiltrados.map((reembolso) => (
                        <motion.tr
                          key={reembolso.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{reembolso.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatarData(reembolso.data_solicitacao)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{reembolso.cliente?.nome || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{reembolso.cliente?.telefone || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatarMoeda(reembolso.valor)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reembolso.status)}`}>
                              {getStatusIcon(reembolso.status)}
                              <span className="ml-1">{getStatusText(reembolso.status)}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="max-w-xs truncate" title={reembolso.motivo}>
                              {reembolso.motivo}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reembolso.forma_pagamento}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900" title="Ver detalhes">
                                <Eye className="w-4 h-4" />
                              </button>
                              {reembolso.status === 'pendente' && (
                                <>
                                  <button className="text-green-600 hover:text-green-900" title="Aprovar">
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-900" title="Rejeitar">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button className="text-purple-600 hover:text-purple-900" title="Gerar relatório">
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