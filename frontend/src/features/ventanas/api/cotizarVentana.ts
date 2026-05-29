import api from "@/lib/api";

import type { VentanaConfig } from "../types";

type CotizacionResponse = {
  precioVenta: number;

  descripcion: string;

  configuracion: {
    svg?: unknown;
  };
};

export async function cotizarVentana(config: VentanaConfig) {
  const { data } = await api.post<CotizacionResponse>("/ventanas", config);

  return data;
}
