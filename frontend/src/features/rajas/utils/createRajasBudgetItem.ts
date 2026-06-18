import type { RajasConfig } from "../types";
import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";
import { buildRajasDescription } from "./buildRajasDescription";

type CotizacionRajasResponse = {
  descripcion?: string;
  precioVenta?: number;
  precioFinal?: number;
  subtotal?: number;
  configuracion?: Record<string, unknown>;
};

export function createRajasBudgetItem(
  config: RajasConfig,
  result: CotizacionRajasResponse,
): BudgetItem {
  return createBudgetItem({
    modulo: "rajas",

    titulo: `${config.linea} ${config.modelo}`,

    descripcion: result.descripcion || buildRajasDescription(config),

    configuracion: {
      ...config,
      ...(result.configuracion ?? {}),
    },

    metadata: {
      linea: config.linea,
      color: config.color,
      vidrio: config.tipoVidrio,
    },

    result,
  });
}
