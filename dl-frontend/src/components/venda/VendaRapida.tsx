// src/components/venda/VendaRapida.tsx

import React from "react";
import BuscaCliente from "./BuscaCliente";
import BuscaProduto from "./BuscaProduto";
import Carrinho from "./Carrinho";
import Pagamento from "./Pagamento";

export default function VendaRapida() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold text-blue-800">Venda Rápida</h1>
      
      {/* Busca de Cliente */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <BuscaCliente />
      </div>

      {/* Busca de Produto */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <BuscaProduto />
      </div>

      {/* Carrinho de Produtos */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <Carrinho />
      </div>

      {/* Ações: Orçamento ou Finalizar Venda */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <Pagamento />
      </div>
    </div>
  );
}
