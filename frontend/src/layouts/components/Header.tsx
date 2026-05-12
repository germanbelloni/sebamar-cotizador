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
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            border-lime-400/20
            bg-lime-400/10
            text-xl
            font-bold
            text-lime-400
          "
        >
          S
        </div>

        <div>
          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
            "
          >
            {user?.empresa || empresa.nombre}
          </h2>

          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            {moduloActual}
          </p>
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
              uppercase
              tracking-wide
              text-muted-foreground
            "
          >
            {user?.role}
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
