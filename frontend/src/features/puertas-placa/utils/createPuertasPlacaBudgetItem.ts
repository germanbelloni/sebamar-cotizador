import type { PuertasPlacaConfig } from "../types";
import { buildPuertasPlacaDescription } from "./buildPuertasPlacaDescription";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type Result = {
  precioVenta?: number;
  precioFinal?: number;
  subtotal?: number;
};

export function createPuertasPlacaBudgetItem(
  config: PuertasPlacaConfig,
  result?: Result,
): BudgetItem {
  return createBudgetItem({
    modulo: "puertas-placa",

    titulo: "Puerta placa",

    descripcion: buildPuertasPlacaDescription(config),

    configuracion: {
      ...config,
    },

    metadata: {},

    result: result || {},
  });
}
