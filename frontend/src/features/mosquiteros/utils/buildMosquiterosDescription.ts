import type { MosquiterosConfig } from "../types";

export function buildMosquiterosDescription(config: MosquiterosConfig) {
  return `
    Mosquitero
    ${config.tipo}
    ${config.ancho}x${config.alto}
    ${config.color}
  `
    .replace(/\s+/g, " ")
    .trim();
}
