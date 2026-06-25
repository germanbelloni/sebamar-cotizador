import api from "@/lib/api";

import type { PuertasPlacaConfig } from "../types";

type CotizacionPuertasPlacaResponse = {
  descripcion: string;

  precioVenta: number;
};

function mapTipo(tipo: PuertasPlacaConfig["tipo"]) {
  switch (tipo) {
    case "abrir":
      return "placa";

    case "embutir":
      return "embutir";

    case "granero":
      return "granero";

    default:
      return "puerta";
  }
}

export async function cotizarPuertasPlaca(config: PuertasPlacaConfig) {
  const { data } = await api.post<CotizacionPuertasPlacaResponse>("/placas", {
    ...config,
    tipo: mapTipo(config.tipo),
  });

  return data;
}
