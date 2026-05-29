import api from "@/lib/api";

import type { MosquiterosConfig } from "../types";

type CotizacionMosquiterosResponse = {
  descripcion: string;

  precioFinal: number;
};

export async function cotizarMosquiteros(
  config: MosquiterosConfig,
): Promise<number> {
  const { data } = await api.post<CotizacionMosquiterosResponse>(
    "/mosquiteros",
    config,
  );

  return data.precioFinal;
}
