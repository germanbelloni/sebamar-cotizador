import type { VentanaConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { buildVentanaDescription } from "./buildVentanaDescription";

type CotizacionResponse = {
  descripcion: string;

  precioVenta: number;

  precioFinal?: number;

  subtotal?: number;
};

export function createVentanaBudgetItem(
  config: VentanaConfig,
  result: CotizacionResponse,
): BudgetItem {
  const precioUnitario = Number(
    result.precioFinal ?? result.precioVenta ?? result.subtotal ?? 0,
  );

  return {
    id: crypto.randomUUID(),

    modulo: "ventanas",

    titulo: `${config.linea} ${config.ancho}x${config.alto}`,

    descripcion: buildVentanaDescription(config),

    cantidad: 1,

    precioUnitario,

    subtotal: precioUnitario,

    groupKey: [
      "ventanas",
      config.linea,
      config.ancho,
      config.alto,
      config.color,
      config.tipoVidrio,
      config.mosquitero,
      config.guia,
      config.cajonBlock,
      config.cortina,
      config.premarco,
      config.contramarco,
    ].join("-"),

    configuracion: {
      tipoVidrio: config.tipoVidrio,

      mosquitero: config.mosquitero,

      guia: config.guia,

      cajonBlock: config.cajonBlock,

      cortina: config.cortina,

      premarco: config.premarco,

      contramarco: config.contramarco,
    },

    metadata: {
      linea: config.linea,

      color: config.color,

      vidrio: config.tipoVidrio,
    },
  };
}
