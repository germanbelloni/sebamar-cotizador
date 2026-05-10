import { LIMITES_MOSQUITEROS } from "../constants";

import type { MosquiterosConfig } from "../types";

export function useMosquiterosValidation(config: MosquiterosConfig) {
  const limites = LIMITES_MOSQUITEROS[config.tipo];

  const anchoValido =
    config.ancho >= limites.anchoMin && config.ancho <= limites.anchoMax;

  const altoValido =
    config.alto >= limites.altoMin && config.alto <= limites.altoMax;

  const medidasValidas = anchoValido && altoValido;

  return {
    limites,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas: !medidasValidas,
  };
}
