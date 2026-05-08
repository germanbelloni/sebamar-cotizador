import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import { ClienteForm } from "@/features/clientes/components/ClienteForm";

import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";

type Props = {
  empresa: Empresa;

  cliente: Cliente;

  setCliente: React.Dispatch<React.SetStateAction<Cliente>>;
};

const moduloActual = "Ventanas Herrero";

export function Header({ empresa, cliente, setCliente }: Props) {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

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
      <div>
        <h2 className="text-2xl font-bold">
          {empresa.nombre} · {moduloActual}
        </h2>

        <p className="text-sm text-muted-foreground">
          Configuración y cotización
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ClienteForm cliente={cliente} setCliente={setCliente} />

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
