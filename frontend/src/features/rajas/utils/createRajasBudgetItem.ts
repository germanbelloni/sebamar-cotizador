import type { RajasConfig } from "../types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { buildRajasDescription } from "./buildRajasDescription";

type CotizacionRajasResponse = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  subtotal?: number;
};

export function createRajasBudgetItem(
  config: RajasConfig,
  result: CotizacionRajasResponse,
): BudgetItem {
  const precioUnitario = Number(
    result.precioVenta ?? result.precioFinal ?? result.subtotal ?? 0,
  );

  return {
    id: crypto.randomUUID(),

    modulo: "rajas",

    titulo: `${config.linea} ${config.modelo}`,

    descripcion: buildRajasDescription(config),

    cantidad: 1,

    precioUnitario,

    subtotal: precioUnitario,

    groupKey: [
      "rajas",
      config.linea,
      config.ancho,
      config.alto,
      config.color,
      config.tipoVidrio,
      config.mosquitero,
      config.modelo,
      config.desague,
      config.bisagra,
      config.premarco,
      config.contramarco,
      config.herrajesBlancos,
      config.posicionOscilo,
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
