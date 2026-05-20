import type { PanoFijoConfig, PanoFijoItem } from "../types";

import { buildPanoFijoDescription } from "./buildPanoFijoDescription";

type CotizacionResult = {
  descripcion: string;

  precioVenta: number;
};

export function createPanoFijoBudgetItem(
  config: PanoFijoConfig,
  result: CotizacionResult,
): PanoFijoItem {
  return {
    tipo: "pano_fijo",

    cantidad: 1,

    medidas: {
      ancho: config.ancho,

      alto: config.alto,
    },

    description: result.descripcion || buildPanoFijoDescription(config),

    color: config.color,

    configuracion: {
      linea: config.linea,

      tipoVidrio: config.tipoVidrio,
    },

    subtotal: Number(result.precioVenta || 0),
  };
}
