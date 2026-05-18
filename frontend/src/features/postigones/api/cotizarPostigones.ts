import { apiFetch } from "@/lib/api";

import type { PostigonesConfig, PostigonesResponse } from "../types";

import { mapPostigonesToPayload } from "../utils/mapPostigonesToPayload";

export async function cotizarPostigones(config: PostigonesConfig) {
  const payload = mapPostigonesToPayload(config);

  return apiFetch<PostigonesResponse>("/api/postigones", {
    method: "POST",

    body: JSON.stringify(payload),
  });
}
