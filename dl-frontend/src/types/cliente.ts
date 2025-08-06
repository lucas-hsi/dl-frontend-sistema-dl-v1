// src/types/cliente.ts
// Tipos para o módulo de Gestão de Clientes

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  cpf_cnpj?: string;
  // Endereço completo
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  // Campos adicionais
  modelo_carro?: string;
  placa_veiculo?: string;
  observacoes?: string;
  data_cadastro: string;
}

export interface ClienteCreate {
  nome: string;
  telefone: string;
  email?: string;
  cpf_cnpj?: string;
  // Endereço completo
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  // Campos adicionais
  modelo_carro?: string;
  placa_veiculo?: string;
  observacoes?: string;
}

export interface ClienteUpdate extends ClienteCreate {
  // Herda todos os campos de ClienteCreate
}

export interface ClienteFilters {
  nome?: string;
  telefone?: string;
  cpf_cnpj?: string;
}

export interface ClienteSearchParams {
  termo?: string;
}

// Estados para formulários
export interface ClienteFormData extends ClienteCreate {
  // Campos adicionais para validação
  errors?: {
    [key: string]: string;
  };
}

// Resposta da API
export interface ClienteResponse {
  success: boolean;
  data?: Cliente;
  message?: string;
  error?: string;
}

export interface ClienteListResponse {
  success: boolean;
  data?: Cliente[];
  message?: string;
  error?: string;
} 