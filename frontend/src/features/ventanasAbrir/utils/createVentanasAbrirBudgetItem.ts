import type { VentanasAbrirConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

import { buildVentanasAbrirDescription } from "./buildVentanasAbrirDescription";

type CotizacionVentanasAbrirResponse = {
  descripcion?: string;

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
    modulo: "ventanas_abrir",

    titulo: `${config.linea} Ventana de Abrir`,

    descripcion: result.descripcion || buildVentanasAbrirDescription(config),

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
