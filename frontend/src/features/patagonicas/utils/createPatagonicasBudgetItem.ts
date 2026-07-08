import type { PatagonicasConfig } from "../types";
import { buildPatagonicasDescription } from "./buildPatagonicasDescription";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type Result = {
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

    descripcion: buildPatagonicasDescription(config),

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
