import { Bell, Calendar, Crown, Rocket, Target } from 'lucide-react';

interface PainelHeaderProps {
    performanceScore: number;
    onOpenCalendario: () => void;
    onOpenNotificacoes: () => void;
}

/**
 * Componente do cabeçalho principal do painel do vendedor
 * Exibe boas-vindas, performance score e botões de ação
 */
export default function PainelHeader({
    performanceScore,
    onOpenCalendario,
    onOpenNotificacoes
}: PainelHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                        <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Bom dia, Vendedor!</h1>
                        <p className="text-blue-100">Pronto para vender mais hoje?</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-3xl font-bold mb-1">{performanceScore}%</div>
                        <div className="text-blue-100 text-sm">Performance</div>
                    </div>
                    <button
                        onClick={onOpenNotificacoes}
                        className="relative bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all duration-200 shadow-lg"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                            3
                        </span>
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                        <Rocket className="w-4 h-4" />
                        <span className="text-sm font-medium">Modo Produtivo</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">Meta: R$ 15.000</span>
                    </div>
                </div>
                <button
                    onClick={onOpenCalendario}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                    <Calendar className="w-4 h-4" />
                    Ver Compromissos
                </button>
            </div>
        </div>
    );
} 