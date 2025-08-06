// dl-frontend/src/config/env.ts - VERSÃO CORRIGIDA E SEGURA

import { z } from 'zod';

// 1. Define o schema. A URL da API agora é obrigatória e não tem valor padrão fixo.
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().min(1, { message: 'A variável de ambiente NEXT_PUBLIC_API_URL é obrigatória.' }).default('http://127.0.0.1:8000'),
  NEXT_PUBLIC_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

// 2. Valida as variáveis de ambiente do sistema durante o build.
// Se NEXT_PUBLIC_API_URL não for fornecida, o processo de build irá falhar,
// nos protegendo de um deploy com configuração incorreta.
const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
});

// 3. Exporta as funções que o resto da aplicação DEVE usar.
export const getApiUrl = () => env.NEXT_PUBLIC_API_URL;
export const isDevelopment = () => env.NEXT_PUBLIC_ENV === 'development';
export const isProduction = () => env.NEXT_PUBLIC_ENV === 'production';