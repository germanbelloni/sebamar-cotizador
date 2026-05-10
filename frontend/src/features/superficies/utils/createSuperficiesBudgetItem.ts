import type { SuperficiesConfig, SuperficiesItem } from "../types";

import { buildSuperficiesDescription } from "./buildSuperficiesDescription";

export function createSuperficiesBudgetItem(
  config: SuperficiesConfig,
): SuperficiesItem {
  return {
    tipo: "superficies",

    cantidad: 1,

    medidas: {
      ancho: config.ancho,
      alto: config.alto,
    },

    description: buildSuperficiesDescription(config),

    color: config.color,

    configuracion: {
      tipo: config.tipo,

      linea: config.linea,

      tipoVidrio: config.tipoVidrio,
    },

    subtotal: 0,
  };
}
