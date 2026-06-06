import type { PuertasPlacaConfig } from "../types";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function usePuertasPlacaValidation(config: PuertasPlacaConfig) {
  const limites =
    config.tipo === "abrir"
      ? {
          anchoMin: 60,
          anchoMax: 100,

          altoMin: 150,
          altoMax: 210,
        }
      : {
          anchoMin: 140,
          anchoMax: 180,

          altoMin: 150,
          altoMax: 210,
        };

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
