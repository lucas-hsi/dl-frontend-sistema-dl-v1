import LayoutVendedor from "@/components/layout/LayoutVendedor";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Eye, FileText, Package, Repeat, Search, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Venda {
  id: number;
  numero_venda: string;
  cliente_nome: string;
  cliente_telefone: string;
  produtos: string[];
  valor_total: number;
  forma_pagamento: string;
  data_venda: string;
  status: 'finalizada' | 'cancelada' | 'devolvida';
  vendedor_nome: string;
}

export default function HistoricoVendasVendedor() {
  const [vendas, setVendas] = useState<Venda[]>([
    {
      id: 1,
      numero_venda: "VDA202501270001",
      cliente_nome: "João Silva",
      cliente_telefone: "(11) 99999-9999",
      produtos: ["Pastilha de Freio", "Filtro de Óleo"],
      valor_total: 350.00,
      forma_pagamento: "PIX",
      data_venda: "2025-01-27T10:30:00",
      status: "finalizada",
      vendedor_nome: "Vendedor 1"
    },
    {
      id: 2,
      numero_venda: "VDA202501260002",
      cliente_nome: "Maria Santos",
      cliente_telefone: "(11) 98888-8888",
      produtos: ["Filtro de Ar", "Amortecedor"],
      valor_total: 580.00,
      forma_pagamento: "Cartão de Crédito",
      data_venda: "2025-01-26T14:15:00",
      status: "finalizada",
      vendedor_nome: "Vendedor 1"
    },
    {
      id: 3,
      numero_venda: "VDA202501250003",
      cliente_nome: "Carlos Latoeiro",
      cliente_telefone: "(11) 97777-7777",
      produtos: ["Motor Completo"],
      valor_total: 2500.00,
      forma_pagamento: "Transferência",
      data_venda: "2025-01-25T09:45:00",
      status: "finalizada",
      vendedor_nome: "Vendedor 1"
    }
  ]);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPagamento, setFiltroPagamento] = useState("todos");
  const [ordenacao, setOrdenacao] = useState<"data" | "valor" | "cliente">("data");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);

  const vendasFiltradas = vendas.filter(venda => {
    const matchesBusca = venda.cliente_nome.toLowerCase().includes(busca.toLowerCase()) ||
      venda.numero_venda.toLowerCase().includes(busca.toLowerCase()) ||
      venda.produtos.some(produto => produto.toLowerCase().includes(busca.toLowerCase()));
    const matchesStatus = filtroStatus === "todos" || venda.status === filtroStatus;
    const matchesPagamento = filtroPagamento === "todos" || venda.forma_pagamento === filtroPagamento;
    return matchesBusca && matchesStatus && matchesPagamento;
  });

  const vendasOrdenadas = [...vendasFiltradas].sort((a, b) => {
    switch (ordenacao) {
      case "data":
        return new Date(b.data_venda).getTime() - new Date(a.data_venda).getTime();
      case "valor":
        return b.valor_total - a.valor_total;
      case "cliente":
        return a.cliente_nome.localeCompare(b.cliente_nome);
      default:
        return 0;
    }
  });

  const metricas = {
    totalVendas: vendas.length,
    valorTotal: vendas.reduce((acc, venda) => acc + venda.valor_total, 0),
    vendasHoje: vendas.filter(venda => {
      const hoje = new Date().toDateString();
      return new Date(venda.data_venda).toDateString() === hoje;
    }).length,
    ticketMedio: vendas.length > 0 ? vendas.reduce((acc, venda) => acc + venda.valor_total, 0) / vendas.length : 0
  };

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finalizada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'devolvida':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPagamentoIcon = (pagamento: string) => {
    switch (pagamento) {
      case 'PIX':
        return '💳';
      case 'Cartão de Crédito':
        return '💳';
      case 'Cartão de Débito':
        return '💳';
      case 'Dinheiro':
        return '💵';
      case 'Transferência':
        return '🏦';
      default:
        return '💳';
    }
  };

  // ✅ FUNÇÃO: Visualizar detalhes da venda
  const handleVisualizarVenda = (venda: Venda) => {
    console.log("🔧 AÇÃO: Visualizar venda", venda.id);
    setSelectedVenda(venda);
    setShowModal(true);
  };

  // ✅ FUNÇÃO: Gerar PDF da venda
  const handleGerarPDF = async (venda: Venda) => {
    console.log("🔧 AÇÃO: Gerar PDF da venda", venda.id);

    try {
      setLoading(true);
      // Simular geração de PDF
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simular download do PDF
      const pdfContent = `
        VENDA: ${venda.numero_venda}
        Cliente: ${venda.cliente_nome}
        Telefone: ${venda.cliente_telefone}
        Data: ${formatData(venda.data_venda)}
        Valor: ${formatMoeda(venda.valor_total)}
        Forma de Pagamento: ${venda.forma_pagamento}
        
        PRODUTOS:
        ${venda.produtos.map(produto => `- ${produto}`).join('\n')}
      `;

      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `venda_${venda.numero_venda}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("PDF gerado com sucesso!");
      console.log("✅ PDF gerado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNÇÃO: Replicar venda
  const handleReplicarVenda = (venda: Venda) => {
    console.log("🔧 AÇÃO: Replicar venda", venda.id);

    try {
      // Simular replicação da venda
      const novaVenda: Venda = {
        ...venda,
        id: Math.max(...vendas.map(v => v.id)) + 1,
        numero_venda: `VDA${new Date().getTime()}`,
        data_venda: new Date().toISOString(),
        status: "finalizada" as const
      };

      setVendas([novaVenda, ...vendas]);
      toast.success("Venda replicada com sucesso!");
      console.log("✅ Venda replicada com sucesso");
    } catch (error) {
      console.error("❌ Erro ao replicar venda:", error);
      toast.error("Erro ao replicar venda");
    }
  };

  // ✅ FUNÇÃO: Exportar vendas
  const handleExportar = () => {
    console.log("🔧 AÇÃO: Exportar vendas");

    try {
      const dados = vendasOrdenadas.map(venda => ({
        "Número da Venda": venda.numero_venda,
        "Cliente": venda.cliente_nome,
        "Telefone": venda.cliente_telefone,
        "Produtos": venda.produtos.join(", "),
        "Valor Total": formatMoeda(venda.valor_total),
        "Forma de Pagamento": venda.forma_pagamento,
        "Data": formatData(venda.data_venda),
        "Status": venda.status,
        "Vendedor": venda.vendedor_nome
      }));

      const csv = [
        Object.keys(dados[0]).join(","),
        ...dados.map(row => Object.values(row).join(","))
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vendas_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Vendas exportadas com sucesso!");
      console.log("✅ Vendas exportadas com sucesso");
    } catch (error) {
      console.error("❌ Erro ao exportar vendas:", error);
      toast.error("Erro ao exportar vendas");
    }
  };

  return (
    <LayoutVendedor>
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Header Premium */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-xl p-8 text-white mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Histórico de Vendas</h1>
              <p className="text-blue-100 text-lg">Acompanhe todas as suas vendas</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{metricas.totalVendas}</div>
                <div className="text-blue-100 text-sm">Total de Vendas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatMoeda(metricas.valorTotal)}</div>
                <div className="text-blue-100 text-sm">Valor Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{metricas.vendasHoje}</div>
                <div className="text-blue-100 text-sm">Vendas Hoje</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtros e Busca */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Buscar por cliente, número da venda ou produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-3">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="todos">Todos os Status</option>
                <option value="finalizada">Finalizadas</option>
                <option value="cancelada">Canceladas</option>
                <option value="devolvida">Devolvidas</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={filtroPagamento}
                onChange={(e) => setFiltroPagamento(e.target.value)}
              >
                <option value="todos">Todas as Formas</option>
                <option value="PIX">PIX</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Transferência">Transferência</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as "data" | "valor" | "cliente")}
              >
                <option value="data">Ordenar por Data</option>
                <option value="valor">Ordenar por Valor</option>
                <option value="cliente">Ordenar por Cliente</option>
              </select>
            </div>

            {/* Exportar */}
            <button
              onClick={handleExportar}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Exportar
            </button>
          </div>
        </motion.div>

        {/* Lista de Vendas */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Venda</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Produtos</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Valor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pagamento</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Data</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {vendasOrdenadas.map((venda, index) => (
                    <motion.tr
                      key={venda.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{venda.numero_venda}</div>
                        <div className="text-sm text-gray-500">{venda.vendedor_nome}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{venda.cliente_nome}</div>
                            <div className="text-sm text-gray-500">{venda.cliente_telefone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {venda.produtos.slice(0, 2).map((produto, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-1">
                              <Package className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-700">{produto}</span>
                            </div>
                          ))}
                          {venda.produtos.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{venda.produtos.length - 2} mais
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-green-600">{formatMoeda(venda.valor_total)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPagamentoIcon(venda.forma_pagamento)}</span>
                          <span className="text-sm text-gray-700">{venda.forma_pagamento}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{formatData(venda.data_venda)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVisualizarVenda(venda)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </button>
                          <button
                            onClick={() => handleGerarPDF(venda)}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
                          >
                            <FileText className="w-4 h-4" />
                            PDF
                          </button>
                          <button
                            onClick={() => handleReplicarVenda(venda)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors"
                          >
                            <Repeat className="w-4 h-4" />
                            Replicar
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modal de Detalhes da Venda */}
        {showModal && selectedVenda && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detalhes da Venda
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Informações da Venda */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número da Venda
                    </label>
                    <div className="text-lg font-semibold text-gray-900">{selectedVenda.numero_venda}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data
                    </label>
                    <div className="text-lg text-gray-900">{formatData(selectedVenda.data_venda)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Total
                    </label>
                    <div className="text-lg font-semibold text-green-600">{formatMoeda(selectedVenda.valor_total)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forma de Pagamento
                    </label>
                    <div className="text-lg text-gray-900">{selectedVenda.forma_pagamento}</div>
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Cliente</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome
                        </label>
                        <div className="text-gray-900">{selectedVenda.cliente_nome}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone
                        </label>
                        <div className="text-gray-900">{selectedVenda.cliente_telefone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Produtos */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Produtos</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="space-y-2">
                      {selectedVenda.produtos.map((produto, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{produto}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleGerarPDF(selectedVenda)}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Gerando..." : "Gerar PDF"}
                  </button>
                  <button
                    onClick={() => handleReplicarVenda(selectedVenda)}
                    className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors"
                  >
                    Replicar Venda
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </LayoutVendedor>
  );
} 