import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import LayoutVendedor from '../../components/layout/LayoutVendedor';
import AcoesRapidas from '../../components/vendedor/AcoesRapidas';
import CalendarioDrawer from '../../components/vendedor/CalendarioDrawer';
import DicasDoDia from '../../components/vendedor/DicasDoDia';
import DrawerNotificacoes from '../../components/vendedor/DrawerNotificacoes';
import FeedbackIA from '../../components/vendedor/FeedbackIA';
import IAFeedback from '../../components/vendedor/IAFeedback';
import MetricasDestaque from '../../components/vendedor/MetricasDestaque';
import PainelHeader from '../../components/vendedor/PainelHeader';
import ProximasEntregas from '../../components/vendedor/ProximasEntregas';
import { VendedorService } from '../../services/vendedorService';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

/**
 * Dashboard principal do vendedor
 * Página modularizada com componentes reutilizáveis
 */
export default function DashboardVendedor() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCalendario, setShowCalendario] = useState(false);
  const [showNotificacoes, setShowNotificacoes] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await VendedorService.loadDashboardData(1);
      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCalendario = () => {
    setShowCalendario(true);
  };

  const handleCloseCalendario = () => {
    setShowCalendario(false);
  };

  const handleOpenNotificacoes = () => {
    setShowNotificacoes(true);
  };

  const handleCloseNotificacoes = () => {
    setShowNotificacoes(false);
  };

  if (loading) {
    return (
      <LayoutVendedor>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </LayoutVendedor>
    );
  }

  // Dados mockados para os novos componentes
  const dicasDoDia = [
    { id: 1, texto: "Continue fazendo follow-ups rápidos para aumentar a taxa de fechamento", tipo: "success" as const },
    { id: 2, texto: "Foque em orçamentos acima de R$ 500 para maximizar o ticket médio", tipo: "tip" as const },
    { id: 3, texto: "Use mais chamadas diretas para fechar vendas mais rapidamente", tipo: "info" as const }
  ];

  const proximasEntregas = dashboardData?.proximasEntregas || [
    { id: 1, cliente: "João Silva", produto: "Filtro de Ar", data: "2025-01-28", status: "em_transito" as const },
    { id: 2, cliente: "Maria Santos", produto: "Pastilha de Freio", data: "2025-01-29", status: "preparando" as const }
  ];

  return (
    <ProtectedRoute allowedRoles={['VENDEDOR']}>
      <LayoutVendedor>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Header Premium */}
          <div className="px-6 pt-6">
            <PainelHeader
              performanceScore={dashboardData?.performanceScore || 0}
              onOpenCalendario={handleOpenCalendario}
              onOpenNotificacoes={handleOpenNotificacoes}
            />
          </div>

          {/* Métricas Destacadas */}
          <div className="px-6 py-4">
            <MetricasDestaque vendedorId={1} />
          </div>

          {/* Layout Principal - Duas Colunas Centralizadas */}
          <div className="px-6 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coluna 1 (Esquerda) */}
                <div className="space-y-6">
                  <AcoesRapidas vendedorId={1} />

                  {/* Agenda do Dia Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Agenda do Dia</h3>
                          <p className="text-gray-600">Seus compromissos de hoje</p>
                        </div>
                      </div>
                      <button
                        onClick={handleOpenCalendario}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ver Todos
                      </button>
                    </div>

                    <div className="space-y-3">
                      {dashboardData?.eventosCalendario?.slice(0, 3).map((evento: any) => (
                        <div key={evento.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">{evento.titulo}</h4>
                            <p className="text-xs text-gray-600">{evento.hora}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Coluna 2 (Direita) */}
                <div className="space-y-6">
                  <IAFeedback vendedorId={1} />

                  <DicasDoDia dicas={dicasDoDia} />

                  <ProximasEntregas entregas={proximasEntregas} />

                  <FeedbackIA vendedorId={1} />
                </div>
              </div>
            </div>
          </div>

          {/* Drawer do Calendário */}
          <CalendarioDrawer
            isOpen={showCalendario}
            onClose={handleCloseCalendario}
            eventos={dashboardData?.eventosCalendario || []}
            vendedorId={1}
          />

          {/* Drawer das Notificações */}
          <DrawerNotificacoes
            isOpen={showNotificacoes}
            onClose={handleCloseNotificacoes}
            vendedorId={1}
          />

          {/* Botão Flutuante de Notificações */}
          <button
            onClick={handleOpenNotificacoes}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-30"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
              3
            </span>
          </button>
        </div>
      </LayoutVendedor>
    </ProtectedRoute>
  );
} 