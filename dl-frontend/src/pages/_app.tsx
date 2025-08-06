// src/pages/_app.tsx

import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { VendaProvider } from "@/contexts/VendaContext";

import "@/styles/globals.css";

// Guard centralizado (não bloquear /login)
function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, isAuthenticated, user } = useAuth();
  const path = router.asPath || "/";

  const samePath = (a?: string, b?: string) =>
    String(a || "").replace(/\/+$/, "") === String(b || "").replace(/\/+$/, "");
  const normRole = (r?: string | null) => String(r || "").trim().toUpperCase();
  const homeByRole = (role?: string | null) => {
    const r = normRole(role);
    if (r === "GESTOR") return "/gestor";
    if (r === "VENDEDOR") return "/vendedor";
    if (r === "ANUNCIOS" || r === "ANUNCIANTE") return "/anuncios";
    return "/";
  };

  const requiredRole: "GESTOR" | "VENDEDOR" | "ANUNCIOS" | null =
    path.startsWith("/gestor") ? "GESTOR"
    : path.startsWith("/vendedor") ? "VENDEDOR"
    : path.startsWith("/anuncios") ? "ANUNCIOS"
    : null;

  useEffect(() => {
    if (!router.isReady) return;

    // ✅ CORREÇÃO: Não bloquear páginas de teste e login-simple
    if (path.startsWith("/login") || path.startsWith("/test-") || path === "/login-simple") {
      if (!loading && isAuthenticated && path.startsWith("/login")) {
        const target = homeByRole(user?.role);
        if (!samePath(path, target)) router.replace(target);
      }
      return;
    }

    // Demais rotas protegidas
    if (loading) return; // evita falso negativo durante hidratação
    const role = normRole(user?.role);

    if (requiredRole) {
      if (!isAuthenticated) {
        if (!samePath(path, "/login")) router.replace("/login");
        return;
      }
      const mismatch =
        (requiredRole === "GESTOR" && role !== "GESTOR") ||
        (requiredRole === "VENDEDOR" && role !== "VENDEDOR") ||
        (requiredRole === "ANUNCIOS" && role !== "ANUNCIOS" && role !== "ANUNCIANTE");

      if (mismatch) {
        const target = homeByRole(role);
        if (!samePath(path, target)) router.replace(target);
        return;
      }
    }
  }, [router.isReady, path, loading, isAuthenticated, user?.role]);

  // Splash somente fora do /login e páginas de teste
  if (loading && !path.startsWith("/login") && !path.startsWith("/test-") && path !== "/login-simple") {
    return (
      <div style={{ display:"grid", placeItems:"center", height:"100vh" }}>
        <div>Carregando…</div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <VendaProvider>
        <Guard>
          <Component {...pageProps} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: "#363636", color: "#fff" },
              success: { style: { background: "#059669" } },
              error: { style: { background: "#DC2626" } },
            }}
          />
        </Guard>
      </VendaProvider>
    </AuthProvider>
  );
}
