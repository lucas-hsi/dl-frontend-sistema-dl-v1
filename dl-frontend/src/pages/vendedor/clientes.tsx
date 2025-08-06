import LayoutVendedor from "@/components/layout/LayoutVendedor";
import ClientProfileBadge from "@/components/ui/ClientProfileBadge";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Edit, Filter, Plus, Repeat, Search, Trash2, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  tipo: 'latoeiro' | 'mecanico' | 'consumidor_final';
  total_compras?: number;
  ultima_compra?: string;
}

interface ClienteForm {
  nome: string;
  telefone: string;
  email: string;
  tipo: 'latoeiro' | 'mecanico' | 'consumidor_final';
}

export default function ClientesVendedor() {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nome: "João Silva",
      telefone: "(11) 99999-9999",
      email: "joao@email.com",
      tipo: "mecanico",
      total_compras: 15,
      ultima_compra: "2024-01-15"
    },
    {
      id: 2,
      nome: "Maria Santos",
      telefone: "(11) 98888-8888",
      email: "maria@email.com",
      tipo: "consumidor_final",
      total_compras: 3,
      ultima_compra: "2024-01-10"
    },
    {
      id: 3,
      nome: "Carlos Latoeiro",
      telefone: "(11) 97777-7777",
      email: "carlos@email.com",
      tipo: "latoeiro",
      total_compras: 28,
      ultima_compra: "2024-01-20"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<ClienteForm>({
    nome: "",
    telefone: "",
    email: "",
    tipo: "consumidor_final"
  });

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefone.includes(searchTerm);
    const matchesFilter = selectedFilter === "todos" || cliente.tipo === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // ✅ FUNÇÃO: Criar novo cliente
  const handleCriarCliente = () => {
    console.log("🔧 AÇÃO: Criar novo cliente");
    setEditingCliente(null);
    setFormData({
      nome: "",
      telefone: "",
      email: "",
      tipo: "consumidor_final"
    });
    setShowModal(true);
  };

  // ✅ FUNÇÃO: Editar cliente
  const handleEditarCliente = (cliente: Cliente) => {
    console.log("🔧 AÇÃO: Editar cliente", cliente.id);
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email || "",
      tipo: cliente.tipo
    });
    setShowModal(true);
  };

  // ✅ FUNÇÃO: Excluir cliente
  const handleExcluirCliente = async (cliente: Cliente) => {
    console.log("🔧 AÇÃO: Excluir cliente", cliente.id);

    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 500));

      setClientes(clientes.filter(c => c.id !== cliente.id));
      toast.success(`Cliente ${cliente.nome} excluído com sucesso!`);
      console.log("✅ Cliente excluído com sucesso");
    } catch (error) {
      console.error("❌ Erro ao excluir cliente:", error);
      toast.error("Erro ao excluir cliente");
    }
  };

  // ✅ FUNÇÃO: Vale Peça
  const handleValePeca = (cliente: Cliente) => {
    console.log("🔧 AÇÃO: Vale Peça para cliente", cliente.id);
    toast.success(`Vale peça criado para ${cliente.nome}`);
  };

  // ✅ FUNÇÃO: Salvar cliente (criar/editar)
  const handleSalvarCliente = async () => {
    console.log("🔧 AÇÃO: Salvar cliente", formData);

    try {
      if (!formData.nome || !formData.telefone) {
        toast.error("Nome e telefone são obrigatórios");
        return;
      }

      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 500));

      if (editingCliente) {
        // Editar cliente existente
        setClientes(clientes.map(c =>
          c.id === editingCliente.id
            ? { ...c, ...formData }
            : c
        ));
        toast.success("Cliente atualizado com sucesso!");
        console.log("✅ Cliente atualizado com sucesso");
      } else {
        // Criar novo cliente
        const novoCliente: Cliente = {
          id: Math.max(...clientes.map(c => c.id)) + 1,
          ...formData,
          total_compras: 0
        };
        setClientes([...clientes, novoCliente]);
        toast.success("Cliente criado com sucesso!");
        console.log("✅ Cliente criado com sucesso");
      }

      setShowModal(false);
    } catch (error) {
      console.error("❌ Erro ao salvar cliente:", error);
      toast.error("Erro ao salvar cliente");
    }
  };

  // ✅ FUNÇÃO: Exportar clientes
  const handleExportar = () => {
    console.log("🔧 AÇÃO: Exportar clientes");

    try {
      const dados = filteredClientes.map(cliente => ({
        Nome: cliente.nome,
        Telefone: cliente.telefone,
        Email: cliente.email || "",
        Tipo: cliente.tipo,
        "Total de Compras": cliente.total_compras || 0,
        "Última Compra": cliente.ultima_compra || ""
      }));

      const csv = [
        Object.keys(dados[0]).join(","),
        ...dados.map(row => Object.values(row).join(","))
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Clientes exportados com sucesso!");
      console.log("✅ Clientes exportados com sucesso");
    } catch (error) {
      console.error("❌ Erro ao exportar clientes:", error);
      toast.error("Erro ao exportar clientes");
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Gestão de Clientes</h1>
              <p className="text-blue-100 text-lg">Gerencie seus clientes com eficiência</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{clientes.length}</div>
                <div className="text-blue-100 text-sm">Total de Clientes</div>
              </div>
              <button
                onClick={handleCriarCliente}
                className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-xl"
              >
                <Plus className="w-6 h-6" />
              </button>
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
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="todos">Todos os Tipos</option>
                <option value="latoeiro">Latoeiros</option>
                <option value="mecanico">Mecânicos</option>
                <option value="consumidor_final">Consumidores Finais</option>
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

        {/* Lista de Clientes */}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contato</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Perfil</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Histórico</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredClientes.map((cliente, index) => (
                    <motion.tr
                      key={cliente.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{cliente.nome}</div>
                            {cliente.email && (
                              <div className="text-sm text-gray-500">{cliente.email}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{cliente.telefone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <ClientProfileBadge tipo={cliente.tipo} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{cliente.total_compras || 0} compras</div>
                          {cliente.ultima_compra && (
                            <div className="text-gray-500">
                              Última: {new Date(cliente.ultima_compra).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditarCliente(cliente)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleValePeca(cliente)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors"
                          >
                            <Repeat className="w-4 h-4" />
                            Vale Peça
                          </button>
                          <button
                            onClick={() => handleExcluirCliente(cliente)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
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

        {/* Modal de Cliente */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCliente ? "Editar Cliente" : "Novo Cliente"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Perfil
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="consumidor_final">Consumidor Final</option>
                    <option value="mecanico">Mecânico</option>
                    <option value="latoeiro">Latoeiro</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSalvarCliente}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    {editingCliente ? "Atualizar" : "Criar"}
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