import { api } from '@/config/api';

export interface RelatorioContabilidade {
  receitas: {
    vendas_brutas: number;
    vendas_liquidas: number;
    outros_receitas: number;
    total_receitas: number;
  };
  despesas: {
    custos_mercadorias: number;
    despesas_operacionais: number;
    despesas_financeiras: number;
    total_despesas: number;
  };
  impostos: {
    icms: number;
    pis: number;
    cofins: number;
    total_impostos: number;
  };
  resultado: {
    lucro_bruto: number;
    lucro_liquido: number;
    margem_bruta: number;
    margem_liquida: number;
  };
  periodo: {
    ano: number;
    mes: number;
    mes_nome: string;
  };
}

export interface MovimentacaoCaixa {
  id: string;
  data: string;
  tipo: 'entrada' | 'saida';
  categoria: string;
  descricao: string;
  valor: number;
  forma_pagamento: string;
  observacoes?: string;
}

export interface BalancoMensal {
  ativo: {
    circulante: {
      caixa: number;
      bancos: number;
      contas_receber: number;
      estoque: number;
      total_circulante: number;
    };
    nao_circulante: {
      imobilizado: number;
      intangivel: number;
      total_nao_circulante: number;
    };
    total_ativo: number;
  };
  passivo: {
    circulante: {
      fornecedores: number;
      impostos_pagar: number;
      salarios_pagar: number;
      total_circulante: number;
    };
    patrimonio_liquido: {
      capital_social: number;
      lucros_acumulados: number;
      total_patrimonio: number;
    };
    total_passivo: number;
  };
  periodo: {
    ano: number;
    mes: number;
    mes_nome: string;
  };
}

class ContabilidadeService {
  private baseUrl = '/relatorios';

  // Relatório Contábil Mensal
  async gerarRelatorioContabilidade(ano: number, mes: number): Promise<RelatorioContabilidade> {
    try {
      const response = await api.get(`${this.baseUrl}/contabilidade`, {
        params: { ano, mes }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório contábil:', error);
      throw error;
    }
  }

  // Balanço Mensal
  async gerarBalancoMensal(ano: number, mes: number): Promise<BalancoMensal> {
    try {
      const response = await api.get(`${this.baseUrl}/balanco`, {
        params: { ano, mes }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar balanço mensal:', error);
      throw error;
    }
  }

  // Movimentações de Caixa
  async obterMovimentacoesCaixa(dataInicio: string, dataFim: string): Promise<MovimentacaoCaixa[]> {
    try {
      const response = await api.get('/caixa/movimentacoes', {
        params: { data_inicio: dataInicio, data_fim: dataFim }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter movimentações de caixa:', error);
      throw error;
    }
  }

  // Resumo de Movimentações
  async obterResumoMovimentacoes(dataInicio: string, dataFim: string): Promise<any> {
    try {
      const movimentacoes = await this.obterMovimentacoesCaixa(dataInicio, dataFim);
      
      const resumo = {
        total_entradas: 0,
        total_saidas: 0,
        saldo: 0,
        categorias: {} as Record<string, { entradas: number; saidas: number }>
      };

      movimentacoes.forEach(mov => {
        if (mov.tipo === 'entrada') {
          resumo.total_entradas += mov.valor;
          if (!resumo.categorias[mov.categoria]) {
            resumo.categorias[mov.categoria] = { entradas: 0, saidas: 0 };
          }
          resumo.categorias[mov.categoria].entradas += mov.valor;
        } else {
          resumo.total_saidas += mov.valor;
          if (!resumo.categorias[mov.categoria]) {
            resumo.categorias[mov.categoria] = { entradas: 0, saidas: 0 };
          }
          resumo.categorias[mov.categoria].saidas += mov.valor;
        }
      });

      resumo.saldo = resumo.total_entradas - resumo.total_saidas;
      
      return resumo;
    } catch (error) {
      console.error('Erro ao obter resumo de movimentações:', error);
      throw error;
    }
  }
}

export const contabilidadeService = new ContabilidadeService(); 