import type { PuertasConfig } from "../models/types";

export function necesitaDobleTravesano(config: PuertasConfig) {
  if (config.tipoConfiguracion !== "porton") {
    return false;
  }

  if (config.hojas >= 4) {
    return true;
  }

  return ["modelo_4", "modelo_4_vr", "modelo_5"].includes(config.modelo);
}

export function necesitaBisagrasExtra(config: PuertasConfig) {
  return config.tipoConfiguracion === "porton" && config.hojas >= 4;
}
