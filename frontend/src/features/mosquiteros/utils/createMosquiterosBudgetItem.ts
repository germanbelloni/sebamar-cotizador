import type { MosquiterosConfig, MosquiterosItem } from "../types";

import { buildMosquiterosDescription } from "./buildMosquiterosDescription";

export function createMosquiterosBudgetItem(
  config: MosquiterosConfig,
): MosquiterosItem {
  return {
    tipo: "mosquiteros",

    cantidad: 1,

    medidas: {
      ancho: config.ancho,
      alto: config.alto,
    },

    description: buildMosquiterosDescription(config),

    color: config.color,

    configuracion: {
      tipo: config.tipo,
    },

    subtotal: 0,
  };
}
