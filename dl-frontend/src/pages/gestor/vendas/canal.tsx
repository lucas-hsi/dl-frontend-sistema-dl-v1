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
  Smartphone,
  Monitor,
  Globe,
  Store,
  Filter,
  Download
} from "lucide-react";
import LayoutGestor from "@/components/layout/LayoutGestor";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function VendasPorCanal() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [periodo, setPeriodo] = useState('30_dias');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted || !user || user.perfil !== "GESTOR") {
    return null;
  }

  // Mock de dados de vendas por canal
  const vendasPorCanal = {
    mercado_livre: {
      vendas: 28500.00,
      pedidos: 47,
      crescimento: 15.8,
      participacao: 45.2,
      ticket_medio: 606.38
    },
    balcao: {
      vendas: 22800.00,
      pedidos: 32,
      crescimento: 8.3,
      participacao: 36.1,
      ticket_medio: 712.50
    },
    whatsapp: {
      vendas: 8900.00,
      pedidos: 18,
      crescimento: 22.1,
      participacao: 14.1,
      ticket_medio: 494.44
    },
    site_proprio: {
      vendas: 2900.00,
      pedidos: 8,
      crescimento: 45.2,
      participacao: 4.6,
      ticket_medio: 362.50
    }
  };

  const totalVendas = Object.values(vendasPorCanal).reduce((sum, canal) => sum + canal.vendas, 0);
  const totalPedidos = Object.values(vendasPorCanal).reduce((sum, canal) => sum + canal.pedidos, 0);

  const getChannelIcon = (canal: string) => {
    switch (canal) {
      case 'mercado_livre': return Globe;
      case 'balcao': return Store;
      case 'whatsapp': return Smartphone;
      case 'site_proprio': return Monitor;
      default: return ShoppingCart;
    }
  };

  const getChannelColor = (canal: string) => {
    switch (canal) {
      case 'mercado_livre': return 'bg-yellow-500';
      case 'balcao': return 'bg-blue-500';
      case 'whatsapp': return 'bg-green-500';
      case 'site_proprio': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getChannelName = (canal: string) => {
    switch (canal) {
      case 'mercado_livre': return 'Mercado Livre';
      case 'balcao': return 'Balcão';
      case 'whatsapp': return 'WhatsApp';
      case 'site_proprio': return 'Site Próprio';
      default: return canal;
    }
  };

  return (
    <ProtectedRoute>
      <LayoutGestor>
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BarChart3 className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Vendas por Canal</h1>
                  <p className="text-green-100 opacity-90">Análise de performance por canal de vendas</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">R$ {totalVendas.toLocaleString('pt-BR')}</div>
                <div className="text-green-100 text-sm">total vendas</div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-800">Período de Análise</h3>
              </div>
              <div className="flex gap-2">
                {[
                  { key: '7_dias', label: '7 dias' },
                  { key: '30_dias', label: '30 dias' },
                  { key: '90_dias', label: '90 dias' },
                  { key: '6_meses', label: '6 meses' }
                ].map(period => (
                  <button
                    key={period.key}
                    onClick={() => setPeriodo(period.key)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      periodo === period.key 
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

          {/* KPIs Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Vendas</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {totalVendas.toLocaleString('pt-BR')}
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
                  <p className="text-sm text-gray-600 mb-1">Total Pedidos</p>
                  <p className="text-2xl font-bold text-blue-600">{totalPedidos}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ticket Médio</p>
                  <p className="text-2xl font-bold text-purple-600">
                    R$ {(totalVendas / totalPedidos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Canais Ativos</p>
                  <p className="text-2xl font-bold text-orange-600">4</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Canais */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cards de Performance por Canal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(vendasPorCanal).map(([canal, dados]) => {
                  const Icon = getChannelIcon(canal);
                  const colorClass = getChannelColor(canal);
                  
                  return (
                    <div key={canal} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-bold text-gray-800">{getChannelName(canal)}</h3>
                        </div>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          dados.crescimento > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {dados.crescimento > 0 ? '+' : ''}{dados.crescimento}%
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Vendas:</span>
                          <span className="font-bold text-gray-800">
                            R$ {dados.vendas.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Pedidos:</span>
                          <span className="font-bold text-gray-800">{dados.pedidos}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Ticket Médio:</span>
                          <span className="font-bold text-gray-800">
                            R$ {dados.ticket_medio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Participação:</span>
                          <span className="font-bold text-gray-800">{dados.participacao}%</span>
                        </div>
                        
                        {/* Barra de Participação */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${colorClass}`}
                            style={{ width: `${dados.participacao}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gráfico de Evolução */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  Evolução de Vendas por Canal
                </h3>
                
                <div className="space-y-4">
                  {/* Mock de gráfico com barras */}
                  <div className="grid grid-cols-7 gap-2 h-40">
                    {Array.from({ length: 7 }, (_, i) => {
                      const mlHeight = Math.random() * 60 + 20;
                      const balcaoHeight = Math.random() * 50 + 15;
                      const whatsHeight = Math.random() * 30 + 10;
                      const siteHeight = Math.random() * 20 + 5;
                      
                      return (
                        <div key={i} className="flex flex-col justify-end items-center space-y-1">
                          <div 
                            className="w-full bg-yellow-500 rounded-t-lg"
                            style={{ height: `${mlHeight}%` }}
                          ></div>
                          <div 
                            className="w-full bg-blue-500"
                            style={{ height: `${balcaoHeight}%` }}
                          ></div>
                          <div 
                            className="w-full bg-green-500"
                            style={{ height: `${whatsHeight}%` }}
                          ></div>
                          <div 
                            className="w-full bg-purple-500 rounded-b-lg"
                            style={{ height: `${siteHeight}%` }}
                          ></div>
                          <p className="text-xs text-gray-500 mt-2">
                            {i + 1}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Legenda */}
                  <div className="flex items-center justify-center gap-6 border-t pt-4">
                    {Object.entries(vendasPorCanal).map(([canal, dados]) => {
                      const colorClass = getChannelColor(canal);
                      return (
                        <div key={canal} className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${colorClass} rounded`}></div>
                          <span className="text-sm text-gray-600">{getChannelName(canal)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar com Insights */}
            <div className="space-y-6">
              {/* Gráfico de Pizza - Participação */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-500" />
                  Participação por Canal
                </h4>
                
                {/* Mock de gráfico de pizza com CSS */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-500 via-blue-500 to-purple-500"></div>
                </div>
                
                <div className="space-y-2">
                  {Object.entries(vendasPorCanal).map(([canal, dados]) => {
                    const colorClass = getChannelColor(canal);
                    return (
                      <div key={canal} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${colorClass} rounded-full`}></div>
                          <span className="text-sm text-gray-600">{getChannelName(canal)}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{dados.participacao}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Maiores Crescimentos
                </h4>
                
                <div className="space-y-3">
                  {Object.entries(vendasPorCanal)
                    .sort(([,a], [,b]) => b.crescimento - a.crescimento)
                    .map(([canal, dados], index) => {
                      const Icon = getChannelIcon(canal);
                      const colorClass = getChannelColor(canal);
                      
                      return (
                        <div key={canal} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${colorClass} rounded-lg flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{getChannelName(canal)}</p>
                              <p className="text-xs text-gray-500">#{index + 1} posição</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-green-600">+{dados.crescimento}%</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h4>
                
                <div className="space-y-3">
                  <button className="w-full bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar Relatório
                  </button>
                  
                  <button className="w-full bg-green-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtros Avançados
                  </button>
                  
                  <button className="w-full bg-purple-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Análise Detalhada
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutGestor>
    </ProtectedRoute>
  );
} 