// src/services/clienteService.ts
// Serviço para operações com clientes

import { Cliente, ClienteCreate, ClienteUpdate, ClienteFilters, ClienteSearchParams } from '../types/cliente';
import { API_CONFIG } from '@/config/api'; // [AJUSTE 2024] Centralização da base URL

export class ClienteService {
  // Buscar todos os clientes com filtros opcionais
  static async buscarClientes(filters?: ClienteFilters): Promise<Cliente[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.nome) params.append('nome', filters.nome);
      if (filters?.telefone) params.append('telefone', filters.telefone);
      if (filters?.cpf_cnpj) params.append('cpf_cnpj', filters.cpf_cnpj);
      // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
      const url = `${API_CONFIG.BASE_URL}/clientes/?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao buscar clientes: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  // Buscar cliente por ID
  static async buscarClientePorId(id: number): Promise<Cliente> {
    try {
      // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
      const response = await fetch(`${API_CONFIG.BASE_URL}/clientes/${id}/`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Cliente não encontrado');
        }
        throw new Error(`Erro ao buscar cliente: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  // Criar novo cliente
  static async criarCliente(cliente: ClienteCreate): Promise<Cliente> {
    try {
      // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
      const url = `${API_CONFIG.BASE_URL}/clientes/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        const erroTexto = await response.text();
        throw new Error(`Erro da API: ${response.status} - ${erroTexto}`);
      }
      return await response.json();
    } catch (error: any) {
      if (typeof window !== 'undefined' && error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando e acessível na porta 8000');
      }
      if (error instanceof TypeError && error.message.includes('Invalid URL')) {
        throw new Error('URL da API inválida. Verifique a configuração da variável de ambiente.');
      }
      throw error;
    }
  }

  // Alias para cadastrarCliente (mantém compatibilidade)
  static async cadastrarCliente(cliente: ClienteCreate): Promise<Cliente> {
    return this.criarCliente(cliente);
  }

  // Atualizar cliente existente
  static async editarCliente(id: number, cliente: ClienteUpdate): Promise<Cliente> {
    try {
      // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
      const response = await fetch(`${API_CONFIG.BASE_URL}/clientes/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erro ao atualizar cliente: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  // Excluir cliente
  static async excluirCliente(id: number): Promise<void> {
    try {
      // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
      const response = await fetch(`${API_CONFIG.BASE_URL}/clientes/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erro ao excluir cliente: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }

  // Buscar clientes por termo (nome, telefone ou CPF/CNPJ)
  static async buscarClientesPorTermo(termo: string): Promise<Cliente[]> {
    try {
      if (!termo || termo.trim().length === 0) {
        return [];
      }
      // [AJUSTE 2024] Uso padronizado de API_CONFIG.BASE_URL
      const url = `${API_CONFIG.BASE_URL}/clientes/buscar/?termo=${encodeURIComponent(termo)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao buscar clientes: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar clientes por termo:', error);
      throw error;
    }
  }

  // Validação de CPF/CNPJ
  static validarCPFCNPJ(cpf_cnpj: string): boolean {
    const numeros = cpf_cnpj.replace(/\D/g, '');
    if (numeros.length !== 11 && numeros.length !== 14) {
      return false;
    }
    return true;
  }

  // Validação de telefone
  static validarTelefone(telefone: string): boolean {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length >= 10 && numeros.length <= 11;
  }

  // Validação de email
  static validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Formatar CPF/CNPJ para exibição
  static formatarCPFCNPJ(cpf_cnpj: string): string {
    const numeros = cpf_cnpj.replace(/\D/g, '');
    if (numeros.length === 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numeros.length === 14) {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cpf_cnpj;
  }

  // Formatar telefone para exibição
  static formatarTelefone(telefone: string): string {
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }
} 