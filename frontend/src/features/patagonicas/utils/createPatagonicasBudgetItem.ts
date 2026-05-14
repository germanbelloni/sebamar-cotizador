import type { PatagonicasConfig, PatagonicasItem } from "../types";

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

      anchoRaja: config.anchoRaja,

      tipoVidrio: config.tipoVidrio,

      ladoApertura: config.ladoApertura,

      bisagraRaja1: config.bisagraRaja1,

      bisagraRaja2: config.bisagraRaja2,

      tipoApertura: config.tipoApertura,
    },

    description: [
      `${config.cantidadRajas} Raja/s`,

      `${config.ancho}x${config.alto}`,

      config.linea,

      config.tipoVidrio,

      `Raja ${config.anchoRaja}cm`,

      config.mosquitero ? "Mosquitero" : null,

      config.premarco ? "Premarco" : null,

      config.contramarco ? "Contramarco" : null,
    ]
      .filter(Boolean)
      .join(" · "),

    subtotal,
  };
}
