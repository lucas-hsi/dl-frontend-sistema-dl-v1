import React, { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  Package,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Building
} from "lucide-react";
import LayoutGestor from "@/components/layout/LayoutGestor";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  categoria: string;
  avaliacao: number;
  produtos_fornecidos: number;
  valor_total_compras: number;
  ultima_compra: string;
  status: 'ativo' | 'inativo' | 'bloqueado';
  observacoes: string;
}

export default function FornecedoresPagina() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativo' | 'inativo' | 'bloqueado'>('todos');
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock de fornecedores
  const [fornecedores] = useState<Fornecedor[]>([
    {
      id: "1",
      nome: "Auto Peças Central Ltda",
      cnpj: "12.345.678/0001-90",
      email: "vendas@autopecascentral.com.br",
      telefone: "(11) 3456-7890",
      endereco: "Rua das Autopeças, 123",
      cidade: "São Paulo",
      estado: "SP",
      categoria: "Peças Originais",
      avaliacao: 4.8,
      produtos_fornecidos: 127,
      valor_total_compras: 45800.00,
      ultima_compra: "2024-10-20",
      status: "ativo",
      observacoes: "Fornecedor confiável, entrega sempre no prazo"
    },
    {
      id: "2", 
      nome: "Distribuidora Nacional Auto",
      cnpj: "98.765.432/0001-10",
      email: "comercial@dnacional.com.br",
      telefone: "(11) 2345-6789",
      endereco: "Av. Industrial, 456",
      cidade: "Guarulhos",
      estado: "SP",
      categoria: "Peças Compatíveis",
      avaliacao: 4.2,
      produtos_fornecidos: 89,
      valor_total_compras: 32100.00,
      ultima_compra: "2024-10-18",
      status: "ativo",
      observacoes: "Bons preços, qualidade variável"
    },
    {
      id: "3",
      nome: "Parts & Service Express",
      cnpj: "55.444.333/0001-22",
      email: "pedidos@partsexpress.com.br",
      telefone: "(11) 4567-8901",
      endereco: "Rua do Comércio, 789",
      cidade: "Osasco",
      estado: "SP",
      categoria: "Importadas",
      avaliacao: 3.9,
      produtos_fornecidos: 45,
      valor_total_compras: 28750.00,
      ultima_compra: "2024-09-15",
      status: "inativo",
      observacoes: "Problemas na última entrega"
    }
  ]);

  const categorias = [
    "Peças Originais",
    "Peças Compatíveis", 
    "Importadas",
    "Ferramentas",
    "Acessórios",
    "Fluidos e Lubrificantes"
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted || !user || user.perfil !== "GESTOR") {
    return null;
  }

  // Filtrar fornecedores
  const fornecedoresFiltrados = fornecedores.filter(fornecedor => {
    const matchesSearch = fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fornecedor.cnpj.includes(searchTerm) ||
                         fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || fornecedor.status === filterStatus;
    const matchesCategoria = filterCategoria === 'todas' || fornecedor.categoria === filterCategoria;
    
    return matchesSearch && matchesStatus && matchesCategoria;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      case 'bloqueado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return CheckCircle;
      case 'inativo': return AlertTriangle;
      case 'bloqueado': return Trash2;
      default: return AlertTriangle;
    }
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
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Users className="w-12 h-12" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Gestão de Fornecedores</h1>
                  <p className="text-blue-100 opacity-90">Cadastro e controle de fornecedores de autopeças</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{fornecedores.length}</div>
                <div className="text-blue-100 text-sm">fornecedores</div>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fornecedores Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fornecedores.filter(f => f.status === 'ativo').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Produtos</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {fornecedores.reduce((sum, f) => sum + f.produtos_fornecidos, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Volume Compras</p>
                  <p className="text-2xl font-bold text-purple-600">
                    R$ {fornecedores.reduce((sum, f) => sum + f.valor_total_compras, 0).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avaliação Média</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {(fornecedores.reduce((sum, f) => sum + f.avaliacao, 0) / fornecedores.length).toFixed(1)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Ações */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Novo Fornecedor
                </button>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="ativo">Ativos</option>
                  <option value="inativo">Inativos</option>
                  <option value="bloqueado">Bloqueados</option>
                </select>

                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todas">Todas as Categorias</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar fornecedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
            </div>
          </div>

          {/* Lista de Fornecedores */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Fornecedor</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Contato</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Categoria</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Performance</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Última Compra</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fornecedoresFiltrados.map((fornecedor) => {
                    const StatusIcon = getStatusIcon(fornecedor.status);
                    return (
                      <tr key={fornecedor.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-800">{fornecedor.nome}</div>
                            <div className="text-sm text-gray-600">CNPJ: {fornecedor.cnpj}</div>
                            <div className="text-sm text-gray-500">{fornecedor.cidade}, {fornecedor.estado}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              {fornecedor.telefone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {fornecedor.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {fornecedor.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              {renderStars(Math.floor(fornecedor.avaliacao))}
                              <span className="text-sm text-gray-600 ml-1">{fornecedor.avaliacao}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {fornecedor.produtos_fornecidos} produtos
                            </div>
                            <div className="text-sm font-medium text-green-600">
                              R$ {fornecedor.valor_total_compras.toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {new Date(fornecedor.ultima_compra).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(fornecedor.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {fornecedor.status === 'ativo' ? 'Ativo' : 
                             fornecedor.status === 'inativo' ? 'Inativo' : 'Bloqueado'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {fornecedoresFiltrados.length === 0 && (
                <div className="text-center py-12">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum fornecedor encontrado</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Tente ajustar os filtros ou adicionar um novo fornecedor
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