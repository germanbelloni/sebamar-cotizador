import type { VentanasAbrirConfig } from "../types";

import { LIMITES_VENTANAS_ABRIR } from "../constants";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function useVentanasAbrirValidation(config: VentanasAbrirConfig) {
  const limites = LIMITES_VENTANAS_ABRIR[config.linea];

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
