import { Moon, Sun, LogOut } from "lucide-react";

import { useTheme } from "next-themes";

import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { ClienteForm } from "@/features/clientes/components/ClienteForm";

import { useAuthStore } from "@/store/authStore";

import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";

type Props = {
  empresa: Empresa;

  cliente: Cliente;

  setCliente: React.Dispatch<React.SetStateAction<Cliente>>;
};

const MODULOS: Record<string, string> = {
  "/": "Ventanas Herrero",

  "/rajas": "Rajas",

  "/puertas": "Puertas",

  "/postigones": "Postigones",

  "/patagonicas": "Patagónicas",

  "/mosquiteros": "Mosquiteros",

  "/portones": "Portones",

  "/superficies": "Superficies",
};

export function Header({ empresa, cliente, setCliente }: Props) {
  const { theme, setTheme } = useTheme();

  const location = useLocation();

  const logout = useAuthStore((state) => state.logout);

  const user = useAuthStore((state) => state.user);

  const isDark = theme === "dark";

  const moduloActual = MODULOS[location.pathname] || "Cotizador";

  return (
    <header
      className="
        flex
        items-center
        justify-between
        border-b
        border-border
        bg-card/30
        px-6
        py-4
        backdrop-blur
      "
    >
      {/* 🏢 EMPRESA + MODULO */}
      <div className="flex items-center gap-4">
        {/* 🎨 LOGO PLACEHOLDER */}
        <div
          className="
    flex
    h-20
    w-20
    items-center
    justify-center
    overflow-hidden
    rounded-2xl
    border
    border-border
    bg-white
    p-1
  "
        >
          {user?.logo ? (
            <img
              src={user.logo}
              alt="logo"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xl font-bold">
              {user?.nombreEmpresa?.charAt(0) || "S"}
            </span>
          )}
        </div>

        <div>
          <h2
            className="
    text-2xl
    font-bold
    tracking-tight
  "
          >
            {user?.nombreEmpresa || user?.empresa || empresa.nombre}
          </h2>
        </div>
      </div>

      {/* 👤 USER */}
      <div className="flex items-center gap-4">
        <ClienteForm cliente={cliente} setCliente={setCliente} />

        <div
          className="
            hidden
            rounded-2xl
            border
            border-border
            bg-background/60
            px-4
            py-2
            md:flex
            md:flex-col
          "
        >
          <span
            className="
              text-sm
              font-semibold
            "
          >
            {user?.nombre}
          </span>

          <span
            className="
    text-xs
    tracking-wide
    text-muted-foreground
  "
          >
            {user?.role === "superadmin"
              ? "Superadministrador"
              : user?.role === "admin"
                ? "Administrador"
                : `Vendedor de ${user?.ownerId?.nombre || "Empresa"}`}
          </span>
        </div>

        {/* 🌙 THEME */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* 🚪 LOGOUT */}
        <Button variant="outline" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
