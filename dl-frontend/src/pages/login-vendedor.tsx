import React, { useState } from "react";
import { useRouter } from "next/router";
import { User, Lock } from "lucide-react";

export default function LoginVendedor() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(false);
    setLoading(true);
    
    try {
      // Simulação de login - substitua por chamada real ao backend
      if (email === "vendedor@dl.com" && senha === "vendedor123") {
        localStorage.setItem("perfil_autenticado", "vendedor");
        localStorage.setItem("user", JSON.stringify({
          id: 2,
          nome: "Vendedor",
          email,
          username: "",
          perfil: "vendedor",
        }));
        await router.push("/vendedor");
      } else {
        setErro(true);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErro(true);
    } finally {
      setLoading(false); // Garante que o botão saia do estado "Entrando..."
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
      <form onSubmit={handleLogin} className="bg-white/80 rounded-3xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Login do Vendedor</h1>
        <div className="w-full flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-2 bg-white/60 rounded-xl px-4 py-2 border border-green-100">
            <User className="w-5 h-5 text-green-500" />
            <input
              type="email"
              placeholder="E-mail"
              className="flex-1 bg-transparent outline-none text-green-900 placeholder:text-green-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="flex items-center gap-2 bg-white/60 rounded-xl px-4 py-2 border border-green-100">
            <Lock className="w-5 h-5 text-green-500" />
            <input
              type="password"
              placeholder="Senha"
              className="flex-1 bg-transparent outline-none text-green-900 placeholder:text-green-400"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded-xl font-bold text-white shadow transition-all duration-200 ${loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"}`}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {erro && <div className="text-red-500 text-sm mt-2 animate-pulse">E-mail ou senha inválidos</div>}
        <div className="text-xs text-green-800 mt-6 opacity-70">Powered by DL Auto Peças</div>
      </form>
    </div>
  );
} 