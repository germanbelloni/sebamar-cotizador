import type { superficiesConfig, superficiesItem } from "../types";

import { buildsuperficiesDescription } from "./buildsuperficiesDescription";

export function createsuperficiesBudgetItem(
  config: superficiesConfig,
): superficiesItem {
  return {
    tipo: "superficies",

    cantidad: 1,

    medidas: {
      ancho: config.ancho,
      alto: config.alto,
    },

    description: buildsuperficiesDescription(config),

    color: config.color,

    configuracion: {
      tipo: config.tipo,

      linea: config.linea,

      tipoVidrio: config.tipoVidrio,
    },

    subtotal: 0,
  };
}
