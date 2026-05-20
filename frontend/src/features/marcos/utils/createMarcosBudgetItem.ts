import type { MarcosConfig, MarcosItem } from "../types";

type Result = {
  descripcion?: string;

  precioVenta?: number;

  precioFinal?: number;

  precio?: number;
};

export function createMarcosBudgetItem(
  config: MarcosConfig,

  result?: Result,
): MarcosItem {
  console.log("RESULT MARCOS:", result);

  const subtotal = Number(
    result?.precioVenta || result?.precioFinal || result?.precio || 0,
  );

  console.log("SUBTOTAL MARCOS:", subtotal);

  return {
    tipo: "marcos",

    cantidad: 1,

    description:
      result?.descripcion || `${config.tipo} ${config.ancho}x${config.alto}`,

    subtotal,

    configuracion: {
      tipo: config.tipo,

      ancho: config.ancho,

      alto: config.alto,

      color: config.color,
    },
  };
}
