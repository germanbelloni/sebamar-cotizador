import { apiFetch } from "@/lib/api";

import type { PatagonicasConfig } from "../types";

type CotizacionPatagonicasResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarPatagonicas(config: PatagonicasConfig) {
  return apiFetch<CotizacionPatagonicasResponse>("/productos/patagonicas", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
