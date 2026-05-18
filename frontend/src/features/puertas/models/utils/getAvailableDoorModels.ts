import { MODELOS_PUERTAS_CONFIG } from "../registry";

import type { PuertaLinea } from "../../types";

export function getAvailableDoorModels(_linea: PuertaLinea) {
  return Object.keys(MODELOS_PUERTAS_CONFIG);
}
