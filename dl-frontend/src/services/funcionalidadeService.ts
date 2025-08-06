import { Funcionalidade, FuncionalidadeCreate, FuncionalidadeUpdate } from '@/types/funcionalidade';

// Dados simulados com progresso REAL baseado no que já está implementado
let funcionalidades: Funcionalidade[] = [
    // MÓDULO GESTÃO - 85% CONCLUÍDO
    {
        id: 1,
        titulo: 'Dashboard Gestor',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Painel principal com KPIs e métricas - 100% funcional',
        data_modificacao: '2025-07-24',
    },
    {
        id: 2,
        titulo: 'Gestão de Vendas por Canal',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Relatórios de vendas por canal - Implementado',
        data_modificacao: '2025-07-24',
    },
    {
        id: 3,
        titulo: 'Gestão de Vendas por Vendedor',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Relatórios de performance por vendedor - Implementado',
        data_modificacao: '2025-07-24',
    },
    {
        id: 4,
        titulo: 'Gestão de Produtos - Catálogo',
        status: 'funcional',
        responsavel: 'Cursor',
        descricao: 'Sistema de catálogo de produtos - Backend + Frontend OK',
        data_modificacao: '2025-07-23',
    },
    {
        id: 5,
        titulo: 'Gestão de Produtos - Fornecedores',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Controle de fornecedores e produtos - Implementado',
        data_modificacao: '2025-07-24',
    },
    {
        id: 6,
        titulo: 'Gestão de Produtos - Estoque',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Controle de estoque interno - Backend + DB OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 7,
        titulo: 'Gestão de Produtos - Criador Inteligente',
        status: 'em_testes',
        responsavel: 'Cursor',
        descricao: 'Criação automática de produtos com IA - Em testes',
        data_modificacao: '2025-07-23',
    },
    {
        id: 8,
        titulo: 'Gestão de Produtos - Anúncios',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Controle de anúncios de produtos - Implementado',
        data_modificacao: '2025-07-24',
    },
    {
        id: 9,
        titulo: 'Gestão de Produtos - Sucatas',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Controle de entrada e retorno de sucatas - Implementado',
        data_modificacao: '2025-07-24',
    },
    {
        id: 10,
        titulo: 'Gestão de Clientes - Lista',
        status: 'funcional',
        responsavel: 'Cursor',
        descricao: 'Listagem e gestão de clientes - Backend + Frontend OK',
        data_modificacao: '2025-07-23',
    },
    {
        id: 11,
        titulo: 'Gestão de Clientes - Fidelização',
        status: 'em_andamento',
        responsavel: 'Lucas',
        descricao: 'Programa de fidelização de clientes - Em desenvolvimento',
        data_modificacao: '2025-07-24',
    },
    {
        id: 12,
        titulo: 'Gestão de Clientes - Follow-ups',
        status: 'em_andamento',
        responsavel: 'Lucas',
        descricao: 'Sistema de follow-up com clientes - Em desenvolvimento',
        data_modificacao: '2025-07-24',
    },
    {
        id: 13,
        titulo: 'Gestão de Clientes - Devoluções',
        status: 'em_andamento',
        responsavel: 'Lucas',
        descricao: 'Controle de devoluções e vale-peça - Em desenvolvimento',
        data_modificacao: '2025-07-24',
    },
    {
        id: 14,
        titulo: 'Gestão - Análise de Dados',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Análise avançada de dados de vendas - Implementado',
        data_modificacao: '2025-07-24',
    },
    {
        id: 15,
        titulo: 'Gestão - Previsões',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Sistema de previsões de vendas - Implementado',
        data_modificacao: '2025-07-24',
    },
    {
        id: 16,
        titulo: 'Gestão - IA',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Integração de IA para decisões - Implementado',
        data_modificacao: '2025-07-24',
    },
    {
        id: 17,
        titulo: 'Gestão - Campanhas',
        status: 'em_andamento',
        responsavel: 'Lucas',
        descricao: 'Gestão de campanhas de marketing - Em desenvolvimento',
        data_modificacao: '2025-07-24',
    },
    {
        id: 18,
        titulo: 'Gestão - Relatórios',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Relatórios gerenciais completos - Implementado',
        data_modificacao: '2025-07-24',
    },
    {
        id: 19,
        titulo: 'Gestão - Atendimento',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Controle de atendimento ao cliente - Backend + WhatsApp OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 20,
        titulo: 'Gestão - Calendário',
        status: 'em_andamento',
        responsavel: 'Lucas',
        descricao: 'Calendário de atividades e eventos - Em desenvolvimento',
        data_modificacao: '2025-07-24',
    },
    {
        id: 21,
        titulo: 'Gestão - Configurações',
        status: 'em_andamento',
        responsavel: 'Lucas',
        descricao: 'Configurações do sistema - Em desenvolvimento',
        data_modificacao: '2025-07-24',
    },

    // MÓDULO VENDEDOR - 90% CONCLUÍDO
    {
        id: 22,
        titulo: 'Vendedor - Dashboard',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Painel principal do vendedor - 100% funcional',
        data_modificacao: '2025-07-24',
    },
    {
        id: 23,
        titulo: 'Vendedor - Atendimento',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Sistema de atendimento ao cliente - Backend + WhatsApp OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 24,
        titulo: 'Vendedor - Clientes',
        status: 'funcional',
        responsavel: 'Cursor',
        descricao: 'Gestão de clientes pelo vendedor - Backend + Frontend OK',
        data_modificacao: '2025-07-23',
    },
    {
        id: 25,
        titulo: 'Vendedor - Estoque',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Consulta de estoque pelo vendedor - Backend + DB OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 26,
        titulo: 'Vendedor - Histórico',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Histórico de vendas do vendedor - Backend + DB OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 27,
        titulo: 'Vendedor - Orçamentos - Lista',
        status: 'funcional',
        responsavel: 'Cursor',
        descricao: 'Listagem de orçamentos - Backend + Frontend OK',
        data_modificacao: '2025-07-23',
    },
    {
        id: 28,
        titulo: 'Vendedor - Orçamentos - Novo',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Criação de novos orçamentos - Backend + Frontend OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 29,
        titulo: 'Vendedor - Envio WhatsApp',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Envio de orçamentos via WhatsApp - API WhatsApp OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 30,
        titulo: 'Vendedor - Cotação Frete',
        status: 'funcional',
        responsavel: 'Cursor',
        descricao: 'Integração com Frenet para frete - API Frenet OK',
        data_modificacao: '2025-07-23',
    },

    // MÓDULO ANÚNCIOS - 95% CONCLUÍDO
    {
        id: 31,
        titulo: 'Anúncios - Dashboard',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Painel principal de anúncios - 100% funcional',
        data_modificacao: '2025-07-24',
    },
    {
        id: 32,
        titulo: 'Anúncios - IA - Criar Anúncio',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Criação de anúncios com IA - OpenAI + Backend OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 33,
        titulo: 'Anúncios - IA - Sugestões Preço',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Sugestões de preço com IA - OpenAI + Backend OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 34,
        titulo: 'Anúncios - Estoque - Produtos Ativos',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Gestão de produtos ativos para anúncios - Backend + DB OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 35,
        titulo: 'Anúncios - Estoque - Inativos',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Gestão de produtos inativos - Backend + DB OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 36,
        titulo: 'Anúncios - Estoque - Interno',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Estoque interno para anúncios - Backend + DB OK',
        data_modificacao: '2025-07-24',
    },
    {
        id: 37,
        titulo: 'Anúncios - Estoque - Sincronização',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Sincronização com Mercado Livre - API Mercado Livre OK',
        data_modificacao: '2025-07-24',
    },

    // INFRAESTRUTURA - 100% CONCLUÍDO
    {
        id: 38,
        titulo: 'Backend - FastAPI',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'API REST completa com autenticação JWT - 100% funcional',
        data_modificacao: '2025-07-24',
    },
    {
        id: 39,
        titulo: 'Frontend - Next.js',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Interface React/Next.js responsiva - 100% funcional',
        data_modificacao: '2025-07-24',
    },
    {
        id: 40,
        titulo: 'Banco de Dados - PostgreSQL',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Banco PostgreSQL com SQLAlchemy ORM - 100% funcional',
        data_modificacao: '2025-07-24',
    },
    {
        id: 41,
        titulo: 'Autenticação - JWT',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Sistema de login com JWT - 100% funcional',
        data_modificacao: '2025-07-24',
    },
    {
        id: 42,
        titulo: 'WhatsApp Business API',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Integração WhatsApp Business - 100% funcional',
        data_modificacao: '2025-07-24',
    },
    {
        id: 43,
        titulo: 'IA - OpenAI',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Integração OpenAI para anúncios - 100% funcional',
        data_modificacao: '2025-07-24',
    },
    {
        id: 44,
        titulo: 'Frete - Frenet API',
        status: 'funcional',
        responsavel: 'Lucas',
        descricao: 'Integração Frenet para frete - 100% funcional',
        data_modificacao: '2025-07-24',
    },

    // PENDENTES - DEPLOY E MELHORIAS
    {
        id: 45,
        titulo: 'Deploy - Produção',
        status: 'em_andamento',
        responsavel: 'Lucas',
        descricao: 'Deploy em nuvem (AWS/Azure/GCP) - Em desenvolvimento',
        data_modificacao: '2025-07-24',
    },
    {
        id: 46,
        titulo: 'SSL - Certificado',
        status: 'em_andamento',
        responsavel: 'Lucas',
        descricao: 'Certificado SSL para produção - Em desenvolvimento',
        data_modificacao: '2025-07-24',
    },
    {
        id: 47,
        titulo: 'Backup - Automático',
        status: 'em_andamento',
        responsavel: 'Lucas',
        descricao: 'Sistema de backup automático - Em desenvolvimento',
        data_modificacao: '2025-07-24',
    },
    {
        id: 48,
        titulo: 'Monitoramento - Logs',
        status: 'em_andamento',
        responsavel: 'Lucas',
        descricao: 'Sistema de monitoramento e logs - Em desenvolvimento',
        data_modificacao: '2025-07-24',
    },
];

export function listarFuncionalidades(): Funcionalidade[] {
    return funcionalidades;
}

export function adicionarFuncionalidade(data: FuncionalidadeCreate): Funcionalidade {
    const nova: Funcionalidade = {
        id: funcionalidades.length ? Math.max(...funcionalidades.map(f => f.id)) + 1 : 1,
        status: data.status || 'em_andamento',
        responsavel: data.responsavel || 'Lucas',
        data_modificacao: new Date().toISOString().slice(0, 10),
        ...data,
    };
    funcionalidades = [nova, ...funcionalidades];
    return nova;
}

export function atualizarFuncionalidade(id: number, data: FuncionalidadeUpdate): Funcionalidade | null {
    const idx = funcionalidades.findIndex(f => f.id === id);
    if (idx === -1) return null;
    funcionalidades[idx] = {
        ...funcionalidades[idx],
        ...data,
        data_modificacao: new Date().toISOString().slice(0, 10),
    };
    return funcionalidades[idx];
}

export function marcarComoConcluido(id: number): Funcionalidade | null {
    return atualizarFuncionalidade(id, { id, status: 'funcional' });
}

export function solicitarAlteracao(id: number, observacao: string): Funcionalidade | null {
    // Aqui apenas simula a alteração, pode ser expandido para registrar histórico
    return atualizarFuncionalidade(id, { id, status: 'em_testes', descricao: observacao });
} 