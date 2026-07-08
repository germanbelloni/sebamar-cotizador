import type { PostigonesConfig, PostigonesResponse } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";
import { buildPostigonesDescription } from "./buildPostigonesDescription";

export function createPostigonesBudgetItem(
  config: PostigonesConfig,
  result: PostigonesResponse,
): BudgetItem {
  return createBudgetItem({
    modulo: "postigones",

    titulo:
      config.tipo === "abrir" ? "Postigón de abrir" : "Postigón corredizo",

    descripcion: buildPostigonesDescription(config),

    configuracion: {
      ...config,
      ...(result.configuracion && typeof result.configuracion === "object"
        ? result.configuracion
        : {}),
    },

    metadata: {
      color: config.color,
    },

    result,
  });
}
