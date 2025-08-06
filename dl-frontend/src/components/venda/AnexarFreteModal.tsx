"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Package, User, Phone, Calendar, DollarSign } from "lucide-react";
import { api } from '@/config/api';

interface Orcamento {
  id: number;
  cliente_nome: string;
  cliente_telefone?: string;
  valor_total: number;
  data_criacao: string;
  status: string;
  itens: Array<{
    nome_produto: string;
    quantidade: number;
    preco_unitario: number;
  }>;
}

interface CotacaoFrete {
  cep_origem: string;
  cep_destino: string;
  peso: number;
  altura: number;
  largura: number;
  comprimento: number;
  tipo_envio: string;
  valor_declarado: number;
}

interface AnexarFreteModalProps {
  isOpen: boolean;
  onClose: () => void;
}



const AnexarFreteModal: React.FC<AnexarFreteModalProps> = ({ isOpen, onClose }) => {
  const [buscaOrcamento, setBuscaOrcamento] = useState("");
  const [orcamentosEncontrados, setOrcamentosEncontrados] = useState<Orcamento[]>([]);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Buscar orçamento, 2: Formulário frete
  
  // Dados do frete
  const [cotacaoFrete, setCotacaoFrete] = useState<CotacaoFrete>({
    cep_origem: "",
    cep_destino: "",
    peso: 0,
    altura: 0,
    largura: 0,
    comprimento: 0,
    tipo_envio: "PAC",
    valor_declarado: 0
  });

  // Buscar orçamentos
  const buscarOrcamentos = async (termo: string) => {
    if (!termo.trim() || termo.length < 3) {
      setOrcamentosEncontrados([]);
      return;
    }

    setLoading(true);
    try {
      const orcamentos = await api.get(`/orcamentos/buscar/?termo=${encodeURIComponent(termo)}`);
      setOrcamentosEncontrados(Array.isArray(orcamentos) ? orcamentos : []);
    } catch (error) {
      console.error("Erro ao buscar orçamentos:", error);
      setOrcamentosEncontrados([]);
    } finally {
      setLoading(false);
    }
  };

  // Selecionar orçamento
  const selecionarOrcamento = (orcamento: Orcamento) => {
    setOrcamentoSelecionado(orcamento);
    setStep(2);
  };

  // Salvar cotação de frete
  const salvarCotacaoFrete = async () => {
    if (!orcamentoSelecionado) return;

    try {
      const cotacaoData = {
        orcamento_id: orcamentoSelecionado.id,
        ...cotacaoFrete
      };

      await api.post('/frete/cotacao', cotacaoData);
      alert('Cotação de frete anexada com sucesso!');
      limparFormulario();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cotação:', error);
      alert('Erro ao salvar cotação de frete. Tente novamente.');
    }
  };

  // Limpar formulário
  const limparFormulario = () => {
    setBuscaOrcamento("");
    setOrcamentosEncontrados([]);
    setOrcamentoSelecionado(null);
    setStep(1);
    setCotacaoFrete({
      cep_origem: "",
      cep_destino: "",
      peso: 0,
      altura: 0,
      largura: 0,
      comprimento: 0,
      tipo_envio: "PAC",
      valor_declarado: 0
    });
  };

  // Validar CEP
  const validarCEP = (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {step === 1 ? "Buscar Orçamento" : "Anexar Cotação de Frete"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Buscar orçamento
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por cliente ou telefone
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite o nome do cliente ou telefone..."
                    value={buscaOrcamento}
                    onChange={(e) => {
                      setBuscaOrcamento(e.target.value);
                      if (e.target.value.length >= 3) {
                        buscarOrcamentos(e.target.value);
                      } else {
                        setOrcamentosEncontrados([]);
                      }
                    }}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => buscarOrcamentos(buscaOrcamento)}
                    disabled={loading || buscaOrcamento.length < 3}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Buscando..." : "Buscar"}
                  </button>
                </div>
              </div>

              {/* Lista de orçamentos */}
              {orcamentosEncontrados.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">
                    Orçamentos Encontrados: {orcamentosEncontrados.length}
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {orcamentosEncontrados.map((orcamento) => (
                      <div
                        key={orcamento.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                        onClick={() => selecionarOrcamento(orcamento)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <h4 className="font-medium text-gray-800">
                                {orcamento.cliente_nome}
                              </h4>
                            </div>
                            {orcamento.cliente_telefone && (
                              <div className="flex items-center gap-2 mb-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {orcamento.cliente_telefone}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(orcamento.data_criacao).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-medium">
                                  R$ {orcamento.valor_total.toFixed(2)}
                                </span>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                orcamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                                orcamento.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {orcamento.status}
                              </span>
                            </div>
                          </div>
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensagem quando não há resultados */}
              {orcamentosEncontrados.length === 0 && buscaOrcamento && !loading && buscaOrcamento.length >= 3 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <p className="text-yellow-700">
                    Nenhum orçamento encontrado com esse termo.
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Step 2: Formulário de frete
            <div className="space-y-6">
              {/* Resumo do orçamento selecionado */}
              {orcamentoSelecionado && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-3">
                    Orçamento Selecionado
                  </h3>
                  <div className="space-y-2">
                    <p><strong>Cliente:</strong> {orcamentoSelecionado.cliente_nome}</p>
                    {orcamentoSelecionado.cliente_telefone && (
                      <p><strong>Telefone:</strong> {orcamentoSelecionado.cliente_telefone}</p>
                    )}
                    <p><strong>Valor Total:</strong> R$ {orcamentoSelecionado.valor_total.toFixed(2)}</p>
                    <p><strong>Status:</strong> {orcamentoSelecionado.status}</p>
                  </div>
                </div>
              )}

              {/* Formulário de cotação de frete */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Dados do Frete</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP Origem *
                    </label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={cotacaoFrete.cep_origem}
                      onChange={(e) => {
                        const cep = e.target.value.replace(/\D/g, '');
                        const cepFormatado = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
                        setCotacaoFrete({...cotacaoFrete, cep_origem: cepFormatado});
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        cotacaoFrete.cep_origem && !validarCEP(cotacaoFrete.cep_origem)
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP Destino *
                    </label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={cotacaoFrete.cep_destino}
                      onChange={(e) => {
                        const cep = e.target.value.replace(/\D/g, '');
                        const cepFormatado = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
                        setCotacaoFrete({...cotacaoFrete, cep_destino: cepFormatado});
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        cotacaoFrete.cep_destino && !validarCEP(cotacaoFrete.cep_destino)
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={cotacaoFrete.peso}
                      onChange={(e) => setCotacaoFrete({...cotacaoFrete, peso: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={cotacaoFrete.altura}
                      onChange={(e) => setCotacaoFrete({...cotacaoFrete, altura: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Largura (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={cotacaoFrete.largura}
                      onChange={(e) => setCotacaoFrete({...cotacaoFrete, largura: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comprimento (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={cotacaoFrete.comprimento}
                      onChange={(e) => setCotacaoFrete({...cotacaoFrete, comprimento: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Envio *
                    </label>
                    <select
                      value={cotacaoFrete.tipo_envio}
                      onChange={(e) => setCotacaoFrete({...cotacaoFrete, tipo_envio: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PAC">PAC</option>
                      <option value="SEDEX">SEDEX</option>
                      <option value="SEDEX10">SEDEX 10</option>
                      <option value="SEDEX12">SEDEX 12</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Declarado (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={cotacaoFrete.valor_declarado}
                      onChange={(e) => setCotacaoFrete({...cotacaoFrete, valor_declarado: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  onClick={salvarCotacaoFrete}
                  disabled={
                    !cotacaoFrete.cep_origem || 
                    !cotacaoFrete.cep_destino || 
                    !validarCEP(cotacaoFrete.cep_origem) ||
                    !validarCEP(cotacaoFrete.cep_destino) ||
                    cotacaoFrete.peso <= 0
                  }
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Salvar Cotação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnexarFreteModal; 