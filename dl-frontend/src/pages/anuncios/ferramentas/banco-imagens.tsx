import LayoutAnuncios from '@/components/layout/LayoutAnuncios';
import { API_CONFIG } from '@/config/api';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Copy,
    Download,
    Eye,
    Grid,
    Image,
    List,
    Loader2,
    Search,
    Sparkles,
    Star,
    Upload
} from 'lucide-react';
import { useRef, useState } from 'react';

interface BancoImage {
    id: string;
    name: string;
    category: string;
    url: string;
    size: string;
    format: string;
    popular?: boolean;
    tags: string[];
}

export default function BancoImagensPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedImage, setSelectedImage] = useState<BancoImage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

    // Estados para upload
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const bancoImages: BancoImage[] = [
        {
            id: 'logo_dl_01',
            name: 'Logo DL Auto Peças',
            category: 'Logos',
            url: '/api/banco/logo_dl_01.png',
            size: '2.3MB',
            format: 'PNG',
            popular: true,
            tags: ['logo', 'marca', 'dl', 'auto peças']
        },
        {
            id: 'logo_fiat_01',
            name: 'Logo Fiat',
            category: 'Logos',
            url: '/api/banco/logo_fiat_01.png',
            size: '1.8MB',
            format: 'PNG',
            tags: ['logo', 'fiat', 'marca']
        },
        {
            id: 'logo_chevrolet_01',
            name: 'Logo Chevrolet',
            category: 'Logos',
            url: '/api/banco/logo_chevrolet_01.png',
            size: '2.1MB',
            format: 'PNG',
            tags: ['logo', 'chevrolet', 'marca']
        },
        {
            id: 'icon_frete_01',
            name: 'Ícone Frete Grátis',
            category: 'Ícones',
            url: '/api/banco/icon_frete_01.png',
            size: '156KB',
            format: 'PNG',
            popular: true,
            tags: ['frete', 'grátis', 'ícone']
        },
        {
            id: 'icon_garantia_01',
            name: 'Ícone Garantia',
            category: 'Ícones',
            url: '/api/banco/icon_garantia_01.png',
            size: '203KB',
            format: 'PNG',
            tags: ['garantia', 'ícone', 'selo']
        },
        {
            id: 'icon_preco_01',
            name: 'Ícone Preço Baixo',
            category: 'Ícones',
            url: '/api/banco/icon_preco_01.png',
            size: '178KB',
            format: 'PNG',
            tags: ['preço', 'baixo', 'ícone']
        },
        {
            id: 'bg_gradient_01',
            name: 'Fundo Gradiente Azul',
            category: 'Fundos',
            url: '/api/banco/bg_gradient_01.png',
            size: '3.2MB',
            format: 'PNG',
            tags: ['fundo', 'gradiente', 'azul']
        },
        {
            id: 'bg_pattern_01',
            name: 'Padrão Geométrico',
            category: 'Fundos',
            url: '/api/banco/bg_pattern_01.png',
            size: '2.8MB',
            format: 'PNG',
            tags: ['fundo', 'padrão', 'geométrico']
        },
        {
            id: 'icon_whatsapp_01',
            name: 'Ícone WhatsApp',
            category: 'Ícones',
            url: '/api/banco/icon_whatsapp_01.png',
            size: '145KB',
            format: 'PNG',
            popular: true,
            tags: ['whatsapp', 'contato', 'ícone']
        },
        {
            id: 'icon_phone_01',
            name: 'Ícone Telefone',
            category: 'Ícones',
            url: '/api/banco/icon_phone_01.png',
            size: '167KB',
            format: 'PNG',
            tags: ['telefone', 'contato', 'ícone']
        },
        {
            id: 'logo_volkswagen_01',
            name: 'Logo Volkswagen',
            category: 'Logos',
            url: '/api/banco/logo_volkswagen_01.png',
            size: '2.0MB',
            format: 'PNG',
            tags: ['logo', 'volkswagen', 'marca']
        },
        {
            id: 'bg_abstract_01',
            name: 'Fundo Abstrato',
            category: 'Fundos',
            url: '/api/banco/bg_abstract_01.png',
            size: '4.1MB',
            format: 'PNG',
            tags: ['fundo', 'abstrato', 'moderno']
        }
    ];

    const categories = ['Todos', 'Logos', 'Ícones', 'Fundos'];

    const filteredImages = bancoImages.filter(image => {
        const matchesCategory = selectedCategory === 'Todos' || image.category === selectedCategory;
        const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const copyToTemplate = async (image: BancoImage) => {
        setIsLoading(true);
        setFeedback(null);

        try {
            // Simular cópia para template
            await new Promise(resolve => setTimeout(resolve, 1000));

            setFeedback({
                type: 'success',
                message: `"${image.name}" copiado para o template!`
            });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Erro ao copiar para template.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const downloadImage = async (image: BancoImage) => {
        setIsLoading(true);
        setFeedback(null);

        try {
            // Simular download
            await new Promise(resolve => setTimeout(resolve, 1500));

            setFeedback({
                type: 'success',
                message: `"${image.name}" baixado com sucesso!`
            });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Erro ao baixar imagem.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const previewImage = (image: BancoImage) => {
        setSelectedImage(image);
    };

    // Função para upload de imagens
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);
        setFeedback(null);

        try {
            const formData = new FormData();

            // Adicionar cada arquivo ao FormData
            Array.from(files).forEach(file => {
                // Validar tipo de arquivo
                if (!file.type.startsWith('image/')) {
                    throw new Error(`Arquivo "${file.name}" não é uma imagem válida`);
                }
                formData.append('imagens', file);
            });

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/imagens/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'ok') {
                setFeedback({
                    type: 'success',
                    message: `${result.mensagem} - Imagens carregadas com sucesso!`
                });

                // Recarregar a lista de imagens (simulado por enquanto)
                // await fetchImagens();

                // Limpar o input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                throw new Error(result.error || 'Erro desconhecido no upload');
            }
        } catch (error) {
            console.error('Erro no upload:', error);
            setFeedback({
                type: 'error',
                message: `Erro ao fazer upload: ${error}`
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Função para abrir o seletor de arquivos
    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    return (
        <LayoutAnuncios>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Banco de Imagens</h1>
                            <p className="text-blue-100">Acesse logos, ícones e fundos para seus anúncios</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-2xl p-3">
                                <Image className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Search and Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                            {/* Search */}
                            <div className="flex-1 w-full lg:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar imagens..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Upload Button */}
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    multiple
                                    className="hidden"
                                    id="uploadInput"
                                    ref={fileInputRef}
                                    onChange={handleUpload}
                                />
                                <label htmlFor="uploadInput">
                                    <button
                                        onClick={openFileSelector}
                                        disabled={isUploading}
                                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Upload className="w-4 h-4" />
                                        )}
                                        {isUploading ? 'Enviando...' : '+ Upload'}
                                    </button>
                                </label>
                            </div>

                            {/* Category Filter */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">Categoria:</span>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* View Mode */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                {filteredImages.length} imagem{filteredImages.length !== 1 ? 'ens' : ''} encontrada{filteredImages.length !== 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Sparkles className="w-4 h-4" />
                                <span>Banco atualizado diariamente</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Images Grid/List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredImages.map((image) => (
                                    <motion.div
                                        key={image.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="relative group bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                                    >
                                        {image.popular && (
                                            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                Popular
                                            </div>
                                        )}

                                        <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                                            <Image className="w-8 h-8 text-gray-400" />
                                        </div>

                                        <h3 className="font-semibold text-gray-800 mb-1 truncate">{image.name}</h3>
                                        <p className="text-xs text-gray-500 mb-2">{image.category}</p>

                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                                            <span>{image.size}</span>
                                            <span>{image.format}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => previewImage(image)}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => copyToTemplate(image)}
                                                disabled={isLoading}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                                Copiar
                                            </button>
                                            <button
                                                onClick={() => downloadImage(image)}
                                                disabled={isLoading}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Download className="w-4 h-4" />
                                                )}
                                                Baixar
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredImages.map((image) => (
                                    <motion.div
                                        key={image.id}
                                        whileHover={{ scale: 1.01 }}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Image className="w-6 h-6 text-gray-400" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-800 truncate">{image.name}</h3>
                                                {image.popular && (
                                                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                                        <Star className="w-3 h-3" />
                                                        Popular
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{image.category}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>{image.size}</span>
                                                <span>{image.format}</span>
                                                <div className="flex gap-1">
                                                    {image.tags.slice(0, 2).map((tag, index) => (
                                                        <span key={index} className="px-2 py-1 bg-gray-200 rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => previewImage(image)}
                                                className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => copyToTemplate(image)}
                                                disabled={isLoading}
                                                className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                                Copiar
                                            </button>
                                            <button
                                                onClick={() => downloadImage(image)}
                                                disabled={isLoading}
                                                className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Download className="w-4 h-4" />
                                                )}
                                                Baixar
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {filteredImages.length === 0 && (
                            <div className="text-center py-12">
                                <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma imagem encontrada</h3>
                                <p className="text-gray-500">Tente ajustar os filtros ou termos de busca</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Image Preview Modal */}
                    <AnimatePresence>
                        {selectedImage && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                                onClick={() => setSelectedImage(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-white rounded-2xl p-6 max-w-2xl w-full"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">{selectedImage.name}</h3>
                                        <button
                                            onClick={() => setSelectedImage(null)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
                                        <Image className="w-16 h-16 text-gray-400" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <p className="text-sm text-gray-600">Categoria</p>
                                            <p className="font-medium">{selectedImage.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Tamanho</p>
                                            <p className="font-medium">{selectedImage.size}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Formato</p>
                                            <p className="font-medium">{selectedImage.format}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Tags</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedImage.tags.map((tag, index) => (
                                                    <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => copyToTemplate(selectedImage)}
                                            disabled={isLoading}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                            Copiar para Template
                                        </button>
                                        <button
                                            onClick={() => downloadImage(selectedImage)}
                                            disabled={isLoading}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Download className="w-4 h-4" />
                                            )}
                                            Baixar
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Feedback Messages */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`p-4 rounded-xl border ${feedback.type === 'success'
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : feedback.type === 'error'
                                        ? 'bg-red-50 border-red-200 text-red-700'
                                        : 'bg-blue-50 border-blue-200 text-blue-700'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    {feedback.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                    {feedback.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                                    {feedback.type === 'info' && <AlertTriangle className="w-5 h-5" />}
                                    <span className="font-medium">{feedback.message}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </LayoutAnuncios>
    );
} 