import type { VentanaConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

import { buildVentanaDescription } from "./buildVentanaDescription";

type CotizacionResponse = {
  precioVenta: number;
  precioFinal?: number;
  subtotal?: number;
};

export function createVentanaBudgetItem(
  config: VentanaConfig,
  result: CotizacionResponse,
): BudgetItem {
  return createBudgetItem({
    modulo: "ventanas",

    titulo: `${config.linea} ${config.ancho}x${config.alto}`,

    descripcion: buildVentanaDescription(config),

    configuracion: {
      ancho: config.ancho,
      alto: config.alto,
      color: config.color,
      tipoVidrio: config.tipoVidrio,
      mosquitero: config.mosquitero,
      guia: config.guia,
      cajonBlock: config.cajonBlock,
      cortina: config.cortina,
      premarco: config.premarco,
      contramarco: config.contramarco,

      bipuntoIzquierda: config.bipuntoIzquierda,
      bipuntoDerecha: config.bipuntoDerecha,
    },

    metadata: {
      linea: config.linea,

      color: config.color,

      vidrio: config.tipoVidrio,
    },

    result,
  });
}
