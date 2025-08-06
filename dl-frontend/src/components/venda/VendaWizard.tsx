"use client";

import { useVenda } from "@/contexts/VendaContext";
import { EstoqueService, ProdutoEstoque } from '@/services/estoqueService';
import { buscarClientes } from "@/services/vendaService";
import { Cliente } from "@/types/venda";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import AnexarFreteModal from "./AnexarFreteModal";
import { api } from "@/config/api";

// Tipos
interface ProdutoAvulso {
  nome: string;
  preco: number;
  marca: string;
  modelo: string;
  quantidade: number;
  observacoes?: string;
  imagem?: File;
}

interface ProdutoTiny {
  id: string;
  nome: string;
  codigo?: string;
  preco?: number;
  saldo_fisico?: number;
  unidade?: string;
  categoria?: string;
}

// Componente principal do wizard
const VendaWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [buscaProduto, setBuscaProduto] = useState("");
  const [produtosEncontrados, setProdutosEncontrados] = useState<ProdutoEstoque[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEstoque | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  // Corrigir: garantir que o objeto de state produtoAvulso é estável e não causa remount
  const [produtoAvulso, setProdutoAvulso] = useState<ProdutoAvulso>(() => ({
    nome: "",
    preco: 0,
    marca: "",
    modelo: "",
    quantidade: 1,
    observacoes: ""
  }));
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [formaPagamento, setFormaPagamento] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [buscaCliente, setBuscaCliente] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [vendaFinalizada, setVendaFinalizada] = useState(false);
  const [emitirNFe, setEmitirNFe] = useState(false);

  // Estados para debounce e paginação
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [produtosPaginados, setProdutosPaginados] = useState<ProdutoEstoque[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [temMaisProdutos, setTemMaisProdutos] = useState(false);
  const [debounceAtivo, setDebounceAtivo] = useState(false);
  const ITENS_POR_PAGINA = 15;
  const [modalAnexarFreteOpen, setModalAnexarFreteOpen] = useState(false);

  const { carrinho, adicionarProduto, setCliente, limparVenda } = useVenda();

  // Debug: Log do carrinho sempre que mudar
  useEffect(() => {
    console.log('🛒 VendaWizard - Carrinho atualizado:', carrinho);
  }, [carrinho]);

  // Carregar clientes na inicialização
  useEffect(() => {
    const carregarClientes = async () => {
      setLoadingClientes(true);
      try {
        const clientesData = await buscarClientes();
        setClientes(clientesData);
        setClientesFiltrados(clientesData);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setLoadingClientes(false);
      }
    };
    carregarClientes();
  }, []);

  // Limpar timeout quando componente for desmontado
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  // Buscar produtos no estoque - CORRIGIDO: Debounce de 1 segundo e busca manual
  const buscarProdutos = useCallback(async (termo: string) => {
    if (!termo.trim() || termo.trim().length < 3) {
      setProdutosEncontrados([]);
      setProdutosPaginados([]);
      setPaginaAtual(1);
      setTemMaisProdutos(false);
      return;
    }

    console.log('🔍 Iniciando busca de produtos no estoque:', termo);
    setLoading(true);
    try {
      const produtos = await EstoqueService.buscarProdutosPorTermo(termo.trim());
      console.log('✅ Produtos encontrados no estoque:', produtos.length);
      setProdutosEncontrados(produtos);

      // Paginar resultados
      const produtosLimitados = produtos.slice(0, ITENS_POR_PAGINA);
      setProdutosPaginados(produtosLimitados);
      setTemMaisProdutos(produtos.length > ITENS_POR_PAGINA);
      setPaginaAtual(1);
    } catch (error) {
      console.log('❌ Erro na busca de produtos:', error);
      setProdutosEncontrados([]);
      setProdutosPaginados([]);
      setTemMaisProdutos(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para carregar mais produtos (pagination)
  const carregarMaisProdutos = () => {
    if (!temMaisProdutos || debounceAtivo) return;

    setDebounceAtivo(true);
    const inicio = paginaAtual * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const novosProdutos = produtosEncontrados.slice(inicio, fim);

    setProdutosPaginados(prev => [...prev, ...novosProdutos]);
    setPaginaAtual(prev => prev + 1);
    setTemMaisProdutos(fim < produtosEncontrados.length);

    setTimeout(() => setDebounceAtivo(false), 500);
  };

  // Debounce para busca de produtos
  const handleBuscaProdutoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const termo = e.target.value;
    setBuscaProduto(termo);

    // Limpar timeout anterior
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Definir novo timeout
    const novoTimeout = setTimeout(() => {
      buscarProdutos(termo);
    }, 1000);

    setDebounceTimeout(novoTimeout);
  };

  // Selecionar produto
  const handleProdutoSelecionado = (produto: ProdutoEstoque) => {
    setProdutoSelecionado(produto);
    setQuantidade(1);
  };

  // Adicionar produto ao carrinho
  const handleAdicionarProduto = () => {
    if (!produtoSelecionado) return;

    // Formatar produto para o formato esperado pelo contexto
    const produtoFormatado = EstoqueService.formatarProdutoParaSistema(produtoSelecionado);

    // Criar item para o carrinho
    const itemCarrinho = {
      id_produto_tiny: produtoFormatado.id_produto_tiny,
      nome_produto: produtoFormatado.nome_produto,
      quantidade: quantidade,
      preco_unitario: produtoFormatado.preco_unitario,
      sku: produtoFormatado.sku,
      imagem: produtoFormatado.imagem,
      permalink: produtoFormatado.permalink
    };

    adicionarProduto(itemCarrinho);

    // Limpar seleção
    setProdutoSelecionado(null);
    setQuantidade(1);
    setBuscaProduto("");
    setProdutosEncontrados([]);
    setProdutosPaginados([]);

    console.log('✅ Produto adicionado ao carrinho:', produtoSelecionado.nome);
  };

  // Buscar clientes
  const handleBuscaClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const termo = e.target.value;
    setBuscaCliente(termo);

    if (!termo.trim()) {
      setClientesFiltrados(clientes);
      return;
    }

    const filtrados = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(termo.toLowerCase()) ||
      cliente.telefone?.includes(termo) ||
      cliente.email?.toLowerCase().includes(termo.toLowerCase())
    );
    setClientesFiltrados(filtrados);
  };

  // Selecionar cliente
  const handleClienteSelecionado = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setCliente(cliente as any);
    setBuscaCliente(cliente.nome);
    setClientesFiltrados([]);
  };

  // Finalizar venda
  const handleFinalizarVenda = async () => {
    if (!clienteSelecionado || carrinho.length === 0) {
      alert("Selecione um cliente e adicione produtos ao carrinho");
      return;
    }

    setLoading(true);
    try {
      console.log('🛒 Finalizando venda:', {
        cliente: clienteSelecionado,
        produtos: carrinho,
        formaPagamento,
        emitirNFe
      });

      // FUTURO: Salvar venda no banco com campo emitir_nfe
      const vendaData = {
        cliente_id: clienteSelecionado.id,
        produtos: carrinho,
        forma_pagamento: formaPagamento,
        valor_total: carrinho.reduce((total, item) => total + (item.preco_unitario * item.quantidade), 0),
        emitir_nfe: emitirNFe
      };

      // Simular salvamento da venda
      console.log('💾 Salvando venda:', vendaData);

      // Se deve emitir NF-e, chamar endpoint
      if (emitirNFe) {
        try {
          const nfePayload = {
            venda_id: Date.now().toString(), // FUTURO: ID real da venda
            cliente: {
              nome: clienteSelecionado.nome,
              cnpj: (clienteSelecionado as any).cnpj || "00000000000000",
              email: clienteSelecionado.email || ""
            },
            produtos: carrinho.map(item => ({
              nome: (item as any).nome,
              quantidade: item.quantidade,
              valor: item.preco_unitario
            })),
            valor_total: carrinho.reduce((total, item) => total + (item.preco_unitario * item.quantidade), 0),
            canal: "Balcão"
          };

          console.log('📄 Enviando dados para emissão de NF-e:', nfePayload);

          // FUTURO: Chamada real para o endpoint
          // const response = await fetch('/api/nfe/emitir', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(nfePayload)
          // });
          // const nfeResult = await response.json();

          // Mock da resposta da NF-e
          const nfeResult = {
            nfe_id: `NFe-${Date.now().toString().slice(-6)}`,
            status: "Autorizada",
            xml_url: `/mock/xml/NFe-${Date.now().toString().slice(-6)}.xml`,
            danfe_pdf_url: `/mock/pdf/NFe-${Date.now().toString().slice(-6)}.pdf`
          };

          console.log('✅ NF-e emitida com sucesso:', nfeResult);
          alert(`NF-e ${nfeResult.nfe_id} emitida com sucesso!`);
        } catch (nfeError) {
          console.error('❌ Erro ao emitir NF-e:', nfeError);
          alert('Venda finalizada, mas houve erro na emissão da NF-e');
        }
      }

      // Simular sucesso
      setVendaFinalizada(true);
      setTimeout(() => {
        limparVenda();
        setVendaFinalizada(false);
        setStep(1);
        setEmitirNFe(false);
      }, 3000);

    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao finalizar venda');
    } finally {
      setLoading(false);
    }
  };

  // Calcular total do carrinho
  const totalCarrinho = carrinho.reduce((total, item) => total + (item.preco_unitario * item.quantidade), 0);

  // Renderizar step atual
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🛒 Nova Venda</h2>
              <p className="text-gray-600">Adicione produtos ao carrinho</p>
            </div>

            {/* Busca de Produtos */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">🔍 Buscar Produtos</h3>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Digite o nome do produto (mínimo 3 caracteres)..."
                  value={buscaProduto}
                  onChange={handleBuscaProdutoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {loading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Buscando produtos...</span>
                </div>
              )}

              {/* Lista de Produtos Encontrados */}
              {produtosPaginados.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {produtosPaginados.map((produto) => (
                    <div
                      key={produto.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${produtoSelecionado?.id === produto.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => handleProdutoSelecionado(produto)}
                    >
                      <div className="flex items-center space-x-3">
                        {produto.imagem && (
                          <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="w-12 h-12 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{produto.nome}</h4>
                          <p className="text-sm text-gray-500">
                            SKU: {produto.sku} | Estoque: {produto.quantidade} UN
                          </p>
                          {produto.categoria && (
                            <p className="text-xs text-gray-400">
                              Categoria: {produto.categoria}
                            </p>
                          )}
                          <p className="text-sm text-green-600 font-bold">
                            R$ {produto.preco.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {temMaisProdutos && (
                    <button
                      onClick={carregarMaisProdutos}
                      disabled={debounceAtivo}
                      className="w-full py-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    >
                      {debounceAtivo ? 'Carregando...' : 'Carregar mais produtos'}
                    </button>
                  )}
                </div>
              )}

              {/* Produto Selecionado */}
              {produtoSelecionado && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-800 mb-2">Produto Selecionado:</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{produtoSelecionado.nome}</p>
                      <p className="text-sm text-gray-600">R$ {produtoSelecionado.preco.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max={produtoSelecionado.quantidade}
                        value={quantidade}
                        onChange={(e) => setQuantidade(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={handleAdicionarProduto}
                        disabled={produtoSelecionado.quantidade === 0}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {produtoSelecionado.quantidade === 0 ? 'Sem Estoque' : 'Adicionar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Carrinho */}
            {carrinho.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">🛒 Carrinho</h3>
                <div className="space-y-3">
                  {carrinho.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">{item.nome_produto}</p>
                        <p className="text-sm text-gray-500">Qtd: {item.quantidade}</p>
                      </div>
                      <p className="font-medium text-green-600">
                        R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg text-green-600">
                        R$ {totalCarrinho.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                disabled={carrinho.length === 0}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
                <ChevronRight className="inline ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">👤 Selecionar Cliente</h2>
              <p className="text-gray-600">Escolha o cliente para a venda</p>
            </div>

            {/* Busca de Cliente */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">🔍 Buscar Cliente</h3>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Digite o nome, telefone ou email do cliente..."
                  value={buscaCliente}
                  onChange={handleBuscaClienteChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Lista de Clientes */}
              {clientesFiltrados.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {clientesFiltrados.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleClienteSelecionado(cliente)}
                    >
                      <p className="font-medium">{cliente.nome}</p>
                      <p className="text-sm text-gray-600">{cliente.telefone}</p>
                      {cliente.email && (
                        <p className="text-sm text-gray-500">{cliente.email}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Cliente Selecionado */}
              {clienteSelecionado && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-800 mb-2">Cliente Selecionado:</h4>
                  <p className="font-medium">{clienteSelecionado.nome}</p>
                  <p className="text-sm text-gray-600">{clienteSelecionado.telefone}</p>
                  {clienteSelecionado.email && (
                    <p className="text-sm text-gray-500">{clienteSelecionado.email}</p>
                  )}
                </div>
              )}
            </div>

            {/* Forma de Pagamento */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">💳 Forma de Pagamento</h3>
              <div className="grid grid-cols-2 gap-3">
                {['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'].map((forma) => (
                  <button
                    key={forma}
                    onClick={() => setFormaPagamento(forma)}
                    className={`p-3 border rounded-lg text-center transition-colors ${formaPagamento === forma
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {forma}
                  </button>
                ))}
              </div>
            </div>

            {/* Resumo da Venda */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">📋 Resumo da Venda</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span className="font-medium">{clienteSelecionado?.nome || 'Não selecionado'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Produtos:</span>
                  <span className="font-medium">{carrinho.length} itens</span>
                </div>
                <div className="flex justify-between">
                  <span>Forma de Pagamento:</span>
                  <span className="font-medium">{formaPagamento || 'Não selecionada'}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-green-600">R$ {totalCarrinho.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Opções de NF-e */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">📄 Nota Fiscal Eletrônica</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="emitirNFe"
                    checked={emitirNFe}
                    onChange={(e) => setEmitirNFe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="emitirNFe" className="text-sm font-medium text-gray-700">
                    Emitir Nota Fiscal?
                  </label>
                </div>
                {emitirNFe && (
                  <div className="ml-7 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      ✅ Uma NF-e será emitida automaticamente após a finalização da venda.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      A nota fiscal será gerada com os dados do cliente e produtos da venda.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <ChevronLeft className="inline mr-2 h-4 w-4" />
                Voltar
              </button>
              <button
                onClick={handleFinalizarVenda}
                disabled={!clienteSelecionado || !formaPagamento || loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Finalizando...' : 'Finalizar Venda'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Venda finalizada
  if (vendaFinalizada) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Check className="mx-auto h-16 w-16 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">✅ Venda Finalizada!</h2>
        <p className="text-gray-600">A venda foi concluída com sucesso.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderStep()}

      {/* Modal de Anexar Frete */}
      <AnexarFreteModal
        isOpen={modalAnexarFreteOpen}
        onClose={() => setModalAnexarFreteOpen(false)}
      />
    </div>
  );
};

export default VendaWizard; 