import type { PanoFijoConfig } from "../types";

import { LIMITES_PANO_FIJO } from "../constants";

import { validateDimensions } from "@/shared/utils/validateDimensions";

export function usePanoFijoValidation(config: PanoFijoConfig) {
  const { anchoValido, altoValido, medidasValidas } = validateDimensions({
    ancho: config.ancho,
    alto: config.alto,
    limits: LIMITES_PANO_FIJO,
  });

  return {
    limites: LIMITES_PANO_FIJO,

    anchoValido,

    altoValido,

    medidasValidas,

    medidasInvalidas: !medidasValidas,
  };
}
