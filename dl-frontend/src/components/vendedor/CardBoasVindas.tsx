import { Bell, Calendar, Crown, Rocket, Target, Trophy } from 'lucide-react';

interface CardBoasVindasProps {
    performanceScore: number;
    onOpenCalendario: () => void;
    onOpenNotificacoes: () => void;
}

export default function CardBoasVindas({ performanceScore, onOpenCalendario, onOpenNotificacoes }: CardBoasVindasProps) {
    const getPerformanceColor = (score: number) => {
        if (score >= 90) return 'from-emerald-500 to-green-600';
        if (score >= 80) return 'from-blue-500 to-indigo-600';
        if (score >= 70) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-pink-600';
    };

    const getPerformanceIcon = (score: number) => {
        if (score >= 90) return <Crown className="w-6 h-6" />;
        if (score >= 80) return <Trophy className="w-6 h-6" />;
        if (score >= 70) return <Target className="w-6 h-6" />;
        return <Target className="w-6 h-6" />;
    };

    const getPerformanceText = (score: number) => {
        if (score >= 90) return 'Excelente!';
        if (score >= 80) return 'Bom trabalho!';
        if (score >= 70) return 'Pode melhorar';
        return 'Precisa melhorar';
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    return (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{getGreeting()}, Vendedor! 👋</h2>
                        <p className="text-blue-100">Pronto para conquistar o dia?</p>
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

            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">IA Online</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Meta: 85%</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getPerformanceColor(performanceScore)}`}>
                        {getPerformanceIcon(performanceScore)}
                    </div>
                    <div>
                        <h3 className="font-semibold">{getPerformanceText(performanceScore)}</h3>
                        <p className="text-blue-100 text-sm">Seu desempenho está sendo analisado</p>
                    </div>
                </div>

                <button
                    onClick={onOpenCalendario}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg"
                >
                    <Calendar className="w-4 h-4" />
                    Compromissos
                </button>
            </div>
        </div>
    );
} 