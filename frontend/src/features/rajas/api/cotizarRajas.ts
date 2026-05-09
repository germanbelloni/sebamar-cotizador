import { apiFetch } from "@/lib/api";

import type { RajasConfig } from "../types";

type CotizacionRajasResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarRajas(config: RajasConfig) {
  return apiFetch<CotizacionRajasResponse>("/productos/rajas", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
