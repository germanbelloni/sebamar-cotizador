import type { PuertasConfig } from "../types";

import { LIMITES_PUERTAS } from "../constants";

export function usePuertasValidation(config: PuertasConfig) {
  const limites = LIMITES_PUERTAS[config.linea];

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
