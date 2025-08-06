"use client";
import React, { useState } from "react";

const BuscaCliente = () => {
  const [busca, setBusca] = useState("");
  const [clientesEncontrados, setClientesEncontrados] = useState<string[]>([
    "Lucas Rocha",
    "Carlos Mecânico",
    "João Peças",
  ]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleBuscarCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value);
    // Aqui depois pluga a busca real no banco
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">👤 Buscar Cliente</h2>

      <input
        type="text"
        placeholder="Digite o nome ou telefone"
        value={busca}
        onChange={handleBuscarCliente}
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {busca && (
        <ul className="mb-4">
          {clientesEncontrados
            .filter((c) => c.toLowerCase().includes(busca.toLowerCase()))
            .map((cliente, index) => (
              <li
                key={index}
                className="px-4 py-2 border-b hover:bg-gray-100 cursor-pointer"
              >
                {cliente}
              </li>
            ))}
        </ul>
      )}

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        + Cadastrar Novo Cliente
      </button>

      {mostrarFormulario && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Novo Cliente</h3>
          <input
            type="text"
            placeholder="Nome"
            className="w-full mb-2 border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="text"
            placeholder="Telefone"
            className="w-full mb-2 border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-2 border border-gray-300 rounded-md px-4 py-2"
          />
          <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Salvar Cliente
          </button>
        </div>
      )}
    </div>
  );
};

export default BuscaCliente;
