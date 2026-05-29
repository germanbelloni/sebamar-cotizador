import api from "@/lib/api";

import type { RajasConfig } from "../types";

type CotizacionRajasResponse = {
  descripcion: string;

  precioVenta: number;

  costo?: number;

  items?: unknown[];
};

export async function cotizarRajas(config: RajasConfig) {
  const { data } = await api.post<CotizacionRajasResponse>("/rajas", {
    ...config,
    vidrio: config.tipoVidrio,
    tipoVidrio: config.tipoVidrio,
  });

  return data;
}
