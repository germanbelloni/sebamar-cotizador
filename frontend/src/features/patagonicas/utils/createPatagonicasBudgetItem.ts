import type { PatagonicasConfig, PatagonicasItem } from "../types";

import { buildPatagonicasDescription } from "./buildPatagonicasDescription";

export function createPatagonicasBudgetItem(
  config: PatagonicasConfig,

  subtotal: number,
): PatagonicasItem {
  return {
    tipo: "patagonicas",

    cantidad: 1,

    medidas: {
      ancho: config.ancho,

      alto: config.alto,
    },

    linea: config.linea,

    color: config.color,

    configuracion: {
      tipo: config.tipo,

      premarco: config.premarco,

      contramarco: config.contramarco,

      mosquitero: config.mosquitero,

      cantidadRajas: config.cantidadRajas,

      anchoRaja: typeof config.anchoRaja === "number" ? config.anchoRaja : 40,

      tipoVidrio: config.tipoVidrio,

      ladoApertura: config.ladoApertura,

      bisagraRaja1: config.bisagraRaja1,

      bisagraRaja2: config.bisagraRaja2,

      tipoApertura: config.tipoApertura,

      guia: config.guia,

      cajonBlock: config.cajonBlock,

      cortina: config.cortina,
    },

    description: buildPatagonicasDescription(config),

    subtotal,
  };
}
