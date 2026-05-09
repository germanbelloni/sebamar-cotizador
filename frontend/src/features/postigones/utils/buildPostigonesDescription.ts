import type { PostigonesConfig } from "../types";

export function buildPostigonesDescription(config: PostigonesConfig) {
  return `
    Postigón
    ${config.tipo}
    ${config.ancho}x${config.alto}
    ${config.color}
    ${config.microperforado ? "microperforado" : ""}
    ${config.herrajeBlanco ? "herraje blanco" : ""}
  `
    .replace(/\s+/g, " ")
    .trim();
}
