import { buildVentanaItem } from "./buildVentanaItem";

import type { VentanaConfig, VentanaItem } from "../types";

type CotizacionResponse = {
  descripcion: string;

  precioVenta: number;

  precioFinal?: number;
};

export function createVentanaBudgetItem(
  config: VentanaConfig,
  result: CotizacionResponse,
): VentanaItem {
  const item = buildVentanaItem(config);

  return {
    ...item,

    cantidad: 1,

    subtotal: Number(result.precioFinal) || Number(result.precioVenta) || 0,
  };
}
