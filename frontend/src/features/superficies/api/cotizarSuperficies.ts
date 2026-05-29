import api from "@/lib/api";

import type { SuperficiesConfig } from "../types";

type CotizacionsuperficiesResponse = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarSuperficies(config: SuperficiesConfig) {
  const { data } = await api.post<CotizacionsuperficiesResponse>(
    "/superficies",
    config,
  );

  return data;
}
