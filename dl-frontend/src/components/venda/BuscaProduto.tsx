"use client";
import { useVenda } from "@/contexts/VendaContext";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { EstoqueService, ProdutoEstoque } from "../../services/estoqueService";

const BuscaProduto = () => {
  const [busca, setBusca] = useState("");
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [quantidade, setQuantidade] = useState<{ [id: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [produtoAdicionado, setProdutoAdicionado] = useState<ProdutoEstoque | null>(null);
  const { adicionarProduto } = useVenda();
  const router = useRouter();

  const handleBuscar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const termo = e.target.value;
    setBusca(termo);
    setErro(null);
    setSucesso(null);
    setProdutoAdicionado(null);
    if (termo.length < 3) {
      setProdutos([]);
      return;
    }
    setLoading(true);
    try {
      console.log("🔁 Buscando produtos no estoque:", termo);
      const produtosAPI = await EstoqueService.buscarProdutosPorTermo(termo);
      setProdutos(produtosAPI);
      // Inicializa quantidade para cada produto
      const quantidades: { [id: string]: number } = {};
      produtosAPI.forEach((p: ProdutoEstoque) => {
        quantidades[p.id.toString()] = 1;
      });
      setQuantidade(quantidades);
      console.log("Produtos encontrados no estoque:", produtosAPI);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao buscar produtos");
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionar = (produto: ProdutoEstoque) => {
    const quantidadeSelecionada = quantidade[produto.id.toString()] || 1;

    // Formatar produto para o formato esperado pelo contexto
    const produtoFormatado = EstoqueService.formatarProdutoParaSistema(produto);

    // Criar item para o carrinho
    const itemCarrinho = {
      id_produto_tiny: produtoFormatado.id_produto_tiny,
      nome_produto: produtoFormatado.nome_produto,
      quantidade: quantidadeSelecionada,
      preco_unitario: produtoFormatado.preco_unitario,
      sku: produtoFormatado.sku,
      imagem: produtoFormatado.imagem,
      permalink: produtoFormatado.permalink
    };

    adicionarProduto(itemCarrinho);
    setProdutoAdicionado(produto);
    setSucesso(`Produto "${produto.nome}" adicionado ao carrinho!`);

    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => {
      setSucesso(null);
      setProdutoAdicionado(null);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Produtos no Estoque
        </label>
        <input
          type="text"
          id="busca"
          value={busca}
          onChange={handleBuscar}
          placeholder="Digite o nome do produto (mínimo 3 caracteres)..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Buscando produtos...</span>
        </div>
      )}

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {sucesso}
        </div>
      )}

      {produtos.length > 0 && !loading && (
        <ul className="space-y-3">
          {produtos.map((produto) => (
            <li
              key={produto.id}
              className="border rounded-md p-4 flex justify-between items-center hover:bg-gray-50"
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
                <div>
                  <p className="font-medium text-gray-800">{produto.nome}</p>
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

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={1}
                  max={produto.quantidade || 99}
                  value={quantidade[produto.id.toString()] || 1}
                  onChange={(e) => setQuantidade((q) => ({ ...q, [produto.id.toString()]: Number(e.target.value) }))}
                  className="w-16 border border-gray-300 rounded-md px-2 py-1"
                  disabled={loading}
                />
                <button
                  onClick={() => handleAdicionar(produto)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  disabled={loading || produto.quantidade === 0}
                  data-qa="vendas-AdicionarItem"
                >
                  {produto.quantidade === 0 ? 'Sem Estoque' : 'Adicionar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {produtos.length === 0 && busca.length >= 3 && !loading && !erro && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum produto encontrado para "{busca}"</p>
          <p className="text-sm mt-2">Tente buscar por outro termo ou verifique o estoque</p>
        </div>
      )}
    </div>
  );
};

export default BuscaProduto;
