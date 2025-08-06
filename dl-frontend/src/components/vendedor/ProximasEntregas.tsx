import { Truck } from 'lucide-react';
import { useRouter } from 'next/router';

interface Entrega {
    id: number;
    cliente: string;
    produto: string;
    data: string;
    status: 'em_transito' | 'preparando' | 'entregue' | 'atrasado';
}

interface ProximasEntregasProps {
    entregas: Entrega[];
}

/**
 * Componente de próximas entregas do vendedor
 * Exibe lista de entregas pendentes com status
 */
export default function ProximasEntregas({ entregas }: ProximasEntregasProps) {
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'em_transito':
                return 'bg-green-100 text-green-800';
            case 'preparando':
                return 'bg-yellow-100 text-yellow-800';
            case 'entregue':
                return 'bg-blue-100 text-blue-800';
            case 'atrasado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'em_transito':
                return 'Em Trânsito';
            case 'preparando':
                return 'Preparando';
            case 'entregue':
                return 'Entregue';
            case 'atrasado':
                return 'Atrasado';
            default:
                return 'Pendente';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                        <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Próximas Entregas</h3>
                        <p className="text-gray-600">Acompanhe suas entregas</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/vendedor/historico')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Ver Todas
                </button>
            </div>

            <div className="space-y-4">
                {entregas.length > 0 ? (
                    entregas.map((entrega) => (
                        <div key={entrega.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Truck className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{entrega.cliente}</h4>
                                    <p className="text-sm text-gray-600">{entrega.produto}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{entrega.data}</p>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(entrega.status)}`}>
                                    {getStatusText(entrega.status)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            Nenhuma entrega pendente
                        </h4>
                        <p className="text-gray-600">
                            Todas as entregas foram realizadas!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 