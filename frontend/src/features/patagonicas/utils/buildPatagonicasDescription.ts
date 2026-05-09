import type { PatagonicasConfig } from "../types";

export function buildPatagonicasDescription(config: PatagonicasConfig) {
  return `
    Patagónica
    ${config.linea}
    ${config.tipo}
    ${config.ancho}x${config.alto}
    ${config.color}
    vidrio ${config.tipoVidrio}
    ${config.cantidadRajas} rajas
    apertura ${config.tipoApertura}
    lado ${config.ladoApertura}
  `
    .replace(/\s+/g, " ")
    .trim();
}
