import type { CortinaConfig } from "../types";

import { LIMITES_CORTINAS } from "../constants";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function useCortinaValidation(config: CortinaConfig) {
  const { anchoValido, altoValido, medidasValidas } = validateDimensions({
    ancho: config.ancho,
    alto: config.alto,
    limits: LIMITES_CORTINAS,
  });

  return {
    limites: LIMITES_CORTINAS,

    anchoValido,
    altoValido,

    medidasValidas,
    medidasInvalidas: !medidasValidas,
  };
}
