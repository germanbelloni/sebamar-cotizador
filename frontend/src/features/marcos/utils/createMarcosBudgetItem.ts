import type { MarcosConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

type Result = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  precio?: number;

  subtotal?: number;
};

export function createMarcosBudgetItem(
  config: MarcosConfig,

  result?: Result,
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

    modulo: "marcos",

    titulo: config.tipo === "premarco" ? "Premarco" : "Contramarco",

    descripcion:
      result?.descripcion || `${config.tipo} ${config.ancho}x${config.alto}`,

    cantidad: 1,

    precioUnitario,

    subtotal: precioUnitario,

    groupKey: [
      "marcos",
      config.tipo,
      config.ancho,
      config.alto,
      config.color,
    ].join("-"),

    configuracion: {
      ...config,
    },

    metadata: {
      color: config.color,
    },
  };
}
