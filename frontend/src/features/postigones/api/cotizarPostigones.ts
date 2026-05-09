import { apiFetch } from "@/lib/api";

import type { PostigonesConfig } from "../types";

type CotizacionPostigonesResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarPostigones(config: PostigonesConfig) {
  return apiFetch<CotizacionPostigonesResponse>("/productos/postigones", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
