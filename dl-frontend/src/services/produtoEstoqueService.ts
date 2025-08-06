import { api } from '@/config/api';

export interface ProdutoEstoque {
    id: number;
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
    categoria?: string;
    codigo?: string;
}

export const produtoEstoqueService = {
    // Buscar todos os produtos em estoque
    async getAll(): Promise<ProdutoEstoque[]> {
        try {
            const response = await api.get('/produtos/estoque');
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Erro ao buscar produtos em estoque:', error);
            throw error;
        }
    },

    // Buscar produto por ID
    async getById(id: number): Promise<ProdutoEstoque> {
        try {
            const response = await api.get(`/produtos/estoque/${id}`);
            return (response && typeof response === 'object' && 'id' in response) ? response as any : {} as ProdutoEstoque;
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            throw error;
        }
    },

    // Criar novo produto
    async create(produto: Omit<ProdutoEstoque, 'id'>): Promise<ProdutoEstoque> {
        try {
            const response = await api.post('/produtos/estoque', produto);
            return (response && typeof response === 'object' && 'id' in response) ? response as any : {} as ProdutoEstoque;
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }
    },

    // Atualizar produto
    async update(id: number, produto: Partial<ProdutoEstoque>): Promise<ProdutoEstoque> {
        try {
            const response = await api.put(`/produtos/estoque/${id}`, produto);
            return (response && typeof response === 'object' && 'id' in response) ? response as any : {} as ProdutoEstoque;
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            throw error;
        }
    },

    // Deletar produto
    async delete(id: number): Promise<void> {
        try {
            await api.delete(`/produtos/estoque/${id}`);
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            throw error;
        }
    },

    // Buscar produtos por categoria
    async getByCategoria(categoria: string): Promise<ProdutoEstoque[]> {
        try {
            const response = await api.get(`/produtos/estoque/categoria/${categoria}`);
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Erro ao buscar produtos por categoria:', error);
            throw error;
        }
    },

    // Buscar produtos com estoque baixo
    async getEstoqueBaixo(limite: number = 10): Promise<ProdutoEstoque[]> {
        try {
            const response = await api.get(`/produtos/estoque/baixo?limite=${limite}`);
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Erro ao buscar produtos com estoque baixo:', error);
            throw error;
        }
    },

    async search(termo: string): Promise<ProdutoEstoque[]> {
        try {
            const response = await api.get(`/produtos/estoque/search?q=${termo}`);
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }
};