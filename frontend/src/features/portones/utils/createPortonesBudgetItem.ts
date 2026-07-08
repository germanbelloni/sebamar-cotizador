import type { PortonesConfig } from "../types";
import { buildPortonesDescription } from "./buildPortonesDescription";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type Result = {
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

    descripcion: buildPortonesDescription(config),

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
