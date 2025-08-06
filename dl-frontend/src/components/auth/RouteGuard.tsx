import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { getRedirectDestination, normalizeRole } from '@/auth/role-routes';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredPermissions = [], 
  fallback 
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Aguardar o carregamento inicial
    if (loading) return;

    // Verificar autenticação
    if (!isAuthenticated) {
      const currentPath = router.asPath;
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Se usuário já autenticado tenta acessar /login, redirecionar ao seu dashboard
    if (isAuthenticated && router.pathname === '/login') {
      const role = normalizeRole(user?.perfil || 'vendedor');
      const destination = getRedirectDestination(role);
      router.replace(destination);
      return;
    }

    // Verificar permissões se especificadas
    if (requiredPermissions.length > 0 && user) {
      const hasPermission = requiredPermissions.some(permission => 
        user.permissoes.includes(permission)
      );

      if (!hasPermission) {
        router.push('/acesso-negado');
        return;
      }
    }

    setAuthorized(true);
  }, [isAuthenticated, loading, user, requiredPermissions, router]);

  // Mostrar loading enquanto verifica
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mostrar fallback personalizado se fornecido
  if (!authorized && fallback) {
    return <>{fallback}</>;
  }

  // Mostrar conteúdo se autorizado
  return authorized ? <>{children}</> : null;
};

// Hook para verificar permissões
export const usePermission = (requiredPermissions: string[]): boolean => {
  const { user } = useAuth();
  
  if (!user || requiredPermissions.length === 0) return true;
  
  return requiredPermissions.some(permission => 
    user.permissoes.includes(permission)
  );
};

// Componente para esconder elementos baseado em permissão
interface PermissionGateProps {
  children: React.ReactNode;
  permissions: string[];
  fallback?: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ 
  children, 
  permissions, 
  fallback 
}) => {
  const hasPermission = usePermission(permissions);
  
  if (!hasPermission) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
};

// Componente para desabilitar elementos baseado em permissão
interface DisableGateProps {
  children: React.ReactNode;
  permissions: string[];
  disabled?: boolean;
}

const DisableGate: React.FC<DisableGateProps> = ({ 
  children, 
  permissions, 
  disabled = false 
}) => {
  const hasPermission = usePermission(permissions);
  const shouldDisable = disabled || !hasPermission;
  
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      disabled: shouldDisable,
      className: `${children.props.className || ''} ${shouldDisable ? 'opacity-50 cursor-not-allowed' : ''}`
    });
  }
  
  return <>{children}</>;
};

export { RouteGuard, PermissionGate, DisableGate };
export default RouteGuard; 