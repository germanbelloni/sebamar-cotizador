import type { PatagonicasConfig, PatagonicasItem } from "../types";

import { buildPatagonicasDescription } from "./buildPatagonicasDescription";

export function createPatagonicasBudgetItem(
  config: PatagonicasConfig,

  result: any,
): PatagonicasItem {
  console.log("RESULT PATAGONICAS:", result);

  const subtotal = Number(
    result?.precioVenta || result?.precioFinal || result?.precio || 0,
  );

  console.log("SUBTOTAL FINAL:", subtotal);

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

    description: result?.descripcion || buildPatagonicasDescription(config),

    subtotal,
  };
}
