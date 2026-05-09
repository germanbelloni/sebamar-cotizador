import type { PatagonicasConfig } from "../types";

import { LIMITES_PATAGONICAS } from "../constants";

export function usePatagonicasValidation(config: PatagonicasConfig) {
  const limites = LIMITES_PATAGONICAS[config.linea];

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
