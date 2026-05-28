import type { PuertasPlacaConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

import { buildPuertasPlacaDescription } from "./buildPuertasPlacaDescription";

type Result = {
  descripcion?: string;

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

    descripcion: result?.descripcion || buildPuertasPlacaDescription(config),

    configuracion: {
      ...config,
    },

    metadata: {},

    result: result || {},
  });
}
