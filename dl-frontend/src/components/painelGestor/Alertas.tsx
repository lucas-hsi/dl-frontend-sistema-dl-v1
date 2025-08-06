import React, { useEffect, useState } from "react";
import { getAlertas } from "../../services/alertasService";

function CategoriaAlertas({ titulo, alertas }: { titulo: string; alertas: string[] }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{titulo}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alertas.map((a, i) => (
          <div
            key={i}
            className="flex items-start bg-white shadow-md rounded-2xl p-4 hover:scale-105 transition-transform border-l-4 border-blue-400"
          >
            <span className="text-3xl mr-4">{titulo[0]}</span>
            <div className="flex-1">
              <div className="font-bold text-lg">{a}</div>
              <div className="text-gray-600 mb-2">Alerta automático do sistema</div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                Resolver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AlertasGestor() {
  const [alertas, setAlertas] = useState<any>(null);
  useEffect(() => {
    getAlertas().then(setAlertas);
  }, []);

  if (!alertas) {
    return <div className="text-gray-500">Carregando alertas...</div>;
  }

  return (
    <div className="space-y-8">
      {Object.entries(alertas).map(([categoria, lista]) => (
        <CategoriaAlertas
          key={categoria}
          titulo={
            categoria === "emergencia"
              ? "🚨 Emergência"
              : categoria === "verificar"
              ? "⚠️ Verificar"
              : "📈 Tendências"
          }
          alertas={lista as string[]}
        />
      ))}
    </div>
  );
} 