import { usePermissions } from '@/hooks/usePermissions';
import { motion } from 'framer-motion';
import { Lock, Shield, XCircle } from 'lucide-react';
import React from 'react';

interface PermissionGuardProps {
    children: React.ReactNode;
    requiredPermission?: string;
    requiredRole?: 'VENDEDOR' | 'ANUNCIANTE' | 'GESTOR';
    fallback?: React.ReactNode;
}

export default function PermissionGuard({
    children,
    requiredPermission,
    requiredRole,
    fallback
}: PermissionGuardProps) {
    const { hasPermission, hasRole, isAuthenticated, user } = usePermissions();



    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <Lock className="mx-auto text-red-500 mb-4" size={64} />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
                    <p className="text-gray-600 mb-6">
                        Você precisa estar logado para acessar esta página.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">
                            <strong>Status:</strong> Não autenticado
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Verificar role específico (prioridade sobre permissão)
    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <XCircle className="mx-auto text-red-500 mb-4" size={64} />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
                    <p className="text-gray-600 mb-6">
                        Você não tem o nível de acesso necessário para esta página.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">
                            <strong>Nível necessário:</strong> {requiredRole}
                        </p>
                        <p className="text-red-800 text-sm mt-1">
                            <strong>Seu nível:</strong> {user?.perfil || 'N/A'}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Verificar permissão específica
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <Shield className="mx-auto text-orange-500 mb-4" size={64} />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Permissão Insuficiente</h1>
                    <p className="text-gray-600 mb-6">
                        Você não tem a permissão necessária para acessar esta página.
                    </p>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-orange-800 text-sm">
                            <strong>Permissão necessária:</strong> {requiredPermission}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Renderizar fallback customizado se fornecido
    if (fallback) {
        return <>{fallback}</>;
    }

    // Se passou por todas as verificações, renderizar o conteúdo
    return <>{children}</>;
} 