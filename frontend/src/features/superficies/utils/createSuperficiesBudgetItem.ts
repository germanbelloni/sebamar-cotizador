import type { SuperficiesConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

import { buildSuperficiesDescription } from "./buildSuperficiesDescription";

type Result = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  subtotal?: number;
};

export function createSuperficiesBudgetItem(
  config: SuperficiesConfig,
  result?: Result,
): BudgetItem {
  return createBudgetItem({
    modulo: "superficies",

    titulo: "Superficie",

    descripcion: result?.descripcion || buildSuperficiesDescription(config),

    configuracion: {
      ...config,
    },

    metadata: {
      linea: config.linea,

      vidrio: config.tipoVidrio,
    },

    result: result || {},
  });
}
