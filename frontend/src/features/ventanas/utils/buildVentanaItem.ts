import type { VentanaConfig, VentanaItem } from "../types";

import { buildVentanaDescription } from "./buildVentanaDescription";

export function buildVentanaItem(config: VentanaConfig): VentanaItem {
  const description = buildVentanaDescription(config);

  return {
    tipo: "ventana",

    cantidad: 1,

    linea: config.linea,

    medidas: {
      ancho: config.ancho,
      alto: config.alto,
    },

    description,

    color: config.color,

    extras: {
      mosquitero: config.mosquitero,

      guia: config.guia,

      cajonBlock: config.cajonBlock,

      cortinaPVC: config.cortinaPVC,

      cortinaAluminio: config.cortinaAluminio,

      premarco: config.premarco,

      contramarco: config.contramarco,
    },

    subtotal: 0,
  };
}
