import PermissionGuard from "@/components/auth/PermissionGuard";

import LayoutGestor from "@/components/layout/LayoutGestor";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import {
    Key,
    Mail,
    MoreVertical,
    Search,
    Shield,
    UserCheck,
    UserPlus,
    UserX
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Vendedor {
    id: number;
    nome: string;
    email: string;
    cargo: string;
    permissao: 'VENDEDOR' | 'ANUNCIANTE' | 'GESTOR';
    ativo: boolean;
    dataCriacao: string;
}

export default function VendedoresPage() {
    const { user } = useAuth();
    const [vendedores, setVendedores] = useState<Vendedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPermissao, setFilterPermissao] = useState<string>("");
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        cargo: "",
        permissao: "VENDEDOR" as const,
    });

    // Mock data
    useEffect(() => {
        setTimeout(() => {
            setVendedores([
                {
                    id: 1,
                    nome: "João Silva",
                    email: "joao@dlautopecas.com",
                    cargo: "Vendedor Senior",
                    permissao: "VENDEDOR",
                    ativo: true,
                    dataCriacao: "2024-01-15"
                },
                {
                    id: 2,
                    nome: "Maria Santos",
                    email: "maria@dlautopecas.com",
                    cargo: "Anunciante",
                    permissao: "ANUNCIANTE",
                    ativo: true,
                    dataCriacao: "2024-02-20"
                },
                {
                    id: 3,
                    nome: "Pedro Costa",
                    email: "pedro@dlautopecas.com",
                    cargo: "Gestor Regional",
                    permissao: "GESTOR",
                    ativo: false,
                    dataCriacao: "2024-03-10"
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Mock API call
        const novoVendedor: Vendedor = {
            id: Date.now(),
            nome: formData.nome,
            email: formData.email,
            cargo: formData.cargo,
            permissao: formData.permissao,
            ativo: true,
            dataCriacao: new Date().toISOString().split('T')[0]
        };

        setVendedores([...vendedores, novoVendedor]);
        setShowForm(false);
        setFormData({ nome: "", email: "", senha: "", cargo: "", permissao: "VENDEDOR" });
    };

    const toggleStatus = (id: number) => {
        setVendedores(vendedores.map(v =>
            v.id === id ? { ...v, ativo: !v.ativo } : v
        ));
    };

    const resetPassword = (id: number) => {
        alert(`Senha resetada para o vendedor ID: ${id}`);
    };

    const filteredVendedores = vendedores.filter(vendedor => {
        const matchesSearch = vendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendedor.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = !filterPermissao || vendedor.permissao === filterPermissao;
        return matchesSearch && matchesFilter;
    });

    const getPermissaoColor = (permissao: string) => {
        switch (permissao) {
            case 'GESTOR': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'ANUNCIANTE': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'VENDEDOR': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <PermissionGuard requiredRole="GESTOR">
            <LayoutGestor>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-xl p-6 mb-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">👥 Gestão de Vendedores</h1>
                                <p className="text-blue-100 opacity-90">Gerencie sua equipe de vendas e permissões</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/20 rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{vendedores.length}</div>
                                    <div className="text-blue-100 text-sm">Total</div>
                                </div>
                                <div className="bg-white/20 rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{vendedores.filter(v => v.ativo).length}</div>
                                    <div className="text-blue-100 text-sm">Ativos</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-6 mb-6"
                    >
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Buscar vendedores..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <select
                                    value={filterPermissao}
                                    onChange={(e) => setFilterPermissao(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Todas as permissões</option>
                                    <option value="VENDEDOR">Vendedor</option>
                                    <option value="ANUNCIANTE">Anunciante</option>
                                    <option value="GESTOR">Gestor</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-200"
                            >
                                <UserPlus size={20} />
                                Novo Vendedor
                            </button>
                        </div>
                    </motion.div>

                    {/* Vendedores List */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Carregando vendedores...</p>
                            </div>
                        ) : filteredVendedores.length === 0 ? (
                            <div className="p-8 text-center">
                                <UserX className="mx-auto text-gray-400" size={48} />
                                <p className="mt-4 text-gray-600">Nenhum vendedor encontrado</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vendedor</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cargo</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Permissão</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <AnimatePresence>
                                            {filteredVendedores.map((vendedor, index) => (
                                                <motion.tr
                                                    key={vendedor.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium text-gray-900">{vendedor.nome}</div>
                                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                                <Mail size={14} />
                                                                {vendedor.email}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{vendedor.cargo}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPermissaoColor(vendedor.permissao)}`}>
                                                            <Shield size={12} className="mr-1" />
                                                            {vendedor.permissao}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vendedor.ativo
                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                            : 'bg-red-100 text-red-800 border border-red-200'
                                                            }`}>
                                                            {vendedor.ativo ? (
                                                                <>
                                                                    <UserCheck size={12} className="mr-1" />
                                                                    Ativo
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserX size={12} className="mr-1" />
                                                                    Inativo
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => toggleStatus(vendedor.id)}
                                                                className={`p-2 rounded-lg transition-colors ${vendedor.ativo
                                                                    ? 'text-red-600 hover:bg-red-50'
                                                                    : 'text-green-600 hover:bg-green-50'
                                                                    }`}
                                                                title={vendedor.ativo ? 'Desativar' : 'Ativar'}
                                                            >
                                                                {vendedor.ativo ? <UserX size={16} /> : <UserCheck size={16} />}
                                                            </button>
                                                            <button
                                                                onClick={() => resetPassword(vendedor.id)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Resetar senha"
                                                            >
                                                                <Key size={16} />
                                                            </button>
                                                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                                                <MoreVertical size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>

                    {/* Modal de Novo Vendedor */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                                onClick={() => setShowForm(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Novo Vendedor</h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.nome}
                                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                            <input
                                                type="password"
                                                required
                                                value={formData.senha}
                                                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.cargo}
                                                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Permissão</label>
                                            <select
                                                value={formData.permissao}
                                                onChange={(e) => setFormData({ ...formData, permissao: e.target.value as any })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="VENDEDOR">Vendedor</option>
                                                <option value="ANUNCIANTE">Anunciante</option>
                                                <option value="GESTOR">Gestor</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                                            >
                                                Criar Vendedor
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </LayoutGestor>
    
        </PermissionGuard>
    );
} 