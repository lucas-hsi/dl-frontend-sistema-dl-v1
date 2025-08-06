// src/types/funcionalidade.ts
// Tipos para o Painel de Verificação de Funcionalidades

export type FuncionalidadeStatus = 'funcional' | 'em_andamento' | 'em_testes';

export interface Funcionalidade {
    id: number;
    titulo: string;
    status: FuncionalidadeStatus;
    responsavel: string;
    descricao: string;
    data_modificacao: string; // ISO date string
}

export interface FuncionalidadeCreate {
    titulo: string;
    status?: FuncionalidadeStatus;
    responsavel?: string;
    descricao: string;
}

export interface FuncionalidadeUpdate {
    id: number;
    titulo?: string;
    status?: FuncionalidadeStatus;
    responsavel?: string;
    descricao?: string;
    data_modificacao?: string;
} 