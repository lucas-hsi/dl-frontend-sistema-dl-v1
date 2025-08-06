// Utilitários para chamadas de API seguras
// Centraliza o tratamento de erros e validação de respostas

import React from 'react';
import { API_CONFIG } from '@/config/api';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    fallback?: T;
}

/**
 * Função segura para fazer chamadas de API com tratamento de erro completo
 */
export async function safeApiCall<T>(
    url: string,
    options: RequestInit = {},
    fallbackData?: T
): Promise<ApiResponse<T>> {
    try {
        // [SEGURANÇA] Construir URL completa se for relativa
        const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;

        console.log(`🔍 Fazendo chamada para: ${fullUrl}`);

        const response = await fetch(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        // [SEGURANÇA] Verificar se a resposta é válida
        if (!response.ok) {
            console.warn(`⚠️ Erro HTTP: ${response.status} ${response.statusText}`);
            throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }

        // [SEGURANÇA] Verificar se o conteúdo é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.warn('⚠️ Resposta não é JSON:', contentType);
            console.warn('📄 Conteúdo da resposta:', await response.text());

            if (fallbackData) {
                return {
                    success: false,
                    error: 'Resposta não é JSON válido',
                    fallback: fallbackData,
                    data: fallbackData
                };
            }

            throw new Error('Resposta não é JSON válido');
        }

        const data = await response.json();

        console.log(`✅ Resposta recebida de: ${fullUrl}`, data);

        return {
            success: true,
            data
        };

    } catch (error) {
        console.error(`❌ Erro na chamada para ${url}:`, error);

        if (fallbackData) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
                fallback: fallbackData,
                data: fallbackData
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        };
    }
}

/**
 * Função para verificar se o backend está disponível
 */
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.ok;
    } catch (error) {
        console.error('❌ Backend não está disponível:', error);
        return false;
    }
}

/**
 * Função para fazer chamadas GET seguras
 */
export async function safeGet<T>(
    endpoint: string,
    fallbackData?: T
): Promise<ApiResponse<T>> {
    return safeApiCall<T>(endpoint, { method: 'GET' }, fallbackData);
}

/**
 * Função para fazer chamadas POST seguras
 */
export async function safePost<T>(
    endpoint: string,
    body: any,
    fallbackData?: T
): Promise<ApiResponse<T>> {
    return safeApiCall<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    }, fallbackData);
}

/**
 * Função para fazer chamadas PUT seguras
 */
export async function safePut<T>(
    endpoint: string,
    body: any,
    fallbackData?: T
): Promise<ApiResponse<T>> {
    return safeApiCall<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    }, fallbackData);
}

/**
 * Função para fazer chamadas DELETE seguras
 */
export async function safeDelete<T>(
    endpoint: string,
    fallbackData?: T
): Promise<ApiResponse<T>> {
    return safeApiCall<T>(endpoint, { method: 'DELETE' }, fallbackData);
}

/**
 * Hook para usar dados de API com fallback automático
 */
export function useApiData<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    fallbackData: T
) {
    const [data, setData] = React.useState<T>(fallbackData);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const result = await apiCall();

            if (result.success && result.data) {
                setData(result.data);
            } else if (result.fallback) {
                setData(result.fallback);
                if (result.error) {
                    setError(result.error);
                }
            } else {
                setError(result.error || 'Erro desconhecido');
            }

            setLoading(false);
        };

        fetchData();
    }, [apiCall]);

    return { data, loading, error };
} 