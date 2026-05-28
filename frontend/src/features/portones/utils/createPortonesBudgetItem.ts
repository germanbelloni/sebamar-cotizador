import type { PortonesConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

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
  return createBudgetItem({
    modulo: "portones",

    titulo: "Portón",

    descripcion: result?.descripcion || buildPortonesDescription(config),

    configuracion: {
      ...config,
    },

    metadata: {
      linea: config.linea,

      color: config.color,

      vidrio: config.tipoVidrio,
    },

    result: result || {},
  });
}
