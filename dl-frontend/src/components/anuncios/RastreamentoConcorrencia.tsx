import { X } from 'lucide-react';

interface RastreamentoConcorrenciaProps {
    rastreio: any;
    isOpen: boolean;
    onClose: () => void;
}

export function RastreamentoConcorrencia({ rastreio, isOpen, onClose }: RastreamentoConcorrenciaProps) {
    if (!isOpen || !rastreio) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        📊 Análise da Concorrência
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Fonte da Análise */}
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-blue-900 mb-2">🔍 Fonte da Análise</h3>
                        <p className="text-blue-800">{rastreio.fonte_analise}</p>
                    </div>

                    {/* Verificar se há concorrência real */}
                    {rastreio.concorrentes_analisados > 0 ? (
                        <>
                            {/* Estatísticas */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-50 p-4 rounded-xl">
                                    <h3 className="font-semibold text-green-900 mb-1">�� Concorrentes</h3>
                                    <p className="text-2xl font-bold text-green-800">
                                        {rastreio.concorrentes_analisados}
                                    </p>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-xl">
                                    <h3 className="font-semibold text-purple-900 mb-1">👥 Vendedores</h3>
                                    <p className="text-2xl font-bold text-purple-800">
                                        {rastreio.vendedores_premium}
                                    </p>
                                </div>

                                <div className="bg-orange-50 p-4 rounded-xl">
                                    <h3 className="font-semibold text-orange-900 mb-1">💰 Preços</h3>
                                    <p className="text-sm text-orange-800">
                                        {rastreio.precos_observados?.length || 0} observados
                                    </p>
                                </div>
                            </div>

                            {/* Preços Observados */}
                            {rastreio.precos_observados && rastreio.precos_observados.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-3">💰 Preços Observados</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {rastreio.precos_observados.map((preco: number, index: number) => (
                                            <span
                                                key={index}
                                                className="bg-white px-3 py-1 rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                                            >
                                                R$ {preco.toFixed(2)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Link Mais Barato */}
                            {rastreio.link_mais_barato && (
                                <div className="bg-yellow-50 p-4 rounded-xl">
                                    <h3 className="font-semibold text-yellow-900 mb-2">🏆 Mais Barato</h3>
                                    <a
                                        href={rastreio.link_mais_barato}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                                    >
                                        Ver no Mercado Livre →
                                    </a>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Mensagem quando não há concorrência */
                        <div className="bg-yellow-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Sem Concorrência</h3>
                            <p className="text-yellow-800 text-sm">
                                Nenhuma concorrência foi encontrada no Mercado Livre para essa peça específica.
                                O preço e análise foram baseados em padrões do mercado.
                            </p>
                        </div>
                    )}

                    {/* Detalhes Técnicos */}
                    <div className="space-y-3">
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-gray-900 mb-3">📋 Detalhes da Análise</h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Modelo Detectado:</span>
                                    <span className="font-medium">{rastreio.modelo_detectado}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Argumento Destaque:</span>
                                    <span className="font-medium text-right max-w-xs">{rastreio.argumento_destaque}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Garantia:</span>
                                    <span className="font-medium">{rastreio.garantia}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Base do Preço:</span>
                                    <span className="font-medium text-right max-w-xs">{rastreio.preco_base}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Qualidade da Análise:</span>
                                    <span className="font-medium text-right max-w-xs">{rastreio.qualidade_analise}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Dados Técnicos:</span>
                                    <span className="font-medium text-right max-w-xs">{rastreio.dados_tecnicos}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t pt-4">
                        <div className={`p-3 rounded-lg ${rastreio.concorrentes_analisados > 0
                                ? 'bg-green-50'
                                : 'bg-yellow-50'
                            }`}>
                            <p className={`text-sm text-center ${rastreio.concorrentes_analisados > 0
                                    ? 'text-green-800'
                                    : 'text-yellow-800'
                                }`}>
                                {rastreio.concorrentes_analisados > 0
                                    ? '✅ Análise baseada em dados reais do Mercado Livre'
                                    : '⚠️ Análise sem dados de concorrência disponíveis'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 