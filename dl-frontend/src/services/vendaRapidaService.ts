
import { API_CONFIG } from '@/config/api';

// Tipos para Venda Rápida
export interface ProdutoVendaRapida {
    id: number;
    sku: string;
    nome: string;
    categoria: string;
    marca: string;
    preco: number;
    estoque_disponivel: number;
    estoque_critico: boolean;
    imagem_url?: string;
    descricao?: string;
}

export interface ClienteVendaRapida {
    id?: number;
    nome: string;
    telefone: string;
    email?: string;
    cidade?: string;
    total_compras?: number;
    ultima_compra?: string;
}

export interface ItemCarrinho {
    tipo_produto: 'cadastrado' | 'avulso';
    produto_id?: number;
    produto_nome: string;
    produto_sku?: string;
    produto_marca?: string;
    produto_categoria?: string;
    quantidade: number;
    preco_unitario: number;
    desconto_percentual: number;
    desconto_valor: number;
    observacoes?: string;
    subtotal_bruto?: number;
    valor_desconto?: number;
    subtotal_liquido?: number;
}

export interface DadosPagamento {
    forma_pagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'transferencia' | 'fiado' | 'vale_peca';
    valor_pago?: number;
    troco?: number;
    numero_parcelas: number;
    taxa_juros: number;
    referencia_pagamento?: string;
    observacoes_pagamento?: string;
}

export interface VendaRapidaCreate {
    cliente_id: number;
    vendedor_id?: number;
    observacoes?: string;
    desconto_geral_percentual: number;
    desconto_geral_valor: number;
    frete_valor: number;
    frete_tipo?: string;
    endereco_entrega?: any;
    itens: ItemCarrinho[]; // Mantido para compatibilidade
    produtos?: ItemCarrinho[]; // ✅ ADICIONADO: campo que o backend espera
    forma_pagamento?: string; // ✅ ADICIONADO: forma de pagamento
    dados_pagamento?: DadosPagamento;
    finalizar_imediatamente: boolean;
}

export interface CalculoJuros {
    valor_original: number;
    parcelas: number;
    taxa_juros: number;
    valor_parcela: number;
    valor_total: number;
    total_juros: number;
}

export interface InformacoesCarro {
    marca: string;
    modelo: string;
    ano: number;
    motor?: string;
    combustivel?: string;
    observacoes?: string;
}

class VendaRapidaService {

    // Helper para fazer requisições
    private async request(url: string, options: RequestInit = {}): Promise<any> {
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
            headers: API_CONFIG.DEFAULT_HEADERS,
            ...options,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
        }

        return await response.json();
    }

    // Buscar produtos para venda rápida
    async buscarProdutos(termo: string, limit: number = 10): Promise<ProdutoVendaRapida[]> {
        try {
            const data = await this.request(`/vendas-rapidas/produtos/buscar?termo=${encodeURIComponent(termo)}&limit=${limit}`);
            return data.produtos;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }

    // Buscar produto por SKU
    async buscarProdutoPorSku(sku: string): Promise<ProdutoVendaRapida> {
        try {
            return await this.request(`/vendas-rapidas/produtos/sku/${sku}`);
        } catch (error) {
            console.error('Erro ao buscar produto por SKU:', error);
            throw error;
        }
    }

    // Buscar cliente por telefone
    async buscarCliente(telefone: string): Promise<{ encontrado: boolean; cliente?: ClienteVendaRapida; mensagem: string }> {
        try {
            return await this.request(`/vendas-rapidas/clientes/buscar?telefone=${encodeURIComponent(telefone)}`);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            throw error;
        }
    }

    // Criar cliente rapidamente
    async criarClienteRapido(clienteData: Omit<ClienteVendaRapida, 'id'>): Promise<ClienteVendaRapida> {
        try {
            const data = await this.request('/vendas-rapidas/clientes/criar-rapido', {
                method: 'POST',
                body: JSON.stringify(clienteData),
            });
            return data.cliente;
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    }

    // Criar produto avulso rapidamente
    async criarProdutoAvulso(produtoData: any, vendedorId: number = 1): Promise<any> {
        try {
            const data = await this.request('/vendas-rapidas/produtos/criar-avulso', {
                method: 'POST',
                body: JSON.stringify({
                    ...produtoData,
                    vendedor_id: vendedorId
                }),
            });
            return data;
        } catch (error) {
            console.error('Erro ao criar produto avulso:', error);
            throw error;
        }
    }

    // Finalizar venda rápida
    async finalizarVenda(vendaData: VendaRapidaCreate): Promise<any> {
        try {
            return await this.request('/vendas-rapidas/venda/finalizar', {
                method: 'POST',
                body: JSON.stringify(vendaData),
            });
        } catch (error) {
            console.error('Erro ao finalizar venda:', error);
            throw error;
        }
    }

    // Obter vendas de hoje
    async obterVendasHoje(): Promise<any> {
        try {
            return await this.request('/vendas-rapidas/vendas/hoje');
        } catch (error) {
            console.error('Erro ao obter vendas de hoje:', error);
            throw error;
        }
    }

    // Obter produtos com estoque baixo
    async obterProdutosEstoqueBaixo(limite: number = 5): Promise<any> {
        try {
            return await this.request(`/vendas-rapidas/produtos/estoque-baixo?limite=${limite}`);
        } catch (error) {
            console.error('Erro ao obter produtos com estoque baixo:', error);
            throw error;
        }
    }

    // Obter resumo do balcão
    async obterResumoBalcao(): Promise<any> {
        try {
            return await this.request('/vendas-rapidas/resumo/balcao');
        } catch (error) {
            console.error('Erro ao obter resumo do balcão:', error);
            throw error;
        }
    }

    // CALCULADORA DE JUROS - Baseada nas taxas do PagBank
    calcularJuros(valor: number, parcelas: number, formaPagamento: string): CalculoJuros {
        let taxa = 0;

        // Taxas baseadas na imagem do PagBank
        if (formaPagamento === 'pix') {
            taxa = 0.99;
        } else if (formaPagamento === 'cartao_debito') {
            taxa = 2.39;
        } else if (formaPagamento === 'cartao_credito') {
            if (parcelas === 1) {
                taxa = 3.00; // À vista
            } else if (parcelas >= 2 && parcelas <= 12) {
                taxa = 2.18; // Parcelado 2x-12x
            } else if (parcelas >= 13 && parcelas <= 18) {
                taxa = 5.59; // Parcelado 13x-18x (Aura, Brasilcard)
            }

            // Acréscimo mensal para vendas parceladas
            if (parcelas > 1) {
                const acrescimoMensal = 1.62;
                taxa += (acrescimoMensal * (parcelas - 1));
            }
        }

        // Calcular valores
        const taxaDecimal = taxa / 100;
        const valor_total = valor * (1 + taxaDecimal);
        const valor_parcela = valor_total / parcelas;
        const total_juros = valor_total - valor;

        return {
            valor_original: valor,
            parcelas,
            taxa_juros: taxa,
            valor_parcela: Number(valor_parcela.toFixed(2)),
            valor_total: Number(valor_total.toFixed(2)),
            total_juros: Number(total_juros.toFixed(2))
        };
    }

    // Calcular totais do carrinho
    calcularTotaisCarrinho(itens: ItemCarrinho[], descontoGeral: number = 0, frete: number = 0): any {
        // Validar parâmetros
        if (!Array.isArray(itens)) {
            console.warn('Itens não é um array:', itens);
            return {
                subtotal: 0,
                desconto_geral: 0,
                frete: 0,
                total: 0,
                quantidade_itens: 0
            };
        }

        const subtotal = itens.reduce((acc, item) => {
            // Validar valores do item
            const quantidade = typeof item.quantidade === 'number' && !isNaN(item.quantidade) ? item.quantidade : 0;
            const precoUnitario = typeof item.preco_unitario === 'number' && !isNaN(item.preco_unitario) ? item.preco_unitario : 0;

            const subtotalItem = quantidade * precoUnitario;
            const desconto = item.desconto_percentual > 0
                ? subtotalItem * (item.desconto_percentual / 100)
                : (item.desconto_valor || 0);
            return acc + (subtotalItem - desconto);
        }, 0);

        // Validar desconto geral e frete
        const descontoGeralValido = typeof descontoGeral === 'number' && !isNaN(descontoGeral) ? descontoGeral : 0;
        const freteValido = typeof frete === 'number' && !isNaN(frete) ? frete : 0;

        const valorDescontoGeral = descontoGeralValido > 0 ? subtotal * (descontoGeralValido / 100) : 0;
        const total = subtotal - valorDescontoGeral + freteValido;

        return {
            subtotal: Number(subtotal.toFixed(2)),
            desconto_geral: Number(valorDescontoGeral.toFixed(2)),
            frete: Number(freteValido.toFixed(2)),
            total: Number(total.toFixed(2)),
            quantidade_itens: itens.reduce((acc, item) => {
                const quantidade = typeof item.quantidade === 'number' && !isNaN(item.quantidade) ? item.quantidade : 0;
                return acc + quantidade;
            }, 0)
        };
    }

    // Validar dados da venda
    validarVenda(dados: any): { valido: boolean; erros: string[] } {
        const erros: string[] = [];

        if (!dados.cliente_id) {
            erros.push('Cliente é obrigatório');
        }

        if (!dados.itens || dados.itens.length === 0) {
            erros.push('Pelo menos um produto é obrigatório');
        }

        if (dados.dados_pagamento && !dados.dados_pagamento.forma_pagamento) {
            erros.push('Forma de pagamento é obrigatória');
        }

        // Validar itens
        dados.itens?.forEach((item: ItemCarrinho, index: number) => {
            if (!item.produto_nome) {
                erros.push(`Item ${index + 1}: Nome do produto é obrigatório`);
            }
            if (item.quantidade <= 0) {
                erros.push(`Item ${index + 1}: Quantidade deve ser maior que zero`);
            }
            if (item.preco_unitario < 0) {
                erros.push(`Item ${index + 1}: Preço não pode ser negativo`);
            }
        });

        return {
            valido: erros.length === 0,
            erros
        };
    }

    // Formatar valores monetários
    formatarMoeda(valor: number): string {
        // Validar se o valor é um número válido
        if (typeof valor !== 'number' || isNaN(valor) || !isFinite(valor)) {
            console.warn('Valor inválido para formatação monetária:', valor);
            return 'R$ 0,00';
        }

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    // Gerar relatório de venda
    gerarRelatorioVenda(venda: any): string {
        const dataVenda = new Date(venda.data_venda).toLocaleString('pt-BR');
        const itens = venda.itens?.map((item: any) =>
            `${item.quantidade}x ${item.produto_nome} - ${this.formatarMoeda(item.subtotal_liquido)}`
        ).join('\n');

        return `
🧾 COMPROVANTE DE VENDA
━━━━━━━━━━━━━━━━━━━━━━━━
📅 Data: ${dataVenda}
🆔 Venda: ${venda.numero_venda}
👤 Cliente: ${venda.cliente_nome}

📦 ITENS:
${itens}

💰 RESUMO:
Subtotal: ${this.formatarMoeda(venda.subtotal)}
Desconto: ${this.formatarMoeda(venda.valor_desconto_geral)}
Frete: ${this.formatarMoeda(venda.valor_frete)}
TOTAL: ${this.formatarMoeda(venda.valor_total)}

💳 Pagamento: ${venda.forma_pagamento}
${venda.numero_parcelas > 1 ? `Parcelas: ${venda.numero_parcelas}x` : ''}

DL Auto Peças - Obrigado pela preferência! 🚗
    `.trim();
    }
}

export const vendaRapidaService = new VendaRapidaService(); 