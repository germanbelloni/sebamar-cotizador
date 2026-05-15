import type { PuertasPlacaConfig } from "../types";

export function usePuertasPlacaValidation(config: PuertasPlacaConfig) {
  const limites =
    config.tipo === "abrir"
      ? {
          anchoMin: 60,

          anchoMax: 100,

          altoMin: 150,

          altoMax: 210,
        }
      : {
          anchoMin: 140,

          anchoMax: 180,

          altoMin: 150,

          altoMax: 210,
        };

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
