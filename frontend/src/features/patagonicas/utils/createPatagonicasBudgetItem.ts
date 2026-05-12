import type { PatagonicasConfig, PatagonicasItem } from "../types";

import { buildPatagonicasDescription } from "./buildPatagonicasDescription";

export function createPatagonicasBudgetItem(
  config: PatagonicasConfig,
): PatagonicasItem {
  return {
    tipo: "patagonicas",

    cantidad: 1,

    linea: config.linea,

    medidas: {
      ancho: config.ancho,
      alto: config.alto,
    },

    description: buildPatagonicasDescription(config),

    color: config.color,

    configuracion: {
      tipo: config.tipo,

      premarco: config.premarco,

      contramarco: config.contramarco,

      mosquitero: config.mosquitero,

      cantidadRajas: config.cantidadRajas,

      tipoVidrio: config.tipoVidrio,

      ladoApertura: config.ladoApertura,

      tipoApertura: config.tipoApertura,
    },

    subtotal: 0,
  };
}
