import type { PatagonicasConfig } from "../types";

import { LIMITES_PATAGONICAS } from "../constants";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function usePatagonicasValidation(config: PatagonicasConfig) {
  const limites = LIMITES_PATAGONICAS[config.linea];

  const { anchoValido, altoValido, medidasValidas } = validateDimensions({
    ancho: config.ancho,
    alto: config.alto,
    limits: limites,
  });

  return {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas: !medidasValidas,
  };
}
