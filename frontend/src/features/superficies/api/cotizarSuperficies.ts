import { apiFetch } from "@/lib/api";

import type { SuperficiesConfig } from "../types";

type CotizacionSuperficiesResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarSuperficies(config: SuperficiesConfig) {
  return apiFetch<CotizacionSuperficiesResponse>("/productos/superficies", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
