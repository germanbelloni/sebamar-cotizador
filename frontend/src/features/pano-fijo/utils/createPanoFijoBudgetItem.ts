import type { PanoFijoConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

import { buildPanoFijoDescription } from "./buildPanoFijoDescription";

type CotizacionResult = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  precio?: number;

  subtotal?: number;
};

export function createPanoFijoBudgetItem(
  config: PanoFijoConfig,
  result: CotizacionResult,
): BudgetItem {
  return createBudgetItem({
    modulo: "pano-fijo",

    titulo: "Paño fijo",

    descripcion: result?.descripcion || buildPanoFijoDescription(config),

    configuracion: {
      ...config,
    },

    metadata: {
      linea: config.linea,

      color: config.color,

      vidrio: config.tipoVidrio,
    },

    result,
  });
}
