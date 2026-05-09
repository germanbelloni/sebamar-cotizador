import type { PuertasConfig, PuertasItem } from "../types";

import { buildPuertasDescription } from "./buildPuertasDescription";

export function createPuertasBudgetItem(config: PuertasConfig): PuertasItem {
  return {
    tipo: "puertas",

    cantidad: 1,

    linea: config.linea,

    medidas: {
      ancho: config.ancho,
      alto: config.alto,
    },

    description: buildPuertasDescription(config),

    color: config.color,

    configuracion: {
      tipo: config.tipo,

      modelo: config.modelo,

      apertura: config.apertura,

      hojas: config.hojas,

      vidrio: config.vidrio,

      extras: config.extras,
    },

    subtotal: 0,
  };
}
