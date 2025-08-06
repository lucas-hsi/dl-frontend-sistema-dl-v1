import { Lightbulb } from 'lucide-react';

interface Dica {
    id: number;
    texto: string;
    tipo: 'success' | 'info' | 'warning' | 'tip';
}

interface DicasDoDiaProps {
    dicas: Dica[];
}

/**
 * Componente de dicas do dia para o vendedor
 * Exibe sugestões e dicas da IA organizadas por tipo
 */
export default function DicasDoDia({ dicas }: DicasDoDiaProps) {
    const getDicaColor = (tipo: string) => {
        switch (tipo) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            case 'warning':
                return 'bg-orange-50 border-orange-200';
            case 'tip':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getDicaIconColor = (tipo: string) => {
        switch (tipo) {
            case 'success':
                return 'text-green-600';
            case 'info':
                return 'text-blue-600';
            case 'warning':
                return 'text-orange-600';
            case 'tip':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl">
                    <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Dicas do Dia</h3>
                    <p className="text-gray-600">Sugestões da IA</p>
                </div>
            </div>

            <div className="space-y-3">
                {dicas.length > 0 ? (
                    dicas.map((dica) => (
                        <div key={dica.id} className={`p-3 rounded-lg border ${getDicaColor(dica.tipo)}`}>
                            <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full ${getDicaIconColor(dica.tipo)} mt-2 flex-shrink-0`}></div>
                                <p className="text-sm text-gray-700">{dica.texto}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            Nenhuma dica disponível
                        </h4>
                        <p className="text-gray-600">
                            Continue vendendo para receber dicas personalizadas!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 