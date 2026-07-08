import { MODELOS_PUERTAS } from "../../constants";
import type { PuertaLinea } from "../../types";

export function getAvailableDoorModels(linea: PuertaLinea) {
  return MODELOS_PUERTAS[linea];
}
