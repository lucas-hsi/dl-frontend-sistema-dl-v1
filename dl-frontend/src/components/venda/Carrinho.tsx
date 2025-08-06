"use client";
import React, { useState } from "react";
import { useVenda } from "@/contexts/VendaContext";
import { useRouter } from "next/router";

const Carrinho = () => {
  const { carrinho, limparVenda } = useVenda();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  const removerItem = (index: number) => {
    setErro("Funcionalidade de remoção individual será implementada.");
  };

  const handleLimparCarrinho = () => {
    limparVenda();
  };

  const handleAvancar = () => {
    setLoading(true);
    setErro(null);
    try {
      // Redireciona para o fluxo de venda guiado (VendaWizard) já na etapa de cliente
      router.push("/ponto-de-venda?step=2");
    } catch (error) {
      setErro("Erro ao avançar para o próximo passo.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const total = carrinho.reduce(
    (acc, item) => acc + item.quantidade * item.preco_unitario,
    0
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🛒 Carrinho</h2>

      {erro && <div className="text-red-600 mb-2">{erro}</div>}

      {carrinho.length === 0 ? (
        <p className="text-gray-500">Nenhum item adicionado.</p>
      ) : (
        <>
          <table className="w-full mb-4">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-2">Produto</th>
                <th className="pb-2">Qtd</th>
                <th className="pb-2">Unitário</th>
                <th className="pb-2">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrinho.map((item, index) => (
                <tr key={index} className="border-t text-gray-800 text-sm">
                  <td className="py-2">{item.nome_produto}</td>
                  <td className="py-2">{item.quantidade}</td>
                  <td className="py-2">R$ {item.preco_unitario.toFixed(2)}</td>
                  <td className="py-2">
                    R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => removerItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={loading}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">
              Total: R$ {total.toFixed(2)}
            </span>
            <button
              onClick={handleLimparCarrinho}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
              disabled={loading}
            >
              Limpar Carrinho
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAvancar}
              className="bg-blue-600 text-white w-full md:w-auto px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-base font-semibold transition-all"
              disabled={loading || carrinho.length === 0}
            >
              {loading ? "Avançando..." : "Avançar para Cadastro de Cliente"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrinho;
