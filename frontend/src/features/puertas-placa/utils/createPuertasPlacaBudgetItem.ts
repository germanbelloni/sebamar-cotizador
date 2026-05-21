import type { PuertasPlacaConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { buildPuertasPlacaDescription } from "./buildPuertasPlacaDescription";

type Result = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  subtotal?: number;
};

export function createPuertasPlacaBudgetItem(
  config: PuertasPlacaConfig,

  result?: Result,
): BudgetItem {
  const precioUnitario = Number(
    result?.precioFinal ?? result?.precioVenta ?? result?.subtotal ?? 0,
  );

  return {
    id: crypto.randomUUID(),

    modulo: "puertas-placa",

    titulo: "Puerta placa",

    descripcion: result?.descripcion || buildPuertasPlacaDescription(config),

    cantidad: 1,

    precioUnitario,

    subtotal: precioUnitario,

    groupKey: [
      "puertas-placa",
      config.tipo,
      config.modelo,
      config.marco,
      config.mano,
      config.ancho,
      config.alto,
      config.fueraDeMedida,
    ].join("-"),

    configuracion: {
      ...config,
    },

    metadata: {},
  };
}
