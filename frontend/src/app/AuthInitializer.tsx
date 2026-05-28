import { useEffect, useState } from "react";

import apiClient from "@/lib/apiClient";

import { useAuthStore } from "@/store/authStore";

type Props = {
  children: React.ReactNode;
};

export function AuthInitializer({ children }: Props) {
  const logout = useAuthStore((state) => state.logout);

  const token = useAuthStore((state) => state.token);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateSession() {
      if (!token) {
        setLoading(false);

        return;
      }

      try {
        await apiClient.get("/api/auth/me");
      } catch (error) {
        console.log("SESSION EXPIRED");

        logout();
      } finally {
        setLoading(false);
      }
    }

    validateSession();
  }, [token, logout]);

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-zinc-950
          text-white
        "
      >
        <div className="text-sm tracking-[0.3em] text-zinc-500">
          CARGANDO SISTEMA...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
