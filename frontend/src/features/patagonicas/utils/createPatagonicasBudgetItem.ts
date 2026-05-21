import type { PatagonicasConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

type Result = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  subtotal?: number;
};

export function createPatagonicasBudgetItem(
  config: PatagonicasConfig,
  result: Result,
): BudgetItem {
  const precioUnitario = Number(
    result.precioFinal ?? result.precioVenta ?? result.subtotal ?? 0,
  );

  return {
    id: crypto.randomUUID(),

    modulo: "patagonicas",

    titulo: "Ventana patagónica",

    descripcion:
      result.descripcion ?? `${config.tipo} ${config.ancho}x${config.alto}`,

    cantidad: 1,

    precioUnitario,

    subtotal: precioUnitario,

    groupKey: [
      "patagonicas",
      config.linea,
      config.tipo,
      config.ancho,
      config.alto,
      config.color,
    ].join("-"),

    configuracion: {
      ...config,
    },

    metadata: {
      linea: config.linea,

      color: config.color,

      vidrio: config.tipoVidrio,
    },
  };
}
