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
        anchoMin: 60,
        anchoMax: 100,
        altoMin: 150,
        altoMax: 210,
      };

    case "puerta_y_media":
      return {
        anchoMin: 100,
        anchoMax: 130,
        altoMin: 150,
        altoMax: 210,
      };

    case "doble":
      return {
        anchoMin: 140,
        anchoMax: 180,
        altoMin: 150,
        altoMax: 210,
      };

    case "porton":
      return {
        anchoMin: 210,
        anchoMax: 400,
        altoMin: 150,
        altoMax: 210,
      };

    default:
      return {
        anchoMin: 60,
        anchoMax: 400,
        altoMin: 150,
        altoMax: 210,
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
