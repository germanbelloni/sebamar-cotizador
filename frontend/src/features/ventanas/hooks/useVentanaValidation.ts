import { LIMITES_LINEA } from "../constants";

import type { VentanaConfig } from "../types";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function useVentanaValidation(config: VentanaConfig) {
  const limites = LIMITES_LINEA[config.linea];

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
