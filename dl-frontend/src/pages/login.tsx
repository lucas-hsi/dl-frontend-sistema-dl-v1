import { AnimatePresence, motion } from "framer-motion";
import { Megaphone, Shield, User } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const profiles = [
  {
    key: "gestor",
    label: "Gestor",
    icon: <Shield className="w-8 h-8 text-blue-400" />,
    route: "/gestor",
    desc: "Acesso administrativo para gestão de vendas e equipe."
  },
  {
    key: "vendedor",
    label: "Vendedor",
    icon: <User className="w-8 h-8 text-green-400" />,
    route: "/vendedor",
    desc: "Acesso para vendedores realizarem orçamentos e vendas."
  },
  {
    key: "anuncios",
    label: "Anúncios",
    icon: <Megaphone className="w-8 h-8 text-yellow-400" />,
    route: "/anuncios",
    desc: "Acesso para equipe de anúncios e marketing digital."
  },
];

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [active, setActive] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const [email, setEmail] = useState('gestor@dl.com');
  const [password, setPassword] = useState('admin_password_segura');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const animationProps = useMemo(() => ({
    active,
    submitting
  }), [active, submitting]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    
    setSubmitting(true);
    setError(null);

    try {
      const selectedProfileKey = profiles[active].key;
      console.log('🔐 Login - Tentando login para:', selectedProfileKey);
      
      const userRole = await login(email, password, selectedProfileKey);
      
      const targetRoute = getRouteByRole(userRole);
      console.log('🔐 Login - Redirecionando para:', targetRoute);

      // ✅ CORREÇÃO: Usar o mesmo sistema que está funcionando no login-simple
      // Redirecionar imediatamente usando window.location.href
      window.location.href = targetRoute;
      
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação. Verifique suas credenciais.');
      console.error("🔐 Login - Erro de login:", err);
      toast.error(err.message || 'Erro ao fazer login');
      
      // Libera o botão em caso de erro.
      setSubmitting(false);
    }
  };

  // Esta função não é mais necessária aqui, pois a validação foi para o backend.
  /* const validateProfilePermission = (userRole: string, selectedProfile: string): boolean => {
    const roleToProfile = {
      'GESTOR': 'gestor',
      'VENDEDOR': 'vendedor', 
      'ANUNCIOS': 'anuncios'
    };
    return roleToProfile[userRole as keyof typeof roleToProfile] === selectedProfile;
  };
  */

  const getRouteByRole = (role: string): string => {
    const roleRoutes = {
      'GESTOR': '/gestor',
      'VENDEDOR': '/vendedor',
      'ANUNCIOS': '/anuncios'
    };
    // Esta tipagem garante ao TypeScript que estamos usando as chaves corretas.
    return roleRoutes[role as keyof typeof roleRoutes] || '/login';
  };

  // O resto do seu código JSX (visual) permanece 100% intacto.
  if (!isClient) {
    return (
      <>
        <Head>
          <title>Login | DL Auto Peças</title>
        </Head>
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col justify-center items-center px-4 relative overflow-hidden">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Login | DL Auto Peças</title>
      </Head>
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col justify-center items-center px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(59,130,246,0.1) 0%, transparent 50%)`,
            backdropFilter: "blur(100px)"
          }}
        />

        <div className="relative z-10 mb-12">
          <motion.h1
            animate={{
              filter: active !== 0 ? "blur(8px)" : "blur(0px)",
              opacity: active !== 0 ? 0.5 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-2 tracking-tight drop-shadow-lg select-none transition-all duration-300"
          >
            DL Auto Peças
          </motion.h1>
          <p className="text-lg text-gray-600 text-center select-none">Escolha seu perfil de acesso</p>
        </div>

        <div className="relative flex justify-center items-center h-[380px] w-full max-w-xl z-20">
          <AnimatePresence>
            {profiles.map((profile, idx) => (
              <motion.div
                key={profile.key}
                initial={false}
                animate={{
                  scale: idx === active ? 1 : 0.92,
                  x: idx === active ? 0 : idx < active ? -80 : 80,
                  opacity: idx === active ? 1 : 0.5,
                  filter: idx === active ? "blur(0px)" : "blur(8px)",
                  zIndex: idx === active ? 30 : 10,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                  scale: { duration: 0.3 },
                  x: { duration: 0.4 },
                  opacity: { duration: 0.3 },
                  filter: { duration: 0.3 },
                  type: "spring",
                  stiffness: 200,
                  damping: 25
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  margin: "auto",
                  width: "90%",
                  maxWidth: 380,
                }}
              >
                <form onSubmit={(e) => { handleLogin(e); }} className="w-full">
                  <div
                    className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#1a232e] to-[#2d3748] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 min-h-[320px] transition-all duration-300 ${idx === active ? "shadow-2xl" : "shadow-lg"}`}
                    style={{
                      minHeight: 320,
                      boxShadow: idx === active
                        ? "0 25px 60px rgba(0,0,0,0.4), 0 15px 35px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2)"
                        : "0 8px 20px rgba(0,0,0,0.2)"
                    }}
                  >
                    <div className="mb-4">{profile.icon}</div>
                    <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight select-none">{profile.label}</h2>
                    <p className="text-sm text-gray-300 text-center mb-4 select-none">{profile.desc}</p>
                    
                    <div className="w-full flex flex-col gap-3 mb-6">
                      <input
                        type="email"
                        autoComplete="username"
                        placeholder="E-mail"
                        data-qa="login-email"
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-md transition-all duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={submitting}
                      />
                      <input
                        type="password"
                        autoComplete="current-password"
                        placeholder="Senha"
                        data-qa="login-password"
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-md transition-all duration-200"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={submitting}
                      />
                      <div className="flex justify-end">
                        <a
                          href="#"
                          className="text-xs text-gray-400 hover:underline hover:text-gray-300 transition-all duration-200"
                          tabIndex={idx === active ? 0 : -1}
                        >
                          Esqueci minha senha
                        </a>
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                    )}

                    <motion.button
                      type="submit"
                      whileHover={{
                        scale: submitting ? 1 : 1.04,
                        boxShadow: submitting ? "0 4px 16px 0 rgba(31,38,135,0.1)" : "0 8px 32px 0 rgba(31,38,135,0.18)"
                      }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className={`w-full px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        submitting 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                      }`}
                      disabled={submitting}
                      data-qa="login-Entrar"
                      aria-busy={submitting}
                    >
                      {submitting ? 'Entrando...' : 'Entrar'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="relative z-30 flex justify-center items-center gap-6 mt-10">
          {profiles.map((profile, idx) => (
            <motion.button
              key={profile.key}
              whileHover={{ scale: submitting ? 1 : 1.1 }}
              whileTap={{ scale: submitting ? 1 : 0.95 }}
              animate={{
                scale: active === idx ? 1.25 : 1,
                y: active === idx ? -8 : 0,
              }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut",
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 focus:outline-none bg-gradient-to-b from-[#1a232e] to-[#2d3748] border border-white/10 ${
                active === idx ? "ring-2 ring-green-400" : ""
              } ${submitting ? "cursor-not-allowed opacity-50" : ""}`}
              style={{
                boxShadow: active === idx
                  ? "0 35px 70px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)"
                  : "0 25px 50px rgba(0,0,0,0.3), 0 15px 30px rgba(0,0,0,0.2), 0 8px 15px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05)"
              }}
              onClick={() => !submitting && setActive(idx)}
              aria-label={`Selecionar perfil ${profile.label}`}
              disabled={submitting}
            >
              {profile.key === "gestor" && <Shield className="w-7 h-7 text-blue-400" />}
              {profile.key === "vendedor" && <User className="w-7 h-7 text-green-400" />}
              {profile.key === "anuncios" && <Megaphone className="w-7 h-7 text-yellow-400" />}
            </motion.button>
          ))}
        </div>

        <div className="fixed left-6 bottom-6 z-10 transform -rotate-90 origin-left">
          <div className="flex flex-col items-end gap-1">
            <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
              Sistema desenvolvido por Lucas Rocha
            </p>
            <p className="text-xs text-gray-400 whitespace-nowrap">
              © 2024 DL Auto Peças
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
