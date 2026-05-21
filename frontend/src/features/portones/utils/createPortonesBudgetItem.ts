import type { PortonesConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { buildPortonesDescription } from "./buildPortonesDescription";

type Result = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  subtotal?: number;
};

export function createPortonesBudgetItem(
  config: PortonesConfig,

  result?: Result,
): BudgetItem {
  const precioUnitario = Number(
    result?.precioFinal ?? result?.precioVenta ?? result?.subtotal ?? 0,
  );

  return {
    id: crypto.randomUUID(),

    modulo: "portones",

    titulo: "Portón",

    descripcion: result?.descripcion || buildPortonesDescription(config),

    cantidad: 1,

    precioUnitario,

    subtotal: precioUnitario,

    groupKey: [
      "portones",
      config.linea,
      config.sistema,
      config.ancho,
      config.alto,
      config.color,
      config.tipoVidrio,
      config.automatizado,
      config.guiaInferior,
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
