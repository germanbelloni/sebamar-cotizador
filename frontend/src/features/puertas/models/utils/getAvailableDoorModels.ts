import { DOOR_MODEL_REGISTRY } from "../registry";

import type { PuertaLinea } from "../../types";

export function getAvailableDoorModels(linea: PuertaLinea) {
  return Object.values(DOOR_MODEL_REGISTRY).filter((model) =>
    model.availableIn.includes(linea),
  );
}
