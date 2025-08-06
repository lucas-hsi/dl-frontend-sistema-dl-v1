import LayoutGestor from "@/components/layout/LayoutGestor";
import { useAuth } from "@/contexts/AuthContext";
import { EditarUsuarioData, Usuario, UsuarioService } from "@/services/usuarioService";
import { AnimatePresence, motion } from "framer-motion";
import {
    Edit,
    Key,
    Mail,
    MoreVertical,
    Percent,
    Save,
    Search,
    Shield,
    UserCheck,
    UserPlus,
    UserX,
    X,
    RefreshCw,
    Download,
    Upload,
    BarChart3,
    Target,
    TrendingUp
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from '@/config/api';

export default function VendedoresSimplesPage() {
    const { user } = useAuth();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
    const [showForm, setShowForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState<EditarUsuarioData | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPermissao, setFilterPermissao] = useState<string>("");
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        username: "",
        senha: "",
        perfil: "vendedor" as const,
    });

    // Carregar usuários do backend
    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            setLoading(true);
            const response = await api.get('/usuarios');
            setUsuarios(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            toast.error("Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoadingActions(prev => ({ ...prev, criarUsuario: true }));
            
            const response = await api.post('/usuarios', formData);
            
            setUsuarios([...usuarios, response.data]);
            setShowForm(false);
            setFormData({ nome: "", email: "", username: "", senha: "", perfil: "vendedor" });
            toast.success("Usuário criado com sucesso!");
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            toast.error(error instanceof Error ? error.message : "Erro ao criar usuário");
        } finally {
            setLoadingActions(prev => ({ ...prev, criarUsuario: false }));
        }
    };

    const openEditModal = (usuario: Usuario) => {
        setEditingUsuario({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            username: usuario.username,
            perfil: usuario.perfil,
            limite_desconto: usuario.limite_desconto || 5.0,
            resetar_senha: false
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUsuario) return;

        try {
            setLoadingActions(prev => ({ ...prev, editarUsuario: true }));
            
            // Atualizar dados do usuário
            await api.put(`/usuarios/${editingUsuario.id}`, {
                nome: editingUsuario.nome,
                email: editingUsuario.email,
                username: editingUsuario.username,
                perfil: editingUsuario.perfil,
                limite_desconto: editingUsuario.limite_desconto
            });

            // Resetar senha se necessário
            if (editingUsuario.resetar_senha) {
                await api.post(`/usuarios/${editingUsuario.id}/resetar-senha`);
            }

            await carregarUsuarios();
            setShowEditModal(false);
            setEditingUsuario(null);
            toast.success("Usuário atualizado com sucesso!");
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            toast.error("Erro ao atualizar usuário");
        } finally {
            setLoadingActions(prev => ({ ...prev, editarUsuario: false }));
        }
    };

    const toggleStatus = async (id: number) => {
        try {
            setLoadingActions(prev => ({ ...prev, [`toggle_${id}`]: true }));
            
            await api.put(`/usuarios/${id}/toggle-status`);
            
            await carregarUsuarios();
            toast.success("Status do usuário alterado com sucesso!");
        } catch (error) {
            console.error('Erro ao alterar status:', error);
            toast.error("Erro ao alterar status do usuário");
        } finally {
            setLoadingActions(prev => ({ ...prev, [`toggle_${id}`]: false }));
        }
    };

    const resetPassword = async (id: number) => {
        try {
            setLoadingActions(prev => ({ ...prev, [`reset_${id}`]: true }));
            
            await api.post(`/usuarios/${id}/resetar-senha`);
            
            toast.success("Senha resetada com sucesso!");
        } catch (error) {
            console.error('Erro ao resetar senha:', error);
            toast.error("Erro ao resetar senha");
        } finally {
            setLoadingActions(prev => ({ ...prev, [`reset_${id}`]: false }));
        }
    };

    // Exportar relatório de vendedores
    const handleExportarRelatorio = async () => {
        try {
            setLoadingActions(prev => ({ ...prev, exportar: true }));
            
            const response = await api.get('/usuarios/relatorio', {
                responseType: 'blob'
            });
            
            // Criar download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'relatorio-vendedores.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success('Relatório exportado com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
            toast.error('Erro ao exportar relatório');
        } finally {
            setLoadingActions(prev => ({ ...prev, exportar: false }));
        }
    };

    // Importar vendedores
    const handleImportarVendedores = async (file: File) => {
        try {
            setLoadingActions(prev => ({ ...prev, importar: true }));
            
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await api.post('/usuarios/importar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success('Vendedores importados com sucesso!');
            await carregarUsuarios();
        } catch (error) {
            console.error('Erro ao importar vendedores:', error);
            toast.error('Erro ao importar vendedores');
        } finally {
            setLoadingActions(prev => ({ ...prev, importar: false }));
        }
    };

    // Analisar performance do vendedor
    const handleAnalisarPerformance = async (usuarioId: number) => {
        try {
            setLoadingActions(prev => ({ ...prev, [`performance_${usuarioId}`]: true }));
            
            const response = await api.get(`/usuarios/${usuarioId}/performance`);
            
            // Aqui você pode abrir um modal com os detalhes da performance
            console.log('Performance do vendedor:', response.data);
            toast.success('Análise de performance concluída!');
            
        } catch (error) {
            console.error('Erro ao analisar performance:', error);
            toast.error('Erro ao analisar performance');
        } finally {
            setLoadingActions(prev => ({ ...prev, [`performance_${usuarioId}`]: false }));
        }
    };

    // Definir meta para vendedor
    const handleDefinirMeta = async (usuarioId: number) => {
        try {
            const meta = prompt('Digite a meta de vendas (R$):');
            if (!meta) return;

            setLoadingActions(prev => ({ ...prev, [`meta_${usuarioId}`]: true }));
            
            await api.put(`/usuarios/${usuarioId}/meta`, {
                meta_vendas: parseFloat(meta)
            });
            
            toast.success('Meta definida com sucesso!');
            await carregarUsuarios();
            
        } catch (error) {
            console.error('Erro ao definir meta:', error);
            toast.error('Erro ao definir meta');
        } finally {
            setLoadingActions(prev => ({ ...prev, [`meta_${usuarioId}`]: false }));
        }
    };

    const getPermissaoColor = (perfil: string) => {
        switch (perfil) {
            case "gestor": return "bg-purple-100 text-purple-800";
            case "vendedor": return "bg-blue-100 text-blue-800";
            case "anuncios": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const filteredUsuarios = usuarios.filter(usuario => {
        const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPermissao = !filterPermissao || usuario.perfil === filterPermissao;
        return matchesSearch && matchesPermissao;
    });

    return (
        <LayoutGestor>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <UserCheck className="w-8 h-8" />
                                Gestão de Vendedores
                            </h1>
                            <p className="text-blue-100 text-lg">
                                Gerencie sua equipe de vendas
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleExportarRelatorio}
                                disabled={loadingActions.exportar}
                                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                            >
                                <Download className="w-5 h-5" />
                                {loadingActions.exportar ? 'Exportando...' : 'Exportar Relatório'}
                            </button>

                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200"
                            >
                                <UserPlus className="w-5 h-5" />
                                Novo Vendedor
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Busca */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar vendedores..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Filtro por permissão */}
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={filterPermissao}
                                onChange={(e) => setFilterPermissao(e.target.value)}
                                className="pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white min-w-[200px]"
                            >
                                <option value="">Todas as permissões</option>
                                <option value="vendedor">Vendedor</option>
                                <option value="gestor">Gestor</option>
                                <option value="anuncios">Anúncios</option>
                            </select>
                        </div>

                        {/* Botão de atualizar */}
                        <button
                            onClick={carregarUsuarios}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Carregando...' : 'Atualizar'}
                        </button>
                    </div>
                </div>

                {/* Lista de Vendedores */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Vendedor</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Permissão</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Limite Desconto</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                                                    <UserCheck className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{usuario.nome}</div>
                                                    <div className="text-sm text-gray-500">@{usuario.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{usuario.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPermissaoColor(usuario.perfil)}`}>
                                                {usuario.perfil}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {usuario.limite_desconto || 5}%
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {usuario.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleAnalisarPerformance(usuario.id)}
                                                    disabled={loadingActions[`performance_${usuario.id}`]}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Analisar Performance"
                                                >
                                                    <BarChart3 className="w-4 h-4" />
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleDefinirMeta(usuario.id)}
                                                    disabled={loadingActions[`meta_${usuario.id}`]}
                                                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Definir Meta"
                                                >
                                                    <Target className="w-4 h-4" />
                                                </button>
                                                
                                                <button
                                                    onClick={() => openEditModal(usuario)}
                                                    className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                
                                                <button
                                                    onClick={() => resetPassword(usuario.id)}
                                                    disabled={loadingActions[`reset_${usuario.id}`]}
                                                    className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Resetar Senha"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                
                                                <button
                                                    onClick={() => toggleStatus(usuario.id)}
                                                    disabled={loadingActions[`toggle_${usuario.id}`]}
                                                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                                                        usuario.ativo 
                                                            ? 'text-red-600 hover:bg-red-100' 
                                                            : 'text-green-600 hover:bg-green-100'
                                                    }`}
                                                    title={usuario.ativo ? 'Desativar' : 'Ativar'}
                                                >
                                                    {usuario.ativo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Novo Vendedor */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Novo Vendedor</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                    <input
                                        type="password"
                                        value={formData.senha}
                                        onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                                    <select
                                        value={formData.perfil}
                                        onChange={(e) => setFormData(prev => ({ ...prev, perfil: e.target.value as any }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="vendedor">Vendedor</option>
                                        <option value="gestor">Gestor</option>
                                        <option value="anuncios">Anúncios</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-4 mt-6">
                                    <button
                                        type="submit"
                                        disabled={loadingActions.criarUsuario}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {loadingActions.criarUsuario ? 'Criando...' : 'Criar Vendedor'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Editar Vendedor */}
                {showEditModal && editingUsuario && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Editar Vendedor</h3>
                            
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={editingUsuario.nome}
                                        onChange={(e) => setEditingUsuario(prev => prev ? { ...prev, nome: e.target.value } : null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editingUsuario.email}
                                        onChange={(e) => setEditingUsuario(prev => prev ? { ...prev, email: e.target.value } : null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={editingUsuario.username}
                                        onChange={(e) => setEditingUsuario(prev => prev ? { ...prev, username: e.target.value } : null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Desconto (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={editingUsuario.limite_desconto}
                                        onChange={(e) => setEditingUsuario(prev => prev ? { ...prev, limite_desconto: parseFloat(e.target.value) || 0 } : null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                        max="100"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="resetar_senha"
                                        checked={editingUsuario.resetar_senha}
                                        onChange={(e) => setEditingUsuario(prev => prev ? { ...prev, resetar_senha: e.target.checked } : null)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="resetar_senha" className="text-sm text-gray-700">
                                        Resetar senha
                                    </label>
                                </div>

                                <div className="flex items-center gap-4 mt-6">
                                    <button
                                        type="submit"
                                        disabled={loadingActions.editarUsuario}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {loadingActions.editarUsuario ? 'Salvando...' : 'Salvar Alterações'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </LayoutGestor>
    );
} 