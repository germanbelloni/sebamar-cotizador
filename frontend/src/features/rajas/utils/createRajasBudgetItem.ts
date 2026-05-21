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

    configuracion: {
      ancho: config.ancho,

      alto: config.alto,

      linea: config.linea,

      color: config.color,

      tipoVidrio: config.tipoVidrio,

      mosquitero: config.mosquitero,

      modelo: config.modelo,

      desague: config.desague,

      bisagra: config.bisagra,

      premarco: config.premarco,

      contramarco: config.contramarco,

      herrajesBlancos: config.herrajesBlancos,

      ...(config.linea === "Modena" && config.modelo === "oscilobatiente"
        ? {
            posicionOscilo: config.posicionOscilo,
          }
        : {}),
    },

    metadata: {
      linea: config.linea,

      color: config.color,

      vidrio: config.tipoVidrio,
    },
  };
}
