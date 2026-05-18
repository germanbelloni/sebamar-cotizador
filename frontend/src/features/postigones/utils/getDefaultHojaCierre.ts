import type { CantidadHojasPostigon, HojaCierrePostigon } from "../types";

export function getDefaultHojaCierre(
  hojas: CantidadHojasPostigon,
): HojaCierrePostigon {
  if (hojas === 2) {
    return "derecha";
  }

  return "centro-derecha";
}
