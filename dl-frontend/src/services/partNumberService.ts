// src/services/partNumberService.ts
// 🎯 SERVICE CENTRALIZADO - ÚNICA FONTE DE VERDADE PARA PART NUMBER
// Todas as operações de busca de Part Number devem passar por este service

import { API_CONFIG } from '@/config/api';

export interface VeiculoCompativel {
  marca: string;
  modelo: string;
  ano: string;
}

export interface PartNumberResponse {
  descricao: string;
  veiculos_compativeis: VeiculoCompativel[];
  status: "encontrado" | "nao_encontrado";
  fonte_dados: string;
  recomendacao: "criar_anuncio" | "ja_esta_no_estoque";
  descricao_ia?: string;
}

export interface PartNumberRequest {
  codigo_oem: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export class PartNumberService {
  /**
   * 🎯 PONTO ÚNICO DE CONTROLE DO PART NUMBER
   * Todas as operações de busca de Part Number devem passar por este service
   */

  /**
   * Busca dados de um Part Number específico
   */
  static async buscarPartNumber(codigoOem: string): Promise<PartNumberResponse> {
    try {
      console.log(`🔍 Buscando Part Number: ${codigoOem}`);

      const url = `${API_CONFIG.BASE_URL}/api/v1/partnumber/buscar`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dl.auth.token') || ''}`
        },
        body: JSON.stringify({ codigo_oem: codigoOem })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Erro ao buscar Part Number: ${response.statusText}`;
        throw new Error(`${response.status}: ${errorMessage}`);
      }

      const resultado: ApiResponse<PartNumberResponse> = await response.json();
      
      // O backend retorna diretamente o PartNumberResponse, não dentro de um objeto ApiResponse
      if (resultado && typeof resultado === 'object' && 'descricao' in resultado) {
        const r = resultado as unknown as PartNumberResponse;
        console.log(`✅ Part Number encontrado: ${r.descricao} (Fonte: ${r.fonte_dados})`);
        return r;
      }
      
      // Fallback para formato ApiResponse
      if (resultado.ok && resultado.data) {
        console.log(`✅ Part Number encontrado: ${resultado.data.descricao} (Fonte: ${resultado.data.fonte_dados})`);
        return resultado.data;
      }

      throw new Error('Formato de resposta inválido do servidor');

    } catch (error) {
      console.error('❌ Erro ao buscar Part Number:', error);
      throw error;
    }
  }

  /**
   * Valida se um código OEM tem formato válido
   */
  static validarCodigoOem(codigo: string): boolean {
    // Remove espaços e converte para maiúsculo
    const codigoLimpo = codigo.trim().toUpperCase();
    
    // Deve ter pelo menos 3 caracteres
    if (codigoLimpo.length < 3) {
      return false;
    }

    // Deve conter apenas letras, números e alguns caracteres especiais
    const regex = /^[A-Z0-9\-\.\/\s]+$/;
    return regex.test(codigoLimpo);
  }

  /**
   * Formata código OEM para exibição
   */
  static formatarCodigoOem(codigo: string): string {
    return codigo.trim().toUpperCase();
  }

  /**
   * Obtém informações sobre a fonte dos dados
   */
  static obterInfoFonte(fonte: string): { nome: string; cor: string; icone: string } {
    const fontes: Record<string, { nome: string; cor: string; icone: string }> = {
      'Bosch': { nome: 'Bosch', cor: 'text-blue-600', icone: '🔧' },
      'Mister Auto': { nome: 'Mister Auto', cor: 'text-green-600', icone: '🛠️' },
      'Auto Peças Molina': { nome: 'Auto Peças Molina', cor: 'text-orange-600', icone: '⚙️' },
      'Auto Parts Online': { nome: 'Auto Parts Online', cor: 'text-purple-600', icone: '🔩' },
      'Peca Hoje': { nome: 'Peca Hoje', cor: 'text-red-600', icone: '🚗' },
      'OpenAI': { nome: 'IA OpenAI', cor: 'text-indigo-600', icone: '🤖' },
      'Manus': { nome: 'IA Manus', cor: 'text-teal-600', icone: '🧠' },
      'Consolidado': { nome: 'Múltiplas Fontes', cor: 'text-gray-600', icone: '🔗' }
    };

    return fontes[fonte] || { nome: fonte, cor: 'text-gray-600', icone: '📋' };
  }

  /**
   * Formata veículos compatíveis para exibição
   */
  static formatarVeiculosCompativeis(veiculos: VeiculoCompativel[]): string {
    if (!veiculos || veiculos.length === 0) {
      return 'Nenhum veículo compatível encontrado';
    }

    if (veiculos.length === 1) {
      const v = veiculos[0];
      return `${v.marca} ${v.modelo} (${v.ano})`;
    }

    if (veiculos.length <= 3) {
      return veiculos.map(v => `${v.marca} ${v.modelo} (${v.ano})`).join(', ');
    }

    const primeiros = veiculos.slice(0, 2);
    const resto = veiculos.length - 2;
    return `${primeiros.map(v => `${v.marca} ${v.modelo} (${v.ano})`).join(', ')} e mais ${resto} veículo(s)`;
  }

  /**
   * Verifica se a resposta é completa
   */
  static isRespostaCompleta(resposta: PartNumberResponse): boolean {
    return resposta.status === 'encontrado' &&
           Boolean(resposta.descricao) &&
           Array.isArray(resposta.veiculos_compativeis) &&
           resposta.veiculos_compativeis.length > 0;
  }

  /**
   * Verifica se a resposta é parcial
   */
  static isRespostaParcial(resposta: PartNumberResponse): boolean {
    return resposta.status === 'encontrado' && (
      Boolean(resposta.descricao) ||
      (Array.isArray(resposta.veiculos_compativeis) && resposta.veiculos_compativeis.length > 0)
    );
  }
}
