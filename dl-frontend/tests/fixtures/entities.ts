/**
 * Geradores de entidades dummy para testes
 * Gera dados únicos com timestamps para evitar conflitos
 */

export interface DummyProduto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  sku: string;
  descricao: string;
  marca: string;
  criado_em: string;
  atualizado_em: string;
}

export interface DummyCliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  criado_em: string;
}

export interface DummyAnuncio {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  categoria: string;
  status: 'ativo' | 'inativo' | 'rascunho';
  imagens: string[];
  criado_em: string;
}

export interface DummyVenda {
  id: number;
  cliente_id: number;
  itens: Array<{
    produto_id: number;
    quantidade: number;
    preco_unitario: number;
  }>;
  total: number;
  desconto: number;
  forma_pagamento: string;
  status: 'pendente' | 'finalizada' | 'cancelada';
  criado_em: string;
}

export interface DummyOrcamento {
  id: number;
  cliente_id: number;
  itens: Array<{
    produto_id: number;
    quantidade: number;
    preco_unitario: number;
  }>;
  total: number;
  desconto: number;
  status: 'pendente' | 'enviado' | 'aprovado' | 'rejeitado';
  criado_em: string;
}

/**
 * Gera timestamp único para evitar conflitos
 */
function generateUniqueTimestamp(): string {
  return new Date(Date.now() + Math.random() * 1000).toISOString();
}

/**
 * Gera ID único baseado em timestamp
 */
function generateUniqueId(): number {
  return Math.floor(Date.now() + Math.random() * 1000);
}

/**
 * Gera produto dummy
 */
export function generateDummyProduto(overrides: Partial<DummyProduto> = {}): DummyProduto {
  const timestamp = generateUniqueTimestamp();
  const id = generateUniqueId();
  
  const categorias = ['Freios', 'Filtros', 'Suspensão', 'Motor', 'Elétrica', 'Carroceria', 'Acessórios'];
  const marcas = ['Bosch', 'NGK', 'Continental', 'Delphi', 'Valeo', 'Mahle', 'Mann'];
  
  return {
    id,
    nome: `Produto Teste ${id}`,
    categoria: categorias[Math.floor(Math.random() * categorias.length)],
    preco: Math.floor(Math.random() * 1000) + 50,
    estoque: Math.floor(Math.random() * 100) + 1,
    sku: `SKU-${id}-${Date.now()}`,
    descricao: `Descrição do produto teste ${id}`,
    marca: marcas[Math.floor(Math.random() * marcas.length)],
    criado_em: timestamp,
    atualizado_em: timestamp,
    ...overrides
  };
}

/**
 * Gera cliente dummy
 */
export function generateDummyCliente(overrides: Partial<DummyCliente> = {}): DummyCliente {
  const timestamp = generateUniqueTimestamp();
  const id = generateUniqueId();
  
  return {
    id,
    nome: `Cliente Teste ${id}`,
    email: `cliente${id}@teste.com`,
    telefone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
    endereco: `Rua Teste ${id}, 123 - São Paulo/SP`,
    criado_em: timestamp,
    ...overrides
  };
}

/**
 * Gera anúncio dummy
 */
export function generateDummyAnuncio(overrides: Partial<DummyAnuncio> = {}): DummyAnuncio {
  const timestamp = generateUniqueTimestamp();
  const id = generateUniqueId();
  
  const categorias = ['Freios', 'Filtros', 'Suspensão', 'Motor', 'Elétrica', 'Carroceria', 'Acessórios'];
  const statuses: Array<'ativo' | 'inativo' | 'rascunho'> = ['ativo', 'inativo', 'rascunho'];
  
  return {
    id,
    titulo: `Anúncio Teste ${id}`,
    descricao: `Descrição completa do anúncio teste ${id}`,
    preco: Math.floor(Math.random() * 1000) + 50,
    categoria: categorias[Math.floor(Math.random() * categorias.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    imagens: [`https://via.placeholder.com/300x200?text=Imagem+${id}`],
    criado_em: timestamp,
    ...overrides
  };
}

/**
 * Gera venda dummy
 */
export function generateDummyVenda(overrides: Partial<DummyVenda> = {}): DummyVenda {
  const timestamp = generateUniqueTimestamp();
  const id = generateUniqueId();
  const cliente_id = generateUniqueId();
  
  const formasPagamento = ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia'];
  const statuses: Array<'pendente' | 'finalizada' | 'cancelada'> = ['pendente', 'finalizada', 'cancelada'];
  
  const itens = [
    {
      produto_id: generateUniqueId(),
      quantidade: Math.floor(Math.random() * 5) + 1,
      preco_unitario: Math.floor(Math.random() * 500) + 50
    }
  ];
  
  const total = itens.reduce((sum, item) => sum + (item.quantidade * item.preco_unitario), 0);
  const desconto = Math.floor(Math.random() * 50);
  
  return {
    id,
    cliente_id,
    itens,
    total: total - desconto,
    desconto,
    forma_pagamento: formasPagamento[Math.floor(Math.random() * formasPagamento.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    criado_em: timestamp,
    ...overrides
  };
}

/**
 * Gera orçamento dummy
 */
export function generateDummyOrcamento(overrides: Partial<DummyOrcamento> = {}): DummyOrcamento {
  const timestamp = generateUniqueTimestamp();
  const id = generateUniqueId();
  const cliente_id = generateUniqueId();
  
  const statuses: Array<'pendente' | 'enviado' | 'aprovado' | 'rejeitado'> = ['pendente', 'enviado', 'aprovado', 'rejeitado'];
  
  const itens = [
    {
      produto_id: generateUniqueId(),
      quantidade: Math.floor(Math.random() * 5) + 1,
      preco_unitario: Math.floor(Math.random() * 500) + 50
    }
  ];
  
  const total = itens.reduce((sum, item) => sum + (item.quantidade * item.preco_unitario), 0);
  const desconto = Math.floor(Math.random() * 50);
  
  return {
    id,
    cliente_id,
    itens,
    total: total - desconto,
    desconto,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    criado_em: timestamp,
    ...overrides
  };
}

/**
 * Gera array de produtos dummy
 */
export function generateDummyProdutos(count: number): DummyProduto[] {
  return Array.from({ length: count }, () => generateDummyProduto());
}

/**
 * Gera array de clientes dummy
 */
export function generateDummyClientes(count: number): DummyCliente[] {
  return Array.from({ length: count }, () => generateDummyCliente());
}

/**
 * Gera array de anúncios dummy
 */
export function generateDummyAnuncios(count: number): DummyAnuncio[] {
  return Array.from({ length: count }, () => generateDummyAnuncio());
}

/**
 * Gera array de vendas dummy
 */
export function generateDummyVendas(count: number): DummyVenda[] {
  return Array.from({ length: count }, () => generateDummyVenda());
}

/**
 * Gera array de orçamentos dummy
 */
export function generateDummyOrcamentos(count: number): DummyOrcamento[] {
  return Array.from({ length: count }, () => generateDummyOrcamento());
}

/**
 * Gera SKU único para testes
 */
export function dummySku(): string {
  return `SKU-${Date.now()}`;
}

/**
 * Gera produto dummy simples
 */
export function dummyProduct(): DummyProduto {
  return generateDummyProduto();
}

/**
 * Limpa dados de teste (para usar no cleanup)
 */
export async function cleanupTestData(api: any, entityType: 'produtos' | 'clientes' | 'anuncios' | 'vendas' | 'orcamentos'): Promise<void> {
  try {
    // Busca itens de teste (que contêm "Teste" no nome)
    const response = await api.get(`/${entityType}`);
    const items = response.data || [];
    
    // Remove itens de teste
    const testItems = items.filter((item: any) => 
      item.nome?.includes('Teste') || 
      item.titulo?.includes('Teste') ||
      item.email?.includes('teste')
    );
    
    for (const item of testItems) {
      await api.delete(`/${entityType}/${item.id}`);
    }
  } catch (error) {
    console.warn(`Erro ao limpar dados de teste para ${entityType}:`, error);
  }
} 