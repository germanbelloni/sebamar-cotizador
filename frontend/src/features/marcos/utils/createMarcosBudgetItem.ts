import type { MarcosConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type Result = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  precio?: number;

  subtotal?: number;
};

export function createMarcosBudgetItem(
  config: MarcosConfig,
  result?: Result,
): BudgetItem {
  return createBudgetItem({
    modulo: "marcos",

    titulo: config.tipo === "premarco" ? "Premarco" : "Contramarco",

    descripcion:
      result?.descripcion || `${config.tipo} ${config.ancho}x${config.alto}`,

    configuracion: {
      ...config,
    },

    metadata: {
      color: config.color,
    },

    result: result || {},
  });
}
