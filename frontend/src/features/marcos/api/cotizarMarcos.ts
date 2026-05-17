import { apiFetch } from "@/lib/api";

import type { MarcosConfig } from "../types";

type Response = {
  descripcion: string;

  precioVenta: number;
};

export async function cotizarMarcos(config: MarcosConfig) {
  return apiFetch<Response>("/productos/superficies", {
    method: "POST",

    body: JSON.stringify(config),
  });
}
