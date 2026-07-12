import type { CortinaConfig } from "../types";

export function buildCortinaDescription(config: CortinaConfig) {
  if (config.tipo === "cajon_block") {
    return `
      Cajon Block
      ${config.material.toUpperCase()}
      ${config.ancho}x${config.alto}
    `
      .replace(/\s+/g, " ")
      .trim();
  }

  if (config.material === "pvc") {
    return `
      Cortina PVC
      ${config.construccion}
      ${config.ancho}x${config.alto}
      ${config.calidad}
    `
      .replace(/\s+/g, " ")
      .trim();
  }

  return `
    Cortina Aluminio
    ${config.construccion}
    ${config.ancho}x${config.alto}
    ${config.color}
  `
    .replace(/\s+/g, " ")
    .trim();
}
