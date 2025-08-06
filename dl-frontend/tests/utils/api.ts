import { testCredentials } from '../fixtures/data';

export class ApiCleanup {
  private static baseUrl = 'http://127.0.0.1:8000/api/v1';
  private static token: string | null = null;

  static async getToken(): Promise<string> {
    if (this.token) return this.token;

    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testCredentials.email,
        password: testCredentials.senha,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao obter token para limpeza');
    }

    const apiResponse = await response.json();
    if (!apiResponse.ok || !apiResponse.data?.access_token) {
      throw new Error('Token inválido recebido do servidor');
    }
    
    this.token = apiResponse.data.access_token;
    return this.token || '';
  }

  static async cleanupProduct(sku: string): Promise<void> {
    try {
      const token = await this.getToken();
      
      // Buscar produto pelo SKU
      const searchResponse = await fetch(`${this.baseUrl}/produtos-estoque/?sku=${sku}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (searchResponse.ok) {
        const products = await searchResponse.json();
        if (products.length > 0) {
          const productId = products[0].id;
          
          // Deletar produto
          await fetch(`${this.baseUrl}/produtos-estoque/${productId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          console.log(`🧹 Produto ${sku} removido durante limpeza`);
        }
      }
    } catch (error) {
      console.log(`⚠️ Erro durante limpeza do produto ${sku}:`, error);
    }
  }

  static async cleanupTestProducts(): Promise<void> {
    try {
      const token = await this.getToken();
      
      // Buscar produtos de teste
      const response = await fetch(`${this.baseUrl}/produtos-estoque/?nome=Produto Teste`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const products = await response.json();
        for (const product of products) {
          await fetch(`${this.baseUrl}/produtos-estoque/${product.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        }
        
        if (products.length > 0) {
          console.log(`🧹 ${products.length} produtos de teste removidos`);
        }
      }
    } catch (error) {
      console.log('⚠️ Erro durante limpeza de produtos de teste:', error);
    }
  }
} 