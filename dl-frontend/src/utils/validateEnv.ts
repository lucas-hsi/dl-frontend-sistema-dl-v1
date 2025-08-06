/**
 * Validação de variáveis de ambiente para o frontend
 * Garante que todas as variáveis NEXT_PUBLIC_* estão definidas em runtime
 */

import { z } from 'zod';

// Schema de validação para runtime
const runtimeEnvSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL deve ser uma URL válida'),
    NEXT_PUBLIC_ENV: z.enum(['development', 'production', 'test']).default('development'),
    NEXT_PUBLIC_APP_NAME: z.string().min(1, 'NEXT_PUBLIC_APP_NAME é obrigatório'),
    NEXT_PUBLIC_APP_VERSION: z.string().min(1, 'NEXT_PUBLIC_APP_VERSION é obrigatório'),
});

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;

/**
 * Valida as variáveis de ambiente em runtime
 * @returns Objeto com as variáveis validadas
 * @throws Error se alguma variável obrigatória estiver faltando
 */
export function validateRuntimeEnv(): RuntimeEnv {
    try {
        const env = {
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
            NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
            NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
            NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
        };

        return runtimeEnvSchema.parse(env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
            throw new Error(`❌ Variáveis de ambiente inválidas: ${missingVars}`);
        }
        throw error;
    }
}

/**
 * Verifica se todas as variáveis de ambiente estão configuradas
 * @returns true se todas as variáveis estão OK
 */
export function checkEnvironment(): boolean {
    try {
        validateRuntimeEnv();
        return true;
    } catch (error) {
        console.error('❌ Erro na validação do ambiente:', error);
        return false;
    }
}

/**
 * Obtém informações de debug do ambiente (apenas em desenvolvimento)
 */
export function getEnvironmentInfo() {
    if (process.env.NODE_ENV === 'production') {
        return { environment: 'production' };
    }

    try {
        const env = validateRuntimeEnv();
        return {
            environment: env.NEXT_PUBLIC_ENV,
            apiUrl: env.NEXT_PUBLIC_API_URL,
            appName: env.NEXT_PUBLIC_APP_NAME,
            appVersion: env.NEXT_PUBLIC_APP_VERSION,
            nodeEnv: process.env.NODE_ENV,
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            nodeEnv: process.env.NODE_ENV,
        };
    }
}