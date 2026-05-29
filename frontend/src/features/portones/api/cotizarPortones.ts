import api from "@/lib/api";

import type { PortonesConfig } from "../types";

type CotizacionPortonesResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarPortones(config: PortonesConfig) {
  const { data } = await api.post<CotizacionPortonesResponse>(
    "/portones",
    config,
  );

  return data;
}
