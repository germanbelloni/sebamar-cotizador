import type { MosquiterosConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

import { buildMosquiterosDescription } from "./buildMosquiterosDescription";

export function createMosquiterosBudgetItem(
  config: MosquiterosConfig,
  subtotal: number,
): BudgetItem {
  return createBudgetItem({
    modulo: "mosquiteros",

    titulo: "Mosquitero",

    descripcion: buildMosquiterosDescription(config),

    configuracion: {
      ...config,
    },

    metadata: {
      color: config.color,
    },

    result: {
      subtotal,
    },
  });
}
