import {
    Crown,
    Sparkles,
    Star,
    Target,
    TrendingDown,
    TrendingUp,
    Trophy
} from 'lucide-react';
import React from 'react';

interface PerformanceCardProps {
    score: number;
    title: string;
    subtitle: string;
    trend?: number;
    icon?: React.ReactNode;
    color?: string;
}

export default function PerformanceCard({
    score,
    title,
    subtitle,
    trend = 0,
    icon,
    color = 'blue'
}: PerformanceCardProps) {
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'from-emerald-500 to-green-600';
        if (score >= 80) return 'from-blue-500 to-indigo-600';
        if (score >= 70) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-pink-600';
    };

    const getScoreIcon = (score: number) => {
        if (score >= 90) return <Crown className="w-6 h-6 text-white" />;
        if (score >= 80) return <Trophy className="w-6 h-6 text-white" />;
        if (score >= 70) return <Star className="w-6 h-6 text-white" />;
        return <Target className="w-6 h-6 text-white" />;
    };

    const getScoreText = (score: number) => {
        if (score >= 90) return 'Excelente';
        if (score >= 80) return 'Muito Bom';
        if (score >= 70) return 'Bom';
        return 'Precisa Melhorar';
    };

    const getTrendIcon = (trend: number) => {
        if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
        if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
        return null;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`bg-gradient-to-br ${getScoreColor(score)} p-3 rounded-xl`}>
                        {icon || getScoreIcon(score)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600">{subtitle}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{score}%</div>
                    <div className="text-sm text-gray-600">{getScoreText(score)}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progresso</span>
                    <span>{score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
            </div>

            {/* Trend */}
            {trend !== 0 && (
                <div className="flex items-center gap-2">
                    {getTrendIcon(trend)}
                    <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {trend > 0 ? '+' : ''}{trend}% vs semana passada
                    </span>
                </div>
            )}

            {/* Sparkles for high performance */}
            {score >= 85 && (
                <div className="absolute top-4 right-4">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                </div>
            )}
        </div>
    );
} 