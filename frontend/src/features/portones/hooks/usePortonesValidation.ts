import type { PortonesConfig } from "../types";

import { LIMITES_PORTONES } from "../constants";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function usePortonesValidation(config: PortonesConfig) {
  const limites = LIMITES_PORTONES[config.linea];

  const {
    anchoValido,

    altoValido,

    medidasValidas,
  } = validateDimensions({
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
