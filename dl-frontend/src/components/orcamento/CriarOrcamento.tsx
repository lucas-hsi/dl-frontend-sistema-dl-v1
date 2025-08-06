// src/components/orcamento/CriarOrcamento.tsx
// Componente para criar orçamentos usando estoque centralizado

import React, { useState } from 'react';
import { EstoqueService, ProdutoEstoque } from '../../services/estoqueService';
import { salvarOrcamento } from '../../services/orcamentoService';
import { Cliente } from '../../types/cliente';
import { ItemOrcamento } from '../../types/orcamento';
import { BuscaProduto } from '../produto/BuscaProduto';
import { Button } from '../ui/button';

interface CriarOrcamentoProps {
  vendedorId: number;
  onOrcamentoCriado?: (orcamento: any) => void;
  onCancelar?: () => void;
}

export const CriarOrcamento: React.FC<CriarOrcamentoProps> = ({
  vendedorId,
  onOrcamentoCriado,
  onCancelar
}) => {
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [semCliente, setSemCliente] = useState(false);

  const handleClienteSelecionado = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setErro(null);
  };

  const handleProdutoSelecionado = (produto: ProdutoEstoque) => {
    // Usar EstoqueService para formatar produto
    const produtoFormatado = EstoqueService.formatarProdutoParaSistema(produto);

    // Verificar se o produto já está na lista
    const itemExistente = itens.find(item => item.id_produto_tiny === produtoFormatado.id_produto_tiny);

    if (itemExistente) {
      // Incrementar quantidade
      setItens(itens.map(item =>
        item.id_produto_tiny === produtoFormatado.id_produto_tiny
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      // Adicionar novo item
      const novoItem: ItemOrcamento = {
        id_produto_tiny: produtoFormatado.id_produto_tiny,
        nome_produto: produtoFormatado.nome_produto,
        quantidade: 1,
        preco_unitario: produtoFormatado.preco_unitario
      };
      setItens([...itens, novoItem]);
    }

    setErro(null);
  };

  const handleQuantidadeChange = (index: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      // Remover item
      setItens(itens.filter((_, i) => i !== index));
    } else {
      // Atualizar quantidade
      setItens(itens.map((item, i) =>
        i === index ? { ...item, quantidade: novaQuantidade } : item
      ));
    }
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + (item.preco_unitario * item.quantidade), 0);
  };

  const handleSalvarOrcamento = async () => {
    if (!clienteSelecionado && !semCliente) {
      setErro('Selecione um cliente ou marque "Sem cliente"');
      return;
    }

    if (itens.length === 0) {
      setErro('Adicione pelo menos um produto ao orçamento');
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      const payload = {
        cliente_id: clienteSelecionado?.id || 0,
        vendedor_id: vendedorId,
        valor_total: calcularTotal(),
        itens: itens
      };

      const resultado = await salvarOrcamento(payload);

      setSucesso('Orçamento criado com sucesso!');
      setItens([]);
      setClienteSelecionado(null);
      setSemCliente(false);

      if (onOrcamentoCriado) {
        onOrcamentoCriado(resultado);
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao criar orçamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Criar Novo Orçamento</h2>

      {/* Seleção de Cliente */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Cliente</h3>
        <div className="flex items-center space-x-4">
          <BuscaProduto
            onProdutoSelecionado={(cliente: any) => handleClienteSelecionado(cliente)}
            placeholder="Buscar cliente..."
            className="flex-1"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="semCliente"
              checked={semCliente}
              onChange={(e) => setSemCliente(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="semCliente" className="text-sm text-gray-600">
              Sem cliente
            </label>
          </div>
        </div>
        {clienteSelecionado && (
          <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              Cliente selecionado: <strong>{clienteSelecionado.nome}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Busca de Produtos */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Produtos</h3>
        <BuscaProduto
          onProdutoSelecionado={handleProdutoSelecionado}
          placeholder="Buscar produtos no estoque..."
        />
      </div>

      {/* Lista de Itens */}
      {itens.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Itens do Orçamento</h3>
          <div className="space-y-3">
            {itens.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.nome_produto}</p>
                  <p className="text-sm text-gray-600">
                    R$ {item.preco_unitario.toFixed(2)} x {item.quantidade} = R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => handleQuantidadeChange(index, parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                  <Button
                    onClick={() => handleQuantidadeChange(index, 0)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total */}
      {itens.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 rounded-md">
          <p className="text-lg font-bold text-green-800">
            Total: R$ {calcularTotal().toFixed(2)}
          </p>
        </div>
      )}

      {/* Mensagens de Erro/Sucesso */}
      {erro && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {sucesso}
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end space-x-3">
        {onCancelar && (
          <Button onClick={onCancelar} variant="outline">
            Cancelar
          </Button>
        )}
        <Button
          onClick={handleSalvarOrcamento}
          disabled={loading || itens.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Salvando...' : 'Salvar Orçamento'}
        </Button>
      </div>
    </div>
  );
}; 