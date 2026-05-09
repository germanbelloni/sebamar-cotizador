import type { PuertasPlacaConfig } from "../types";

import { LIMITES_PUERTAS_PLACA } from "../constants";

export function usePuertasPlacaValidation(config: PuertasPlacaConfig) {
  const anchoValido =
    config.ancho >= LIMITES_PUERTAS_PLACA.anchoMin &&
    config.ancho <= LIMITES_PUERTAS_PLACA.anchoMax;

  const altoValido =
    config.alto >= LIMITES_PUERTAS_PLACA.altoMin &&
    config.alto <= LIMITES_PUERTAS_PLACA.altoMax;

  const medidasValidas = anchoValido && altoValido;

  const medidasInvalidas = !medidasValidas;

  return {
    limites: LIMITES_PUERTAS_PLACA,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  };
}
