import { LIMITES_MARCOS } from "../constants";

import type { MarcosConfig } from "../types";

export function useMarcosValidation(config: MarcosConfig) {
  const anchoValido =
    config.ancho >= LIMITES_MARCOS.anchoMin &&
    config.ancho <= LIMITES_MARCOS.anchoMax;

  const altoValido =
    config.alto >= LIMITES_MARCOS.altoMin &&
    config.alto <= LIMITES_MARCOS.altoMax;

  return {
    limites: LIMITES_MARCOS,

    anchoValido,

    altoValido,

    medidasValidas: anchoValido && altoValido,

    medidasInvalidas: !anchoValido || !altoValido,
  };
}
