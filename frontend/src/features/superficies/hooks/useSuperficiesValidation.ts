import type { SuperficiesConfig } from "../types";

import { LIMITES_superficies } from "../constants";

export function useSuperficiesValidation(config: SuperficiesConfig) {
  const anchoValido =
    config.ancho >= LIMITES_superficies.anchoMin &&
    config.ancho <= LIMITES_superficies.anchoMax;

  const altoValido =
    config.alto >= LIMITES_superficies.altoMin &&
    config.alto <= LIMITES_superficies.altoMax;

  const medidasValidas = anchoValido && altoValido;

  const medidasInvalidas = !medidasValidas;

  return {
    limites: LIMITES_superficies,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  };
}
