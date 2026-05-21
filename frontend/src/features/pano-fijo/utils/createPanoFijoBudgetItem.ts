import type { PanoFijoConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

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
  const precioUnitario = Number(
    result?.precioFinal ??
      result?.precioVenta ??
      result?.precio ??
      result?.subtotal ??
      0,
  );

  return {
    id: crypto.randomUUID(),

    modulo: "pano-fijo",

    titulo: "Paño fijo",

    descripcion: result?.descripcion || buildPanoFijoDescription(config),

    cantidad: 1,

    precioUnitario,

    subtotal: precioUnitario,

    groupKey: [
      "pano-fijo",
      config.linea,
      config.ancho,
      config.alto,
      config.color,
      config.tipoVidrio,
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
