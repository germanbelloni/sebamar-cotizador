import type { PatagonicasConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type Result = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  subtotal?: number;
};

export function createPatagonicasBudgetItem(
  config: PatagonicasConfig,
  result: Result,
): BudgetItem {
  return createBudgetItem({
    modulo: "patagonicas",

    titulo: "Ventana patagónica",

    descripcion:
      result.descripcion ?? `${config.tipo} ${config.ancho}x${config.alto}`,

    configuracion: {
      ...config,
    },

    metadata: {
      linea: config.linea,

      color: config.color,

      vidrio: config.tipoVidrio,
    },

    result,
  });
}
