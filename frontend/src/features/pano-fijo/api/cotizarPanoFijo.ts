import api from "@/lib/api";

import type { PanoFijoConfig } from "../types";

type CotizacionPanoFijoResponse = {
  descripcion: string;

  precioVenta: number;

  precioFinal?: number;

  subtotal?: number;
};

export async function cotizarPanoFijo(config: PanoFijoConfig) {
  const { data } = await api.post<CotizacionPanoFijoResponse>("/superficies", {
    ...config,
    tipo: "pano_fijo",
  });

  return data;
}
