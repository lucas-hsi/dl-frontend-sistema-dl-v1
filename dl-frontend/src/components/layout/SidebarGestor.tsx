// ARQUIVO: dl-frontend/src/components/layout/SidebarGestor.tsx
// VERSÃO REFATORADA E TOTALMENTE COMENTADA

// --- 1. IMPORTAÇÕES ---
// Importa as bibliotecas e componentes necessários.
import React, { useState, useEffect } from 'react'; // Hooks essenciais do React.
import Link from 'next/link'; // Componente do Next.js para navegação sem recarregar a página.
import { useRouter } from 'next/router'; // Hook do Next.js para acessar informações da rota atual.

// Importa todos os ícones da biblioteca 'lucide-react'.
// CORREÇÃO: Adicionados todos os ícones que estavam faltando (Brain, Building2, DollarSign, etc.).
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, LayoutDashboard,
  Users, ShoppingCart, BarChart3, Settings, FileText, Calendar,
  Bell, LogOut, Shield, TrendingUp, Package, CreditCard, Truck,
  MessageSquare, ClipboardList, UserCheck, PieChart, Activity, Zap,
  Brain, Building2, Receipt, DollarSign, RefreshCw, Megaphone
} from 'lucide-react';

// Importa o hook de autenticação do nosso AuthContext para acessar a função de logout.
import { useAuth } from '@/contexts/AuthContext';

// --- 2. DEFINIÇÃO DA ESTRUTURA DE DADOS DO MENU ---
// Define a estrutura de dados para os itens do menu, garantindo consistência.
const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Brain, href: "/gestor/dashboard" },
  { id: "calendario-inteligente", label: "Calendário Inteligente", icon: Calendar, href: "/gestor/calendario-inteligente" },
  {
    id: "gestao",
    label: "Gestão Inteligente",
    icon: Brain,
    submenu: [
      { label: "IA Dashboard", href: "/gestor/gestao/ia", icon: Brain },
      { label: "Análise de Vendas", href: "/gestor/gestao/analise", icon: TrendingUp },
      { label: "Previsões", href: "/gestor/gestao/previsoes", icon: BarChart3 },
      { label: "Monitoramento", href: "/gestor/gestao/monitoramento", icon: Activity },
    ],
  },
  {
    id: "empresa",
    label: "Gestão da Empresa",
    icon: Building2,
    submenu: [
      { label: "Entrada de Sucata", href: "/gestor/empresa/entrada-sucata", icon: Truck },
      { label: "Retorno por Sucata", href: "/gestor/empresa/retorno-sucata", icon: Receipt },
      { label: "Contabilidade da Empresa", href: "/gestor/empresa/contabilidade-da-empresa", icon: FileText },
    ],
  },
  {
    id: "produtos",
    label: "Produtos & Estoque",
    icon: Package,
    submenu: [
      { label: "Estoque Unificado", href: "/gestor/produtos/estoque", icon: Package },
      { label: "Produtos Inativos", href: "/gestor/produtos/produtos-inativos", icon: Package },
      { label: "Catálogo", href: "/gestor/produtos/catalogo", icon: Package },
      { label: "Fornecedores", href: "/gestor/produtos/fornecedores", icon: Users },
    ],
  },
  { id: "gestao-vendas", label: "Gestão de Vendas", icon: TrendingUp, href: "/gestor/gestao/vendas" },
  {
    id: "relatorios",
    label: "Relatórios & Analytics",
    icon: BarChart3,
    href: "/gestor/relatorios-analytics",
  },
  {
    id: "equipe",
    label: "Equipe & Anúncios",
    icon: Users,
    submenu: [
      { label: "Vendedores", href: "/gestor/equipe/vendedores", icon: UserCheck },
      { label: "Anúncios", href: "/gestor/equipe/anuncios", icon: Megaphone },
      { label: "Performance", href: "/gestor/equipe/performance", icon: TrendingUp },
    ],
  },
  { id: "clientes", label: "Clientes", icon: Users, href: "/gestor/clientes" },
  {
    id: "atendimento",
    label: "Atendimento",
    icon: MessageSquare,
    href: "/gestor/atendimento",
  },
  { id: "configuracoes", label: "Configurações", icon: Settings, href: "/gestor/configuracoes" },
];

// --- 3. DEFINIÇÃO DAS PROPRIEDADES DO COMPONENTE ---
interface SidebarGestorProps {
  onExpandChange?: (expanded: boolean) => void;
}

// --- 4. O COMPONENTE PRINCIPAL ---
export default function SidebarGestor({ onExpandChange }: SidebarGestorProps) {
  // --- 4.1. ESTADO (State Hooks) ---
  const [expanded, setExpanded] = useState(true);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // --- 4.2. HOOKS E CONTEXTO ---
  const router = useRouter();
  const { logout } = useAuth();

  // --- 4.3. EFEITOS COLATERAIS (Effect Hooks) ---
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- 4.4. ORDENAÇÃO DO MENU (T1) ---
  // Regras:
  // - Ordenar alfabeticamente (case-insensitive) todos os itens de menu
  // - Manter "Dashboard" sempre primeiro
  // - Manter "Configurações" sempre último
  // - Preservar grupos/ícones atuais; apenas reordenar a lista
  // IMPORTANTE: hooks não podem ser condicionais; definimos antes de qualquer return condicional
  const sortedMenuItems = React.useMemo(() => {
    const localeCompareOptions: Intl.CollatorOptions = { sensitivity: 'base' };

    // Clonar e ordenar submenus de cada item (se houver)
    const withSortedSubmenus = menuItems.map((item) => {
      if (item.submenu && Array.isArray(item.submenu)) {
        const sortedSubmenu = [...item.submenu].sort((a, b) =>
          a.label.localeCompare(b.label, 'pt-BR', localeCompareOptions)
        );
        return { ...item, submenu: sortedSubmenu };
      }
      return item;
    });

    // Extrair especiais e ordenar o restante
    const dashboardItem = withSortedSubmenus.find((i) => i.id === 'dashboard');
    const configItem = withSortedSubmenus.find((i) => i.id === 'configuracoes');
    const middleItems = withSortedSubmenus.filter(
      (i) => i.id !== 'dashboard' && i.id !== 'configuracoes'
    );

    middleItems.sort((a, b) => a.label.localeCompare(b.label, 'pt-BR', localeCompareOptions));

    const result = [
      ...(dashboardItem ? [dashboardItem] : []),
      ...middleItems,
      ...(configItem ? [configItem] : []),
    ];

    return result;
  }, []);

  // --- 4.4. FUNÇÕES DE MANIPULAÇÃO DE EVENTOS (Event Handlers) ---

  // Alterna o estado de expandido/recolhido da sidebar.
  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onExpandChange?.(newExpanded);
    if (!newExpanded) {
      setOpenMenus([]);
    }
  };

  // Alterna a visibilidade de um submenu.
  const handleSubmenuToggle = (menuId: string) => {
    if (!expanded) return;
    setOpenMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Executa o logout usando a função centralizada do AuthContext.
  const handleLogout = () => {
    logout(); // O AuthContext cuida de tudo.
  };

  // --- 4.5. LÓGICA DE RENDERIZAÇÃO AUXILIAR ---
  // Verifica se um item de menu (ou seus sub-itens) está ativo.
  const isMenuActive = (item: any): boolean => {
    if (!mounted) return false;
    if (item.href) return router.pathname === item.href;
    if (item.submenu) return item.submenu.some((sub: any) => router.pathname === sub.href);
    return false;
  };

  // --- 4.6. RENDERIZAÇÃO CONDICIONAL ---
  if (!mounted) {
    return null;
  }

  // --- 4.8. JSX (A ESTRUTURA DA UI) ---
  return (
    <div className="fixed top-4 left-4 bottom-4 z-50">
      <aside
        className={`h-full bg-gradient-to-b from-[#1a232e] to-[#2d3748] flex flex-col transition-all duration-300 rounded-3xl ${expanded ? "w-72" : "w-20"}`}
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 15px 35px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2)" }}
      >
        {/* TOPO: Logo + Botão de Colapsar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center">
            {expanded && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-[#1a232e] font-bold text-sm">DL</span>
                </div>
                <span className="text-lg font-semibold text-white tracking-tight">Gestor</span>
              </div>
            )}
          </div>
          <button
            className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-200 text-white hover:text-blue-400 ${expanded ? "ml-2" : "mx-auto"}`}
            onClick={handleToggle}
            aria-label={expanded ? "Recolher menu" : "Expandir menu"}
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* ITENS DO MENU */}
        <nav className="flex-1 mt-4 px-3 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {sortedMenuItems.map((item) => {
              const isActive = isMenuActive(item);
              const isOpen = openMenus.includes(item.id);
              const IconComponent = item.icon;

              return (
                <li key={item.id}>
                  {/* Item principal */}
                  {item.href ? (
                    <Link href={item.href}>
                      <div className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative cursor-pointer ${expanded ? "justify-start" : "justify-center"} ${isActive ? "bg-gradient-to-r from-blue-400/20 to-purple-500/20 text-blue-300 shadow-lg" : "text-white hover:bg-white/10 hover:text-blue-400"}`}>
                        <IconComponent size={20} className="transition-transform group-hover:scale-110 flex-shrink-0" />
                        {expanded && <span className="font-medium text-sm truncate flex-1">{item.label}</span>}
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative cursor-pointer ${expanded ? "justify-start" : "justify-center"} ${isActive ? "bg-gradient-to-r from-blue-400/20 to-purple-500/20 text-blue-300 shadow-lg" : "text-white hover:bg-white/10 hover:text-blue-400"}`}
                      onClick={() => handleSubmenuToggle(item.id)}
                    >
                      <IconComponent size={20} className="transition-transform group-hover:scale-110 flex-shrink-0" />
                      {expanded && (
                        <>
                          <span className="font-medium text-sm truncate flex-1">{item.label}</span>
                          {item.submenu && (
                            <div className="transition-transform duration-200">
                              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Submenu */}
                  {item.submenu && expanded && isOpen && (
                    <ul className="mt-2 ml-4 space-y-1 border-l border-white/10 pl-4">
                      {item.submenu.map((subItem) => {
                        const isSubActive = mounted ? router.pathname === subItem.href : false;
                        const SubIcon = subItem.icon;

                        return (
                          <li key={subItem.href}>
                            <Link href={subItem.href}>
                              <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group cursor-pointer ${isSubActive ? "bg-gradient-to-r from-blue-400/15 to-purple-500/15 text-blue-200" : "text-gray-300 hover:bg-white/5 hover:text-blue-300"}`}>
                                <SubIcon size={16} className="transition-transform group-hover:scale-110 flex-shrink-0" />
                                <span className="font-medium text-xs truncate">{subItem.label}</span>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CARD DO GESTOR E BOTÃO DE LOGOUT */}
        {expanded && (
          <div className="mx-3 mb-4">
            <div className="bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Lucas Gestor</h4>
                  <p className="text-gray-300 text-xs">Administrador</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 py-2 px-3 rounded-xl transition-all duration-200 text-sm font-medium"
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
            <p>Sistema desenvolvido por Lucas Rocha</p>
          </div>
        )}
      </aside>

      {/* CSS customizado para a barra de rolagem */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
      `}</style>
    </div>
  );
}
