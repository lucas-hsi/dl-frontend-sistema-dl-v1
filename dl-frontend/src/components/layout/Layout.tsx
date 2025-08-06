import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';

interface SidebarContextType {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  setExpanded: () => {},
});

export { SidebarContext };

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Usa a função logout do AuthContext que limpa corretamente o estado
    logout({ redirect: true });
  };

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Barra Superior Moderna */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo e Nome do Sistema */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DL</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DL Auto Peças CRM</h1>
                  <p className="text-sm text-gray-500">Sistema de Gestão Comercial</p>
                </div>
              </div>
            </div>

            {/* Área do Usuário */}
            <div className="flex items-center space-x-4">
              {/* Notificações */}
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Avatar do Usuário */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">👤</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Vendedor</p>
                  <p className="text-xs text-gray-500">vendedor@dlautopecas.com</p>
                </div>
              </div>

              {/* Botão Sair - CORRIGIDO: Reposicionado e visível */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                title="Sair do sistema"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <div className="flex flex-1">
          <Sidebar />
          <main className={`flex-1 transition-all duration-300 ${expanded ? 'ml-64' : 'ml-20'}`}>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="px-6 text-center">
            <p className="text-sm text-gray-500">
              © 2024 DL Auto Peças - Desenvolvido por Lucas Rocha
            </p>
          </div>
        </footer>
      </div>
    </SidebarContext.Provider>
  );
}
