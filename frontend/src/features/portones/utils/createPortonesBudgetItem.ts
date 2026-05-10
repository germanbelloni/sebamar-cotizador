import type { PortonesConfig, PortonesItem } from "../types";

import { buildPortonesDescription } from "./buildPortonesDescription";

type Result = {
  descripcion?: string;

  precioVenta?: number;
};

export function createPortonesBudgetItem(
  config: PortonesConfig,

  result?: Result,
): PortonesItem {
  return {
    tipo: "portones",

    cantidad: 1,

    linea: config.linea,

    medidas: {
      ancho: config.ancho,

      alto: config.alto,
    },

    description: result?.descripcion || buildPortonesDescription(config),

    color: config.color,

    configuracion: {
      sistema: config.sistema,

      hojas: config.hojas,

      tipoVidrio: config.tipoVidrio,

      automatizado: config.automatizado,

      guiaInferior: config.guiaInferior,
    },

    subtotal: result?.precioVenta || 0,
  };
}
