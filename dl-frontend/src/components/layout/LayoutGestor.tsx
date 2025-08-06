import React, { useState } from "react";
import SidebarGestor from "./SidebarGestor";

export default function LayoutGestor({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <SidebarGestor onExpandChange={setSidebarExpanded} />
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarExpanded ? "ml-80" : "ml-28"}`}
      >
        {/* Header */}
        <header className="w-full flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-white/20 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Painel do Gestor</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700 font-medium">Administrador</span>
            </div>
            <img 
              // EXCEÇÃO CONTROLADA: serviço externo para geração de avatares
              src="https://ui-avatars.com/api/?name=Gestor&background=3b82f6&color=fff" 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-3 border-blue-400 shadow-lg hover:scale-105 transition-transform cursor-pointer" 
            />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {children}
        </main>
      </div>
    </div>
  );
} 