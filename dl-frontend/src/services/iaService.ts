/**
 * 🧠 IA Service - Integração com IA OpenManus
 * 
 * Serviço para consumir os endpoints de inteligência artificial
 * do backend e integrar com os painéis do frontend.
 * 
 * Autor: DL Auto Peças
 * Versão: 1.0.0
 */

import { API_CONFIG } from '@/config/api';

// Interfaces para a IA
export interface IAInsight {
    type: 'previsao' | 'recomendacao' | 'alerta' | 'analise';
    title: string;
    description: string;
    value: string | number;
    confidence: number;
    impact: 'alto' | 'medio' | 'baixo';
    action?: string;
    data?: any;
}

export interface IARecommendation {
    id: string;
    type: 'preco' | 'estoque' | 'marketing' | 'vendas';
    title: string;
    description: string;
    impact: 'alto' | 'medio' | 'baixo';
    confidence: number;
    reason: string;
    suggestedAction: string;
    estimatedValue?: number;
}

export interface IAAnalysis {
    periodo: string;
    vendas: number;
    crescimento: number;
    produtosTop: string[];
    vendedorTop: string;
    canalTop: string;
    insights: IAInsight[];
    recomendacoes: IARecommendation[];
}

export interface IAAnuncioRequest {
    produto: {
        nome: string;
        preco: number;
        descricao?: string;
    };
    categoria?: string;
    canal?: string;
}

export interface IAAnuncioResponse {
    success: boolean;
    anuncio: {
        title: string;
        description: string;
        keywords: string[];
        compatibility: string;
        highlights: string[];
    };
    produto: string;
    timestamp: string;
}

export interface IAAtendimentoRequest {
    mensagem: string;
    cliente: {
        nome: string;
        telefone?: string;
    };
    historico?: any[];
    estoque?: any[];
}

export interface IAAtendimentoResponse {
    success: boolean;
    resposta: string;
    classificacao: 'quente' | 'morno' | 'frio';
    sugestoes: string[];
    proximaAcao: string;
}

export interface IAOrcamentoRequest {
    cliente: {
        nome: string;
        telefone?: string;
    };
    produtos: Array<{
        nome: string;
        preco: number;
        quantidade: number;
    }>;
    endereco?: {
        cidade: string;
        estado: string;
        cep?: string;
    };
    carro?: {
        modelo: string;
        ano: string;
    };
}

export interface IAOrcamentoResponse {
    success: boolean;
    orcamento: {
        total: number;
        frete: number;
        prazo: string;
        observacoes: string[];
        complementos: string[];
    };
    sugestoes: string[];
}

// [REAL-ESRGAN 2025] Interface para escalonamento de imagem
export interface EscalarImagemResponse {
    success: boolean;
    imagem: Blob;
    tamanhoOriginal: string;
    tamanhoFinal: string;
    qualidade: number;
}

export interface RemoverFundoResponse {
    success: boolean;
    imagem: Blob;
    filename: string;
    tamanhoOriginal: string;
    tamanhoFinal: string;
}

export interface TratarImagemResponse {
    success: boolean;
    imagem: Blob;
    filename: string;
    tamanhoOriginal: string;
    tamanhoFinal: string;
    qualidade: number;
}

import axios from 'axios';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

class IAService {
    private baseUrl = '/ia';

    // Status da IA
    async getStatus() {
        try {
            const response = await api.get(`${this.baseUrl}/status`);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter status da IA:', error);
            return { success: false, message: 'IA não disponível' };
        }
    }

    // Logs da IA
    async getLogs(limit = 50) {
        try {
            const response = await api.get(`${this.baseUrl}/logs`, {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao obter logs da IA:', error);
            return { success: false, logs: [] };
        }
    }

    // Teste de conexão
    async testConnection() {
        try {
            const response = await api.post(`${this.baseUrl}/test`);
            return response.data;
        } catch (error) {
            console.error('Erro no teste de conexão da IA:', error);
            return { success: false, message: 'Falha na conexão' };
        }
    }

    // Análise para o gestor
    async analisarDados(dados: any, periodo: string): Promise<IAAnalysis> {
        try {
            const response = await api.post(`${this.baseUrl}/gestor/analisar`, {
                dados, periodo
            });
            return response.data;
        } catch (error) {
            console.error('Erro na análise da IA:', error);
            // Retorna dados mockados em caso de erro
            return this.getMockAnalysis();
        }
    }

    // Relatório inteligente
    async gerarRelatorio(dados: any, tipo: string) {
        try {
            const response = await api.post(`${this.baseUrl}/gestor/relatorio`, {
                dados, tipo
            });
            return response.data;
        } catch (error) {
            console.error('Erro na geração de relatório da IA:', error);
            return { success: false, message: 'Erro na geração do relatório' };
        }
    }

    // Geração de anúncios
    async gerarAnuncio(request: IAAnuncioRequest): Promise<IAAnuncioResponse> {
        try {
            const response = await api.post(`${this.baseUrl}/anuncios/gerar`, request);
            return response.data;
        } catch (error) {
            console.error('Erro na geração de anúncio da IA:', error);
            return {
                success: false,
                anuncio: {
                    title: request.produto.nome,
                    description: 'Descrição padrão',
                    keywords: [],
                    compatibility: 'Verificar compatibilidade',
                    highlights: []
                },
                produto: request.produto.nome,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Diagnóstico de anúncio
    async diagnosticarAnuncio(anuncio: any) {
        try {
            const response = await api.post(`${this.baseUrl}/anuncios/diagnosticar`, anuncio);
            return response.data;
        } catch (error) {
            console.error('Erro no diagnóstico de anúncio da IA:', error);
            return { success: false, message: 'Erro no diagnóstico' };
        }
    }

    // Atendimento automático
    async responderAtendimento(request: IAAtendimentoRequest): Promise<IAAtendimentoResponse> {
        try {
            const response = await api.post(`${this.baseUrl}/atendimento/responder`, request);
            return response.data;
        } catch (error) {
            console.error('Erro no atendimento da IA:', error);
            return {
                success: false,
                resposta: 'Obrigado pelo contato! Em breve retornaremos.',
                classificacao: 'morno',
                sugestoes: [],
                proximaAcao: 'Contato manual necessário'
            };
        }
    }

    // Classificação de leads
    async classificarLead(mensagem: string, dadosCliente: any) {
        try {
            const response = await api.post(`${this.baseUrl}/atendimento/classificar`, {
                mensagem, cliente: dadosCliente
            });
            return response.data;
        } catch (error) {
            console.error('Erro na classificação de lead da IA:', error);
            return { success: false, classificacao: 'morno' };
        }
    }

    // Geração de orçamentos
    async gerarOrcamento(request: IAOrcamentoRequest): Promise<IAOrcamentoResponse> {
        try {
            const response = await api.post(`${this.baseUrl}/orcamentos/gerar`, request);
            return response.data;
        } catch (error) {
            console.error('Erro na geração de orçamento da IA:', error);
            return {
                success: false,
                orcamento: {
                    total: request.produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0),
                    frete: 0,
                    prazo: '3-5 dias úteis',
                    observacoes: ['Orçamento gerado automaticamente'],
                    complementos: []
                },
                sugestoes: []
            };
        }
    }

    // Cálculo de frete
    async calcularFrete(endereco: any, produtos: any[]) {
        try {
            const response = await fetch(`${this.baseUrl}/orcamentos/frete`, {
                method: 'POST',
                headers: API_CONFIG.DEFAULT_HEADERS,
                body: JSON.stringify({ endereco, produtos })
            });
            return await response.json();
        } catch (error) {
            console.error('Erro no cálculo de frete da IA:', error);
            return { success: false, frete: 0, prazo: '3-5 dias úteis' };
        }
    }

    // [REAL-ESRGAN 2025] Escalonamento de imagem com IA
    async escalarImagem(file: File): Promise<EscalarImagemResponse> {
        try {
            console.log('🖼️ Iniciando escalonamento de imagem:', file.name);

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_CONFIG.BASE_URL}/ia/escalar-imagem`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erro ao escalar imagem: ${response.status}`);
            }

            const imagemBlob = await response.blob();
            const tamanhoOriginal = `${file.size} bytes`;
            const tamanhoFinal = `${imagemBlob.size} bytes`;
            const qualidade = Math.round((imagemBlob.size / file.size) * 100);

            console.log('✅ Imagem escalada com sucesso:', {
                original: tamanhoOriginal,
                final: tamanhoFinal,
                qualidade
            });

            return {
                success: true,
                imagem: imagemBlob,
                tamanhoOriginal,
                tamanhoFinal,
                qualidade
            };
        } catch (error) {
            console.error('❌ Erro no escalonamento de imagem:', error);
            return {
                success: false,
                imagem: file,
                tamanhoOriginal: `${file.size} bytes`,
                tamanhoFinal: `${file.size} bytes`,
                qualidade: 0
            };
        }
    }

    // [REMBG 2025] Remoção de fundo com rembg
    async removerFundo(file: File): Promise<RemoverFundoResponse> {
        try {
            console.log('🔄 Iniciando remoção de fundo:', file.name);

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_CONFIG.BASE_URL}/ia/remover-fundo`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erro ao remover fundo: ${response.status}`);
            }

            const imagemBlob = await response.blob();
            const tamanhoOriginal = `${file.size} bytes`;
            const tamanhoFinal = `${imagemBlob.size} bytes`;

            console.log('✅ Fundo removido com sucesso:', {
                filename: file.name,
                original: tamanhoOriginal,
                final: tamanhoFinal
            });

            return {
                success: true,
                imagem: imagemBlob,
                filename: file.name,
                tamanhoOriginal,
                tamanhoFinal
            };
        } catch (error) {
            console.error('❌ Erro na remoção de fundo:', error);
            return {
                success: false,
                imagem: file,
                filename: file.name,
                tamanhoOriginal: `${file.size} bytes`,
                tamanhoFinal: `${file.size} bytes`
            };
        }
    }

    // [REMBG 2025] Remoção de fundo de múltiplas imagens
    async removerFundoMultiplas(files: File[]): Promise<RemoverFundoResponse[]> {
        try {
            console.log('🔄 Iniciando remoção de fundo de múltiplas imagens:', files.length);

            const formData = new FormData();
            files.forEach(file => {
                formData.append("files", file);
            });

            const response = await fetch(`${API_CONFIG.BASE_URL}/ia/remover-fundo-multiplas`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erro ao remover fundos: ${response.status}`);
            }

            const resultado = await response.json();
            const resultados: RemoverFundoResponse[] = [];

            resultado.resultados.forEach((item: any) => {
                if (item.success) {
                    const blob = new Blob([item.content], { type: 'image/png' });
                    resultados.push({
                        success: true,
                        imagem: blob,
                        filename: item.filename,
                        tamanhoOriginal: `${files.find(f => f.name === item.filename)?.size || 0} bytes`,
                        tamanhoFinal: `${blob.size} bytes`
                    });
                } else {
                    const originalFile = files.find(f => f.name === item.filename);
                    resultados.push({
                        success: false,
                        imagem: originalFile || new Blob(),
                        filename: item.filename,
                        tamanhoOriginal: `${originalFile?.size || 0} bytes`,
                        tamanhoFinal: `${originalFile?.size || 0} bytes`
                    });
                }
            });

            console.log('✅ Fundos removidos com sucesso:', resultados.length);
            return resultados;
        } catch (error) {
            console.error('❌ Erro na remoção de fundos múltiplos:', error);
            return files.map(file => ({
                success: false,
                imagem: file,
                filename: file.name,
                tamanhoOriginal: `${file.size} bytes`,
                tamanhoFinal: `${file.size} bytes`
            }));
        }
    }

    // [TRATAMENTO COMPLETO 2025] Remoção de fundo + Super resolução
    async tratarImagemComIA(file: File): Promise<TratarImagemResponse> {
        try {
            console.log('🔄 Iniciando tratamento completo da imagem:', file.name);

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_CONFIG.BASE_URL}/ia/tratar-imagem`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erro ao tratar imagem: ${response.status}`);
            }

            const imagemBlob = await response.blob();
            const tamanhoOriginal = `${file.size} bytes`;
            const tamanhoFinal = `${imagemBlob.size} bytes`;
            const qualidade = Math.round((imagemBlob.size / file.size) * 100);

            console.log('✅ Tratamento completo finalizado:', {
                filename: file.name,
                original: tamanhoOriginal,
                final: tamanhoFinal,
                qualidade
            });

            return {
                success: true,
                imagem: imagemBlob,
                filename: file.name,
                tamanhoOriginal,
                tamanhoFinal,
                qualidade
            };
        } catch (error) {
            console.error('❌ Erro no tratamento completo da imagem:', error);
            return {
                success: false,
                imagem: file,
                filename: file.name,
                tamanhoOriginal: `${file.size} bytes`,
                tamanhoFinal: `${file.size} bytes`,
                qualidade: 0
            };
        }
    }

    // [TRATAMENTO COMPLETO 2025] Tratamento de múltiplas imagens
    async tratarImagensMultiplas(files: File[]): Promise<TratarImagemResponse[]> {
        try {
            console.log('🔄 Iniciando tratamento completo de múltiplas imagens:', files.length);

            const resultados: TratarImagemResponse[] = [];

            for (const file of files) {
                try {
                    const resultado = await this.tratarImagemComIA(file);
                    resultados.push(resultado);
                } catch (error) {
                    console.error(`❌ Erro ao tratar imagem ${file.name}:`, error);
                    resultados.push({
                        success: false,
                        imagem: file,
                        filename: file.name,
                        tamanhoOriginal: `${file.size} bytes`,
                        tamanhoFinal: `${file.size} bytes`,
                        qualidade: 0
                    });
                }
            }

            console.log('✅ Tratamento completo finalizado:', resultados.length);
            return resultados;
        } catch (error) {
            console.error('❌ Erro no tratamento de múltiplas imagens:', error);
            return files.map(file => ({
                success: false,
                imagem: file,
                filename: file.name,
                tamanhoOriginal: `${file.size} bytes`,
                tamanhoFinal: `${file.size} bytes`,
                qualidade: 0
            }));
        }
    }

    // Dados mockados para fallback
    private getMockAnalysis(): IAAnalysis {
        return {
            periodo: 'Janeiro 2025',
            vendas: 150,
            crescimento: 12.5,
            produtosTop: ['Amortecedores', 'Pastilhas', 'Filtros'],
            vendedorTop: 'João Silva',
            canalTop: 'Balcão',
            insights: [
                {
                    type: 'previsao',
                    title: 'Previsão de Vendas',
                    description: 'Crescimento esperado nos próximos 30 dias',
                    value: '+23%',
                    confidence: 85,
                    impact: 'alto'
                },
                {
                    type: 'recomendacao',
                    title: 'Produtos em Alta',
                    description: 'Pastilhas de frete com demanda crescente',
                    value: 'Pastilhas',
                    confidence: 92,
                    impact: 'medio'
                }
            ],
            recomendacoes: [
                {
                    id: '1',
                    type: 'preco',
                    title: 'Aumentar preço das pastilhas Bosch em 8%',
                    description: 'Demanda alta e baixa concorrência',
                    impact: 'alto',
                    confidence: 94,
                    reason: 'Análise de mercado e concorrência',
                    suggestedAction: 'Revisar preços das pastilhas Bosch',
                    estimatedValue: 15000
                },
                {
                    id: '2',
                    type: 'estoque',
                    title: 'Reabastecer filtros de óleo Mahle',
                    description: 'Estoque crítico com vendas crescentes',
                    impact: 'medio',
                    confidence: 87,
                    reason: 'Estoque baixo e demanda alta',
                    suggestedAction: 'Fazer pedido de filtros Mahle',
                    estimatedValue: 8000
                }
            ]
        };
    }
}

// Exportar instância única do serviço
export const iaService = new IAService();

// Também exportar a classe para casos especiais
export { IAService };

