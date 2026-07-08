import type { PanoFijoConfig } from "../types";

export function buildPanoFijoDescription(config: PanoFijoConfig) {
  return `
    Paño fijo
    ${config.ancho}x${config.alto}
    aluminio
    ${config.color}
    ${config.linea}
    vidrio ${config.tipoVidrio}
    
  `
    .replace(/\s+/g, " ")
    .trim();
}
