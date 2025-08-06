/**
 * Utilitários para o Editor de Imagens
 */

export interface ImageEdit {
    id: string;
    name: string;
    applied: boolean;
    value?: number;
}

export interface EditHistory {
    id: string;
    type: string;
    data: any;
    timestamp: number;
}

export interface FilterOption {
    id: string;
    name: string;
    filter: string;
}

export interface EditOption {
    id: string;
    name: string;
    icon: any;
    color: string;
}

export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Aplica ajuste de brilho na imagem
 */
export const applyBrightness = (
    imageData: ImageData,
    brightness: number
): ImageData => {
    const data = imageData.data;
    const factor = brightness / 100;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * factor); // Red
        data[i + 1] = Math.min(255, data[i + 1] * factor); // Green
        data[i + 2] = Math.min(255, data[i + 2] * factor); // Blue
    }

    return imageData;
};

/**
 * Aplica ajuste de contraste na imagem
 */
export const applyContrast = (
    imageData: ImageData,
    contrast: number
): ImageData => {
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }

    return imageData;
};

/**
 * Aplica ajuste de saturação na imagem
 */
export const applySaturation = (
    imageData: ImageData,
    saturation: number
): ImageData => {
    const data = imageData.data;
    const factor = saturation / 100;

    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = Math.min(255, Math.max(0, gray + factor * (data[i] - gray)));
        data[i + 1] = Math.min(255, Math.max(0, gray + factor * (data[i + 1] - gray)));
        data[i + 2] = Math.min(255, Math.max(0, gray + factor * (data[i + 2] - gray)));
    }

    return imageData;
};

/**
 * Aplica filtro de nitidez na imagem
 */
export const applySharpen = (imageData: ImageData): ImageData => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Kernel de nitidez
    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ];

    const tempData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                        sum += tempData[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
                    }
                }
                const idx = (y * width + x) * 4 + c;
                data[idx] = Math.min(255, Math.max(0, sum));
            }
        }
    }

    return imageData;
};

/**
 * Redimensiona imagem mantendo proporção
 */
export const resizeImage = (
    canvas: HTMLCanvasElement,
    scale: number
): void => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = canvas.width * scale;
    tempCanvas.height = canvas.height * scale;

    tempCtx?.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.drawImage(tempCanvas, 0, 0);
};

/**
 * Rotaciona imagem
 */
export const rotateImage = (
    canvas: HTMLCanvasElement,
    degrees: number
): void => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.drawImage(canvas, -centerX, -centerY);
    ctx.restore();
};

/**
 * Corta imagem baseado na área selecionada
 */
export const cropImage = (
    canvas: HTMLCanvasElement,
    cropArea: CropArea
): void => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
};

/**
 * Aplica melhorias com IA simuladas
 */
export const applyAiEnhancement = (imageData: ImageData): ImageData => {
    const data = imageData.data;

    // Melhorar contraste e nitidez
    for (let i = 0; i < data.length; i += 4) {
        // Aumentar contraste
        const factor = 1.2;
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));

        // Melhorar saturação
        const saturation = 1.1;
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = Math.min(255, Math.max(0, gray + saturation * (data[i] - gray)));
        data[i + 1] = Math.min(255, Math.max(0, gray + saturation * (data[i + 1] - gray)));
        data[i + 2] = Math.min(255, Math.max(0, gray + saturation * (data[i + 2] - gray)));
    }

    return imageData;
};

/**
 * Comprime imagem com qualidade especificada
 */
export const compressImage = (
    canvas: HTMLCanvasElement,
    quality: number
): string => {
    return canvas.toDataURL('image/png', quality);
};

/**
 * Desenha imagem no canvas a partir de data URL
 */
export const drawFromDataURL = (
    canvas: HTMLCanvasElement,
    dataUrl: string,
    onComplete?: () => void
): void => {
    const img = new Image();
    img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            onComplete?.();
        }
    };
    img.src = dataUrl;
};

/**
 * Gera nome de arquivo único para download
 */
export const generateFileName = (prefix: string = 'imagem'): string => {
    const timestamp = Date.now();
    return `${prefix}-${timestamp}.png`;
};

/**
 * Valida se arquivo é uma imagem
 */
export const isValidImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
};

/**
 * Converte tamanho de arquivo para KB
 */
export const formatFileSize = (bytes: number): string => {
    const kb = Math.round(bytes / 1024);
    return `${kb}KB`;
};

/**
 * Calcula tamanho do arquivo em bytes
 */
export const calculateFileSize = (dataUrl: string): number => {
    const base64 = dataUrl.split(',')[1];
    const binaryString = atob(base64);
    return binaryString.length;
};

/**
 * Opções de filtros disponíveis (incluindo avançados)
 */
export const FILTER_OPTIONS: FilterOption[] = [
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

/**
 * Opções de edição disponíveis
 */
export const EDIT_OPTIONS: EditOption[] = [
    { id: 'cortar', name: 'Cortar', icon: null, color: 'bg-blue-500' },
    { id: 'redimensionar', name: 'Redimensionar', icon: null, color: 'bg-green-500' },
    { id: 'girar', name: 'Girar', icon: null, color: 'bg-purple-500' },
    { id: 'nitidez', name: 'Nitidez', icon: null, color: 'bg-orange-500' },
    { id: 'brilho', name: 'Brilho', icon: null, color: 'bg-yellow-500' },
    { id: 'contraste', name: 'Contraste', icon: null, color: 'bg-indigo-500' },
    { id: 'saturacao', name: 'Saturação', icon: null, color: 'bg-pink-500' },
    { id: 'filtros', name: 'Filtros', icon: null, color: 'bg-red-500' },
    { id: 'ia', name: 'IA Enhancement', icon: null, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
];

/**
 * Gerenciador de histórico de edições
 */
export class EditHistoryManager {
    private history: string[] = [];
    private currentIndex: number = -1;

    /**
     * Adiciona estado atual ao histórico
     */
    pushState(dataUrl: string): void {
        this.history = [...this.history.slice(0, this.currentIndex + 1), dataUrl];
        this.currentIndex = this.history.length - 1;
    }

    /**
     * Verifica se pode desfazer
     */
    canUndo(): boolean {
        return this.currentIndex > 0;
    }

    /**
     * Verifica se há mudanças
     */
    hasChanges(): boolean {
        return this.currentIndex > 0;
    }

    /**
     * Desfaz última edição
     */
    undo(): string | null {
        if (!this.canUndo()) return null;

        this.currentIndex--;
        return this.history[this.currentIndex];
    }

    /**
     * Reverte para estado original
     */
    reset(): string | null {
        if (!this.hasChanges()) return null;

        this.currentIndex = 0;
        return this.history[0];
    }

    /**
     * Obtém estado atual
     */
    getCurrentState(): string | null {
        return this.currentIndex >= 0 ? this.history[this.currentIndex] : null;
    }

    /**
     * Limpa histórico
     */
    clear(): void {
        this.history = [];
        this.currentIndex = -1;
    }

    /**
     * Obtém tamanho do histórico
     */
    getHistorySize(): number {
        return this.history.length;
    }

    /**
     * Obtém índice atual
     */
    getCurrentIndex(): number {
        return this.currentIndex;
    }
}

/**
 * Gerenciador de atalhos de teclado
 */
export class KeyboardShortcutsManager {
    private handlers: Map<string, () => void> = new Map();

    /**
     * Registra um atalho
     */
    register(key: string, handler: () => void): void {
        this.handlers.set(key, handler);
    }

    /**
     * Remove um atalho
     */
    unregister(key: string): void {
        this.handlers.delete(key);
    }

    /**
     * Processa evento de teclado
     */
    handleKeyDown(event: KeyboardEvent): void {
        const key = this.getKeyString(event);
        const handler = this.handlers.get(key);

        if (handler) {
            event.preventDefault();
            handler();
        }
    }

    /**
     * Gera string de identificação da tecla
     */
    private getKeyString(event: KeyboardEvent): string {
        const parts = [];

        if (event.ctrlKey) parts.push('ctrl');
        if (event.shiftKey) parts.push('shift');
        if (event.altKey) parts.push('alt');
        if (event.metaKey) parts.push('meta');

        parts.push(event.key.toLowerCase());

        return parts.join('+');
    }

    /**
     * Limpa todos os atalhos
     */
    clear(): void {
        this.handlers.clear();
    }
}

/**
 * Gerenciador de compressão automática
 */
export class CompressionManager {
    private autoCompress: boolean = true;
    private compressionLevel: number = 0.8;

    /**
     * Define se deve comprimir automaticamente
     */
    setAutoCompress(enabled: boolean): void {
        this.autoCompress = enabled;
    }

    /**
     * Define nível de compressão
     */
    setCompressionLevel(level: number): void {
        this.compressionLevel = Math.max(0.1, Math.min(1, level));
    }

    /**
     * Comprime imagem se auto-compressão estiver ativada
     */
    compressIfNeeded(canvas: HTMLCanvasElement): string {
        if (this.autoCompress) {
            return canvas.toDataURL('image/png', this.compressionLevel);
        }
        return canvas.toDataURL('image/png');
    }

    /**
     * Obtém configuração atual
     */
    getConfig(): { autoCompress: boolean; compressionLevel: number } {
        return {
            autoCompress: this.autoCompress,
            compressionLevel: this.compressionLevel
        };
    }
} 