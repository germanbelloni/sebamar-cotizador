import type { RajasConfig } from "../types";

import { LIMITES_RAJAS } from "../constants";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function useRajasValidation(config: RajasConfig) {
  const limites = LIMITES_RAJAS[config.linea];

  const { anchoValido, altoValido, medidasValidas } = validateDimensions({
    ancho: config.ancho,

    alto: config.alto,

    limits: limites,
  });

  const medidasInvalidas = !medidasValidas;

  const osciloInvalido =
    config.linea === "Herrero" && config.apertura === "oscilobatiente";

  return {
    limites,

    anchoValido,

    altoValido,

    medidasValidas: medidasValidas && !osciloInvalido,

    medidasInvalidas: medidasInvalidas || osciloInvalido,

    osciloInvalido,
  };
}
