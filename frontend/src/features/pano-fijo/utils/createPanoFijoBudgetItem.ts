import type { PanoFijoConfig, PanoFijoItem } from "../types";

import { buildPanoFijoDescription } from "./buildPanoFijoDescription";

export function createPanoFijoBudgetItem(config: PanoFijoConfig): PanoFijoItem {
  return {
    tipo: "pano_fijo",

    cantidad: 1,

    medidas: {
      ancho: config.ancho,

      alto: config.alto,
    },

    description: buildPanoFijoDescription(config),

    color: config.color,

    configuracion: {
      linea: config.linea,

      tipoVidrio: config.tipoVidrio,
    },

    subtotal: 0,
  };
}
