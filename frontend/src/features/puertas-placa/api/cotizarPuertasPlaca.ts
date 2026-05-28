import { apiFetch } from "@/lib/api";

import type { PuertasPlacaConfig } from "../types";

type CotizacionPuertasPlacaResponse = {
  descripcion: string;

  precioVenta: number;
};

function mapTipo(tipo: PuertasPlacaConfig["tipo"]) {
  switch (tipo) {
    case "abrir":
      return "puerta";

    case "embutir":
      return "embutir";

    case "granero":
      return "granero";

    default:
      return "puerta";
  }
}

export async function cotizarPuertasPlaca(config: PuertasPlacaConfig) {
  return apiFetch<CotizacionPuertasPlacaResponse>("/api/placas", {
    method: "POST",

    body: JSON.stringify({
      ...config,

      tipo: mapTipo(config.tipo),
    }),
  });
}
