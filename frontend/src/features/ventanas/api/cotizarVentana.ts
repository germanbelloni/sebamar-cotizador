import { apiFetch } from "@/lib/api";

import type { VentanaConfig } from "../types";

type CotizacionResponse = {
  precioVenta: number;

  descripcion: string;

  configuracion: {
    svg?: unknown;
  };
};

export async function cotizarVentana(config: VentanaConfig) {
  return apiFetch<CotizacionResponse>("/productos/ventanas", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
