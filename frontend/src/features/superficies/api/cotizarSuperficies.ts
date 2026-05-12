import { apiFetch } from "@/lib/api";

import type { superficiesConfig } from "../types";

type CotizacionsuperficiesResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarsuperficies(config: superficiesConfig) {
  return apiFetch<CotizacionsuperficiesResponse>("/productos/superficies", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
