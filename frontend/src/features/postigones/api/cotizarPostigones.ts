import api from "@/lib/api";

import type { PostigonesConfig, PostigonesResponse } from "../types";

import { mapPostigonesToPayload } from "../utils/mapPostigonesToPayload";

export async function cotizarPostigones(config: PostigonesConfig) {
  const payload = mapPostigonesToPayload(config);

  const { data } = await api.post<PostigonesResponse>("/postigones", payload);

  return data;
}
