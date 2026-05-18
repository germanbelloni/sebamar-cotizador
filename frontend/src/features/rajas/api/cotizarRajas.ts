import { apiFetch } from "@/lib/api";

import type { RajasConfig } from "../types";

type CotizacionRajasResponse = {
  descripcion: string;

  precioVenta: number;

  costo?: number;

  items?: unknown[];
};

export async function cotizarRajas(config: RajasConfig) {
  return apiFetch<CotizacionRajasResponse>("/api/rajas", {
    method: "POST",

    body: JSON.stringify({
      ...config,

      vidrio: config.tipoVidrio,

      tipoVidrio: config.tipoVidrio,
    }),
  });
}
