import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator,
  Download,
  Calendar,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  FileText,
  Upload,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/config/api';

interface RelatorioContabilidade {
  faturamento_total: number;
  custos_totais: number;
  lucro_bruto: number;
  margem_lucro: number;
  vendas_realizadas: number;
  ticket_medio: number;
  variacao_mes_anterior: number;
  receitas_por_categoria: Array<{
    categoria: string;
    valor: number;
    percentual: number;
  }>;
  despesas_por_categoria: Array<{
    categoria: string;
    valor: number;
    percentual: number;
  }>;
}

interface BalancoMensal {
  ativos: number;
  passivos: number;
  patrimonio_liquido: number;
  receitas: number;
  despesas: number;
  resultado: number;
}

interface MovimentacaoCaixa {
  id: number;
  data: string;
  descricao: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  categoria: string;
  observacoes?: string;
}

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ id, label, icon, active, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {icon}
    {label}
  </motion.button>
);

export default function RelatoriosContabilidade() {
  const [activeTab, setActiveTab] = useState('contabilidade');
  const [loading, setLoading] = useState(false);
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [relatorio, setRelatorio] = useState<RelatorioContabilidade | null>(null);
  const [balanco, setBalanco] = useState<BalancoMensal | null>(null);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoCaixa[]>([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const tabs = [
    { id: 'contabilidade', label: 'Contabilidade', icon: <Calculator size={20} /> },
    { id: 'balanco', label: 'Balanço', icon: <BarChart3 size={20} /> },
    { id: 'caixa', label: 'Caixa', icon: <DollarSign size={20} /> }
  ];

  useEffect(() => {
    carregarRelatorioContabilidade();
  }, [ano, mes]);

  const carregarRelatorioContabilidade = async () => {
    setLoading(true);
    try {
      const [relatorioData, balancoData] = await Promise.all([
        api.get(`/relatorios/contabilidade?ano=${ano}&mes=${mes}`),
        api.get(`/relatorios/balanco?ano=${ano}&mes=${mes}`)
      ]);
      
      setRelatorio(relatorioData.data);
      setBalanco(balancoData.data);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const carregarMovimentacoesCaixa = async () => {
    if (!dataInicio || !dataFim) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/relatorios/caixa?data_inicio=${dataInicio}&data_fim=${dataFim}`);
      setMovimentacoes(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
      toast.error('Erro ao carregar movimentações');
    } finally {
      setLoading(false);
    }
  };

  // Exportar relatório de contabilidade
  const handleExportarContabilidade = async () => {
    try {
      setLoadingActions(prev => ({ ...prev, exportarContabilidade: true }));
      
      const response = await api.get(`/relatorios/contabilidade/exportar?ano=${ano}&mes=${mes}`, {
        responseType: 'blob'
      });
      
      // Criar download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-contabilidade-${ano}-${mes}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast.error('Erro ao exportar relatório');
    } finally {
      setLoadingActions(prev => ({ ...prev, exportarContabilidade: false }));
    }
  };

  // Exportar balanço
  const handleExportarBalanco = async () => {
    try {
      setLoadingActions(prev => ({ ...prev, exportarBalanco: true }));
      
      const response = await api.get(`/relatorios/balanco/exportar?ano=${ano}&mes=${mes}`, {
        responseType: 'blob'
      });
      
      // Criar download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `balanco-${ano}-${mes}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Balanço exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar balanço:', error);
      toast.error('Erro ao exportar balanço');
    } finally {
      setLoadingActions(prev => ({ ...prev, exportarBalanco: false }));
    }
  };

  // Exportar movimentações de caixa
  const handleExportarCaixa = async () => {
    if (!dataInicio || !dataFim) {
      toast.error('Selecione o período para exportar');
      return;
    }

    try {
      setLoadingActions(prev => ({ ...prev, exportarCaixa: true }));
      
      const response = await api.get(`/relatorios/caixa/exportar?data_inicio=${dataInicio}&data_fim=${dataFim}`, {
        responseType: 'blob'
      });
      
      // Criar download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `movimentacoes-caixa-${dataInicio}-${dataFim}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Movimentações exportadas com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar movimentações:', error);
      toast.error('Erro ao exportar movimentações');
    } finally {
      setLoadingActions(prev => ({ ...prev, exportarCaixa: false }));
    }
  };

  // Gerar relatório personalizado
  const handleGerarRelatorioPersonalizado = async () => {
    try {
      setLoadingActions(prev => ({ ...prev, relatorioPersonalizado: true }));
      
      const response = await api.post('/relatorios/personalizado', {
        ano,
        mes,
        data_inicio: dataInicio,
        data_fim: dataFim,
        tipo: activeTab
      });
      
      toast.success('Relatório personalizado gerado com sucesso!');
      // Aqui você pode abrir um modal com o relatório ou fazer download
      
    } catch (error) {
      console.error('Erro ao gerar relatório personalizado:', error);
      toast.error('Erro ao gerar relatório personalizado');
    } finally {
      setLoadingActions(prev => ({ ...prev, relatorioPersonalizado: false }));
    }
  };

  // Importar dados contábeis
  const handleImportarDadosContabeis = async (file: File) => {
    try {
      setLoadingActions(prev => ({ ...prev, importar: true }));
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo', 'contabilidade');
      
      const response = await api.post('/relatorios/importar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Dados importados com sucesso!');
      await carregarRelatorioContabilidade();
      
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      toast.error('Erro ao importar dados');
    } finally {
      setLoadingActions(prev => ({ ...prev, importar: false }));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getVariationIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight size={16} />;
    if (value < 0) return <ArrowDownRight size={16} />;
    return <Minus size={16} />;
  };

  const getVariationColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Calculator className="w-8 h-8" />
              Relatórios de Contabilidade
            </h1>
            <p className="text-blue-100 text-lg">
              Análise completa da situação financeira da empresa
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleGerarRelatorioPersonalizado}
              disabled={loadingActions.relatorioPersonalizado}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
            >
              <FileText className="w-5 h-5" />
              {loadingActions.relatorioPersonalizado ? 'Gerando...' : 'Relatório Personalizado'}
            </button>

            <button
              onClick={carregarRelatorioContabilidade}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
              <select
                value={ano}
                onChange={(e) => setAno(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
              <select
                value={mes}
                onChange={(e) => setMes(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {new Date(2024, month - 1).toLocaleDateString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeTab === 'caixa' && (
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={carregarMovimentacoesCaixa}
                disabled={loading || !dataInicio || !dataFim}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtrar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 mb-8">
        <div className="flex items-center gap-4 mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {/* Conteúdo das Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'contabilidade' && (
            <motion.div
              key="contabilidade"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando relatório...</p>
                </div>
              ) : relatorio ? (
                <>
                  {/* Métricas Principais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Faturamento Total</p>
                          <p className="text-2xl font-bold">{formatCurrency(relatorio.faturamento_total)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-100 text-sm">Custos Totais</p>
                          <p className="text-2xl font-bold">{formatCurrency(relatorio.custos_totais)}</p>
                        </div>
                        <Calculator className="w-8 h-8 text-red-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Lucro Bruto</p>
                          <p className="text-2xl font-bold">{formatCurrency(relatorio.lucro_bruto)}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-200" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Margem de Lucro</p>
                          <p className="text-2xl font-bold">{formatPercentage(relatorio.margem_lucro)}</p>
                        </div>
                        <PieChart className="w-8 h-8 text-purple-200" />
                      </div>
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Receitas por Categoria</h3>
                      <div className="space-y-3">
                        {relatorio.receitas_por_categoria.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-700">{item.categoria}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{formatCurrency(item.valor)}</span>
                              <span className="text-sm text-gray-500">({formatPercentage(item.percentual)})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Despesas por Categoria</h3>
                      <div className="space-y-3">
                        {relatorio.despesas_por_categoria.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-700">{item.categoria}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{formatCurrency(item.valor)}</span>
                              <span className="text-sm text-gray-500">({formatPercentage(item.percentual)})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botão Exportar */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleExportarContabilidade}
                      disabled={loadingActions.exportarContabilidade}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      {loadingActions.exportarContabilidade ? 'Exportando...' : 'Exportar Relatório'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Nenhum dado disponível</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'balanco' && (
            <motion.div
              key="balanco"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando balanço...</p>
                </div>
              ) : balanco ? (
                <>
                  {/* Balanço */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Ativos</h3>
                      <p className="text-3xl font-bold">{formatCurrency(balanco.ativos)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Passivos</h3>
                      <p className="text-3xl font-bold">{formatCurrency(balanco.passivos)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Patrimônio Líquido</h3>
                      <p className="text-3xl font-bold">{formatCurrency(balanco.patrimonio_liquido)}</p>
                    </div>
                  </div>

                  {/* Resultado */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Resultado do Período</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Receitas</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(balanco.receitas)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Despesas</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(balanco.despesas)}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Resultado</p>
                      <p className={`text-2xl font-bold ${balanco.resultado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(balanco.resultado)}
                      </p>
                    </div>
                  </div>

                  {/* Botão Exportar */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleExportarBalanco}
                      disabled={loadingActions.exportarBalanco}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      {loadingActions.exportarBalanco ? 'Exportando...' : 'Exportar Balanço'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Nenhum dado disponível</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'caixa' && (
            <motion.div
              key="caixa"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando movimentações...</p>
                </div>
              ) : movimentacoes.length > 0 ? (
                <>
                  {/* Lista de Movimentações */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Data</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Descrição</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Categoria</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tipo</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {movimentacoes.map((mov) => (
                            <tr key={mov.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {new Date(mov.data).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{mov.descricao}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{mov.categoria}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  mov.tipo === 'entrada' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                </span>
                              </td>
                              <td className={`px-6 py-4 text-sm font-semibold ${
                                mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatCurrency(mov.valor)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Botão Exportar */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleExportarCaixa}
                      disabled={loadingActions.exportarCaixa}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      {loadingActions.exportarCaixa ? 'Exportando...' : 'Exportar Movimentações'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Nenhuma movimentação encontrada</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 