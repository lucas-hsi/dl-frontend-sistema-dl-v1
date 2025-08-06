import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  LogOut,
  Home,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const menu = [
  { label: "Dashboard", icon: Home, href: "/vendedor" },
  { label: "Vendas Rápidas", icon: ShoppingCart, href: "/vendedor/venda-rapida", special: true },
  { label: "Atendimento", icon: Settings, href: "/vendedor/atendimento" },
  { label: "Orçamentos", icon: BarChart3, href: "/vendedor/orcamentos" },
  { label: "Estoque", icon: Home, href: "/vendedor/estoque" },
  { label: "Histórico de Vendas", icon: BarChart3, href: "/vendedor/historico" },
  { label: "Clientes", icon: Users, href: "/vendedor/clientes" },
];

interface SidebarVendedorProps {
  onExpandChange?: (expanded: boolean) => void;
}

export default function SidebarVendedor({ onExpandChange }: SidebarVendedorProps) {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onExpandChange?.(newExpanded);
  };

  const handleLogout = () => {
    // Usa a função logout do AuthContext que limpa corretamente o estado
    logout({ redirect: true });
  };

  return (
    <div className="fixed top-4 left-4 bottom-4 z-50">
      <aside
        className={`h-full bg-gradient-to-b from-[#1a232e] to-[#2d3748] flex flex-col transition-all duration-300 rounded-3xl ${expanded ? "w-64" : "w-20"}`}
        style={{
          boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 15px 35px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2)"
        }}
      >
        {/* TOPO: Logo + Botão de Colapsar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center">
            {expanded && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-[#1a232e] font-bold text-sm">DL</span>
                </div>
                <span className="text-lg font-semibold text-white tracking-tight">Vendedor</span>
              </div>
            )}
          </div>
          <button
            className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-200 text-white hover:text-green-400 ${expanded ? "ml-2" : "mx-auto"}`}
            onClick={handleToggle}
            aria-label={expanded ? "Recolher menu" : "Expandir menu"}
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* ITENS DO MENU */}
        <nav className="flex-1 mt-4 px-3">
          <ul className="space-y-2">
            {menu.map((item) => {
              const isActive = router.pathname === item.href;
              const IconComponent = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative ${expanded ? "justify-start" : "justify-center"} ${item.special
                      ? isActive
                        ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 shadow-lg backdrop-blur-sm border border-red-400/30"
                        : "text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 hover:text-red-300 hover:border hover:border-red-400/20"
                      : isActive
                        ? "bg-gradient-to-r from-green-400/20 to-blue-500/20 text-green-300 shadow-lg backdrop-blur-sm"
                        : "text-white hover:bg-white/10 hover:text-green-400"
                      }`}
                  >
                    <IconComponent size={20} className="transition-transform group-hover:scale-110" />
                    {expanded && (
                      <span className="font-medium text-base truncate flex-1">
                        {item.label}
                        {item.special && <Zap size={14} className="ml-2 inline text-orange-400" />}
                      </span>
                    )}
                    {isActive && (
                      <div className={`absolute right-2 w-2 h-2 rounded-full animate-pulse ${item.special ? "bg-red-400" : "bg-green-400"
                        }`} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CARD DO VENDEDOR */}
        {expanded && (
          <div className="mx-3 mb-4">
            <div className="bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm truncate">João Vendedor</h4>
                  <p className="text-gray-300 text-xs truncate">Equipe de Vendas</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 py-2 px-3 rounded-xl transition-all duration-200 text-sm font-medium border border-red-500/20 hover:border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                Sair da Plataforma
              </button>
            </div>
          </div>
        )}

        {/* RODAPÉ */}
        {expanded && (
          <div className="p-4 border-t border-white/10 text-xs text-white/60 text-center">
            <div className="bg-gradient-to-r from-green-400/10 to-blue-500/10 rounded-xl p-2">
              Sistema desenvolvido por Lucas Rocha
            </div>
          </div>
        )}
      </aside>
    </div>
  );
} 