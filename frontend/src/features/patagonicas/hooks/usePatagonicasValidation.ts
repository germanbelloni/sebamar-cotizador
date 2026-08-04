import type { PatagonicasConfig } from "../types";
import { LIMITES_PATAGONICAS } from "../constants";

export function usePatagonicasValidation(config: PatagonicasConfig) {
  const limites = LIMITES_PATAGONICAS[config.linea];

  let anchoMin = limites.anchoMin;
  let anchoMax = limites.anchoMax;

  if (config.tipo === "1_raja") {
    anchoMin = 80;
    anchoMax = 200;
  }

  if (config.tipo === "2_rajas") {
    anchoMin = 100;
    anchoMax = 240;
  }

  const anchoValido = config.ancho >= anchoMin && config.ancho <= anchoMax;

  const altoValido =
    config.alto >= limites.altoMin && config.alto <= limites.altoMax;

  const anchoRajaValido =
    !config.fueraDeMedida ||
    (typeof config.anchoRaja === "number" &&
      config.anchoRaja >= 30 &&
      config.anchoRaja <= 70);

  const validacionFinal = anchoValido && altoValido && anchoRajaValido;

  return {
    limites: {
      ...limites,
      anchoMin,
      anchoMax,
    },

    anchoValido,
    altoValido,
    anchoRajaValido,

    medidasValidas: validacionFinal,
    medidasInvalidas: !validacionFinal,
  };
}
