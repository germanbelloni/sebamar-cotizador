import type { MarcosConfig } from "../types";
import { buildMarcosDescription } from "./buildMarcosDescription";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type Result = {
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

    descripcion: buildMarcosDescription(config),

    configuracion: {
      ...config,
    },

    metadata: {
      color: config.color,
    },

    result: result || {},
  });
}
