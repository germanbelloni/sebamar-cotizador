import api from "@/lib/api";
import type { MarcosConfig } from "../types";

export async function cotizarMarcos(config: MarcosConfig) {
  const response = await api.post("/superficies", config);

  console.log("RESPUESTA RAW MARCOS:", response);
  console.log("DATA MARCOS:", response.data);

  return response.data;
}
