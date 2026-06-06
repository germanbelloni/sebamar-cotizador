import type { PostigonesConfig } from "../types";

import { LIMITES_POSTIGONES } from "../constants";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function usePostigonesValidation(config: PostigonesConfig) {
  const { anchoValido, altoValido, medidasValidas } = validateDimensions({
    ancho: config.ancho,
    alto: config.alto,
    limits: LIMITES_POSTIGONES,
  });

  return {
    limites: LIMITES_POSTIGONES,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas: !medidasValidas,
  };
}
