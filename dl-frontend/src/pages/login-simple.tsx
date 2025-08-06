import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function LoginSimple() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>({});

  const handleLogin = async (profile: string) => {
    console.log('🔐 Tentando login para:', profile);
    setLoading(true);
    setError("");

    try {
      // Simular login (sem chamada real para API)
      console.log('✅ Login simulado com sucesso para:', profile);
      
      // ✅ CORREÇÃO: Usar as chaves corretas do AuthContext
      const token = 'token_' + Date.now();
      const userData = {
        id: 1,
        nome: profile.charAt(0).toUpperCase() + profile.slice(1),
        email: `${profile}@dl.com`,
        perfil: profile.toUpperCase(),
        role: profile.toUpperCase(),
        permissoes: []
      };
      
      console.log('🔍 Login - Dados do usuário:', userData);
      
      // Salvar dados no localStorage com as chaves corretas
      localStorage.setItem('dl.auth.token', token);
      localStorage.setItem('dl.auth.user', JSON.stringify(userData));
      
      // Manter compatibilidade com sistema legado
      localStorage.setItem('auth_token', token);
      localStorage.setItem('perfil_autenticado', profile);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('✅ Dados salvos no localStorage com chaves corretas');
      
      // Atualizar debug info
      setDebugInfo({
        'dl.auth.token': localStorage.getItem('dl.auth.token'),
        'dl.auth.user': localStorage.getItem('dl.auth.user'),
        'auth_token': localStorage.getItem('auth_token'),
        'perfil_autenticado': localStorage.getItem('perfil_autenticado'),
        'user': localStorage.getItem('user')
      });
      
      // Determinar destino
      let destination = '/vendedor'; // Default
      if (profile === 'gestor') destination = '/gestor';
      if (profile === 'anuncios') destination = '/anuncios';
      
      console.log('🎯 Redirecionando para:', destination);
      
      // Redirecionar imediatamente (sem setTimeout)
      window.location.href = destination;
      
    } catch (error) {
      console.error('❌ Erro no login:', error);
      setError('Erro no login');
    } finally {
      setLoading(false);
    }
  };

  const testButton = (profile: string) => {
    console.log('🧪 Teste de botão clicado:', profile);
    alert(`Botão ${profile} foi clicado!`);
  };

  return (
    <>
      <Head>
        <title>Login Simples | DL Auto Peças</title>
      </Head>
      
      {/* Debug Panel */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        maxWidth: '300px',
        zIndex: 1000
      }}>
        <h4>🔍 Debug Info</h4>
        <div>Loading: {loading.toString()}</div>
        <div>Error: {error || 'none'}</div>
        <div>Current URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</div>
      </div>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          maxWidth: '28rem',
          width: '100%',
          position: 'relative'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            Login Simples
          </h1>
          
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #f87171',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '0.25rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Botão de teste primeiro */}
            <button
              onClick={() => testButton('vendedor')}
              style={{
                width: '100%',
                backgroundColor: '#6b7280',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6b7280';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🧪 Teste Vendedor
            </button>
            
            <button
              onClick={() => handleLogin('vendedor')}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#9ca3af' : '#10b981',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                position: 'relative',
                zIndex: 10,
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? '🔄 Carregando...' : '🟢 Login Vendedor'}
            </button>
            
            <button
              onClick={() => handleLogin('gestor')}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                position: 'relative',
                zIndex: 10,
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? '🔄 Carregando...' : '🔵 Login Gestor'}
            </button>
            
            <button
              onClick={() => handleLogin('anuncios')}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#9ca3af' : '#eab308',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                position: 'relative',
                zIndex: 10,
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#ca8a04';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#eab308';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? '🔄 Carregando...' : '🟡 Login Anúncios'}
            </button>
          </div>
          
          <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <p>Esta é uma versão simplificada para testar o redirecionamento.</p>
            <p>Verifique o console para logs detalhados.</p>
            <p>Clique no botão de teste primeiro para verificar se os cliques funcionam.</p>
          </div>
          
          {/* Debug Info */}
          {Object.keys(debugInfo).length > 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.25rem',
              fontSize: '0.75rem'
            }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Debug Info:</h4>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 