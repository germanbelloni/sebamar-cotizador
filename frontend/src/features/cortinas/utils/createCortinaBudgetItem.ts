import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

import type { CortinaConfig } from "../types";
import { buildCortinaDescription } from "./buildCortinaDescription";

type Result = {
  precioVenta?: number;
  precioFinal?: number;
  subtotal?: number;
};

export function createCortinaBudgetItem(
  config: CortinaConfig,
  result?: Result,
): BudgetItem {
  return createBudgetItem({
    modulo: "cortinas",

    titulo: "Cortina",

    descripcion: buildCortinaDescription(config),

    configuracion: {
      ...config,
    },

    metadata: {
      color: config.color,
    },

    result: result || {},
  });
}
