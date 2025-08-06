import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import { API_BASE } from '@/lib/api';

// --- Tipos e interfaces (sem alterações) ---
const ROLE = {
  GESTOR: 'GESTOR',
  VENDEDOR: 'VENDEDOR',
  ANUNCIOS: 'ANUNCIOS',
} as const;
type Role = typeof ROLE[keyof typeof ROLE];
interface User {
  id?: string | number;
  email: string;
  role: Role | string;
  nome: string;
  perfil: string;
  permissoes: string[];
}
interface AuthState {
  token: string | null;
  user: User | null;
}
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, profile: string) => Promise<Role>;
  logout: (opts?: { redirect?: boolean }) => void;
  refreshFromStorage: () => void;
}
interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: { message: string; detail?: string };
  meta?: any;
}
const STORAGE = { token: 'dl.auth.token', user: 'dl.auth.user' };
// --- Funções utilitárias (sem alterações) ---
const safeParseJSON = <T,>(raw: string | null): T | null => {
  if (!raw || typeof raw !== 'string' || raw === 'null' || raw === 'undefined') {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error('Falha ao fazer parse do JSON do localStorage:', error);
    return null;
  }
};
const sanitizeAuthState = (state: AuthState): AuthState => {
  const { token, user } = state;
  const hasValidToken = token && typeof token === 'string' && token.trim() !== '' && token !== 'null' && token !== 'undefined';
  const hasValidUser = user && typeof user === 'object' && !!user.email && !!user.role;
  if (hasValidToken && hasValidUser) {
    return { token: token.trim(), user };
  }
  if (token || user) {
    console.warn('Estado de autenticação inválido detectado, limpando sessão.');
  }
  return { token: null, user: null };
};
const getStorage = (): AuthState => {
  if (typeof window === 'undefined') return { token: null, user: null };
  try {
    const rawToken = localStorage.getItem(STORAGE.token);
    const rawUser = localStorage.getItem(STORAGE.user);
    
    // 🔍 DEBUG: Logs para rastrear o problema
    console.log('🔍 AuthContext - getStorage:', {
      rawToken,
      rawUser,
      legacyToken: localStorage.getItem('auth_token'),
      legacyUser: localStorage.getItem('user'),
      legacyPerfil: localStorage.getItem('perfil_autenticado')
    });
    
    // ✅ CORREÇÃO: Migração de dados legados
    let finalToken = rawToken;
    let finalUser = safeParseJSON<User>(rawUser);
    
    // Se não há dados no formato novo, mas há dados legados, migrar
    if (!finalToken && !finalUser) {
      const legacyToken = localStorage.getItem('auth_token');
      const legacyUser = localStorage.getItem('user');
      const legacyPerfil = localStorage.getItem('perfil_autenticado');
      
      console.log('🔍 AuthContext - Dados legados encontrados:', {
        legacyToken,
        legacyUser,
        legacyPerfil
      });
      
      if (legacyToken && legacyUser && legacyPerfil) {
        console.log('🔍 AuthContext - Migrando dados legados...');
        
        try {
          const userData = JSON.parse(legacyUser);
          console.log('🔍 AuthContext - UserData parseado:', userData);
          
          const migratedUser: User = {
            id: userData.id || 1,
            email: userData.email || `${legacyPerfil}@dl.com`,
            nome: userData.nome || legacyPerfil.charAt(0).toUpperCase() + legacyPerfil.slice(1),
            perfil: legacyPerfil.toUpperCase(),
            role: legacyPerfil.toUpperCase(),
            permissoes: userData.permissoes || []
          };
          
          console.log('🔍 AuthContext - Usuário migrado:', migratedUser);
          
          // Salvar no formato novo
          localStorage.setItem(STORAGE.token, legacyToken);
          localStorage.setItem(STORAGE.user, JSON.stringify(migratedUser));
          
          finalToken = legacyToken;
          finalUser = migratedUser;
          
          console.log('🔍 AuthContext - Migração concluída:', { finalToken, finalUser });
        } catch (error) {
          console.error('🔍 AuthContext - Erro na migração:', error);
        }
      }
    }
    
    const result = sanitizeAuthState({ token: finalToken, user: finalUser });
    
    console.log('🔍 AuthContext - Resultado sanitizado:', result);
    return result;
  } catch (error) {
    console.error('Erro crítico ao carregar dados do localStorage:', error);
    return { token: null, user: null };
  }
};
const setStorage = (state: AuthState) => {
  if (typeof window === 'undefined') return;
  const { token, user } = sanitizeAuthState(state);
  try {
    if (token) {
      localStorage.setItem(STORAGE.token, token);
    } else {
      localStorage.removeItem(STORAGE.token);
    }
    if (user) {
      localStorage.setItem(STORAGE.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE.user);
    }
  } catch (error) {
    console.error('Erro crítico ao salvar no localStorage:', error);
  }
};
const normalizeRole = (raw?: string | null): Role => {
    if (!raw) return ROLE.VENDEDOR;
    const v = String(raw).trim().toUpperCase();
    if (v === 'GESTOR' || v === 'ADMIN') return ROLE.GESTOR;
    if (v === 'VENDEDOR') return ROLE.VENDEDOR;
    if (v === 'ANUNCIOS' || v === 'ANUNCIANTE') return ROLE.ANUNCIOS;
    return ROLE.VENDEDOR;
};
const samePath = (a?: string, b?: string) => {
    if (!a || !b) return false;
    return a.replace(/\/+$/, '') === b.replace(/\/+$/, '');
};


const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [{ token, user }, setAuth] = useState<AuthState>({ token: null, user: null });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('🔍 AuthContext - setStorage chamado:', { token, user });
    setStorage({ token, user });
  }, [token, user]);

  useEffect(() => {
    console.log('🔍 AuthContext - Inicializando...');
    const initial = getStorage();
    console.log('🔍 AuthContext - Estado inicial:', initial);
    setAuth(initial);
    setLoading(false);
    
    const onStorage = (e: StorageEvent) => {
      console.log('🔍 AuthContext - Storage event:', e);
      if (e.key === STORAGE.token || e.key === STORAGE.user) {
        const newState = getStorage();
        console.log('🔍 AuthContext - Novo estado do storage:', newState);
        setAuth(newState);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  async function login(email: string, password: string, profile: string): Promise<Role> {
    setLoading(true);
    try {
        console.log('🔐 AuthContext - Tentando login:', { email, profile });
        
        const response = await fetch(`${API_BASE}/api/v1/login/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, profile }),
        });

        console.log('🔐 AuthContext - Resposta do servidor:', response.status);

        // --- CORREÇÃO APLICADA AQUI ---
        // Se a resposta NÃO for OK (ex: 400, 403, 404), tratamos como um erro do backend.
        if (!response.ok) {
            // Tentamos ler a mensagem de erro que o FastAPI envia no campo "detail".
            const errorData = await response.json().catch(() => ({ detail: 'Erro de comunicação com o servidor.' }));
            console.error('🔐 AuthContext - Erro do servidor:', errorData);
            // Lançamos um erro com a mensagem específica do backend.
            throw new Error(errorData.detail || 'Credenciais inválidas ou acesso negado.');
        }
        
        // Se a resposta for OK (200), processamos os dados de sucesso.
        const apiResponse: ApiResponse<{ access_token: string; user: any }> = await response.json();
        
        console.log('🔐 AuthContext - Dados da API:', apiResponse);
        
        if (!apiResponse.ok || !apiResponse.data?.access_token) {
            throw new Error(apiResponse.error?.message || 'Token inválido recebido do servidor');
        }

        const { access_token, user: userInfo } = apiResponse.data;
        const role = normalizeRole(userInfo?.role);

        const userToStore: User = {
            id: userInfo.id,
            email: String(userInfo?.email || email).trim().toLowerCase(),
            nome: userInfo.full_name || userInfo.nome || userInfo.name || 'Usuário',
            perfil: role,
            role: role,
            permissoes: userInfo.permissoes || [],
        };

        console.log('🔐 AuthContext - Usuário a ser armazenado:', userToStore);

        // ✅ CORREÇÃO: Salvar no localStorage com as chaves corretas
        localStorage.setItem('dl.auth.token', access_token);
        localStorage.setItem('dl.auth.user', JSON.stringify(userToStore));
        
        // Manter compatibilidade com sistema legado
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('perfil_autenticado', profile);
        localStorage.setItem('user', JSON.stringify(userToStore));

        setAuth(sanitizeAuthState({ token: access_token, user: userToStore }));
        
        console.log('🔐 AuthContext - Login bem-sucedido, role:', role);
        return role;

    } catch (error: any) {
        console.error("🔐 AuthContext - Falha no processo de login:", error);
        setAuth({ token: null, user: null });
        // Propaga a mensagem de erro específica para ser exibida na tela de login.
        throw error;
    } finally {
        setLoading(false);
    }
  }

  const logout = (opts?: { redirect?: boolean }) => {
    const shouldRedirect = opts?.redirect !== false;
    setAuth({ token: null, user: null });
    if (shouldRedirect && !samePath(router.asPath, '/login')) {
      router.replace('/login');
    }
  };
  
  const refreshFromStorage = () => {
    setAuth(getStorage());
  };

  const isAuthenticated = useMemo(() => {
    const result = !!(token && user);
    console.log("🔐 AUTH: isAuthenticated calculado:", { token: !!token, user: !!user, authenticated: result });
    return result;
  }, [token, user]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      logout,
      refreshFromStorage,
    }),
    [user, token, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
