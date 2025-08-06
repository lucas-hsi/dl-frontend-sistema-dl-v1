import LayoutVendedor from '@/components/layout/LayoutVendedor';
import { useAuth } from '@/contexts/AuthContext';
import { orcamentoService, type CalculoFreteRequest, type OpcaoFrete } from '@/services/orcamentoService';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Package,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Truck,
  User,
  XCircle,
  Zap
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

// Interfaces
interface Orcamento {
  id: number;
  numero_orcamento: string;
  cliente_id: number;
  cliente_nome: string;
  vendedor_id: number;
  vendedor_nome: string;
  status: 'pendente' | 'enviado' | 'aprovado' | 'rejeitado' | 'expirado' | 'convertido' | 'concluido';
  valor_total: number;
  valor_potencial: number;
  taxa_conversao: number;
  validade_orcamento: string;
  data_criacao: string;
  pdf_gerado: boolean;
  enviado_whatsapp: boolean;
  total_itens: number;
  observacoes?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  dias_restantes: number;
  frete_valor?: number;
  frete_transportadora?: string;
  frete_prazo_entrega?: number;
  frete_tipo?: string;
  frete_cep_destino?: string;
}

interface Metricas {
  totalOrcamentos: number;
  orcamentosPendentes: number;
  orcamentosAprovados: number;
  valorTotalPotencial: number;
  taxaConversaoGeral: number;
  orcamentosExpirados: number;
  valorConvertido: number;
}

const OrcamentosPage: React.FC = () => {
  const { user } = useAuth();

  // Estados principais
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);

  // Estados para filtros
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todos');
  const [ordenacao, setOrdenacao] = useState<'data' | 'valor' | 'prioridade' | 'vencimento'>('data');

  // Estados para frete
  const [mostrarFrete, setMostrarFrete] = useState(false);
  const [cepDestino, setCepDestino] = useState('');
  const [opcoesFrete, setOpcoesFrete] = useState<OpcaoFrete[]>([]);
  const [calculandoFrete, setCalculandoFrete] = useState(false);
  const [freteSelecionado, setFreteSelecionado] = useState<OpcaoFrete | null>(null);

  // Estados para métricas
  const [metricas, setMetricas] = useState<Metricas>({
    totalOrcamentos: 0,
    orcamentosPendentes: 0,
    orcamentosAprovados: 0,
    valorTotalPotencial: 0,
    taxaConversaoGeral: 0,
    orcamentosExpirados: 0,
    valorConvertido: 0
  });

  // Carregar dados da API

  // Carregar dados
  useEffect(() => {
    carregarOrcamentos();
    carregarMetricas();
  }, []);

  const carregarOrcamentos = async () => {
    setLoading(true);
    try {
      const response = await orcamentoService.listarOrcamentos();
      if (response && typeof response === 'object' && 'sucesso' in response && response.sucesso === true && 'orcamentos' in response && Array.isArray((response as any).orcamentos)) {
        setOrcamentos((response as any).orcamentos);
      } else {
        toast.error('Erro ao carregar orçamentos');
      }
    } catch (error) {
      toast.error('Erro ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  };

  const carregarMetricas = async () => {
    try {
      const response = await orcamentoService.obterMetricas();
      if (response && typeof response === 'object' && 'sucesso' in response && response.sucesso === true && 'metricas' in response) {
        setMetricas((response as any).metricas);
      } else {
        toast.error('Erro ao carregar métricas');
      }
    } catch (error) {
      toast.error('Erro ao carregar métricas');
    }
  };

  // Função para calcular frete
  const calcularFrete = async (orcamento: Orcamento) => {
    if (!cepDestino || cepDestino.length < 8) {
      toast.error('Digite um CEP válido');
      return;
    }

    setCalculandoFrete(true);
    try {
      const dadosFrete: CalculoFreteRequest = {
        cep_destino: cepDestino,
        valor_total: orcamento.valor_total
      };

      const resultado = await orcamentoService.calcularFrete(orcamento.id, dadosFrete);

      if (resultado.sucesso) {
        setOpcoesFrete(resultado.opcoes_frete);
        setMostrarFrete(true);
        toast.success(`${resultado.opcoes_frete.length} opções de frete encontradas`);
      } else {
        toast.error(resultado.erro || 'Erro ao calcular frete');
      }
    } catch (error) {
      toast.error('Erro ao calcular frete');
    } finally {
      setCalculandoFrete(false);
    }
  };

  // Função para aplicar frete
  const aplicarFrete = async (orcamento: Orcamento, opcaoFrete: OpcaoFrete) => {
    try {
      await orcamentoService.aplicarFrete(orcamento.id, opcaoFrete);
      setFreteSelecionado(opcaoFrete);
      setMostrarFrete(false);
      toast.success('Frete aplicado com sucesso');

      // Atualizar orçamento na lista
      setOrcamentos(prev => prev.map(o =>
        o.id === orcamento.id
          ? { ...o, frete_valor: opcaoFrete.valor, frete_transportadora: opcaoFrete.transportadora }
          : o
      ));
    } catch (error) {
      toast.error('Erro ao aplicar frete');
    }
  };

  // Função para concluir orçamento
  const concluirOrcamento = async (orcamento: Orcamento) => {
    try {
      await orcamentoService.concluirOrcamento(orcamento.id, 'Orçamento finalizado pelo vendedor');

      // Atualizar status na lista
      setOrcamentos(prev => prev.map(o =>
        o.id === orcamento.id
          ? { ...o, status: 'concluido' as const }
          : o
      ));

      setOrcamentoSelecionado(null);
      toast.success('Orçamento marcado como concluído');
    } catch (error) {
      toast.error('Erro ao concluir orçamento');
    }
  };

  // Função para validar CEP
  const validarCep = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const resultado = await orcamentoService.validarCep(cep);
        if (resultado.sucesso) {
          toast.success('CEP válido');
        } else {
          toast.error('CEP inválido');
        }
      } catch (error) {
        toast.error('Erro ao validar CEP');
      }
    }
  };

  // Filtrar e ordenar orçamentos
  const orcamentosFiltrados = useMemo(() => {
    let orcs = [...orcamentos];

    // Aplicar filtros
    if (filtroStatus !== 'todos') {
      orcs = orcs.filter(o => o.status === filtroStatus);
    }
    if (filtroPrioridade !== 'todos') {
      orcs = orcs.filter(o => o.prioridade === filtroPrioridade);
    }
    if (busca) {
      orcs = orcs.filter(o =>
        o.numero_orcamento.toLowerCase().includes(busca.toLowerCase()) ||
        o.cliente_nome.toLowerCase().includes(busca.toLowerCase()) ||
        o.observacoes?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Aplicar ordenação
    orcs.sort((a, b) => {
      switch (ordenacao) {
        case 'data':
          return new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime();
        case 'valor':
          return b.valor_total - a.valor_total;
        case 'prioridade':
          const prioridadeOrder = { alta: 3, media: 2, baixa: 1 };
          return prioridadeOrder[b.prioridade] - prioridadeOrder[a.prioridade];
        case 'vencimento':
          return a.dias_restantes - b.dias_restantes;
        default:
          return 0;
      }
    });

    return orcs;
  }, [orcamentos, filtroStatus, filtroPrioridade, busca, ordenacao]);

  // Agrupar por status para Kanban
  const orcamentosPorStatus = useMemo(() => {
    const grupos = {
      pendente: orcamentosFiltrados.filter(o => o.status === 'pendente'),
      enviado: orcamentosFiltrados.filter(o => o.status === 'enviado'),
      aprovado: orcamentosFiltrados.filter(o => o.status === 'aprovado'),
      rejeitado: orcamentosFiltrados.filter(o => o.status === 'rejeitado'),
      convertido: orcamentosFiltrados.filter(o => o.status === 'convertido')
    };

    return grupos;
  }, [orcamentosFiltrados]);

  const getStatusColor = (status: string) => {
    const cores = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      enviado: 'bg-blue-100 text-blue-800 border-blue-200',
      aprovado: 'bg-green-100 text-green-800 border-green-200',
      rejeitado: 'bg-red-100 text-red-800 border-red-200',
      expirado: 'bg-gray-100 text-gray-800 border-gray-200',
      convertido: 'bg-purple-100 text-purple-800 border-purple-200',
      concluido: 'bg-green-100 text-green-800 border-green-200'
    };
    return cores[status as keyof typeof cores] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPrioridadeColor = (prioridade: string) => {
    const cores = {
      alta: 'bg-red-500',
      media: 'bg-yellow-500',
      baixa: 'bg-green-500'
    };
    return cores[prioridade as keyof typeof cores] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock className="text-yellow-600" size={16} />;
      case 'enviado': return <Send className="text-blue-600" size={16} />;
      case 'aprovado': return <CheckCircle className="text-green-600" size={16} />;
      case 'rejeitado': return <XCircle className="text-red-600" size={16} />;
      case 'expirado': return <AlertTriangle className="text-gray-600" size={16} />;
      case 'convertido': return <TrendingUp className="text-purple-600" size={16} />;
      case 'concluido': return <CheckCircle className="text-green-600" size={16} />;
      default: return <ClipboardList className="text-gray-600" size={16} />;
    }
  };

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleAcaoOrcamento = (acao: string, orcamento: Orcamento) => {
    console.log(`🔧 AÇÃO: ${acao} orçamento`, orcamento.id);

    switch (acao) {
      case 'visualizar':
        setOrcamentoSelecionado(orcamento);
        break;
      case 'editar':
        handleEditarOrcamento(orcamento);
        break;
      case 'enviar':
        handleEnviarWhatsApp(orcamento);
        break;
      case 'pdf':
        handleGerarPDF(orcamento);
        break;
      case 'excluir':
        handleExcluirOrcamento(orcamento);
        break;
    }
  };

  // ✅ FUNÇÃO: Criar novo orçamento
  const handleCriarOrcamento = () => {
    console.log("🔧 AÇÃO: Criar novo orçamento");

    try {
      // Simular criação de orçamento
      const novoOrcamento: Orcamento = {
        id: Math.max(...orcamentos.map(o => o.id)) + 1,
        numero_orcamento: `ORC${new Date().getTime()}`,
        cliente_id: 1,
        cliente_nome: "Cliente Novo",
        vendedor_id: user ? Number(user.id) : 1,
        vendedor_nome: user?.nome || "Vendedor",
        status: "pendente",
        valor_total: 0,
        valor_potencial: 0,
        taxa_conversao: 0,
        validade_orcamento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        data_criacao: new Date().toISOString(),
        pdf_gerado: false,
        enviado_whatsapp: false,
        total_itens: 0,
        prioridade: "media",
        dias_restantes: 7
      };

      setOrcamentos([novoOrcamento, ...orcamentos]);
      setOrcamentoSelecionado(novoOrcamento);
      toast.success("Orçamento criado com sucesso!");
      console.log("✅ Orçamento criado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao criar orçamento:", error);
      toast.error("Erro ao criar orçamento");
    }
  };

  // ✅ FUNÇÃO: Editar orçamento
  const handleEditarOrcamento = async (orcamento: Orcamento) => {
    console.log("🔧 AÇÃO: Editar orçamento", orcamento.id);

    try {
      // Simular edição
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simular atualização no estado
      setOrcamentos(orcamentos.map(o =>
        o.id === orcamento.id
          ? { ...o, observacoes: o.observacoes + " (Editado)" }
          : o
      ));

      toast.success(`Orçamento ${orcamento.numero_orcamento} editado com sucesso!`);
      console.log("✅ Orçamento editado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao editar orçamento:", error);
      toast.error("Erro ao editar orçamento");
    }
  };

  // ✅ FUNÇÃO: Enviar WhatsApp
  const handleEnviarWhatsApp = async (orcamento: Orcamento) => {
    console.log("🔧 AÇÃO: Enviar WhatsApp", orcamento.id);

    try {
      setLoading(true);
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simular atualização do status
      setOrcamentos(orcamentos.map(o =>
        o.id === orcamento.id
          ? { ...o, status: "enviado", enviado_whatsapp: true }
          : o
      ));

      toast.success(`Orçamento ${orcamento.numero_orcamento} enviado por WhatsApp!`);
      console.log("✅ Orçamento enviado por WhatsApp");
    } catch (error) {
      console.error("❌ Erro ao enviar WhatsApp:", error);
      toast.error("Erro ao enviar WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNÇÃO: Gerar PDF
  const handleGerarPDF = async (orcamento: Orcamento) => {
    console.log("🔧 AÇÃO: Gerar PDF", orcamento.id);

    try {
      setLoading(true);

      // Importar jsPDF dinamicamente
      const jsPDF = (await import('jspdf')).default;

      // Criar documento PDF
      const doc = new jsPDF();

      // Configurações do PDF
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Função para adicionar texto
      const addText = (text: string, x: number, y: number, fontSize: number = 12, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        if (isBold) doc.setFont('helvetica', 'bold');
        else doc.setFont('helvetica', 'normal');
        doc.text(text, x, y);
        return y + fontSize + 2;
      };

      // Função para adicionar linha
      const addLine = (y: number) => {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        return y + 5;
      };

      // 1. Cabeçalho da empresa
      yPosition = addText("DL AUTO PEÇAS", margin, yPosition, 20, true);
      yPosition = addText("CNPJ: 12.345.678/0001-90", margin, yPosition, 10);
      yPosition = addText("Rua das Autopeças, 123 - São Paulo/SP", margin, yPosition, 10);
      yPosition = addText("Tel: (11) 99999-9999 | Email: contato@dlautopecas.com.br", margin, yPosition, 10);
      yPosition = addLine(yPosition);

      // 2. Dados do orçamento
      yPosition = addText(`ORÇAMENTO: ${orcamento.numero_orcamento}`, margin, yPosition, 16, true);
      yPosition = addText(`Data: ${formatData(orcamento.data_criacao)}`, margin, yPosition, 12);
      yPosition = addText(`Validade: ${formatData(orcamento.validade_orcamento)}`, margin, yPosition, 12);
      yPosition = addLine(yPosition);

      // 3. Dados do cliente
      yPosition = addText("DADOS DO CLIENTE", margin, yPosition, 14, true);
      yPosition = addText(`Nome: ${orcamento.cliente_nome}`, margin, yPosition, 12);
      yPosition = addText(`Tipo: ${orcamento.cliente_nome}`, margin, yPosition, 12);
      yPosition = addLine(yPosition);

      // 4. Itens do orçamento
      yPosition = addText("ITENS DO ORÇAMENTO", margin, yPosition, 14, true);

      // Cabeçalho da tabela
      const tableHeaders = ["Item", "Descrição", "Qtd", "Valor Unit.", "Subtotal"];
      const colWidths = [20, 80, 20, 30, 30];
      let xPos = margin;

      tableHeaders.forEach((header, index) => {
        addText(header, xPos, yPosition, 10, true);
        xPos += colWidths[index];
      });
      yPosition += 15;

      // Linha separadora da tabela
      yPosition = addLine(yPosition);

      // Itens (simulados)
      const itens = [
        { item: 1, descricao: "Pastilha de Freio", qtd: 2, valor_unit: 89.90, subtotal: 179.80 },
        { item: 2, descricao: "Filtro de Óleo", qtd: 1, valor_unit: 45.50, subtotal: 45.50 },
        { item: 3, descricao: "Amortecedor Dianteiro", qtd: 1, valor_unit: 320.00, subtotal: 320.00 }
      ];

      itens.forEach(item => {
        xPos = margin;
        addText(item.item.toString(), xPos, yPosition, 10);
        xPos += colWidths[0];
        addText(item.descricao, xPos, yPosition, 10);
        xPos += colWidths[1];
        addText(item.qtd.toString(), xPos, yPosition, 10);
        xPos += colWidths[2];
        addText(formatMoeda(item.valor_unit), xPos, yPosition, 10);
        xPos += colWidths[3];
        addText(formatMoeda(item.subtotal), xPos, yPosition, 10);
        yPosition += 12;
      });

      yPosition = addLine(yPosition);

      // 5. Resumo financeiro
      const subtotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
      const frete = orcamento.frete_valor || 0;
      const total = subtotal + frete;

      yPosition = addText("RESUMO FINANCEIRO", margin, yPosition, 14, true);
      yPosition = addText(`Subtotal: ${formatMoeda(subtotal)}`, pageWidth - margin - 80, yPosition, 12);
      yPosition = addText(`Frete: ${formatMoeda(frete)}`, pageWidth - margin - 80, yPosition, 12);
      yPosition = addText(`TOTAL: ${formatMoeda(total)}`, pageWidth - margin - 80, yPosition, 16, true);

      // 6. Condições comerciais
      yPosition += 20;
      yPosition = addText("CONDIÇÕES COMERCIAIS", margin, yPosition, 14, true);
      yPosition = addText("• Forma de pagamento: PIX, Cartão de Crédito, Dinheiro", margin, yPosition, 10);
      yPosition = addText("• Prazo de entrega: Conforme opção de frete escolhida", margin, yPosition, 10);
      yPosition = addText("• Validade da proposta: 7 dias", margin, yPosition, 10);
      yPosition = addText("• Garantia: Conforme especificação do fabricante", margin, yPosition, 10);

      // 7. Rodapé
      yPosition = doc.internal.pageSize.getHeight() - 30;
      yPosition = addLine(yPosition);
      yPosition = addText("DL Auto Peças - Sua parceira em autopeças de qualidade", margin, yPosition, 10);
      yPosition = addText("www.dlautopecas.com.br", margin, yPosition, 10);

      // Salvar PDF
      const nomeArquivo = `orcamento_${orcamento.numero_orcamento}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(nomeArquivo);

      // Simular atualização do status
      setOrcamentos(orcamentos.map(o =>
        o.id === orcamento.id
          ? { ...o, pdf_gerado: true }
          : o
      ));

      toast.success("PDF gerado com sucesso!");
      console.log("✅ PDF profissional gerado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNÇÃO: Excluir orçamento
  const handleExcluirOrcamento = async (orcamento: Orcamento) => {
    console.log("🔧 AÇÃO: Excluir orçamento", orcamento.id);

    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 500));

      setOrcamentos(orcamentos.filter(o => o.id !== orcamento.id));
      if (orcamentoSelecionado?.id === orcamento.id) {
        setOrcamentoSelecionado(null);
      }

      toast.success(`Orçamento ${orcamento.numero_orcamento} excluído com sucesso!`);
      console.log("✅ Orçamento excluído com sucesso");
    } catch (error) {
      console.error("❌ Erro ao excluir orçamento:", error);
      toast.error("Erro ao excluir orçamento");
    }
  };

  const colunasKanban = [
    {
      id: 'pendente',
      titulo: 'Pendentes',
      cor: 'yellow',
      icone: Clock,
      orcamentos: orcamentosPorStatus.pendente
    },
    {
      id: 'enviado',
      titulo: 'Enviados',
      cor: 'blue',
      icone: Send,
      orcamentos: orcamentosPorStatus.enviado
    },
    {
      id: 'aprovado',
      titulo: 'Aprovados',
      cor: 'green',
      icone: CheckCircle,
      orcamentos: orcamentosPorStatus.aprovado
    },
    {
      id: 'convertido',
      titulo: 'Convertidos',
      cor: 'purple',
      icone: TrendingUp,
      orcamentos: orcamentosPorStatus.convertido
    },
    {
      id: 'rejeitado',
      titulo: 'Rejeitados',
      cor: 'red',
      icone: XCircle,
      orcamentos: orcamentosPorStatus.rejeitado
    }
  ];

  return (
    <LayoutVendedor>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header Premium */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl rounded-3xl">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                  <ClipboardList className="text-yellow-300" size={32} />
                  Gestão de Orçamentos
                </h1>
                <p className="text-blue-100 text-lg">Controle completo e visualização Kanban</p>
              </div>

              <div className="flex gap-8">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold text-yellow-300 flex items-center gap-2">
                    <BarChart3 size={24} />
                    {metricas.totalOrcamentos}
                  </div>
                  <div className="text-blue-100">Total</div>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-bold text-green-300 flex items-center gap-2">
                    <Target size={24} />
                    {metricas.taxaConversaoGeral}%
                  </div>
                  <div className="text-blue-100">Conversão</div>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-bold text-purple-300 flex items-center gap-2">
                    <Sparkles size={24} />
                    {formatMoeda(metricas.valorTotalPotencial)}
                  </div>
                  <div className="text-blue-100">Potencial</div>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-bold text-blue-300 flex items-center gap-2">
                    <Zap size={24} />
                    {formatMoeda(metricas.valorConvertido)}
                  </div>
                  <div className="text-blue-100">Convertido</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Controles e Filtros */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                {/* Botão Criar Orçamento */}
                <button
                  onClick={handleCriarOrcamento}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} />
                  Criar Orçamento
                </button>

                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por número, cliente ou observações..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-80"
                  />
                </div>

                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="enviado">Enviado</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="rejeitado">Rejeitado</option>
                  <option value="convertido">Convertido</option>
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
                  <option value="data">Data</option>
                  <option value="valor">Valor</option>
                  <option value="prioridade">Prioridade</option>
                  <option value="vencimento">Vencimento</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    carregarOrcamentos();
                    carregarMetricas();
                  }}
                  disabled={refreshing}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={refreshing ? 'animate-spin' : ''} size={20} />
                  Atualizar
                </button>
                <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Plus size={20} />
                  Novo Orçamento
                </button>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {colunasKanban.map((coluna) => (
              <motion.div
                key={coluna.id}
                className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: colunasKanban.indexOf(coluna) * 0.1 }}
              >
                {/* Header da Coluna */}
                <div className={`bg-gradient-to-r from-${coluna.cor}-50 to-${coluna.cor}-100 p-4 border-b`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <coluna.icone className={`text-${coluna.cor}-600`} size={20} />
                      <h3 className="font-bold text-gray-800">{coluna.titulo}</h3>
                    </div>
                    <span className={`px-3 py-1 bg-${coluna.cor}-100 text-${coluna.cor}-800 rounded-full text-sm font-bold`}>
                      {coluna.orcamentos.length}
                    </span>
                  </div>
                </div>

                {/* Cards dos Orçamentos */}
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {coluna.orcamentos.map((orcamento) => (
                      <motion.div
                        key={orcamento.id}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setOrcamentoSelecionado(orcamento)}
                      >
                        {/* Header do Card */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getPrioridadeColor(orcamento.prioridade)}`}></div>
                            <span className="text-xs font-semibold text-gray-600">{orcamento.numero_orcamento}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(orcamento.status)}`}>
                            {getStatusIcon(orcamento.status)}
                          </div>
                        </div>

                        {/* Cliente */}
                        <div className="flex items-center gap-2 mb-2">
                          <User className="text-blue-600" size={14} />
                          <span className="font-medium text-sm">{orcamento.cliente_nome}</span>
                        </div>

                        {/* Valor */}
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="text-green-600" size={14} />
                          <span className="font-bold text-green-600">{formatMoeda(orcamento.valor_total)}</span>
                        </div>

                        {/* Itens */}
                        <div className="flex items-center gap-2 mb-3">
                          <Package className="text-purple-600" size={14} />
                          <span className="text-sm text-gray-600">{orcamento.total_itens} itens</span>
                        </div>

                        {/* Taxa de Conversão */}
                        {orcamento.taxa_conversao > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="text-orange-600" size={14} />
                            <span className="text-sm font-semibold text-orange-600">{orcamento.taxa_conversao}% conversão</span>
                          </div>
                        )}

                        {/* Vencimento */}
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="text-gray-600" size={14} />
                          <span className={`text-sm ${orcamento.dias_restantes < 0 ? 'text-red-600' : orcamento.dias_restantes < 5 ? 'text-yellow-600' : 'text-gray-600'}`}>
                            {orcamento.dias_restantes < 0 ? 'Expirado' : `${orcamento.dias_restantes} dias restantes`}
                          </span>
                        </div>

                        {/* Ações */}
                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcaoOrcamento('visualizar', orcamento);
                            }}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Visualizar"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcaoOrcamento('enviar', orcamento);
                            }}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Enviar WhatsApp"
                          >
                            <Send size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcaoOrcamento('pdf', orcamento);
                            }}
                            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                            title="Gerar PDF"
                          >
                            <FileText size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {coluna.orcamentos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <coluna.icone size={32} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Nenhum orçamento</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Modal de Detalhes do Orçamento */}
          <AnimatePresence>
            {orcamentoSelecionado && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setOrcamentoSelecionado(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Detalhes do Orçamento</h2>
                      <button
                        onClick={() => setOrcamentoSelecionado(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <XCircle size={24} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Número</label>
                          <p className="text-lg font-bold">{orcamentoSelecionado.numero_orcamento}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Status</label>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(orcamentoSelecionado.status)}`}>
                            {getStatusIcon(orcamentoSelecionado.status)}
                            {orcamentoSelecionado.status}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Cliente</label>
                          <p className="text-lg">{orcamentoSelecionado.cliente_nome}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Valor Total</label>
                          <p className="text-lg font-bold text-green-600">{formatMoeda(orcamentoSelecionado.valor_total)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Data de Criação</label>
                          <p className="text-lg">{formatData(orcamentoSelecionado.data_criacao)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Vencimento</label>
                          <p className="text-lg">{formatData(orcamentoSelecionado.validade_orcamento)}</p>
                        </div>
                      </div>

                      {orcamentoSelecionado.observacoes && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Observações</label>
                          <p className="text-lg">{orcamentoSelecionado.observacoes}</p>
                        </div>
                      )}

                      {/* Seção de Frete */}
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Truck className="text-blue-600" size={20} />
                          Cotação de Frete
                        </h3>

                        {orcamentoSelecionado.frete_valor ? (
                          <div className="bg-green-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-green-800">
                                  {orcamentoSelecionado.frete_transportadora} - {orcamentoSelecionado.frete_tipo}
                                </p>
                                <p className="text-sm text-green-600">
                                  {formatMoeda(orcamentoSelecionado.frete_valor)} • {orcamentoSelecionado.frete_prazo_entrega} dias
                                </p>
                              </div>
                              <button
                                onClick={() => calcularFrete(orcamentoSelecionado)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                              >
                                Recalcular
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="CEP de destino"
                                value={cepDestino}
                                onChange={(e) => setCepDestino(e.target.value)}
                                onBlur={() => validarCep(cepDestino)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                maxLength={8}
                              />
                              <button
                                onClick={() => calcularFrete(orcamentoSelecionado)}
                                disabled={calculandoFrete || !cepDestino}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {calculandoFrete ? (
                                  <RefreshCw className="animate-spin" size={16} />
                                ) : (
                                  <Truck size={16} />
                                )}
                                Calcular Frete
                              </button>
                            </div>

                            {mostrarFrete && opcoesFrete.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-700">Opções disponíveis:</p>
                                {opcoesFrete.map((opcao, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                    onClick={() => aplicarFrete(orcamentoSelecionado, opcao)}
                                  >
                                    <div>
                                      <p className="font-semibold">{opcao.transportadora}</p>
                                      <p className="text-sm text-gray-600">{opcao.servico}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-green-600">{formatMoeda(opcao.valor)}</p>
                                      <p className="text-sm text-gray-600">{opcao.prazo} dias</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4 border-t">
                        <button
                          onClick={() => handleAcaoOrcamento('editar', orcamentoSelecionado)}
                          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit size={18} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleAcaoOrcamento('enviar', orcamentoSelecionado)}
                          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Send size={18} />
                          Enviar WhatsApp
                        </button>
                        <button
                          onClick={() => handleAcaoOrcamento('pdf', orcamentoSelecionado)}
                          className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FileText size={18} />
                          Gerar PDF
                        </button>
                      </div>

                      {/* Botão de Concluir */}
                      {orcamentoSelecionado.status !== 'concluido' && orcamentoSelecionado.status !== 'convertido' && (
                        <div className="pt-4 border-t">
                          <button
                            onClick={() => concluirOrcamento(orcamentoSelecionado)}
                            className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={18} />
                            Marcar como Concluído
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LayoutVendedor>
  );
};

export default OrcamentosPage; 