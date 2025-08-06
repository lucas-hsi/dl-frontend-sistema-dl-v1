import React, { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Award, 
  Target,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  BarChart3,
  Star,
  Trophy,
  User
} from "lucide-react";
import LayoutGestor from "@/components/layout/LayoutGestor";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface VendedorPerformance {
  id: string;
  nome: string;
  email: string;
  foto: string;
  vendas_total: number;
  pedidos_total: number;
  ticket_medio: number;
  crescimento: number;
  meta_mensal: number;
  percentual_meta: number;
  produtos_vendidos: number;
  clientes_atendidos: number;
  avaliacao_clientes: number;
  tempo_empresa: string;
  canal_preferido: string;
  status: 'ativo' | 'ferias' | 'afastado';
}

export default function VendasPorVendedor() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [periodo, setPeriodo] = useState('30_dias');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'vendas' | 'pedidos' | 'ticket' | 'meta'>('vendas');

  // Mock de dados de vendedores
  const [vendedores] = useState<VendedorPerformance[]>([
    {
      id: "1",
      nome: "Carlos Silva",
      email: "carlos@dl.com",
      // EXCEÇÃO CONTROLADA: serviço externo para geração de avatares
      foto: "https://ui-avatars.com/api/?name=Carlos+Silva&background=3b82f6&color=fff",
      vendas_total: 18500.00,
      pedidos_total: 28,
      ticket_medio: 660.71,
      crescimento: 15.2,
      meta_mensal: 20000.00,
      percentual_meta: 92.5,
      produtos_vendidos: 85,
      clientes_atendidos: 45,
      avaliacao_clientes: 4.8,
      tempo_empresa: "2 anos",
      canal_preferido: "Balcão",
      status: "ativo"
    },
    {
      id: "2", 
      nome: "Ana Costa",
      email: "ana@dl.com",
      // EXCEÇÃO CONTROLADA: serviço externo para geração de avatares
      foto: "https://ui-avatars.com/api/?name=Ana+Costa&background=10b981&color=fff",
      vendas_total: 22100.00,
      pedidos_total: 35,
      ticket_medio: 631.43,
      crescimento: 28.7,
      meta_mensal: 18000.00,
      percentual_meta: 122.8,
      produtos_vendidos: 102,
      clientes_atendidos: 58,
      avaliacao_clientes: 4.9,
      tempo_empresa: "1.5 anos",
      canal_preferido: "WhatsApp",
      status: "ativo"
    },
    {
      id: "3",
      nome: "Roberto Oliveira",
      email: "roberto@dl.com", 
      // EXCEÇÃO CONTROLADA: serviço externo para geração de avatares
      foto: "https://ui-avatars.com/api/?name=Roberto+Oliveira&background=f59e0b&color=fff",
      vendas_total: 14200.00,
      pedidos_total: 22,
      ticket_medio: 645.45,
      crescimento: 5.1,
      meta_mensal: 16000.00,
      percentual_meta: 88.8,
      produtos_vendidos: 67,
      clientes_atendidos: 34,
      avaliacao_clientes: 4.6,
      tempo_empresa: "3 anos",
      canal_preferido: "Mercado Livre",
      status: "ativo"
    },
    {
      id: "4",
      nome: "Juliana Santos",
      email: "juliana@dl.com",
      // EXCEÇÃO CONTROLADA: serviço externo para geração de avatares
      foto: "https://ui-avatars.com/api/?name=Juliana+Santos&background=8b5cf6&color=fff",
      vendas_total: 9800.00,
      pedidos_total: 18,
      ticket_medio: 544.44,
      crescimento: -2.3,
      meta_mensal: 15000.00,
      percentual_meta: 65.3,
      produtos_vendidos: 52,
      clientes_atendidos: 28,
      avaliacao_clientes: 4.4,
      tempo_empresa: "8 meses",
      canal_preferido: "Balcão",
      status: "ferias"
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted || !user || user.perfil !== "GESTOR") {
    return null;
  }

  // Filtrar e ordenar vendedores
  const vendedoresFiltrados = vendedores
    .filter(vendedor => 
      vendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendedor.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'vendas': return b.vendas_total - a.vendas_total;
        case 'pedidos': return b.pedidos_total - a.pedidos_total;
        case 'ticket': return b.ticket_medio - a.ticket_medio;
        case 'meta': return b.percentual_meta - a.percentual_meta;
        default: return 0;
      }
    });

  // Estatísticas gerais
  const estatisticas = {
    total_vendedores: vendedores.length,
    vendedores_ativos: vendedores.filter(v => v.status === 'ativo').length,
    vendas_total: vendedores.reduce((sum, v) => sum + v.vendas_total, 0),
    meta_geral: (vendedores.reduce((sum, v) => sum + v.percentual_meta, 0) / vendedores.length),
    melhor_vendedor: vendedores.sort((a, b) => b.vendas_total - a.vendas_total)[0]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'ferias': return 'bg-blue-100 text-blue-800';
      case 'afastado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetaColor = (percentual: number) => {
    if (percentual >= 100) return 'text-green-600';
    if (percentual >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Users className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Vendas por Vendedor</h1>
                  <p className="text-blue-100 opacity-90">Performance individual da equipe de vendas</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{estatisticas.vendedores_ativos}</div>
                <div className="text-blue-100 text-sm">vendedores ativos</div>
              </div>
            </div>
          </div>

          {/* KPIs Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Vendas</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {estatisticas.vendas_total.toLocaleString('pt-BR')}
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
                  <p className="text-sm text-gray-600 mb-1">Meta Geral</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {estatisticas.meta_geral.toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Vendedores Ativos</p>
                  <p className="text-2xl font-bold text-purple-600">{estatisticas.vendedores_ativos}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Top Performer</p>
                  <p className="text-lg font-bold text-yellow-600">{estatisticas.melhor_vendedor?.nome}</p>
                  <p className="text-sm text-gray-500">
                    R$ {estatisticas.melhor_vendedor?.vendas_total.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Controles */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Período:</span>
                  <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="7_dias">7 dias</option>
                    <option value="30_dias">30 dias</option>
                    <option value="90_dias">90 dias</option>
                    <option value="6_meses">6 meses</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="vendas">Vendas</option>
                    <option value="pedidos">Pedidos</option>
                    <option value="ticket">Ticket Médio</option>
                    <option value="meta">% Meta</option>
                  </select>
                </div>

                <button className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar vendedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
            </div>
          </div>

          {/* Ranking de Vendedores */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Ranking de Performance
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ranking</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Vendedor</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Vendas/Meta</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Performance</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Avaliação</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Canal</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vendedoresFiltrados.map((vendedor, index) => (
                    <tr key={vendedor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                          <span className="font-bold text-lg text-gray-800">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={vendedor.foto} 
                            alt={vendedor.nome}
                            className="w-12 h-12 rounded-full border-2 border-gray-200"
                          />
                          <div>
                            <div className="font-medium text-gray-800">{vendedor.nome}</div>
                            <div className="text-sm text-gray-600">{vendedor.email}</div>
                            <div className="text-xs text-gray-500">{vendedor.tempo_empresa} na empresa</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div>
                            <div className="font-bold text-green-600">
                              R$ {vendedor.vendas_total.toLocaleString('pt-BR')}
                            </div>
                            <div className="text-sm text-gray-600">
                              Meta: R$ {vendedor.meta_mensal.toLocaleString('pt-BR')}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${vendedor.percentual_meta >= 100 ? 'bg-green-500' : vendedor.percentual_meta >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(vendedor.percentual_meta, 100)}%` }}
                            ></div>
                          </div>
                          <div className={`text-sm font-medium ${getMetaColor(vendedor.percentual_meta)}`}>
                            {vendedor.percentual_meta.toFixed(1)}% da meta
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            {vendedor.pedidos_total} pedidos
                          </div>
                          <div className="text-sm text-gray-600">
                            Ticket: R$ {vendedor.ticket_medio.toFixed(2)}
                          </div>
                          <div className={`text-sm font-medium flex items-center gap-1 ${
                            vendedor.crescimento > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingUp className="w-3 h-3" />
                            {vendedor.crescimento > 0 ? '+' : ''}{vendedor.crescimento}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            {renderStars(Math.floor(vendedor.avaliacao_clientes))}
                            <span className="text-sm text-gray-600 ml-1">
                              {vendedor.avaliacao_clientes}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {vendedor.clientes_atendidos} clientes
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {vendedor.canal_preferido}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vendedor.status)}`}>
                          {vendedor.status === 'ativo' ? 'Ativo' : 
                           vendedor.status === 'ferias' ? 'Férias' : 'Afastado'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <User className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {vendedoresFiltrados.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum vendedor encontrado</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Tente ajustar os filtros de busca
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 