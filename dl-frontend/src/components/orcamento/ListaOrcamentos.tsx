// src/components/orcamento/ListaOrcamentos.tsx
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  User,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { useVenda } from '../../contexts/VendaContext';
import { orcamentoService, Orcamento } from '../../services/orcamentoService';
import { FiltroOrcamento, StatusOrcamento } from '../../types/orcamento';
import { MetricasOrcamentos } from '../../services/orcamentoService';
import { CriarOrcamento } from './CriarOrcamento';
import OrcamentoCard from './OrcamentoCard';

export default function ListaOrcamentos() {
  const { vendedor } = useVenda();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [estatisticas, setEstatisticas] = useState<MetricasOrcamentos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState<StatusOrcamento | null>(null);
  const [showFiltros, setShowFiltros] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const carregarOrcamentos = async (filtro?: FiltroOrcamento) => {
    if (!vendedor) {
      setError('Vendedor não identificado');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await orcamentoService.listarOrcamentos(filtro);
      setOrcamentos(response);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const carregarEstatisticas = async () => {
    setIsLoadingStats(true);
    try {
      const stats = await orcamentoService.obterMetricas();
      setEstatisticas(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Não mostrar erro para estatísticas, apenas log
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    carregarOrcamentos();
    carregarEstatisticas();
  }, [vendedor]);

  const handleFiltroStatus = (status: StatusOrcamento | null) => {
    setFiltroAtivo(status);
    const filtro: FiltroOrcamento = status ? { status } : {};
    carregarOrcamentos(filtro);
  };

  const handleStatusChange = (orcamentoId: number, novoStatus: StatusOrcamento) => {
    setOrcamentos(prev =>
      prev.map(orcamento =>
        orcamento.id === orcamentoId
          ? { ...orcamento, status: novoStatus as any }
          : orcamento
      )
    );
    // Recarregar estatísticas após mudança de status
    carregarEstatisticas();
  };

  const handleReabrir = (orcamentoId: number) => {
    setOrcamentos(prev =>
      prev.map(orcamento =>
        orcamento.id === orcamentoId
          ? { ...orcamento, status: StatusOrcamento.PENDENTE as any }
          : orcamento
      )
    );
    // Recarregar estatísticas após reabertura
    carregarEstatisticas();
  };

  const handleRefresh = () => {
    carregarOrcamentos();
    carregarEstatisticas();
  };

  const handleOrcamentoCriado = () => {
    setDrawerOpen(false);
    carregarOrcamentos();
    carregarEstatisticas();
  };

  const getStatusCount = (status: StatusOrcamento) => {
    return orcamentos.filter(o => o.status === status).length;
  };

  const orcamentosFiltrados = orcamentos.filter(orcamento => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        orcamento.cliente_nome?.toLowerCase().includes(term) ||
        orcamento.id.toString().includes(term) ||
        orcamento.vendedor_nome?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getStatusText = (status: StatusOrcamento) => {
    switch (status) {
      case StatusOrcamento.PENDENTE:
        return 'Pendentes';
      case StatusOrcamento.NEGOCIANDO:
        return 'Negociando';
      case StatusOrcamento.APROVADO:
        return 'Aprovados';
      case StatusOrcamento.CONCLUIDO:
        return 'Concluídos';
      case StatusOrcamento.CANCELADO:
        return 'Cancelados';
      default:
        return 'Todos';
    }
  };

  const getStatusColor = (status: StatusOrcamento) => {
    switch (status) {
      case StatusOrcamento.PENDENTE:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case StatusOrcamento.NEGOCIANDO:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case StatusOrcamento.APROVADO:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case StatusOrcamento.CONCLUIDO:
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case StatusOrcamento.CANCELADO:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusIcon = (status: StatusOrcamento) => {
    switch (status) {
      case StatusOrcamento.PENDENTE:
        return <Clock size={16} />;
      case StatusOrcamento.NEGOCIANDO:
        return <User size={16} />;
      case StatusOrcamento.APROVADO:
        return <CheckCircle size={16} />;
      case StatusOrcamento.CONCLUIDO:
        return <CheckCircle size={16} />;
      case StatusOrcamento.CANCELADO:
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Se não há vendedor, mostrar erro
  if (!vendedor) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Vendedor não identificado
          </h3>
          <p className="text-gray-600">
            Não foi possível identificar o vendedor. Verifique sua sessão.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Orçamentos</h1>
          <p className="text-gray-600">
            Gerencie todos os orçamentos do vendedor: <strong>{vendedor.nome}</strong>
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowFiltros(!showFiltros)}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            <Filter size={16} className="mr-2" />
            Filtros
          </Button>

          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw size={16} className="mr-2" />
            Atualizar
          </Button>

          <Button
            onClick={() => setDrawerOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus size={16} className="mr-2" />
            Novo Orçamento
          </Button>
        </div>
      </div>

      {/* Drawer lateral para criar orçamento */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay escuro */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar drawer"
          />
          {/* Drawer lateral */}
          <div className="relative ml-auto w-full max-w-xl h-full bg-white shadow-xl animate-slide-in-right overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setDrawerOpen(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <div className="p-6 pt-10">
              <CriarOrcamento
                vendedorId={vendedor.id}
                onOrcamentoCriado={handleOrcamentoCriado}
                onCancelar={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dashboard/Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Orçamentos */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Orçamentos</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoadingStats ? '...' : estatisticas?.totalOrcamentos || orcamentos.length}
              </p>
            </div>
            <BarChart3 size={24} className="text-blue-500" />
          </div>
        </div>

        {/* Valor Total */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoadingStats ? '...' : formatarValor(estatisticas?.valorTotalPotencial || 0)}
              </p>
            </div>
            <DollarSign size={24} className="text-green-500" />
          </div>
        </div>

        {/* Valor Médio */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Médio</p>
              <p className="text-2xl font-bold text-purple-600">
                {isLoadingStats ? '...' : formatarValor(estatisticas?.valorMedioOrcamento || 0)}
              </p>
            </div>
            <TrendingUp size={24} className="text-purple-500" />
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-orange-600">
                {isLoadingStats ? '...' :
                  estatisticas && estatisticas.totalOrcamentos > 0
                    ? `${Math.round(((estatisticas.orcamentosPorStatus.aprovado + estatisticas.orcamentosPorStatus.concluido) / estatisticas.totalOrcamentos) * 100)}%`
                    : '0%'
                }
              </p>
            </div>
            <CheckCircle size={24} className="text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      {showFiltros && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Filtros</h3>

          {/* Busca */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, ID ou vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtros de Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleFiltroStatus(null)}
                className={`${!filtroAtivo ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-blue-700`}
              >
                Todos ({orcamentos.length})
              </Button>

              {Object.values(StatusOrcamento).map((status) => (
                <Button
                  key={status}
                  onClick={() => handleFiltroStatus(status)}
                  className={`${filtroAtivo === status ? 'bg-blue-600 text-white' : getStatusColor(status)} hover:bg-blue-700`}
                >
                  {getStatusIcon(status)}
                  <span className="ml-1">{getStatusText(status)} ({getStatusCount(status)})</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle size={20} className="text-red-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar orçamentos</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-3">
            <Button
              onClick={handleRefresh}
              className="bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      )}

      {/* Estatísticas Detalhadas por Status */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock size={20} className="text-yellow-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-lg font-bold text-yellow-600">
                {getStatusCount(StatusOrcamento.PENDENTE)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <User size={20} className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Negociando</p>
              <p className="text-lg font-bold text-blue-600">
                {getStatusCount(StatusOrcamento.NEGOCIANDO)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <User size={20} className="text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Aprovados</p>
              <p className="text-lg font-bold text-green-600">
                {getStatusCount(StatusOrcamento.APROVADO)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <User size={20} className="text-purple-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-lg font-bold text-purple-600">
                {getStatusCount(StatusOrcamento.CONCLUIDO)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <User size={20} className="text-red-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Cancelados</p>
              <p className="text-lg font-bold text-red-600">
                {getStatusCount(StatusOrcamento.CANCELADO)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Orçamentos */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Orçamentos ({orcamentosFiltrados.length})
          </h2>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <RefreshCw size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Carregando orçamentos...</p>
              </div>
            </div>
          ) : orcamentosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <User size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum orçamento encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Não há orçamentos cadastrados ainda.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => window.location.href = '/ponto-de-venda'}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Criar Primeiro Orçamento
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {orcamentosFiltrados.map((orcamento) => (
                <OrcamentoCard
                  key={orcamento.id}
                  orcamento={orcamento as any}
                  onStatusChange={handleStatusChange}
                  onReabrir={handleReabrir}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 