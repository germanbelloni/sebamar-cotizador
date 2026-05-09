import type { PuertasPlacaConfig } from "../types";

export function buildPuertasPlacaDescription(config: PuertasPlacaConfig) {
  return `
    Puerta placa
    ${config.tipo}
    ${config.modelo}
    ${config.ancho}x${config.alto}
    ${config.marco ? `marco ${config.marco}` : ""}
    mano ${config.mano}
  `
    .replace(/\s+/g, " ")
    .trim();
}
