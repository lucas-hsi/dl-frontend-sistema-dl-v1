export type UserRole = 'admin' | 'gestor' | 'vendedor' | 'anuncios';

export const DASHBOARD_BY_ROLE: Record<UserRole, string> = {
  admin: '/gestor',
  gestor: '/gestor',
  vendedor: '/vendedor',
  anuncios: '/anuncios',
};

// Função para determinar o destino baseado no role e next parameter
export const getRedirectDestination = (role: UserRole, next?: string): string => {
  // Se existe next parameter, priorizar ele
  if (next) {
    return next;
  }
  
  // Senão, usar o mapa de destinos por role
  return DASHBOARD_BY_ROLE[role];
};

// Função para normalizar role (converter variações para o padrão)
export const normalizeRole = (role: string): UserRole => {
  const normalized = role.toLowerCase();
  
  switch (normalized) {
    case 'admin':
    case 'administrador':
      return 'admin';
    case 'gestor':
    case 'gerente':
      return 'gestor';
    case 'vendedor':
    case 'venda':
      return 'vendedor';
    case 'anuncios':
    case 'anunciante':
    case 'marketing':
      return 'anuncios';
    default:
      return 'vendedor'; // fallback seguro
  }
}; 