import { api } from '@/config/api';
import { authService } from './authService';
import { getApiUrl } from '@/config/env';

export interface Produto {
  id: string;
  sku: string;
  nome: string;
  preco: number;
  estoque: number;
}

export interface ProdutoCreate {
  sku: string;
  nome: string;
  preco: number;
  estoque: number;
}

export interface ProdutoUpdate {
  sku?: string;
  nome?: string;
  preco?: number;
  estoque?: number;
}

export interface ProdutosList {
  data: Produto[];
  count: number;
}

export const produtoService = {
  /**
   * Lista todos os produtos
   */
  async listar(): Promise<ProdutosList> {
    try {
      console.log('📋 Listando produtos...');
      
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${getApiUrl()}/produtos`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar produtos: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ ${data.count} produtos carregados`);
      return data;
    } catch (error) {
      console.error('❌ Erro ao listar produtos:', error);
      throw error;
    }
  },

  /**
   * Obtém um produto por ID
   */
  async obterPorId(id: string): Promise<Produto> {
    try {
      console.log(`🔍 Buscando produto: ${id}`);
      
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${getApiUrl()}/produtos/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter produto: ${response.statusText}`);
      }

      const produto = await response.json();
      console.log(`✅ Produto encontrado: ${produto.nome}`);
      return produto;
    } catch (error) {
      console.error('❌ Erro ao obter produto:', error);
      throw error;
    }
  },

  /**
   * Cria um novo produto
   */
  async criar(produto: ProdutoCreate): Promise<Produto> {
    try {
      console.log('➕ Criando produto:', produto.nome);
      
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${getApiUrl()}/produtos`, {
        method: 'POST',
        headers,
        body: JSON.stringify(produto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao criar produto');
      }

      const novoProduto = await response.json();
      console.log(`✅ Produto criado: ${novoProduto.nome}`);
      return novoProduto;
    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      throw error;
    }
  },

  /**
   * Atualiza um produto existente
   */
  async atualizar(id: string, produto: ProdutoUpdate): Promise<Produto> {
    try {
      console.log(`✏️ Atualizando produto: ${id}`);
      
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${getApiUrl()}/produtos/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(produto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao atualizar produto');
      }

      const produtoAtualizado = await response.json();
      console.log(`✅ Produto atualizado: ${produtoAtualizado.nome}`);
      return produtoAtualizado;
    } catch (error) {
      console.error('❌ Erro ao atualizar produto:', error);
      throw error;
    }
  },

  /**
   * Remove um produto
   */
  async remover(id: string): Promise<void> {
    try {
      console.log(`🗑️ Removendo produto: ${id}`);
      
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${getApiUrl()}/produtos/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao remover produto');
      }

      console.log(`✅ Produto removido: ${id}`);
    } catch (error) {
      console.error('❌ Erro ao remover produto:', error);
      throw error;
    }
  },
}; 