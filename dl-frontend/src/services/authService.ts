import { api } from '@/config/api';
import { getApiUrl } from '@/config/env';
import { API_BASE } from '@/lib/api';

export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
}

export const authService = {
  /**
   * Realiza login no backend
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('🔐 Tentando login com:', credentials.username);
      
      // 1. A URL correta que o backend espera
      const url = `${API_BASE}/api/v1/auth/login`;

      // 2. O backend agora espera JSON com email e password
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: credentials.username, 
          password: credentials.password 
        }),
      });

      // 3. Tratamento de erro robusto
      if (!response.ok) {
        // Lança um erro se a resposta for 4xx ou 5xx
        const errorData = await response.json().catch(() => ({ error: 'Erro no login' }));
        throw new Error(`AUTH_FAIL_${response.status}: ${errorData.error || 'Erro no login'}`);
      }

      const apiResponse = await response.json();
      
      // 4. Validação da estrutura ApiResponse
      if (!apiResponse.ok || !apiResponse.data?.access_token) {
        throw new Error(apiResponse.error || 'Token inválido recebido do servidor');
      }

      console.log('✅ Login realizado com sucesso');
      return apiResponse.data;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  },

  /**
   * Testa se o token é válido
   */
  async testToken(token: string): Promise<User> {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/v1/login/test-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao testar token:', error);
      throw error;
    }
  },

  /**
   * Salva o token no localStorage
   */
  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      console.log('💾 Token salvo no localStorage');
    }
  },

  /**
   * Remove o token do localStorage
   */
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      console.log('🗑️ Token removido do localStorage');
    }
  },

  /**
   * Obtém o token do localStorage
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
}; 