import api from "@/lib/api";

import type { MosquiterosConfig } from "../types";

export type CotizacionMosquiterosResponse = {
  descripcion: string;

  precioBase: number;

  precioLista?: number;

  precioVenta?: number;

  precioFinal: number;

  margenAplicado?: number;

  perfilAplicado?: string;

  items?: unknown[];

  configuracion?: Record<string, unknown>;
};

export async function cotizarMosquiteros(
  config: MosquiterosConfig,
): Promise<CotizacionMosquiterosResponse> {
  const { data } = await api.post<CotizacionMosquiterosResponse>(
    "/mosquiteros",
    config,
  );

  return data;
}
