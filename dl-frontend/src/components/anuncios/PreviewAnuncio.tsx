import { Download, Eye, Share2, X } from 'lucide-react';

interface PreviewAnuncioProps {
    isOpen: boolean;
    onClose: () => void;
    anuncio: {
        titulo: string;
        descricao: string;
        preco: number;
        imagens: string[];
        tags: string[];
        categoria: string;
        marca?: string;
        modelo_veiculo?: string;
        ano_veiculo?: string;
    };
}

export default function PreviewAnuncio({ isOpen, onClose, anuncio }: PreviewAnuncioProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Eye className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-800">Preview do Anúncio</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Conteúdo do Preview */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Coluna da Esquerda - Imagens */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Imagens do Produto</h3>

                            {anuncio.imagens.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {anuncio.imagens.map((imagem, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={imagem}
                                                alt={`Imagem ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                                <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <div className="text-gray-400 mb-2">📷</div>
                                    <p className="text-gray-500">Nenhuma imagem adicionada</p>
                                </div>
                            )}
                        </div>

                        {/* Coluna da Direita - Informações */}
                        <div className="space-y-6">
                            {/* Título */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Título do Anúncio</h3>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <p className="text-gray-800 font-medium">{anuncio.titulo}</p>
                                </div>
                            </div>

                            {/* Preço */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Preço</h3>
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <p className="text-2xl font-bold text-green-700">
                                        R$ {anuncio.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>

                            {/* Informações do Produto */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Informações do Produto</h3>
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-blue-700 font-medium">Categoria:</span>
                                        <span className="text-blue-800">{anuncio.categoria}</span>
                                    </div>
                                    {anuncio.marca && (
                                        <div className="flex justify-between">
                                            <span className="text-blue-700 font-medium">Marca:</span>
                                            <span className="text-blue-800">{anuncio.marca}</span>
                                        </div>
                                    )}
                                    {anuncio.modelo_veiculo && (
                                        <div className="flex justify-between">
                                            <span className="text-blue-700 font-medium">Modelo:</span>
                                            <span className="text-blue-800">{anuncio.modelo_veiculo}</span>
                                        </div>
                                    )}
                                    {anuncio.ano_veiculo && (
                                        <div className="flex justify-between">
                                            <span className="text-blue-700 font-medium">Ano:</span>
                                            <span className="text-blue-800">{anuncio.ano_veiculo}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            {anuncio.tags.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {anuncio.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Descrição do Produto</h3>
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <div className="prose max-w-none">
                                <pre className="whitespace-pre-wrap text-gray-800 font-sans text-sm leading-relaxed">
                                    {anuncio.descricao}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Simulação do Mercado Livre */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Como aparecerá no Mercado Livre</h3>
                        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <span className="text-yellow-800 font-bold text-sm">ML</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">{anuncio.titulo}</h4>
                                    <p className="text-2xl font-bold text-green-600">
                                        R$ {anuncio.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>• Frete grátis</p>
                                <p>• Envio em até 2 dias úteis</p>
                                <p>• Garantia de 12 meses</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer com Ações */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>Preview gerado automaticamente</span>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Compartilhar
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                            <Download className="w-4 h-4" />
                            Baixar ZIP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 