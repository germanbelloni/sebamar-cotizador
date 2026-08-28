import type { PuertasConfig } from "../types";
import { buildPuertasDescription } from "./buildPuertasDescription";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { createBudgetItem } from "@/shared/budget/utils/createBudgetItem";

type CotizacionResponse = {
  precioVenta?: number;
  precioFinal?: number;
  subtotal?: number;
};

export function createPuertasBudgetItem(
  config: PuertasConfig,
  result: CotizacionResponse,
): BudgetItem {
  return createBudgetItem({
    modulo: "puertas",
    titulo: buildTitle(config),
    descripcion: buildPuertasDescription(config),
    configuracion: {
      ...config,
    },
    metadata: {
      linea: config.linea,
      color: config.color,
      vidrio: config.vidrio,
      vidrioMedia: config.vidrioMedia,
    },
    result,
  });
}

function buildTitle(config: PuertasConfig) {
  switch (config.tipoConfiguracion) {
    case "simple":
      return "Puerta simple";

    case "doble":
      return "Puerta doble";

    case "puerta_y_media":
      return "Puerta y media";

    case "porton":
      return "Portón";

    default:
      return "Puerta";
  }
}
