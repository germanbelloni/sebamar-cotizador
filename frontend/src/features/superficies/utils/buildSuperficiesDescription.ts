// buildSuperficiesDescription.ts

import type { SuperficiesConfig } from "../types";

export function buildSuperficiesDescription(config: SuperficiesConfig) {
  return `
    ${config.tipo}
    ${config.linea || ""}
    ${config.ancho}x${config.alto}
    ${config.color}
    ${config.tipoVidrio ? `vidrio ${config.tipoVidrio}` : ""}
  `
    .replace(/\s+/g, " ")
    .trim();
}
