import type { RajasConfig, RajasItem } from "../types";

import { buildRajasDescription } from "./buildRajasDescription";

export function createRajasBudgetItem(config: RajasConfig): RajasItem {
  return {
    tipo: "rajas",

    cantidad: 1,

    linea: config.linea,

    medidas: {
      ancho: config.ancho,
      alto: config.alto,
    },

    description: buildRajasDescription(config),

    color: config.color,

    configuracion: {
      tipoVidrio: config.tipoVidrio,

      mosquitero: config.mosquitero,

      modelo: config.modelo,

      desague: config.desague,

      bisagra: config.bisagra,

      premarco: config.premarco,

      contramarco: config.contramarco,

      herrajesBlancos: config.herrajesBlancos,
    },

    subtotal: 0,
  };
}
