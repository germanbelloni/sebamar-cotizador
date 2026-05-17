import type { MarcosConfig, MarcosItem } from "../types";

type Result = {
  descripcion: string;

  precioVenta: number;
};

export function createMarcosBudgetItem(
  config: MarcosConfig,

  result?: Result,
): MarcosItem {
  return {
    tipo: "marcos",

    cantidad: 1,

    description:
      result?.descripcion || `${config.tipo} ${config.ancho}x${config.alto}`,

    subtotal: Number(result?.precioVenta || 0),

    configuracion: {
      tipo: config.tipo,

      ancho: config.ancho,

      alto: config.alto,

      color: config.color,
    },
  };
}
