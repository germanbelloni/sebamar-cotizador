import api from "@/lib/api";

import type { MarcosConfig } from "../types";

type Response = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarMarcos(config: MarcosConfig) {
  const { data } = await api.post<Response>("/superficies", config);

  return data;
}
