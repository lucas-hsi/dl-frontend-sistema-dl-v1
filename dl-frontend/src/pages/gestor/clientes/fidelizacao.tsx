import React from "react";
import LayoutGestor from "@/components/layout/LayoutGestor";

export default function ClientesFidelizacaoPage() {
  return (
    <LayoutGestor>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white/80 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center">
          <h1 className="text-2xl font-bold text-yellow-700 mb-4">Fidelização / Histórico</h1>
          <p className="text-lg text-yellow-900 mb-6 text-center">
            Histórico de compras e fidelização.<br/>
            <span className="text-orange-600 font-semibold">🚧 Em desenvolvimento</span>
          </p>
          <span className="text-yellow-500 text-5xl mb-4">⭐</span>
          <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mt-4">
            <p className="text-orange-800 text-sm">
              <strong>Backlog:</strong> Sistema de pontos, histórico de compras, 
              campanhas de fidelização e análise de comportamento do cliente.
            </p>
          </div>
        </div>
      </div>
    </LayoutGestor>
  );
} 