import type { RajasConfig } from "../types";

import { LIMITES_RAJAS } from "../constants";

export function useRajasValidation(config: RajasConfig) {
  const limites = LIMITES_RAJAS[config.linea];

  const anchoValido =
    config.ancho >= limites.anchoMin && config.ancho <= limites.anchoMax;

  const altoValido =
    config.alto >= limites.altoMin && config.alto <= limites.altoMax;

  const medidasValidas = anchoValido && altoValido;

  const medidasInvalidas = !medidasValidas;

  return {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  };
}
