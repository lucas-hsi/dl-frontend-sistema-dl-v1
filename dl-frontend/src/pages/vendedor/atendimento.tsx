import LayoutVendedor from '@/components/layout/LayoutVendedor';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Award,
  Car,
  Clock,
  HeadphonesIcon,
  MessageCircle,
  MessageSquare,
  Package,
  Phone,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Star,
  Tag,
  Target,
  TrendingUp,
  User,
  X
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

// Interfaces otimizadas
interface LeadQualificado {
  conversa_id: number;
  numero_whatsapp: string;
  nome_cliente?: string;
  qualificacao: 'urgente' | 'interessado' | 'consulta' | 'follow_up';
  score_lead: number;
  peca_interesse?: string;
  modelo_veiculo?: string;
  cidade?: string;
  tempo_espera: number;
  prioridade: 'alta' | 'media' | 'baixa';
  valor_estimado?: number;
  criado_em: string;
  tags?: string[];
}

interface Conversa {
  id: number;
  numero_whatsapp: string;
  nome_cliente?: string;
  status: 'ativa' | 'pausada' | 'finalizada';
  qualificacao?: string;
  score_lead: number;
  peca_interesse?: string;
  modelo_veiculo?: string;
  ano_veiculo?: string;
  cidade?: string;
  vendedor_id?: number;
  ultima_mensagem?: string;
  ultima_atualizacao: string;
  criado_em: string;
  valor_estimado?: number;
  mensagens: Mensagem[];
}

interface Mensagem {
  id: number;
  conversa_id: number;
  tipo: 'cliente' | 'vendedor' | 'ia' | 'sistema';
  conteudo: string;
  timestamp: string;
  dados_extras?: any;
  status?: 'enviada' | 'entregue' | 'lida';
}

interface Metricas {
  totalLeads: number;
  leadsUrgentes: number;
  conversasAtivas: number;
  scoreMedio: number;
  tempoMedioEspera: number;
  conversionRate: number;
  valorTotalPotencial: number;
}

const AtendimentoPage: React.FC = () => {
  const { user } = useAuth();

  // Estados principais
  const [filaLeads, setFilaLeads] = useState<LeadQualificado[]>([]);
  const [conversasAtivas, setConversasAtivas] = useState<Conversa[]>([]);
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para filtros e busca
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroQualificacao, setFiltroQualificacao] = useState('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todos');
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<'score' | 'tempo' | 'valor' | 'prioridade'>('score');
  const [viewMode, setViewMode] = useState<'cards' | 'lista' | 'kanban'>('cards');
  const [abaAtiva, setAbaAtiva] = useState<'fila' | 'conversas' | 'analytics'>('fila');

  // Estados para métricas
  const [metricas, setMetricas] = useState<Metricas>({
    totalLeads: 0,
    leadsUrgentes: 0,
    conversasAtivas: 0,
    scoreMedio: 0,
    tempoMedioEspera: 0,
    conversionRate: 0,
    valorTotalPotencial: 0
  });

  // Dados mock para demonstração
  const leadsMock: LeadQualificado[] = [
    {
      conversa_id: 1,
      numero_whatsapp: '(11) 99999-9999',
      nome_cliente: 'João Silva',
      qualificacao: 'urgente',
      score_lead: 9,
      peca_interesse: 'Freio dianteiro',
      modelo_veiculo: 'Honda Civic 2020',
      cidade: 'São Paulo',
      tempo_espera: 5,
      prioridade: 'alta',
      valor_estimado: 450,
      criado_em: '2024-01-15T10:30:00Z',
      tags: ['Cliente Fiel', 'Oficina']
    },
    {
      conversa_id: 2,
      numero_whatsapp: '(11) 88888-8888',
      nome_cliente: 'Maria Santos',
      qualificacao: 'interessado',
      score_lead: 7,
      peca_interesse: 'Amortecedor',
      modelo_veiculo: 'Toyota Corolla 2019',
      cidade: 'São Paulo',
      tempo_espera: 12,
      prioridade: 'media',
      valor_estimado: 680,
      criado_em: '2024-01-15T10:25:00Z',
      tags: ['Primeira Compra']
    },
    {
      conversa_id: 3,
      numero_whatsapp: '(11) 77777-7777',
      nome_cliente: 'Carlos Oliveira',
      qualificacao: 'follow_up',
      score_lead: 8,
      peca_interesse: 'Kit embreagem',
      modelo_veiculo: 'Volkswagen Golf 2021',
      cidade: 'Santo André',
      tempo_espera: 3,
      prioridade: 'alta',
      valor_estimado: 1200,
      criado_em: '2024-01-15T10:20:00Z',
      tags: ['Follow-up', 'Alto Valor']
    }
  ];

  const conversasMock: Conversa[] = [
    {
      id: 4,
      numero_whatsapp: '(11) 66666-6666',
      nome_cliente: 'Ana Oliveira',
      status: 'ativa',
      qualificacao: 'interessado',
      score_lead: 8,
      peca_interesse: 'Pneu dianteiro',
      modelo_veiculo: 'Volkswagen Golf 2021',
      ano_veiculo: '2021',
      cidade: 'São Paulo',
      vendedor_id: user ? Number(user.id) : undefined,
      ultima_mensagem: 'Gostaria de saber o preço do pneu',
      ultima_atualizacao: '2024-01-15T10:35:00Z',
      criado_em: '2024-01-15T10:00:00Z',
      valor_estimado: 320,
      mensagens: [
        {
          id: 1,
          conversa_id: 4,
          tipo: 'cliente',
          conteudo: 'Olá, gostaria de saber o preço do pneu para Golf 2021',
          timestamp: '2024-01-15T10:00:00Z',
          status: 'lida'
        },
        {
          id: 2,
          conversa_id: 4,
          tipo: 'ia',
          conteudo: 'Olá Ana! 👋 Vou verificar o preço do pneu para o seu Volkswagen Golf 2021. Você precisa do pneu dianteiro, correto?',
          timestamp: '2024-01-15T10:01:00Z',
          status: 'lida'
        },
        {
          id: 3,
          conversa_id: 4,
          tipo: 'cliente',
          conteudo: 'Sim, exato! Preciso trocar os dois pneus da frente.',
          timestamp: '2024-01-15T10:02:00Z',
          status: 'lida'
        }
      ]
    }
  ];

  // Carregar dados iniciais
  useEffect(() => {
    if (user?.id) {
      carregarDados();
    }
  }, [user]);

  const carregarDados = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simular carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFilaLeads(leadsMock);
      setConversasAtivas(conversasMock);

      // Calcular métricas
      const totalLeads = leadsMock.length + conversasMock.length;
      const leadsUrgentes = leadsMock.filter(l => l.qualificacao === 'urgente').length;
      const scoreMedio = leadsMock.length > 0 ?
        Math.round(leadsMock.reduce((acc, l) => acc + l.score_lead, 0) / leadsMock.length) : 0;
      const tempoMedio = leadsMock.length > 0 ?
        Math.round(leadsMock.reduce((acc, l) => acc + l.tempo_espera, 0) / leadsMock.length) : 0;
      const valorTotal = [...leadsMock, ...conversasMock].reduce((acc, item) =>
        acc + (item.valor_estimado || 0), 0);

      setMetricas({
        totalLeads,
        leadsUrgentes,
        conversasAtivas: conversasMock.length,
        scoreMedio,
        tempoMedioEspera: tempoMedio,
        conversionRate: 67,
        valorTotalPotencial: valorTotal
      });

    } catch (error) {
      toast.error('Erro ao carregar dados do atendimento');
      console.error('Erro:', error);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  // Filtrar e ordenar leads
  const leadsFiltrados = useMemo(() => {
    let leads = [...filaLeads];

    // Aplicar filtros
    if (filtroQualificacao !== 'todos') {
      leads = leads.filter(l => l.qualificacao === filtroQualificacao);
    }
    if (filtroPrioridade !== 'todos') {
      leads = leads.filter(l => l.prioridade === filtroPrioridade);
    }
    if (busca) {
      leads = leads.filter(l =>
        l.nome_cliente?.toLowerCase().includes(busca.toLowerCase()) ||
        l.peca_interesse?.toLowerCase().includes(busca.toLowerCase()) ||
        l.modelo_veiculo?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Aplicar ordenação
    leads.sort((a, b) => {
      switch (ordenacao) {
        case 'score':
          return b.score_lead - a.score_lead;
        case 'tempo':
          return a.tempo_espera - b.tempo_espera;
        case 'valor':
          return (b.valor_estimado || 0) - (a.valor_estimado || 0);
        case 'prioridade':
          const prioridadeOrder = { alta: 3, media: 2, baixa: 1 };
          return prioridadeOrder[b.prioridade] - prioridadeOrder[a.prioridade];
        default:
          return 0;
      }
    });

    return leads;
  }, [filaLeads, filtroQualificacao, filtroPrioridade, busca, ordenacao]);

  const assumirAtendimento = async (conversaId: number) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Simular assumir atendimento
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mover lead da fila para conversas ativas
      const lead = filaLeads.find(l => l.conversa_id === conversaId);
      if (lead) {
        const novaConversa: Conversa = {
          id: conversaId,
          numero_whatsapp: lead.numero_whatsapp,
          nome_cliente: lead.nome_cliente,
          status: 'ativa',
          qualificacao: lead.qualificacao,
          score_lead: lead.score_lead,
          peca_interesse: lead.peca_interesse,
          modelo_veiculo: lead.modelo_veiculo,
          cidade: lead.cidade,
          vendedor_id: Number(user.id),
          ultima_mensagem: 'Atendimento assumido',
          ultima_atualizacao: new Date().toISOString(),
          criado_em: lead.criado_em,
          valor_estimado: lead.valor_estimado,
          mensagens: []
        };

        setConversasAtivas(prev => [...prev, novaConversa]);
        setFilaLeads(prev => prev.filter(l => l.conversa_id !== conversaId));

        toast.success(`Atendimento de ${lead.nome_cliente} assumido!`);
      }
    } catch (error) {
      toast.error('Erro ao assumir atendimento');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const selecionarConversa = (conversa: Conversa) => {
    setConversaSelecionada(conversa);
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !conversaSelecionada) return;

    try {
      const mensagem: Mensagem = {
        id: Date.now(),
        conversa_id: conversaSelecionada.id,
        tipo: 'vendedor',
        conteudo: novaMensagem,
        timestamp: new Date().toISOString(),
        status: 'enviada'
      };

      // Atualizar conversa selecionada
      const conversaAtualizada = {
        ...conversaSelecionada,
        mensagens: [...conversaSelecionada.mensagens, mensagem],
        ultima_mensagem: novaMensagem,
        ultima_atualizacao: new Date().toISOString()
      };

      setConversaSelecionada(conversaAtualizada);
      setConversasAtivas(prev =>
        prev.map(c => c.id === conversaSelecionada.id ? conversaAtualizada : c)
      );
      setNovaMensagem('');

      toast.success('Mensagem enviada!');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    }
  };

  const getQualificacaoColor = (qualificacao: string) => {
    const cores = {
      urgente: 'bg-red-100 text-red-800 border-red-200',
      interessado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      consulta: 'bg-blue-100 text-blue-800 border-blue-200',
      follow_up: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return cores[qualificacao as keyof typeof cores] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPrioridadeColor = (prioridade: string) => {
    const cores = {
      alta: 'bg-red-500',
      media: 'bg-yellow-500',
      baixa: 'bg-green-500'
    };
    return cores[prioridade as keyof typeof cores] || 'bg-gray-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTempo = (minutos: number) => {
    if (minutos < 60) return `${minutos}min`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  };

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <LayoutVendedor>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header Premium */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl rounded-3xl">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                  <HeadphonesIcon className="text-yellow-300" size={32} />
                  Central de Atendimento
                </h1>
                <p className="text-blue-100 text-lg">Gestão inteligente de leads e conversas</p>
              </div>

              <div className="flex gap-8">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold text-yellow-300 flex items-center gap-2">
                    <Activity size={24} />
                    {metricas.totalLeads}
                  </div>
                  <div className="text-blue-100">Total Leads</div>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-bold text-red-300 flex items-center gap-2">
                    <AlertTriangle size={24} />
                    {metricas.leadsUrgentes}
                  </div>
                  <div className="text-blue-100">Urgentes</div>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-bold text-green-300 flex items-center gap-2">
                    <TrendingUp size={24} />
                    {metricas.conversionRate}%
                  </div>
                  <div className="text-blue-100">Conversão</div>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-bold text-purple-300 flex items-center gap-2">
                    <Sparkles size={24} />
                    {formatMoeda(metricas.valorTotalPotencial)}
                  </div>
                  <div className="text-blue-100">Valor Potencial</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Navegação das Abas */}
          <div className="bg-white rounded-2xl shadow-xl mb-8 p-2">
            <div className="flex gap-2">
              {[
                { id: 'fila', label: 'Fila de Atendimento', icon: Clock, count: filaLeads.length },
                { id: 'conversas', label: 'Conversas Ativas', icon: MessageCircle, count: conversasAtivas.length },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp, count: null }
              ].map((aba) => (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id as any)}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all ${abaAtiva === aba.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <aba.icon size={20} />
                  {aba.label}
                  {aba.count !== null && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${abaAtiva === aba.id
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-600'
                      }`}>
                      {aba.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo das Abas */}
          <AnimatePresence mode="wait">
            {abaAtiva === 'fila' && (
              <motion.div
                key="fila"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Controles e Filtros */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Buscar por nome, peça ou modelo..."
                          value={busca}
                          onChange={(e) => setBusca(e.target.value)}
                          className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-80"
                        />
                      </div>

                      <select
                        value={filtroQualificacao}
                        onChange={(e) => setFiltroQualificacao(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="todos">Todas Qualificações</option>
                        <option value="urgente">Urgente</option>
                        <option value="interessado">Interessado</option>
                        <option value="consulta">Consulta</option>
                        <option value="follow_up">Follow-up</option>
                      </select>

                      <select
                        value={filtroPrioridade}
                        onChange={(e) => setFiltroPrioridade(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="todos">Todas Prioridades</option>
                        <option value="alta">Alta</option>
                        <option value="media">Média</option>
                        <option value="baixa">Baixa</option>
                      </select>

                      <select
                        value={ordenacao}
                        onChange={(e) => setOrdenacao(e.target.value as any)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="score">Score</option>
                        <option value="tempo">Tempo de Espera</option>
                        <option value="valor">Valor Estimado</option>
                        <option value="prioridade">Prioridade</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={carregarDados}
                        disabled={refreshing}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={20} />
                        Atualizar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de Leads */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leadsFiltrados.map((lead) => (
                    <motion.div
                      key={lead.conversa_id}
                      className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Header do Card */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${getPrioridadeColor(lead.prioridade)}`}></div>
                            <h3 className="font-bold text-gray-900 text-lg">{lead.nome_cliente}</h3>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getQualificacaoColor(lead.qualificacao)}`}>
                            {lead.qualificacao.toUpperCase()}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-2 rounded-lg font-bold ${getScoreColor(lead.score_lead)}`}>
                            <Star className="inline mr-1" size={16} />
                            {lead.score_lead}/10
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={16} />
                            <span className="font-medium">{formatTempo(lead.tempo_espera)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Conteúdo do Card */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <Phone className="text-blue-600" size={18} />
                          <span className="font-medium">{lead.numero_whatsapp}</span>
                        </div>

                        {lead.peca_interesse && (
                          <div className="flex items-center gap-3">
                            <Package className="text-green-600" size={18} />
                            <span>{lead.peca_interesse}</span>
                          </div>
                        )}

                        {lead.modelo_veiculo && (
                          <div className="flex items-center gap-3">
                            <Car className="text-purple-600" size={18} />
                            <span>{lead.modelo_veiculo}</span>
                          </div>
                        )}

                        {lead.valor_estimado && (
                          <div className="flex items-center gap-3">
                            <Tag className="text-orange-600" size={18} />
                            <span className="font-semibold text-green-600">
                              {formatMoeda(lead.valor_estimado)}
                            </span>
                          </div>
                        )}

                        {lead.tags && lead.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {lead.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer do Card */}
                      <div className="p-6 bg-gray-50 border-t">
                        <button
                          onClick={() => assumirAtendimento(lead.conversa_id)}
                          disabled={loading}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <User size={18} />
                          {loading ? 'Assumindo...' : 'Assumir Atendimento'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {leadsFiltrados.length === 0 && (
                  <div className="text-center py-16">
                    <HeadphonesIcon size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum lead na fila</h3>
                    <p className="text-gray-500">Todos os leads foram atendidos ou não há novos leads no momento.</p>
                  </div>
                )}
              </motion.div>
            )}

            {abaAtiva === 'conversas' && (
              <motion.div
                key="conversas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Lista de Conversas */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MessageCircle className="text-blue-600" />
                      Conversas Ativas ({conversasAtivas.length})
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {conversasAtivas.map((conversa) => (
                        <div
                          key={conversa.id}
                          onClick={() => selecionarConversa(conversa)}
                          className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${conversaSelecionada?.id === conversa.id
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-blue-50'
                            }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{conversa.nome_cliente}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(conversa.ultima_atualizacao).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conversa.ultima_mensagem}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getScoreColor(conversa.score_lead)}`}>
                              {conversa.score_lead}/10
                            </span>
                            {conversa.valor_estimado && (
                              <span className="text-xs text-green-600 font-semibold">
                                {formatMoeda(conversa.valor_estimado)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="lg:col-span-2">
                  {conversaSelecionada ? (
                    <div className="bg-white rounded-2xl shadow-xl h-96 flex flex-col">
                      {/* Header do Chat */}
                      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{conversaSelecionada.nome_cliente}</h3>
                            <p className="text-gray-600">{conversaSelecionada.numero_whatsapp}</p>
                          </div>
                          <button
                            onClick={() => setConversaSelecionada(null)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Mensagens */}
                      <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {conversaSelecionada.mensagens.map((mensagem) => (
                          <div
                            key={mensagem.id}
                            className={`flex ${mensagem.tipo === 'vendedor' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-3 rounded-2xl ${mensagem.tipo === 'vendedor'
                                ? 'bg-blue-600 text-white'
                                : mensagem.tipo === 'ia'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                              <p>{mensagem.conteudo}</p>
                              <p className={`text-xs mt-1 ${mensagem.tipo === 'vendedor' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                {new Date(mensagem.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Input de Mensagem */}
                      <div className="p-6 border-t">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={novaMensagem}
                            onChange={(e) => setNovaMensagem(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                          />
                          <button
                            onClick={enviarMensagem}
                            disabled={!novaMensagem.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <Send size={18} />
                            Enviar
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-xl h-96 flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Selecione uma conversa</h3>
                        <p className="text-gray-500">Escolha uma conversa da lista para iniciar o atendimento</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {abaAtiva === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {/* Cards de Métricas */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <TrendingUp className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Score Médio</h3>
                      <p className="text-2xl font-bold text-blue-600">{metricas.scoreMedio}/10</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Qualidade dos leads recebidos</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <Clock className="text-yellow-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Tempo Médio</h3>
                      <p className="text-2xl font-bold text-yellow-600">{formatTempo(metricas.tempoMedioEspera)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Tempo de espera dos leads</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Target className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Taxa Conversão</h3>
                      <p className="text-2xl font-bold text-green-600">{metricas.conversionRate}%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Leads convertidos em vendas</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Award className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Valor Potencial</h3>
                      <p className="text-2xl font-bold text-purple-600">{formatMoeda(metricas.valorTotalPotencial)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Receita estimada dos leads</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LayoutVendedor>
  );
};

export default AtendimentoPage; 