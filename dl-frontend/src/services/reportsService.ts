import { api } from '@/config/api';

export interface RelatorioMensal {
    vendas: {
        total_vendas: number;
        total_itens: number;
        ticket_medio: number;
        vendas_por_canal: Record<string, number>;
        vendas_por_vendedor: Record<string, number>;
    };
    produtos: {
        total_produtos: number;
        produtos_mais_vendidos: Array<{
            codigo: string;
            descricao: string;
            quantidade: number;
            valor_total: number;
        }>;
        produtos_estoque_baixo: Array<{
            codigo: string;
            descricao: string;
            estoque_atual: number;
            estoque_minimo: number;
        }>;
    };
    clientes: {
        total_clientes: number;
        novos_clientes: number;
        clientes_mais_ativos: Array<{
            nome: string;
            total_compras: number;
            valor_total: number;
        }>;
    };
    financeiro: {
        receita_total: number;
        custos_totais: number;
        lucro_bruto: number;
        margem_bruta: number;
        impostos_pagos: number;
    };
    periodo: {
        ano: number;
        mes: number;
        mes_nome: string;
    };
}

export interface GuiaImposto {
    pdf_base64: string;
    nome_arquivo: string;
    tamanho_bytes: number;
    periodo: {
        ano: number;
        mes: number;
        mes_nome: string;
    };
    imposto: string;
}

export interface RelatorioImpostos {
    impostos_por_periodo: Array<{
        mes: string;
        icms: number;
        pis: number;
        cofins: number;
        total: number;
    }>;
    total_geral: {
        icms: number;
        pis: number;
        cofins: number;
        total: number;
    };
    comparativo_mensal: {
        mes_atual: number;
        mes_anterior: number;
        variacao_percentual: number;
    };
    periodo: {
        ano: number;
        mes: number;
        mes_nome: string;
    };
}

export interface DashboardFiscal {
    resumo_mensal: {
        nfes_emitidas: number;
        valor_total_emitido: number;
        impostos_recolhidos: number;
        pendentes_emissao: number;
    };
    tendencias: {
        emissao_diaria: Array<{
            data: string;
            quantidade: number;
            valor: number;
        }>;
        impostos_mensais: Array<{
            mes: string;
            icms: number;
            pis: number;
            cofins: number;
        }>;
    };
    alertas: Array<{
        tipo: 'warning' | 'error' | 'info';
        titulo: string;
        mensagem: string;
        data: string;
    }>;
    periodo: {
        ano: number;
        mes: number;
        mes_nome: string;
    };
}

export interface TipoImposto {
    codigo: string;
    nome: string;
    descricao: string;
    periodicidade: 'mensal' | 'trimestral' | 'anual';
    prazo_dias: number;
}

class ReportsService {
    private baseUrl = '/reports';

    // Relatório Mensal Completo
    async gerarRelatorioMensal(ano: number, mes: number): Promise<RelatorioMensal> {
        try {
            const response = await api.get(`${this.baseUrl}/mensal`, {
                params: { ano, mes }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao gerar relatório mensal:', error);
            throw error;
        }
    }

    // Gerar Guia de Imposto
    async gerarGuiaImposto(ano: number, mes: number, imposto: string): Promise<GuiaImposto> {
        try {
            const response = await api.get(`${this.baseUrl}/guia`, {
                params: { ano, mes, imposto }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao gerar guia de imposto:', error);
            throw error;
        }
    }

    // Relatório de Impostos
    async gerarRelatorioImpostos(ano: number, mes: number): Promise<RelatorioImpostos> {
        try {
            const response = await api.get(`${this.baseUrl}/impostos`, {
                params: { ano, mes }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao gerar relatório de impostos:', error);
            throw error;
        }
    }

    // Dashboard Fiscal
    async gerarDashboardFiscal(ano: number, mes: number): Promise<DashboardFiscal> {
        try {
            const response = await api.get(`${this.baseUrl}/dashboard-fiscal`, {
                params: { ano, mes }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao gerar dashboard fiscal:', error);
            throw error;
        }
    }

    // Listar Tipos de Impostos
    async listarTiposImpostos(): Promise<TipoImposto[]> {
        try {
            const response = await api.get(`${this.baseUrl}/tipos-impostos`);
            return response.data;
        } catch (error) {
            console.error('Erro ao listar tipos de impostos:', error);
            throw error;
        }
    }

    // Download de PDF
    async downloadPDF(base64Data: string, filename: string): Promise<void> {
        try {
            // Converter base64 para blob
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            // Criar link de download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao fazer download do PDF:', error);
            throw error;
        }
    }

    // Helper para formatar valores monetários
    formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Helper para formatar percentuais
    formatPercentage(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    }

    // Helper para obter nome do mês
    getMonthName(month: number): string {
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return months[month - 1] || '';
    }

    // Helper para calcular variação percentual
    calculatePercentageChange(current: number, previous: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }
}

export const reportsService = new ReportsService(); 