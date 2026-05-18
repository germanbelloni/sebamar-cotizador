import { apiFetch } from "@/lib/api";

import type { PanoFijoConfig } from "../types";

type CotizacionPanoFijoResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarPanoFijo(config: PanoFijoConfig) {
  return apiFetch<CotizacionPanoFijoResponse>("/api/superficies", {
    method: "POST",

    body: JSON.stringify({
      ...config,

      tipo: "pano_fijo",
    }),
  });
}
