import { LIMITES_MARCOS } from "../constants";

import type { MarcosConfig } from "../types";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function useMarcosValidation(config: MarcosConfig) {
  const { anchoValido, altoValido, medidasValidas } = validateDimensions({
    ancho: config.ancho,
    alto: config.alto,
    limits: LIMITES_MARCOS,
  });

  return {
    limites: LIMITES_MARCOS,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas: !medidasValidas,
  };
}
