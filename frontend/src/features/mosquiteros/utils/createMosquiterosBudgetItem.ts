import type { MosquiterosConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { buildMosquiterosDescription } from "./buildMosquiterosDescription";

export function createMosquiterosBudgetItem(
  config: MosquiterosConfig,
  subtotal: number,
): BudgetItem {
  return {
    id: crypto.randomUUID(),

    modulo: "mosquiteros",

    titulo: "Mosquitero",

    descripcion: buildMosquiterosDescription(config),

    cantidad: 1,

    precioUnitario: subtotal,

    subtotal,

    groupKey: [
      "mosquiteros",
      config.tipo,
      config.ancho,
      config.alto,
      config.color,
    ].join("-"),

    configuracion: {
      ...config,
    },

    metadata: {
      color: config.color,
    },
  };
}
