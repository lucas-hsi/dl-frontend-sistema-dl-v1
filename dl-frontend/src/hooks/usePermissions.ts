import { useAuth } from "@/contexts/AuthContext";

export function usePermissions() {
    const { user } = useAuth();

    const hasPermission = (permission: string): boolean => {
        if (!user) return false;
        return user.permissoes.includes(permission);
    };

    const hasRole = (role: 'VENDEDOR' | 'ANUNCIANTE' | 'GESTOR'): boolean => {
        if (!user) return false;
        return user.perfil === role;
    };

    const canAccessEquipe = (): boolean => {
        return hasRole('GESTOR');
    };

    const canAccessAnuncios = (): boolean => {
        return hasRole('GESTOR') || hasRole('ANUNCIANTE');
    };

    const canAccessPerformance = (): boolean => {
        return hasRole('GESTOR');
    };

    const canManageVendedores = (): boolean => {
        return hasRole('GESTOR');
    };

    const canCreateAnuncios = (): boolean => {
        return hasRole('GESTOR') || hasRole('ANUNCIANTE');
    };

    const canViewRelatorios = (): boolean => {
        return hasRole('GESTOR');
    };

    const canManageConfiguracoes = (): boolean => {
        return hasRole('GESTOR');
    };

    return {
        hasPermission,
        hasRole,
        canAccessEquipe,
        canAccessAnuncios,
        canAccessPerformance,
        canManageVendedores,
        canCreateAnuncios,
        canViewRelatorios,
        canManageConfiguracoes,
        user,
        isAuthenticated: !!user,
    };
} 