import { apiFetch } from "@/lib/api";

import type { PuertasConfig } from "../types";

type CotizacionPuertasResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarPuertas(config: PuertasConfig) {
  return apiFetch<CotizacionPuertasResponse>("/productos/puertas", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
