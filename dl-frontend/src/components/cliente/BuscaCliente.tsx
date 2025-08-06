// src/components/cliente/BuscaCliente.tsx
// Componente para busca de clientes

import React, { useState, useEffect } from 'react';
import { ClienteService } from '../../services/clienteService';
import { Cliente } from '../../types/cliente';

interface BuscaClienteProps {
  onClienteSelecionado: (cliente: Cliente) => void;
  placeholder?: string;
  className?: string;
}

export const BuscaCliente: React.FC<BuscaClienteProps> = ({
  onClienteSelecionado,
  placeholder = "Buscar clientes...",
  className = ""
}) => {
  const [termo, setTermo] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Buscar clientes quando o termo mudar
  useEffect(() => {
    const buscarClientes = async () => {
      if (!termo.trim() || termo.trim().length < 3) {
        setClientes([]);
        setMostrarResultados(false);
        return;
      }

      setLoading(true);
      setErro(null);

      try {
        const resultado = await ClienteService.buscarClientesPorTermo(termo);
        setClientes(resultado);
        setMostrarResultados(true);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setErro(error instanceof Error ? error.message : 'Erro ao buscar clientes');
        setClientes([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar muitas requisições
    const timeoutId = setTimeout(buscarClientes, 300);
    return () => clearTimeout(timeoutId);
  }, [termo]);

  const handleClienteClick = (cliente: Cliente) => {
    onClienteSelecionado(cliente);
    setTermo('');
    setMostrarResultados(false);
    setClientes([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermo(e.target.value);
  };

  const handleInputFocus = () => {
    if (clientes.length > 0) {
      setMostrarResultados(true);
    }
  };

  const handleInputBlur = () => {
    // Pequeno delay para permitir cliques nos resultados
    setTimeout(() => {
      setMostrarResultados(false);
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={termo}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Resultados da busca */}
      {mostrarResultados && (clientes.length > 0 || erro) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {erro && (
            <div className="p-3 text-red-600 text-sm">
              {erro}
            </div>
          )}
          
          {clientes.length > 0 && (
            <div>
              {clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  onClick={() => handleClienteClick(cliente)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {cliente.nome}
                      </div>
                      {cliente.telefone && (
                        <div className="text-sm text-gray-500">
                          {ClienteService.formatarTelefone(cliente.telefone)}
                        </div>
                      )}
                      {cliente.cpf_cnpj && (
                        <div className="text-sm text-gray-500">
                          {ClienteService.formatarCPFCNPJ(cliente.cpf_cnpj)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {cliente.cidade && (
                        <div className="text-sm text-gray-500">
                          {cliente.cidade}
                          {cliente.uf && ` - ${cliente.uf}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {clientes.length === 0 && !erro && termo.length >= 2 && (
            <div className="p-3 text-gray-500 text-sm">
              Nenhum cliente encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 