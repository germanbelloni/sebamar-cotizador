import type { SuperficiesConfig } from "../types";

import { LIMITES_superficies } from "../constants";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function useSuperficiesValidation(config: SuperficiesConfig) {
  const { anchoValido, altoValido, medidasValidas } = validateDimensions({
    ancho: config.ancho,
    alto: config.alto,
    limits: LIMITES_superficies,
  });

  return {
    limites: LIMITES_superficies,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas: !medidasValidas,
  };
}
