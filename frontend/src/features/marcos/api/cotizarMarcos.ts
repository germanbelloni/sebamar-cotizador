import api from "@/lib/api";
import type { MarcosConfig } from "../types";

export async function cotizarMarcos(config: MarcosConfig) {
  const response = await api.post("/superficies", config);
  return response.data;
}
