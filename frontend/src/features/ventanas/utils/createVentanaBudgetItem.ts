import { buildVentanaItem } from "./buildVentanaItem";

import type { VentanaConfig, VentanaItem } from "../types";

type CotizacionResponse = {
  descripcion: string;

  precioVenta: number;
};

export function createVentanaBudgetItem(
  config: VentanaConfig,
  result: CotizacionResponse,
): VentanaItem {
  const item = buildVentanaItem(config);

  item.subtotal = result.precioVenta;

  return item;
}
