import api from "@/lib/api";

import type { PatagonicasConfig } from "../types";

export type CotizacionPatagonicasResponse = {
  descripcion: string;

  precioVenta: number;

  precioFinal?: number;
};

export async function cotizarPatagonicas(
  config: PatagonicasConfig,
): Promise<CotizacionPatagonicasResponse> {
  const payload = {
    ...config,

    cantidadRajas: config.tipo === "2_rajas" ? 2 : 1,
  };

  console.log("🚨 PAYLOAD FRONT PATAGONICAS:", payload);

  const { data } = await api.post<CotizacionPatagonicasResponse>(
    "/patagonicas",
    payload,
  );

  console.log("✅ RESPONSE PATAGONICAS:", data);

  return data;
}
