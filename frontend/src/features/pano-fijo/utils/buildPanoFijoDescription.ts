import type { PanoFijoConfig } from "../types";

export function buildPanoFijoDescription(config: PanoFijoConfig) {
  return `
    Paño fijo
    ${config.linea}
    ${config.ancho}x${config.alto}
    ${config.color}
    vidrio ${config.tipoVidrio}
  `
    .replace(/\s+/g, " ")
    .trim();
}
