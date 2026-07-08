import type { VentanasAbrirConfig } from "../types";
import { buildVentanasAbrirDescription } from "./buildVentanasAbrirDescription";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type CotizacionVentanasAbrirResponse = {
  precioVenta?: number;
  precioFinal?: number;
  subtotal?: number;
  configuracion?: Record<string, unknown>;
};

export function createVentanasAbrirBudgetItem(
  config: VentanasAbrirConfig,
  result: CotizacionVentanasAbrirResponse,
): BudgetItem {
  return createBudgetItem({
    modulo: "ventanas-abrir",

    titulo: `${config.linea} Ventana de Abrir`,

    descripcion: buildVentanasAbrirDescription(config),

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
