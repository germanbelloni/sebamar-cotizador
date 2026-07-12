import api from "@/lib/api";

import type { CortinaConfig, CortinaResponse } from "../types";

import { createCortinaPayload } from "../utils/createCortinaPayload";

export async function cotizarCortina(
  config: CortinaConfig,
): Promise<CortinaResponse> {
  const payload = createCortinaPayload(config);

  const { data } = await api.post("/cortinas", payload);

  return data;
}
