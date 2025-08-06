// src/services/vendedorService.ts

// 1. Importar a instância 'api' do Axios em vez de 'API_CONFIG'
import { api } from '@/config/api';

/**
 * Serviço centralizado para operações do vendedor
 * Refatorado para usar a instância global do Axios ('api')
 */
export class VendedorService {
    /**
     * Carrega dados do dashboard do vendedor
     */
    static async loadDashboardData(vendedorId: number) {
        try {
            // 2. Substituir 'fetch' por 'api.get'
            // A URL agora é relativa, pois a base já está configurada no 'api'
            const response = await api.get(`/vendedor/${vendedorId}/resumo-dia`);
            return response.data; // Axios já retorna o JSON no campo 'data'
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            // Retornar o mock em caso de erro
            return this.getMockDashboardData();
        }
    }

    /**
     * Carrega métricas do dia
     */
    static async loadMetricasDia(vendedorId: number) {
        try {
            const response = await api.get(`/vendedor/${vendedorId}/metricas-dia`);
            return response.data;
        } catch (error) {
            console.error('Erro ao carregar métricas:', error);
            return this.getMockMetricasDia();
        }
    }

    /**
     * Carrega feedback da IA
     */
    static async loadFeedbackIA(vendedorId: number) {
        try {
            const response = await api.get(`/vendedor/${vendedorId}/feedback`);
            return response.data;
        } catch (error) {
            console.error('Erro ao carregar feedback:', error);
            return this.getMockFeedbackIA();
        }
    }

    /**
     * Carrega notificações do vendedor
     */
    static async loadNotificacoes(vendedorId: number) {
        try {
            const response = await api.get(`/vendedor/${vendedorId}/orcamentos-perdidos`);
            // O backend retorna o objeto completo, o frontend formata
            return this.formatarNotificacoes(response.data.orcamentos_perdidos || []);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
            return this.getMockNotificacoes();
        }
    }

    /**
     * Carrega eventos do calendário
     */
    static async loadEventosCalendario(vendedorId: number) {
        try {
            const response = await api.get(`/dashboard/estatisticas/completas`);
            return this.formatarEventosCalendario(response.data);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            return this.getMockEventosCalendario();
        }
    }

    /**
     * Envia mensagem via WhatsApp
     */
    static enviarWhatsApp(numero: string, mensagem: string) {
        const mensagemEncoded = encodeURIComponent(mensagem);
        window.open(`https://wa.me/${numero}?text=${mensagemEncoded}`, '_blank');
    }

    /**
     * Marca notificação como lida
     */
    static async marcarNotificacaoComoLida(notificacaoId: number, vendedorId: number) {
        try {
            // Usando api.post
            await api.post(`/vendedor/${vendedorId}/marcar-contatado`, { 
                orcamento_id: notificacaoId 
            });
            return true;
        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
            return false;
        }
    }

    /**
     * Formata orçamentos perdidos em notificações
     */
    private static formatarNotificacoes(orcamentosPerdidos: any[]) {
        if (!Array.isArray(orcamentosPerdidos)) return [];
        return orcamentosPerdidos.map((orcamento, index) => ({
            id: orcamento.id || index + 1,
            type: 'urgent',
            title: 'Orçamento Pendente',
            message: `Orçamento #${orcamento.id} aguarda retorno há ${orcamento.dias_sem_contato || 2} dias`,
            time: `${orcamento.dias_sem_contato || 2} dias atrás`,
            read: false,
            action: 'Contatar agora',
            url: `/vendedor/orcamentos`
        }));
    }

    /**
     * Formata dados do dashboard em eventos de calendário
     */
    private static formatarEventosCalendario(dashboardData: any) {
        const eventos = [];
        const hoje = new Date();

        if (dashboardData?.vendas?.vendas_hoje > 0) {
            eventos.push({
                id: 1,
                titulo: "Follow-up Vendas",
                data: hoje.toISOString().split('T')[0],
                tipo: "followup",
                hora: "14:00",
                prioridade: "alta",
                cliente: "Clientes do dia",
                telefone: "(11) 99999-9999"
            });
        }

        if (dashboardData?.clientes?.clientes_novos > 0) {
            eventos.push({
                id: 2,
                titulo: "Contatar Novos Clientes",
                data: hoje.toISOString().split('T')[0],
                tipo: "compromisso",
                hora: "16:00",
                prioridade: "media",
                cliente: "Novos leads",
                telefone: "(11) 88888-8888"
            });
        }

        return eventos;
    }

    // Dados mockados para fallback (sem alterações)
    private static getMockDashboardData() {
        return {
            vendasHoje: 12500,
            orcamentosAtivos: 8,
            clientesNovos: 3,
            performanceScore: 87,
            tempoMedioResposta: 2.3,
            taxaFechamento: 65,
            proximasEntregas: [
                { id: 1, cliente: "João Silva", produto: "Filtro de Ar", data: "2025-01-28", status: "em_transito" },
                { id: 2, cliente: "Maria Santos", produto: "Pastilha de Freio", data: "2025-01-29", status: "preparando" }
            ],
            mensagensGestor: [
                { id: 1, titulo: "Meta Semanal", mensagem: "Você está 15% acima da meta! Continue assim!", tipo: "sucesso", data: "2025-01-27" },
                { id: 2, titulo: "Novo Produto", mensagem: "Filtros de ar premium chegaram. Priorize nas vendas!", tipo: "info", data: "2025-01-27" }
            ],
            sugestoesIA: [
                { id: 1, titulo: "Follow-up Urgente", descricao: "Cliente João Silva não respondeu há 48h", prioridade: "alta", acao: "Ligar agora" },
                { id: 2, titulo: "Oportunidade", descricao: "Maria Santos sempre compra em janeiro", prioridade: "media", acao: "Enviar proposta" }
            ],
            eventosCalendario: [
                { id: 1, titulo: "Entrega João Silva", data: "2025-01-28", tipo: "entrega", hora: "14:00", prioridade: "alta", cliente: "João Silva", endereco: "Rua das Flores, 123", telefone: "(11) 99999-9999" },
                { id: 2, titulo: "Follow-up Maria", data: "2025-01-28", tipo: "followup", hora: "16:00", prioridade: "media", cliente: "Maria Santos", telefone: "(11) 88888-8888" },
            ],
            notifications: [
                { id: 1, type: 'success', title: 'Venda Realizada', message: 'Orçamento #1234 foi fechado com sucesso!', time: '2 min atrás', read: false, action: 'Ver detalhes' },
                { id: 2, type: 'urgent', title: 'Cliente Aguardando', message: 'João Silva aguarda retorno há 2h', time: '15 min atrás', read: false, action: 'Ligar agora' },
            ]
        };
    }

    private static getMockMetricasDia() {
        return {
            vendas_dia: 12500,
            orcamentos_ativos: 8,
            tempo_medio_resposta: 2.3,
            tempo_medio_fechamento: 24,
            performance: "87%",
            dicas: ["Continue fazendo follow-ups rápidos", "Foque em orçamentos acima de R$ 500"],
            data: new Date().toISOString()
        };
    }

    private static getMockFeedbackIA() {
        return {
            feedback: "Você está fazendo um excelente trabalho! Continue focando em follow-ups rápidos e use mais chamadas diretas para fechar vendas.",
            metricas: {
                total_orcamentos: 15,
                orcamentos_fechados: 10,
                orcamentos_perdidos: 5,
                taxa_fechamento: 67,
                tempo_medio_resposta: 2.3
            },
            padroes: {
                total_conversas: 45,
                usa_chamadas_diretas: true,
                frequencia_follow_up: 3,
                padrao_empatia: "alto"
            }
        };
    }

    private static getMockNotificacoes() {
        return [
            {
                id: 1,
                type: 'success',
                title: 'Venda Realizada',
                message: 'Orçamento #1234 foi fechado com sucesso!',
                time: '2 min atrás',
                read: false,
                action: 'Ver detalhes',
                url: '/vendedor/orcamentos'
            },
        ];
    }

    private static getMockEventosCalendario() {
        return [
            { id: 1, titulo: "Entrega João Silva", data: "2025-01-28", tipo: "entrega", hora: "14:00", prioridade: "alta", cliente: "João Silva", endereco: "Rua das Flores, 123", telefone: "(11) 99999-9999" },
        ];
    }
}
