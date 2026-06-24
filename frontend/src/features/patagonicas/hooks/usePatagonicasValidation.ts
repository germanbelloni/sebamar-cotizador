import type { PatagonicasConfig } from "../types";
import { LIMITES_PATAGONICAS } from "../constants";
import { validateDimensions } from "@/shared/utils/validateDimensions";

export function usePatagonicasValidation(config: PatagonicasConfig) {
  const limites = LIMITES_PATAGONICAS[config.linea];

  const { anchoValido, altoValido, medidasValidas } = validateDimensions({
    ancho: config.ancho,
    alto: config.alto,
    limits: limites,
  });

  // NUEVO 👇
  const anchoRajaValido =
    !config.fueraDeMedida ||
    (typeof config.anchoRaja === "number" &&
      config.anchoRaja >= 30 &&
      config.anchoRaja <= 70);

  const validacionFinal = medidasValidas && anchoRajaValido;

  return {
    limites,
    anchoValido,
    altoValido,

    anchoRajaValido, // NUEVO

    medidasValidas: validacionFinal,
    medidasInvalidas: !validacionFinal,
  };
}
