import type { PanoFijoConfig, PanoFijoItem } from "../types";

import { buildPanoFijoDescription } from "./buildPanoFijoDescription";

type CotizacionResult = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  precio?: number;
};

export function createPanoFijoBudgetItem(
  config: PanoFijoConfig,
  result: CotizacionResult,
): PanoFijoItem {
  console.log("RESULT PANO FIJO:", result);

  const subtotal = Number(
    result?.precioVenta || result?.precioFinal || result?.precio || 0,
  );

  console.log("SUBTOTAL PANO FIJO:", subtotal);

  return {
    tipo: "pano_fijo",

    cantidad: 1,

    medidas: {
      ancho: config.ancho,

      alto: config.alto,
    },

    description: result?.descripcion || buildPanoFijoDescription(config),

    color: config.color,

    configuracion: {
      linea: config.linea,

      tipoVidrio: config.tipoVidrio,
    },

    subtotal,
  };
}
