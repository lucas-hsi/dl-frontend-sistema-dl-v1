// src/services/estoqueService.ts
// 🎯 SERVICE CENTRALIZADO - ÚNICA FONTE DE VERDADE PARA ESTOQUE
// Todas as operações de estoque devem passar por este service

import { API_CONFIG } from '@/config/api';

export interface ProdutoEstoque {
    id: number;
    sku: string;
    mlb_id?: string;
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
    imagem?: string;
    imagens?: string;
    permalink?: string;
    categoria?: string;
    origem?: string;
    status?: string;
    localizacao?: string;
    canal_origem?: string;
    criado_em?: string;
    atualizado_em?: string;
}

export interface EstatisticasEstoque {
    total_produtos: number;
    produtos_ml: number;
    produtos_disponiveis: number;
    produtos_vendidos: number;
    valor_total_estoque: number;
}

export interface EstoqueResponse {
    estatisticas: EstatisticasEstoque;
    produtos_recentes: ProdutoEstoque[];
    produtos_mais_caros: ProdutoEstoque[];
    produtos_mais_baratos: ProdutoEstoque[];
}

export interface BuscaEstoqueResponse {
    produtos: ProdutoEstoque[];
    total: number;
    termo_busca: string;
}

export interface AtualizacaoQuantidadeResponse {
    sucesso: boolean;
    mensagem: string;
    produto: {
        id: number;
        sku: string;
        nome: string;
        quantidade: number;
    };
}

export interface ReservaProdutoResponse {
    sucesso: boolean;
    mensagem: string;
}

export class EstoqueService {
    /**
     * 🎯 PONTO ÚNICO DE CONTROLE DO ESTOQUE
     * Todas as operações de estoque devem passar por este service
     */

    /**
     * Lista todos os produtos do estoque
     */
    static async listarProdutos(skip: number = 0, limit: number = 10000): Promise<ProdutoEstoque[]> {
        try {
            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/?skip=${skip}&limit=${limit}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro ao listar produtos: ${response.statusText}`);
            }

            const produtos = await response.json();
            console.log(`✅ ${produtos.length} produtos carregados do estoque centralizado`);
            return produtos;

        } catch (error) {
            console.error('❌ Erro ao listar produtos do estoque:', error);
            throw error;
        }
    }

    /**
     * Busca produtos por termo (nome, SKU, categoria)
     */
    static async buscarProdutosPorTermo(termo: string, limit: number = 50): Promise<ProdutoEstoque[]> {
        try {
            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/buscar/?termo=${encodeURIComponent(termo)}&limit=${limit}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
            }

            const resultado: BuscaEstoqueResponse = await response.json();
            console.log(`✅ ${resultado.total} produtos encontrados para "${termo}"`);
            return resultado.produtos;

        } catch (error) {
            console.error('❌ Erro ao buscar produtos por termo:', error);
            throw error;
        }
    }

    /**
     * Obtém um produto específico por SKU
     */
    static async obterProdutoPorSku(sku: string): Promise<ProdutoEstoque> {
        try {
            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/${encodeURIComponent(sku)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro ao obter produto: ${response.statusText}`);
            }

            const produto = await response.json();
            console.log(`✅ Produto encontrado: ${produto.sku} - ${produto.nome}`);
            return produto;

        } catch (error) {
            console.error('❌ Erro ao obter produto por SKU:', error);
            throw error;
        }
    }

    /**
     * Cria um novo produto no estoque
     */
    static async criarProduto(produto: Omit<ProdutoEstoque, 'id' | 'criado_em' | 'atualizado_em'>): Promise<ProdutoEstoque> {
        try {
            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produto)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro ao criar produto: ${response.statusText}`);
            }

            const novoProduto = await response.json();
            console.log(`✅ Produto criado: ${novoProduto.sku} - ${novoProduto.nome}`);
            return novoProduto;

        } catch (error) {
            console.error('❌ Erro ao criar produto:', error);
            throw error;
        }
    }

    /**
     * Atualiza um produto existente
     */
    static async atualizarProduto(produtoId: number, dados: Partial<ProdutoEstoque>): Promise<ProdutoEstoque> {
        try {
            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/${produtoId}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro ao atualizar produto: ${response.statusText}`);
            }

            const produtoAtualizado = await response.json();
            console.log(`✅ Produto atualizado: ${produtoAtualizado.sku}`);
            return produtoAtualizado;

        } catch (error) {
            console.error('❌ Erro ao atualizar produto:', error);
            throw error;
        }
    }

    /**
     * Atualiza apenas a quantidade de um produto
     */
    static async atualizarQuantidade(produtoId: number, novaQuantidade: number): Promise<AtualizacaoQuantidadeResponse> {
        try {
            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/atualizar-quantidade`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    produto_id: produtoId,
                    nova_quantidade: novaQuantidade
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro ao atualizar quantidade: ${response.statusText}`);
            }

            const resultado = await response.json();
            console.log(`✅ Quantidade atualizada: ${resultado.mensagem}`);
            return resultado;

        } catch (error) {
            console.error('❌ Erro ao atualizar quantidade:', error);
            throw error;
        }
    }

    /**
     * Reserva quantidade de um produto (diminui estoque)
     */
    static async reservarProduto(produtoId: number, quantidade: number): Promise<ReservaProdutoResponse> {
        try {
            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/reservar`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    produto_id: produtoId,
                    quantidade: quantidade
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro ao reservar produto: ${response.statusText}`);
            }

            const resultado = await response.json();
            console.log(`✅ Produto reservado: ${resultado.mensagem}`);
            return resultado;

        } catch (error) {
            console.error('❌ Erro ao reservar produto:', error);
            throw error;
        }
    }

    /**
     * Libera quantidade de um produto (aumenta estoque)
     */
    static async liberarProduto(produtoId: number, quantidade: number): Promise<ReservaProdutoResponse> {
        try {
            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/liberar`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    produto_id: produtoId,
                    quantidade: quantidade
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro ao liberar produto: ${response.statusText}`);
            }

            const resultado = await response.json();
            console.log(`✅ Produto liberado: ${resultado.mensagem}`);
            return resultado;

        } catch (error) {
            console.error('❌ Erro ao liberar produto:', error);
            throw error;
        }
    }

    /**
     * Deleta um produto do estoque
     */
    static async deletarProduto(produtoId: number): Promise<void> {
        try {
            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/${produtoId}`;
            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro ao deletar produto: ${response.statusText}`);
            }

            console.log(`✅ Produto deletado com sucesso`);

        } catch (error) {
            console.error('❌ Erro ao deletar produto:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas do estoque
     */
    static async obterEstatisticas(): Promise<EstatisticasEstoque> {
        try {
            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/stats/estatisticas`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro ao obter estatísticas: ${response.statusText}`);
            }

            const stats = await response.json();
            console.log(`✅ Estatísticas carregadas: ${stats.total_produtos} produtos`);
            return stats;

        } catch (error) {
            console.error('❌ Erro ao obter estatísticas:', error);
            throw error;
        }
    }

    /**
     * Sincroniza estoque com canais externos
     */
    static async sincronizarEstoqueExterno(): Promise<any> {
        try {
            console.log('🔄 Iniciando sincronização de estoque externo...');

            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/sincronizar`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Erro na sincronização: ${response.statusText}`);
            }

            const resultado = await response.json();
            console.log('✅ Sincronização concluída:', resultado);
            return resultado;

        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            throw error;
        }
    }

    /**
     * Importa produtos do Mercado Livre para o estoque
     */
    static async importarProdutosML(): Promise<any> {
        try {
            console.log('🔄 Iniciando importação de produtos do ML...');

            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/importar-ml`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Erro na importação: ${response.statusText}`);
            }

            const resultado = await response.json();
            console.log('✅ Importação concluída:', resultado);
            return resultado;

        } catch (error) {
            console.error('❌ Erro na importação:', error);
            throw error;
        }
    }

    /**
     * Importa TODOS os produtos do ML (paginação completa)
     */
    static async importarTodosProdutosML(batchSize: number = 50): Promise<any> {
        try {
            console.log(`🚀 Iniciando importação completa de produtos ML (batch_size=${batchSize})...`);

            const url = `${API_CONFIG.BASE_URL}/produtos-estoque/importar-todos-ml?batch_size=${batchSize}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Erro na importação completa: ${response.statusText}`);
            }

            const resultado = await response.json();
            console.log('✅ Importação completa concluída:', resultado);
            return resultado;

        } catch (error) {
            console.error('❌ Erro na importação completa:', error);
            throw error;
        }
    }

    /**
     * Carrega dados completos do estoque (estatísticas + produtos)
     */
    static async carregarEstoqueCompleto(): Promise<EstoqueResponse> {
        try {
            console.log('🔄 Carregando dados completos do estoque...');

            // Buscar produtos e estatísticas em paralelo
            const [produtos, estatisticas] = await Promise.all([
                this.listarProdutos(),
                this.obterEstatisticas()
            ]);

            // Organizar produtos por categorias
            const produtos_recentes = produtos.slice(0, 10); // 10 mais recentes
            const produtos_mais_caros = this.ordenarPorPreco(produtos, 'desc').slice(0, 5);
            const produtos_mais_baratos = this.ordenarPorPreco(produtos, 'asc').slice(0, 5);

            const resultado: EstoqueResponse = {
                estatisticas,
                produtos_recentes,
                produtos_mais_caros,
                produtos_mais_baratos
            };

            console.log('✅ Estoque completo carregado:', resultado.estatisticas);
            return resultado;

        } catch (error) {
            console.error('❌ Erro ao carregar estoque completo:', error);
            throw error;
        }
    }

    /**
     * Formata produto para uso no sistema
     */
    static formatarProdutoParaSistema(produto: ProdutoEstoque) {
        return {
            id_produto_tiny: produto.sku,
            sku: produto.sku,
            nome_produto: produto.nome,
            quantidade_disponivel: produto.quantidade,
            preco_unitario: produto.preco,
            unidade: 'UN',
            categoria: produto.categoria || 'Geral',
            imagem: produto.imagem,
            permalink: produto.permalink
        };
    }

    /**
     * Ordena produtos por preço
     */
    private static ordenarPorPreco(produtos: ProdutoEstoque[], ordem: 'asc' | 'desc'): ProdutoEstoque[] {
        return [...produtos].sort((a, b) => {
            if (ordem === 'desc') {
                return b.preco - a.preco;
            } else {
                return a.preco - b.preco;
            }
        });
    }
}