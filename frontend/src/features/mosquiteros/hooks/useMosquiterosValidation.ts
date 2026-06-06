import { LIMITES_MOSQUITEROS } from "../constants";

import type { MosquiterosConfig } from "../types";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function useMosquiterosValidation(config: MosquiterosConfig) {
  const limites = LIMITES_MOSQUITEROS[config.tipo];

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
