import type { PuertasConfig } from "../types";

type Limits = {
  anchoMin: number;
  anchoMax: number;

  altoMin: number;
  altoMax: number;
};

function getLimits(config: PuertasConfig): Limits {
  switch (config.tipoConfiguracion) {
    case "simple":
      return {
        anchoMin: 70,
        anchoMax: 110,

        altoMin: 190,
        altoMax: 250,
      };

    case "puerta_y_media":
      return {
        anchoMin: 110,
        anchoMax: 160,

        altoMin: 190,
        altoMax: 250,
      };

    case "doble":
      return {
        anchoMin: 140,
        anchoMax: 220,

        altoMin: 190,
        altoMax: 250,
      };

    case "porton":
      return {
        anchoMin: 180,
        anchoMax: 400,

        altoMin: 180,
        altoMax: 300,
      };

    default:
      return {
        anchoMin: 70,
        anchoMax: 400,

        altoMin: 180,
        altoMax: 300,
      };
  }
}

export function usePuertasValidation(config: PuertasConfig) {
  const limites = getLimits(config);

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
