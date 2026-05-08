import { useLocation } from "react-router-dom";

import { PrintableBudget } from "@/features/print/components/PrintableBudget";

import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";
import type { VentanaItem } from "@/features/ventanas/types";
import type { VentanaConfig } from "@/features/ventanas/types";
import { useEffect } from "react";

type PrintState = {
  empresa: Empresa;

  cliente: Cliente;

  items: VentanaItem[];
  config: VentanaConfig;
};

export function PrintPage() {
  const location = useLocation();

  const state = location.state as PrintState;

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);
  if (!state) {
    return <div className="p-10 text-center">No hay datos para imprimir.</div>;
  }

  return (
    <PrintableBudget
      empresa={state.empresa}
      cliente={state.cliente}
      items={state.items}
      config={state.config}
    />
  );
}
