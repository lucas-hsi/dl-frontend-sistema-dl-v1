// src/components/auth/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

// Componente de tela de carregamento para evitar o "pisca-pisca"
const FullPageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Carregando...</p>
    </div>
  </div>
);

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  console.log("🔐 PROTECTED: Renderizando", {
    pathname: router.pathname,
    loading,
    isAuthenticated,
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    allowedRoles
  });

  // Efeito para gerenciar o redirecionamento
  useEffect(() => {
    console.log("🔐 PROTECTED: useEffect executando", {
      loading,
      isAuthenticated,
      userRole: user?.perfil || user?.role,
      allowedRoles
    });

    // 1. A regra mais importante: se o AuthContext ainda está carregando
    //    (verificando o localStorage na primeira vez), não faça NADA. Apenas espere.
    if (loading) {
      console.log("🔐 PROTECTED: Ainda carregando, aguardando...");
      return;
    }

    // ✅ SOLUÇÃO ROBUSTA: Aguarda um pouco mais para garantir que o estado seja propagado
    const checkAuth = () => {
      console.log("🔐 PROTECTED: Verificando autenticação após delay...");
      
      // 2. Se o carregamento terminou e o usuário NÃO está autenticado,
      //    redirecione para o login.
      if (!isAuthenticated) {
        console.log("🔐 PROTECTED: Não autenticado, redirecionando para /login");
        router.replace('/login');
        return;
      }

      // 3. Se o carregamento terminou e o usuário ESTÁ autenticado,
      //    verifique se ele tem permissão para esta rota.
      if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user?.perfil || user?.role;
        console.log("🔐 PROTECTED: Verificando permissões", { userRole, allowedRoles });
        if (!userRole || !allowedRoles.includes(userRole)) {
          console.log("🔐 PROTECTED: Sem permissão, redirecionando para /");
          // Se não tem permissão, redireciona para a página inicial como fallback.
          // Você pode ajustar para redirecionar para a página correta do perfil dele se preferir.
          router.replace('/'); 
        } else {
          console.log("🔐 PROTECTED: Permissão concedida");
        }
      } else {
        console.log("🔐 PROTECTED: Sem restrições de role");
      }
    };

    // Aguarda 300ms para garantir que o estado seja propagado
    setTimeout(checkAuth, 300);
  }, [loading, isAuthenticated, user, router, allowedRoles]);

  // Lógica de renderização
  // Se o AuthContext está carregando, mostre a tela de carregamento.
  // Isso previne o "pisca-pisca" da página protegida.
  if (loading) {
    return <FullPageLoader />;
  }

  // Se não está autenticado, mostre o loader enquanto redireciona
  if (!isAuthenticated) {
    return <FullPageLoader />;
  }

  // Se o usuário está autenticado e tem permissão (verificado no useEffect),
  // mostre o conteúdo da página protegida.
  return <>{children}</>;
}
