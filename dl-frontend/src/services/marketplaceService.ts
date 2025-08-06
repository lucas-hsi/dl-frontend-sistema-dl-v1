import { API_CONFIG } from '@/config/api';

export interface Marketplace {
    id: string;
    nome: string;
    status: 'ativo' | 'configurado' | 'pendente' | 'inativo';
    produtos: number;
    vendas: number;
    receita: number;
    ultimaSincronizacao: string;
    logo?: string;
    url?: string;
}

export interface MarketplaceStats {
    totalMarketplaces: number;
    ativos: number;
    configurados: number;
    vendasHoje: number;
    receitaHoje: number;
    produtosSincronizados: number;
}

export interface MarketplaceDisponivel {
    nome: string;
    logo: string;
    status: 'disponivel' | 'configurado' | 'em_breve';
    descricao: string;
    url?: string;
}

class MarketplaceService {
    private baseUrl = `${API_CONFIG.BASE_URL}/marketplaces`;

    async getStats(): Promise<MarketplaceStats> {
        try {
            console.log('📊 Buscando estatísticas dos Marketplaces...');

            // Mock data
            const stats: MarketplaceStats = {
                totalMarketplaces: 8,
                ativos: 5,
                configurados: 3,
                vendasHoje: 6,
                receitaHoje: 890.00,
                produtosSincronizados: 156
            };

            console.log('✅ Estatísticas carregadas:', stats);
            return stats;
        } catch (error) {
            console.error('❌ Erro ao buscar estatísticas:', error);
            throw error;
        }
    }

    async getMarketplaces(): Promise<Marketplace[]> {
        try {
            console.log('🔄 Buscando marketplaces configurados...');

            // Mock data
            const marketplaces: Marketplace[] = [
                {
                    id: 'AMZ001',
                    nome: 'Amazon',
                    status: 'ativo',
                    produtos: 45,
                    vendas: 12,
                    receita: 320.00,
                    ultimaSincronizacao: '2024-01-15T10:30:00Z',
                    // EXCEÇÃO CONTROLADA: URL externa do marketplace para referência
                    url: 'https://amazon.com.br'
                },
                {
                    id: 'B2W001',
                    nome: 'B2W Digital',
                    status: 'ativo',
                    produtos: 38,
                    vendas: 8,
                    receita: 280.00,
                    ultimaSincronizacao: '2024-01-15T09:15:00Z',
                    // EXCEÇÃO CONTROLADA: URL externa do marketplace para referência
                    url: 'https://americanas.com.br'
                },
                {
                    id: 'MAG001',
                    nome: 'Magazine Luiza',
                    status: 'configurado',
                    produtos: 25,
                    vendas: 3,
                    receita: 150.00,
                    ultimaSincronizacao: '2024-01-14T16:45:00Z',
                    // EXCEÇÃO CONTROLADA: URL externa do marketplace para referência
                    url: 'https://magazineluiza.com.br'
                },
                {
                    id: 'CAS001',
                    nome: 'Casas Bahia',
                    status: 'pendente',
                    produtos: 0,
                    vendas: 0,
                    receita: 0,
                    ultimaSincronizacao: '2024-01-13T12:00:00Z',
                    // EXCEÇÃO CONTROLADA: URL externa do marketplace para referência
                    url: 'https://casasbahia.com.br'
                }
            ];

            console.log('✅ Marketplaces carregados:', marketplaces.length);
            return marketplaces;
        } catch (error) {
            console.error('❌ Erro ao buscar marketplaces:', error);
            throw error;
        }
    }

    async getMarketplacesDisponiveis(): Promise<MarketplaceDisponivel[]> {
        try {
            console.log('🔄 Buscando marketplaces disponíveis...');

            // Mock data
            const marketplaces: MarketplaceDisponivel[] = [
                {
                    nome: 'Amazon',
                    logo: '🛒',
                    status: 'disponivel',
                    descricao: 'Maior marketplace do mundo',
                    // EXCEÇÃO CONTROLADA: URL externa do marketplace para referência
                    url: 'https://amazon.com.br'
                },
                {
                    nome: 'B2W Digital',
                    logo: '🏪',
                    status: 'disponivel',
                    descricao: 'Americanas, Submarino, Shoptime',
                    // EXCEÇÃO CONTROLADA: URL externa do marketplace para referência
                    url: 'https://americanas.com.br'
                },
                {
                    nome: 'Magazine Luiza',
                    logo: '🛍️',
                    status: 'configurado',
                    descricao: 'E-commerce brasileiro',
                    // EXCEÇÃO CONTROLADA: URL externa do marketplace para referência
                    url: 'https://magazineluiza.com.br'
                },
                {
                    nome: 'Casas Bahia',
                    logo: '🏠',
                    status: 'disponivel',
                    descricao: 'Varejo tradicional',
                    // EXCEÇÃO CONTROLADA: URL externa do marketplace para referência
                    url: 'https://casasbahia.com.br'
                },
                {
                    nome: 'Extra',
                    logo: '🛒',
                    status: 'disponivel',
                    descricao: 'Grupo Pão de Açúcar',
                    // EXCEÇÃO CONTROLADA: URL externa do marketplace para referência
                    url: 'https://extra.com.br'
                },
                {
                    nome: 'Submarino',
                    logo: '🌊',
                    status: 'disponivel',
                    descricao: 'B2W Digital',
                    // EXCEÇÃO CONTROLADA: URL externa do marketplace para referência
                    url: 'https://submarino.com.br'
                }
            ];

            console.log('✅ Marketplaces disponíveis carregados:', marketplaces.length);
            return marketplaces;
        } catch (error) {
            console.error('❌ Erro ao buscar marketplaces disponíveis:', error);
            throw error;
        }
    }

    async sincronizarTodos(): Promise<void> {
        try {
            console.log('🔄 Sincronizando todos os marketplaces...');

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            console.log('✅ Todos os marketplaces sincronizados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao sincronizar marketplaces:', error);
            throw error;
        }
    }

    async configurarMarketplace(nome: string): Promise<void> {
        try {
            console.log('⚙️ Configurando marketplace:', nome);

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('✅ Marketplace configurado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao configurar marketplace:', error);
            throw error;
        }
    }

    async sincronizarProdutos(marketplaceId: string): Promise<void> {
        try {
            console.log('📦 Sincronizando produtos do marketplace:', marketplaceId);

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 2500));

            console.log('✅ Produtos sincronizados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao sincronizar produtos:', error);
            throw error;
        }
    }

    async verDashboard(marketplaceId: string): Promise<void> {
        try {
            console.log('📊 Abrindo dashboard do marketplace:', marketplaceId);

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('✅ Dashboard aberto com sucesso');
        } catch (error) {
            console.error('❌ Erro ao abrir dashboard:', error);
            throw error;
        }
    }

    async removerMarketplace(marketplaceId: string): Promise<void> {
        try {
            console.log('🗑️ Removendo marketplace:', marketplaceId);

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('✅ Marketplace removido com sucesso');
        } catch (error) {
            console.error('❌ Erro ao remover marketplace:', error);
            throw error;
        }
    }

    async adicionarMarketplace(nome: string): Promise<void> {
        try {
            console.log('➕ Adicionando marketplace:', nome);

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('✅ Marketplace adicionado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao adicionar marketplace:', error);
            throw error;
        }
    }

    async gerarRelatorio(): Promise<Blob> {
        try {
            console.log('📊 Gerando relatório dos marketplaces...');

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 2500));

            console.log('✅ Relatório gerado com sucesso');

            // Mock blob
            return new Blob(['Relatório Marketplaces'], { type: 'application/pdf' });
        } catch (error) {
            console.error('❌ Erro ao gerar relatório:', error);
            throw error;
        }
    }

    async otimizarPrecos(): Promise<void> {
        try {
            console.log('💰 Otimizando preços dos marketplaces...');

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            console.log('✅ Preços otimizados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao otimizar preços:', error);
            throw error;
        }
    }
}

export default new MarketplaceService(); 