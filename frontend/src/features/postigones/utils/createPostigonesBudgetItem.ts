import type { PostigonesConfig, PostigonesResponse } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { buildPostigonesDescription } from "./buildPostigonesDescription";

export function createPostigonesBudgetItem(
  config: PostigonesConfig,

  result: PostigonesResponse,
): BudgetItem {
  const precioUnitario = Number(result.precioFinal ?? result.precioVenta ?? 0);

  return {
    id: crypto.randomUUID(),

    modulo: "postigones",

    titulo:
      config.tipo === "abrir" ? "Postigón de abrir" : "Postigón corredizo",

    descripcion: result.descripcion || buildPostigonesDescription(config),

    cantidad: 1,

    precioUnitario,

    subtotal: precioUnitario,

    groupKey: [
      "postigones",
      config.tipo,
      config.ancho,
      config.alto,
      config.color,
      config.cantidadHojas,
      config.hojaCierre,
      config.microperforado,
      config.herrajeBlanco,
      config.marco,
    ].join("-"),

    configuracion: {
      ...config,
    },

    metadata: {
      color: config.color,
    },
  };
}
