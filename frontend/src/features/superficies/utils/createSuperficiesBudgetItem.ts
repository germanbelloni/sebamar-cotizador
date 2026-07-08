import type { SuperficiesConfig } from "../types";
import { buildSuperficiesDescription } from "./buildSuperficiesDescription";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type Result = {
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

    descripcion: buildSuperficiesDescription(config),

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
