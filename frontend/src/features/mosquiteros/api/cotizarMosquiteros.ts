import { apiFetch } from "@/lib/api";

import type { MosquiterosConfig } from "../types";

type CotizacionMosquiterosResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarMosquiteros(config: MosquiterosConfig) {
  return apiFetch<CotizacionMosquiterosResponse>("/productos/mosquiteros", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
