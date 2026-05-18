import { apiFetch } from "@/lib/api";

import type { PuertasPlacaConfig } from "../types";

type CotizacionPuertasPlacaResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarPuertasPlaca(config: PuertasPlacaConfig) {
  return apiFetch<CotizacionPuertasPlacaResponse>("/api/puertas-placa", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
