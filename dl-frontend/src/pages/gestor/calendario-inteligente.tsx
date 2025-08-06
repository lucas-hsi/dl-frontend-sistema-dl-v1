import { api } from "@/config/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Search,
  Upload,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import LayoutGestor from "../../components/layout/LayoutGestor";

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  data_limite: string;
  categoria: string;
  acoes: string[];
  documentos: Documento[];
  ia_sugestoes: string[];
  notificacoes: Notificacao[];
}

interface Documento {
  id: string;
  nome: string;
  tipo: 'pdf' | 'xml' | 'imagem' | 'outro';
  tamanho: string;
  data_upload: string;
  processado: boolean;
  analise_ia: string;
}

interface Notificacao {
  id: string;
  tipo: 'lembrete' | 'atraso' | 'conclusao' | 'ia';
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  prioridade: 'baixa' | 'media' | 'alta';
}

interface Evento {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  tipo: 'reuniao' | 'deadline' | 'lembrete' | 'ia';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  categoria: string;
}

// Componente Calendario Premium
interface CalendarioPremiumProps {
  tarefas: Tarefa[];
}

function CalendarioPremium({ tarefas }: CalendarioPremiumProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getWeekDays = () => {
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  };

  const hasTaskOnDate = (day: number) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return tarefas.some(tarefa => {
      const tarefaDate = new Date(tarefa.data_limite);
      return tarefaDate.getDate() === day &&
        tarefaDate.getMonth() === currentDate.getMonth() &&
        tarefaDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return selectedDate &&
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear();
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const weekDays = getWeekDays();

  return (
    <div className="space-y-4">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          📅 {getMonthName(currentDate)}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center p-2 text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Dias do mês */}
      <div className="grid grid-cols-7 gap-1">
        {/* Dias vazios no início */}
        {Array.from({ length: startingDayOfWeek }, (_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}

        {/* Dias do mês */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const hasTask = hasTaskOnDate(day);
          const today = isToday(day);
          const selected = isSelected(day);

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleDateClick(day)}
              className={`text-center p-2 text-sm rounded-lg cursor-pointer transition-all relative ${selected ? 'bg-blue-500 text-white font-medium' :
                today ? 'bg-blue-100 text-blue-700 font-medium' :
                  hasTask ? 'bg-purple-100 text-purple-700 font-medium' :
                    'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {day}
              {hasTask && !selected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"></div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Informações do dia selecionado */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            {selectedDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </h4>
          {tarefas.filter(tarefa => {
            const tarefaDate = new Date(tarefa.data_limite);
            return tarefaDate.getDate() === selectedDate.getDate() &&
              tarefaDate.getMonth() === selectedDate.getMonth() &&
              tarefaDate.getFullYear() === selectedDate.getFullYear();
          }).map(tarefa => (
            <div key={tarefa.id} className="text-xs text-blue-700 bg-blue-100 p-2 rounded mb-1">
              {tarefa.titulo}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CalendarioInteligentePage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Documento[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showIA, setShowIA] = useState(false);
  const [showNotificacoes, setShowNotificacoes] = useState(false);
  const [showNovaTarefa, setShowNovaTarefa] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todos');
  const [loading, setLoading] = useState(false);

  // Estados para nova tarefa
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media' as const,
    categoria: '',
    data_limite: ''
  });

  // Carregar dados reais
  const carregarDados = async () => {
    try {
      setLoading(true);

      // Carregar tarefas do backend
      const response = await api.get('/calendario/tarefas');
      setTarefas(response.data.tarefas || []);

      // Carregar notificações
      const notifResponse = await api.get('/calendario/notificacoes');
      setNotificacoes(notifResponse.data.notificacoes || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Dados mockados como fallback
      setTarefas([
        {
          id: "1",
          titulo: "Emitir nota das vendas Shopify",
          descricao: "Faturar vendas do dia 29/01 - R$ 2.450,00",
          status: 'pendente',
          prioridade: 'alta',
          data_limite: "2025-01-29",
          categoria: "fiscal",
          acoes: ["Emitir NF-e", "Enviar por email", "Registrar no sistema"],
          documentos: [
            {
              id: "doc1",
              nome: "vendas_shopify_29_01.pdf",
              tipo: "pdf",
              tamanho: "2.3 MB",
              data_upload: "2025-01-28",
              processado: true,
              analise_ia: "Documento analisado: 15 vendas identificadas, total R$ 2.450,00. Sugestão: Emitir NF-e até 29/01."
            }
          ],
          ia_sugestoes: [
            "Priorizar emissão de NF-e para evitar atrasos",
            "Verificar dados dos clientes antes da emissão",
            "Preparar relatório de vendas para gestão"
          ],
          notificacoes: [
            {
              id: "not1",
              tipo: "lembrete",
              titulo: "Deadline NF-e",
              mensagem: "Emitir nota fiscal até amanhã",
              data: "2025-01-28",
              lida: false,
              prioridade: "alta"
            }
          ]
        },
        {
          id: "2",
          titulo: "Revisar preços dos produtos",
          descricao: "Análise de preços sugerida pela IA para 8 produtos",
          status: 'em_andamento',
          prioridade: 'media',
          data_limite: "2025-01-30",
          categoria: "precificacao",
          acoes: ["Analisar concorrência", "Ajustar preços", "Atualizar sistema"],
          documentos: [],
          ia_sugestoes: [
            "Aumentar preço do Capô Golf em 8%",
            "Manter preço do Parachoque Civic",
            "Reduzir preço do Farol Corolla"
          ],
          notificacoes: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Criar nova tarefa
  const criarNovaTarefa = async () => {
    try {
      setLoading(true);

      const response = await api.post('/calendario/tarefas', novaTarefa);

      if (response.data.success) {
        toast.success('Tarefa criada com sucesso!');
        setShowNovaTarefa(false);
        setNovaTarefa({
          titulo: '',
          descricao: '',
          prioridade: 'media',
          categoria: '',
          data_limite: ''
        });
        await carregarDados(); // Recarregar dados
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  // Alterar status da tarefa
  const alterarStatus = async (id: string, novoStatus: Tarefa['status']) => {
    try {
      setLoading(true);

      const response = await api.put(`/calendario/tarefas/${id}/status`, {
        status: novoStatus
      });

      if (response.data.success) {
        setTarefas(tarefas.map(tarefa =>
          tarefa.id === id ? { ...tarefa, status: novoStatus } : tarefa
        ));
        toast.success('Status atualizado!');
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status');
    } finally {
      setLoading(false);
    }
  };

  // Marcar notificação como lida
  const marcarNotificacaoComoLida = async (id: string) => {
    try {
      const response = await api.put(`/calendario/notificacoes/${id}/lida`);

      if (response.data.success) {
        setNotificacoes(prev => prev.map(not =>
          not.id === id ? { ...not, lida: true } : not
        ));
      }
    } catch (error) {
      console.error('Erro ao marcar notificação:', error);
    }
  };

  // Processar documento
  const processarDocumento = async (file: File) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('arquivo', file);

      const response = await api.post('/calendario/documentos/processar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Documento processado com sucesso!');
        await carregarDados(); // Recarregar dados
      }
    } catch (error) {
      console.error('Erro ao processar documento:', error);
      toast.error('Erro ao processar documento');
    } finally {
      setLoading(false);
    }
  };

  // Funções auxiliares
  const obterCorPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case 'critica': return 'bg-red-500';
      case 'alta': return 'bg-orange-500';
      case 'media': return 'bg-yellow-500';
      case 'baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'atrasada': return 'bg-red-100 text-red-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processarDocumento(file);
    }
  };

  // Filtros funcionais
  const tarefasFiltradas = tarefas.filter(tarefa => {
    const matchStatus = filtroStatus === 'todos' || tarefa.status === filtroStatus;
    const matchPrioridade = filtroPrioridade === 'todos' || tarefa.prioridade === filtroPrioridade;
    const matchBusca = busca === '' ||
      tarefa.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      tarefa.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      tarefa.categoria.toLowerCase().includes(busca.toLowerCase());

    return matchStatus && matchPrioridade && matchBusca;
  });

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <LayoutGestor>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        {/* Header Premium - Padrão Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl"
        >
          {/* Título e Botões - Mesmo padrão do Dashboard */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                🧠 Calendário Inteligente
              </h1>
              <p className="text-blue-100 text-lg">
                IA organizadora de tarefas e compromissos
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">IA Ativa</span>
              </div>

              <button
                onClick={() => setShowIA(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200"
              >
                <Brain className="w-5 h-5" />
                IA Sugestões
              </button>

              <button
                onClick={() => setShowNotificacoes(true)}
                className="relative bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                Notificações
                {notificacoesNaoLidas > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {notificacoesNaoLidas}
                  </motion.div>
                )}
              </button>
            </div>
          </div>

          {/* Cards de Status - Mesmo padrão do Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-80 mb-1">Concluídas</p>
                  <p className="text-3xl font-bold">
                    {tarefas.filter(t => t.status === 'concluida').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-80 mb-1">Pendentes</p>
                  <p className="text-3xl font-bold">
                    {tarefas.filter(t => t.status === 'pendente').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-80 mb-1">Atrasadas</p>
                  <p className="text-3xl font-bold">
                    {tarefas.filter(t => t.status === 'atrasada').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-80 mb-1">IA Sugestões</p>
                  <p className="text-3xl font-bold">
                    {tarefas.reduce((total, t) => total + t.ia_sugestoes.length, 0)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Layout Principal - Calendário + Kanban */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Kanban Board - 75% da largura */}
          <div className="lg:col-span-3">
            {/* Barra de Controles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-8"
            >
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Busca Funcional */}
                <div className="flex-1 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar tarefas..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filtros Funcionais */}
                <div className="flex gap-4">
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="atrasada">Atrasada</option>
                  </select>

                  <select
                    value={filtroPrioridade}
                    onChange={(e) => setFiltroPrioridade(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todas as Prioridades</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>

                {/* Botão Nova Tarefa Funcional */}
                <button
                  onClick={() => setShowNovaTarefa(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Nova Tarefa
                </button>
              </div>
            </motion.div>

            {/* Kanban Board */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {/* Pendentes */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-center p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  ⏳ Pendentes ({tarefasFiltradas.filter(t => t.status === 'pendente').length})
                </h3>
                <AnimatePresence>
                  {tarefasFiltradas.filter(t => t.status === 'pendente').map(tarefa => (
                    <motion.div
                      key={tarefa.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white border border-yellow-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-800 text-sm">{tarefa.titulo}</h4>
                        <div className={`w-3 h-3 rounded-full ${obterCorPrioridade(tarefa.prioridade)}`}></div>
                      </div>
                      <p className="text-gray-600 text-xs mb-3">{tarefa.descricao}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => alterarStatus(tarefa.id, 'em_andamento')}
                          disabled={loading}
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                        >
                          {loading ? '...' : 'Iniciar'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Em Andamento */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                  🔄 Em Andamento ({tarefasFiltradas.filter(t => t.status === 'em_andamento').length})
                </h3>
                <AnimatePresence>
                  {tarefasFiltradas.filter(t => t.status === 'em_andamento').map(tarefa => (
                    <motion.div
                      key={tarefa.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-800 text-sm">{tarefa.titulo}</h4>
                        <div className={`w-3 h-3 rounded-full ${obterCorPrioridade(tarefa.prioridade)}`}></div>
                      </div>
                      <p className="text-gray-600 text-xs mb-3">{tarefa.descricao}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => alterarStatus(tarefa.id, 'concluida')}
                          disabled={loading}
                          className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 disabled:opacity-50"
                        >
                          {loading ? '...' : 'Concluir'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Concluídas */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-center p-3 bg-green-50 rounded-xl border border-green-200">
                  ✅ Concluídas ({tarefasFiltradas.filter(t => t.status === 'concluida').length})
                </h3>
                <AnimatePresence>
                  {tarefasFiltradas.filter(t => t.status === 'concluida').map(tarefa => (
                    <motion.div
                      key={tarefa.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white border border-green-200 rounded-xl p-4 shadow-sm opacity-75"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-800 text-sm line-through">{tarefa.titulo}</h4>
                        <div className={`w-3 h-3 rounded-full ${obterCorPrioridade(tarefa.prioridade)}`}></div>
                      </div>
                      <p className="text-gray-600 text-xs mb-3">{tarefa.descricao}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Atrasadas */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-center p-3 bg-red-50 rounded-xl border border-red-200">
                  ⚠️ Atrasadas ({tarefasFiltradas.filter(t => t.status === 'atrasada').length})
                </h3>
                <AnimatePresence>
                  {tarefasFiltradas.filter(t => t.status === 'atrasada').map(tarefa => (
                    <motion.div
                      key={tarefa.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white border border-red-200 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-800 text-sm">{tarefa.titulo}</h4>
                        <div className={`w-3 h-3 rounded-full ${obterCorPrioridade(tarefa.prioridade)}`}></div>
                      </div>
                      <p className="text-gray-600 text-xs mb-3">{tarefa.descricao}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => alterarStatus(tarefa.id, 'em_andamento')}
                          disabled={loading}
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                        >
                          {loading ? '...' : 'Retomar'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Modal Nova Tarefa */}
            <AnimatePresence>
              {showNovaTarefa && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Plus className="w-6 h-6 text-blue-600" />
                        Nova Tarefa
                      </h3>
                      <button
                        onClick={() => setShowNovaTarefa(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                        <input
                          type="text"
                          value={novaTarefa.titulo}
                          onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Digite o título da tarefa"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                        <textarea
                          value={novaTarefa.descricao}
                          onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Digite a descrição da tarefa"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                          <select
                            value={novaTarefa.prioridade}
                            onChange={(e) => setNovaTarefa({ ...novaTarefa, prioridade: e.target.value as any })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                            <option value="critica">Crítica</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                          <input
                            type="text"
                            value={novaTarefa.categoria}
                            onChange={(e) => setNovaTarefa({ ...novaTarefa, categoria: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: fiscal, vendas"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Limite</label>
                        <input
                          type="date"
                          value={novaTarefa.data_limite}
                          onChange={(e) => setNovaTarefa({ ...novaTarefa, data_limite: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => setShowNovaTarefa(false)}
                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={criarNovaTarefa}
                        disabled={loading || !novaTarefa.titulo}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Criando...' : 'Criar Tarefa'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Upload Documentos */}
            <AnimatePresence>
              {showUpload && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Upload className="w-6 h-6 text-blue-600" />
                        Upload de Documentos
                      </h3>
                      <button
                        onClick={() => setShowUpload(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Arraste documentos aqui ou clique para selecionar
                      </p>
                      <p className="text-sm text-gray-500">
                        Suporta PDF, XML, imagens e outros formatos
                      </p>
                      <input
                        type="file"
                        onChange={(e) => e.target.files?.[0] && processarDocumento(e.target.files[0])}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                      >
                        Selecionar Arquivo
                      </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-4">Documentos Processados</h4>
                        <ul className="space-y-2">
                          {uploadedFiles.map((doc) => (
                            <li key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-sm">{doc.nome}</p>
                                <p className="text-xs text-gray-500">{doc.tamanho} • {doc.data_upload}</p>
                              </div>
                              <div className="text-xs text-gray-600">{doc.analise_ia}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => setShowUpload(false)}
                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Fechar
                      </button>
                      <button
                        onClick={() => setShowUpload(false)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Processar
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal IA Sugestões */}
            <AnimatePresence>
              {showIA && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Brain className="w-6 h-6 text-purple-600" />
                        Sugestões da IA
                      </h3>
                      <button
                        onClick={() => setShowIA(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {tarefas.map(tarefa => (
                        tarefa.ia_sugestoes.length > 0 && (
                          <div key={tarefa.id} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">{tarefa.titulo}</h4>
                            <div className="space-y-2">
                              {tarefa.ia_sugestoes.map((sugestao, index) => (
                                <div key={index} className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                                  <Brain className="w-4 h-4 text-purple-600 mt-0.5" />
                                  <p className="text-sm text-gray-700">{sugestao}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Notificações */}
            <AnimatePresence>
              {showNotificacoes && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell className="w-6 h-6 text-blue-600" />
                        Notificações
                      </h3>
                      <button
                        onClick={() => setShowNotificacoes(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {notificacoes.map(notificacao => (
                        <motion.div
                          key={notificacao.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg border-l-4 ${notificacao.prioridade === 'alta' ? 'border-red-500 bg-red-50' :
                            notificacao.prioridade === 'media' ? 'border-yellow-500 bg-yellow-50' :
                              'border-blue-500 bg-blue-50'
                            } ${!notificacao.lida ? 'ring-2 ring-blue-200' : ''}`}
                          onClick={() => marcarNotificacaoComoLida(notificacao.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">{notificacao.titulo}</p>
                              <p className="text-xs text-gray-600 mt-1">{notificacao.mensagem}</p>
                              <p className="text-xs text-gray-500 mt-1">{notificacao.data}</p>
                            </div>
                            {!notificacao.lida && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Calendário Lateral - 25% da largura */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
            >
              <CalendarioPremium tarefas={tarefas} />

              {/* Botão Upload Reposicionado */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowUpload(true)}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border border-gray-200"
                >
                  <Upload className="w-4 h-4" />
                  📤 Enviar Documentos
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </LayoutGestor>
  );
} 