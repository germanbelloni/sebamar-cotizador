import { apiFetch } from "@/lib/api";

import type { PatagonicasConfig } from "../types";

export type CotizacionPatagonicasResponse = {
  descripcion: string;

  precioFinal: number;
};

export async function cotizarPatagonicas(
  config: PatagonicasConfig,
): Promise<number> {
  const response = await apiFetch<CotizacionPatagonicasResponse>(
    "/api/patagonicas",
    {
      method: "POST",

      body: JSON.stringify(config),
    },
  );

  console.log("RESPONSE PATAGONICAS:", response);

  return response.precioFinal;
}
