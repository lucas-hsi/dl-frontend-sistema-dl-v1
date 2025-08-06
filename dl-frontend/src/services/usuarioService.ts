import { API_CONFIG } from '@/config/api';

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    username: string;
    perfil: string;
    ativo: boolean;
    limite_desconto?: number;
    data_criacao?: string;
}

export interface EditarUsuarioData {
    id: number;
    nome: string;
    email: string;
    username: string;
    perfil: string;
    limite_desconto: number;
    resetar_senha: boolean;
}

export interface LimiteDescontoUpdate {
    limite_desconto: number;
}

export class UsuarioService {
    // Listar todos os usuários
    static async listarUsuarios(): Promise<Usuario[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/auth/usuarios`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao listar usuários: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            // Retornar dados mock em caso de erro
            return this.getUsuariosMock();
        }
    }

    // Atualizar limite de desconto
    static async atualizarLimiteDesconto(userId: number, limiteDesconto: number): Promise<any> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/auth/usuarios/${userId}/limite-desconto`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    limite_desconto: limiteDesconto
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro ao atualizar limite de desconto: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar limite de desconto:', error);
            throw error;
        }
    }

    // Criar novo usuário
    static async criarUsuario(userData: {
        nome: string;
        email: string;
        username: string;
        senha: string;
        perfil: string;
    }): Promise<Usuario> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro ao criar usuário: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    // Atualizar usuário
    static async atualizarUsuario(userId: number, userData: Partial<Usuario>): Promise<Usuario> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/auth/usuarios/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro ao atualizar usuário: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    // Dados mock para desenvolvimento
    static getUsuariosMock(): Usuario[] {
        return [
            {
                id: 1,
                nome: "João Silva",
                email: "joao@dlautopecas.com",
                username: "joao.silva",
                perfil: "VENDEDOR",
                ativo: true,
                limite_desconto: 5.0,
                data_criacao: "2024-01-15"
            },
            {
                id: 2,
                nome: "Maria Santos",
                email: "maria@dlautopecas.com",
                username: "maria.santos",
                perfil: "ANUNCIANTE",
                ativo: true,
                limite_desconto: 8.5,
                data_criacao: "2024-02-20"
            },
            {
                id: 3,
                nome: "Pedro Costa",
                email: "pedro@dlautopecas.com",
                username: "pedro.costa",
                perfil: "GESTOR",
                ativo: false,
                limite_desconto: 10.0,
                data_criacao: "2024-03-10"
            }
        ];
    }
} 