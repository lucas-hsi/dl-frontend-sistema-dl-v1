// ARQUIVO: dl-frontend/src/components/layout/SidebarAnuncios.tsx
// VERSÃO REFATORADA E TOTALMENTE COMENTADA

// --- 1. IMPORTAÇÕES ---
// Importa as bibliotecas e componentes necessários.
import React, { useState, useEffect } from 'react'; // Hooks essenciais do React.
import Link from 'next/link'; // Componente do Next.js para navegação sem recarregar a página.
import { useRouter } from 'next/router'; // Hook do Next.js para acessar informações da rota atual.

// Importa todos os ícones da biblioteca 'lucide-react' de uma só vez.
// CORREÇÃO: Adicionados todos os ícones que estavam faltando (Database, Bot, Wand2, etc.).
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, LayoutDashboard,
  Megaphone, Package, LogOut, Bot, Wand2, FileText, Target,
  TrendingUp, ShoppingCart, Globe, Zap, Palette, ImageIcon,
  Scissors, Layout, Image as ImageIconDefault, Database
} from 'lucide-react';

// Importa o hook de autenticação do nosso AuthContext para acessar o usuário e a função de logout.
import { useAuth } from '@/contexts/AuthContext';

// --- 2. DEFINIÇÃO DA ESTRUTURA DE DADOS DO MENU ---
// Define a estrutura de dados para os itens do menu, garantindo consistência.
// Cada item tem um ID único, um rótulo, um ícone e, opcionalmente, um link direto (href) ou um submenu.
const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/anuncios",
  },
  {
    id: "estoque",
    label: "Gestão de Estoque",
    icon: Package,
    submenu: [
      { label: "Estoque Interno", href: "/anuncios/estoque/interno", icon: Database },
    ],
  },
  {
    id: "ia",
    label: "IA para Anúncios",
    icon: Bot,
    submenu: [
      { label: "Criar Anúncio com IA", href: "/anuncios/ia/criar-anuncio", icon: Wand2 },
      { label: "Melhorar Descrições", href: "/anuncios/ia/melhorar-descricoes", icon: FileText },
      { label: "Sugestões de Preço", href: "/anuncios/ia/sugestoes-preco", icon: Target },
      { label: "Análise Concorrência", href: "/anuncios/ia/analise-concorrencia", icon: TrendingUp },
    ],
  },
  {
    id: "canais",
    label: "Canais de Venda",
    icon: Megaphone,
    submenu: [
      { label: "Mercado Livre", href: "/anuncios/canais/mercado-livre", icon: ShoppingCart },
      { label: "Shopify", href: "/anuncios/canais/shopify", icon: Globe },
      { label: "Outros Marketplaces", href: "/anuncios/canais/outros", icon: Zap },
    ],
  },
  {
    id: "ferramentas",
    label: "Ferramentas Criativas",
    icon: Palette,
    submenu: [
      { label: "Editor de Imagens", href: "/anuncios/ferramentas/editor-imagens", icon: ImageIcon },
      { label: "Remover Fundo (IA)", href: "/anuncios/ferramentas/remover-fundo", icon: Scissors },
      { label: "Templates de Anúncio", href: "/anuncios/ferramentas/templates", icon: Layout },
      { label: "Banco de Imagens", href: "/anuncios/ferramentas/banco-imagens", icon: ImageIconDefault },
    ],
  },
];

// --- 3. DEFINIÇÃO DAS PROPRIEDADES DO COMPONENTE ---
// Define a interface para as props que o componente pode receber.
interface SidebarAnunciosProps {
  onExpandChange?: (expanded: boolean) => void; // Função opcional para notificar o componente pai sobre a mudança de estado (expandido/recolhido).
}

// --- 4. O COMPONENTE PRINCIPAL ---
export default function SidebarAnuncios({ onExpandChange }: SidebarAnunciosProps) {
  // --- 4.1. ESTADO (State Hooks) ---
  // Gerencia o estado interno do componente.
  const [expanded, setExpanded] = useState(true); // Controla se a sidebar está expandida (true) ou recolhida (false).
  const [openMenus, setOpenMenus] = useState<string[]>([]); // Armazena os IDs dos submenus que estão abertos.
  const [mounted, setMounted] = useState(false); // Controla se o componente já foi montado no navegador. Evita erros de hidratação do Next.js.

  // --- 4.2. HOOKS E CONTEXTO ---
  // Acessa dados e funções de outros lugares.
  const router = useRouter(); // Hook para obter informações da rota atual (ex: router.pathname).
  const { logout } = useAuth(); // Obtém a função de logout do nosso contexto de autenticação global.

  // --- 4.3. EFEITOS COLATERAIS (Effect Hooks) ---
  // Executa código em resposta a mudanças no ciclo de vida do componente.
  useEffect(() => {
    // Este efeito roda apenas uma vez, após o componente ser montado no navegador.
    setMounted(true);
  }, []); // O array de dependências vazio `[]` garante que ele rode apenas uma vez.

  // --- 4.4. FUNÇÕES DE MANIPULAÇÃO DE EVENTOS (Event Handlers) ---
  // Funções que respondem a interações do usuário.

  // Alterna o estado de expandido/recolhido da sidebar.
  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onExpandChange?.(newExpanded); // Notifica o componente pai, se a função foi passada.
    if (!newExpanded) {
      setOpenMenus([]); // Fecha todos os submenus ao recolher a sidebar.
    }
  };

  // Alterna a visibilidade de um submenu.
  const handleSubmenuToggle = (menuId: string) => {
    if (!expanded) return; // Não faz nada se a sidebar estiver recolhida.
    setOpenMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId) // Se o menu já está aberto, fecha-o.
        : [...prev, menuId] // Se está fechado, abre-o.
    );
  };

  // Executa o logout usando a função centralizada do AuthContext.
  const handleLogout = () => {
    logout(); // O AuthContext cuida de limpar o estado, o localStorage e redirecionar.
  };

  // --- 4.5. LÓGICA DE RENDERIZAÇÃO AUXILIAR ---
  // Funções que ajudam a determinar como a UI deve ser renderizada.

  // Verifica se um item de menu (ou um de seus sub-itens) está ativo com base na rota atual.
  const isMenuActive = (item: any): boolean => {
    if (!mounted) return false; // Previne erros de renderização no servidor.
    if (item.href) {
      return router.pathname === item.href;
    }
    if (item.submenu) {
      return item.submenu.some((sub: any) => router.pathname === sub.href);
    }
    return false;
  };

  // --- 4.6. RENDERIZAÇÃO CONDICIONAL ---
  // Evita renderizar o componente no servidor para prevenir inconsistências com o estado do cliente (hidratação).
  if (!mounted) {
    return null;
  }

  // --- 4.7. JSX (A ESTRUTURA DA UI) ---
  // O que o componente realmente renderiza na tela.
  return (
    <div className="fixed top-4 left-4 bottom-4 z-50">
      <aside
        className={`h-full bg-gradient-to-b from-[#1a232e] to-[#2d3748] flex flex-col transition-all duration-300 rounded-3xl ${expanded ? "w-72" : "w-20"}`}
        style={{
          boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 15px 35px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2)"
        }}
      >
        {/* TOPO: Logo + Botão de Colapsar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center">
            {expanded && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Megaphone className="w-5 h-5 text-[#1a232e]" />
                </div>
                <span className="text-lg font-semibold text-white tracking-tight">Anúncios</span>
              </div>
            )}
          </div>
          <button
            className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-200 text-white hover:text-yellow-400 ${expanded ? "ml-2" : "mx-auto"}`}
            onClick={handleToggle}
            aria-label={expanded ? "Recolher menu" : "Expandir menu"}
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* ITENS DO MENU */}
        <nav className="flex-1 mt-4 px-3 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = isMenuActive(item);
              const isOpen = openMenus.includes(item.id);
              const IconComponent = item.icon;

              return (
                <li key={item.id}>
                  {/* Item principal (renderiza como Link se tiver href, senão como div clicável) */}
                  {item.href ? (
                    <Link href={item.href}>
                      <div className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative cursor-pointer ${expanded ? "justify-start" : "justify-center"} ${isActive ? "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 shadow-lg" : "text-white hover:bg-white/10 hover:text-yellow-400"}`}>
                        <IconComponent size={20} className="transition-transform group-hover:scale-110 flex-shrink-0" />
                        {expanded && <span className="font-medium text-sm truncate flex-1">{item.label}</span>}
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative cursor-pointer ${expanded ? "justify-start" : "justify-center"} ${isActive ? "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 shadow-lg" : "text-white hover:bg-white/10 hover:text-yellow-400"}`}
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

                  {/* Submenu (renderiza apenas se existir, se a sidebar estiver expandida e se o menu estiver aberto) */}
                  {item.submenu && expanded && isOpen && (
                    <ul className="mt-2 ml-4 space-y-1 border-l border-white/10 pl-4">
                      {item.submenu.map((subItem) => {
                        const isSubActive = mounted ? router.pathname === subItem.href : false;
                        const SubIcon = subItem.icon;

                        return (
                          <li key={subItem.href}>
                            <Link href={subItem.href}>
                              <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group cursor-pointer ${isSubActive ? "bg-gradient-to-r from-yellow-400/15 to-orange-500/15 text-yellow-200" : "text-gray-300 hover:bg-white/5 hover:text-yellow-300"}`}>
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

        {/* CARD DA EQUIPE E BOTÃO DE LOGOUT */}
        {expanded && (
          <div className="mx-3 mb-4">
            <div className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Equipe Anúncios</h4>
                  <p className="text-gray-300 text-xs">Marketing & IA</p>
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
