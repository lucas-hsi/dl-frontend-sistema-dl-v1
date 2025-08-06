"use client";

import React, { useEffect, useState } from 'react';
import { EstoqueService, ProdutoEstoque } from '../../services/estoqueService';

interface BuscaProdutoProps {
  onProdutoSelecionado: (produto: ProdutoEstoque) => void;
  placeholder?: string;
  className?: string;
}

export const BuscaProduto: React.FC<BuscaProdutoProps> = ({
  onProdutoSelecionado,
  placeholder = "Buscar produtos no estoque...",
  className = ""
}) => {
  const [termo, setTermo] = useState('');
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Buscar produtos quando o termo mudar
  useEffect(() => {
    const buscarProdutos = async () => {
      if (!termo.trim() || termo.length < 2) {
        setProdutos([]);
        setMostrarResultados(false);
        return;
      }

      setLoading(true);
      setErro(null);

      try {
        // Usar EstoqueService centralizado
        const resultado = await EstoqueService.buscarProdutosPorTermo(termo, 10);

        setProdutos(resultado);
        setMostrarResultados(true);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setErro(error instanceof Error ? error.message : 'Erro ao buscar produtos');
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar muitas requisições
    const timeoutId = setTimeout(buscarProdutos, 300);
    return () => clearTimeout(timeoutId);
  }, [termo]);

  const handleProdutoClick = (produto: ProdutoEstoque) => {
    onProdutoSelecionado(produto);
    setTermo('');
    setMostrarResultados(false);
    setProdutos([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermo(e.target.value);
  };

  const handleInputFocus = () => {
    if (produtos.length > 0) {
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
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {mostrarResultados && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {erro && (
            <div className="p-3 text-red-600 text-sm">
              {erro}
            </div>
          )}

          {produtos.length > 0 && (
            <div>
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  onClick={() => handleProdutoClick(produto)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {produto.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {produto.sku}
                      </div>
                      {produto.categoria && (
                        <div className="text-sm text-gray-500">
                          Categoria: {produto.categoria}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        R$ {produto.preco.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Estoque: {produto.quantidade} UN
                      </div>
                      {produto.origem && (
                        <div className="text-xs text-blue-500">
                          {produto.origem === 'mercado_livre' ? 'ML' : produto.origem}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {produtos.length === 0 && !erro && termo.length >= 2 && (
            <div className="p-3 text-gray-500 text-sm">
              Nenhum produto encontrado no estoque
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 