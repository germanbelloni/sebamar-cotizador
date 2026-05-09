import type { PostigonesConfig } from "../types";

import { LIMITES_POSTIGONES } from "../constants";

export function usePostigonesValidation(config: PostigonesConfig) {
  const anchoValido =
    config.ancho >= LIMITES_POSTIGONES.anchoMin &&
    config.ancho <= LIMITES_POSTIGONES.anchoMax;

  const altoValido =
    config.alto >= LIMITES_POSTIGONES.altoMin &&
    config.alto <= LIMITES_POSTIGONES.altoMax;

  const medidasValidas = anchoValido && altoValido;

  const medidasInvalidas = !medidasValidas;

  return {
    limites: LIMITES_POSTIGONES,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas,
  };
}
