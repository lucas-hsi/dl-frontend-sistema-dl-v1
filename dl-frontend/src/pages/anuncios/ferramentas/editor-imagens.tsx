import LayoutAnuncios from '@/components/layout/LayoutAnuncios';
import { API_CONFIG } from '@/config/api';
import { safeApiCall } from '@/utils/apiUtils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Crop,
    Download,
    Eye,
    EyeOff,
    Filter,
    FolderOpen,
    Image as ImageIcon,
    Loader2,
    Maximize2,
    Moon,
    Palette,
    Redo2,
    RotateCcw,
    RotateCw,
    Scissors,
    Sparkles,
    Sun,
    Undo2,
    Upload,
    Zap
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ImageEdit {
    id: string;
    name: string;
    applied: boolean;
    value?: number;
}

interface EditHistory {
    id: string;
    type: string;
    data: any;
    timestamp: number;
}

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface BatchImage {
    id: string;
    file: File;
    preview: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    enhanced?: string;
    error?: string;
}

interface EnhancementResponse {
    success: boolean;
    enhanced_image?: string;
    error?: string;
    processing_time?: number;
}

interface BatchEnhancementResponse {
    success: boolean;
    enhanced_images?: string[];
    errors?: string[];
    processing_time?: number;
    total_images: number;
    processed_images: number;
}

export default function EditorImagensPage() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [editedImageUrl, setEditedImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOriginal, setShowOriginal] = useState(true);
    const [appliedEdits, setAppliedEdits] = useState<ImageEdit[]>([]);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
    const [editHistory, setEditHistory] = useState<EditHistory[]>([]);
    const [currentFilter, setCurrentFilter] = useState<string>('');
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);

    // Estados para undo/reset/redo
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const originalImageRef = useRef<HTMLImageElement | null>(null);

    // Estados para seleção de área
    const [isCropMode, setIsCropMode] = useState(false);
    const [cropArea, setCropArea] = useState<CropArea | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Estados para compressão
    const [compressionLevel, setCompressionLevel] = useState(0.8);
    const [autoCompress, setAutoCompress] = useState(true);

    // Estados para IA
    const [aiEnhancement, setAiEnhancement] = useState(false);
    const [aiProcessing, setAiProcessing] = useState(false);
    const [aiEnhancementType, setAiEnhancementType] = useState('auto_enhance');

    // Estados para batch processing
    const [batchImages, setBatchImages] = useState<BatchImage[]>([]);
    const [batchProcessing, setBatchProcessing] = useState(false);
    const [batchProgress, setBatchProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const batchFileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Computed states
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;
    const hasChanges = historyIndex > 0;

    const editOptions = [
        { id: 'cortar', name: 'Cortar', icon: Scissors, color: 'bg-blue-500' },
        { id: 'redimensionar', name: 'Redimensionar', icon: Maximize2, color: 'bg-green-500' },
        { id: 'girar', name: 'Girar', icon: RotateCw, color: 'bg-purple-500' },
        { id: 'nitidez', name: 'Nitidez', icon: Filter, color: 'bg-orange-500' },
        { id: 'brilho', name: 'Brilho', icon: Sun, color: 'bg-yellow-500' },
        { id: 'contraste', name: 'Contraste', icon: Moon, color: 'bg-indigo-500' },
        { id: 'saturacao', name: 'Saturação', icon: Palette, color: 'bg-pink-500' },
        { id: 'filtros', name: 'Filtros', icon: Zap, color: 'bg-red-500' },
    ];

    const filters = [
        { id: 'normal', name: 'Normal', filter: 'none' },
        { id: 'grayscale', name: 'Preto e Branco', filter: 'grayscale(100%)' },
        { id: 'sepia', name: 'Sépia', filter: 'sepia(100%)' },
        { id: 'blur', name: 'Desfoque', filter: 'blur(2px)' },
        { id: 'invert', name: 'Inverter', filter: 'invert(100%)' },
        { id: 'hue-rotate', name: 'Matiz', filter: 'hue-rotate(90deg)' },
        { id: 'vintage', name: 'Vintage', filter: 'sepia(50%) contrast(120%) brightness(90%)' },
        { id: 'dramatic', name: 'Dramático', filter: 'contrast(150%) brightness(80%) saturate(120%)' },
        { id: 'warm', name: 'Quente', filter: 'sepia(30%) hue-rotate(30deg) brightness(110%)' },
        { id: 'cool', name: 'Frio', filter: 'hue-rotate(180deg) saturate(80%) brightness(95%)' },
        { id: 'sharp', name: 'Nítido', filter: 'contrast(130%) saturate(110%) brightness(105%)' },
        { id: 'soft', name: 'Suave', filter: 'brightness(105%) contrast(90%) saturate(80%)' },
    ];

    const aiEnhancementTypes = [
        { id: 'auto_enhance', name: 'Melhoria Automática', description: 'Análise inteligente da imagem' },
        { id: 'smart_contrast', name: 'Contraste Inteligente', description: 'CLAHE para melhor contraste' },
        { id: 'noise_reduction', name: 'Redução de Ruído', description: 'Preserva detalhes importantes' },
        { id: 'sharpening', name: 'Nitidez', description: 'Unsharp mask inteligente' },
        { id: 'color_balance', name: 'Balanceamento de Cores', description: 'White balance automático' },
        { id: 'exposure_correction', name: 'Correção de Exposição', description: 'Ajuste automático de brilho' },
        { id: 'hdr_effect', name: 'Efeito HDR', description: 'Tone mapping simulado' },
        { id: 'portrait_enhancement', name: 'Melhoria de Retrato', description: 'Otimizado para pessoas' },
    ];

    // Helper function to draw image from data URL
    const drawFromDataURL = useCallback((dataUrl: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const img = new Image();
        img.onload = () => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                updatePreview();
            }
        };
        img.src = dataUrl;
    }, []);

    // Push current state to history
    const pushHistory = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const data = canvas.toDataURL('image/png', compressionLevel);
        setHistory(prev => {
            const newHist = [...prev.slice(0, historyIndex + 1), data];
            setHistoryIndex(newHist.length - 1);
            return newHist;
        });
    }, [historyIndex, compressionLevel]);

    // Undo function
    const handleUndo = useCallback(() => {
        if (!canUndo) return;

        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        drawFromDataURL(history[newIndex]);

        setFeedback({
            type: 'success',
            message: 'Última edição desfeita!'
        });
    }, [canUndo, historyIndex, history, drawFromDataURL]);

    // Redo function
    const handleRedo = useCallback(() => {
        if (!canRedo) return;

        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        drawFromDataURL(history[newIndex]);

        setFeedback({
            type: 'success',
            message: 'Edição refeita!'
        });
    }, [canRedo, historyIndex, history, drawFromDataURL]);

    // Reset function
    const handleReset = useCallback(() => {
        if (!hasChanges) return;

        setHistoryIndex(0);
        drawFromDataURL(history[0]); // estado original

        // Reset all states
        setAppliedEdits([]);
        setEditHistory([]);
        setCurrentFilter('normal');
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setRotation(0);
        setScale(1);
        setIsCropMode(false);
        setCropArea(null);

        setFeedback({
            type: 'success',
            message: 'Todas as alterações revertidas!'
        });
    }, [hasChanges, history, drawFromDataURL]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey || event.metaKey) {
                switch (event.key.toLowerCase()) {
                    case 'z':
                        event.preventDefault();
                        if (event.shiftKey) {
                            // Ctrl+Shift+Z = Redo
                            handleRedo();
                        } else {
                            // Ctrl+Z = Undo
                            handleUndo();
                        }
                        break;
                    case 'r':
                        event.preventDefault();
                        // Ctrl+R = Reset
                        handleReset();
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo, handleReset]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setEditedImageUrl(url);
            setAppliedEdits([]);
            setEditHistory([]);
            setCurrentFilter('normal');
            setBrightness(100);
            setContrast(100);
            setSaturation(100);
            setRotation(0);
            setScale(1);
            setIsCropMode(false);
            setCropArea(null);
            setFeedback({ type: 'success', message: 'Imagem carregada com sucesso!' });

            // Carregar imagem no canvas
            setTimeout(() => {
                loadImageToCanvas(url);
            }, 100);
        }
    };

    const loadImageToCanvas = useCallback((imageUrl: string) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = new Image();

        img.onload = () => {
            if (canvas && ctx) {
                // Configurar canvas
                canvas.width = img.width;
                canvas.height = img.height;

                // Desenhar imagem
                ctx.drawImage(img, 0, 0);

                // Salvar estado inicial no history
                const initialData = canvas.toDataURL('image/png', compressionLevel);
                setHistory([initialData]);
                setHistoryIndex(0);

                // Aplicar edições existentes
                applyEditsToCanvas();
            }
        };

        img.src = imageUrl;
    }, [compressionLevel]);

    const applyEditsToCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) return;

        // Aplicar filtros CSS equivalentes no canvas
        if (brightness !== 100 || contrast !== 100 || saturation !== 100) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                // Brilho
                data[i] = Math.min(255, data[i] * (brightness / 100));
                data[i + 1] = Math.min(255, data[i + 1] * (brightness / 100));
                data[i + 2] = Math.min(255, data[i + 2] * (brightness / 100));

                // Contraste
                const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
                data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
                data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
            }

            ctx.putImageData(imageData, 0, 0);
        }

        // Aplicar rotação
        if (rotation !== 0) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(canvas, -centerX, -centerY);
            ctx.restore();
        }

        // Atualizar preview
        updatePreview();

        // Push to history after applying edits
        pushHistory();
    }, [brightness, contrast, saturation, rotation, pushHistory]);

    const updatePreview = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png', compressionLevel);
            setEditedImageUrl(dataUrl);
        }
    }, [compressionLevel]);

    useEffect(() => {
        if (selectedImage) {
            applyEditsToCanvas();
        }
    }, [applyEditsToCanvas, selectedImage]);

    // Função para ativar modo de corte
    const activateCropMode = () => {
        setIsCropMode(true);
        setCropArea(null);
        setFeedback({
            type: 'info',
            message: 'Clique e arraste para selecionar a área de corte'
        });
    };

    // Função para aplicar corte
    const applyCrop = () => {
        if (!cropArea) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (canvas && ctx) {
            // Criar canvas temporário para o corte
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            tempCanvas.width = cropArea.width;
            tempCanvas.height = cropArea.height;

            // Copiar área selecionada
            tempCtx?.drawImage(
                canvas,
                cropArea.x, cropArea.y, cropArea.width, cropArea.height,
                0, 0, cropArea.width, cropArea.height
            );

            // Redimensionar canvas original
            canvas.width = cropArea.width;
            canvas.height = cropArea.height;

            // Desenhar área cortada
            ctx.drawImage(tempCanvas, 0, 0);

            updatePreview();
            pushHistory();

            setIsCropMode(false);
            setCropArea(null);

            addEdit('cortar', 'Cortar');

            setFeedback({
                type: 'success',
                message: 'Corte aplicado com sucesso!'
            });
        }
    };

    // Função para cancelar corte
    const cancelCrop = () => {
        setIsCropMode(false);
        setCropArea(null);
        setFeedback({
            type: 'info',
            message: 'Modo de corte cancelado'
        });
    };

    // Event handlers para seleção de área
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isCropMode) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDragging(true);
        setDragStart({ x, y });
        setCropArea({ x, y, width: 0, height: 0 });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isCropMode || !isDragging) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCropArea(prev => {
            if (!prev) return null;
            return {
                x: Math.min(dragStart.x, x),
                y: Math.min(dragStart.y, y),
                width: Math.abs(x - dragStart.x),
                height: Math.abs(y - dragStart.y)
            };
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Função para melhorias com IA
    const applyAiEnhancement = async () => {
        if (!selectedImage) return;

        setAiProcessing(true);
        setFeedback({
            type: 'info',
            message: 'Aplicando melhorias com IA...'
        });

        try {
            const formData = new FormData();
            formData.append('file', selectedImage);
            formData.append('enhancement_type', aiEnhancementType);

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/ia/enhance-single`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success && result.enhanced_image) {
                // Converter base64 para data URL
                const dataUrl = `data:image/png;base64,${result.enhanced_image}`;

                // Carregar imagem melhorada no canvas
                const canvas = canvasRef.current;
                if (canvas) {
                    const img = new Image();
                    img.onload = () => {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            updatePreview();
                            pushHistory();

                            addEdit('ia', 'Melhoria com IA');

                            setFeedback({
                                type: 'success',
                                message: `Melhorias com IA aplicadas com sucesso! (${result.processing_time?.toFixed(2)}s)`
                            });
                        }
                    };
                    img.src = dataUrl;
                }
            } else {
                throw new Error(result.error || 'Erro desconhecido');
            }
        } catch (error) {
            setFeedback({
                type: 'error',
                message: `Erro ao aplicar melhorias com IA: ${error}`
            });
        } finally {
            setAiProcessing(false);
        }
    };

    const cortarImagem = () => {
        activateCropMode();
    };

    const redimensionarImagem = () => {
        const newScale = scale === 1 ? 0.8 : scale === 0.8 ? 1.2 : 1;
        setScale(newScale);

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');

                tempCanvas.width = canvas.width * newScale;
                tempCanvas.height = canvas.height * newScale;

                tempCtx?.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

                canvas.width = tempCanvas.width;
                canvas.height = tempCanvas.height;
                ctx.drawImage(tempCanvas, 0, 0);

                updatePreview();
                pushHistory();
            }
        }

        addEdit('redimensionar', 'Redimensionar', newScale);
    };

    const girarImagem = () => {
        const newRotation = (rotation + 90) % 360;
        setRotation(newRotation);
        addEdit('girar', 'Girar', newRotation);
    };

    const ajustarBrilho = (value: number) => {
        setBrightness(value);
        addEdit('brilho', 'Brilho', value);
    };

    const ajustarContraste = (value: number) => {
        setContrast(value);
        addEdit('contraste', 'Contraste', value);
    };

    const ajustarSaturacao = (value: number) => {
        setSaturation(value);
        addEdit('saturacao', 'Saturação', value);
    };

    const aplicarFiltro = (filterId: string) => {
        setCurrentFilter(filterId);
        addEdit('filtro', 'Filtro', filterId);

        // Aplicar filtro CSS ao canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const filter = filters.find(f => f.id === filterId);
            if (filter) {
                canvas.style.filter = filter.filter;
                updatePreview();
                pushHistory();
            }
        }
    };

    const aplicarNitidez = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (canvas && ctx) {
            // Aplicar convolução para nitidez
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Kernel de nitidez
            const kernel = [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ];

            const tempData = new Uint8ClampedArray(data);

            for (let y = 1; y < canvas.height - 1; y++) {
                for (let x = 1; x < canvas.width - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let sum = 0;
                        for (let ky = -1; ky <= 1; ky++) {
                            for (let kx = -1; kx <= 1; kx++) {
                                const idx = ((y + ky) * canvas.width + (x + kx)) * 4 + c;
                                sum += tempData[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
                            }
                        }
                        const idx = (y * canvas.width + x) * 4 + c;
                        data[idx] = Math.min(255, Math.max(0, sum));
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            updatePreview();
            pushHistory();
        }

        addEdit('nitidez', 'Nitidez');
    };

    const addEdit = (id: string, name: string, value?: any) => {
        const edit: ImageEdit = { id, name, applied: true, value };
        setAppliedEdits(prev => {
            const existing = prev.find(e => e.id === id);
            if (existing) {
                return prev.map(e => e.id === id ? edit : e);
            }
            return [...prev, edit];
        });

        setEditHistory(prev => [...prev, {
            id: Date.now().toString(),
            type: id,
            data: value,
            timestamp: Date.now()
        }]);
    };

    const applyEdit = async (editId: string) => {
        if (!selectedImage) return;

        setIsLoading(true);
        setFeedback(null);

        try {
            switch (editId) {
                case 'cortar':
                    cortarImagem();
                    break;
                case 'redimensionar':
                    redimensionarImagem();
                    break;
                case 'girar':
                    girarImagem();
                    break;
                case 'nitidez':
                    aplicarNitidez();
                    break;
                case 'brilho':
                    ajustarBrilho(120);
                    break;
                case 'contraste':
                    ajustarContraste(120);
                    break;
                case 'saturacao':
                    ajustarSaturacao(120);
                    break;
                case 'filtros':
                    aplicarFiltro('grayscale');
                    break;
            }

            setFeedback({
                type: 'success',
                message: 'Edição aplicada com sucesso!'
            });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Erro ao aplicar edição. Tente novamente.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const baixarImagem = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = `imagem-editada-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', compressionLevel);
            link.click();

            setFeedback({
                type: 'success',
                message: 'Imagem baixada com sucesso!'
            });
        }
    };

    const aplicarNoAnuncio = () => {
        setFeedback({
            type: 'success',
            message: 'Imagem aplicada no anúncio com sucesso!'
        });
    };

    const salvarImagem = async () => {
        if (!editedImageUrl) return;

        setIsLoading(true);
        setFeedback(null);

        try {
            // Simular salvamento
            await new Promise(resolve => setTimeout(resolve, 1500));

            setFeedback({
                type: 'success',
                message: 'Imagem salva com sucesso!'
            });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Erro ao salvar imagem. Tente novamente.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Função para IA real com backend
    const applyRealAiEnhancement = async () => {
        if (!selectedImage) return;

        setAiProcessing(true);
        setFeedback({
            type: 'info',
            message: 'Aplicando melhorias com IA...'
        });

        try {
            const formData = new FormData();
            formData.append('file', selectedImage);
            formData.append('enhancement_type', aiEnhancementType);

            const result = await safeApiCall<EnhancementResponse>('/api/ia/enhance-single', {
                method: 'POST',
                body: formData,
                headers: {} // Remover Content-Type para FormData
            });

            if (result.success && result.data?.enhanced_image) {
                // Converter base64 para data URL
                const dataUrl = `data:image/png;base64,${result.data.enhanced_image}`;

                // Carregar imagem melhorada no canvas
                const canvas = canvasRef.current;
                if (canvas) {
                    const img = new Image();
                    img.onload = () => {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            updatePreview();
                            pushHistory();

                            addEdit('ia', 'Melhoria com IA');

                            setFeedback({
                                type: 'success',
                                message: `Melhorias com IA aplicadas com sucesso! (${result.data?.processing_time?.toFixed(2) || '0'}s)`
                            });
                        }
                    };
                    img.src = dataUrl;
                }
            } else {
                const errorMessage = result.error || (result.data as any)?.error || 'Erro desconhecido';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Erro na IA enhancement:', error);
            setFeedback({
                type: 'error',
                message: `Erro ao aplicar melhorias com IA: ${error}`
            });
        } finally {
            setAiProcessing(false);
        }
    };

    // Função para batch processing
    const handleBatchUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newBatchImages: BatchImage[] = Array.from(files).map(file => ({
            id: Date.now() + Math.random().toString(36),
            file,
            preview: URL.createObjectURL(file),
            status: 'pending'
        }));

        setBatchImages(prev => [...prev, ...newBatchImages]);
        setFeedback({
            type: 'success',
            message: `${newBatchImages.length} imagens adicionadas ao lote`
        });
    };

    const processBatchImages = async () => {
        if (batchImages.length === 0) return;

        setBatchProcessing(true);
        setBatchProgress(0);

        try {
            const formData = new FormData();

            // Adicionar cada arquivo ao FormData
            batchImages.forEach((image, index) => {
                formData.append('files', image.file);
            });

            // Adicionar parâmetros
            formData.append('enhancement_type', aiEnhancementType);

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/ia/enhance-batch`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.enhanced_images) {
                // Atualizar status das imagens
                setBatchImages(prev => prev.map((image, index) => ({
                    ...image,
                    status: 'completed' as const,
                    enhanced: `data:image/png;base64,${result.enhanced_images[index]}`
                })));

                setFeedback({
                    type: 'success',
                    message: `${result.processed_images}/${result.total_images} imagens processadas com sucesso! (${result.processing_time?.toFixed(2)}s)`
                });
            } else {
                throw new Error(result.errors?.[0] || result.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error('Erro no batch processing:', error);
            setFeedback({
                type: 'error',
                message: `Erro ao processar imagens em lote: ${error}`
            });
        } finally {
            setBatchProcessing(false);
            setBatchProgress(0);
        }
    };

    const downloadBatchImages = () => {
        batchImages.forEach((image, index) => {
            if (image.enhanced) {
                const link = document.createElement('a');
                link.download = `imagem-melhorada-${index + 1}.png`;
                link.href = image.enhanced;
                link.click();
            }
        });

        setFeedback({
            type: 'success',
            message: 'Todas as imagens melhoradas foram baixadas!'
        });
    };

    const clearBatchImages = () => {
        setBatchImages([]);
        setFeedback({
            type: 'info',
            message: 'Lote de imagens limpo'
        });
    };

    return (
        <LayoutAnuncios>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Header Premium */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Editor de Imagens</h1>
                            <p className="text-blue-100">Otimize suas imagens de anúncios com ferramentas profissionais</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 rounded-2xl p-3">
                                <Filter className="w-8 h-8 text-white" />
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

                    {/* Batch Processing Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Processamento em Lote</h2>
                            <button
                                onClick={() => batchFileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                            >
                                <FolderOpen className="w-4 h-4" />
                                Adicionar Imagens
                            </button>
                        </div>

                        <input
                            ref={batchFileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleBatchUpload}
                            className="hidden"
                        />

                        {batchImages.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {batchImages.length} imagem{batchImages.length > 1 ? 'ns' : ''} selecionada{batchImages.length > 1 ? 's' : ''}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={processBatchImages}
                                            disabled={batchProcessing}
                                            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                                        >
                                            {batchProcessing ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-4 h-4" />
                                            )}
                                            Processar com IA
                                        </button>
                                        <button
                                            onClick={downloadBatchImages}
                                            disabled={batchImages.some(img => img.status !== 'completed')}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Baixar Todas
                                        </button>
                                        <button
                                            onClick={clearBatchImages}
                                            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            Limpar
                                        </button>
                                    </div>
                                </div>

                                {batchProcessing && (
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${batchProgress}%` }}
                                        ></div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {batchImages.map((image) => (
                                        <div key={image.id} className="relative">
                                            <img
                                                src={image.preview}
                                                alt="Preview"
                                                className="w-full h-24 object-cover rounded-lg border"
                                            />
                                            {image.status === 'completed' && image.enhanced && (
                                                <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                            )}
                                            {image.status === 'processing' && (
                                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                                </div>
                                            )}
                                            {image.status === 'error' && (
                                                <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Editor Section - Layout Reorganizado */}
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                        >
                            <div className="flex flex-col gap-6">
                                {/* Canvas Area - Agora em cima */}
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Editor</h2>
                                    <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 relative">
                                        <canvas
                                            ref={canvasRef}
                                            className="max-w-full h-auto border rounded shadow-md mx-auto"
                                            style={{ maxHeight: '400px' }}
                                            onMouseDown={handleMouseDown}
                                            onMouseMove={handleMouseMove}
                                            onMouseUp={handleMouseUp}
                                        />

                                        {/* Overlay de seleção de área */}
                                        {isCropMode && cropArea && (
                                            <div
                                                className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
                                                style={{
                                                    left: cropArea.x,
                                                    top: cropArea.y,
                                                    width: cropArea.width,
                                                    height: cropArea.height
                                                }}
                                            />
                                        )}

                                        {/* Controles de corte */}
                                        {isCropMode && (
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <button
                                                    onClick={applyCrop}
                                                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                                                >
                                                    Aplicar
                                                </button>
                                                <button
                                                    onClick={cancelCrop}
                                                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Loading State */}
                                    {isLoading && (
                                        <div className="mt-4 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                                            <p className="text-sm text-gray-500 mt-2">Processando imagem...</p>
                                        </div>
                                    )}
                                </div>

                                {/* Barra de Edição - Agora abaixo da imagem */}
                                <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-gray-200">
                                    {/* Ferramentas de Edição */}
                                    <button
                                        onClick={() => applyEdit('cortar')}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        <Crop className="w-4 h-4" />
                                        Cortar
                                    </button>

                                    <button
                                        onClick={() => applyEdit('girar')}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                        Rotacionar
                                    </button>

                                    <button
                                        onClick={() => applyEdit('brilho')}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        <Sun className="w-4 h-4" />
                                        Brilho
                                    </button>

                                    <button
                                        onClick={() => applyEdit('contraste')}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        <Moon className="w-4 h-4" />
                                        Contraste
                                    </button>

                                    <button
                                        onClick={() => applyEdit('filtros')}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        <Zap className="w-4 h-4" />
                                        Filtros
                                    </button>

                                    {/* Separador */}
                                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                                    {/* Controles de Histórico */}
                                    <button
                                        onClick={handleUndo}
                                        disabled={!canUndo || isLoading}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        <Undo2 className="w-4 h-4" />
                                        Desfazer (Ctrl+Z)
                                    </button>

                                    <button
                                        onClick={handleRedo}
                                        disabled={!canRedo || isLoading}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        <Redo2 className="w-4 h-4" />
                                        Refazer (Ctrl+Shift+Z)
                                    </button>

                                    <button
                                        onClick={handleReset}
                                        disabled={!hasChanges || isLoading}
                                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reverter Tudo (Ctrl+R)
                                    </button>

                                    {/* Separador */}
                                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                                    {/* IA Enhancement */}
                                    <button
                                        onClick={applyRealAiEnhancement}
                                        disabled={aiProcessing || isLoading}
                                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        {aiProcessing ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-4 h-4" />
                                        )}
                                        IA Enhancement
                                    </button>
                                </div>

                                {/* Tipo de Melhoria IA */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="font-semibold text-gray-700 mb-3">Tipo de Melhoria IA</h3>
                                    <select
                                        value={aiEnhancementType}
                                        onChange={(e) => setAiEnhancementType(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {aiEnhancementTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name} - {type.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Ajustes Finos - Sliders */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                    {/* Brilho */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Brilho: {brightness}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={brightness}
                                            onChange={(e) => ajustarBrilho(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Contraste */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contraste: {contrast}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={contrast}
                                            onChange={(e) => ajustarContraste(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Saturação */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Saturação: {saturation}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={saturation}
                                            onChange={(e) => ajustarSaturacao(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Compressão */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-gray-700">Compressão</h3>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={autoCompress}
                                                onChange={(e) => setAutoCompress(e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-600">Auto-compressão</span>
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Qualidade: {Math.round(compressionLevel * 100)}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="1"
                                            step="0.1"
                                            value={compressionLevel}
                                            onChange={(e) => setCompressionLevel(Number(e.target.value))}
                                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Filtros */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="font-semibold text-gray-700 mb-3">Filtros Avançados</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                                        {filters.map((filter) => (
                                            <button
                                                key={filter.id}
                                                onClick={() => aplicarFiltro(filter.id)}
                                                className={`p-2 rounded-lg border text-sm transition-all duration-200 ${currentFilter === filter.id
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {filter.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
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
                                                src={previewUrl}
                                                alt="Original"
                                                className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Edited */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Imagem Editada</h3>
                                    <div className="relative">
                                        <img
                                            src={editedImageUrl}
                                            alt="Edited"
                                            className="w-full h-64 object-cover rounded-xl border-2 border-green-200"
                                        />
                                        {appliedEdits.length > 0 && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                                {appliedEdits.length} edição{appliedEdits.length > 1 ? 'ões' : 'ão'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
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
                                <button
                                    onClick={aplicarNoAnuncio}
                                    disabled={isLoading}
                                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ImageIcon className="w-4 h-4" />
                                    )}
                                    Aplicar no Anúncio
                                </button>
                                <button
                                    onClick={salvarImagem}
                                    disabled={isLoading || appliedEdits.length === 0}
                                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4" />
                                    )}
                                    Salvar Imagem
                                </button>
                            </div>
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