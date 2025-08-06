import LayoutAnuncios from '@/components/layout/LayoutAnuncios';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Download,
    Eye,
    EyeOff,
    Image,
    Layout,
    Loader2,
    Sparkles,
    Star,
    Upload
} from 'lucide-react';
import React, { useRef, useState } from 'react';

interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    preview: string;
    popular?: boolean;
}

export default function TemplatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOriginal, setShowOriginal] = useState(true);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const templates: Template[] = [
        {
            id: 'promo_01',
            name: 'Faixa Promocional',
            description: 'Template com faixa promocional destacada',
            category: 'Promocional',
            preview: '/api/templates/promo_01_preview.jpg',
            popular: true
        },
        {
            id: 'logo_01',
            name: 'Logo da Marca',
            description: 'Template com logo da DL Auto Peças',
            category: 'Marca',
            preview: '/api/templates/logo_01_preview.jpg'
        },
        {
            id: 'carro_01',
            name: 'Especificação do Carro',
            description: 'Template com informações do modelo do carro',
            category: 'Técnico',
            preview: '/api/templates/carro_01_preview.jpg'
        },
        {
            id: 'preco_01',
            name: 'Destaque de Preço',
            description: 'Template com preço em destaque',
            category: 'Comercial',
            preview: '/api/templates/preco_01_preview.jpg',
            popular: true
        },
        {
            id: 'garantia_01',
            name: 'Garantia Estendida',
            description: 'Template com selo de garantia',
            category: 'Comercial',
            preview: '/api/templates/garantia_01_preview.jpg'
        },
        {
            id: 'frete_01',
            name: 'Frete Grátis',
            description: 'Template com destaque para frete grátis',
            category: 'Comercial',
            preview: '/api/templates/frete_01_preview.jpg'
        }
    ];

    const categories = ['Todos', 'Promocional', 'Marca', 'Técnico', 'Comercial'];
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            setGeneratedImage('');
            setFeedback({ type: 'success', message: 'Imagem carregada com sucesso!' });
        }
    };

    const generateTemplate = async () => {
        if (!selectedTemplate || !selectedImage) return;

        setIsLoading(true);
        setFeedback(null);

        try {
            // Simular geração de template
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simular resultado gerado
            setGeneratedImage(URL.createObjectURL(selectedImage) + '?template=' + selectedTemplate.id);

            setFeedback({
                type: 'success',
                message: `Template "${selectedTemplate.name}" aplicado com sucesso!`
            });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Erro ao gerar template. Tente novamente.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const applyToAnuncio = async () => {
        if (!generatedImage) return;

        setIsLoading(true);
        setFeedback(null);

        try {
            // Simular aplicação no anúncio
            await new Promise(resolve => setTimeout(resolve, 1500));

            setFeedback({
                type: 'success',
                message: 'Template aplicado no anúncio com sucesso!'
            });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Erro ao aplicar no anúncio. Tente novamente.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const downloadTemplate = async () => {
        if (!generatedImage) return;

        setIsLoading(true);
        setFeedback(null);

        try {
            // Simular download
            await new Promise(resolve => setTimeout(resolve, 1000));

            setFeedback({
                type: 'success',
                message: 'Template baixado com sucesso!'
            });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Erro ao baixar template.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTemplates = selectedCategory === 'Todos'
        ? templates
        : templates.filter(template => template.category === selectedCategory);

    return (
        <LayoutAnuncios>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Templates de Anúncio</h1>
                            <p className="text-blue-100">Aplique templates profissionais às suas imagens de peças</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-2xl p-3">
                                <Layout className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Template Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Selecionar Template</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Filtrar por:</span>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTemplates.map((template) => (
                                <motion.div
                                    key={template.id}
                                    whileHover={{ scale: 1.02 }}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedTemplate?.id === template.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                    onClick={() => setSelectedTemplate(template)}
                                >
                                    {template.popular && (
                                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            Popular
                                        </div>
                                    )}

                                    <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                                        <Layout className="w-8 h-8 text-gray-400" />
                                    </div>

                                    <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                            {template.category}
                                        </span>
                                        {selectedTemplate?.id === template.id && (
                                            <CheckCircle className="w-5 h-5 text-blue-500" />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Carregar Imagem da Peça</h2>

                            <div
                                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-400 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />

                                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2">Clique para selecionar uma imagem</p>
                                <p className="text-sm text-gray-500">PNG, JPG, JPEG até 10MB</p>
                            </div>

                            {selectedImage && (
                                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-green-700 font-medium">
                                            {selectedImage.name} ({Math.round(selectedImage.size / 1024)}KB)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Generate Template */}
                    {selectedTemplate && selectedImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Gerar Template</h2>
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                                        <Layout className="w-4 h-4 text-blue-600" />
                                        <span className="text-blue-700 font-medium">{selectedTemplate.name}</span>
                                    </div>
                                    <span className="text-gray-400">+</span>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                                        <Image className="w-4 h-4 text-green-600" />
                                        <span className="text-green-700 font-medium">Sua Imagem</span>
                                    </div>
                                </div>

                                <button
                                    onClick={generateTemplate}
                                    disabled={isLoading}
                                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg mx-auto"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-5 h-5" />
                                    )}
                                    Gerar Template
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Preview Section */}
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setShowOriginal(!showOriginal)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        {showOriginal ? 'Ocultar Original' : 'Mostrar Original'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Original */}
                                {showOriginal && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Imagem Original</h3>
                                        <div className="relative">
                                            <img
                                                src={URL.createObjectURL(selectedImage)}
                                                alt="Original"
                                                className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Generated */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Template Gerado</h3>
                                    <div className="relative">
                                        {generatedImage ? (
                                            <img
                                                src={generatedImage}
                                                alt="Generated"
                                                className="w-full h-64 object-cover rounded-xl border-2 border-purple-200"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center">
                                                <div className="text-center text-gray-500">
                                                    <Layout className="w-12 h-12 mx-auto mb-2" />
                                                    <p>Clique em "Gerar Template" para processar</p>
                                                </div>
                                            </div>
                                        )}
                                        {generatedImage && (
                                            <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                                Template Aplicado
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {generatedImage && (
                                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={applyToAnuncio}
                                        disabled={isLoading}
                                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Image className="w-4 h-4" />
                                        )}
                                        Aplicar no Anúncio
                                    </button>
                                    <button
                                        onClick={downloadTemplate}
                                        disabled={isLoading}
                                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        Baixar Template
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

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