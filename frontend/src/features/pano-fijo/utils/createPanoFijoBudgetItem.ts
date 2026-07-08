import type { PanoFijoConfig } from "../types";
import { buildPanoFijoDescription } from "./buildPanoFijoDescription";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type CotizacionResult = {
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

    descripcion: buildPanoFijoDescription(config),

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
