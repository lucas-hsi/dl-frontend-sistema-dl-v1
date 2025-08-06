// src/components/cliente/ListaClientes.tsx
// Componente de lista de clientes com filtros e ações

import React, { useEffect, useState, useRef } from 'react';
import { Cliente } from '../../types/cliente';
import { Search, Plus, Edit, Trash2, User } from 'lucide-react';
import { ClienteService } from '../../services/clienteService';
import { api } from '@/config/api';

const ListaClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  // Adicionar observacoes ao form state
  const [form, setForm] = useState({ nome: '', cpf: '', telefone: '', email: '', endereco: '', observacoes: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const motivosVale = [
    { value: 'devolução', label: 'Devolução' },
    { value: 'defeito', label: 'Defeito' },
    { value: 'não compatível', label: 'Não compatível' }
  ];
  const [showValeModal, setShowValeModal] = useState(false);
  const [valeCliente, setValeCliente] = useState<Cliente | null>(null);
  const [valeForm, setValeForm] = useState({ valor: '', motivo: motivosVale[0].value, observacao: '' });
  const [valeLoading, setValeLoading] = useState(false);
  const [valesHistorico, setValesHistorico] = useState<any[]>([]);
  const valeInputRef = useRef<HTMLInputElement>(null);

  // Função para buscar clientes
  const fetchClientes = async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await api.get('/clientes/');
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao buscar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Função para abrir modal de edição
  const handleEditarCliente = (cliente: Cliente) => {
    setForm({
      nome: cliente.nome || '',
      cpf: cliente.cpf_cnpj || '',
      telefone: cliente.telefone || '',
      email: cliente.email || '',
      endereco: cliente.rua || '',
      observacoes: cliente.observacoes || ''
    });
    setEditId(cliente.id);
    setShowModal(true);
  };

  // Função para salvar (criar ou editar)
  const handleSalvarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setToast(null);
    try {
      if (editId) {
        await api.put(`/clientes/${editId}/`, {
          nome: form.nome,
          cpf_cnpj: form.cpf,
          telefone: form.telefone,
          email: form.email,
          rua: form.endereco,
          observacoes: form.observacoes
        });
        setToast({ type: 'success', message: 'Cliente editado com sucesso!' });
      } else {
        await api.post('/clientes/', {
          nome: form.nome,
          cpf_cnpj: form.cpf,
          telefone: form.telefone,
          email: form.email,
          rua: form.endereco,
          observacoes: form.observacoes
        });
        setToast({ type: 'success', message: 'Cliente cadastrado com sucesso!' });
      }
      setShowModal(false);
      setForm({ nome: '', cpf: '', telefone: '', email: '', endereco: '', observacoes: '' });
      setEditId(null);
      await fetchClientes();
    } catch (error) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Erro ao salvar cliente' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleExcluirCliente = async (cliente: Cliente) => {
    if (!window.confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?`)) return;
    setFormLoading(true);
    setToast(null);
    try {
      await api.delete(`/clientes/${cliente.id}/`);
      setToast({ type: 'success', message: 'Cliente excluído com sucesso!' });
      await fetchClientes();
    } catch (error) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Erro ao excluir cliente' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleAbrirVale = async (cliente: Cliente) => {
    setValeCliente(cliente);
    setValeForm({ valor: '', motivo: motivosVale[0].value, observacao: '' });
    setShowValeModal(true);
    setValeLoading(true);
    try {
      let data = await api.get(`/clientes/${cliente.id}/vales`);
      setValesHistorico(Array.isArray(data) ? data : []);
    } catch {
      setValesHistorico([]);
    } finally {
      setValeLoading(false);
    }
  };

  const handleSalvarVale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valeCliente) return;
    setValeLoading(true);
    setToast(null);
    try {
      await api.post('/vales', {
        cliente_id: valeCliente.id,
        valor: parseFloat(valeForm.valor.replace(',', '.')),
        motivo: valeForm.motivo,
        observacao: valeForm.observacao
      });
      setToast({ type: 'success', message: 'Vale gerado com sucesso!' });
      setShowValeModal(false);
      setValeCliente(null);
      setValeForm({ valor: '', motivo: motivosVale[0].value, observacao: '' });
      await fetchClientes();
    } catch (error) {
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Erro ao gerar vale-peça' });
    } finally {
      setValeLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (cliente.telefone && cliente.telefone.includes(busca)) ||
    (cliente.cpf_cnpj && cliente.cpf_cnpj.includes(busca))
  );

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      {/* Botão fixo para cadastrar novo cliente */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center px-5 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <span className="text-xl mr-2">➕</span> Cadastrar Novo Cliente
      </button>
      {/* Modal de cadastro/edição */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button onClick={() => { setShowModal(false); setEditId(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">×</button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editId ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</h2>
            <form onSubmit={handleSalvarCliente} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <input type="text" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-green-500" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-green-500" value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="text" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-green-500" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="(11) 99999-9999" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-green-500" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-green-500" value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} placeholder="Rua, número, bairro..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-green-500" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} placeholder="Observações do cliente (opcional)" rows={2} />
              </div>
              <button type="submit" disabled={formLoading} className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 mt-4">{formLoading ? 'Salvando...' : (editId ? 'Salvar Alterações' : 'Salvar Cliente')}</button>
            </form>
          </div>
        </div>
      )}
      {/* Header com filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nome, telefone ou CPF..."
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-green-500"
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Lista de clientes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando clientes...</div>
          ) : erro ? (
            <div className="p-8 text-center text-red-600">{erro}</div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum cliente encontrado.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.cpf_cnpj || '---'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.telefone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email || '---'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={cliente.observacoes || ''}>{cliente.observacoes || '---'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => handleEditarCliente(cliente)} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 mr-2" title="Editar cliente"><Edit size={16} /></button>
                      <button onClick={() => handleExcluirCliente(cliente)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 mr-2" title="Excluir cliente"><Trash2 size={16} /></button>
                      <button onClick={() => handleAbrirVale(cliente)} className="text-green-700 hover:text-green-900 p-1 rounded hover:bg-green-50" title="Gerar Vale-Peça">💵</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="text-center text-sm text-gray-500">
        {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''} encontrado{clientesFiltrados.length !== 1 ? 's' : ''}
      </div>
      {/* Modal de Vale-Peça */}
      {showValeModal && valeCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button onClick={() => setShowValeModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">×</button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Gerar Vale-Peça para {valeCliente.nome}</h2>
            <form onSubmit={handleSalvarVale} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input ref={valeInputRef} type="number" min="0.01" step="0.01" required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-green-500" value={valeForm.valor} onChange={e => setValeForm(f => ({ ...f, valor: e.target.value }))} placeholder="0,00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <select required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-green-500" value={valeForm.motivo} onChange={e => setValeForm(f => ({ ...f, motivo: e.target.value }))}>
                  {motivosVale.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                <textarea className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-green-500" value={valeForm.observacao} onChange={e => setValeForm(f => ({ ...f, observacao: e.target.value }))} placeholder="Observação (opcional)" rows={2} />
              </div>
              <button type="submit" disabled={valeLoading} className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 mt-4">{valeLoading ? 'Salvando...' : 'Gerar Vale-Peça'}</button>
            </form>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Histórico de Vales</h3>
              {valeLoading ? <div className="text-gray-500">Carregando...</div> : (
                <ul className="divide-y divide-gray-200 max-h-40 overflow-y-auto">
                  {valesHistorico.length === 0 ? <li className="text-gray-500 py-2">Nenhum vale encontrado.</li> : valesHistorico.map((v, i) => (
                    <li key={v.id || i} className="py-2 text-sm flex flex-col">
                      <span><b>Valor:</b> R$ {v.valor?.toFixed(2)}</span>
                      <span><b>Motivo:</b> {v.motivo}</span>
                      {v.observacao && <span><b>Obs.:</b> {v.observacao}</span>}
                      <span className="text-xs text-gray-400">{v.data_criacao ? new Date(v.data_criacao).toLocaleString('pt-BR') : ''}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaClientes; 