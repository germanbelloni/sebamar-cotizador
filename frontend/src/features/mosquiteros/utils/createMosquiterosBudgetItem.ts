import type { MosquiterosConfig, MosquiterosItem } from "../types";

import { buildMosquiterosDescription } from "./buildMosquiterosDescription";

type Result = {
  descripcion?: string;

  precioVenta?: number;
};

export function createMosquiterosBudgetItem(
  config: MosquiterosConfig,

  result?: Result,
): MosquiterosItem {
  return {
    tipo: "mosquiteros",

    cantidad: 1,

    medidas: {
      ancho: config.ancho,

      alto: config.alto,
    },

    description: result?.descripcion || buildMosquiterosDescription(config),

    color: config.color,

    configuracion: {
      tipo: config.tipo,
    },

    subtotal: result?.precioVenta || 0,
  };
}
