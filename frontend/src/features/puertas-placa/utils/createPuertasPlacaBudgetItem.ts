import type { PuertasPlacaConfig, PuertasPlacaItem } from "../types";

import { buildPuertasPlacaDescription } from "./buildPuertasPlacaDescription";

export function createPuertasPlacaBudgetItem(
  config: PuertasPlacaConfig,
): PuertasPlacaItem {
  return {
    tipo: "puerta_placa",

    cantidad: 1,

    medidas: {
      ancho: config.ancho,

      alto: config.alto,
    },

    description: buildPuertasPlacaDescription(config),

    configuracion: {
      tipo: config.tipo,

      modelo: config.modelo,

      marco: config.marco,

      mano: config.mano,
    },

    subtotal: 0,
  };
}
