import type { PatagonicasConfig } from "../types";

import { LIMITES_PATAGONICAS } from "../constants";

export function usePatagonicasValidation(config: PatagonicasConfig) {
  let limites = LIMITES_PATAGONICAS[config.linea];

  if (config.linea === "Modena") {
    limites = {
      anchoMin: 120,
      anchoMax: 200,
      altoMin: 40,
      altoMax: 180,
    };
  }

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
