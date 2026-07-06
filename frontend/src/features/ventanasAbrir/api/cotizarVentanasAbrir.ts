import api from "@/lib/api";

import type { VentanasAbrirConfig } from "../types";

type CotizacionVentanasAbrirResponse = {
  descripcion: string;

  precioVenta: number;

  costo?: number;

  items?: unknown[];

  configuracion?: Record<string, unknown>;
};

export async function cotizarVentanasAbrir(config: VentanasAbrirConfig) {
  const { data } = await api.post<CotizacionVentanasAbrirResponse>(
    "/ventanas-abrir",
    {
      ...config,

      vidrio: config.tipoVidrio,

      tipoVidrio: config.tipoVidrio,
    },
  );

  return data;
}
