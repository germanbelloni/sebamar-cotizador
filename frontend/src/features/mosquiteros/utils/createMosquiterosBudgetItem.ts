import type { MosquiterosConfig } from "../types";
import { buildMosquiterosDescription } from "./buildMosquiterosDescription";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

export function createMosquiterosBudgetItem(
  config: MosquiterosConfig,
  result: Record<string, unknown>,
): BudgetItem {
  const configuracion = {
    ancho: config.ancho,
    alto: config.alto,
    tipo: config.tipo,
    color: config.color,

    ...(config.tipo === "puerta_mosquitera" && {
      ladoBisagra: config.ladoBisagra,
    }),

    ...(typeof result.configuracion === "object" &&
    result.configuracion !== null
      ? result.configuracion
      : {}),
  };

  return createBudgetItem({
    modulo: "mosquiteros",

    titulo:
      config.tipo === "puerta_mosquitera" ? "Puerta Mosquitera" : "Mosquitero",

    descripcion: buildMosquiterosDescription(config),

    configuracion,

    metadata: {
      color: config.color,
    },

    result,
  });
}
