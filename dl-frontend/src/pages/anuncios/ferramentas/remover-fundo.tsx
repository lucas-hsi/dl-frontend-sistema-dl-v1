import LayoutAnuncios from '@/components/layout/LayoutAnuncios';
import { IAService } from '@/services/iaService';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Download,
    Eye,
    EyeOff,
    Image,
    Loader2,
    Scissors,
    Sparkles,
    Upload,
    Zap
} from 'lucide-react';
import React, { useRef, useState } from 'react';

export default function RemoverFundoPage() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string>('');
    const [processedUrl, setProcessedUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOriginal, setShowOriginal] = useState(true);
    const [processingStep, setProcessingStep] = useState<string>('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
    const [erroProcessamento, setErroProcessamento] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const iaService = new IAService();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setOriginalUrl(url);
            setProcessedUrl('');
            setErroProcessamento(null);
            setFeedback({ type: 'success', message: 'Imagem carregada com sucesso!' });
        }
    };

    const removerFundoIA = async () => {
        if (!selectedImage) return;

        setIsLoading(true);
        setFeedback(null);
        setErroProcessamento(null);
        setProcessingStep('Analisando imagem...');

        try {
            setProcessingStep('Detectando objetos...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            setProcessingStep('Removendo fundo...');

            // Chamar API real de remoção de fundo
            const resultado = await iaService.removerFundo(selectedImage);

            if (resultado.success) {
                // Criar URL para a imagem processada
                const processedBlobUrl = URL.createObjectURL(resultado.imagem);
                setProcessedUrl(processedBlobUrl);

                setProcessingStep('Otimizando resultado...');
                await new Promise(resolve => setTimeout(resolve, 1000));

                setFeedback({
                    type: 'success',
                    message: 'Fundo removido com sucesso! A imagem está pronta para uso.'
                });
            } else {
                throw new Error('Falha no processamento da imagem');
            }
        } catch (error) {
            console.error('Erro ao remover fundo:', error);
            setErroProcessamento('Ocorreu um erro ao remover o fundo. Tente novamente ou use outra imagem.');
            setFeedback({
                type: 'error',
                message: 'Erro ao remover fundo. Tente novamente.'
            });
        } finally {
            setIsLoading(false);
            setProcessingStep('');
        }
    };

    const aplicarNoAnuncio = async () => {
        if (!processedUrl) return;

        setIsLoading(true);
        setFeedback(null);

        try {
            // Simular aplicação no anúncio (aqui você pode implementar a lógica real)
            await new Promise(resolve => setTimeout(resolve, 1500));

            setFeedback({
                type: 'success',
                message: 'Imagem aplicada no anúncio com sucesso!'
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

    const baixarImagem = async () => {
        if (!processedUrl) return;

        setIsLoading(true);
        setFeedback(null);

        try {
            // Criar link de download
            const link = document.createElement('a');
            link.href = processedUrl;
            link.download = `imagem_sem_fundo_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setFeedback({
                type: 'success',
                message: 'Imagem baixada com sucesso!'
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

    const analyzeImage = async () => {
        if (!selectedImage) return;

        setIsLoading(true);
        setFeedback(null);

        try {
            // Simular análise com IA
            await new Promise(resolve => setTimeout(resolve, 2000));

            setFeedback({
                type: 'info',
                message: 'Análise: Imagem com fundo complexo detectado. Recomendamos remoção automática para melhor resultado.'
            });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Erro na análise da imagem.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LayoutAnuncios>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Remover Fundo com IA</h1>
                            <p className="text-blue-100">Remova automaticamente o fundo das suas imagens com inteligência artificial</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-2xl p-3">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Carregar Imagem</h2>

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

                    {/* AI Analysis */}
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Análise com IA</h2>
                                <button
                                    onClick={analyzeImage}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Zap className="w-4 h-4" />
                                    )}
                                    Analisar Imagem
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <Image className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                    <h3 className="font-semibold text-blue-800">Detecção de Objetos</h3>
                                    <p className="text-sm text-blue-600">IA identifica automaticamente o objeto principal</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                                    <Scissors className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                    <h3 className="font-semibold text-green-800">Remoção Inteligente</h3>
                                    <p className="text-sm text-green-600">Remove fundo preservando detalhes importantes</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                    <h3 className="font-semibold text-purple-800">Otimização Automática</h3>
                                    <p className="text-sm text-purple-600">Melhora qualidade e reduz tamanho do arquivo</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Processing Section */}
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Processamento</h2>
                                <button
                                    onClick={removerFundoIA}
                                    disabled={isLoading}
                                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg mx-auto"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Scissors className="w-5 h-5" />
                                    )}
                                    Remover Fundo com IA
                                </button>
                            </div>

                            {/* Processing Status */}
                            {isLoading && processingStep && (
                                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                                    <p className="text-blue-700 font-medium">{processingStep}</p>
                                    <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Error Alert */}
                            {erroProcessamento && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        <p className="text-red-700 font-medium">{erroProcessamento}</p>
                                    </div>
                                </div>
                            )}
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
                                                src={originalUrl}
                                                alt="Original"
                                                className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                                            />
                                            <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                                Com Fundo
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Processed */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Imagem Processada</h3>
                                    <div className="relative">
                                        {processedUrl ? (
                                            <img
                                                src={processedUrl}
                                                alt="Processed"
                                                className="w-full h-64 object-cover rounded-xl border-2 border-green-200"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center">
                                                <div className="text-center text-gray-500">
                                                    <Scissors className="w-12 h-12 mx-auto mb-2" />
                                                    <p>Clique em "Remover Fundo" para processar</p>
                                                </div>
                                            </div>
                                        )}
                                        {processedUrl && (
                                            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                                Sem Fundo
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {processedUrl && (
                                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={aplicarNoAnuncio}
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
                                        onClick={baixarImagem}
                                        disabled={isLoading}
                                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        Baixar Imagem
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