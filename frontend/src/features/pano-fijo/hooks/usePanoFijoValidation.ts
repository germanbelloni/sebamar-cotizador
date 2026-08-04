import type { PanoFijoConfig } from "../types";

import { LIMITES_PANO_FIJO } from "../constants";
import { obtenerVidriosPermitidos } from "../utils/reglasVidrios";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function usePanoFijoValidation(config: PanoFijoConfig) {
  const { anchoValido, altoValido, medidasValidas } = validateDimensions({
    ancho: config.ancho,
    alto: config.alto,
    limits: LIMITES_PANO_FIJO,
  });

  const vidriosPermitidos = obtenerVidriosPermitidos({
    ancho: config.ancho,
    alto: config.alto,
    linea: config.linea,
  });

  const vidrioValido = vidriosPermitidos.includes(config.tipoVidrio);

  const validacionFinal = medidasValidas && vidrioValido;

  return {
    limites: LIMITES_PANO_FIJO,

    anchoValido,
    altoValido,

    vidrioValido,
    vidriosPermitidos,

    medidasValidas: validacionFinal,
    medidasInvalidas: !validacionFinal,
  };
}
