// ARQUIVO: dl-frontend/src/config/api.ts
// Esta é a versão final que exporta tanto a instância 'api' quanto o objeto 'API_CONFIG'.

import axios from 'axios';
import { getApiUrl } from './env';

// Obtém a URL da nossa fonte única de verdade (ex: http://127.0.0.1:8000).
const apiUrl = getApiUrl();

// 1. Exporta o objeto de configuração para compatibilidade.
export const API_CONFIG = {
  BASE_URL: apiUrl,
  TIMEOUT: 30000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// 2. Exporta a instância do Axios com a CORREÇÃO APLICADA.
export const api = axios.create({
  // --- CORREÇÃO APLICADA AQUI ---
  // Adicionamos o prefixo /api/v1 que estava faltando. Agora todas as chamadas
  // feitas com 'api.get(...)' irão para o endereço correto.
  baseURL: `${apiUrl}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação a cada requisição.
api.interceptors.request.use((config) => {
  // Acessa o token do localStorage apenas no lado do cliente.
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('dl.auth.token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
