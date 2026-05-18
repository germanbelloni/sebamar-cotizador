import { apiFetch } from "@/lib/api";

import type { MosquiterosConfig } from "../types";

type CotizacionMosquiterosResponse = {
  descripcion: string;

  precioFinal: number;
};

export async function cotizarMosquiteros(
  config: MosquiterosConfig,
): Promise<number> {
  const response = await apiFetch<CotizacionMosquiterosResponse>(
    "/mosquiteros",
    {
      method: "POST",

      body: JSON.stringify(config),
    },
  );

  return response.precioFinal;
}
