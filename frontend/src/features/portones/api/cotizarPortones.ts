import { apiFetch } from "@/lib/api";

import type { PortonesConfig } from "../types";

type CotizacionPortonesResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarPortones(config: PortonesConfig) {
  return apiFetch<CotizacionPortonesResponse>("/productos/portones", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
