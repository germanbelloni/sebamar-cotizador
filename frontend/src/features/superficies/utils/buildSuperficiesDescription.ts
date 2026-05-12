import type { superficiesConfig } from "../types";

export function buildsuperficiesDescription(config: superficiesConfig) {
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
