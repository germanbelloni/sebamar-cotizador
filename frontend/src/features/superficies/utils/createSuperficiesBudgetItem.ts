import type { SuperficiesConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { buildSuperficiesDescription } from "./buildSuperficiesDescription";

type Result = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  subtotal?: number;
};

export function createSuperficiesBudgetItem(
  config: SuperficiesConfig,

  result?: Result,
): BudgetItem {
  const precioUnitario = Number(
    result?.precioFinal ?? result?.precioVenta ?? result?.subtotal ?? 0,
  );

  return {
    id: crypto.randomUUID(),

    modulo: "superficies",

    titulo: "Superficie",

    descripcion: result?.descripcion || buildSuperficiesDescription(config),

    cantidad: 1,

    precioUnitario,

    subtotal: precioUnitario,

    groupKey: [
      "superficies",
      config.tipo,
      config.linea,
      config.ancho,
      config.alto,
      config.tipoVidrio,
    ].join("-"),

    configuracion: {
      ...config,
    },

    metadata: {
      linea: config.linea,

      vidrio: config.tipoVidrio,
    },
  };
}
