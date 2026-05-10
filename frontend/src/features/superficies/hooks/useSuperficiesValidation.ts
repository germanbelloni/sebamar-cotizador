import type { SuperficiesConfig } from "../types";

import { LIMITES_SUPERFICIES } from "../constants";

export function useSuperficiesValidation(config: SuperficiesConfig) {
  const anchoValido =
    config.ancho >= LIMITES_SUPERFICIES.anchoMin &&
    config.ancho <= LIMITES_SUPERFICIES.anchoMax;

  const altoValido =
    config.alto >= LIMITES_SUPERFICIES.altoMin &&
    config.alto <= LIMITES_SUPERFICIES.altoMax;

  const medidasValidas = anchoValido && altoValido;

  const medidasInvalidas = !medidasValidas;

  return {
    limites: LIMITES_SUPERFICIES,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  };
}
