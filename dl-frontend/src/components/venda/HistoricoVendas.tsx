import React, { useState, useEffect } from 'react';
import { VendaHistorico, FiltrosHistoricoVendas, Cliente, Vendedor } from '@/types/venda';
import { buscarHistoricoVendas, buscarClientes, buscarVendedores } from '@/services/vendaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HistoricoVendasProps {
  className?: string;
}

export const HistoricoVendas: React.FC<HistoricoVendasProps> = ({ className }) => {
  const [vendas, setVendas] = useState<VendaHistorico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosHistoricoVendas>({});

  // Carregar clientes e vendedores na inicialização
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [clientesData, vendedoresData] = await Promise.all([
          buscarClientes(),
          buscarVendedores()
        ]);
        setClientes(clientesData);
        setVendedores(vendedoresData);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        setError('Erro ao carregar dados iniciais');
      }
    };

    carregarDadosIniciais();
  }, []);

  const handleBuscarHistorico = async () => {
    setLoading(true);
    setError(null);

    try {
      const vendasData = await buscarHistoricoVendas(filtros);
      setVendas(vendasData);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      setError(error instanceof Error ? error.message : 'Erro ao buscar histórico');
    } finally {
      setLoading(false);
    }
  };

  const handleLimparFiltros = () => {
    setFiltros({});
    setVendas([]);
    setError(null);
  };

  const handleVerDetalhes = (vendaId: number) => {
    console.log('🔍 Ver detalhes da venda:', vendaId);
    // TODO: Implementar modal ou navegação para detalhes da venda
    alert(`Detalhes da venda ${vendaId} - Funcionalidade em desenvolvimento`);
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Histórico de Vendas</h1>
        <p className="text-gray-600">Consulte o histórico completo de vendas com filtros personalizados</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              value={filtros.cliente_id || ''}
              onChange={(e) => setFiltros(prev => ({
                ...prev,
                cliente_id: e.target.value ? Number(e.target.value) : undefined
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os clientes</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Vendedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendedor
            </label>
            <select
              value={filtros.vendedor_id || ''}
              onChange={(e) => setFiltros(prev => ({
                ...prev,
                vendedor_id: e.target.value ? Number(e.target.value) : undefined
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os vendedores</option>
              {vendedores.map((vendedor) => (
                <option key={vendedor.id} value={vendedor.id}>
                  {vendedor.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Data Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <Input
              type="date"
              value={filtros.data_inicio || ''}
              onChange={(e) => setFiltros(prev => ({
                ...prev,
                data_inicio: e.target.value || undefined
              }))}
              className="w-full"
            />
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim
            </label>
            <Input
              type="date"
              value={filtros.data_fim || ''}
              onChange={(e) => setFiltros(prev => ({
                ...prev,
                data_fim: e.target.value || undefined
              }))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleBuscarHistorico}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            {loading ? 'Buscando...' : 'Buscar Histórico'}
          </Button>
          
          <Button
            onClick={handleLimparFiltros}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      {vendas.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados ({vendas.length} vendas encontradas)
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Forma Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Itens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatarData(venda.data_venda)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venda.cliente_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venda.vendedor_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venda.forma_pagamento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatarValor(venda.valor_total)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="space-y-1">
                        {venda.itens.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs">
                            <span className="text-gray-600">{item.nome_produto}</span>
                            <span className="text-gray-500">x{item.quantidade}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        onClick={() => handleVerDetalhes(venda.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded"
                      >
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {!loading && vendas.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma venda encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            Use os filtros acima para buscar vendas ou clique em "Buscar Histórico" para ver todas as vendas.
          </p>
        </div>
      )}
    </div>
  );
}; 