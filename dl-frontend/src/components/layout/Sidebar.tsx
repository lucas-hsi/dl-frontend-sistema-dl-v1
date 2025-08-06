import clsx from "clsx";
import {
  AlertTriangle,
  BarChart2,
  Brain,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  DollarSign,
  FileBadge2,
  FileStack,
  FileText,
  FolderOpenDot,
  Key,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageCircle,
  Plus,
  Settings,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { SidebarContext } from "./Layout";

const groupedMenu = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/gestor",
  },
  {
    label: "Gestão",
    icon: BarChart2,
    submenu: [
      { label: "IA Estratégica", icon: Brain, href: "/gestor/gestao/ia" },
      { label: "Campanhas", icon: Megaphone, href: "/gestor/gestao/campanhas" },
      { label: "Relatórios e Métricas", icon: FileText, href: "/gestor/gestao/relatorios" },
      { label: "Vendas", icon: TrendingUp, href: "/gestor/gestao/vendas" },
    ],
  },
  {
    label: "Produtos",
    icon: FileStack,
    submenu: [
      { label: "Catálogo", icon: FolderOpenDot, href: "/gestor/produtos/catalogo" },
      { label: "Estoque", icon: FileBadge2, href: "/gestor/produtos/estoque" },
      { label: "Anúncios", icon: Megaphone, href: "/gestor/produtos/anuncios" },
      { label: "Criador Inteligente", icon: Brain, href: "/gestor/produtos/criador-inteligente" },
      { label: "Sucatas", icon: Layers, href: "/gestor/produtos/sucatas" },
    ],
  },
  {
    label: "Clientes",
    icon: Users,
    submenu: [
      { label: "Lista de Clientes", icon: Users, href: "/gestor/clientes/lista" },
      { label: "Follow-ups e Oportunidades", icon: Plus, href: "/gestor/clientes/followups" },
      { label: "Devoluções / Vale-peça", icon: AlertTriangle, href: "/gestor/clientes/devolucoes" },
      { label: "Fidelização / Histórico", icon: FileText, href: "/gestor/clientes/fidelizacao" },
    ],
  },
  {
    label: "Calendário e Tarefas",
    icon: Calendar,
    href: "/gestor/calendario",
  },
  {
    label: "Atendimento / Leads",
    icon: MessageCircle,
    href: "/gestor/atendimento",
  },
  {
    label: "Configurações",
    icon: Settings,
    submenu: [
      { label: "APIs e Integrações", icon: Key, href: "/gestor/configuracoes" },
      { label: "Regras de Precificação", icon: DollarSign, href: "/gestor/configuracoes/precificacao" },
      { label: "Templates Padrão", icon: FileText, href: "/gestor/configuracoes/templates" },
      { label: "Configurações de IA", icon: Brain, href: "/gestor/configuracoes/ia" },
    ],
  },
];

export default function Sidebar() {
  const { expanded, setExpanded } = useContext(SidebarContext);
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside
      className={clsx(
        "h-screen bg-[#181e2a] border-r border-black/10 flex flex-col transition-all duration-300 fixed z-30 shadow-2xl",
        expanded ? "w-64" : "w-20"
      )}
    >
      {/* TOPO: Logo + Botão de Colapsar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center">
          {expanded && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#A3E635] to-[#7C3AED] rounded-lg flex items-center justify-center">
                <span className="text-[#181e2a] font-bold text-sm">DL</span>
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">Auto Peças</span>
            </div>
          )}
        </div>
        <button
          className={clsx(
            "p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-white hover:text-[#A3E635]",
            expanded ? "ml-2" : "mx-auto"
          )}
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Recolher menu" : "Expandir menu"}
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* ITENS DO MENU AGRUPADOS */}
      <nav className="flex-1 mt-4 px-3">
        <ul className="space-y-2">
          {groupedMenu.map((item) => {
            const isActive = router.pathname.startsWith(item.href || "");
            const IconComponent = item.icon;
            const hasSubmenu = !!item.submenu;
            return (
              <li key={item.label}>
                {hasSubmenu ? (
                  <>
                    <button
                      className={clsx(
                        "flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-200 group relative",
                        expanded ? "justify-start" : "justify-center",
                        isActive
                          ? "bg-[#A3E635]/10 text-[#A3E635] shadow"
                          : "text-white hover:bg-white/5 hover:text-[#A3E635]"
                      )}
                      onClick={() => handleToggle(item.label)}
                    >
                      <IconComponent size={20} className="" />
                      {expanded && (
                        <span className="font-medium text-base truncate flex-1">{item.label}</span>
                      )}
                      {expanded && (
                        openMenus[item.label] ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )
                      )}
                    </button>
                    {/* Submenu */}
                    {expanded && openMenus[item.label] && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.submenu!.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = router.pathname === sub.href;
                          return (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                className={clsx(
                                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                                  isSubActive
                                    ? "bg-[#A3E635]/20 text-[#A3E635] font-semibold"
                                    : "text-white/80 hover:bg-white/10 hover:text-[#A3E635]"
                                )}
                              >
                                <SubIcon size={16} />
                                <span className="text-sm">{sub.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                      expanded ? "justify-start" : "justify-center",
                      isActive
                        ? "bg-[#A3E635]/10 text-[#A3E635] shadow"
                        : "text-white hover:bg-white/5 hover:text-[#A3E635]"
                    )}
                  >
                    <IconComponent size={20} />
                    {expanded && <span className="font-medium text-base truncate flex-1">{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* RODAPÉ: Configurações e Logout */}
      {expanded && (
        <div className="p-4 border-t border-white/10">
          <div className="space-y-2">
            <Link href="/gestor/configuracoes" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors">
              <Settings size={18} />
              <span className="text-sm font-medium">Configurações</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={18} />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
