import type { PanoFijoConfig } from "../types";

import { LIMITES_PANO_FIJO } from "../constants";

export function usePanoFijoValidation(config: PanoFijoConfig) {
  const anchoValido =
    config.ancho >= LIMITES_PANO_FIJO.anchoMin &&
    config.ancho <= LIMITES_PANO_FIJO.anchoMax;

  const altoValido =
    config.alto >= LIMITES_PANO_FIJO.altoMin &&
    config.alto <= LIMITES_PANO_FIJO.altoMax;

  const medidasValidas = anchoValido && altoValido;

  const medidasInvalidas = !medidasValidas;

  return {
    limites: LIMITES_PANO_FIJO,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  };
}
