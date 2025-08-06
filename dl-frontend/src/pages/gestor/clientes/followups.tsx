import React from "react";
import LayoutGestor from "@/components/layout/LayoutGestor";

export default function ClientesFollowupsPage() {
  return (
    <LayoutGestor>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white/80 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center">
          <h1 className="text-2xl font-bold text-green-700 mb-4">Follow-ups / Contatos</h1>
          <p className="text-lg text-green-900 mb-6 text-center">
            Gestão de follow-ups e contatos.<br/>
            <span className="text-orange-600 font-semibold">🚧 Em desenvolvimento</span>
          </p>
          <span className="text-green-500 text-5xl mb-4">📞</span>
          <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mt-4">
            <p className="text-orange-800 text-sm">
              <strong>Backlog:</strong> Sistema de follow-ups, lembretes automáticos, 
              histórico de contatos e integração com WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </LayoutGestor>
  );
} 