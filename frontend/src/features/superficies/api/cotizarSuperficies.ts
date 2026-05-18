import { apiFetch } from "@/lib/api";

import type { SuperficiesConfig } from "../types";

type CotizacionsuperficiesResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarSuperficies(config: SuperficiesConfig) {
  return apiFetch<CotizacionsuperficiesResponse>("/api/superficies", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
