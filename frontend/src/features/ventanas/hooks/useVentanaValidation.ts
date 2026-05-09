import { LIMITES_LINEA } from "../constants";

import type { VentanaConfig } from "../types";

export function useVentanaValidation(config: VentanaConfig) {
  const limites = LIMITES_LINEA[config.linea];

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
